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
$app->get('/pokemons/{slug:[a-z_]+}', PC\Page::class . ':getPokemon')->setName('pokemon');

// Types
$app->get('/types', PC\Page::class . ':getTypes')->setName('types');

// Type
$app->get('/types/{slug:[a-z]+}', PC\Page::class . ':getType')->setName('type');

// Random
$app->get('/random', PC\Page::class . ':getRandom')->setName('random');