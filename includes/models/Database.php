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
     * @param array $users
     * @param string $ip
     */
    public function checkRegistration($users, $ip)
    {
        $isRegistered = false;

        foreach ($users as $_user)
            if ($_user->ip === $ip)
            {
                $isRegistered = true;
                break;
            }

        if (!$isRegistered)
            self::setQuery('INSERT INTO users (ip) VALUES ("' . $ip . '")');
    }
}