<?php

use Illuminate\Database\Seeder;
use PHPHtmlParser\Dom;
use App\MonsterTrait;
use App\Monster;
class MonsterSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    function progressBar($done, $total) {
      $perc = floor(($done / $total) * 100);
      $left = 100 - $perc;
      $write = sprintf("\033[0G\033[2K[%'={$perc}s>%-{$left}s] - $perc%% - $done/$total", "", "");
      fwrite(STDERR, $write);
    }
    private function get_individual_elements($html_block){
      $blocks = array();
      $elements = array();
      preg_match_all("/\<strong\>(.*?)\<br \/\>/",$html_block,$blocks);
      // Seperate every element from the first strong tag to a newline
      foreach($blocks[1] as $trait){
        $title = array();
        $body = array();
        // Match titles and bodies
        preg_match("/(.*?)\<\/strong\>/",$trait,$title);
        preg_match("/\<\/strong\>(.*)/",$trait,$body);
        $body = $body[1];

        //Remove html tags from body and title, then add to the elements array
        $title = strip_tags($title[1]);
        $elements[$title] = strip_tags($body);
      }
      return $elements;
    }
    private function seperate_html_blocks($html_block){
      $block_list = array();
      //Fix for regex. Easier this way
      $html_block .= "<h2>";

      //Match the title and bodies
      preg_match_all("/\<\/h2\>(.*?)\<h2\>/",$html_block,$bodies);
      preg_match_all("/\<h2\>(.*?)\<\/h2\>/",$html_block,$title);
      // Only keep inner match
      $title = $title[1];
      $bodies = $bodies[1];
      // Iterate over every body, and assign the different elements to it's title
      foreach($bodies as $key => $body){
        // Split all the elements using the get_individual_elements function
        $elements = $this->get_individual_elements($body);
        $block_list[strip_tags($title[$key])] = $elements;
      }
      return $block_list;
    }
    private function get_monster_img_url($escaped_name){
      // Convert monster name from Roll20 to the dndbeyond standard
      $escaped_name = strtolower($escaped_name);
      $escaped_name = str_replace(" ","-",$escaped_name);
      $escaped_name = str_replace("(","",$escaped_name);
      $escaped_name = str_replace(")","",$escaped_name);
      // Replace images for a few select items that don't have entries in dndbeyond
      switch($escaped_name){
        case "diseased-giant-rat":
          $escaped_name = "giant-rat";
          break;
        case "swarm-of-beetles":
          $escaped_name = "giant-fire-beetle";
          break;
        case "swarm-of-centipedes":
          $escaped_name = "giant-centipede";
          break;
        case "swarm-of-spiders":
          $escaped_name = "spider";
          break;
      }
      // Ask for the page, and extract the img src
      $dom = new Dom;
      try {
        $dom->load('https://www.dndbeyond.com/monsters/'.$escaped_name);
        $img = $dom->find(".monster-image")->getAttribute('src');
      }catch (Exception $e){
        $img = "https://media-waterdeep.cursecdn.com/attachments/2/648/beast.jpg";
        echo "Found Non-Standard on ".$escaped_name.PHP_EOL;
      }
      if(!substr($img, 0,4) ==="http"){
        $img = "http:".$img;
      }
      return $img;
    }
    public function run()
    {
      $monster_data = array();
      if(file_exists('results.json')){
        echo "Using Cached JSON".PHP_EOL;

      }else{
        $roll_20_db = 'https://roll20.net/compendium/compendium/getList?bookName=dnd5e&pageName=Monsters+List&_=1524857996';
        $json = json_decode(file_get_contents($roll_20_db), true);
        $json['results'] = json_decode($json['results']);
        $json_length = count($json['results']);
        foreach( $json['results'] as $i => $monster){
          $this->progressBar($i,$json_length);
          $escaped_name = htmlspecialchars($monster->n);
          // Load compendium page for monster in Roll20, and extract relevant data
          // echo $escaped_name.PHP_EOL;
          $dom = new Dom;
          $dom->load('https://roll20.net/compendium/dnd5e/'.$escaped_name);
          $traits = $dom->find('div#pagecontent');
          // Fix for non-existing pagecontent id
          foreach($traits as $pos =>$trait){
            $monster_data[$escaped_name] = $this->seperate_html_blocks($trait->innerHtml());
            $monster_data[$escaped_name]['default_info'] = $monster->c;
            $monster_data[$escaped_name]['img_url'] = $this->get_monster_img_url($escaped_name);
          }
        }
        $fp = fopen('results.json', 'w');
        fwrite($fp, json_encode($monster_data));
        fclose($fp);
        echo PHP_EOL."Done!";
      }
      $string = file_get_contents('results.json');
      $monster_data = json_decode($string, true);

      foreach($monster_data as $name => $full_data){

        $data = $full_data['default_info'];
        echo $name.PHP_EOL;
        $chal_split = explode("/",$data[6]);
        $chal = (int) $data[6];
        if(count($chal_split) > 1){
          $chal = ((float) $chal_split[0]) / ((float) $chal_split[1]);
        }
        $hp_split =  explode(" ",$data[3]);
        $hp = $hp_split[0];
        if(count($hp_split) > 1){
          $hp = $hp_split[1];
        }
        $mObj = Monster::firstOrCreate(array(
          'name' => $name,
          'size' => $data[0],
          'type' => $data[1],
          'alignment' => $data[2],
          'challenge_rating' => $chal,
          // 'source' => $data['Source'],
          'ac' => (int) explode(" ",$data[4])[0],
          'hp_dice' => $hp,
          'speed' => $data[5],
          'str' => (int) $data[7],
          'dex' => (int) $data[9],
          'con' => (int) $data[11],
          'int' => (int) $data[13],
          'wis' => (int) $data[15],
          'CHA' => (int) $data[17],
          'saving_throws' => $data[19],
          'vulnerabilities' => "None",
          // 'damage_vulnerabilities' => $data['Damage Vulnerabilities'],
          // 'resistances' => $data['Resistances'],
          // 'immunities' => $data['Immunities'],
          // 'condition_immunities' => $data['Condition Immunities'],
          // 'passive_perception' => (int) $data['Passive Perception'],
          'senses' => $data[28],
          'languages' => $data[29],
          'spell-book' => $data[30],
          'roll-0' => $data[32],
          'roll-1' => $data[33],
          'roll-2' => $data[34],
          'roll-3' => $data[35],
          'roll-4' => $data[36],
          'legend-roll-0' => $data[37],
          'img_url' => $full_data['img_url'],




        ));
        if(array_key_exists("Traits",$full_data)){
          foreach($full_data["Traits"] as $trait => $body){
            $tObj = MonsterTrait::firstOrCreate(array('title' => $trait, 'body' => $body));
            $mObj->traits()->save($tObj);
          }
        }
      }
    }
}
