<?php

namespace Pokedex\Models;

/**
 * Class Pokemon
 * @author Alain Cao Van Truong <cvt.alain@gmail.com>
 */
class Address {
  /**
   * @return string $ip
   */
  private static function detectIp() {
    $ip = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
      $ip = $_SERVER['HTTP_CLIENT_IP'];
    else if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
      $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if (isset($_SERVER['HTTP_X_FORWARDED']))
      $ip = $_SERVER['HTTP_X_FORWARDED'];
    else if (isset($_SERVER['HTTP_FORWARDED_FOR']))
      $ip = $_SERVER['HTTP_FORWARDED_FOR'];
    else if (isset($_SERVER['HTTP_FORWARDED']))
      $ip = $_SERVER['HTTP_FORWARDED'];
    else if (isset($_SERVER['REMOTE_ADDR']))
      $ip = $_SERVER['REMOTE_ADDR'];
    else
      $ip = 'UNKNOWN';
    return $ip;
  }

  /**
   * @return string $ip
   */
  public static function getIp() {
    return self::detectIp();
  }
}
