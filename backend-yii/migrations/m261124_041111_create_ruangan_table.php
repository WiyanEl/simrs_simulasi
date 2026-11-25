<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%ruangan}}`.
 */
class m261124_041111_create_ruangan_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%ruangan}}', [
            'id' => $this->bigPrimaryKey(),

            'kode' => $this->string(30)->notNull(),
            'nama' => $this->string(150)->notNull(),

            'jenis_ruangan' => $this->string(30)
                ->notNull()
                ->defaultValue('RAWAT_JALAN'),

            'lokasi' => $this->string(150)->null(),
            'keterangan' => $this->text()->null(),

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
            'uq-ruangan-kode',
            '{{%ruangan}}',
            'kode',
            true
        );

        $this->createIndex(
            'idx-ruangan-nama',
            '{{%ruangan}}',
            'nama'
        );

        $this->createIndex(
            'idx-ruangan-jenis',
            '{{%ruangan}}',
            'jenis_ruangan'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%ruangan}}');
    }
}
