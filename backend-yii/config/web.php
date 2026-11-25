<?php

$params = require __DIR__ . '/params.php';
$db = require __DIR__ . '/db.php';

$config = [
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'on beforeRequest' => function ($event) {
        $request = Yii::$app->request;
        $response = Yii::$app->response;

        $origin = $request->headers->get('Origin');

        $allowedOrigins = [
            'http://localhost:3000',
        ];

        if (in_array($origin, $allowedOrigins, true)) {
            $response->headers->set(
                'Access-Control-Allow-Origin',
                $origin
            );

            $response->headers->set(
                'Access-Control-Allow-Methods',
                'GET, POST, PUT, PATCH, DELETE, OPTIONS'
            );

            $response->headers->set(
                'Access-Control-Allow-Headers',
                'Content-Type, Authorization, Accept, X-Requested-With'
            );

            $response->headers->set('Vary', 'Origin');
        }

        if ($request->isOptions) {
            $response->statusCode = 204;
            $response->send();
            Yii::$app->end();
        }
    },
    'container' => [
        'singletons' => [
            \yii\mail\MailerInterface::class => [
                'class' => \yii\symfonymailer\Mailer::class,
                // send all mails to a file by default.
                'useFileTransport' => true,
                'viewPath' => '@app/mail',
            ],
        ],
    ],
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
    ],
    'components' => [
        'request' => [
            'cookieValidationKey' => 'GANTI_DENGAN_RANDOM_SECRET',
            'parsers' => [
                'application/json' => yii\web\JsonParser::class,
            ],
        ],
        'cache' => [
            'class' => \yii\caching\FileCache::class,
        ],
        'user' => [
            'identityClass' => \app\models\User::class,
            'enableAutoLogin' => true,
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'mailer' => \yii\mail\MailerInterface::class,
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => \yii\log\FileTarget::class,
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'response' => [
            'format' => yii\web\Response::FORMAT_JSON,
        ],
        'db' => $db,
        'user' => [
            'identityClass' => app\models\User::class,
            'enableSession' => false,
            'enableAutoLogin' => false,
        ],
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'enableStrictParsing' => true,
            'rules' => array_merge(
                require __DIR__ . '/routes/auth.php',
                require __DIR__ . '/routes/pegawai.php',
                require __DIR__ . '/routes/dokter.php',
                require __DIR__ . '/routes/ruangan.php',
                require __DIR__ . '/routes/jadwalDokter.php',
                require __DIR__ . '/routes/tindakan.php',
                require __DIR__ . '/routes/obat.php',
                require __DIR__ . '/routes/stokObat.php',
                require __DIR__ . '/routes/user.php',
                require __DIR__ . '/routes/role.php',
                require __DIR__ . '/routes/pasien.php',
                require __DIR__ . '/routes/pendaftaran.php',
            ),
        ],
    ],
    'params' => $params,
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => \yii\debug\Module::class,
        // uncomment the following to add your IP if you are not connecting from localhost.
        //'allowedIPs' => ['127.0.0.1', '::1'],
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => \yii\gii\Module::class,
        // uncomment the following to add your IP if you are not connecting from localhost.
        //'allowedIPs' => ['127.0.0.1', '::1'],
    ];
}

return $config;
