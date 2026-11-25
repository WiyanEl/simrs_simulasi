<?php

namespace app\controllers\api;

use app\controllers\components\ApiResponse;
use Yii;
use app\models\User;
use app\models\Role;
use app\models\UserRole;
use app\models\Pegawai;
use yii\db\IntegrityException;

class UserController extends BaseController
{
  public function actionIndex()
  {
    $this->checkPermission('user.view');

    $request = Yii::$app->request;

    $search = trim($request->get('search', ''));
    $roleId = $request->get('role_id');

    $query = User::find()
      ->alias('u')
      ->joinWith(['pegawai p'])
      ->orderBy(['u.id' => SORT_DESC]);

    if ($search !== '') {
      $query->andWhere([
        'or',
        ['ilike', 'u.username', $search],
        ['ilike', 'u.email', $search],
        ['ilike', 'p.nama_lengkap', $search],
      ]);
    }

    if ($roleId !== null && $roleId !== '') {
      $query->innerJoin(
        '{{%user_role}} ur',
        'ur.user_id = u.id'
      );

      $query->andWhere(['ur.role_id' => $roleId]);
    }

    $users = $query->all();

    if (empty($users)) {
      return ApiResponse::error(
        'Data Pengguna tidak ditemukan.',
        404
      );
    }

    $data = [];

    foreach ($users as $user) {
      $data[] = $this->formatUser($user);
    }

    return ApiResponse::success(
      'Data Pengguna berhasil diambil.',
      $data
    );
  }

  public function actionView($id)
  {
    $this->checkPermission('user.view');

    $user = (new \yii\db\Query())
      ->select([
          'u.id',
          'u.pegawai_id',
          'u.username',
          'u.email',
          'u.status',
          'ur.role_id',
      ])
      ->from(['u' => '{{%users}}'])
      ->leftJoin(
          '{{%user_roles}} ur',
          'ur.user_id = u.id'
      )
      ->where(['u.id' => $id])
      ->one();

    if (!$user) {
      return ApiResponse::error(
        'Data user tidak ditemukan.',
        404
      );
    }

    return ApiResponse::success(
      'Data user berhasil diambil.',
      $user
    );
  }

  public function actionCreate()
  {
    $this->checkPermission('user.create');

    $request = Yii::$app->request;
    $body = $request->bodyParams;

    $transaction = Yii::$app->db->beginTransaction();

    try {
      $user = new User();

      $user->pegawai_id = $body['pegawai_id'] ?? null;
      $user->username = trim($body['username'] ?? '');
      $user->email = trim($body['email'] ?? '');
      $user->status = User::STATUS_ACTIVE;

      $password = $body['password'] ?? '';
      $roleId = $body['role_id'] ?? null;

      if ($password === '') {
        return ApiResponse::error(
          'Password wajib diisi.',
          422,
          null
        );
      }

      if (strlen($password) < 8) {
        return ApiResponse::error(
          'Password minimal 8 karakter.',
          422,
          null
        );
      }

      $role = $this->findRole($roleId);

      if (!$user->pegawai_id) {
        return ApiResponse::error(
          'Pegawai wajib diisi.',
          422,
          null
        );
      }

      $pegawai = Pegawai::findOne($user->pegawai_id);

      if (!$pegawai) {
        return ApiResponse::error(
          'Pegawai tidak ditemukan.',
          404,
          null
        );
      }

      $user->setPassword($password);

      if (!$user->save()) {
        $transaction->rollBack();

        return $this->validationError($user->errors);
      }

      $userRole = new UserRole();
      $userRole->user_id = $user->id;
      $userRole->role_id = $role->id;

      if (!$userRole->save()) {
        throw new \Exception(
          json_encode($userRole->errors)
        );
      }

      $transaction->commit();

      return ApiResponse::success(
        'Pengguna berhasil ditambahkan.',
        [
          'id' => $user->id,
          'username' => $user->username,
          'pegawai_id' => $user->pegawai_id
        ]
      );

    } catch (IntegrityException $e) {
      $transaction->rollBack();

      return ApiResponse::error(
        'Username, email, atau pegawai sudah digunakan.',
        409
      );

    } catch (\Throwable $e) {
      if ($transaction->isActive) {
        $transaction->rollBack();
      }

      return ApiResponse::error(
        'Server Error.',
        505
      );
    }
  }

  public function actionUpdate($id)
  {
    $this->checkPermission('user.update');

    $user = $this->findUser($id);
    $body = Yii::$app->request->bodyParams;

    $transaction = Yii::$app->db->beginTransaction();

    try {
      if (array_key_exists('pegawai_id', $body)) {
        $pegawaiId = $body['pegawai_id'];

        if ($pegawaiId !== null && $pegawaiId !== '') {
          $pegawai = Pegawai::findOne($pegawaiId);

          if (!$pegawai) {
            return ApiResponse::error(
              'Pegawai tidak ditemukan.',
              404,
              null
            );
          }

          $user->pegawai_id = $pegawaiId;
        } else {
          $user->pegawai_id = null;
        }
      }

      if (array_key_exists('username', $body)) {
        $user->username = trim($body['username']);
      }

      if (array_key_exists('email', $body)) {
        $user->email = trim($body['email']);
      }

      if (array_key_exists('status', $body)) {
        $status = (int) $body['status'];

        if (!in_array($status, [
          User::STATUS_ACTIVE,
          User::STATUS_INACTIVE,
        ], true)) {
          return ApiResponse::error(
            'Pegawai tidak valid.',
            409,
            null
          );
        }

        $user->status = $status;
      }

      if (array_key_exists('password', $body) &&
        $body['password'] !== '') {

        if (strlen($body['password']) < 8) {
          return ApiResponse::error(
            'Password minimal 8 karakter.',
            422,
            null
          );
        }

        $user->setPassword($body['password']);
      }

      if (!$user->save()) {
        return $this->validationError($user->errors);
      }

      if (array_key_exists('role_id', $body)) {
        $role = $this->findRole($body['role_id']);

        UserRole::deleteAll([
          'user_id' => $user->id,
        ]);

        $userRole = new UserRole();
        $userRole->user_id = $user->id;
        $userRole->role_id = $role->id;

        if (!$userRole->save()) {
          throw new \Exception(
            json_encode($userRole->errors)
          );
        }
      }

      $transaction->commit();

      return ApiResponse::success(
        'Pengguna berhasil diperbarui.',
        []
      );

    } catch (IntegrityException $e) {
      $transaction->rollBack();

      return ApiResponse::error(
        'Username, email, atau pegawai sudah digunakan.',
        409
      );

    } catch (\Throwable $e) {
      if ($transaction->isActive) {
        $transaction->rollBack();
      }

      return ApiResponse::error(
        'Server Error.',
        505
      );
    }
  }

  public function actionDelete($id)
  {
    $this->checkPermission('user.delete');

    $user = $this->findUser($id);

    if ((int) $user->id === (int) Yii::$app->user->id) {
      return ApiResponse::error(
        'Anda tidak dapat menonaktifkan akun sendiri.',
        409,
        null
      );
    }

    $user->status = User::STATUS_INACTIVE;

    if (!$user->save(false)) {
      return ApiResponse::error(
        'Gagal menonaktifkan pengguna.',
        505
      );
    }

    return ApiResponse::success(
      'Pengguna berhasil dinonaktifkan.',
      []
    );
  }

  public function actionResetPassword($id)
  {
    $this->checkPermission('user.update');

    $user = $this->findUser($id);
    $password = Yii::$app->request->post('password');

    if (!$password || strlen($password) < 8) {
      return ApiResponse::error(
        'Password minimal 8 karakter.',
        422,
        null
      );
    }

    $user->setPassword($password);

    if (!$user->save(false)) {
      return ApiResponse::error(
        'Gagal mengubah password.',
        505
      );
    }

    return ApiResponse::success(
      'Password berhasil direset.',
      []
    );
  }

  private function formatUser($user)
  {
      return [
          'id' => $user->id,
          'pegawai_id' => $user->pegawai_id,
          'pegawai' => $user->pegawai ? [
              'id' => $user->pegawai->id,
              'nama' => $user->pegawai->nama_lengkap,
          ] : null,
          'username' => $user->username,
          'email' => $user->email,
          'status' => (int) $user->status,
          'roles' => $user->getRoles(),
          'created_at' => $user->created_at,
          'updated_at' => $user->updated_at,
      ];
  }

  private function findUser($id)
  {
    $user = User::findOne($id);

    if (!$user) {
      return ApiResponse::error(
        'Pengguna tidak ditemukan.',
        404,
        null
      );
    }

    return $user;
  }

  private function findRole($id)
  {
    $role = Role::findOne($id);

    if (!$role) {
      return ApiResponse::error(
        'Role tidak ditemukan.',
        404,
        null
      );
    }

    return $role;
  }

  private function validationError($errors)
  {
    Yii::$app->response->statusCode = 422;

    return [
      'success' => false,
      'message' => 'Validasi gagal.',
      'errors' => $errors,
    ];
  }
}