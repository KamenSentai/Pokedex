(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

// Load JSON file
var loadJSON = function loadJSON(file, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', '../database/' + file + '.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') callback(xobj.responseText);
  };
  xobj.send(null);
};

// Get container
var $containerMap = document.querySelector('.container.container-map');
var $containerCatch = document.querySelector('.container.container-catch');
var $audio = document.querySelector('audio');

if ($containerMap) {
  //Get elements
  var $top = $containerMap.querySelector('.top');
  var $right = $containerMap.querySelector('.right');
  var $bottom = $containerMap.querySelector('.bottom');
  var $left = $containerMap.querySelector('.left');
  var $map = $containerMap.querySelector('.map');
  var $character = $containerMap.querySelector('.character');
  var $crush = $containerMap.querySelector('.crush');
  var $sprite = $character.querySelector('.sprite');
  var $pokedex = $containerMap.querySelector('.pokedex');
  var $rectangles = $containerMap.querySelector('.rectangles');

  // Define valuesw
  var position = { x: parseInt($character.dataset.positionx * 10), y: parseInt($character.dataset.positiony * 10) };
  var tileSize = { x: 0, y: 0 };
  var SPAW_RATE = 25;
  var MAP_ROW = 12;
  var MAP_COL = 15;
  var MAP_RATIO = MAP_COL / MAP_ROW;
  var forbidden = [{ x: 0, y: 0 }, { x: 0, y: 50 }, { x: 0, y: 100 }, { x: 0, y: 150 }, { x: 0, y: 200 }, { x: 0, y: 250 }, { x: 0, y: 350 }, { x: 0, y: 400 }, { x: 0, y: 450 }, { x: 50, y: 0 }, { x: 650, y: 0 }, { x: 700, y: 0 }, { x: 700, y: 50 }, { x: 700, y: 100 }, { x: 700, y: 200 }, { x: 700, y: 250 }, { x: 700, y: 300 }, { x: 700, y: 350 }, { x: 700, y: 400 }, { x: 700, y: 450 }];
  var bushes = [{ x: 150, y: 0 }, { x: 200, y: 0 }, { x: 300, y: 0 }, { x: 350, y: 0 }, { x: 450, y: 0 }, { x: 500, y: 0 }, { x: 200, y: 50 }, { x: 250, y: 50 }, { x: 300, y: 50 }, { x: 350, y: 50 }, { x: 400, y: 50 }, { x: 500, y: 50 }, { x: 550, y: 50 }, { x: 150, y: 100 }, { x: 200, y: 100 }, { x: 300, y: 100 }, { x: 400, y: 100 }, { x: 450, y: 100 }, { x: 550, y: 100 }, { x: 150, y: 150 }, { x: 200, y: 150 }, { x: 250, y: 150 }, { x: 300, y: 150 }, { x: 350, y: 150 }, { x: 400, y: 150 }, { x: 450, y: 150 }, { x: 500, y: 150 }, { x: 550, y: 150 }, { x: 600, y: 150 }, { x: 100, y: 200 }, { x: 200, y: 200 }, { x: 300, y: 200 }, { x: 400, y: 200 }, { x: 500, y: 200 }, { x: 550, y: 200 }, { x: 600, y: 200 }, { x: 100, y: 250 }, { x: 150, y: 250 }, { x: 200, y: 250 }, { x: 250, y: 250 }, { x: 300, y: 250 }, { x: 350, y: 250 }, { x: 400, y: 250 }, { x: 450, y: 250 }, { x: 550, y: 250 }, { x: 150, y: 300 }, { x: 250, y: 300 }, { x: 350, y: 300 }, { x: 400, y: 300 }, { x: 500, y: 300 }, { x: 600, y: 300 }, { x: 100, y: 350 }, { x: 200, y: 350 }, { x: 250, y: 350 }, { x: 300, y: 350 }, { x: 400, y: 350 }, { x: 450, y: 350 }, { x: 500, y: 350 }, { x: 550, y: 350 }, { x: 600, y: 350 }, { x: 250, y: 400 }, { x: 350, y: 400 }, { x: 400, y: 400 }, { x: 550, y: 400 }, { x: 300, y: 450 }];
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var canWalk = true;

  // Set size to map
  var setImageSize = function setImageSize(left, top, width, height, transform) {
    $map.style.left = left;
    $map.style.top = top;
    $map.style.width = width;
    $map.style.height = height;
    $map.style.transform = transform;
  };

  // Resize images
  var resizeImage = function resizeImage(windowWidth, windowHeight, callback) {
    // Check if landscape or portrait
    if (windowWidth / windowHeight <= MAP_RATIO) {
      setImageSize('0', '50%', '100%', 'auto', 'translateY(-50%)');
      $top.style.zIndex = '1';
      $right.style.zIndex = '0';
      $bottom.style.zIndex = '1';
      $left.style.zIndex = '0';
    } else {
      setImageSize('50%', '0', 'auto', '100%', 'translateX(-50%)');
      $top.style.zIndex = '0';
      $right.style.zIndex = '1';
      $bottom.style.zIndex = '0';
      $left.style.zIndex = '1';
    }
    callback();
  };

  // Set style to elements
  var setStyles = function setStyles() {
    var topOffset = $map.getBoundingClientRect().top;
    var leftOffset = $map.getBoundingClientRect().left;
    var widthOffset = $map.getBoundingClientRect().width;
    var heightOffset = $map.getBoundingClientRect().height;
    $top.style.bottom = topOffset + 'px';
    $right.style.left = leftOffset + 'px';
    $bottom.style.top = topOffset + 'px';
    $left.style.right = leftOffset + 'px';
    tileSize.x = widthOffset / MAP_COL;
    tileSize.y = heightOffset / MAP_ROW;
    $character.style.left = leftOffset - tileSize.x / 2 + 'px';
    $character.style.top = topOffset + 'px';
    $character.style.width = tileSize.x * 2 + 'px';
    $character.style.height = tileSize.y * 2 + 'px';
    $character.style.transform = 'translate(' + position.x + '%, ' + position.y + '%)';
    $sprite.style.width = '300%';
    $sprite.style.height = '400%';
    $crush.style.left = leftOffset + 'px';
    $crush.style.top = topOffset + tileSize.y + 'px';
    $crush.style.width = tileSize.x + 'px';
    $crush.style.height = tileSize.y + 'px';
    $pokedex.style.bottom = tileSize.y + 'px';
  };

  // Check if nex position of character is allowed
  var allowPosition = function allowPosition(positionX, positionY) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = forbidden[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var forbiddenPosition = _step.value;

        if (forbiddenPosition.x == positionX && forbiddenPosition.y == positionY) return false;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return true;
  };

  // Check if walking on bush
  var stepBush = function stepBush(positionX, positionY) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = bushes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var bush = _step2.value;

        if (bush.x == positionX && bush.y == positionY) return true;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return false;
  };

  // Load pokemon
  var loadPokemon = function loadPokemon(array) {
    $crush.style.opacity = '1';
    var pokemonIndex = Math.floor(Math.random() * 151);
    var pokemonSpawn = array[pokemonIndex].spawn_chance;
    var pokemonChance = Math.random() * SPAW_RATE - pokemonSpawn;
    var isSpawned = pokemonChance < 0 ? true : false;

    // Check if pokemon is spawned
    if (isSpawned) {
      // Forbid to walk
      canWalk = false;

      // Send data
      var xhr = new XMLHttpRequest();
      xhr.open('POST', './');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(encodeURI('action=catch&pokemon_index=' + pokemonIndex + '&position_x=' + position.x / 10 + '&position_y=' + position.y / 10));

      // Listen to request done
      xhr.onload = function () {
        // Add rectangles
        $rectangles.classList.add('active');

        // Load new page
        setTimeout(function () {
          window.location.href = './catch';
        }, 2000);
      };
    }
  };

  // Load pokedx data
  loadJSON('pokedex', function (response) {
    // Parse data
    var JSON_file = JSON.parse(response);
    var pokemons = JSON_file.pokemons;

    // Listen to keydown
    window.addEventListener('keydown', function (event) {
      // Check if character can walk
      if (canWalk) {
        switch (event.keyCode) {
          case 37:
            if (allowPosition(Math.max(0, position.x - 50), position.y)) {
              position.x = Math.max(0, position.x - 50);
              if (stepBush(position.x, position.y)) loadPokemon(pokemons);else $crush.style.opacity = '0';
            }
            $sprite.style.transform = 'translate(0%, -25%)';
            break;
          case 39:
            if (allowPosition(Math.min((MAP_COL - 1) * 50, position.x + 50), position.y)) {
              position.x = Math.min((MAP_COL - 1) * 50, position.x + 50);
              if (stepBush(position.x, position.y)) loadPokemon(pokemons);else $crush.style.opacity = '0';
            }
            $sprite.style.transform = 'translate(0%, -75%)';
            break;
          case 38:
            if (allowPosition(position.x, Math.max(0, position.y - 50))) {
              position.y = Math.max(0, position.y - 50);
              if (stepBush(position.x, position.y)) loadPokemon(pokemons);else $crush.style.opacity = '0';
            }
            $sprite.style.transform = 'translate(0%, -50%)';
            break;
          case 40:
            if (allowPosition(position.x, Math.min((MAP_ROW - 3) * 50, position.y + 50))) {
              position.y = Math.min((MAP_ROW - 3) * 50, position.y + 50);
              if (stepBush(position.x, position.y)) loadPokemon(pokemons);else $crush.style.opacity = '0';
            }
            $sprite.style.transform = 'translate(0%, 0)';
            break;
        }
        // Update position
        $character.style.transform = 'translate(' + position.x + '%, ' + position.y + '%)';
        $crush.style.transform = 'translate(' + position.x * 2 + '%, ' + position.y * 2 + '%)';
      }
    });
  });

  // Initialize map size
  setTimeout(function () {
    resizeImage(windowWidth, windowHeight, setStyles);
    document.body.classList.remove('fade');
  }, 250);

  // Listen to resize
  window.addEventListener('resize', function () {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    resizeImage(windowWidth, windowHeight, setStyles);
  });
} else if ($containerCatch) {
  // Get elements
  var _$rectangles = $containerCatch.querySelector('.rectangles');
  var $title = $containerCatch.querySelector('h1');
  var $appears = $title.querySelector('.appears');
  var $caught = $title.querySelector('.caught');
  var $escaped = $title.querySelector('.escaped');
  var $appearance = $containerCatch.querySelector('.appearance');
  var $illustration = $containerCatch.querySelector('.illustration');
  var $button = $containerCatch.querySelector('.button');
  var $tool = $button.querySelector('.tool');
  var CATCH_RATE = 75;

  // Load pokedex data
  loadJSON('pokedex', function (response) {
    // Parse data
    var JSON_file = JSON.parse(response);
    var pokemons = JSON_file.pokemons;
    var pokemonName = $appearance.getAttribute('alt');
    var pokemon = pokemons.find(function (pokemon) {
      return pokemon.name == pokemonName;
    });
    var pokemonIndex = pokemons.indexOf(pokemon);
    var pokemonCatch = pokemon.catch_chance;

    // Remove rectangles
    setTimeout(function () {
      _$rectangles.classList.remove('active');

      // Display elements
      setTimeout(function () {
        $title.classList.add('active');
        $appearance.classList.add('active');
        $illustration.classList.add('active');

        // Display button
        setTimeout(function () {
          $tool.classList.add('active');
          $containerCatch.removeChild(_$rectangles);
          $button.addEventListener('click', function (event) {
            event.preventDefault();
            $tool.classList.add('thrown');

            // Throw pokeball
            setTimeout(function () {
              $appearance.classList.add('caught');

              // Catch pokemon
              setTimeout(function () {
                $appears.style.display = 'none';
                var pokemonChance = Math.random() * CATCH_RATE - pokemonCatch;
                var isCaught = pokemonChance < 0 ? true : false;

                // Check if pokemon is caught
                if (isCaught) {
                  // Update
                  $caught.style.display = 'block';

                  // Send data
                  var xhr = new XMLHttpRequest();
                  xhr.open('POST', './');
                  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                  xhr.send(encodeURI('action=caught&pokemon_index=' + pokemonIndex));
                  xhr.onload = function () {
                    setTimeout(function () {
                      document.body.classList.add('fade');
                      setTimeout(function () {
                        window.location.href = './';
                      }, 1250);
                    }, 1250);
                  };
                } else {
                  // Update
                  $escaped.style.display = 'block';
                  $appearance.classList.remove('caught');

                  // Set pokemon escaping
                  setTimeout(function () {
                    $appearance.classList.remove('active');

                    // Fadeout window
                    setTimeout(function () {
                      document.body.classList.add('fade');

                      // Redirect to map page
                      setTimeout(function () {
                        window.location.href = './';
                      }, 1250);
                    }, 1250);
                  }, 2000);
                }
              }, 5000);
            }, 1250);
          });
        }, 1000);
      }, 1000);
    }, 250);
  });
} else if ($audio) {
  var _$button = document.querySelector('.sheet-button');
  _$button.addEventListener('click', function () {
    $audio.play();
  });
}

// Remove empty columns
var $sheetCols = document.querySelectorAll('.sheet-col');
if ($sheetCols.length > 0) {
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = $sheetCols[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var $sheetCol = _step3.value;

      if ($sheetCol.childElementCount == 0) $sheetCol.parentNode.removeChild($sheetCol);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
}

},{}]},{},[1])

//# sourceMappingURL=app.js.map
