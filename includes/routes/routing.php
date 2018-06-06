<?php

// Namespaces
use \Pokedex\Models      as PM;
use \Pokedex\Views       as PV;
use \Pokedex\Controllers as PC;

// Home
$app->get('/',  PC\Page::class . ':getHome')->setName('home');