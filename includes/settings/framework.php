<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require_once './vendor/autoload.php';

$settings =
[
    'displayErrorDetails' => true,
];

$app = new \Slim\App(['settings' => $settings]);

$container = $app->getContainer();

$container['view'] = function()
{
    $view = new \Slim\Views\Twig('./views');
    return $view;
};