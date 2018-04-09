<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{$monster->name}}</title>
    <link href="https://fonts.googleapis.com/css?family=Cormorant+Garamond" rel="stylesheet">
    <link rel="stylesheet" href="/css/monsters/monster.css">
  </head>
  <body>
    <div class="card">
      <div class="background"></div>

      <div class="header">
        <div class="name-bar bar-elements">
          <h1>{{$monster->name}}</h1>
        </div>
        <div class="challenge-bar bar-elements">
          <h1> Challenge: {{$monster->challenge_rating}}</h1>
        </div>
        <i style="float:right;">1500xp</i>
      </div>
      <div class="information">
        <h5>{{strtoupper($monster->type)}}</h5>
        <h5>{{strtoupper($monster->alignment)}}</h5>
        <h5>{{strtoupper($monster->speed)}}</h5>
      </div>
      <div class="left-align">


      <div class="stats">
        <h1 class="identifier">AC: </h1> <h1 class="stat">{{strtoupper($monster->ac)}}</h1>
        <h1 class="identifier">HP: </h1> <h1 class="stat">{{strtoupper($monster->hp_dice)}}</h1>
      </div>
      <div class="stats">
        <div class="identifier ident-small">
          <h3>STR</h3>
          <h3>{{strtoupper($monster->str)}}</h3>
        </div>
        <div class="identifier ident-small">
          <h3>DEX</h3>
          <h3>{{strtoupper($monster->dex)}}</h3>
        </div>
        <div class="identifier ident-small">
          <h3>CON</h3>
          <h3>{{strtoupper($monster->con)}}</h3>
        </div>
        <div class="identifier ident-small">
          <h3>INT</h3>
          <h3>{{strtoupper($monster->int)}}</h3>
        </div>
        <div class="identifier ident-small">
          <h3>WIS</h3>
          <h3>{{strtoupper($monster->wis)}}</h3>
        </div>
        <div class="identifier ident-small">
          <h3>CHA</h3>
          <h3>{{strtoupper($monster->cha)}}</h3>
        </div>
      </div>
      <hr class="seperator" />
      <div class="monster-info">
        <table>
          <tr>
            <td>RESISTANCE:</td>
            <td>{{strtoupper($monster->resistances)}}</td>
          </tr>
          <tr>
            <td>IMMUNITY:</td>
            <td>{{strtoupper($monster->immunities)}}</td>
          </tr>
          <tr>
            <td>SENSES:</td>
            <td>{{strtoupper($monster->senses)}}</td>
          </tr>
          <tr>
            <td>LANGUAGES:</td>
            <td>{{strtoupper($monster->languages)}}</td>
          </tr>
        </table>
      </div>
      <hr class="seperator" />

      <div class="traits">
        <h1>Traits</h1>
        @foreach ($monster->traits as $trait)
        <strong>{{$trait->title}}</strong>: {{$trait->body}}<br /><br />
        @endforeach
      </div>
      </div>
      <div class="right-align">


      <h1>Actions:</h1>
      <hr class="seperator" />
      <strong>Hello</strong><br />
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras et nibh ac felis accumsan aliquet. Nam et tincidunt turpis. Morbi purus turpis, commodo eget arcu a, tincidunt rhoncus elit. Vestibulum eget turpis lacus. Praesent at tellus dolor. Aliquam suscipit id nisl nec semper. Phasellus pellentesque nibh orci, cursus interdum elit porttitor a. Duis quis felis vehicula, rutrum leo a, ultrices sem. Suspendisse eu neque tristique, vestibulum ipsum id, lobortis turpis. Aliquam aliquam mi nisi, vitae lacinia augue viverra ac. Vivamus molestie commodo felis, nec vehicula nulla hendrerit porttitor. Vestibulum rutrum porttitor elit, vitae dapibus felis vulputate quis. Aenean id nisl sed risus porttitor ultrices nec quis nisl. Donec vel tellus diam.
    </div></div>

  </body>
</html>
