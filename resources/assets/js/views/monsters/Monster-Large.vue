<template>
  <div class="monster_card">
    <div class="background"></div>

    <div class="header">
      <div class="name-bar bar-elements">
        <h1>{{monster.name}}</h1>
      </div>
      <div class="challenge-bar bar-elements">
        <h1> Challenge: {{monster.challenge_rating}}</h1>
      </div>
      <i style="float:right;">1500xp</i>
    </div>
    <div class="information">
      <h5>{{monster.type }}</h5>
      <h5>{{monster.alignment }}</h5>
      <h5>{{monster.speed }}</h5>
    </div>
    <div class="left-align">


      <div class="stats">
        <h1 class="identifier">AC: </h1> <h1 class="stat">{{monster.ac }}</h1>
        <h1 class="identifier">HP: </h1> <h1 class="stat">{{monster.hp_dice }}</h1>
      </div>
      <div class="stats">
        <div class="identifier ident-small">
          <h3>STR</h3>
          <h3>{{monster.str }}</h3>
        </div>
        <div class="identifier ident-small">
          <h3>DEX</h3>
          <h3>{{monster.dex }}</h3>
        </div>
        <div class="identifier ident-small">
          <h3>CON</h3>
          <h3>{{monster.con }}</h3>
        </div>
        <div class="identifier ident-small">
          <h3>INT</h3>
          <h3>{{monster.int }}</h3>
        </div>
        <div class="identifier ident-small">
          <h3>WIS</h3>
          <h3>{{monster.wis }}</h3>
        </div>
        <div class="identifier ident-small">
          <h3>CHA</h3>
          <h3>{{monster.cha }}</h3>
        </div>
      </div>
      <hr class="seperator" />
      <div class="monster-info">
        <table>
          <tr>
            <td>RESISTANCE:</td>
            <td>{{monster.resistances }}</td>
          </tr>
          <tr>
            <td>IMMUNITY:</td>
            <td>{{monster.immunities }}</td>
          </tr>
          <tr>
            <td>SENSES:</td>
            <td>{{monster.senses }}</td>
          </tr>
          <tr>
            <td>LANGUAGES:</td>
            <td>{{monster.languages }}</td>
          </tr>
        </table>
      </div>
      <hr class="seperator" />

      <div class="traits">
        <h1>Traits</h1>
         <li v-for="trait in monster.traits">
        <strong>{{trait.title}}</strong>: {{trait.body}}<br /><br />
          </li>

      </div>
    </div>
    <div class="right-align">


      <h1>Actions:</h1>
      <hr class="seperator" />
      <li v-for="action in monster.actions">
      <strong>{{action.title}}</strong>: {{action.body}}<br />
      </li>
      
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  props: ['monster'],
}
</script>
