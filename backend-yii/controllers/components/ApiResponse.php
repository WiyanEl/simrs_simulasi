<?php

namespace app\controllers\components;

use Yii;

class ApiResponse
{
    public static function success($message = 'Berhasil', $data = null)
    {
        Yii::$app->response->statusCode = 200;

        return [
            'success' => true,
            'message' => $message,
            'data' => $data,
        ];
    }

    public static function error($message = 'Terjadi kesalahan', $statusCode = 400, $errors = null)
    {
        Yii::$app->response->statusCode = $statusCode;

        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return $response;
    }
}
