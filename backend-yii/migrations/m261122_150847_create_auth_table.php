<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%auth}}`.
 */
class m261122_150847_create_auth_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%roles}}', [
            'id' => $this->bigPrimaryKey(),
            'role_code' => $this->string(50)->notNull()->unique(),
            'name' => $this->string(100)->notNull(),
            'description' => $this->text(),
            'created_at' => $this->integer(),
            'updated_at' => $this->integer(),
        ]);

        $this->createTable('{{%users}}', [
            'id' => $this->bigPrimaryKey(),
            'username' => $this->string(100)->notNull()->unique(),
            'email' => $this->string(150)->unique(),
            'password_hash' => $this->string()->notNull(),
            'status' => $this->smallInteger()->notNull()->defaultValue(10),
            'pegawai_id' => $this->bigInteger()->notNull(),
            'created_at' => $this->integer(),
            'updated_at' => $this->integer(),
        ]);

        $this->createTable('{{%user_roles}}', [
            'user_id' => $this->bigInteger()->notNull(),
            'role_id' => $this->bigInteger()->notNull(),
        ]);

        $this->addPrimaryKey(
            'pk-user_roles',
            '{{%user_roles}}',
            ['user_id', 'role_id']
        );

        $this->addForeignKey(
            'fk-user_roles-user',
            '{{%user_roles}}',
            'user_id',
            '{{%users}}',
            'id',
            'CASCADE'
        );

        $this->addForeignKey(
            'fk-user_roles-role',
            '{{%user_roles}}',
            'role_id',
            '{{%roles}}',
            'id',
            'CASCADE'
        );

        $this->addForeignKey(
            'fk-users-pegawai',
            '{{%users}}',
            'pegawai_id',
            '{{%pegawai}}',
            'id',
            'SET NULL',
            'CASCADE'
        );

        $this->createTable('{{%user_access_tokens}}', [
            'id' => $this->bigPrimaryKey(),
            'user_id' => $this->bigInteger()->notNull(),
            'token_hash' => $this->char(64)->notNull()->unique(),
            'expires_at' => $this->integer()->notNull(),
            'revoked_at' => $this->integer(),
            'created_at' => $this->integer(),
        ]);

        $this->addForeignKey(
            'fk-access_tokens-user',
            '{{%user_access_tokens}}',
            'user_id',
            '{{%users}}',
            'id',
            'CASCADE'
        );

        $now = time();

        $this->batchInsert(
            '{{%roles}}',
            ['role_code', 'name', 'description', 'created_at', 'updated_at'],
            [
                ['ADMIN', 'Administrator', 'Administrator Sistem', $now, $now],
                ['REGISTRATION', 'Pendaftaran', 'Petugas Pendaftaran', $now, $now],
                ['DOCTOR', 'Dokter', 'Tenaga Medis Dokter', $now, $now],
                ['PHARMACY', 'Farmasi', 'Petugas Farmasi', $now, $now],
                ['CASHIER', 'Kasir', 'Petugas Kasir', $now, $now],
            ]
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%user_access_tokens}}');
        $this->dropTable('{{%user_roles}}');
        $this->dropTable('{{%users}}');
        $this->dropTable('{{%roles}}');
    }
}
