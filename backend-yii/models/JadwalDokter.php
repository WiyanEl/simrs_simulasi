<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\db\Expression;
use yii\behaviors\TimestampBehavior;

class JadwalDokter extends ActiveRecord
{
  public static function tableName()
  {
    return '{{%jadwal_dokter}}';
  }

  public function behaviors()
  {
    return [
      [
        'class' => TimestampBehavior::class,
        'value' => new Expression('CURRENT_TIMESTAMP'),
        'attributes' => [
          ActiveRecord::EVENT_BEFORE_INSERT => [
            'created_at',
            'updated_at',
          ],
          ActiveRecord::EVENT_BEFORE_UPDATE => [
            'updated_at',
          ],
        ],
      ],
    ];
  }

  public function rules()
  {
    return [
      [['dokter_id', 'ruangan_id', 'hari', 'jam_mulai', 'jam_selesai'], 'required'],

      [['dokter_id', 'ruangan_id'], 'integer'],

      [['hari'], 'integer', 'min' => 1, 'max' => 7],

      [['kuota'], 'integer', 'min' => 1],

      [['is_active'], 'boolean'],

      [['jam_mulai', 'jam_selesai'], 'string', 'max' => 8],

      [
        ['dokter_id'],
        'exist',
        'skipOnError' => true,
        'targetClass' => Dokter::class,
        'targetAttribute' => ['dokter_id' => 'id'],
      ],

      [
        ['ruangan_id'],
        'exist',
        'skipOnError' => true,
        'targetClass' => Ruangan::class,
        'targetAttribute' => ['ruangan_id' => 'id'],
      ],

      [['jam_selesai'], 'validateJamPraktik'],
      [['dokter_id'], 'validateJadwalBentrok'],
    ];
}

  public function validateJamPraktik($attribute)
  {
      if (
        $this->jam_mulai &&
        $this->jam_selesai &&
        $this->jam_mulai >= $this->jam_selesai
      ) {
        $this->addError(
          $attribute,
          'Jam selesai harus lebih besar dari jam mulai.'
        );
      }
  }

  public function validateJadwalBentrok($attribute)
  {
      if (
        !$this->is_active ||
        !$this->dokter_id ||
        !$this->hari ||
        !$this->jam_mulai ||
        !$this->jam_selesai
      ) {
          return;
      }

      $query = self::find()
        ->where([
          'dokter_id' => $this->dokter_id,
          'hari' => $this->hari,
          'is_active' => true,
        ])
        ->andWhere(['<', 'jam_mulai', $this->jam_selesai])
        ->andWhere(['>', 'jam_selesai', $this->jam_mulai]);

      if (!$this->isNewRecord) {
        $query->andWhere(['<>', 'id', $this->id]);
      }

      if ($query->exists()) {
        $this->addError(
          $attribute,
          'Dokter sudah memiliki jadwal praktik pada waktu tersebut.'
        );
      }
  }

  public function getDokter()
  {
      return $this->hasOne(Dokter::class, ['id' => 'dokter_id']);
  }

  public function getRuangan()
  {
      return $this->hasOne(Ruangan::class, ['id' => 'ruangan_id']);
  }

  public function getHariNama()
  {
    $hari = [
      1 => 'Senin',
      2 => 'Selasa',
      3 => 'Rabu',
      4 => 'Kamis',
      5 => 'Jumat',
      6 => 'Sabtu',
      7 => 'Minggu',
    ];

    return $hari[$this->hari] ?? null;
  }

  public function fields()
  {
    return [
      'id',
      'dokter_id',
      'ruangan_id',
      'hari',
      'hari_nama' => function ($model) {
        return $model->getHariNama();
      },
      'jam_mulai',
      'jam_selesai',
      'kuota',
      'is_active',
      'created_at',
      'updated_at',
    ];
  }

  public function extraFields()
  {
    return [
      'dokter',
      'ruangan',
    ];
  }

  public function init()
  {
      parent::init();

      $this->is_active = true;
      $this->kuota = 20;
  }
}
