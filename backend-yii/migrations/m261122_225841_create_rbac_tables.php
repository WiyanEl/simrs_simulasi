<?php

use yii\db\Migration;
use yii\db\Query;

class m261122_225841_create_rbac_tables extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%permissions}}', [
            'id' => $this->bigPrimaryKey(),
            'permission_code' => $this->string(100)->notNull()->unique(),
            'name' => $this->string(150)->notNull(),
            'module' => $this->string(100)->notNull(),
            'description' => $this->text(),
            'created_at' => $this->integer(),
        ]);

        $this->createTable('{{%role_permissions}}', [
            'role_id' => $this->bigInteger()->notNull(),
            'permission_id' => $this->bigInteger()->notNull(),
        ]);

        $this->addPrimaryKey(
            'pk-role_permissions',
            '{{%role_permissions}}',
            ['role_id', 'permission_id']
        );

        $this->addForeignKey(
            'fk-role_permissions-role',
            '{{%role_permissions}}',
            'role_id',
            '{{%roles}}',
            'id',
            'CASCADE'
        );

        $this->addForeignKey(
            'fk-role_permissions-permission',
            '{{%role_permissions}}',
            'permission_id',
            '{{%permissions}}',
            'id',
            'CASCADE'
        );

        $modules = [
            'pasien' => ['view', 'create', 'update', 'delete'],
            'pendaftaran' => ['view', 'create', 'update', 'delete'],
            'antrean' => ['view', 'create', 'update'],
            'rekam_medis' => ['view', 'create', 'update'],
            'tindakan' => ['view', 'create', 'update'],
            'farmasi' => ['view', 'create', 'update'],
            'laboratorium' => ['view', 'create', 'update'],
            'radiologi' => ['view', 'create', 'update'],
            'billing' => ['view', 'create', 'update'],
            'pembayaran' => ['view', 'create'],
            'users' => ['view', 'create', 'update', 'delete'],
            'roles' => ['view', 'manage'],
            'dashboard' => ['view'],
        ];

        $permissions = [];
        $now = time();

        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                $code = "{$module}.{$action}";

                $permissions[] = [
                    'permission_code' => $code,
                    'name' => ucfirst($action) . ' ' . ucfirst($module),
                    'module' => $module,
                    'description' => "Hak akses {$action} pada modul {$module}",
                    'created_at' => $now,
                ];
            }
        }

        $this->batchInsert(
            '{{%permissions}}',
            [
                'permission_code',
                'name',
                'module',
                'description',
                'created_at',
            ],
            $permissions
        );

        $rolePermissions = [
            'ADMIN' => array_column(
                $permissions,
                'permission_code'
            ),

            'REGISTRATION' => [
                'pasien.view',
                'pasien.create',
                'pasien.update',
                'pendaftaran.view',
                'pendaftaran.create',
                'pendaftaran.update',
                'antrean.view',
                'antrean.create',
                'antrean.update',
                'dashboard.view',
            ],

            'DOCTOR' => [
                'pasien.view',
                'pendaftaran.view',
                'antrean.view',
                'rekam_medis.view',
                'rekam_medis.create',
                'rekam_medis.update',
                'tindakan.view',
                'tindakan.create',
                'tindakan.update',
                'farmasi.view',
                'laboratorium.view',
                'radiologi.view',
                'dashboard.view',
            ],

            'PHARMACY' => [
                'pasien.view',
                'farmasi.view',
                'farmasi.create',
                'farmasi.update',
                'dashboard.view',
            ],

            'CASHIER' => [
                'pasien.view',
                'billing.view',
                'pembayaran.view',
                'pembayaran.create',
                'dashboard.view',
            ],
        ];

        $roles = (new Query())
            ->select(['id', 'role_code'])
            ->from('{{%roles}}')
            ->all();

        foreach ($roles as $role) {
            $codes = $rolePermissions[$role['role_code']] ?? [];

            foreach ($codes as $code) {
                $permission = (new Query())
                    ->select(['id'])
                    ->from('{{%permissions}}')
                    ->where(['permission_code' => $code])
                    ->one();

                if ($permission) {
                    $this->insert('{{%role_permissions}}', [
                        'role_id' => $role['id'],
                        'permission_id' => $permission['id'],
                    ]);
                }
            }
        }
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%role_permissions}}');
        $this->dropTable('{{%permissions}}');
    }
}
