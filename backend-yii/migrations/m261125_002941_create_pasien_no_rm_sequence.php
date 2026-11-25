<?php

use yii\db\Migration;

class m261125_002941_create_pasien_no_rm_sequence extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->execute("
            CREATE SEQUENCE pasien_no_rm_seq
            START WITH 1
            INCREMENT BY 1
            MINVALUE 1
            MAXVALUE 999999
            NO CYCLE
        ");

        $this->execute("
            SELECT setval(
                'pasien_no_rm_seq',
                GREATEST(
                    COALESCE(
                        (
                            SELECT MAX(no_rm::INTEGER)
                            FROM pasien
                            WHERE no_rm ~ '^[0-9]{6}$'
                        ),
                        0
                    ),
                    1
                ),
                EXISTS (
                    SELECT 1
                    FROM pasien
                    WHERE no_rm ~ '^[0-9]{6}$'
                )
            )
        ");
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->execute(
            'DROP SEQUENCE IF EXISTS pasien_no_rm_seq'
        );
    }

    /*
    // Use up()/down() to run migration code without a transaction.
    public function up()
    {

    }

    public function down()
    {
        echo "m261125_002941_create_pasien_no_rm_sequence cannot be reverted.\n";

        return false;
    }
    */
}
