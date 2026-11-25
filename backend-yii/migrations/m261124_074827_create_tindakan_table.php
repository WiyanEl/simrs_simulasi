<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%tindakan}}`.
 */
class m261124_074827_create_tindakan_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%tindakan}}', [
            'id' => $this->bigPrimaryKey(),

            'kode' => $this->string(30)->notNull(),
            'nama' => $this->string(150)->notNull(),

            'kategori' => $this->string(50)->notNull(),

            'deskripsi' => $this->text(),

            'tarif' => $this->decimal(15, 2)->notNull()->defaultValue(0),

            'is_active' => $this->boolean()->notNull()->defaultValue(true),

            'created_at' => $this->timestamp()->notNull()->defaultExpression('CURRENT_TIMESTAMP'),
            'updated_at' => $this->timestamp()->notNull()->defaultExpression('CURRENT_TIMESTAMP'),
        ]);

        $this->createIndex(
            'uq-tindakan-kode',
            '{{%tindakan}}',
            'kode',
            true
        );

        $this->createIndex(
            'idx-tindakan-nama',
            '{{%tindakan}}',
            'nama'
        );

        $this->createIndex(
            'idx-tindakan-kategori',
            '{{%tindakan}}',
            'kategori'
        );
    }


    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%tindakan}}');
    }
}
