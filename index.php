<?php

// Namespaces
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface      as Response;
use \Pokedex\Settings    as PS;
use \Pokedex\Routes      as PR;
use \Pokedex\Models      as PM;
use \Pokedex\Views       as PV;
use \Pokedex\Controllers as PC;

// Settings
require_once './includes/settings/framework.php';

// Home route
$app
    ->get(
        '/',
        function(Request $request, Response $response)
        {
            $dataView =
            [
                'pokemon' => 'Pikachu',
            ];
            return $this->view->render($response, 'pages/home.twig', $dataView);
        }
    )
;

// Run Slim
$app->run();

// Autoloader
require './includes/Autoloader.php';
\Pokedex\Autoloader::register();

// Pikachu !
$pokemon = new PC\Pokemon();
$pokemon->sayHi();