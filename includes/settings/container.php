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
    $view = new \Slim\Views\Twig('../includes/views/');
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
    // Insert last pokemon found
    if (isset($_POST['number']))
    {
        $userIp = $container->database->getIp();
        $container->database->setQuery('SELECT * FROM users WHERE ip = "' . $userIp . '"');
        $userId = $container->database->getPrepareFetch()->id;
        $container->database->setQuery('INSERT INTO catch (number, user) VALUES ("' . $_POST['number'] . '", "' . $userId . '")');
        exit;
    }

    $data =
    [
        'base' =>
        [
            'page'  => 'home',
            'title' => TITLE,
            'url'   => URL,
        ],
    ];
    return $data;
};

// Catch
$container['catch'] = function($container)
{
    // Find user
    $userIp = $container->database->getIp();
    $container->database->setQuery('SELECT * FROM users');
    $users = $container->database->getPrepareFetchAll();

    // Get user id
    foreach ($users as $_user)
    {
        if ($_user->ip === $userIp)
        {
            $userId = $_user->id;
            break;
        }
    }

    // Redirect if never connected
    if (!isset($userId))
    {
        header('location: ./');
        exit;
    }

    // Select newest pokemon found
    $container->database->setQuery('SELECT * FROM catch WHERE user = "' . $userId . '"');
    $catch   = $container->database->getPrepareFetchAll();
    $last    = end($catch);
    $pokedex = new PM\Data('pokedex');
    $pokemon = $pokedex->content->pokemon[$last->number];

    $data =
    [
        'base' =>
        [
            'page'  => 'catch',
            'title' => TITLE . ' | Catch ' . $pokemon->name . ' !',
            'url'   => URL,
        ],
        'data' =>
        [
            'pokemonName'   => $pokemon->name,
            'pokemonNumber' => $pokemon->num,
        ],
    ];
    return $data;
};