<?php

// Namespaces
use \Pokedex\Models      as PM;
use \Pokedex\Views       as PV;
use \Pokedex\Controllers as PC;

// Container
$container = $app->getContainer();

// View
$container['view'] = function($container) {
  // Initialize views
  $view   = new \Slim\Views\Twig('../includes/views');
  $router = $container->get('router');
  $uri    = \Slim\Http\Uri::createFromEnvironment(new \Slim\Http\Environment($_SERVER));
  $view->addExtension(new \Slim\Views\TwigExtension($router, $uri));

  return $view;
};

// Database
$container['database'] = function($container) {
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
$container['getHome'] = function($container) {
  // Import database
  $database = $container->database;

  // Check registration
  $userIp = $database->getIp();
  $database->setQuery('SELECT * FROM users WHERE ip = "' . $userIp . '"');
  $user   = $database->getPrepareFetch();
  $database->checkRegistration($user, $userIp);

  $dataView =
  [
    'base' =>
    [
      'page'  => 'home',
      'title' => TITLE,
    ],
    'data' =>
    [
      'user' => $user,
    ],
  ];
  return $dataView;
};
$container['postHome'] = function($container) {
  if (isset($_POST['action'])) {
    $database     = $container->database;
    $pokemonIndex = $_POST['pokemon_index'];
    if ($_POST['action'] === 'catch') {
      // Set pokemon that the user meets and update position
      $userIp    = $database->getIp();
      $positionX = $_POST['position_x'];
      $positionY = $_POST['position_y'];
      $database->setQuery('UPDATE users SET catching   = "' . $pokemonIndex . '" WHERE ip = "' . $userIp . '"');
      $database->setQuery('UPDATE users SET position_x = "' . $positionX    . '" WHERE ip = "' . $userIp . '"');
      $database->setQuery('UPDATE users SET position_y = "' . $positionY    . '" WHERE ip = "' . $userIp . '"');
    } elseif ($_POST['action'] === 'caught') {
      // Add pokemon to user pokedex
      $userId = $database->getId();
      $database->setQuery('SELECT * FROM capture WHERE pokemon_id = "' . $pokemonIndex .'" AND user_id = "' . $userId . '"');
      $owned = $database->getPrepareFetch();
      if (!$owned)
        $database->setQuery('INSERT INTO capture (pokemon_id, user_id) VALUES ("' . $pokemonIndex . '", "' . $userId .'")');
      else
        $database->setQuery('UPDATE capture SET number = ' . ($owned->number + 1) . ' WHERE id = ' . $owned->id);
    }
  }
  exit;
};

// Catch
$container['getCatch'] = function($container) {
  // Select user
  $database = $container->database;
  $userIp   = $database->getIp();
  $database->setQuery('SELECT * FROM users WHERE ip = "' . $userIp . '"');
  $user     = $database->getPrepareFetch();

  // Prevent user to access the page by writing the URL
  if (isset($user->catching)) {
    // Select pokemon
    $data    = new PM\Data('pokedex');
    $pokemon = $data->data->pokemon[$user->catching];

    $dataView =
    [
      'base' =>
      [
        'page'  => 'catch',
        'title' => TITLE . ' | Catch ' . $pokemon->name . ' !',
      ],
      'data' =>
      [
        'pokemon' => $pokemon
      ],
    ];
    return $dataView;
  } else {
    header('location: ./');
    exit;
  }
};

// Pokemons
$container['getPokemons'] = function($container) {
  // Get all pokemons
  $data     = new PM\Data('pokedex');
  $pokemons = $data->data->pokemon;

  // Get pokemons owned
  $database = $container->database;
  $userId   = $database->getId();
  $database->setQuery('SELECT * FROM capture WHERE user_id = "' . $userId . '"');
  $owned    = $database->getPrepareFetchAll();

  // Check which pokemons are owned
  foreach ($owned as $_owned) {
    $pokemons[$_owned->pokemon_id]->is_owned     = true;
    $pokemons[$_owned->pokemon_id]->number_owned = $_owned->number;
  }

  $dataView =
  [
    'base' =>
    [
      'page'  => 'pokemons',
      'title' => TITLE . ' | Pokemons',
    ],
    'data' =>
    [
      'pokemons' => $pokemons,
    ],
  ];
  return $dataView;
};

// Types
$container['getTypes'] = function($container) {
  // Get all pokemons and types
  $data  = new PM\Data('pokedex');
  $types = $data->data->types;

  $dataView =
  [
    'base' =>
    [
      'page'  => 'types',
      'title' => TITLE . ' | Types',
    ],
    'data' =>
    [
      'types' => $types,
    ],
  ];
  return $dataView;
};

// Random
$container['getRandom'] = function($container) {
  // Get pokemons data
  $dataView = $container->getPokemons;
  $dataBase = $dataView['base'];
  $dataData = $dataView['data'];
  $pokemon  = $dataData['pokemons'][rand(0, sizeof($dataData['pokemons']))];

  // Set new data
  $dataBase['page']    = 'pokemon';
  $dataBase['title']   = TITLE . ' | ' . (isset($pokemon->is_owned) ? $pokemon->name : '???');
  $dataData['pokemon'] = $pokemon;
  $dataView['base']    = $dataBase;
  $dataView['data']    = $dataData;

  return $dataView;
};

// 404
$container['notFoundHandler'] = function($container) {
  return function($request, $response) use ($container) {
    $dataView =
    [
      'base' =>
      [
        'page'  => '404',
        'title' => TITLE . ' | 404',
      ],
    ];
    return $container['view']->render($response->withStatus(404), 'index.twig', $dataView);
  };
};
