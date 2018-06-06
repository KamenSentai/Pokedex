<?php

// Errors
$settings['displayErrorDetails'] = true;

// Database
$settings['database']         = [];
$settings['database']['host'] = DB_HOST;
$settings['database']['name'] = DB_NAME;
$settings['database']['port'] = DB_PORT;
$settings['database']['user'] = DB_USER;
$settings['database']['pass'] = DB_PASS;

// Initialization
$app = new \Slim\App(['settings' => $settings]);