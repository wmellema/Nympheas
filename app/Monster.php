<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
// use Laravel\Scout\Searchable;

class Monster extends Model
{
    // use Searchable;
    //
    public function traits(){
      return $this->belongsToMany('App\MonsterTrait');
    }
    public function actions(){
      return $this->belongsToMany('App\MonsterAction');
    }

    public function toArray() {
      $data = parent::toArray();

      if($this->traits){
        $data['traits'] = $this->traits;
      }
      if($this->actions){
        $data['actions'] = $this->actions;
      }
      return $data;
    }
}
