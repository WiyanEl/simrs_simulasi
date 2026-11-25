<?php

namespace app\controllers\api;

use app\controllers\components\ApiResponse;
use Yii;
use app\models\Obat;
use app\models\StokObat;
use yii\db\IntegrityException;

class ObatController extends BaseController
{
  public function actionIndex()
  {
    $this->checkPermission('obat.view');

    $request = Yii::$app->request;

    $query = Obat::find()
      ->alias('o')
      ->joinWith(['stokObat s'])
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
        ['ilike', 'o.satuan', $search],
      ]);
    }

    $data = $query
      ->with(['stokObat'])
      ->orderBy(['o.id' => SORT_DESC])
      ->asArray()
      ->all();

    if (empty($data)) {
      return ApiResponse::error(
        'Data obat tidak ditemukan.',
        404
      );
    }

    return ApiResponse::success(
      'Data obat berhasil diambil.',
      $data
    );
  }

  public function actionView($id)
  {
    $this->checkPermission('obat.view');

    $model = Obat::find()
      ->with(['stokObat'])
      ->where(['id' => $id])
      ->one();

    if (!$model) {
      return ApiResponse::error(
          'Obat tidak ditemukan.',
          404
      );
    }

    return ApiResponse::success(
      'Data obat berhasil diambil.',
      $model
    );
  }

  public function actionCreate()
  {
    $this->checkPermission('obat.create');

    $requestData = Yii::$app->request->bodyParams;

    $model = new Obat();

    $model->load($requestData, '');

    $stokModel = new StokObat();

    $stokModel->stok = $requestData['stok'] ?? 0;
    $stokModel->stok_minimum = $requestData['stok_minimum'] ?? 0;
    $stokModel->harga_beli = $requestData['harga_beli'] ?? 0;
    $stokModel->harga_jual = $requestData['harga_jual'] ?? 0;

    if (!$model->validate()) {
      return ApiResponse::error(
        'Validasi gagal.',
        422,
        $model->errors
      );
    }

    $transaction = Yii::$app->db->beginTransaction();

    try {
      $model->save(false);

      $stokModel->obat_id = $model->id;

      if (!$stokModel->validate()) {
        $transaction->rollBack();

        return ApiResponse::error(
          'Validasi stok atau harga gagal.',
          422,
          $stokModel->errors
        );
      }

      $stokModel->save(false);

      $transaction->commit();
    } catch (IntegrityException $e) {
      $transaction->rollBack();

      return ApiResponse::error(
        'Kode obat sudah terdaftar.',
        409
      );
    } catch (\Throwable $e) {
      $transaction->rollBack();

      Yii::error($e->getMessage(), __METHOD__);

      return ApiResponse::error(
        'Gagal menambahkan data obat.',
        500
      );
    }

    return ApiResponse::success(
      'Obat berhasil ditambahkan.',
      [
          'id' => $model->id,
          'kode' => $model->kode,
          'nama' => $model->nama,
          'satuan' => $model->satuan,
          'stok' => $stokModel,
      ]
    );
  }

  public function actionUpdate($id)
  {
    $this->checkPermission('obat.update');

    $model = Obat::findOne($id);

    if (!$model) {
      return ApiResponse::error(
          'Obat tidak ditemukan.',
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
        'Kode obat sudah digunakan.',
        409
      );
    }

    return ApiResponse::success(
      'Obat berhasil diperbarui.',
      $model
    );
  }

  public function actionDelete($id)
  {
    $this->checkPermission('obat.delete');

    $model = Obat::findOne($id);

    if (!$model) {
      return ApiResponse::error(
        'Obat tidak ditemukan.',
        404
      );
    }

    $stokModel = StokObat::findOne([
      'obat_id' => $model->id,
    ]);

    if ($stokModel && $stokModel->stok > 0) {
      return ApiResponse::error(
        'Obat tidak dapat dihapus karena masih memiliki stok.',
        409
      );
    }

    $transaction = Yii::$app->db->beginTransaction();

    try {
      if ($stokModel) {
        $stokModel->delete();
      }

      $model->delete();

      $transaction->commit();
    } catch (\Throwable $e) {
      $transaction->rollBack();

      Yii::error($e->getMessage(), __METHOD__);

      return ApiResponse::error(
        'Gagal menghapus data obat.',
        500
      );
    }

    return ApiResponse::success(
      'Obat berhasil dihapus.'
    );
  }
}
