<?php

// URL
define('HTTP', isset($_SERVER['HTTPS']) ? 'https' : 'http');
define('HOST', $_SERVER['HTTP_HOST']);
// define('URI',  $_SERVER['REQUEST_URI']);
define('URI',  '/works/pokedex/');
define('URL',  HTTP . '://' . HOST . URI);

// Database
define('DB_HOST', 'localhost');
define('DB_PORT', '8889');
define('DB_NAME', 'pokedex');
define('DB_USER', 'root');
define('DB_PASS', 'root');

// Title
define('TITLE', 'Pokedex');