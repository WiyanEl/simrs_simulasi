<?php

namespace app\models;

use yii\db\ActiveRecord;
use yii\behaviors\TimestampBehavior;

class Role extends ActiveRecord
{
    public static function tableName()
    {
        return '{{%roles}}';
    }

    public function behaviors()
    {
        return [
            [
                'class' => TimestampBehavior::class,
                'value' => time(),
            ],
        ];
    }

    public function rules()
    {
        return [
            [['role_code', 'name'], 'required'],
            [['description'], 'string'],
            [['created_at', 'updated_at'], 'integer'],
            [['role_code'], 'string', 'max' => 100],
            [['name'], 'string', 'max' => 255],
            [['role_code'], 'unique'],
        ];
    }

    public function getUserRoles()
    {
        return $this->hasMany(UserRole::class, ['role_id' => 'id']);
    }

    public function getUsers()
    {
        return $this->hasMany(User::class, ['id' => 'user_id'])
            ->viaTable('{{%user_role}}', ['role_id' => 'id']);
    }

    public function getPermissions()
    {
        return $this->hasMany(Permission::class, ['id' => 'permission_id'])
            ->viaTable('{{%role_permissions}}', ['role_id' => 'id']);
    }
}
