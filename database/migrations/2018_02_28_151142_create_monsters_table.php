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
            $table->string('source')->nullable();

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
            $table->string('saving_throws')->nullable();
            $table->string("vulnerabilities")->nullable();
            $table->string("damage_vulnerabilities")->nullable();
            $table->string('resistances')->nullable();
            $table->string("immunities")->nullable();
            $table->string("condition_immunities")->nullable();
            $table->integer("passive_perception")->nullable();
            $table->string('senses')->nullable();
            $table->string('languages')->nullable();
            $table->text("spell-book")->nullable();
            $table->string('roll-0')->nullable();
            $table->string('roll-1')->nullable();
            $table->string('roll-2')->nullable();
            $table->string('roll-3')->nullable();
            $table->string('roll-4')->nullable();
            $table->text('legend-roll-0')->nullable();
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
