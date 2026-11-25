<?php

namespace app\controllers\api;

use Yii;
use app\models\User;
use yii\rest\Controller;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\Cors;
use app\controllers\components\ApiResponse;

class AuthController extends Controller
{
  public function behaviors()
  {
    $behaviors = parent::behaviors();

    $behaviors['authenticator'] = [
      'class' => HttpBearerAuth::class,
      'except' => ['login'],
    ];

    return $behaviors;
  }

  public function actionLogin()
  {
    $request = Yii::$app->request;

    $username = $request->post('username');
    $password = $request->post('password');

    if (empty($username)) {
      return ApiResponse::error(
        'Username wajib diisi',
        422,
        [
          'username' => 'Username wajib diisi',
        ]
      );
    }

    if (empty($password)) {
      return ApiResponse::error(
        'Password wajib diisi',
        422,
        [
          'password' => 'Password wajib diisi',
        ]
      );
    }

    $user = User::findByUsername($username);

    if (!$user || $user->status != 10 ||
      !$user->validatePassword($password)) {

      return ApiResponse::error(
          'Username atau password salah',
          401
      );
    }

    $token = Yii::$app->security
      ->generateRandomString(64);

    $now = time();

    Yii::$app->db->createCommand()->insert(
      '{{%user_access_tokens}}',
      [
        'user_id' => $user->id,
        'token_hash' => hash('sha256', $token),
        'expires_at' => $now + (8 * 60 * 60),
        'created_at' => $now,
      ]
    )->execute();

    return ApiResponse::success('Login berhasil', [
      'access_token' => $token,
      'token_type' => 'Bearer',
      'expires_in' => 28800,
      'user' => [
        'id' => $user->id,
        'username' => $user->username,
        'email' => $user->email,
        'roles' => $user->getRoles(),
      ],
    ]);
  }

  public function actionMe()
  {
    $user = Yii::$app->user->identity;

    return ApiResponse::success('Data user berhasil diambil', [
      'id' => $user->id,
      'username' => $user->username,
      'email' => $user->email,
      'roles' => $user->getRoles(),
    ]);
  }

  public function actionLogout()
  {
    $token = Yii::$app->request->headers->get('Authorization');

    $token = preg_replace('/^Bearer\s+/i', '', $token);

    if ($token) {
      Yii::$app->db->createCommand()->update(
        '{{%user_access_tokens}}',
        ['revoked_at' => time()],
        [
          'token_hash' => hash('sha256', $token),
          'revoked_at' => null,
        ]
      )->execute();
    }

    return ApiResponse::success('Logout berhasil');
  }
}
