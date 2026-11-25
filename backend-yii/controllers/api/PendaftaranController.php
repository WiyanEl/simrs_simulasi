<?php

namespace app\controllers\api;

use Yii;
use Throwable;
use yii\db\Query;
use yii\db\Expression;
use yii\web\NotFoundHttpException;

use app\models\Pendaftaran;
use app\models\Antrean;
use app\models\Pasien;
use app\models\Ruangan;
use app\models\Dokter;
use app\models\JadwalDokter;
use app\models\RiwayatKunjungan;
use app\controllers\components\ApiResponse;

class PendaftaranController extends BaseController
{
    public function actionIndex()
    {
        $this->checkPermission('pendaftaran.view');

        $request = Yii::$app->request;

        $tanggalMulai = $request->get('tanggal_mulai');
        $tanggalSelesai = $request->get('tanggal_selesai');

        if (!$tanggalMulai || !$tanggalSelesai) {
            return ApiResponse::error(
                'Tanggal mulai dan tanggal selesai wajib diisi.',
                422
            );
        }

        if (
            !$this->isValidDate($tanggalMulai) ||
            !$this->isValidDate($tanggalSelesai)
        ) {
            return ApiResponse::error(
                'Format tanggal tidak valid.',
                422
            );
        }

        if ($tanggalMulai > $tanggalSelesai) {
            return ApiResponse::error(
                'Tanggal mulai tidak boleh lebih besar dari tanggal selesai.',
                422
            );
        }

        $query = Pendaftaran::find()
            ->alias('p')
            ->joinWith([
                'pasien pasien',
                'ruangan ruangan',
                'dokter dokter',
                'antrean antrean',
            ])
            ->orderBy(['p.created_at' => SORT_DESC]);

        $search = $request->get('search');

        if ($search) {
            $query->andWhere([
                'or',
                ['ilike', 'p.no_registrasi', $search],
                ['ilike', 'pasien.no_rm', $search],
                ['ilike', 'pasien.nik', $search],
                ['ilike', 'pasien.nama', $search],
            ]);
        }

        if ($request->get('tanggal')) {
            $query->andWhere([
                'p.tanggal_kunjungan' => $request->get('tanggal')
            ]);
        }

        if ($request->get('tanggal_mulai')) {
            $query->andWhere([
                '>=',
                'p.tanggal_kunjungan',
                $request->get('tanggal_mulai')
            ]);
        }

        if ($request->get('tanggal_selesai')) {
            $query->andWhere([
                '<=',
                'p.tanggal_kunjungan',
                $request->get('tanggal_selesai')
            ]);
        }

        if ($request->get('ruangan_id')) {
            $query->andWhere([
                'p.ruangan_id' => $request->get('ruangan_id')
            ]);
        }

        if ($request->get('dokter_id')) {
            $query->andWhere([
                'p.dokter_id' => $request->get('dokter_id')
            ]);
        }

        if ($request->get('status')) {
            $query->andWhere([
                'p.status' => $request->get('status')
            ]);
        }

        $limit = (int) $request->get('limit', 10);

        $data = $query
            ->asArray()
            ->limit($limit)
            ->all();

        return ApiResponse::success(
            'Data pendaftaran berhasil diambil.',
            $data
        );
    }

    public function actionCreate()
    {
        $this->checkPermission('pendaftaran.create');

        $request = Yii::$app->request;
        $body = $request->bodyParams;

        $required = [
            'pasien_id',
            'ruangan_id',
            'dokter_id',
            'jadwal_dokter_id',
            'tanggal_kunjungan',
            'jenis_kunjungan',
            'jenis_pembayaran',
        ];

        foreach ($required as $field) {
            if (!isset($body[$field]) || $body[$field] === '') {
                return ApiResponse::error(
                    "Field {$field} wajib diisi.",
                    422
                );
            }
        }

        $transaction = Yii::$app->db->beginTransaction();

        try {
            $tanggal = $body['tanggal_kunjungan'];

            if (!$this->isValidDate($tanggal)) {
                $transaction->rollBack();

                return ApiResponse::error(
                    'Format tanggal kunjungan tidak valid.',
                    422
                );
            }

            $pasien = Pasien::findOne($body['pasien_id']);

            if (!$pasien) {
                throw new \DomainException('Pasien tidak ditemukan.');
            }

            $this->lockPasien($pasien->id);

            $this->validateDuplikasiPendaftaran(
                $pasien->id,
                $tanggal
            );

            $ruangan = Ruangan::findOne([
                'id' => $body['ruangan_id'],
                'is_active' => true,
            ]);

            if (!$ruangan) {
                throw new \DomainException(
                    'Ruangan tidak ditemukan atau tidak aktif.'
                );
            }

            $jadwal = $this->validateJadwal(
                $body['jadwal_dokter_id'],
                $body['dokter_id'],
                $body['ruangan_id'],
                $tanggal
            );

            $this->lockRuangan([$ruangan->id]);

            $this->validateKuota($jadwal->id, $tanggal);

            $noRegistrasi = $this->generateNoRegistrasi($tanggal);

            $model = new Pendaftaran();

            $model->no_registrasi = $noRegistrasi;
            $model->pasien_id = $pasien->id;
            $model->ruangan_id = $ruangan->id;
            $model->dokter_id = $jadwal->dokter_id;
            $model->jadwal_dokter_id = $jadwal->id;
            $model->tanggal_kunjungan = $tanggal;
            $model->jenis_kunjungan = $body['jenis_kunjungan'];
            $model->jenis_pembayaran = $body['jenis_pembayaran'];
            $model->keluhan = $body['keluhan'] ?? null;
            $model->status = 'TERDAFTAR';
            $model->created_by = Yii::$app->user->id;

            if (!$model->save()) {
                throw new \DomainException(
                    implode(', ', $model->getFirstErrors())
                );
            }

            $nomorAntrean = $this->generateNomorAntrean(
                $tanggal,
                $ruangan->id
            );

            $antrean = new Antrean();

            $antrean->pendaftaran_id = $model->id;
            $antrean->tanggal = $tanggal;
            $antrean->ruangan_id = $ruangan->id;
            $antrean->nomor_antrean = $nomorAntrean;
            $antrean->kode_antrean = $this->generateKodeAntrean(
                $ruangan,
                $nomorAntrean
            );
            $antrean->status = 'MENUNGGU';

            if (!$antrean->save()) {
                throw new \DomainException(
                    implode(', ', $antrean->getFirstErrors())
                );
            }

            $this->saveRiwayat(
                $model,
                'PENDAFTARAN',
                null,
                'TERDAFTAR',
                'Pendaftaran pasien berhasil dibuat.'
            );

            $transaction->commit();

            Yii::$app->response->statusCode = 201;
            return ApiResponse::success(
                'Pendaftaran pasien berhasil disimpan.',
                [
                    'id' => $model->id,
                    'no_registrasi' => $model->no_registrasi,
                    'pasien_id' => $model->pasien_id,
                    'ruangan_id' => $model->ruangan_id,
                    'dokter_id' => $model->dokter_id,
                    'jadwal_dokter_id' => $model->jadwal_dokter_id,
                    'tanggal_kunjungan' => $model->tanggal_kunjungan,
                    'status' => $model->status,
                ]
            );

        } catch (Throwable $e) {
            $transaction->rollBack();

            if ($e instanceof \DomainException) {
                return ApiResponse::error($e->getMessage(), 422);
            }

            Yii::error($e->getMessage(), __METHOD__);

            return ApiResponse::error(
                'Terjadi kesalahan saat menyimpan pendaftaran. : ' . $e->getMessage() . ' - ' . $e->getLine(),
                500
            );
        }
    }

    public function actionView($id)
    {
        $this->checkPermission('pendaftaran.view');

        $data = Pendaftaran::find()
            ->with([
                'pasien',
                'ruangan',
                'dokter',
                'jadwalDokter',
                'antrean'])
            ->where(['id' => $id])
            ->asArray()
            ->one();

        if (!$data) {
            return ApiResponse::error(
                'Data pendaftaran tidak ditemukan.',
                404
            );
        }

        return ApiResponse::success(
            'Detail pendaftaran berhasil diambil.',
            $data
        );
    }

    public function actionUpdate($id)
    {
        $this->checkPermission('pendaftaran.update');

        $transaction = Yii::$app->db->beginTransaction();

        try {
            $model = Pendaftaran::find()
                ->where(['id' => $id])
                ->one();

            if (!$model) {
                throw new \DomainException(
                    'Data pendaftaran tidak ditemukan.'
                );
            }

            if ($model->status !== 'TERDAFTAR') {
                throw new \DomainException(
                    'Pendaftaran tidak dapat diedit karena status sudah berubah.'
                );
            }

            $antrean = Antrean::find()
                ->where(['pendaftaran_id' => $model->id])
                ->one();

            if (!$antrean || $antrean->status !== 'MENUNGGU') {
                throw new \DomainException(
                    'Pendaftaran tidak dapat diedit karena antrean sudah diproses.'
                );
            }

            $body = Yii::$app->request->bodyParams;

            $tanggal = $body['tanggal_kunjungan']
                ?? $model->tanggal_kunjungan;

            $pasienId = $body['pasien_id']
                ?? $model->pasien_id;

            $ruanganId = $body['ruangan_id']
                ?? $model->ruangan_id;

            $dokterId = $body['dokter_id']
                ?? $model->dokter_id;

            $jadwalId = $body['jadwal_dokter_id']
                ?? $model->jadwal_dokter_id;

            if (!$this->isValidDate($tanggal)) {
                throw new \DomainException(
                    'Format tanggal kunjungan tidak valid.'
                );
            }

            $pasien = Pasien::findOne($pasienId);

            if (!$pasien) {
                throw new \DomainException('Pasien tidak ditemukan.');
            }

            $ruangan = Ruangan::findOne([
                'id' => $ruanganId,
                'is_active' => true,
            ]);

            if (!$ruangan) {
                throw new \DomainException(
                    'Ruangan tidak ditemukan atau tidak aktif.'
                );
            }

            $jadwal = $this->validateJadwal(
                $jadwalId,
                $dokterId,
                $ruanganId,
                $tanggal
            );

            $this->validateKuota(
                $jadwal->id,
                $tanggal,
                $model->id
            );

            $this->lockRuangan([
                $model->ruangan_id,
                $ruanganId
            ]);

            $oldStatus = $model->status;

            $oldTanggal = $antrean->tanggal;
            $oldRuanganId = $antrean->ruangan_id;

            $antreanBerubah =
                $oldTanggal !== $tanggal ||
                (int) $oldRuanganId !== (int) $ruanganId;

            $model->pasien_id = $pasienId;
            $model->ruangan_id = $ruanganId;
            $model->dokter_id = $dokterId;
            $model->jadwal_dokter_id = $jadwalId;
            $model->tanggal_kunjungan = $tanggal;

            $model->jenis_kunjungan =
                $body['jenis_kunjungan']
                ?? $model->jenis_kunjungan;

            $model->jenis_pembayaran =
                $body['jenis_pembayaran']
                ?? $model->jenis_pembayaran;

            $model->keluhan =
                $body['keluhan']
                ?? $model->keluhan;

            $model->updated_at = new Expression('CURRENT_TIMESTAMP');

            if (!$model->save()) {
                throw new \DomainException(
                    implode(', ', $model->getFirstErrors())
                );
            }

            if ($antreanBerubah) {
                $nomorAntrean = $this->generateNomorAntrean(
                    $tanggal,
                    $ruanganId
                );

                $antrean->tanggal = $tanggal;
                $antrean->ruangan_id = $ruanganId;
                $antrean->nomor_antrean = $nomorAntrean;
                $antrean->kode_antrean = $this->generateKodeAntrean(
                    $ruangan,
                    $nomorAntrean
                );
            }

            $antrean->updated_at = new Expression('CURRENT_TIMESTAMP');

            if (!$antrean->save()) {
                throw new \DomainException(
                    implode(', ', $antrean->getFirstErrors())
                );
            }

            $this->saveRiwayat(
                $model,
                'EDIT_PENDAFTARAN',
                $oldStatus,
                $model->status,
                'Data pendaftaran diperbarui.'
            );

            $transaction->commit();

            return ApiResponse::success(
                'Pendaftaran berhasil diperbarui.',
                []
            );

        } catch (Throwable $e) {
            $transaction->rollBack();

            if ($e instanceof \DomainException) {
                return ApiResponse::error($e->getMessage(), 422);
            }

            Yii::error($e->getMessage(), __METHOD__);

            return ApiResponse::error(
                'Terjadi kesalahan saat memperbarui pendaftaran.',
                500
            );
        }
    }

    public function actionBatal($id)
    {
        $this->checkPermission('pendaftaran.update');

        $transaction = Yii::$app->db->beginTransaction();

        try {
            $model = Pendaftaran::find()
                ->where(['id' => $id])
                ->one();

            if (!$model) {
                throw new \DomainException(
                    'Data pendaftaran tidak ditemukan.'
                );
            }

            if ($model->status !== 'TERDAFTAR') {
                throw new \DomainException(
                    'Pendaftaran tidak dapat dibatalkan karena status sudah berubah.'
                );
            }

            $antrean = Antrean::find()
                ->where(['pendaftaran_id' => $model->id])
                ->one();

            if (!$antrean || $antrean->status !== 'MENUNGGU') {
                throw new \DomainException(
                    'Antrean sudah diproses dan tidak dapat dibatalkan.'
                );
            }

            $body = Yii::$app->request->bodyParams;

            $alasan = $body['alasan'] ?? null;

            if (!$alasan) {
                throw new \DomainException(
                    'Alasan pembatalan wajib diisi.'
                );
            }

            $oldStatus = $model->status;

            $model->status = 'DIBATALKAN';
            $model->updated_at = new Expression('CURRENT_TIMESTAMP');

            if (!$model->save()) {
                throw new \DomainException(
                    implode(', ', $model->getFirstErrors())
                );
            }

            $antrean->status = 'BATAL';
            $antrean->updated_at = new Expression('CURRENT_TIMESTAMP');

            if (!$antrean->save()) {
                throw new \DomainException(
                    implode(', ', $antrean->getFirstErrors())
                );
            }

            $this->saveRiwayat(
                $model,
                'BATAL_PENDAFTARAN',
                $oldStatus,
                'DIBATALKAN',
                $alasan
            );

            $transaction->commit();

            return ApiResponse::success(
                'Pendaftaran berhasil dibatalkan.',
                [
                    'id' => $model->id,
                    'no_registrasi' => $model->no_registrasi,
                    'status' => $model->status,
                    'antrean' => [
                        'kode_antrean' => $antrean->kode_antrean,
                        'status' => $antrean->status,
                    ],
                ]
            );

        } catch (Throwable $e) {
            $transaction->rollBack();

            if ($e instanceof \DomainException) {
                return ApiResponse::error($e->getMessage(), 422);
            }

            Yii::error($e->getMessage(), __METHOD__);

            return ApiResponse::error(
                'Terjadi kesalahan saat membatalkan pendaftaran.',
                500
            );
        }
    }

    private function validateJadwal(
        $jadwalId,
        $dokterId,
        $ruanganId,
        $tanggal
    ) {
        $hari = (int) date('N', strtotime($tanggal));

        $jadwal = JadwalDokter::find()
            ->where([
                'id' => $jadwalId,
                'dokter_id' => $dokterId,
                'ruangan_id' => $ruanganId,
                'hari' => $hari,
                'is_active' => true,
            ])
            ->one();

        if (!$jadwal) {
            throw new \DomainException(
                'Jadwal dokter tidak tersedia pada tanggal tersebut.'
            );
        }

        $dokter = Dokter::findOne([
            'id' => $dokterId,
        ]);

        if (!$dokter) {
            throw new \DomainException(
                'Dokter tidak ditemukan.'
            );
        }

        return $jadwal;
    }

    private function validateKuota(
        $jadwalId,
        $tanggal,
        $excludePendaftaranId = null
    ) {
        $jadwal = JadwalDokter::findOne($jadwalId);

        if (!$jadwal || !$jadwal->kuota) {
            return true;
        }

        $query = Pendaftaran::find()
            ->where([
                'jadwal_dokter_id' => $jadwalId,
                'tanggal_kunjungan' => $tanggal,
            ])
            ->andWhere(['!=', 'status', 'DIBATALKAN']);

        if ($excludePendaftaranId) {
            $query->andWhere([
                '!=',
                'id',
                $excludePendaftaranId
            ]);
        }

        $jumlah = $query->count();

        if ($jumlah >= $jadwal->kuota) {
            throw new \DomainException(
                'Kuota jadwal dokter sudah penuh.'
            );
        }

        return true;
    }

    private function lockRuangan(array $ruanganIds)
    {
        $ruanganIds = array_unique(array_map('intval', $ruanganIds));
        sort($ruanganIds);

        foreach ($ruanganIds as $id) {
            Yii::$app->db->createCommand(
                'SELECT id FROM {{%ruangan}} WHERE id = :id FOR UPDATE',
                [':id' => $id]
            )->queryOne();
        }
    }

    private function generateNoRegistrasi($tanggal)
    {
        $prefix = date('dmy', strtotime($tanggal));

        $nomor = Pendaftaran::find()
            ->where(['tanggal_kunjungan' => $tanggal])
            ->count() + 1;

        return $prefix . str_pad($nomor, 4, '0', STR_PAD_LEFT);
    }

    private function generateNomorAntrean($tanggal, $ruanganId)
    {
        $lastNumber = (new Query())
            ->from('{{%antrean}}')
            ->where([
                'tanggal' => $tanggal,
                'ruangan_id' => $ruanganId,
            ])
            ->max('nomor_antrean');

        return ((int) $lastNumber) + 1;
    }


    private function generateKodeAntrean($ruangan, $nomor)
    {
        $prefix = strtoupper(substr($ruangan->kode, 0, 1));

        return $prefix . str_pad(
            $nomor,
            3,
            '0',
            STR_PAD_LEFT
        );
    }


    private function saveRiwayat(
        $pendaftaran,
        $aktivitas,
        $statusSebelumnya,
        $statusSesudahnya,
        $keterangan
    ) {
        $riwayat = new RiwayatKunjungan();

        $riwayat->pendaftaran_id = $pendaftaran->id;
        $riwayat->pasien_id = $pendaftaran->pasien_id;
        $riwayat->aktivitas = $aktivitas;
        $riwayat->status_sebelumnya = $statusSebelumnya;
        $riwayat->status_sesudahnya = $statusSesudahnya;
        $riwayat->keterangan = $keterangan;
        $riwayat->user_id = Yii::$app->user->id;

        if (!$riwayat->save()) {
            throw new \DomainException(
                implode(', ', $riwayat->getFirstErrors())
            );
        }
    }

    private function isValidDate($date)
    {
        $parsed = \DateTime::createFromFormat('!Y-m-d', $date);

        return $parsed && $parsed->format('Y-m-d') === $date;
    }

    private function lockPasien($pasienId)
    {
        Pasien::find()
            ->where(['id' => $pasienId])
            ->one();
    }

    private function validateDuplikasiPendaftaran($pasienId, $tanggal)
    {
        $exists = Pendaftaran::find()
            ->where([
                'pasien_id' => $pasienId,
                'tanggal_kunjungan' => $tanggal,
            ])
            ->andWhere(['<>', 'status', 'DIBATALKAN'])
            ->exists();

        if ($exists) {
            throw new \DomainException(
                'Pasien sudah memiliki pendaftaran aktif pada tanggal tersebut.'
            );
        }
    }
}
