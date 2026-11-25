<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

class Obat extends ActiveRecord
{
  public static function tableName()
  {
    return '{{%obat}}';
  }

  public function rules()
  {
    return [
      [['kode', 'nama', 'satuan'], 'required'],

      [['kode'], 'string', 'max' => 50],
      [['nama'], 'string', 'max' => 255],
      [['satuan'], 'string', 'max' => 50],

      [['kode'], 'unique'],

      [['is_active'], 'boolean'],

      [['is_active'], 'default', 'value' => true],
    ];
  }

  public function attributeLabels()
  {
    return [
      'id' => 'ID',
      'kode' => 'Kode Obat',
      'nama' => 'Nama Obat',
      'satuan' => 'Satuan',
      'is_active' => 'Status Aktif',
      'created_at' => 'Dibuat Pada',
      'updated_at' => 'Diperbarui Pada',
    ];
  }

  public function getStokObat()
  {
    return $this->hasOne(StokObat::class, ['obat_id' => 'id']);
  }
}
