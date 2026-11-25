<?php

namespace app\models;

use yii\db\ActiveRecord;

class Dokter extends ActiveRecord
{
    public static function tableName()
    {
        return '{{%dokter}}';
    }

    public function rules()
    {
        return [
            [['pegawai_id', 'no_str', 'no_sip'], 'required'],

            [['pegawai_id'], 'integer'],

            [['masa_berlaku_str', 'masa_berlaku_sip'], 'date', 'format' => 'php:Y-m-d'],

            [['no_str', 'no_sip'], 'string', 'max' => 50],

            [['spesialisasi', 'sub_spesialisasi'], 'string', 'max' => 100],

            [['pegawai_id'], 'unique'],

            [['no_str'], 'unique'],
            [['no_sip'], 'unique'],

            [
                ['pegawai_id'],
                'exist',
                'targetClass' => Pegawai::class,
                'targetAttribute' => ['pegawai_id' => 'id'],
            ],

            ['pegawai_id', 'validatePegawaiDokter'],
        ];
    }

    public function validatePegawaiDokter($attribute)
    {
        if ($this->hasErrors()) {
            return;
        }

        $pegawai = Pegawai::findOne($this->pegawai_id);

        if (!$pegawai || $pegawai->jenis_pegawai !== 'DOKTER') {
            $this->addError(
                $attribute,
                'Pegawai yang dipilih harus memiliki jenis pegawai DOKTER.'
            );
        }
    }

    public function attributeLabels()
    {
        return [
            'pegawai_id' => 'Pegawai',
            'no_str' => 'Nomor STR',
            'masa_berlaku_str' => 'Masa Berlaku STR',
            'no_sip' => 'Nomor SIP',
            'masa_berlaku_sip' => 'Masa Berlaku SIP',
            'spesialisasi' => 'Spesialisasi',
            'sub_spesialisasi' => 'Sub Spesialisasi',
        ];
    }

    public function getPegawai()
    {
        return $this->hasOne(Pegawai::class, ['id' => 'pegawai_id']);
    }
}
