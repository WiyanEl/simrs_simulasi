<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\db\Query;
use yii\web\IdentityInterface;

class User extends ActiveRecord implements IdentityInterface
{
    const STATUS_INACTIVE = 0;
    const STATUS_ACTIVE = 10;

    public static function tableName()
    {
        return '{{%users}}';
    }

    public static function findIdentity($id)
    {
        return static::findOne([
            'id' => $id,
            'status' => self::STATUS_ACTIVE,
        ]);
    }

    public static function findIdentityByAccessToken(
        $token,
        $type = null
    ) {
        $tokenHash = hash('sha256', $token);

        return static::find()
            ->alias('u')
            ->innerJoin(
                '{{%user_access_tokens}} t',
                't.user_id = u.id'
            )
            ->where([
                'u.status' => self::STATUS_ACTIVE,
                't.token_hash' => $tokenHash,
            ])
            ->andWhere(['t.revoked_at' => null])
            ->andWhere(['>', 't.expires_at', time()])
            ->one();
    }

    public static function findByUsername($username)
    {
        return static::findOne([
            'username' => $username,
        ]);
    }

    public function getId()
    {
        return $this->id;
    }

    public function getAuthKey()
    {
        return '';
    }

    public function validateAuthKey($authKey)
    {
        return false;
    }

    public function getPegawai()
    {
        return $this->hasOne(Pegawai::class, [
            'id' => 'pegawai_id'
        ]);
    }

    public function getUserRoles()
    {
        return $this->hasMany(UserRole::class, [
            'user_id' => 'id'
        ]);
    }

    public function getRoles()
    {
        return (new Query())
            ->select([
                'r.id',
                'r.role_code',
                'r.name',
                'r.description',
            ])
            ->from(['ur' => '{{%user_roles}}'])
            ->innerJoin(
                ['r' => '{{%roles}}'],
                'r.id = ur.role_id'
            )
            ->where(['ur.user_id' => $this->id])
            ->all();
    }

    public function getPermissions()
    {
        return (new Query())
            ->select(['p.permission_code'])
            ->distinct()
            ->from(['rp' => '{{%role_permissions}}'])
            ->innerJoin(
                ['p' => '{{%permissions}}'],
                'p.id = rp.permission_id'
            )
            ->innerJoin(
                ['ur' => '{{%user_roles}}'],
                'ur.role_id = rp.role_id'
            )
            ->where(['ur.user_id' => $this->id])
            ->column();
    }

    public function canAccess($permissionCode)
    {
        return in_array(
            $permissionCode,
            $this->getPermissions(),
            true
        );
    }

    public function hasRole($roleCode)
    {
        foreach ($this->getRoles() as $role) {
            if ($role['role_code'] === $roleCode) {
                return true;
            }
        }

        return false;
    }

    public function setPassword($password)
    {
        $this->password_hash = Yii::$app->security
            ->generatePasswordHash($password);
    }

    public function validatePassword($password)
    {
        return Yii::$app->security->validatePassword(
            $password,
            $this->password_hash
        );
    }

    public function isActive()
    {
        return (int) $this->status === self::STATUS_ACTIVE;
    }
}
