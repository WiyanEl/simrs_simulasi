<?php

namespace app\models;

use yii\db\ActiveRecord;

class Pendaftaran extends ActiveRecord
{
  public static function tableName()
  {
    return '{{%pendaftaran}}';
  }

  public function rules()
  {
    return [
      [
        [
          'no_registrasi',
          'pasien_id',
          'ruangan_id',
          'dokter_id',
          'jadwal_dokter_id',
          'tanggal_kunjungan',
          'jenis_kunjungan',
          'jenis_pembayaran',
          'status'
        ],
        'required'
      ],

      [
        [
          'pasien_id',
          'ruangan_id',
          'dokter_id',
          'jadwal_dokter_id',
          'created_by'
        ],
        'integer'
      ],

      [
        'tanggal_kunjungan',
        'date',
        'format' => 'php:Y-m-d'
      ],

      [
        'no_registrasi',
        'string',
        'max' => 30
      ],

      [
        'no_registrasi',
        'unique'
      ],

      [
        'jenis_kunjungan',
        'in',
        'range' => ['BARU', 'LAMA']
      ],

      [
        'jenis_pembayaran',
        'in',
        'range' => ['UMUM', 'BPJS', 'ASURANSI']
      ],

      [
        'status',
        'in',
        'range' => [
          'TERDAFTAR',
          'DIBATALKAN',
          'SELESAI'
        ]
      ],

      [
        'keluhan',
        'string'
      ],
    ];
  }

  public function attributeLabels()
  {
    return [
      'no_registrasi' => 'Nomor Registrasi',
      'pasien_id' => 'Pasien',
      'ruangan_id' => 'ruangan',
      'dokter_id' => 'Dokter',
      'jadwal_dokter_id' => 'Jadwal Dokter',
      'tanggal_kunjungan' => 'Tanggal Kunjungan',
      'jenis_kunjungan' => 'Jenis Kunjungan',
      'jenis_pembayaran' => 'Jenis Pembayaran',
      'keluhan' => 'Keluhan',
      'status' => 'Status',
    ];
  }

    public function getPasien()
    {
      return $this->hasOne(Pasien::class, ['id' => 'pasien_id']);
    }

    public function getRuangan()
    {
      return $this->hasOne(Ruangan::class, ['id' => 'ruangan_id']);
    }

    public function getDokter()
    {
      return $this->hasOne(Dokter::class, ['id' => 'dokter_id']);
    }

    public function getJadwalDokter()
    {
      return $this->hasOne(
        JadwalDokter::class,
        ['id' => 'jadwal_dokter_id']
      );
    }

    public function getAntrean()
    {
      return $this->hasOne(
        Antrean::class,
        ['pendaftaran_id' => 'id']
      );
    }

    public function getRiwayatKunjungans()
    {
      return $this->hasMany(
        RiwayatKunjungan::class,
        ['pendaftaran_id' => 'id']
      )->orderBy(['created_at' => SORT_DESC]);
    }

    public function getPetugas()
    {
      return $this->hasOne(User::class, ['id' => 'created_by']);
    }

    public function fields()
    {
      return array_merge(parent::fields(), [
        'pasien',
        'ruangan',
        'dokter',
        'jadwalDokter',
        'antrean',
      ]);
    }
}
