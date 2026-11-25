<?php

namespace app\models;

use yii\db\ActiveRecord;

class Antrean extends ActiveRecord
{
  public static function tableName()
  {
    return '{{%antrean}}';
  }

  public function rules()
  {
    return [
      [
        [
          'pendaftaran_id',
          'tanggal',
          'ruangan_id',
          'nomor_antrean',
          'kode_antrean',
          'status'
        ],
        'required'
      ],

      [
        ['pendaftaran_id', 'ruangan_id', 'nomor_antrean'],
        'integer'
      ],

      [
        'nomor_antrean',
        'integer',
        'min' => 1
      ],

      [
        'tanggal',
        'date',
        'format' => 'php:Y-m-d'
      ],

      [
        'kode_antrean',
        'string',
        'max' => 20
      ],

      [
        'status',
        'in',
        'range' => [
          'MENUNGGU',
          'DIPANGGIL',
          'DILAYANI',
          'SELESAI',
          'BATAL',
          'DILEWATI'
        ]
      ],

      [
        ['waktu_panggil', 'waktu_mulai', 'waktu_selesai'],
        'safe'
      ],
    ];
  }

    public function attributeLabels()
    {
      return [
        'pendaftaran_id' => 'Pendaftaran',
        'tanggal' => 'Tanggal Antrean',
        'ruangan_id' => 'ruangan',
        'nomor_antrean' => 'Nomor Antrean',
        'kode_antrean' => 'Kode Antrean',
        'status' => 'Status Antrean',
      ];
    }

    public function getPendaftaran()
    {
      return $this->hasOne(
        Pendaftaran::class,
        ['id' => 'pendaftaran_id']
      );
    }

    public function getruangan()
    {
      return $this->hasOne(
        Ruangan::class,
        ['id' => 'ruangan_id']
      );
    }

    public function fields()
    {
      return array_merge(parent::fields(), [
        'pendaftaran',
        'ruangan',
      ]);
    }
}
