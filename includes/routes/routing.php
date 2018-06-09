<?php

// Namespaces
use \Pokedex\Models      as PM;
use \Pokedex\Views       as PV;
use \Pokedex\Controllers as PC;

// Home
$app->get('/',  PC\Page::class . ':getHome')->setName('home');
$app->post('/', PC\Page::class . ':postHome');

// Catch
$app->get('/catch', PC\Page::class . ':getCatch')->setName('catch');

// Pokedex
$app->get('/pokedex', PC\Page::class . ':getPokedex')->setName('pokedex');