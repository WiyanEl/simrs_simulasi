<?php

namespace app\controllers\api;

use app\controllers\components\ApiResponse;
use Yii;
use app\models\Pegawai;
use yii\db\IntegrityException;

class PegawaiController extends BaseController
{
  public function actionIndex()
  {
    $this->checkPermission('pegawai.view');

    $request = Yii::$app->request;

    $query = Pegawai::find()
      ->andFilterWhere([
        'jenis_pegawai' => $request->get('jenis_pegawai'),
        'is_active' => $request->get('is_active'),
      ]);

    $search = $request->get('search');

    if ($search) {
      $query->andWhere([
        'or',
        ['ilike', 'nama_lengkap', $search],
        ['ilike', 'kode_pegawai', $search],
        ['ilike', 'nip', $search],
      ]);
    }

    $data = $query
      ->orderBy(['id' => SORT_DESC])
      ->asArray()
      ->all();

    if (empty($data)) {
      return ApiResponse::error(
        'Data pegawai tidak ditemukan.',
        404
      );
    }

    return ApiResponse::success(
      'Data pegawai berhasil diambil.',
      $data
    );
  }

  public function actionView($id)
  {
    $this->checkPermission('pegawai.view');

    $model = Pegawai::find()
      ->with('dokter')
      ->where(['id' => $id])
      ->one();

    if (!$model) {
      return ApiResponse::error(
        'Pegawai tidak ditemukan.',
        404
      );
    }

    return ApiResponse::success(
      'Data pegawai berhasil diambil.',
      $model
    );
  }

  public function actionCreate()
  {
    $this->checkPermission('pegawai.create');

    $model = new Pegawai();
    $model->load(Yii::$app->request->bodyParams, '');

    if (!$model->validate()) {
      return ApiResponse::error(
        'Validasi gagal.',
        422,
        $model->errors
      );
    }

    try {
      if (!$model->save(false)) {
        return ApiResponse::error(
          'Gagal menyimpan pegawai.',
          500
        );
      }
    } catch (IntegrityException $e) {
      return ApiResponse::error(
        'Kode pegawai atau NIP sudah digunakan.',
        409
      );
    }

    Yii::$app->response->statusCode = 201;

    return ApiResponse::success(
      'Pegawai berhasil ditambahkan.',
      [
        'id' => $model->id,
        'kode_pegawai' => $model->kode_pegawai,
        'nama_lengkap' => $model->nama_lengkap,
        'jenis_pegawai' => $model->jenis_pegawai
      ]
    );
  }
  
  public function actionUpdate($id)
  {
    $this->checkPermission('pegawai.update');

    $model = Pegawai::findOne($id);

    if (!$model) {
      return ApiResponse::error(
        'Pegawai tidak ditemukan.',
        404
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
      if (!$model->save(false)) {
        return ApiResponse::error(
          'Gagal memperbarui pegawai.',
          500
        );
      }
    } catch (IntegrityException $e) {
      return ApiResponse::error(
        'Kode pegawai atau NIP sudah digunakan.',
        409
      );
    }

    return ApiResponse::success(
      'Pegawai berhasil diperbarui.',
      $model
    );
  }

  public function actionDelete($id)
  {
    $this->checkPermission('pegawai.delete');

    $model = Pegawai::findOne($id);

    if (!$model) {
      return ApiResponse::error(
        'Pegawai tidak ditemukan.',
        404
      );
    }

    $model->is_active = false;

    if (!$model->save(false)) {
      return ApiResponse::error(
        'Gagal menonaktifkan pegawai.',
        500
      );
    }

    return ApiResponse::success(
      'Pegawai berhasil dinonaktifkan.'
    );
  }

  public function actionReferences()
  {
    $this->checkPermission('pegawai.view');

    $data = Pegawai::find()
      ->select([
        'id',
        'nama_lengkap',
      ])
      ->where([
        'jenis_pegawai' => 'DOKTER',
      ])
      ->orderBy(['nama_lengkap' => SORT_ASC])
      ->asArray()
      ->all();

    return ApiResponse::success(
      'Data Referensi pegawai berhasil diambil.',
      $data
    );
  }

  public function actionReferencesAll()
  {
    $this->checkPermission('pegawai.view');

    $data = Pegawai::find()
      ->select([
        'id',
        'nama_lengkap',
      ])
      ->orderBy(['nama_lengkap' => SORT_ASC])
      ->asArray()
      ->all();

    return ApiResponse::success(
      'Data Referensi pegawai berhasil diambil.',
      $data
    );
  }
}
