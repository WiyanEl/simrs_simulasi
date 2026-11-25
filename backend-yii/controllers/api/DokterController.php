<?php

namespace app\controllers\api;

use app\controllers\components\ApiResponse;
use Yii;
use app\models\Dokter;
use yii\db\IntegrityException;
use yii\web\NotFoundHttpException;

class DokterController extends BaseController
{
  public function actionIndex()
  {
    $this->checkPermission('dokter.view');

    $request = Yii::$app->request;

    $query = Dokter::find()
      ->joinWith('pegawai')
      ->with('pegawai')
      ->andFilterWhere([
          'pegawai.is_active' => $request->get('is_active'),
      ])
      ->andFilterWhere([
          'dokter.spesialisasi' => $request->get('spesialisasi'),
      ]);

    $search = $request->get('search');

    if ($search) {
      $query->andWhere([
        'or',
        ['ilike', 'pegawai.nama_lengkap', $search],
        ['ilike', 'dokter.no_str', $search],
        ['ilike', 'dokter.no_sip', $search],
        ['ilike', 'dokter.spesialisasi', $search],
      ]);
    }

    $total = (clone $query)->count();

    $page = max(1, (int) $request->get('page', 1));
    $limit = min(100, max(1, (int) $request->get('limit', 10)));

    $data = $query
      ->orderBy(['dokter.id' => SORT_DESC])
      ->asArray()
      ->all();

    if (empty($data)) {
      return ApiResponse::error(
        'Data dokter tidak ditemukan.',
        404
      );
    }

    return ApiResponse::success(
      'Data dokter berhasil diambil.',
      $data
    );
  }

  public function actionView($id)
  {
    $this->checkPermission('dokter.view');

    $model = Dokter::find()
      ->with('pegawai')
      ->where(['id' => $id])
      ->one();

    if (!$model) {
      return ApiResponse::error(
        'Dokter tidak ditemukan.',
        404
      );
    }

    return ApiResponse::success(
      'Data dokter berhasil diambil.',
      $model
    );
  }

  public function actionCreate()
  {
    $this->checkPermission('dokter.create');

    $model = new Dokter();

    $model->load(
      Yii::$app->request->bodyParams,
      ''
    );

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
        'Data dokter sudah terdaftar atau nomor STR/SIP digunakan.',
        409
      );
    }

    return ApiResponse::success(
      'Dokter berhasil ditambahkan.',
      [
        'id' => $model->id,
        'spesialisasi' => $model->spesialisasi,
        'no_sip' => $model->no_sip
      ]
    );
  }

  public function actionUpdate($id)
  {
      $this->checkPermission('dokter.update');

      $model = Dokter::findOne($id);

      if (!$model) {
        return ApiResponse::error(
        'Pegawai tidak ditemukan.',
          404
        );
      }

      $model->load(
        Yii::$app->request->bodyParams,
        ''
      );

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
          'Nomor STR atau SIP sudah digunakan.',
          409
        );
      }

      return ApiResponse::success(
        'Dokter berhasil diperbarui.',
        $model
      );
  }

  public function actionDelete($id)
  {
    $this->checkPermission('dokter.delete');

    $model = Dokter::findOne($id);

    if (!$model) {
      return ApiResponse::error(
        'Pegawai tidak ditemukan.',
        404
      );
    }

    $model->delete();

    return ApiResponse::success(
      'Dokter berhasil dihapus'
    );
  }

  public function actionReferences()
  {
    $data = Dokter::find()
      ->alias('d')
      ->joinWith(['pegawai p'])
      ->select([
        'd.id',
        'p.nama_lengkap',
      ])
      ->asArray()
      ->orderBy(['p.nama_lengkap' => SORT_ASC])
      ->all();

    return ApiResponse::success(
      'Referensi dokter berhasil diambil.',
      $data
    );
  }
}
