<?php

namespace app\controllers\api;

use Yii;
use yii\rest\Controller;
use yii\filters\auth\HttpBearerAuth;
use yii\web\ForbiddenHttpException;

class BaseController extends Controller
{
    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['authenticator'] = [
            'class' => HttpBearerAuth::class,
        ];

        return $behaviors;
    }

    protected function checkPermission($permission)
    {
        $user = Yii::$app->user->identity;

        if ($user && $user->hasRole('ADMIN')) {
            return true;
        }

        if (!$user || !$user->canAccess($permission)) {
            throw new ForbiddenHttpException(
                'Anda tidak memiliki hak akses.'
            );
        }

        return true;
    }
}
