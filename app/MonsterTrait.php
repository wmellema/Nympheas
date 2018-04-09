<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MonsterTrait extends Model
{
    //
    public function monsters(){
      return $this->belongsToMany('App\Monster');
    }
}
