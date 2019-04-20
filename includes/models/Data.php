<?php

namespace Pokedex\Models;

/**
 * Class Api
 * @author Alain Cao Van Truong <cvt.alain@gmail.com>
 */
class Data {
  private $json;
  public  $data;

  public function __construct($file) {
    $this->json = file_get_contents('../database/' . $file . '.json');
    $this->data = json_decode($this->json);
  }
}
