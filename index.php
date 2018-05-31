<?php

// Settings
require_once './includes/settings/framework.php';

// Run Slim
$app->run();

// Autoloader
require './includes/Autoloader.php';
\Pokedex\Autoloader::register();

// Namespaces
use \Pokedex\Settings    as PS;
use \Pokedex\Routes      as PR;
use \Pokedex\Models      as PM;
use \Pokedex\Views       as PV;
use \Pokedex\Controllers as PC;

// Pikachu !
$pokemon = new PC\Pokemon();
$pokemon->sayHi();