<?php

namespace app\models;

use yii\db\ActiveRecord;

class Ruangan extends ActiveRecord
{
    public static function tableName()
    {
        return '{{%ruangan}}';
    }

    public function rules()
    {
        return [
            [['kode', 'nama', 'jenis_ruangan'], 'required'],

            [['kode'], 'string', 'max' => 30],
            [['nama'], 'string', 'max' => 150],
            [['jenis_ruangan'], 'string', 'max' => 30],
            [['lokasi'], 'string', 'max' => 150],
            [['keterangan'], 'string'],

            [['jenis_ruangan'], 'in', 'range' => [
                'RAWAT_JALAN',
                'GAWAT_DARURAT',
                'PENUNJANG',
                'LAINNYA',
            ]],

            [['is_active'], 'boolean'],

            [['kode'], 'unique'],
        ];
    }

    public function attributeLabels()
    {
        return [
            'kode' => 'Kode ruangan',
            'nama' => 'Nama ruangan',
            'jenis_ruangan' => 'Jenis ruangan',
            'lokasi' => 'Lokasi',
            'keterangan' => 'Keterangan',
            'is_active' => 'Status Aktif',
        ];
    }
}
