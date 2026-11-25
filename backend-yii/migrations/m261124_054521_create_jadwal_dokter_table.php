<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%jadwal_dokter}}`.
 */
class m261124_054521_create_jadwal_dokter_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%jadwal_dokter}}', [
            'id' => $this->bigPrimaryKey(),

            'dokter_id' => $this->bigInteger()->notNull(),
            'ruangan_id' => $this->bigInteger()->notNull(),

            'hari' => $this->smallInteger()->notNull(),

            'jam_mulai' => $this->time()->notNull(),
            'jam_selesai' => $this->time()->notNull(),

            'kuota' => $this->integer()->notNull()->defaultValue(20),

            'is_active' => $this->boolean()->notNull()->defaultValue(true),

            'created_at' => $this->timestamp()->notNull()
                ->defaultExpression('CURRENT_TIMESTAMP'),

            'updated_at' => $this->timestamp()->notNull()
                ->defaultExpression('CURRENT_TIMESTAMP'),
        ]);

        $this->addForeignKey(
            'fk-jadwal-dokter-dokter',
            '{{%jadwal_dokter}}',
            'dokter_id',
            '{{%dokter}}',
            'id',
            'RESTRICT',
            'CASCADE'
        );

        $this->addForeignKey(
            'fk-jadwal-dokter-ruangan',
            '{{%jadwal_dokter}}',
            'ruangan_id',
            '{{%ruangan}}',
            'id',
            'RESTRICT',
            'CASCADE'
        );

        $this->createIndex(
            'idx-jadwal-dokter-dokter-hari',
            '{{%jadwal_dokter}}',
            ['dokter_id', 'hari']
        );

        $this->createIndex(
            'idx-jadwal-dokter-ruangan',
            '{{%jadwal_dokter}}',
            'ruangan_id'
        );

        $this->createIndex(
            'idx-jadwal-dokter-active',
            '{{%jadwal_dokter}}',
            'is_active'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%jadwal_dokter}}');
    }
}
