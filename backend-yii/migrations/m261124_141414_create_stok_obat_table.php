<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%stok_obat}}`.
 */
class m261124_141414_create_stok_obat_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%stok_obat}}', [
            'id' => $this->bigPrimaryKey(),

            'obat_id' => $this->bigInteger()->notNull(),

            'stok' => $this->integer()->notNull()->defaultValue(0),
            'stok_minimum' => $this->integer()->notNull()->defaultValue(0),

            'harga_beli' => $this->decimal(15, 2)->notNull()->defaultValue(0),
            'harga_jual' => $this->decimal(15, 2)->notNull()->defaultValue(0),

            'created_at' => $this->timestamp()->notNull()->defaultExpression('CURRENT_TIMESTAMP'),
            'updated_at' => $this->timestamp()->notNull()->defaultExpression('CURRENT_TIMESTAMP'),
        ]);

        $this->createIndex(
            'idx-stok_obat-obat_id',
            '{{%stok_obat}}',
            'obat_id',
            true
        );

        $this->addForeignKey(
            'fk-stok_obat-obat_id',
            '{{%stok_obat}}',
            'obat_id',
            '{{%obat}}',
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
        $this->dropTable('{{%stok_obat}}');
    }
}
