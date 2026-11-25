<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%pegawai}}`.
 */
class m261123_061617_create_pegawai_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%pegawai}}', [
            'id' => $this->bigPrimaryKey(),

            'kode_pegawai' => $this->string(30)->notNull(),
            'nip' => $this->string(30)->null(),

            'nama_lengkap' => $this->string(150)->notNull(),
            'jenis_kelamin' => $this->char(1)->notNull(),

            'tempat_lahir' => $this->string(100)->null(),
            'tanggal_lahir' => $this->date()->null(),

            'no_hp' => $this->string(20)->null(),
            'email' => $this->string(100)->null(),
            'alamat' => $this->text()->null(),

            'jenis_pegawai' => $this->string(30)->notNull(),

            'tanggal_bergabung' => $this->date()->null(),

            'is_active' => $this->boolean()
                ->notNull()
                ->defaultValue(true),

            'created_at' => $this->timestamp()
                ->notNull()
                ->defaultExpression('CURRENT_TIMESTAMP'),

            'updated_at' => $this->timestamp()
                ->notNull()
                ->defaultExpression('CURRENT_TIMESTAMP'),
        ]);

        $this->createIndex(
            'uq-pegawai-kode',
            '{{%pegawai}}',
            'kode_pegawai',
            true
        );

        $this->createIndex(
            'uq-pegawai-nip',
            '{{%pegawai}}',
            'nip',
            true
        );

        $this->createIndex(
            'idx-pegawai-nama',
            '{{%pegawai}}',
            'nama_lengkap'
        );

        $this->createIndex(
            'idx-pegawai-jenis',
            '{{%pegawai}}',
            'jenis_pegawai'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%pegawai}}');
    }
}
