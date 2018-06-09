<?php

// Namespaces
use \Pokedex\Models      as PM;
use \Pokedex\Views       as PV;
use \Pokedex\Controllers as PC;

// Container
$container = $app->getContainer();

// View
$container['view'] = function($container)
{
    // Initialize views
    $view   = new \Slim\Views\Twig('../includes/views');
    $router = $container->get('router');
    $uri    = \Slim\Http\Uri::createFromEnvironment(new \Slim\Http\Environment($_SERVER));
    $view->addExtension(new \Slim\Views\TwigExtension($router, $uri));

    return $view;
};

// Database
$container['database'] = function($container)
{
    // Connect to database
    $db  = $container['settings']['database'];
    $pdo = new PDO('mysql:host='.$db['host'].';dbname='.$db['name'].';port='.$db['port'], $db['user'], $db['pass']);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Connect user address
    $userIp   = hash('sha256', PM\Address::getIp());
    $database = new PM\Database($pdo, $userIp);

    return $database;
};

// Home
$container['getHome'] = function($container)
{
    // Import database
    $database = $container->database;

    // Check registration
    $userIp = $database->getIp();
    $database->setQuery('SELECT * FROM users WHERE ip = "' . $userIp . '"');
    $user   = $database->getPrepareFetch();
    $database->checkRegistration($user, $userIp);

    $data =
    [
        'base' =>
        [
            'page' => 'home',
            'title' => TITLE,
        ],
        'data' =>
        [
            'user' => $user,
        ],
    ];
    return $data;
};
$container['postHome'] = function($container)
{
    if (isset($_POST['action']))
    {
        $database     = $container->database;
        $pokemonIndex = $_POST['pokemon_index'];
        if ($_POST['action'] === 'catch')
        {
            // Set pokemon that the user meets and update position
            $userIp    = $database->getIp();
            $positionX = $_POST['position_x'];
            $positionY = $_POST['position_y'];
            $database->setQuery('UPDATE users SET catching   = "' . $pokemonIndex . '" WHERE ip = "' . $userIp . '"');
            $database->setQuery('UPDATE users SET position_x = "' . $positionX    . '" WHERE ip = "' . $userIp . '"');
            $database->setQuery('UPDATE users SET position_y = "' . $positionY    . '" WHERE ip = "' . $userIp . '"');
        }
        elseif ($_POST['action'] === 'caught')
        {
            // Add pokemon to user pokedex
            $userId = $database->getId();
            $database->setQuery('SELECT * FROM capture WHERE pokemon_id = "' . $pokemonIndex .'" AND user_id = "' . $userId . '"');
            $pokemons = $database->getPrepareFetch();
            if (!$pokemons)
                $database->setQuery('INSERT INTO capture (pokemon_id, user_id) VALUES ("' . $pokemonIndex . '", "' . $userId .'")');
            else
                $database->setQuery('UPDATE capture SET number = ' . ($pokemons->number + 1) . ' WHERE id = ' . $pokemons->id);
        }
    }

    exit;
};

// Catch
$container['getCatch'] = function($container)
{
    // Select user
    $database = $container->database;
    $userIp   = $database->getIp();
    $database->setQuery('SELECT * FROM users WHERE ip = "' . $userIp . '"');
    $user     = $database->getPrepareFetch();

    // Prevent user to access the page by writing the URL
    if (isset($user->catching))
    {
        // Select pokemon
        $data    = new PM\Data('pokedex');
        $pokemon = $data->data->pokemon[$user->catching];

        $data =
        [
            'base' =>
            [
                'page' => 'catch',
                'title' => TITLE . ' | Catch ' . $pokemon->name . ' !',
            ],
            'data' =>
            [
                'pokemon' => $pokemon
            ],
        ];
        return $data;
    }
    else
    {
        header('location: ./');
        exit;
    }
};

// Pokedex
$container['getPokedex'] = function($container)
{
    $data =
    [
        'base' =>
        [
            'page' => 'pokedex',
            'title' => TITLE . ' | Pokedex',
        ],
    ];
    return $data;
};