<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateActionLink extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('monster_monster_action', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('monster_id')->unsigned();
          $table->integer('monster_action_id')->unsigned();
          $table->timestamps();

          $table->foreign('monster_id')->references('id')->on('monsters')->onDelete('cascade');
          $table->foreign('monster_action_id')->references('id')->on('monster_actions')->onDelete('cascade');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
