<?php

// Namespaces
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface      as Response;
use \Pokedex\Models      as PM;
use \Pokedex\Views       as PV;
use \Pokedex\Controllers as PC;

// Home
$app->get('/',  PC\Page::class . ':getHome')->setName('home');
$app->post('/', PC\Page::class . ':postHome');

// Catch
$app->get('/catch', PC\Page::class . ':getCatch')->setName('catch');

// Pokemons
$app->get('/pokemons', PC\Page::class . ':getPokemons')->setName('pokemons');

// Pokemon
$app
    ->get(
        '/pokemons/{slug:[a-z_]+}',
        function(Request $request, Response $response, $arguments)
        {
            // Get pokemons data
            $dataView     = $this->getPokemons;
            $dataBase     = $dataView['base'];
            $dataData     = $dataView['data'];
            $slug         = $arguments['slug'];
            $pokemonIndex = array_search($slug, array_column($dataData['pokemons'], 'slug'));

            // Exception
            if (!$pokemonIndex && !is_int($pokemonIndex))
                throw new \Slim\Exception\NotFoundException($request, $response);
            else
                $pokemon = $dataData['pokemons'][$pokemonIndex];

            // Set new data
            $dataBase['page']    = 'pokemon';
            $dataBase['title']   = TITLE . ' | ' . (isset($pokemon->is_owned) ? $pokemon->name : '???');
            $dataData['pokemon'] = $pokemon;
            $dataView['base']    = $dataBase;
            $dataView['data']    = $dataData;

            return $this->view->render($response, 'index.twig', $dataView);
        }
    )
    ->setName('pokemon')
;

// Types
$app->get('/types', PC\Page::class . ':getTypes')->setName('types');

// Type
$app
    ->get(
        '/types/{slug:[a-z]+}',
        function(Request $request, Response $response, $arguments)
        {
            // Get pokemons data
            $dataView = $this->getPokemons;
            $dataBase = $dataView['base'];
            $dataData = $dataView['data'];
            $pokemons = $dataData['pokemons'];
            $slug     = $arguments['slug'];

            // Exception
            if (!in_array(ucfirst($slug), $this->getTypes['data']['types']))
                throw new \Slim\Exception\NotFoundException($request, $response);

            // Remove unused pokemons
            foreach ($pokemons as $_pokemon)
                if (!in_array(ucfirst($slug), $_pokemon->type))
                    unset($pokemons[array_search($_pokemon, $pokemons)]);

            // Set new data
            $dataBase['page']     = 'type';
            $dataBase['title']    = TITLE . ' | ' . ucfirst($slug);
            $dataData['pokemons'] = $pokemons;
            $dataData['type']     = $slug;
            $dataView['base']     = $dataBase;
            $dataView['data']     = $dataData;

            return $this->view->render($response, 'index.twig', $dataView);
        }
    )
    ->setName('type')
;

// Random
$app->get('/random', PC\Page::class . ':getRandom')->setName('random');