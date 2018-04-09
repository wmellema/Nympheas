<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTraitLink extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('monster_monster_trait', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('monster_id')->unsigned();
          $table->integer('monster_trait_id')->unsigned();
          $table->timestamps();

          $table->foreign('monster_id')->references('id')->on('monsters')->onDelete('cascade');
          $table->foreign('monster_trait_id')->references('id')->on('monster_traits')->onDelete('cascade');
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
