<?php

namespace Pokedex\Controllers;

// Namespaces
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface      as Response;

/**
 * Class Pokemon
 * @author Alain Cao Van Truong <cvt.alain@gmail.com>
 */
class Page
{
    private $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    /**
     * @param object $request
     * @param object $response
     * @return object $$this->container->view->render()
     */
    public function getHome(Request $request, Response $response)
    {
        return $this->container->view->render($response, 'index.twig', $this->container->home);
    }

    /**
     * @param object $request
     * @param object $response
     * @return object $$this->container->view->render()
     */
    public function postHome(Request $request, Response $response)
    {
        if (isset($_POST['pokemon']))
            return $this->container->view->render($response, 'index.twig', $this->container->catch);
        else
            return $this->container->view->render($response, 'index.twig', $this->container->home);
    }
}