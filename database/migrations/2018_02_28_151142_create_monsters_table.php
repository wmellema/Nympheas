<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMonstersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('monsters', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('size');
            $table->string('type');
            $table->string('alignment');
            $table->float('challenge_rating');
            $table->string('source');

            //Stats
            $table->integer('ac');
            $table->string('hp_dice');
            $table->string('speed');
            $table->integer('str');
            $table->integer('dex');
            $table->integer('con');
            $table->integer('int');
            $table->integer('wis');
            $table->integer('cha');
            $table->string('saving_throws');
            $table->string("vulnerabilities");
            $table->string("damage_vulnerabilities");
            $table->string('resistances');
            $table->string("immunities");
            $table->string("condition_immunities");
            $table->integer("passive_perception");
            $table->string('senses');
            $table->string('languages');
            $table->text("spell-book");
            $table->string('roll-0');
            $table->string('roll-1');
            $table->string('roll-2');
            $table->string('roll-3');
            $table->string('roll-4');
            $table->string('legend-roll-0');
            $table->string('img_url');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('monsters');
    }
}
