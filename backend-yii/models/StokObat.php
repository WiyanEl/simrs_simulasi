<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\behaviors\TimestampBehavior;

class StokObat extends ActiveRecord
{
  public static function tableName()
  {
      return '{{%stok_obat}}';
  }

  public function rules()
  {
    return [
      [['obat_id'], 'required'],

      [['obat_id', 'stok', 'stok_minimum'], 'integer'],

      [['stok', 'stok_minimum'], 'default', 'value' => 0],

      [['stok', 'stok_minimum'], 'integer', 'min' => 0],

      [['harga_beli', 'harga_jual'], 'number', 'min' => 0],

      [['harga_beli', 'harga_jual'], 'default', 'value' => 0],

      [['obat_id'], 'exist',
        'skipOnError' => true,
        'targetClass' => Obat::class,
        'targetAttribute' => ['obat_id' => 'id'],
      ],

      [['obat_id'], 'unique'],
    ];
  }

  public function attributeLabels()
  {
    return [
      'id' => 'ID',
      'obat_id' => 'Obat',
      'stok' => 'Stok',
      'stok_minimum' => 'Stok Minimum',
      'harga_beli' => 'Harga Beli',
      'harga_jual' => 'Harga Jual',
      'created_at' => 'Dibuat Pada',
      'updated_at' => 'Diperbarui Pada',
    ];
  }

  public function getObat()
  {
    return $this->hasOne(Obat::class, ['id' => 'obat_id']);
  }
}
