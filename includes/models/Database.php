<?php

namespace Pokedex\Models;

/**
 * Class Database
 * @author Alain Cao Van Truong <cvt.alain@gmail.com>
 */
class Database
{
  private $pdo;
  private $ip;
  private $id;
  private $prepare;

  public function __construct($pdo, $ip)
  {
    $this->pdo = $pdo;
    $this->ip  = $ip;
  }

  /**
   * @param string $sql
   */
  public function setQuery($sql)
  {
    $this->prepare = $this->pdo->prepare($sql);
    $this->prepare->execute();
  }

  /**
   * @return PDOStatement $this->prepare
   */
  public function getPrepare()
  {
    return $this->prepare;
  }

  /**
   * @return object $this->prepare->fetch()
   */
  public function getPrepareFetch()
  {
    return $this->prepare->fetch();
  }

  /**
   * @return array $this->prepare->fetchAll()
   */
  public function getPrepareFetchAll()
  {
    return $this->prepare->fetchAll();
  }

  /**
   * @return string $this->ip
   */
  public function getIp()
  {
    return $this->ip;
  }

  /**
   * @return string $this->id
   */
  public function getId()
  {
    self::setQuery('SELECT * FROM users WHERE ip = "' . $this->ip . '"');
    $this->id = self::getPrepareFetch()->id;
    return $this->id;
  }

  /**
   * @param array $users
   * @param string $ip
   */
  public function checkRegistration($user, $ip)
  {
    if (!$user)
      self::setQuery('INSERT INTO users (ip) VALUES ("' . $ip . '")');
    else
      self::setQuery('UPDATE users SET catching = null WHERE ip = "' . $ip . '"');
  }
}
