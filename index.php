<?php

// Namespaces
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface      as Response;
use \Pokedex\Settings    as PS;
use \Pokedex\Routes      as PR;
use \Pokedex\Models      as PM;
use \Pokedex\Views       as PV;
use \Pokedex\Controllers as PC;

// Autoloaders
require_once './vendor/autoload.php';
require_once './includes/Autoloader.php';
\Pokedex\Autoloader::register();

// Framework
$settings  = ['displayErrorDetails' => true];
$app       = new \Slim\App(['settings' => $settings]);
$container = $app->getContainer();

// Settings
require_once './includes/settings/config.php';
require_once './includes/settings/container.php';

// Home route
$app
    ->get(
        '/',
        function(Request $request, Response $response)
        {
            $dataView =
            [
                'base' =>
                [
                    'page'  => 'home',
                    'url'   => URL,
                    'title' => 'Pikachu',
                ],
                'contents' =>
                [
                    'pokemon' => 'Pikachu',
                ],
            ];
            return $this->view->render($response, 'index.twig', $dataView);
        }
    )
;

// Run Slim
$app->run();