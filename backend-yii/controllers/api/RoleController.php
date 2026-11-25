<?php

namespace app\controllers\api;

use app\controllers\components\ApiResponse;
use app\models\Role;

class RoleController extends BaseController
{
  public function actionReferences()
  {
    $this->checkPermission('pegawai.view');

    $data = Role::find()
      ->select([
        'id',
        'name',
      ])
      ->orderBy(['name' => SORT_ASC])
      ->asArray()
      ->all();

    return ApiResponse::success(
      'Data Referensi role berhasil diambil.',
      $data
    );
  }
}