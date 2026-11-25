<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%pendaftaran_antrian}}`.
 */
class m261125_015054_create_pendaftaran_antrian_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%pendaftaran}}', [
            'id' => $this->bigPrimaryKey(),

            'no_registrasi' => $this->string(30)->notNull(),

            'pasien_id' => $this->bigInteger()->notNull(),
            'ruangan_id' => $this->bigInteger()->notNull(),
            'dokter_id' => $this->bigInteger()->notNull(),
            'jadwal_dokter_id' => $this->bigInteger()->notNull(),

            'tanggal_kunjungan' => $this->date()->notNull(),

            'jenis_kunjungan' => $this->string(20)->notNull(),
            'jenis_pembayaran' => $this->string(30)->notNull(),

            'keluhan' => $this->text(),

            'status' => $this->string(20)->notNull()
                ->defaultValue('TERDAFTAR'),

            'created_by' => $this->bigInteger(),

            'created_at' => $this->timestamp()
                ->notNull()
                ->defaultExpression('CURRENT_TIMESTAMP'),

            'updated_at' => $this->timestamp()
                ->notNull()
                ->defaultExpression('CURRENT_TIMESTAMP'),
        ]);

        $this->createIndex(
            'uq_pendaftaran_no_registrasi',
            '{{%pendaftaran}}',
            'no_registrasi',
            true
        );

        $this->createIndex(
            'idx_pendaftaran_pasien',
            '{{%pendaftaran}}',
            'pasien_id'
        );

        $this->createIndex(
            'idx_pendaftaran_tanggal',
            '{{%pendaftaran}}',
            'tanggal_kunjungan'
        );

        $this->createIndex(
            'idx_pendaftaran_ruangan_dokter',
            '{{%pendaftaran}}',
            ['ruangan_id', 'dokter_id']
        );

        $this->createIndex(
            'idx_pendaftaran_status',
            '{{%pendaftaran}}',
            'status'
        );

        $this->addForeignKey(
            'fk_pendaftaran_pasien',
            '{{%pendaftaran}}',
            'pasien_id',
            '{{%pasien}}',
            'id',
            'RESTRICT',
            'CASCADE'
        );

        $this->addForeignKey(
            'fk_pendaftaran_ruangan',
            '{{%pendaftaran}}',
            'ruangan_id',
            '{{%ruangan}}',
            'id',
            'RESTRICT',
            'CASCADE'
        );

        $this->addForeignKey(
            'fk_pendaftaran_dokter',
            '{{%pendaftaran}}',
            'dokter_id',
            '{{%dokter}}',
            'id',
            'RESTRICT',
            'CASCADE'
        );

        $this->addForeignKey(
            'fk_pendaftaran_jadwal',
            '{{%pendaftaran}}',
            'jadwal_dokter_id',
            '{{%jadwal_dokter}}',
            'id',
            'RESTRICT',
            'CASCADE'
        );

        $this->addForeignKey(
            'fk_pendaftaran_user',
            '{{%pendaftaran}}',
            'created_by',
            '{{%users}}',
            'id',
            'SET NULL',
            'CASCADE'
        );

        $this->createTable('{{%antrean}}', [
            'id' => $this->bigPrimaryKey(),

            'pendaftaran_id' => $this->bigInteger()->notNull(),

            'tanggal' => $this->date()->notNull(),

            'ruangan_id' => $this->bigInteger()->notNull(),

            'nomor_antrean' => $this->integer()->notNull(),

            'kode_antrean' => $this->string(20)->notNull(),

            'status' => $this->string(20)->notNull()
                ->defaultValue('MENUNGGU'),

            'waktu_panggil' => $this->timestamp(),
            'waktu_mulai' => $this->timestamp(),
            'waktu_selesai' => $this->timestamp(),

            'created_at' => $this->timestamp()
                ->notNull()
                ->defaultExpression('CURRENT_TIMESTAMP'),

            'updated_at' => $this->timestamp()
                ->notNull()
                ->defaultExpression('CURRENT_TIMESTAMP'),
        ]);

        $this->createIndex(
            'uq_antrean_pendaftaran',
            '{{%antrean}}',
            'pendaftaran_id',
            true
        );

        $this->createIndex(
            'uq_antrean_nomor',
            '{{%antrean}}',
            ['tanggal', 'ruangan_id', 'nomor_antrean'],
            true
        );

        $this->createIndex(
            'uq_antrean_kode',
            '{{%antrean}}',
            ['tanggal', 'ruangan_id', 'kode_antrean'],
            true
        );

        $this->createIndex(
            'idx_antrean_status',
            '{{%antrean}}',
            ['tanggal', 'ruangan_id', 'status']
        );

        $this->addForeignKey(
            'fk_antrean_pendaftaran',
            '{{%antrean}}',
            'pendaftaran_id',
            '{{%pendaftaran}}',
            'id',
            'CASCADE',
            'CASCADE'
        );

        $this->addForeignKey(
            'fk_antrean_ruangan',
            '{{%antrean}}',
            'ruangan_id',
            '{{%ruangan}}',
            'id',
            'RESTRICT',
            'CASCADE'
        );

        $this->createTable('{{%riwayat_kunjungan}}', [
            'id' => $this->bigPrimaryKey(),

            'pendaftaran_id' => $this->bigInteger()->notNull(),

            'pasien_id' => $this->bigInteger()->notNull(),

            'aktivitas' => $this->string(50)->notNull(),

            'status_sebelumnya' => $this->string(30),

            'status_sesudahnya' => $this->string(30),

            'keterangan' => $this->text(),

            'user_id' => $this->bigInteger(),

            'created_at' => $this->timestamp()
                ->notNull()
                ->defaultExpression('CURRENT_TIMESTAMP'),
        ]);

        $this->createIndex(
            'idx_riwayat_pendaftaran',
            '{{%riwayat_kunjungan}}',
            'pendaftaran_id'
        );

        $this->createIndex(
            'idx_riwayat_pasien',
            '{{%riwayat_kunjungan}}',
            'pasien_id'
        );

        $this->createIndex(
            'idx_riwayat_created_at',
            '{{%riwayat_kunjungan}}',
            'created_at'
        );

        $this->addForeignKey(
            'fk_riwayat_pendaftaran',
            '{{%riwayat_kunjungan}}',
            'pendaftaran_id',
            '{{%pendaftaran}}',
            'id',
            'CASCADE',
            'CASCADE'
        );

        $this->addForeignKey(
            'fk_riwayat_pasien',
            '{{%riwayat_kunjungan}}',
            'pasien_id',
            '{{%pasien}}',
            'id',
            'RESTRICT',
            'CASCADE'
        );

        $this->addForeignKey(
            'fk_riwayat_user',
            '{{%riwayat_kunjungan}}',
            'user_id',
            '{{%users}}',
            'id',
            'SET NULL',
            'CASCADE'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%riwayat_kunjungan}}');
        $this->dropTable('{{%antrean}}');
        $this->dropTable('{{%pendaftaran}}');
    }
}
