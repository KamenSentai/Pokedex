<?php

require_once './vendor/autoload.php';

$settings =
[
    'displayErrorDetails' => true,
];

$app = new \Slim\App(['settings' => $settings]);

$container = $app->getContainer();

$container['view'] = function()
{
    $view = new \Slim\Views\Twig('./includes/views');
    return $view;
};