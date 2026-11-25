<?php

namespace app\commands;

use Yii;
use yii\console\Controller;
use app\models\Role;
use app\models\Permission;
use app\models\RolePermission;

class SeedRbacController extends Controller
{
    public function actionIndex()
    {
        $db = Yii::$app->db;

        $transaction = $db->beginTransaction();

        try {
            // 1. Seed Role
            $roles = [
                'ADMIN' => 'Administrator',
                'REGISTRATION' => 'Petugas Pendaftaran',
                'DOCTOR' => 'Dokter',
                'PHARMACY' => 'Petugas Farmasi',
                'LABORATORY' => 'Petugas Laboratorium',
                'CASHIER' => 'Kasir',
            ];

            $roleIds = [];

            foreach ($roles as $code => $name) {
                $role = Role::findOne(['role_code' => $code]);

                if (!$role) {
                    $role = new Role();
                    $role->role_code = $code;
                }

                $role->name = $name;
                $role->description = 'Role ' . $name;

                if (!$role->save()) {
                    throw new \Exception(
                        json_encode($role->errors)
                    );
                }

                $roleIds[$code] = $role->id;
            }

            // 2. Seed Permission
            $permissions = [
                'dashboard' => [
                    'dashboard.view' => 'Melihat Dashboard',
                ],

                'user' => [
                    'user.view' => 'Melihat Pengguna',
                    'user.create' => 'Membuat Pengguna',
                    'user.update' => 'Mengubah Pengguna',
                    'user.delete' => 'Menonaktifkan Pengguna',
                ],

                'pegawai' => [
                    'pegawai.view' => 'Melihat Pegawai',
                ],

                'pasien' => [
                    'pasien.view' => 'Melihat Pasien',
                    'pasien.create' => 'Membuat Pasien',
                    'pasien.update' => 'Mengubah Pasien',
                    'pasien.delete' => 'Menonaktifkan Pasien',
                ],

                'pendaftaran' => [
                    'pendaftaran.view' => 'Melihat Pendaftaran',
                    'pendaftaran.create' => 'Membuat Pendaftaran',
                    'pendaftaran.update' => 'Mengubah Pendaftaran',
                ],

                'pemeriksaan' => [
                    'pemeriksaan.view' => 'Melihat Pemeriksaan',
                    'pemeriksaan.create' => 'Membuat Pemeriksaan',
                    'pemeriksaan.update' => 'Mengubah Pemeriksaan',
                ],

                'emr' => [
                    'emr.view' => 'Melihat EMR',
                    'emr.create' => 'Membuat EMR',
                    'emr.update' => 'Mengubah EMR',
                ],

                'farmasi' => [
                    'farmasi.view' => 'Melihat Farmasi',
                    'farmasi.create' => 'Membuat Transaksi Farmasi',
                    'farmasi.update' => 'Mengubah Transaksi Farmasi',
                ],

                'laboratorium' => [
                    'laboratorium.view' => 'Melihat Laboratorium',
                    'laboratorium.create' => 'Membuat Pemeriksaan Laboratorium',
                    'laboratorium.update' => 'Mengubah Hasil Laboratorium',
                ],

                'billing' => [
                    'billing.view' => 'Melihat Billing',
                    'billing.create' => 'Membuat Billing',
                    'billing.update' => 'Mengubah Billing',
                ],

                'kasir' => [
                    'kasir.view' => 'Melihat Kasir',
                    'kasir.create' => 'Membuat Pembayaran',
                    'kasir.update' => 'Mengubah Pembayaran',
                ],
            ];

            $permissionIds = [];

            foreach ($permissions as $module => $items) {
                foreach ($items as $code => $name) {
                    $permission = Permission::findOne([
                        'permission_code' => $code
                    ]);

                    if (!$permission) {
                        $permission = new Permission();
                        $permission->permission_code = $code;
                    }

                    $permission->name = $name;
                    $permission->module = $module;
                    $permission->description = $name;

                    if (!$permission->save()) {
                        throw new \Exception(
                            json_encode($permission->errors)
                        );
                    }

                    $permissionIds[$code] = $permission->id;
                }
            }

            // 3. Mapping permission per role
            $rolePermissions = [
                'ADMIN' => array_keys($permissionIds),

                'REGISTRATION' => [
                    'dashboard.view',
                    'pegawai.view',
                    'pasien.view',
                    'pasien.create',
                    'pasien.update',
                    'pendaftaran.view',
                    'pendaftaran.create',
                    'pendaftaran.update',
                ],

                'DOCTOR' => [
                    'dashboard.view',
                    'pasien.view',
                    'pendaftaran.view',
                    'pemeriksaan.view',
                    'pemeriksaan.create',
                    'pemeriksaan.update',
                    'emr.view',
                    'emr.create',
                    'emr.update',
                ],

                'PHARMACY' => [
                    'dashboard.view',
                    'pasien.view',
                    'farmasi.view',
                    'farmasi.create',
                    'farmasi.update',
                ],

                'LABORATORY' => [
                    'dashboard.view',
                    'pasien.view',
                    'laboratorium.view',
                    'laboratorium.create',
                    'laboratorium.update',
                ],

                'CASHIER' => [
                    'dashboard.view',
                    'pasien.view',
                    'billing.view',
                    'billing.create',
                    'billing.update',
                    'kasir.view',
                    'kasir.create',
                    'kasir.update',
                ],
            ];

            // 4. Simpan relasi role_permissions
            foreach ($rolePermissions as $roleCode => $codes) {
                $roleId = $roleIds[$roleCode];

                foreach ($codes as $permissionCode) {
                    $permissionId = $permissionIds[$permissionCode];

                    $exists = RolePermission::find()
                        ->where([
                            'role_id' => $roleId,
                            'permission_id' => $permissionId,
                        ])
                        ->exists();

                    if (!$exists) {
                        $relation = new RolePermission();
                        $relation->role_id = $roleId;
                        $relation->permission_id = $permissionId;

                        if (!$relation->save()) {
                            throw new \Exception(
                                json_encode($relation->errors)
                            );
                        }
                    }
                }
            }

            $transaction->commit();

            echo "Seeder RBAC berhasil dijalankan.\n";

        } catch (\Throwable $e) {
            $transaction->rollBack();

            echo "Seeder gagal: " . $e->getMessage() . "\n";

            return 1;
        }

        return 0;
    }
}
