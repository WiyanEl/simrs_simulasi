<?php

namespace app\controllers\api;

use Yii;
use app\models\JadwalDokter;
use app\controllers\components\ApiResponse;
use yii\db\IntegrityException;
use yii\web\NotFoundHttpException;

class JadwalDokterController extends BaseController
{
    public function actionIndex()
    {
      $request = Yii::$app->request;

      $query = JadwalDokter::find()
        ->joinWith(['dokter.pegawai', 'ruangan'])
        ->andFilterWhere([
          'jadwal_dokter.dokter_id' => $request->get('dokter_id'),
          'jadwal_dokter.ruangan_id' => $request->get('ruangan_id'),
          'jadwal_dokter.hari' => $request->get('hari'),
          'jadwal_dokter.is_active' => $request->get('is_active'),
        ]);

      $search = $request->get('search');

      if ($search) {
        $query->andWhere([
          'or',
          ['ilike', 'pegawai.nama_lengkap', $search],
          ['ilike', 'ruangan.nama', $search],
        ]);
      }

      $models = $query
        ->orderBy(['id' => SORT_DESC])
        ->all();

      $data = array_map(function ($model) {
        return $model->toArray([], [
          'dokter.pegawai',
          'ruangan',
        ]);
      }, $models);

      if (empty($data)) {
        return ApiResponse::error(
          'Data jadwal dokter tidak ditemukan.',
          404
        );
      }

      return ApiResponse::success(
        'Data jadwal dokter berhasil diambil.',
        $data
      );
    }

    public function actionView($id)
    {
      $this->checkPermission('jadwal-dokter.view');

      $model = JadwalDokter::find()
        ->with(['dokter.pegawai', 'ruangan'])
        ->where(['jadwal_dokter.id' => $id])
        ->one();

      if (!$model) {
        throw new NotFoundHttpException(
            'Data jadwal dokter tidak ditemukan.'
        );
      }

      return ApiResponse::success(
        'Data jadwal dokter berhasil diambil.',
        $model->toArray([], [
          'dokter.pegawai',
          'ruangan',
        ])
      );
    }

    public function actionCreate()
    {
      $this->checkPermission('jadwal-dokter.create');

      $model = new JadwalDokter();

      $model->load(Yii::$app->request->bodyParams, '');

      if (!$model->validate()) {
        return ApiResponse::error(
          'Validasi gagal.',
          422,
          $model->errors
        );
      }

      try {
        $model->save(false);
      } catch (IntegrityException $e) {
        return ApiResponse::error(
          'Gagal menambahkan jadwal dokter. Pastikan data dokter dan ruangan valid.',
          409
        );
      }

      Yii::$app->response->statusCode = 201;

      return ApiResponse::success(
        'Jadwal dokter berhasil ditambahkan.',
        [
          'id' => $model->id,
          'dokter_id' => $model->dokter_id,
          'ruangan_id' => $model->ruangan_id,
          'kuota' => $model->kuota
        ]
      );
    }

    public function actionUpdate($id)
    {
      $this->checkPermission('jadwal-dokter.update');

      $model = JadwalDokter::findOne($id);

      if (!$model) {
        throw new NotFoundHttpException(
          'Data jadwal dokter tidak ditemukan.'
        );
      }

      $model->load(Yii::$app->request->bodyParams, '');

      if (!$model->validate()) {
        return ApiResponse::error(
          'Validasi gagal.',
          422,
          $model->errors
        );
      }

      try {
        $model->save(false);
      } catch (IntegrityException $e) {
        return ApiResponse::error(
          'Gagal memperbarui jadwal dokter.',
          409
        );
      }

      return ApiResponse::success(
        'Jadwal dokter berhasil diperbarui.',
        $model
      );
    }

    public function actionDelete($id)
    {
        $this->checkPermission('jadwal-dokter.delete');

        $model = JadwalDokter::findOne($id);

        if (!$model) {
            throw new NotFoundHttpException(
              'Data jadwal dokter tidak ditemukan.'
            );
        }

        $model->is_active = false;
        $model->save(false);

        return ApiResponse::success(
            'Jadwal dokter berhasil dinonaktifkan.'
        );
    }
}
