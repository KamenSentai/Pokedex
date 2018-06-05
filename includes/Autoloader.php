<?php

namespace Pokedex;

/**
 * Class Autoloader
 * @author Alain Cao Van Truong <cvt.alain@gmail.com>
 */
class Autoloader
{
    static function register()
    {
        spl_autoload_register(array(__CLASS__, 'autoload'));
    }

    /**
     * @param string $class
     */
    static function autoload($class)
    {
        // Define file name
        $file = explode('\\', $class)[sizeof(explode('\\', $class)) - 1];

        // Require file
        if (file_exists('../includes/settings/' . $file . '.php'))
            require '../includes/settings/' . $file . '.php';
        elseif (file_exists('../includes/routes/' . $file . '.php'))
            require '../includes/routes/' . $file . '.php';
        elseif (file_exists('../includes/models/' . $file . '.php'))
            require '../includes/models/' . $file . '.php';
        elseif (file_exists('../includes/views/' . $file . '.php'))
            require '../includes/views/' . $file . '.php';
        elseif (file_exists('../includes/controllers/' . $file . '.php'))
            require '../includes/controllers/' . $file . '.php';

        // Display error
        else
            die('Class ' . $class . ' not found');
    }
}