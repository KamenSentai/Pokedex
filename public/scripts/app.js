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

// Check if map page
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
        var pokemons = JSON_file.pokemon;

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
}
// Check if catching page
else if ($containerCatch) {
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
            var pokemons = JSON_file.pokemon;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9zY3JpcHRzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQSxJQUFNLFdBQVcsU0FBWCxRQUFXLENBQUMsSUFBRCxFQUFPLFFBQVAsRUFDakI7QUFDSSxRQUFNLE9BQU8sSUFBSSxjQUFKLEVBQWI7QUFDQSxTQUFLLGdCQUFMLENBQXNCLGtCQUF0QjtBQUNBLFNBQUssSUFBTCxDQUFVLEtBQVYsbUJBQWdDLElBQWhDLFlBQTZDLElBQTdDO0FBQ0EsU0FBSyxrQkFBTCxHQUEwQixZQUMxQjtBQUNJLFlBQUksS0FBSyxVQUFMLElBQW1CLENBQW5CLElBQXdCLEtBQUssTUFBTCxJQUFlLEtBQTNDLEVBQ0ksU0FBUyxLQUFLLFlBQWQ7QUFDUCxLQUpEO0FBS0EsU0FBSyxJQUFMLENBQVUsSUFBVjtBQUNILENBWEQ7O0FBYUE7QUFDQSxJQUFNLGdCQUFrQixTQUFTLGFBQVQsQ0FBdUIsMEJBQXZCLENBQXhCO0FBQ0EsSUFBTSxrQkFBa0IsU0FBUyxhQUFULENBQXVCLDRCQUF2QixDQUF4QjtBQUNBLElBQU0sU0FBa0IsU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQXhCOztBQUVBO0FBQ0EsSUFBSSxhQUFKLEVBQ0E7QUFDSTtBQUNBLFFBQU0sT0FBYyxjQUFjLGFBQWQsQ0FBNEIsTUFBNUIsQ0FBcEI7QUFDQSxRQUFNLFNBQWMsY0FBYyxhQUFkLENBQTRCLFFBQTVCLENBQXBCO0FBQ0EsUUFBTSxVQUFjLGNBQWMsYUFBZCxDQUE0QixTQUE1QixDQUFwQjtBQUNBLFFBQU0sUUFBYyxjQUFjLGFBQWQsQ0FBNEIsT0FBNUIsQ0FBcEI7QUFDQSxRQUFNLE9BQWMsY0FBYyxhQUFkLENBQTRCLE1BQTVCLENBQXBCO0FBQ0EsUUFBTSxhQUFjLGNBQWMsYUFBZCxDQUE0QixZQUE1QixDQUFwQjtBQUNBLFFBQU0sU0FBYyxjQUFjLGFBQWQsQ0FBNEIsUUFBNUIsQ0FBcEI7QUFDQSxRQUFNLFVBQWMsV0FBVyxhQUFYLENBQXlCLFNBQXpCLENBQXBCO0FBQ0EsUUFBTSxXQUFjLGNBQWMsYUFBZCxDQUE0QixVQUE1QixDQUFwQjtBQUNBLFFBQU0sY0FBYyxjQUFjLGFBQWQsQ0FBNEIsYUFBNUIsQ0FBcEI7O0FBRUE7QUFDQSxRQUFNLFdBQWMsRUFBQyxHQUFHLFNBQVMsV0FBVyxPQUFYLENBQW1CLFNBQW5CLEdBQStCLEVBQXhDLENBQUosRUFBaUQsR0FBRyxTQUFTLFdBQVcsT0FBWCxDQUFtQixTQUFuQixHQUErQixFQUF4QyxDQUFwRCxFQUFwQjtBQUNBLFFBQU0sV0FBYyxFQUFDLEdBQUcsQ0FBSixFQUFPLEdBQUcsQ0FBVixFQUFwQjtBQUNBLFFBQU0sWUFBYyxFQUFwQjtBQUNBLFFBQU0sVUFBYyxFQUFwQjtBQUNBLFFBQU0sVUFBYyxFQUFwQjtBQUNBLFFBQU0sWUFBYyxVQUFVLE9BQTlCO0FBQ0EsUUFBTSxZQUNOLENBQ0ksRUFBQyxHQUFHLENBQUosRUFBTyxHQUFHLENBQVYsRUFESixFQUVJLEVBQUMsR0FBRyxDQUFKLEVBQU8sR0FBRyxFQUFWLEVBRkosRUFHSSxFQUFDLEdBQUcsQ0FBSixFQUFPLEdBQUcsR0FBVixFQUhKLEVBSUksRUFBQyxHQUFHLENBQUosRUFBTyxHQUFHLEdBQVYsRUFKSixFQUtJLEVBQUMsR0FBRyxDQUFKLEVBQU8sR0FBRyxHQUFWLEVBTEosRUFNSSxFQUFDLEdBQUcsQ0FBSixFQUFPLEdBQUcsR0FBVixFQU5KLEVBT0ksRUFBQyxHQUFHLENBQUosRUFBTyxHQUFHLEdBQVYsRUFQSixFQVFJLEVBQUMsR0FBRyxDQUFKLEVBQU8sR0FBRyxHQUFWLEVBUkosRUFTSSxFQUFDLEdBQUcsQ0FBSixFQUFPLEdBQUcsR0FBVixFQVRKLEVBVUksRUFBQyxHQUFHLEVBQUosRUFBUSxHQUFHLENBQVgsRUFWSixFQVdJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxDQUFaLEVBWEosRUFZSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsQ0FBWixFQVpKLEVBYUksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLEVBQVosRUFiSixFQWNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBZEosRUFlSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWZKLEVBZ0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBaEJKLEVBaUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBakJKLEVBa0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbEJKLEVBbUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbkJKLEVBb0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBcEJKLENBREE7QUF1QkEsUUFBTSxTQUNOLENBQ0ksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLENBQVosRUFESixFQUVJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxDQUFaLEVBRkosRUFHSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsQ0FBWixFQUhKLEVBSUksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLENBQVosRUFKSixFQUtJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxDQUFaLEVBTEosRUFNSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsQ0FBWixFQU5KLEVBT0ksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLEVBQVosRUFQSixFQVFJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxFQUFaLEVBUkosRUFTSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsRUFBWixFQVRKLEVBVUksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLEVBQVosRUFWSixFQVdJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxFQUFaLEVBWEosRUFZSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsRUFBWixFQVpKLEVBYUksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLEVBQVosRUFiSixFQWNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBZEosRUFlSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWZKLEVBZ0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBaEJKLEVBaUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBakJKLEVBa0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbEJKLEVBbUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbkJKLEVBb0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBcEJKLEVBcUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBckJKLEVBc0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdEJKLEVBdUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdkJKLEVBd0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBeEJKLEVBeUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBekJKLEVBMEJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBMUJKLEVBMkJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBM0JKLEVBNEJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBNUJKLEVBNkJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBN0JKLEVBOEJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBOUJKLEVBK0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBL0JKLEVBZ0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBaENKLEVBaUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBakNKLEVBa0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbENKLEVBbUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbkNKLEVBb0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBcENKLEVBcUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBckNKLEVBc0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdENKLEVBdUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdkNKLEVBd0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBeENKLEVBeUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBekNKLEVBMENJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBMUNKLEVBMkNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBM0NKLEVBNENJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBNUNKLEVBNkNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBN0NKLEVBOENJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBOUNKLEVBK0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBL0NKLEVBZ0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBaERKLEVBaURJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBakRKLEVBa0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbERKLEVBbURJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbkRKLEVBb0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBcERKLEVBcURJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBckRKLEVBc0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdERKLEVBdURJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdkRKLEVBd0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBeERKLEVBeURJLEVBQUMsR0FBRyxH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eUIsT0FBekIsRUFBa0MsWUFDbEM7QUFDSSxtQkFBTyxJQUFQO0FBQ0gsU0FIRDtBQUlIOztBQUVEO0FBQ0EsSUFBTSxhQUFhLFNBQVMsZ0JBQVQsQ0FBMEIsWUFBMUIsQ0FBbkI7QUFDQSxJQUFJLFdBQVcsTUFBWCxHQUFvQixDQUF4QjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNJLDhCQUF3QixVQUF4QjtBQUFBLGdCQUFXLFNBQVg7O0FBQ0ksZ0JBQUksVUFBVSxpQkFBVixJQUErQixDQUFuQyxFQUNJLFVBQVUsVUFBVixDQUFxQixXQUFyQixDQUFpQyxTQUFqQztBQUZSO0FBREo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gTG9hZCBKU09OIGZpbGVcbmNvbnN0IGxvYWRKU09OID0gKGZpbGUsIGNhbGxiYWNrKSA9Plxue1xuICAgIGNvbnN0IHhvYmogPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHhvYmoub3ZlcnJpZGVNaW1lVHlwZSgnYXBwbGljYXRpb24vanNvbicpXG4gICAgeG9iai5vcGVuKCdHRVQnLCBgLi4vZGF0YWJhc2UvJHtmaWxlfS5qc29uYCwgdHJ1ZSlcbiAgICB4b2JqLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+XG4gICAge1xuICAgICAgICBpZiAoeG9iai5yZWFkeVN0YXRlID09IDQgJiYgeG9iai5zdGF0dXMgPT0gJzIwMCcpXG4gICAgICAgICAgICBjYWxsYmFjayh4b2JqLnJlc3BvbnNlVGV4dClcbiAgICB9XG4gICAgeG9iai5zZW5kKG51bGwpXG59XG5cbi8vIEdldCBjb250YWluZXJcbmNvbnN0ICRjb250YWluZXJNYXAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXIuY29udGFpbmVyLW1hcCcpXG5jb25zdCAkY29udGFpbmVyQ2F0Y2ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyLmNvbnRhaW5lci1jYXRjaCcpXG5jb25zdCAkYXVkaW8gICAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhdWRpbycpXG5cbi8vIENoZWNrIGlmIG1hcCBwYWdlXG5pZiAoJGNvbnRhaW5lck1hcClcbntcbiAgICAvL0dldCBlbGVtZW50c1xuICAgIGNvbnN0ICR0b3AgICAgICAgID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcudG9wJylcbiAgICBjb25zdCAkcmlnaHQgICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLnJpZ2h0JylcbiAgICBjb25zdCAkYm90dG9tICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLmJvdHRvbScpXG4gICAgY29uc3QgJGxlZnQgICAgICAgPSAkY29udGFpbmVyTWFwLnF1ZXJ5U2VsZWN0b3IoJy5sZWZ0JylcbiAgICBjb25zdCAkbWFwICAgICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLm1hcCcpXG4gICAgY29uc3QgJGNoYXJhY3RlciAgPSAkY29udGFpbmVyTWFwLnF1ZXJ5U2VsZWN0b3IoJy5jaGFyYWN0ZXInKVxuICAgIGNvbnN0ICRjcnVzaCAgICAgID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcuY3J1c2gnKVxuICAgIGNvbnN0ICRzcHJpdGUgICAgID0gJGNoYXJhY3Rlci5xdWVyeVNlbGVjdG9yKCcuc3ByaXRlJylcbiAgICBjb25zdCAkcG9rZWRleCAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLnBva2VkZXgnKVxuICAgIGNvbnN0ICRyZWN0YW5nbGVzID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcucmVjdGFuZ2xlcycpXG4gICAgXG4gICAgLy8gRGVmaW5lIHZhbHVlc3dcbiAgICBjb25zdCBwb3NpdGlvbiAgICA9IHt4OiBwYXJzZUludCgkY2hhcmFjdGVyLmRhdGFzZXQucG9zaXRpb254ICogMTApLCB5OiBwYXJzZUludCgkY2hhcmFjdGVyLmRhdGFzZXQucG9zaXRpb255ICogMTApfVxuICAgIGNvbnN0IHRpbGVTaXplICAgID0ge3g6IDAsIHk6IDB9XG4gICAgY29uc3QgU1BBV19SQVRFICAgPSAyNVxuICAgIGNvbnN0IE1BUF9ST1cgICAgID0gMTJcbiAgICBjb25zdCBNQVBfQ09MICAgICA9IDE1XG4gICAgY29uc3QgTUFQX1JBVElPICAgPSBNQVBfQ09MIC8gTUFQX1JPV1xuICAgIGNvbnN0IGZvcmJpZGRlbiAgID1cbiAgICBbXG4gICAgICAgIHt4OiAwLCB5OiAwfSxcbiAgICAgICAge3g6IDAsIHk6IDUwfSxcbiAgICAgICAge3g6IDAsIHk6IDEwMH0sXG4gICAgICAgIHt4OiAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDAsIHk6IDI1MH0sXG4gICAgICAgIHt4OiAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMCwgeTogNDAwfSxcbiAgICAgICAge3g6IDAsIHk6IDQ1MH0sXG4gICAgICAgIHt4OiA1MCwgeTogMH0sXG4gICAgICAgIHt4OiA2NTAsIHk6IDB9LFxuICAgICAgICB7eDogNzAwLCB5OiAwfSxcbiAgICAgICAge3g6IDcwMCwgeTogNTB9LFxuICAgICAgICB7eDogNzAwLCB5OiAxMDB9LFxuICAgICAgICB7eDogNzAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNzAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogNzAwLCB5OiAzMDB9LFxuICAgICAgICB7eDogNzAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNzAwLCB5OiA0MDB9LFxuICAgICAgICB7eDogNzAwLCB5OiA0NTB9LFxuICAgIF1cbiAgICBjb25zdCBidXNoZXMgPVxuICAgIFtcbiAgICAgICAge3g6IDE1MCwgeTogMH0sXG4gICAgICAgIHt4OiAyMDAsIHk6IDB9LFxuICAgICAgICB7eDogMzAwLCB5OiAwfSxcbiAgICAgICAge3g6IDM1MCwgeTogMH0sXG4gICAgICAgIHt4OiA0NTAsIHk6IDB9LFxuICAgICAgICB7eDogNTAwLCB5OiAwfSxcbiAgICAgICAge3g6IDIwMCwgeTogNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiA1MH0sXG4gICAgICAgIHt4OiAzMDAsIHk6IDUwfSxcbiAgICAgICAge3g6IDM1MCwgeTogNTB9LFxuICAgICAgICB7eDogNDAwLCB5OiA1MH0sXG4gICAgICAgIHt4OiA1MDAsIHk6IDUwfSxcbiAgICAgICAge3g6IDU1MCwgeTogNTB9LFxuICAgICAgICB7eDogMTUwLCB5OiAxMDB9LFxuICAgICAgICB7eDogMjAwLCB5OiAxMDB9LFxuICAgICAgICB7eDogMzAwLCB5OiAxMDB9LFxuICAgICAgICB7eDogNDAwLCB5OiAxMDB9LFxuICAgICAgICB7eDogNDUwLCB5OiAxMDB9LFxuICAgICAgICB7eDogNTUwLCB5OiAxMDB9LFxuICAgICAgICB7eDogMTUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMjAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMzAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMzUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNDAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNDUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNTAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNTUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNjAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMTAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogMjAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogMzAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNDAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNTAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNTUwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNjAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogMTAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMTUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMjAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMzAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMzUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogNDAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogNDUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogNTUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMTUwLCB5OiAzMDB9LFxuICAgICAgICB7eDogMjUwLCB5OiAzMDB9LFxuICAgICAgICB7eDogMzUwLCB5OiAzMDB9LFxuICAgICAgICB7eDogNDAwLCB5OiAzMDB9LFxuICAgICAgICB7eDogNTAwLCB5OiAzMDB9LFxuICAgICAgICB7eDogNjAwLCB5OiAzMDB9LFxuICAgICAgICB7eDogMTAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMjAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMzAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNDAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNDUwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNTAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNTUwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNjAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiA0MDB9LFxuICAgICAgICB7eDogMzUwLCB5OiA0MDB9LFxuICAgICAgICB7eDogNDAwLCB5OiA0MDB9LFxuICAgICAgICB7eDogNTUwLCB5OiA0MDB9LFxuICAgICAgICB7eDogMzAwLCB5OiA0NTB9XG4gICAgXVxuICAgIGxldCB3aW5kb3dXaWR0aCAgPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICBsZXQgY2FuV2FsayAgICAgID0gdHJ1ZVxuXG4gICAgLy8gU2V0IHNpemUgdG8gbWFwXG4gICAgY29uc3Qgc2V0SW1hZ2VTaXplPSAobGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0LCB0cmFuc2Zvcm0pID0+XG4gICAge1xuICAgICAgICAkbWFwLnN0eWxlLmxlZnQgICAgICA9IGxlZnRcbiAgICAgICAgJG1hcC5zdHlsZS50b3AgICAgICAgPSB0b3BcbiAgICAgICAgJG1hcC5zdHlsZS53aWR0aCAgICAgPSB3aWR0aFxuICAgICAgICAkbWFwLnN0eWxlLmhlaWdodCAgICA9IGhlaWdodFxuICAgICAgICAkbWFwLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuICAgIH1cblxuICAgIC8vIFJlc2l6ZSBpbWFnZXNcbiAgICBjb25zdCByZXNpemVJbWFnZSA9ICh3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0LCBjYWxsYmFjaykgPT5cbiAgICB7XG4gICAgICAgIC8vIENoZWNrIGlmIGxhbmRzY2FwZSBvciBwb3J0cmFpdFxuICAgICAgICBpZiAod2luZG93V2lkdGggLyB3aW5kb3dIZWlnaHQgPD0gTUFQX1JBVElPKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZXRJbWFnZVNpemUoJzAnLCAnNTAlJywgJzEwMCUnLCAnYXV0bycsICd0cmFuc2xhdGVZKC01MCUpJylcbiAgICAgICAgICAgICR0b3Auc3R5bGUuekluZGV4ICAgID0gJzEnXG4gICAgICAgICAgICAkcmlnaHQuc3R5bGUuekluZGV4ICA9ICcwJ1xuICAgICAgICAgICAgJGJvdHRvbS5zdHlsZS56SW5kZXggPSAnMSdcbiAgICAgICAgICAgICRsZWZ0LnN0eWxlLnpJbmRleCAgID0gJzAnXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBzZXRJbWFnZVNpemUoJzUwJScsICcwJywgJ2F1dG8nLCAnMTAwJScsICd0cmFuc2xhdGVYKC01MCUpJylcbiAgICAgICAgICAgICR0b3Auc3R5bGUuekluZGV4ICAgID0gJzAnXG4gICAgICAgICAgICAkcmlnaHQuc3R5bGUuekluZGV4ICA9ICcxJ1xuICAgICAgICAgICAgJGJvdHRvbS5zdHlsZS56SW5kZXggPSAnMCdcbiAgICAgICAgICAgICRsZWZ0LnN0eWxlLnpJbmRleCAgID0gJzEnXG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2soKVxuICAgIH1cblxuICAgIC8vIFNldCBzdHlsZSB0byBlbGVtZW50c1xuICAgIGNvbnN0IHNldFN0eWxlcyA9ICgpID0+XG4gICAge1xuICAgICAgICBjb25zdCB0b3BPZmZzZXQgICAgPSAkbWFwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICAgICAgICBjb25zdCBsZWZ0T2Zmc2V0ICAgPSAkbWFwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcbiAgICAgICAgY29uc3Qgd2lkdGhPZmZzZXQgID0gJG1hcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuICAgICAgICBjb25zdCBoZWlnaHRPZmZzZXQgPSAkbWFwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodFxuICAgICAgICAkdG9wLnN0eWxlLmJvdHRvbSAgPSBgJHt0b3BPZmZzZXR9cHhgXG4gICAgICAgICRyaWdodC5zdHlsZS5sZWZ0ICA9IGAke2xlZnRPZmZzZXR9cHhgXG4gICAgICAgICRib3R0b20uc3R5bGUudG9wICA9IGAke3RvcE9mZnNldH1weGBcbiAgICAgICAgJGxlZnQuc3R5bGUucmlnaHQgID0gYCR7bGVmdE9mZnNldH1weGBcbiAgICAgICAgdGlsZVNpemUueCAgICAgICAgID0gd2lkdGhPZmZzZXQgIC8gTUFQX0NPTFxuICAgICAgICB0aWxlU2l6ZS55ICAgICAgICAgPSBoZWlnaHRPZmZzZXQgLyBNQVBfUk9XXG4gICAgICAgICRjaGFyYWN0ZXIuc3R5bGUubGVmdCAgICAgID0gYCR7bGVmdE9mZnNldCAtIHRpbGVTaXplLnggLyAyfXB4YFxuICAgICAgICAkY2hhcmFjdGVyLnN0eWxlLnRvcCAgICAgICA9IGAke3RvcE9mZnNldH1weGBcbiAgICAgICAgJGNoYXJhY3Rlci5zdHlsZS53aWR0aCAgICAgPSBgJHt0aWxlU2l6ZS54ICogMn1weGBcbiAgICAgICAgJGNoYXJhY3Rlci5zdHlsZS5oZWlnaHQgICAgPSBgJHt0aWxlU2l6ZS55ICogMn1weGBcbiAgICAgICAgJGNoYXJhY3Rlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7cG9zaXRpb24ueH0lLCAke3Bvc2l0aW9uLnl9JSlgXG4gICAgICAgICRzcHJpdGUuc3R5bGUud2lkdGggICAgICAgID0gYDMwMCVgXG4gICAgICAgICRzcHJpdGUuc3R5bGUuaGVpZ2h0ICAgICAgID0gYDQwMCVgXG4gICAgICAgICRjcnVzaC5zdHlsZS5sZWZ0ICAgICAgICAgID0gYCR7bGVmdE9mZnNldH1weGBcbiAgICAgICAgJGNydXNoLnN0eWxlLnRvcCAgICAgICAgICAgPSBgJHt0b3BPZmZzZXQgKyB0aWxlU2l6ZS55fXB4YFxuICAgICAgICAkY3J1c2guc3R5bGUud2lkdGggICAgICAgICA9IGAke3RpbGVTaXplLnh9cHhgXG4gICAgICAgICRjcnVzaC5zdHlsZS5oZWlnaHQgICAgICAgID0gYCR7dGlsZVNpemUueX1weGBcbiAgICAgICAgJHBva2VkZXguc3R5bGUuYm90dG9tICAgICAgPSBgJHt0aWxlU2l6ZS55fXB4YFxuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIG5leCBwb3NpdGlvbiBvZiBjaGFyYWN0ZXIgaXMgYWxsb3dlZFxuICAgIGNvbnN0IGFsbG93UG9zaXRpb24gPSAocG9zaXRpb25YLCBwb3NpdGlvblkpID0+XG4gICAge1xuICAgICAgICBmb3IgKGNvbnN0IGZvcmJpZGRlblBvc2l0aW9uIG9mIGZvcmJpZGRlbilcbiAgICAgICAgICAgIGlmIChmb3JiaWRkZW5Qb3NpdGlvbi54ID09IHBvc2l0aW9uWCAmJiBmb3JiaWRkZW5Qb3NpdGlvbi55ID09IHBvc2l0aW9uWSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB3YWxraW5nIG9uIGJ1c2hcbiAgICBjb25zdCBzdGVwQnVzaCA9IChwb3NpdGlvblgsIHBvc2l0aW9uWSkgPT5cbiAgICB7XG4gICAgICAgIGZvciAoY29uc3QgYnVzaCBvZiBidXNoZXMpXG4gICAgICAgICAgICBpZiAoYnVzaC54ID09IHBvc2l0aW9uWCAmJiBidXNoLnkgPT0gcG9zaXRpb25ZKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIC8vIExvYWQgcG9rZW1vblxuICAgIGNvbnN0IGxvYWRQb2tlbW9uID0gKGFycmF5KSA9PlxuICAgIHtcbiAgICAgICAgJGNydXNoLnN0eWxlLm9wYWNpdHkgPSAnMSdcbiAgICAgICAgY29uc3QgcG9rZW1vbkluZGV4ICA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE1MSlcbiAgICAgICAgY29uc3QgcG9rZW1vblNwYXduICA9IGFycmF5W3Bva2Vtb25JbmRleF0uc3Bhd25fY2hhbmNlXG4gICAgICAgIGNvbnN0IHBva2Vtb25DaGFuY2UgPSBNYXRoLnJhbmRvbSgpICogU1BBV19SQVRFIC0gcG9rZW1vblNwYXduXG4gICAgICAgIGNvbnN0IGlzU3Bhd25lZCAgICAgPSBwb2tlbW9uQ2hhbmNlIDwgMCA/IHRydWUgOiBmYWxzZVxuXG4gICAgICAgIC8vIENoZWNrIGlmIHBva2Vtb24gaXMgc3Bhd25lZFxuICAgICAgICBpZiAoaXNTcGF3bmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBGb3JiaWQgdG8gd2Fsa1xuICAgICAgICAgICAgY2FuV2FsayA9IGZhbHNlXG5cbiAgICAgICAgICAgIC8vIFNlbmQgZGF0YVxuICAgICAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgICAgICAgIHhoci5vcGVuKCdQT1NUJywgJy4vJylcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcbiAgICAgICAgICAgIHhoci5zZW5kKGVuY29kZVVSSShgYWN0aW9uPWNhdGNoJnBva2Vtb25faW5kZXg9JHtwb2tlbW9uSW5kZXh9JnBvc2l0aW9uX3g9JHtwb3NpdGlvbi54IC8gMTB9JnBvc2l0aW9uX3k9JHtwb3NpdGlvbi55IC8gMTB9YCkpXG5cbiAgICAgICAgICAgIC8vIExpc3RlbiB0byByZXF1ZXN0IGRvbmVcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIEFkZCByZWN0YW5nbGVzXG4gICAgICAgICAgICAgICAgJHJlY3RhbmdsZXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcblxuICAgICAgICAgICAgICAgIC8vIExvYWQgbmV3IHBhZ2VcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2NhdGNoJ1xuICAgICAgICAgICAgICAgIH0sIDIwMDApXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBMb2FkIHBva2VkeCBkYXRhXG4gICAgbG9hZEpTT04oJ3Bva2VkZXgnLCAocmVzcG9uc2UpID0+XG4gICAge1xuICAgICAgICAvLyBQYXJzZSBkYXRhXG4gICAgICAgIGNvbnN0IEpTT05fZmlsZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpXG4gICAgICAgIGNvbnN0IHBva2Vtb25zICA9IEpTT05fZmlsZS5wb2tlbW9uXG5cbiAgICAgICAgLy8gTGlzdGVuIHRvIGtleWRvd25cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGNoYXJhY3RlciBjYW4gd2Fsa1xuICAgICAgICAgICAgaWYgKGNhbldhbGspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzNzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxvd1Bvc2l0aW9uKE1hdGgubWF4KDAsIHBvc2l0aW9uLnggLSA1MCksIHBvc2l0aW9uLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnggPSBNYXRoLm1heCgwLCBwb3NpdGlvbi54IC0gNTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0ZXBCdXNoKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkUG9rZW1vbihwb2tlbW9ucylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjcnVzaC5zdHlsZS5vcGFjaXR5ID0gJzAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3ByaXRlLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoMCUsIC0yNSUpYFxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxvd1Bvc2l0aW9uKE1hdGgubWluKChNQVBfQ09MIC0gMSkgKiA1MCwgcG9zaXRpb24ueCArIDUwKSwgcG9zaXRpb24ueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueCA9IE1hdGgubWluKChNQVBfQ09MIC0gMSkgKiA1MCwgcG9zaXRpb24ueCArIDUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGVwQnVzaChwb3NpdGlvbi54LCBwb3NpdGlvbi55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZFBva2Vtb24ocG9rZW1vbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY3J1c2guc3R5bGUub3BhY2l0eSA9ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNwcml0ZS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKDAlLCAtNzUlKWBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxsb3dQb3NpdGlvbihwb3NpdGlvbi54LCBNYXRoLm1heCgwLCBwb3NpdGlvbi55IC0gNTApKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi55ID0gTWF0aC5tYXgoMCwgcG9zaXRpb24ueSAtIDUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGVwQnVzaChwb3NpdGlvbi54LCBwb3NpdGlvbi55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZFBva2Vtb24ocG9rZW1vbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY3J1c2guc3R5bGUub3BhY2l0eSA9ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNwcml0ZS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKDAlLCAtNTAlKWBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxsb3dQb3NpdGlvbihwb3NpdGlvbi54LCBNYXRoLm1pbigoTUFQX1JPVyAtIDMpICogNTAsIHBvc2l0aW9uLnkgKyA1MCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnkgPSBNYXRoLm1pbigoTUFQX1JPVyAtIDMpICogNTAsIHBvc2l0aW9uLnkgKyA1MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RlcEJ1c2gocG9zaXRpb24ueCwgcG9zaXRpb24ueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRQb2tlbW9uKHBva2Vtb25zKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNydXNoLnN0eWxlLm9wYWNpdHkgPSAnMCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICRzcHJpdGUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgwJSwgMClgXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAkY2hhcmFjdGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtwb3NpdGlvbi54fSUsICR7cG9zaXRpb24ueX0lKWBcbiAgICAgICAgICAgICAgICAkY3J1c2guc3R5bGUudHJhbnNmb3JtICAgICA9IGB0cmFuc2xhdGUoJHtwb3NpdGlvbi54ICogMn0lLCAke3Bvc2l0aW9uLnkgKiAyfSUpYFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyBJbml0aWFsaXplIG1hcCBzaXplXG4gICAgc2V0VGltZW91dCgoKSA9PlxuICAgIHtcbiAgICAgICAgcmVzaXplSW1hZ2Uod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCwgc2V0U3R5bGVzKVxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGUnKVxuICAgIH0sIDI1MClcblxuICAgIC8vIExpc3RlbiB0byByZXNpemVcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT5cbiAgICB7XG4gICAgICAgIHdpbmRvd1dpZHRoICA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICByZXNpemVJbWFnZSh3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0LCBzZXRTdHlsZXMpXG4gICAgfSlcbn1cbi8vIENoZWNrIGlmIGNhdGNoaW5nIHBhZ2VcbmVsc2UgaWYgKCRjb250YWluZXJDYXRjaClcbntcbiAgICAvLyBHZXQgZWxlbWVudHNcbiAgICBjb25zdCAkcmVjdGFuZ2xlcyAgID0gJGNvbnRhaW5lckNhdGNoLnF1ZXJ5U2VsZWN0b3IoJy5yZWN0YW5nbGVzJylcbiAgICBjb25zdCAkdGl0bGUgICAgICAgID0gJGNvbnRhaW5lckNhdGNoLnF1ZXJ5U2VsZWN0b3IoJ2gxJylcbiAgICBjb25zdCAkYXBwZWFycyAgICAgID0gJHRpdGxlLnF1ZXJ5U2VsZWN0b3IoJy5hcHBlYXJzJylcbiAgICBjb25zdCAkY2F1Z2h0ICAgICAgID0gJHRpdGxlLnF1ZXJ5U2VsZWN0b3IoJy5jYXVnaHQnKVxuICAgIGNvbnN0ICRlc2NhcGVkICAgICAgPSAkdGl0bGUucXVlcnlTZWxlY3RvcignLmVzY2FwZWQnKVxuICAgIGNvbnN0ICRhcHBlYXJhbmNlICAgPSAkY29udGFpbmVyQ2F0Y2gucXVlcnlTZWxlY3RvcignLmFwcGVhcmFuY2UnKVxuICAgIGNvbnN0ICRpbGx1c3RyYXRpb24gPSAkY29udGFpbmVyQ2F0Y2gucXVlcnlTZWxlY3RvcignLmlsbHVzdHJhdGlvbicpXG4gICAgY29uc3QgJGJ1dHRvbiAgICAgICA9ICRjb250YWluZXJDYXRjaC5xdWVyeVNlbGVjdG9yKCcuYnV0dG9uJylcbiAgICBjb25zdCAkdG9vbCAgICAgICAgID0gJGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCcudG9vbCcpXG4gICAgY29uc3QgQ0FUQ0hfUkFURSAgICA9IDc1XG5cbiAgICAvLyBMb2FkIHBva2VkZXggZGF0YVxuICAgIGxvYWRKU09OKCdwb2tlZGV4JywgKHJlc3BvbnNlKSA9PlxuICAgIHtcbiAgICAgICAgLy8gUGFyc2UgZGF0YVxuICAgICAgICBjb25zdCBKU09OX2ZpbGUgICAgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxuICAgICAgICBjb25zdCBwb2tlbW9ucyAgICAgPSBKU09OX2ZpbGUucG9rZW1vblxuICAgICAgICBjb25zdCBwb2tlbW9uTmFtZSAgPSAkYXBwZWFyYW5jZS5nZXRBdHRyaWJ1dGUoJ2FsdCcpXG4gICAgICAgIGNvbnN0IHBva2Vtb24gICAgICA9IHBva2Vtb25zLmZpbmQocG9rZW1vbiA9PiBwb2tlbW9uLm5hbWUgPT0gcG9rZW1vbk5hbWUpXG4gICAgICAgIGNvbnN0IHBva2Vtb25JbmRleCA9IHBva2Vtb25zLmluZGV4T2YocG9rZW1vbilcbiAgICAgICAgY29uc3QgcG9rZW1vbkNhdGNoID0gcG9rZW1vbi5jYXRjaF9jaGFuY2VcblxuICAgICAgICAvLyBSZW1vdmUgcmVjdGFuZ2xlc1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgICRyZWN0YW5nbGVzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG5cbiAgICAgICAgICAgIC8vIERpc3BsYXkgZWxlbWVudHNcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkdGl0bGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICAkYXBwZWFyYW5jZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICAgICAgICAgICRpbGx1c3RyYXRpb24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcblxuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgYnV0dG9uXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJHRvb2wuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lckNhdGNoLnJlbW92ZUNoaWxkKCRyZWN0YW5nbGVzKVxuICAgICAgICAgICAgICAgICAgICAkYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAkdG9vbC5jbGFzc0xpc3QuYWRkKCd0aHJvd24nKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaHJvdyBwb2tlYmFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkYXBwZWFyYW5jZS5jbGFzc0xpc3QuYWRkKCdjYXVnaHQnKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2F0Y2ggcG9rZW1vblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRhcHBlYXJzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9rZW1vbkNoYW5jZSA9IE1hdGgucmFuZG9tKCkgKiBDQVRDSF9SQVRFIC0gcG9rZW1vbkNhdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQ2F1Z2h0ICAgICAgPSBwb2tlbW9uQ2hhbmNlIDwgMCA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgcG9rZW1vbiBpcyBjYXVnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ2F1Z2h0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjYXVnaHQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2VuZCBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnLi8nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQoZW5jb2RlVVJJKGBhY3Rpb249Y2F1Z2h0JnBva2Vtb25faW5kZXg9JHtwb2tlbW9uSW5kZXh9YCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIub25sb2FkID0gKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2ZhZGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMjUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEyNTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlc2NhcGVkLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkYXBwZWFyYW5jZS5jbGFzc0xpc3QucmVtb3ZlKCdjYXVnaHQnKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXQgcG9rZW1vbiBlc2NhcGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRhcHBlYXJhbmNlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGYWRlb3V0IHdpbmRvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnZmFkZScpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVkaXJlY3QgdG8gbWFwIHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTI1MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMjUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMDApXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMjUwKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0sIDEwMDApXG4gICAgICAgICAgICB9LCAxMDAwKVxuICAgICAgICB9LCAyNTApXG4gICAgfSlcbn1cbmVsc2UgaWYgKCRhdWRpbylcbntcbiAgICBjb25zdCAkYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNoZWV0LWJ1dHRvbicpXG4gICAgJGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAge1xuICAgICAgICAkYXVkaW8ucGxheSgpXG4gICAgfSlcbn1cblxuLy8gUmVtb3ZlIGVtcHR5IGNvbHVtbnNcbmNvbnN0ICRzaGVldENvbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2hlZXQtY29sJylcbmlmICgkc2hlZXRDb2xzLmxlbmd0aCA+IDApXG4gICAgZm9yIChjb25zdCAkc2hlZXRDb2wgb2YgJHNoZWV0Q29scylcbiAgICAgICAgaWYgKCRzaGVldENvbC5jaGlsZEVsZW1lbnRDb3VudCA9PSAwKVxuICAgICAgICAgICAgJHNoZWV0Q29sLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoJHNoZWV0Q29sKSJdfQ==
