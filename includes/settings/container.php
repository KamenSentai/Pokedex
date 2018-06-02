<?php

// Namespaces
use \Pokedex\Models      as PM;
use \Pokedex\Views       as PV;
use \Pokedex\Controllers as PC;

// Container
$container = $app->getContainer();

// PDO
$container['pdo'] = function()
{
    try
    {
        // Try to connect to database
        $pdo = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';port='.DB_PORT, DB_USER, DB_PASS);
    
        // Set fetch mode to object
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
    }
    catch (Exception $e)
    {
        // Failed to connect
        die('Could not connect');
    }
    return $pdo;
};

// Database
$container['database'] = function($container)
{
    $database = new PM\Database($container->pdo);
    return $database;
};

// View
$container['view'] = function()
{
    $view = new \Slim\Views\Twig('./includes/views/');
    return $view;
};

// Home
$container['home'] = function()
{
    $data =
    [
        'base' =>
        [
            'page'  => 'home',
            'title' => 'Pikachu',
            'url'   => URL,
        ],
        'contents' =>
        [
            'pokemon' => 'Pikachu',
        ],
    ];
    return $data;
};