<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%pasien}}`.
 */
class m261125_000852_create_pasien_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%pasien}}', [
            'id' => $this->bigPrimaryKey(),

            'no_rm' => $this->string(20)->notNull()->unique(),
            'nik' => $this->string(16)->null(),
            'no_kk' => $this->string(16)->null(),

            'nama' => $this->string(150)->notNull(),
            'tempat_lahir' => $this->string(100)->null(),
            'tanggal_lahir' => $this->date()->null(),
            'jenis_kelamin' => $this->string(1)->notNull(),

            'golongan_darah' => $this->string(3)->null(),
            'agama' => $this->string(20)->null(),
            'status_perkawinan' => $this->string(20)->null(),
            'pekerjaan' => $this->string(100)->null(),
            'pendidikan' => $this->string(50)->null(),

            'alamat' => $this->text()->null(),
            'provinsi' => $this->string(100)->null(),
            'kabupaten' => $this->string(100)->null(),
            'kecamatan' => $this->string(100)->null(),
            'kelurahan' => $this->string(100)->null(),
            'kode_pos' => $this->string(5)->null(),

            'no_hp' => $this->string(20)->null(),
            'email' => $this->string(100)->null(),

            'nama_penanggung_jawab' => $this->string(150)->null(),
            'hubungan_penanggung_jawab' => $this->string(50)->null(),
            'no_hp_penanggung_jawab' => $this->string(20)->null(),

            'is_active' => $this->boolean()->notNull()->defaultValue(true),

            'created_at' => $this->timestamp()->notNull()->defaultExpression('CURRENT_TIMESTAMP'),
            'updated_at' => $this->timestamp()->notNull()->defaultExpression('CURRENT_TIMESTAMP'),
        ]);

        $this->createIndex(
            'idx-pasien-nik',
            '{{%pasien}}',
            'nik'
        );

        $this->createIndex(
            'idx-pasien-nama',
            '{{%pasien}}',
            'nama'
        );

        $this->createIndex(
            'idx-pasien-no_hp',
            '{{%pasien}}',
            'no_hp'
        );

        $this->createIndex(
            'idx-pasien-tanggal_lahir',
            '{{%pasien}}',
            'tanggal_lahir'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%pasien}}');
    }
}
