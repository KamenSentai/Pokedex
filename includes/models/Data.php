<?php

namespace Pokedex\Models;

/**
 * Class Api
 * @author Alain Cao Van Truong <cvt.alain@gmail.com>
 */
class Data
{
    private $json;
    public  $content;

    public function __construct($data)
    {
        $this->json = file_get_contents('./database/' . $data . '.json');
        $this->content = json_decode($this->json);
    }
}