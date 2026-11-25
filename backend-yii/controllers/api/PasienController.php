<?php

namespace app\controllers\api;

use Yii;
use app\models\Pasien;
use app\controllers\components\ApiResponse;
use yii\db\IntegrityException;

class PasienController extends BaseController
{
  public function actionIndex()
  {
    $this->checkPermission('pasien.view');

    $request = Yii::$app->request;

    $query = Pasien::find();

    $search = $request->get('search');

    if ($search) {
      $query->andWhere([
        'or',
        ['ilike', 'no_rm', $search],
        ['ilike', 'nik', $search],
        ['ilike', 'nama', $search],
        ['ilike', 'no_hp', $search],
      ]);
    }

    $query->andFilterWhere([
      'jenis_kelamin' => $request->get('jenis_kelamin'),
    ]);

    if ($request->get('is_active') !== null) {
      $query->andWhere([
        'is_active' => filter_var(
          $request->get('is_active'),
          FILTER_VALIDATE_BOOLEAN
        ),
      ]);
    }

    $limit = min(100, max(1, (int) $request->get('limit', 10)));

    $data = $query
      ->orderBy(['id' => SORT_DESC])
      ->limit($limit)
      ->asArray()
      ->all();

    if (empty($data)) {
      return ApiResponse::error(
        'Data pasien tidak ditemukan.',
        404
      );
    }

    return ApiResponse::success(
      'Data pasien berhasil diambil.',
      $data
    );
  }

  public function actionView($id)
  {
    $this->checkPermission('pasien.view');

    $model = Pasien::findOne($id);

    if (!$model) {
      return ApiResponse::error(
        'Data pasien tidak ditemukan.',
        404
      );
    }

    return ApiResponse::success(
      'Detail pasien berhasil diambil.',
      $model
    );
  }

  public function actionCreate()
  {
    $this->checkPermission('pasien.create');

    $model = new Pasien();

    $bodyParams = Yii::$app->request->bodyParams;

    $model->no_rm = $this->generateNoRm();

    unset($bodyParams['no_rm']);

    $model->load($bodyParams, '');

    $model->no_rm = $this->generateNoRm();

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
          'Gagal menyimpan data pasien.',
          500
        );
      }

      Yii::$app->response->statusCode = 201;

      return ApiResponse::success(
        'Data pasien berhasil ditambahkan.',
        [
          'id' => $model->id,
          'no_rm' => $model->no_rm,
          'nama' => $model->nama,
          'nik' => $model->nik
        ]
      );

    } catch (IntegrityException $e) {
      Yii::error($e->getMessage(), __METHOD__);

      return ApiResponse::error(
        'NIK atau nomor rekam medis sudah terdaftar.',
        409
      );
    } catch (\Throwable $e) {
      Yii::error($e->getMessage(), __METHOD__);

      return ApiResponse::error(
        'Terjadi kesalahan saat menyimpan data pasien.',
        500
      );
    }
  }

  public function actionUpdate($id)
  {
    $this->checkPermission('pasien.update');

    $model = Pasien::findOne($id);

    if (!$model) {
      return ApiResponse::error(
        'Data pasien tidak ditemukan.',
        404
      );
    }

    $bodyParams = Yii::$app->request->bodyParams;

    unset($bodyParams['no_rm']);

    $model->load($bodyParams, '');

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
          'Gagal memperbarui data pasien.',
          500
        );
      }

      return ApiResponse::success(
        'Data pasien berhasil diperbarui.',
        $model
      );

    } catch (IntegrityException $e) {
      Yii::error($e->getMessage(), __METHOD__);

      return ApiResponse::error(
        'NIK sudah terdaftar pada pasien lain.',
        409
      );
    } catch (\Throwable $e) {
      Yii::error($e->getMessage(), __METHOD__);

      return ApiResponse::error(
        'Terjadi kesalahan saat memperbarui data pasien.',
        500
      );
    }
  }

  public function actionDelete($id)
  {
    $this->checkPermission('pasien.update');

    $model = Pasien::findOne($id);

    if (!$model) {
      return ApiResponse::error(
        'Data pasien tidak ditemukan.',
        404
      );
    }

    $model->is_active = false;

    if (!$model->save(false)) {
      return ApiResponse::error(
        'Gagal menonaktifkan pasien.',
        500
      );
    }

    return ApiResponse::success(
      'Data pasien berhasil dinonaktifkan.',
      $model
    );
  }

  private function generateNoRm()
  {
    $number = Yii::$app->db
      ->createCommand("SELECT nextval('pasien_no_rm_seq')")
      ->queryScalar();

    return str_pad(
      (string) $number,
      6,
      '0',
      STR_PAD_LEFT
    );
  }
}
