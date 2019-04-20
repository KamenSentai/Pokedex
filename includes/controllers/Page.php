<?php

namespace Pokedex\Controllers;

// Namespaces
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface      as Response;

/**
 * Class Pokemon
 * @author Alain Cao Van Truong <cvt.alain@gmail.com>
 */
class Page {
  private $container;

  public function __construct($container) {
    $this->container = $container;
  }

  /**
   * @param object $request
   * @param object $response
   * @return object $this->container->view->render()
   */
  public function getHome(Request $request, Response $response) {
    return $this->container->view->render($response, 'index.twig', $this->container->getHome);
  }

  /**
   * @param object $request
   * @param object $response
   * @return object $this->container->view->render()
   */
  public function postHome(Request $request, Response $response) {
    return $this->container->view->render($response, 'index.twig', $this->container->postHome);
  }

  /**
   * @param object $request
   * @param object $response
   * @return object $this->container->view->render()
   */
  public function getCatch(Request $request, Response $response) {
    return $this->container->view->render($response, 'index.twig', $this->container->getCatch);
  }

  /**
   * @param object $request
   * @param object $response
   * @return object $this->container->view->render()
   */
  public function getPokemons(Request $request, Response $response) {
    return $this->container->view->render($response, 'index.twig', $this->container->getPokemons);
  }

  /**
   * @param object $request
   * @param object $response
   * @return object $this->container->view->render()
   */
  public function getPokemon(Request $request, Response $response, $arguments) {
    // Get pokemons data
    $dataView     = $this->container->getPokemons;
    $dataBase     = $dataView['base'];
    $dataData     = $dataView['data'];
    $slug         = $arguments['slug'];
    $pokemonIndex = array_search($slug, array_column($dataData['pokemons'], 'slug'));

    // Exception
    if (!$pokemonIndex && !is_int($pokemonIndex))
      throw new \Slim\Exception\NotFoundException($request, $response);
    else
      $pokemon = $dataData['pokemons'][$pokemonIndex];

    // Set new data
    $dataBase['page']    = 'pokemon';
    $dataBase['title']   = TITLE . ' | ' . (isset($pokemon->is_owned) ? $pokemon->name : '???');
    $dataData['pokemon'] = $pokemon;
    $dataView['base']    = $dataBase;
    $dataView['data']    = $dataData;

    return $this->container->view->render($response, 'index.twig', $dataView);
  }

  /**
   * @param object $request
   * @param object $response
   * @return object $this->container->view->render()
   */
  public function getTypes(Request $request, Response $response) {
    return $this->container->view->render($response, 'index.twig', $this->container->getTypes);
  }

  /**
   * @param object $request
   * @param object $response
   * @return object $this->container->view->render()
   */
  public function getType(Request $request, Response $response, $arguments) {
    // Get pokemons data
    $dataView = $this->container->getPokemons;
    $dataBase = $dataView['base'];
    $dataData = $dataView['data'];
    $pokemons = $dataData['pokemons'];
    $slug     = $arguments['slug'];

    // Exception
    if (!in_array(ucfirst($slug), $this->container->getTypes['data']['types']))
      throw new \Slim\Exception\NotFoundException($request, $response);

    // Remove unused pokemons
    foreach ($pokemons as $_pokemon)
      if (!in_array(ucfirst($slug), $_pokemon->type))
        unset($pokemons[array_search($_pokemon, $pokemons)]);

    // Set new data
    $dataBase['page']     = 'type';
    $dataBase['title']    = TITLE . ' | ' . ucfirst($slug);
    $dataData['pokemons'] = $pokemons;
    $dataData['type']     = $slug;
    $dataView['base']     = $dataBase;
    $dataView['data']     = $dataData;

    return $this->container->view->render($response, 'index.twig', $dataView);
  }

  /**
   * @param object $request
   * @param object $response
   * @return object $this->container->view->render()
   */
  public function getRandom(Request $request, Response $response) {
    return $this->container->view->render($response, 'index.twig', $this->container->getRandom);
  }
}
