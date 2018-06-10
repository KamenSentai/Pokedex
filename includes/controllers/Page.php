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
     * @return object $this->container->view->render()
     */
    public function getHome(Request $request, Response $response)
    {
        return $this->container->view->render($response, 'index.twig', $this->container->getHome);
    }

    /**
     * @param object $request
     * @param object $response
     * @return object $this->container->view->render()
     */
    public function postHome(Request $request, Response $response)
    {
        return $this->container->view->render($response, 'index.twig', $this->container->postHome);
    }

    /**
     * @param object $request
     * @param object $response
     * @return object $this->container->view->render()
     */
    public function getCatch(Request $request, Response $response)
    {
        return $this->container->view->render($response, 'index.twig', $this->container->getCatch);
    }

    /**
     * @param object $request
     * @param object $response
     * @return object $this->container->view->render()
     */
    public function getPokemons(Request $request, Response $response)
    {
        return $this->container->view->render($response, 'index.twig', $this->container->getPokemons);
    }

    /**
     * @param object $request
     * @param object $response
     * @return object $this->container->view->render()
     */
    public function getTypes(Request $request, Response $response)
    {
        return $this->container->view->render($response, 'index.twig', $this->container->getTypes);
    }

    /**
     * @param object $request
     * @param object $response
     * @return object $this->container->view->render()
     */
    public function getRandom(Request $request, Response $response)
    {
        return $this->container->view->render($response, 'index.twig', $this->container->getRandom);
    }
}