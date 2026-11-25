<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\behaviors\TimestampBehavior;

class Pasien extends ActiveRecord
{
  public static function tableName()
  {
    return '{{%pasien}}';
  }

  public function rules()
  {
    return [
      [['no_rm', 'nama', 'jenis_kelamin'], 'required'],

      [['tanggal_lahir'], 'date', 'format' => 'php:Y-m-d'],

      [['is_active'], 'boolean'],

      [['alamat'], 'string'],

      [[
          'no_rm',
          'nama_penanggung_jawab',
      ], 'string', 'max' => 150],

      [['tempat_lahir'], 'string', 'max' => 100],

      [[
          'nik',
      ], 'string', 'length' => 16],

      [['jenis_kelamin'], 'in', 'range' => ['L', 'P']],

      [['golongan_darah'], 'in', 'range' => [
          'A', 'B', 'AB', 'O'
      ]],

      [['agama'], 'string', 'max' => 20],

      [['status_perkawinan'], 'string', 'max' => 20],

      [['pekerjaan'], 'string', 'max' => 100],

      [['pendidikan'], 'string', 'max' => 50],

      [[
          'provinsi',
          'kabupaten',
          'kecamatan',
          'kelurahan',
      ], 'string', 'max' => 100],

      [['kode_pos'], 'string', 'max' => 5],

      [['no_hp', 'no_hp_penanggung_jawab'], 'string', 'max' => 20],

      [['email'], 'email'],

      [['email'], 'string', 'max' => 100],

      [['hubungan_penanggung_jawab'], 'string', 'max' => 50],

      [['no_rm'], 'unique'],

      [['nik'], 'unique', 'skipOnEmpty' => true],

      [['no_rm', 'nama'], 'trim'],

      [['is_active'], 'default', 'value' => true],
    ];
  }

  public function attributeLabels()
  {
    return [
      'id' => 'ID',
      'no_rm' => 'Nomor Rekam Medis',
      'nik' => 'NIK',
      'no_kk' => 'Nomor KK',
      'nama' => 'Nama Pasien',
      'tempat_lahir' => 'Tempat Lahir',
      'tanggal_lahir' => 'Tanggal Lahir',
      'jenis_kelamin' => 'Jenis Kelamin',
      'golongan_darah' => 'Golongan Darah',
      'agama' => 'Agama',
      'status_perkawinan' => 'Status Perkawinan',
      'pekerjaan' => 'Pekerjaan',
      'pendidikan' => 'Pendidikan',
      'alamat' => 'Alamat',
      'provinsi' => 'Provinsi',
      'kabupaten' => 'Kabupaten/Kota',
      'kecamatan' => 'Kecamatan',
      'kelurahan' => 'Kelurahan/Desa',
      'kode_pos' => 'Kode Pos',
      'no_hp' => 'Nomor HP',
      'email' => 'Email',
      'nama_penanggung_jawab' => 'Nama Penanggung Jawab',
      'hubungan_penanggung_jawab' => 'Hubungan Penanggung Jawab',
      'no_hp_penanggung_jawab' => 'Nomor HP Penanggung Jawab',
      'is_active' => 'Status Aktif',
      'created_at' => 'Dibuat Pada',
      'updated_at' => 'Diperbarui Pada',
    ];
  }
}
