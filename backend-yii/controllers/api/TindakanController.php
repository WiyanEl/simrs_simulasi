<?php

namespace app\controllers\api;

use Yii;
use app\controllers\components\ApiResponse;
use app\models\Tindakan;
use yii\db\IntegrityException;
use yii\web\NotFoundHttpException;

class TindakanController extends BaseController
{
  public function actionIndex()
  {
    $this->checkPermission('tindakan.view');

    $request = Yii::$app->request;

    $query = Tindakan::find()
      ->andFilterWhere([
        'kategori' => $request->get('kategori'),
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
        'Data tindakan tidak ditemukan.',
        404
      );
    }

    return ApiResponse::success(
      'Data tindakan berhasil diambil.',
      $data
    );
  }

  public function actionView($id)
  {
    $this->checkPermission('tindakan.view');

    $model = Tindakan::findOne($id);

    if (!$model) {
      return ApiResponse::error(
        'tindakan tidak ditemukan.',
        404
      );
    }

    return ApiResponse::success(
      'Data tindakan berhasil diambil.',
      $model
    );
  }

  public function actionCreate()
  {
    $this->checkPermission('tindakan.create');

    $model = new Tindakan();

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
        'Kode tindakan sudah digunakan.',
        409
      );
    }

    Yii::$app->response->statusCode = 201;

    return ApiResponse::success(
      'tindakan berhasil ditambahkan.',
      [
        'id' => $model->id,
        'nama' => $model->nama,
        'kategori' => $model->kategori,
        'tarif' => $model->tarif
      ]
    );
  }

    public function actionUpdate($id)
    {
      $this->checkPermission('tindakan.update');

      $model = Tindakan::findOne($id);

      if (!$model) {
        throw new NotFoundHttpException(
          'Data tindakan tidak ditemukan.'
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
          'Kode tindakan sudah digunakan.',
          409
        );
      }

      return ApiResponse::success(
        'tindakan berhasil diperbarui.',
        $model
      );
    }

    public function actionDelete($id)
    {
      $this->checkPermission('tindakan.delete');

      $model = Tindakan::findOne($id);

      if (!$model) {
        throw new NotFoundHttpException(
          'Data tindakan tidak ditemukan.'
        );
      }

      $model->is_active = false;
      $model->save(false);

      return ApiResponse::success(
        'tindakan berhasil dinonaktifkan.'
      );
    }

  public function actionReferences()
  {
    $this->checkPermission('tindakan.view');

    $data = Tindakan::find()
      ->select([
        'id',
        'nama',
      ])
      ->orderBy(['nama' => SORT_ASC])
      ->asArray()
      ->all();

    return ApiResponse::success(
      'Data Referensi tindakan berhasil diambil.',
      $data
    );
  }
}
