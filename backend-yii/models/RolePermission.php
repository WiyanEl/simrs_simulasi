<?php

namespace app\models;

use yii\db\ActiveRecord;

class RolePermission extends ActiveRecord
{
    public static function tableName()
    {
        return '{{%role_permissions}}';
    }

    public static function primaryKey()
    {
        return ['role_id', 'permission_id'];
    }

    public function rules()
    {
        return [
            [['role_id', 'permission_id'], 'required'],
            [['role_id', 'permission_id'], 'integer'],
        ];
    }

    public function getRole()
    {
        return $this->hasOne(Role::class, ['id' => 'role_id']);
    }

    public function getPermission()
    {
        return $this->hasOne(Permission::class, ['id' => 'permission_id']);
    }
}
