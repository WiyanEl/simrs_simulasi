<?php

namespace app\controllers\api;

use Yii;
use app\models\Ruangan;
use app\controllers\components\ApiResponse;
use yii\db\IntegrityException;
use yii\web\NotFoundHttpException;

class RuanganController extends BaseController
{
  public function actionIndex()
  {
    $this->checkPermission('ruangan.view');

    $request = Yii::$app->request;

    $query = Ruangan::find()
      ->andFilterWhere([
        'jenis_ruangan' => $request->get('jenis_ruangan'),
        'is_active' => $request->get('is_active'),
      ]);

    $search = $request->get('search');

    if ($search) {
      $query->andWhere([
        'or',
        ['ilike', 'nama', $search],
        ['ilike', 'kode', $search],
      ]);
    }

    $data = $query
      ->orderBy(['id' => SORT_DESC])
      ->asArray()
      ->all();

    if (empty($data)) {
      return ApiResponse::error(
        'Data ruangan tidak ditemukan.',
        404
      );
    }

    return ApiResponse::success(
      'Data ruangan berhasil diambil.',
      $data
    );
  }

  public function actionView($id)
  {
    $this->checkPermission('ruangan.view');

    $model = Ruangan::findOne($id);

    if (!$model) {
      return ApiResponse::error(
        'Ruangan tidak ditemukan.',
        404
      );
    }

    return ApiResponse::success(
      'Data ruangan berhasil diambil.',
      $model
    );
  }

  public function actionCreate()
  {
    $this->checkPermission('ruangan.create');

    $model = new Ruangan();

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
        'Kode ruangan sudah digunakan.',
        409
      );
    }

    Yii::$app->response->statusCode = 201;

    return ApiResponse::success(
      'Ruangan berhasil ditambahkan.',
      [
        'id' => $model->id,
        'nama' => $model->nama,
        'jenis_ruangan' => $model->jenis_ruangan
      ]
    );
  }

    public function actionUpdate($id)
    {
      $this->checkPermission('ruangan.update');

      $model = Ruangan::findOne($id);

      if (!$model) {
        throw new NotFoundHttpException(
          'Data ruangan tidak ditemukan.'
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
          'Kode ruangan sudah digunakan.',
          409
        );
      }

      return ApiResponse::success(
        'Ruangan berhasil diperbarui.',
        $model
      );
    }

    public function actionDelete($id)
    {
      $this->checkPermission('ruangan.delete');

      $model = Ruangan::findOne($id);

      if (!$model) {
        throw new NotFoundHttpException(
          'Data ruangan tidak ditemukan.'
        );
      }

      $model->is_active = false;
      $model->save(false);

      return ApiResponse::success(
        'Ruangan berhasil dinonaktifkan.'
      );
    }

  public function actionReferences()
  {
    $data = Ruangan::find()
      ->select([
        'id',
        'nama',
      ])
      ->orderBy(['nama' => SORT_ASC])
      ->asArray()
      ->all();

    return ApiResponse::success(
      'Data Referensi ruangan berhasil diambil.',
      $data
    );
  }
}
