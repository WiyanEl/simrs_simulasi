<?php

namespace app\models;

use yii\db\ActiveRecord;

class Permission extends ActiveRecord
{
    public static function tableName()
    {
        return '{{%permissions}}';
    }

    public function rules()
    {
        return [
            [['permission_code', 'name', 'module'], 'required'],
            [['description'], 'string'],
            [['created_at'], 'integer'],
            [['permission_code'], 'string', 'max' => 150],
            [['name', 'module'], 'string', 'max' => 255],
            [['permission_code'], 'unique'],
        ];
    }

    public function getRolePermissions()
    {
        return $this->hasMany(RolePermission::class, [
            'permission_id' => 'id'
        ]);
    }

    public function getRoles()
    {
        return $this->hasMany(Role::class, ['id' => 'role_id'])
            ->viaTable('{{%role_permissions}}', [
                'permission_id' => 'id'
            ]);
    }
}
