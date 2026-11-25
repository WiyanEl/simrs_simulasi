<?php

namespace app\models;

use yii\db\ActiveRecord;

class RiwayatKunjungan extends ActiveRecord
{
  public static function tableName()
  {
    return '{{%riwayat_kunjungan}}';
  }

  public function rules()
  {
    return [
      [
        [
          'pendaftaran_id',
          'pasien_id',
          'aktivitas'
        ],
        'required'
      ],

      [
        ['pendaftaran_id', 'pasien_id', 'user_id'],
        'integer'
      ],

      [
        'aktivitas',
        'string',
        'max' => 50
      ],

      [
        ['status_sebelumnya', 'status_sesudahnya'],
        'string',
        'max' => 30
      ],

      [
        'keterangan',
        'string'
      ],
    ];
  }

  public function attributeLabels()
  {
    return [
      'pendaftaran_id' => 'Pendaftaran',
      'pasien_id' => 'Pasien',
      'aktivitas' => 'Aktivitas',
      'status_sebelumnya' => 'Status Sebelumnya',
      'status_sesudahnya' => 'Status Sesudahnya',
      'keterangan' => 'Keterangan',
      'user_id' => 'Petugas',
    ];
  }

    public function getPendaftaran()
    {
      return $this->hasOne(
        Pendaftaran::class,
        ['id' => 'pendaftaran_id']
      );
    }

    public function getPasien()
    {
      return $this->hasOne(
        Pasien::class,
        ['id' => 'pasien_id']
      );
    }

    public function getPetugas()
    {
      return $this->hasOne(
        User::class,
        ['id' => 'user_id']
      );
    }
}
