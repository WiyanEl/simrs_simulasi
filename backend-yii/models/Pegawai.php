<?php

namespace app\models;

use yii\db\ActiveRecord;

class Pegawai extends ActiveRecord
{
  public static function tableName()
  {
      return '{{%pegawai}}';
  }

  public function rules()
  {
    return [
      [['kode_pegawai', 'nama_lengkap', 'jenis_kelamin', 'jenis_pegawai'], 'required'],
      [['tanggal_lahir', 'tanggal_bergabung'], 'date', 'format' => 'php:Y-m-d'],
      [['alamat'], 'string'],
      [['kode_pegawai'], 'string', 'max' => 30],
      [['nip'], 'string', 'max' => 30],
      [['nama_lengkap'], 'string', 'max' => 150],
      [['jenis_kelamin'], 'in', 'range' => ['L', 'P']],
      [['tempat_lahir'], 'string', 'max' => 100],
      [['no_hp'], 'string', 'max' => 20],
      [['email'], 'email'],
      [['email'], 'string', 'max' => 100],
      [['jenis_pegawai'], 'in', 'range' => [
        'DOKTER',
        'PERAWAT',
        'BIDAN',
        'APOTEKER',
        'TENAGA_MEDIS',
        'ADMINISTRASI',
        'NON_MEDIS',
      ]],
      [['is_active'], 'boolean'],
      [['kode_pegawai'], 'unique'],
      [['nip'], 'unique'],
    ];
  }

  public function attributeLabels()
  {
    return [
      'kode_pegawai' => 'Kode Pegawai',
      'nip' => 'NIP',
      'nama_lengkap' => 'Nama Lengkap',
      'jenis_kelamin' => 'Jenis Kelamin',
      'tempat_lahir' => 'Tempat Lahir',
      'tanggal_lahir' => 'Tanggal Lahir',
      'no_hp' => 'Nomor HP',
      'email' => 'Email',
      'alamat' => 'Alamat',
      'jenis_pegawai' => 'Jenis Pegawai',
      'tanggal_bergabung' => 'Tanggal Bergabung',
      'is_active' => 'Status Aktif',
    ];
  }

  public function getDokter()
  {
    return $this->hasOne(Dokter::class, ['pegawai_id' => 'id']);
  }
}
