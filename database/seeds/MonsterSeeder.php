<?php

use Illuminate\Database\Seeder;
use PHPHtmlParser\Dom;
use PHPHtmlParser\CurlInterface;
use App\MonsterTrait;
use PHPHtmlParser\Exceptions\CurlException;

use App\Monster;

class WindowsCurlInterface implements CurlInterface{
  public function get($url){
    $ch = curl_init($url);
        if ( ! ini_get('open_basedir')) {
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        }
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        $content = curl_exec($ch);
        if ($content === false) {
            // there was a problem
            $error = curl_error($ch);
            throw new CurlException('Error retrieving "'.$url.'" ('.$error.')');
        }
        return $content;
  }
}
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
        $dom->loadFromUrl('https://www.dndbeyond.com/monsters/'.$escaped_name,[],new WindowsCurlInterface);
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
    public function parse_default_info($info){
      return array(
        'Size' => $info[0],
        'Type' => $info[1],
        'Alignment' => $info[2],
        'Challenge Rating' => $info[6],
        'XP' => $info[7],
        'AC' => $info[4],
        'HP' => $info[3],
        'Speed' => $info[5],
        'Str' => $info[8],
        'Dex' => $info[10],
        'Con' => $info[12],
        'Int' => $info[14],
        'Wis' => $info[16],
        'Cha' => $info[18],
        'Saving Throws' => $info[19],
        'Senses' => $info[21],
        'Languages' => explode(",",$info[29]),
        'Spell Book' => json_decode($info[30]),
        'Roll 0' => $info[32],
        'Roll 1' => $info[33],
        'Roll 2' => $info[34],
        'Roll 3' => $info[35],
        'Roll 4' => $info[36],
        'Legendary Roll 0' => $info[37],
        );
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
          $tmp_escaped_name = str_replace(" ","_",$escaped_name);
          // Load compendium page for monster in Roll20, and extract relevant data
          // echo $escaped_name.PHP_EOL;
          $dom = new Dom;
          $dom->loadFromUrl('https://roll20.net/compendium/dnd5e/Monsters:'.$tmp_escaped_name,[],new WindowsCurlInterface);
          $traits = $dom->find('div#pagecontent');
          foreach($traits as $pos =>$trait){
            $monster_data[$escaped_name] = $this->seperate_html_blocks($trait->innerHtml());
            $monster_data[$escaped_name] = array_merge($monster_data[$escaped_name],$this->parse_default_info($monster->c));
            $monster_data[$escaped_name]['img_url'] = $this->get_monster_img_url($escaped_name);
          }
          if(!array_key_exists($escaped_name, $monster_data)){
            echo "Missed monster |".$escaped_name."|".PHP_EOL;
            $monster_data[$escaped_name] = $this->parse_default_info($monster->c);

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

        $data = $full_data;
        echo $name.PHP_EOL;
        $chal_split = explode("/",$data['Challenge Rating']);
        $chal = (int) $data['Challenge Rating'];
        if(count($chal_split) > 1){
          $chal = ((float) $chal_split[0]) / ((float) $chal_split[1]);
        }
        $hp_split =  explode(" ",$data['HP']);
        $hp = $hp_split[0];
        if(count($hp_split) > 1){
          $hp = $hp_split[1];
        }
        $mObj = Monster::firstOrCreate(array(
          'name' => $name,
          'size' => $data['Size'],
          'type' => $data['Type'],
          'alignment' => $data['Alignment'],
          'challenge_rating' => $chal,
          // 'source' => $data['Source'],
          'ac' => (int) explode(" ",$data['AC'])[0],
          'hp_dice' => $hp,
          'speed' => $data['Speed'],
          'str' => (int) $data['Str'],
          'dex' => (int) $data['Dex'],
          'con' => (int) $data['Con'],
          'int' => (int) $data['Int'],
          'wis' => (int) $data['Wis'],
          'CHA' => (int) $data['Cha'],
          'saving_throws' => $data['Saving Throws'],
          'vulnerabilities' => "None",
          // 'damage_vulnerabilities' => $data['Damage Vulnerabilities'],
          // 'resistances' => $data['Resistances'],
          // 'immunities' => $data['Immunities'],
          // 'condition_immunities' => $data['Condition Immunities'],
          // 'passive_perception' => (int) $data['Passive Perception'],
          'senses' => $data['Senses'],
          'languages' => $data['Languages'],
          'spell-book' => $data['Spell Book'],
          'roll-0' => $data['Roll 0'],
          'roll-1' => $data['Roll 1'],
          'roll-2' => $data['Roll 2'],
          'roll-3' => $data['Roll 3'],
          'roll-4' => $data['Roll 4'],
          'legend-roll-0' => $data['Legendary Roll 0'],
          'img_url' => $data['img_url'],




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
