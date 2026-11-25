<?php

namespace app\models;

use yii\db\ActiveRecord;

class UserRole extends ActiveRecord
{
    public static function tableName()
    {
        return '{{%user_roles}}';
    }

    public static function primaryKey()
    {
        return ['user_id', 'role_id'];
    }

    public function rules()
    {
        return [
            [['user_id', 'role_id'], 'required'],
            [['user_id', 'role_id'], 'integer'],
        ];
    }

    public function getUser()
    {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    public function getRole()
    {
        return $this->hasOne(Role::class, ['id' => 'role_id']);
    }
}
