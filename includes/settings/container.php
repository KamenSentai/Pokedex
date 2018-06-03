<?php

// Namespaces
use \Pokedex\Models      as PM;
use \Pokedex\Views       as PV;
use \Pokedex\Controllers as PC;

// Container
$container = $app->getContainer();

// View
$container['view'] = function()
{
    $view = new \Slim\Views\Twig('./includes/views/');
    return $view;
};

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
    // Connect do database
    $address  = new PM\Address();
    $userIp   = hash('sha256', $address->getIp());
    $database = new PM\Database($container->pdo, $userIp);

    // Check registration
    $database->setQuery('SELECT * FROM users');
    $users = $database->getPrepareFetchAll();
    $database->checkRegistration($users, $userIp);

    return $database;
};

// Home
$container['home'] = function($container)
{
    $data =
    [
        'base' =>
        [
            'page'  => 'home',
            'title' => TITLE,
            'url'   => URL,
        ],
        'data' =>
        [
            'positionX' => isset($_POST['positionX']) ? $_POST['positionX'] : 0,
            'positionY' => isset($_POST['positionY']) ? $_POST['positionY'] : 300,
        ],
    ];
    return $data;
};

// Catch
$container['catch'] = function($container)
{
    $data =
    [
        'base' =>
        [
            'page'  => 'catch',
            'title' => TITLE,
            'url'   => URL,
        ],
        'data' =>
        [
            'positionX' => isset($_POST['positionX']) ? $_POST['positionX'] : 0,
            'positionY' => isset($_POST['positionY']) ? $_POST['positionY'] : 300,
        ],
    ];
    return $data;
};