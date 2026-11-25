<?php

namespace app\controllers\api;

use app\controllers\components\ApiResponse;
use Yii;
use app\models\StokObat;
use yii\db\IntegrityException;
use yii\web\NotFoundHttpException;

class StokObatController extends BaseController
{
  public function actionIndex()
  {
    $this->checkPermission('stok_obat.view');

    $request = Yii::$app->request;

    $query = StokObat::find()
      ->alias('s')
      ->joinWith(['obat o'])
      ->andFilterWhere([
        'o.is_active' => $request->get('is_active'),
      ]);

    $statusStok = $request->get('status_stok');

    if ($statusStok === 'habis') {
      $query->andWhere(['s.stok' => 0]);
    } elseif ($statusStok === 'menipis') {
      $query->andWhere('s.stok > 0 AND s.stok <= s.stok_minimum');
    } elseif ($statusStok === 'tersedia') {
      $query->andWhere('s.stok > s.stok_minimum');
    }

    $search = $request->get('search');

    if ($search) {
      $query->andWhere([
        'or',
        ['ilike', 'o.kode', $search],
        ['ilike', 'o.nama', $search],
      ]);
    }

    $data = $query
      ->with(['obat'])
      ->orderBy(['s.id' => SORT_DESC])
      ->asArray()
      ->all();

    if (empty($data)) {
      return ApiResponse::error(
        'Data stok obat tidak ditemukan.',
        404
      );
    }

    return ApiResponse::success(
      'Data stok obat berhasil diambil.',
      $data
    );
  }

  public function actionView($id)
  {
    $this->checkPermission('stok_obat.view');

    $model = StokObat::find()
      ->with(['obat'])
      ->where(['id' => $id])
      ->one();

    if (!$model) {
      return ApiResponse::error(
        'Data stok obat tidak ditemukan.',
        404
      );
    }

    return ApiResponse::success(
      'Data stok obat berhasil diambil.',
      $model
    );
  }

  public function actionUpdate($id)
  {
    $this->checkPermission('stok_obat.update');

    $model = StokObat::findOne($id);

    if (!$model) {
      return ApiResponse::error(
        'Data stok obat tidak ditemukan.',
        404
      );
    }

    $requestData = Yii::$app->request->bodyParams;

    $allowedFields = [
      'stok',
      'stok_minimum',
      'harga_beli',
      'harga_jual',
    ];

    foreach ($allowedFields as $field) {
      if (array_key_exists($field, $requestData)) {
        $model->$field = $requestData[$field];
      }
    }

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
        'Gagal memperbarui stok obat.',
        409
      );
    }

    return ApiResponse::success(
      'Stok obat berhasil diperbarui.',
      $model
    );
  }
}
