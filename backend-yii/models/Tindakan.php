<?php

namespace app\models;

use yii\db\ActiveRecord;
use yii\behaviors\TimestampBehavior;

class Tindakan extends ActiveRecord
{
    const KATEGORI = [
      'KONSULTASI',
      'PEMERIKSAAN',
      'LABORATORIUM',
      'RADIOLOGI',
      'TINDAKAN_MEDIS',
      'OPERASI',
      'LAINNYA',
    ];

    public static function tableName()
    {
      return '{{%tindakan}}';
    }

    public function rules()
    {
      return [
        [['kode', 'nama', 'kategori', 'tarif'], 'required'],
        [['kode'], 'string', 'max' => 30],
        [['nama'], 'string', 'max' => 150],
        [['kategori'], 'string', 'max' => 50],
        [['deskripsi'], 'string'],
        [['kategori'], 'in', 'range' => self::KATEGORI],
        [['tarif'], 'number', 'min' => 0],
        [['is_active'], 'boolean'],
        [['kode'], 'unique'],
      ];
    }

    public function attributeLabels()
    {
      return [
        'id' => 'ID',
        'kode' => 'Kode Tindakan',
        'nama' => 'Nama Tindakan',
        'kategori' => 'Kategori',
        'deskripsi' => 'Deskripsi',
        'tarif' => 'Tarif Tindakan',
        'is_active' => 'Status Aktif',
        'created_at' => 'Dibuat Pada',
        'updated_at' => 'Diperbarui Pada',
      ];
    }
}
