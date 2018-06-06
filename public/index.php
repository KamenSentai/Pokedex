<?php

// Autoloader
require_once '../vendor/autoload.php';

// Settings
require_once '../includes/settings/config.php';
require_once '../includes/settings/setup.php';
require_once '../includes/settings/container.php';

// Routes
require_once '../includes/routes/routing.php';

// Run
$app->run();