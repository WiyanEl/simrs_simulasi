<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%dokter}}`.
 */
class m261123_061901_create_dokter_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%dokter}}', [
            'id' => $this->bigPrimaryKey(),

            'pegawai_id' => $this->bigInteger()->notNull(),

            'no_str' => $this->string(50)->notNull(),
            'masa_berlaku_str' => $this->date()->null(),

            'no_sip' => $this->string(50)->notNull(),
            'masa_berlaku_sip' => $this->date()->null(),

            'spesialisasi' => $this->string(100)->null(),
            'sub_spesialisasi' => $this->string(100)->null(),

            'created_at' => $this->timestamp()
                ->notNull()
                ->defaultExpression('CURRENT_TIMESTAMP'),

            'updated_at' => $this->timestamp()
                ->notNull()
                ->defaultExpression('CURRENT_TIMESTAMP'),
        ]);

        $this->createIndex(
            'uq-dokter-pegawai',
            '{{%dokter}}',
            'pegawai_id',
            true
        );

        $this->createIndex(
            'uq-dokter-str',
            '{{%dokter}}',
            'no_str',
            true
        );

        $this->createIndex(
            'uq-dokter-sip',
            '{{%dokter}}',
            'no_sip',
            true
        );

        $this->addForeignKey(
            'fk-dokter-pegawai',
            '{{%dokter}}',
            'pegawai_id',
            '{{%pegawai}}',
            'id',
            'RESTRICT',
            'CASCADE'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%dokter}}');
    }
}
