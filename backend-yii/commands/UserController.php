<?php

namespace app\commands;

use Yii;
use app\models\User;
use yii\console\Controller;
use yii\console\ExitCode;

class UserController extends Controller
{
  public function actionCreateAdmin($username = 'admin', $email = 'admin@simrs.local') {
    if (User::findByUsername($username)) {
      $this->stdout("Username sudah digunakan.\n");
      return ExitCode::UNSPECIFIED_ERROR;
    }

    $password = $this->prompt('Password admin:', [
      'required' => true,
      'pattern' => '/^.{8,}$/',
      'error' => 'Password minimal 8 karakter.',
    ]);

    $user = new User();

    $user->username = $username;
    $user->email = $email;
    $user->password_hash = Yii::$app->security->generatePasswordHash($password);
    $user->status = 10;

    $user->created_at = time();
    $user->updated_at = time();

    if (!$user->save()) {
      $this->stderr(json_encode($user->errors));
      return ExitCode::UNSPECIFIED_ERROR;
    }

    $role = (new \yii\db\Query())
      ->from('{{%roles}}')
      ->where(['role_code' => 'ADMIN'])
      ->one();

    if (!$role) {
      $user->delete();
      $this->stderr("Role ADMIN tidak ditemukan.\n");
      return ExitCode::UNSPECIFIED_ERROR;
    }

    Yii::$app->db->createCommand()->insert(
      '{{%user_roles}}',
      [
        'user_id' => $user->id,
        'role_id' => $role['id'],
      ]
    )->execute();

    $this->stdout(
      "Administrator berhasil dibuat: {$username}\n"
    );

    return ExitCode::OK;
  }
}
