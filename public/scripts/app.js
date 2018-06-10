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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9zY3JpcHRzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQSxJQUFNLFdBQVcsU0FBWCxRQUFXLENBQUMsSUFBRCxFQUFPLFFBQVAsRUFDakI7QUFDSSxRQUFNLE9BQU8sSUFBSSxjQUFKLEVBQWI7QUFDQSxTQUFLLGdCQUFMLENBQXNCLGtCQUF0QjtBQUNBLFNBQUssSUFBTCxDQUFVLEtBQVYsbUJBQWdDLElBQWhDLFlBQTZDLElBQTdDO0FBQ0EsU0FBSyxrQkFBTCxHQUEwQixZQUMxQjtBQUNJLFlBQUksS0FBSyxVQUFMLElBQW1CLENBQW5CLElBQXdCLEtBQUssTUFBTCxJQUFlLEtBQTNDLEVBQ0ksU0FBUyxLQUFLLFlBQWQ7QUFDUCxLQUpEO0FBS0EsU0FBSyxJQUFMLENBQVUsSUFBVjtBQUNILENBWEQ7O0FBYUE7QUFDQSxJQUFNLGdCQUFrQixTQUFTLGFBQVQsQ0FBdUIsMEJBQXZCLENBQXhCO0FBQ0EsSUFBTSxrQkFBa0IsU0FBUyxhQUFULENBQXVCLDRCQUF2QixDQUF4QjtBQUNBLElBQU0sU0FBa0IsU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQXhCOztBQUVBO0FBQ0EsSUFBSSxhQUFKLEVBQ0E7QUFDSTtBQUNBLFFBQU0sT0FBYyxjQUFjLGFBQWQsQ0FBNEIsTUFBNUIsQ0FBcEI7QUFDQSxRQUFNLFNBQWMsY0FBYyxhQUFkLENBQTRCLFFBQTVCLENBQXBCO0FBQ0EsUUFBTSxVQUFjLGNBQWMsYUFBZCxDQUE0QixTQUE1QixDQUFwQjtBQUNBLFFBQU0sUUFBYyxjQUFjLGFBQWQsQ0FBNEIsT0FBNUIsQ0FBcEI7QUFDQSxRQUFNLE9BQWMsY0FBYyxhQUFkLENBQTRCLE1BQTVCLENBQXBCO0FBQ0EsUUFBTSxhQUFjLGNBQWMsYUFBZCxDQUE0QixZQUE1QixDQUFwQjtBQUNBLFFBQU0sU0FBYyxjQUFjLGFBQWQsQ0FBNEIsUUFBNUIsQ0FBcEI7QUFDQSxRQUFNLFVBQWMsV0FBVyxhQUFYLENBQXlCLFNBQXpCLENBQXBCO0FBQ0EsUUFBTSxXQUFjLGNBQWMsYUFBZCxDQUE0QixVQUE1QixDQUFwQjtBQUNBLFFBQU0sY0FBYyxjQUFjLGFBQWQsQ0FBNEIsYUFBNUIsQ0FBcEI7O0FBRUE7QUFDQSxRQUFNLFdBQWMsRUFBQyxHQUFHLFNBQVMsV0FBVyxPQUFYLENBQW1CLFNBQW5CLEdBQStCLEVBQXhDLENBQUosRUFBaUQsR0FBRyxTQUFTLFdBQVcsT0FBWCxDQUFtQixTQUFuQixHQUErQixFQUF4QyxDQUFwRCxFQUFwQjtBQUNBLFFBQU0sV0FBYyxFQUFDLEdBQUcsQ0FBSixFQUFPLEdBQUcsQ0FBVixFQUFwQjtBQUNBLFFBQU0sWUFBYyxFQUFwQjtBQUNBLFFBQU0sVUFBYyxFQUFwQjtBQUNBLFFBQU0sVUFBYyxFQUFwQjtBQUNBLFFBQU0sWUFBYyxVQUFVLE9BQTlCO0FBQ0EsUUFBTSxZQUNOLENBQ0ksRUFBQyxHQUFHLENBQUosRUFBTyxHQUFHLENBQVYsRUFESixFQUVJLEVBQUMsR0FBRyxDQUFKLEVBQU8sR0FBRyxFQUFWLEVBRkosRUFHSSxFQUFDLEdBQUcsQ0FBSixFQUFPLEdBQUcsR0FBVixFQUhKLEVBSUksRUFBQyxHQUFHLENBQUosRUFBTyxHQUFHLEdBQVYsRUFKSixFQUtJLEVBQUMsR0FBRyxDQUFKLEVBQU8sR0FBRyxHQUFWLEVBTEosRUFNSSxFQUFDLEdBQUcsQ0FBSixFQUFPLEdBQUcsR0FBVixFQU5KLEVBT0ksRUFBQyxHQUFHLENBQUosRUFBTyxHQUFHLEdBQVYsRUFQSixFQVFJLEVBQUMsR0FBRyxDQUFKLEVBQU8sR0FBRyxHQUFWLEVBUkosRUFTSSxFQUFDLEdBQUcsQ0FBSixFQUFPLEdBQUcsR0FBVixFQVRKLEVBVUksRUFBQyxHQUFHLEVBQUosRUFBUSxHQUFHLENBQVgsRUFWSixFQVdJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxDQUFaLEVBWEosRUFZSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsQ0FBWixFQVpKLEVBYUksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLEVBQVosRUFiSixFQWNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBZEosRUFlSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWZKLEVBZ0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBaEJKLEVBaUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBakJKLEVBa0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbEJKLEVBbUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbkJKLEVBb0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBcEJKLENBREE7QUF1QkEsUUFBTSxTQUNOLENBQ0ksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLENBQVosRUFESixFQUVJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxDQUFaLEVBRkosRUFHSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsQ0FBWixFQUhKLEVBSUksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLENBQVosRUFKSixFQUtJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxDQUFaLEVBTEosRUFNSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsQ0FBWixFQU5KLEVBT0ksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLEVBQVosRUFQSixFQVFJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxFQUFaLEVBUkosRUFTSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsRUFBWixFQVRKLEVBVUksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLEVBQVosRUFWSixFQVdJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxFQUFaLEVBWEosRUFZSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsRUFBWixFQVpKLEVBYUksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLEVBQVosRUFiSixFQWNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBZEosRUFlSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWZKLEVBZ0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBaEJKLEVBaUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBakJKLEVBa0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbEJKLEVBbUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbkJKLEVBb0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBcEJKLEVBcUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBckJKLEVBc0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdEJKLEVBdUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdkJKLEVBd0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBeEJKLEVBeUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBekJKLEVBMEJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBMUJKLEVBMkJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBM0JKLEVBNEJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBNUJKLEVBNkJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBN0JKLEVBOEJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBOUJKLEVBK0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBL0JKLEVBZ0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBaENKLEVBaUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBakNKLEVBa0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbENKLEVBbUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbkNKLEVBb0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBcENKLEVBcUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBckNKLEVBc0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdENKLEVBdUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdkNKLEVBd0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBeENKLEVBeUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBekNKLEVBMENJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBMUNKLEVBMkNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBM0NKLEVBNENJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBNUNKLEVBNkNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBN0NKLEVBOENJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBOUNKLEVBK0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBL0NKLEVBZ0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBaERKLEVBaURJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBakRKLEVBa0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbERKLEVBbURJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbkRKLEVBb0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBcERKLEVBcURJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBckRKLEVBc0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdERKLEVBdURJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdkRKLEVBd0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBeERKLEVBeURJLEVBQUMsR0FBRyxH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QXlCLE9BQXpCLEVBQWtDLFlBQ2xDO0FBQ0ksbUJBQU8sSUFBUDtBQUNILFNBSEQ7QUFJSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIExvYWQgSlNPTiBmaWxlXG5jb25zdCBsb2FkSlNPTiA9IChmaWxlLCBjYWxsYmFjaykgPT5cbntcbiAgICBjb25zdCB4b2JqID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICB4b2JqLm92ZXJyaWRlTWltZVR5cGUoJ2FwcGxpY2F0aW9uL2pzb24nKVxuICAgIHhvYmoub3BlbignR0VUJywgYC4uL2RhdGFiYXNlLyR7ZmlsZX0uanNvbmAsIHRydWUpXG4gICAgeG9iai5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PlxuICAgIHtcbiAgICAgICAgaWYgKHhvYmoucmVhZHlTdGF0ZSA9PSA0ICYmIHhvYmouc3RhdHVzID09ICcyMDAnKVxuICAgICAgICAgICAgY2FsbGJhY2soeG9iai5yZXNwb25zZVRleHQpXG4gICAgfVxuICAgIHhvYmouc2VuZChudWxsKVxufVxuXG4vLyBHZXQgY29udGFpbmVyXG5jb25zdCAkY29udGFpbmVyTWFwICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyLmNvbnRhaW5lci1tYXAnKVxuY29uc3QgJGNvbnRhaW5lckNhdGNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lci5jb250YWluZXItY2F0Y2gnKVxuY29uc3QgJGF1ZGlvICAgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYXVkaW8nKVxuXG4vLyBDaGVjayBpZiBtYXAgcGFnZVxuaWYgKCRjb250YWluZXJNYXApXG57XG4gICAgLy9HZXQgZWxlbWVudHNcbiAgICBjb25zdCAkdG9wICAgICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLnRvcCcpXG4gICAgY29uc3QgJHJpZ2h0ICAgICAgPSAkY29udGFpbmVyTWFwLnF1ZXJ5U2VsZWN0b3IoJy5yaWdodCcpXG4gICAgY29uc3QgJGJvdHRvbSAgICAgPSAkY29udGFpbmVyTWFwLnF1ZXJ5U2VsZWN0b3IoJy5ib3R0b20nKVxuICAgIGNvbnN0ICRsZWZ0ICAgICAgID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcubGVmdCcpXG4gICAgY29uc3QgJG1hcCAgICAgICAgPSAkY29udGFpbmVyTWFwLnF1ZXJ5U2VsZWN0b3IoJy5tYXAnKVxuICAgIGNvbnN0ICRjaGFyYWN0ZXIgID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcuY2hhcmFjdGVyJylcbiAgICBjb25zdCAkY3J1c2ggICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLmNydXNoJylcbiAgICBjb25zdCAkc3ByaXRlICAgICA9ICRjaGFyYWN0ZXIucXVlcnlTZWxlY3RvcignLnNwcml0ZScpXG4gICAgY29uc3QgJHBva2VkZXggICAgPSAkY29udGFpbmVyTWFwLnF1ZXJ5U2VsZWN0b3IoJy5wb2tlZGV4JylcbiAgICBjb25zdCAkcmVjdGFuZ2xlcyA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLnJlY3RhbmdsZXMnKVxuICAgIFxuICAgIC8vIERlZmluZSB2YWx1ZXN3XG4gICAgY29uc3QgcG9zaXRpb24gICAgPSB7eDogcGFyc2VJbnQoJGNoYXJhY3Rlci5kYXRhc2V0LnBvc2l0aW9ueCAqIDEwKSwgeTogcGFyc2VJbnQoJGNoYXJhY3Rlci5kYXRhc2V0LnBvc2l0aW9ueSAqIDEwKX1cbiAgICBjb25zdCB0aWxlU2l6ZSAgICA9IHt4OiAwLCB5OiAwfVxuICAgIGNvbnN0IFNQQVdfUkFURSAgID0gMjVcbiAgICBjb25zdCBNQVBfUk9XICAgICA9IDEyXG4gICAgY29uc3QgTUFQX0NPTCAgICAgPSAxNVxuICAgIGNvbnN0IE1BUF9SQVRJTyAgID0gTUFQX0NPTCAvIE1BUF9ST1dcbiAgICBjb25zdCBmb3JiaWRkZW4gICA9XG4gICAgW1xuICAgICAgICB7eDogMCwgeTogMH0sXG4gICAgICAgIHt4OiAwLCB5OiA1MH0sXG4gICAgICAgIHt4OiAwLCB5OiAxMDB9LFxuICAgICAgICB7eDogMCwgeTogMTUwfSxcbiAgICAgICAge3g6IDAsIHk6IDIwMH0sXG4gICAgICAgIHt4OiAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDAsIHk6IDQwMH0sXG4gICAgICAgIHt4OiAwLCB5OiA0NTB9LFxuICAgICAgICB7eDogNTAsIHk6IDB9LFxuICAgICAgICB7eDogNjUwLCB5OiAwfSxcbiAgICAgICAge3g6IDcwMCwgeTogMH0sXG4gICAgICAgIHt4OiA3MDAsIHk6IDUwfSxcbiAgICAgICAge3g6IDcwMCwgeTogMTAwfSxcbiAgICAgICAge3g6IDcwMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDcwMCwgeTogMjUwfSxcbiAgICAgICAge3g6IDcwMCwgeTogMzAwfSxcbiAgICAgICAge3g6IDcwMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDcwMCwgeTogNDAwfSxcbiAgICAgICAge3g6IDcwMCwgeTogNDUwfSxcbiAgICBdXG4gICAgY29uc3QgYnVzaGVzID1cbiAgICBbXG4gICAgICAgIHt4OiAxNTAsIHk6IDB9LFxuICAgICAgICB7eDogMjAwLCB5OiAwfSxcbiAgICAgICAge3g6IDMwMCwgeTogMH0sXG4gICAgICAgIHt4OiAzNTAsIHk6IDB9LFxuICAgICAgICB7eDogNDUwLCB5OiAwfSxcbiAgICAgICAge3g6IDUwMCwgeTogMH0sXG4gICAgICAgIHt4OiAyMDAsIHk6IDUwfSxcbiAgICAgICAge3g6IDI1MCwgeTogNTB9LFxuICAgICAgICB7eDogMzAwLCB5OiA1MH0sXG4gICAgICAgIHt4OiAzNTAsIHk6IDUwfSxcbiAgICAgICAge3g6IDQwMCwgeTogNTB9LFxuICAgICAgICB7eDogNTAwLCB5OiA1MH0sXG4gICAgICAgIHt4OiA1NTAsIHk6IDUwfSxcbiAgICAgICAge3g6IDE1MCwgeTogMTAwfSxcbiAgICAgICAge3g6IDIwMCwgeTogMTAwfSxcbiAgICAgICAge3g6IDMwMCwgeTogMTAwfSxcbiAgICAgICAge3g6IDQwMCwgeTogMTAwfSxcbiAgICAgICAge3g6IDQ1MCwgeTogMTAwfSxcbiAgICAgICAge3g6IDU1MCwgeTogMTAwfSxcbiAgICAgICAge3g6IDE1MCwgeTogMTUwfSxcbiAgICAgICAge3g6IDIwMCwgeTogMTUwfSxcbiAgICAgICAge3g6IDI1MCwgeTogMTUwfSxcbiAgICAgICAge3g6IDMwMCwgeTogMTUwfSxcbiAgICAgICAge3g6IDM1MCwgeTogMTUwfSxcbiAgICAgICAge3g6IDQwMCwgeTogMTUwfSxcbiAgICAgICAge3g6IDQ1MCwgeTogMTUwfSxcbiAgICAgICAge3g6IDUwMCwgeTogMTUwfSxcbiAgICAgICAge3g6IDU1MCwgeTogMTUwfSxcbiAgICAgICAge3g6IDYwMCwgeTogMTUwfSxcbiAgICAgICAge3g6IDEwMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDIwMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDMwMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDQwMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDUwMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDU1MCwgeTogMjAwfSxcbiAgICAgICAge3g6IDYwMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDEwMCwgeTogMjUwfSxcbiAgICAgICAge3g6IDE1MCwgeTogMjUwfSxcbiAgICAgICAge3g6IDIwMCwgeTogMjUwfSxcbiAgICAgICAge3g6IDI1MCwgeTogMjUwfSxcbiAgICAgICAge3g6IDMwMCwgeTogMjUwfSxcbiAgICAgICAge3g6IDM1MCwgeTogMjUwfSxcbiAgICAgICAge3g6IDQwMCwgeTogMjUwfSxcbiAgICAgICAge3g6IDQ1MCwgeTogMjUwfSxcbiAgICAgICAge3g6IDU1MCwgeTogMjUwfSxcbiAgICAgICAge3g6IDE1MCwgeTogMzAwfSxcbiAgICAgICAge3g6IDI1MCwgeTogMzAwfSxcbiAgICAgICAge3g6IDM1MCwgeTogMzAwfSxcbiAgICAgICAge3g6IDQwMCwgeTogMzAwfSxcbiAgICAgICAge3g6IDUwMCwgeTogMzAwfSxcbiAgICAgICAge3g6IDYwMCwgeTogMzAwfSxcbiAgICAgICAge3g6IDEwMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDIwMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDI1MCwgeTogMzUwfSxcbiAgICAgICAge3g6IDMwMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDQwMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDQ1MCwgeTogMzUwfSxcbiAgICAgICAge3g6IDUwMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDU1MCwgeTogMzUwfSxcbiAgICAgICAge3g6IDYwMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDI1MCwgeTogNDAwfSxcbiAgICAgICAge3g6IDM1MCwgeTogNDAwfSxcbiAgICAgICAge3g6IDQwMCwgeTogNDAwfSxcbiAgICAgICAge3g6IDU1MCwgeTogNDAwfSxcbiAgICAgICAge3g6IDMwMCwgeTogNDUwfVxuICAgIF1cbiAgICBsZXQgd2luZG93V2lkdGggID0gd2luZG93LmlubmVyV2lkdGhcbiAgICBsZXQgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XG4gICAgbGV0IGNhbldhbGsgICAgICA9IHRydWVcblxuICAgIC8vIFNldCBzaXplIHRvIG1hcFxuICAgIGNvbnN0IHNldEltYWdlU2l6ZT0gKGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCwgdHJhbnNmb3JtKSA9PlxuICAgIHtcbiAgICAgICAgJG1hcC5zdHlsZS5sZWZ0ICAgICAgPSBsZWZ0XG4gICAgICAgICRtYXAuc3R5bGUudG9wICAgICAgID0gdG9wXG4gICAgICAgICRtYXAuc3R5bGUud2lkdGggICAgID0gd2lkdGhcbiAgICAgICAgJG1hcC5zdHlsZS5oZWlnaHQgICAgPSBoZWlnaHRcbiAgICAgICAgJG1hcC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbiAgICB9XG5cbiAgICAvLyBSZXNpemUgaW1hZ2VzXG4gICAgY29uc3QgcmVzaXplSW1hZ2UgPSAod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCwgY2FsbGJhY2spID0+XG4gICAge1xuICAgICAgICAvLyBDaGVjayBpZiBsYW5kc2NhcGUgb3IgcG9ydHJhaXRcbiAgICAgICAgaWYgKHdpbmRvd1dpZHRoIC8gd2luZG93SGVpZ2h0IDw9IE1BUF9SQVRJTylcbiAgICAgICAge1xuICAgICAgICAgICAgc2V0SW1hZ2VTaXplKCcwJywgJzUwJScsICcxMDAlJywgJ2F1dG8nLCAndHJhbnNsYXRlWSgtNTAlKScpXG4gICAgICAgICAgICAkdG9wLnN0eWxlLnpJbmRleCAgICA9ICcxJ1xuICAgICAgICAgICAgJHJpZ2h0LnN0eWxlLnpJbmRleCAgPSAnMCdcbiAgICAgICAgICAgICRib3R0b20uc3R5bGUuekluZGV4ID0gJzEnXG4gICAgICAgICAgICAkbGVmdC5zdHlsZS56SW5kZXggICA9ICcwJ1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgc2V0SW1hZ2VTaXplKCc1MCUnLCAnMCcsICdhdXRvJywgJzEwMCUnLCAndHJhbnNsYXRlWCgtNTAlKScpXG4gICAgICAgICAgICAkdG9wLnN0eWxlLnpJbmRleCAgICA9ICcwJ1xuICAgICAgICAgICAgJHJpZ2h0LnN0eWxlLnpJbmRleCAgPSAnMSdcbiAgICAgICAgICAgICRib3R0b20uc3R5bGUuekluZGV4ID0gJzAnXG4gICAgICAgICAgICAkbGVmdC5zdHlsZS56SW5kZXggICA9ICcxJ1xuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrKClcbiAgICB9XG5cbiAgICAvLyBTZXQgc3R5bGUgdG8gZWxlbWVudHNcbiAgICBjb25zdCBzZXRTdHlsZXMgPSAoKSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgdG9wT2Zmc2V0ICAgID0gJG1hcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgICAgICAgY29uc3QgbGVmdE9mZnNldCAgID0gJG1hcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG4gICAgICAgIGNvbnN0IHdpZHRoT2Zmc2V0ICA9ICRtYXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcbiAgICAgICAgY29uc3QgaGVpZ2h0T2Zmc2V0ID0gJG1hcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHRcbiAgICAgICAgJHRvcC5zdHlsZS5ib3R0b20gID0gYCR7dG9wT2Zmc2V0fXB4YFxuICAgICAgICAkcmlnaHQuc3R5bGUubGVmdCAgPSBgJHtsZWZ0T2Zmc2V0fXB4YFxuICAgICAgICAkYm90dG9tLnN0eWxlLnRvcCAgPSBgJHt0b3BPZmZzZXR9cHhgXG4gICAgICAgICRsZWZ0LnN0eWxlLnJpZ2h0ICA9IGAke2xlZnRPZmZzZXR9cHhgXG4gICAgICAgIHRpbGVTaXplLnggICAgICAgICA9IHdpZHRoT2Zmc2V0ICAvIE1BUF9DT0xcbiAgICAgICAgdGlsZVNpemUueSAgICAgICAgID0gaGVpZ2h0T2Zmc2V0IC8gTUFQX1JPV1xuICAgICAgICAkY2hhcmFjdGVyLnN0eWxlLmxlZnQgICAgICA9IGAke2xlZnRPZmZzZXQgLSB0aWxlU2l6ZS54IC8gMn1weGBcbiAgICAgICAgJGNoYXJhY3Rlci5zdHlsZS50b3AgICAgICAgPSBgJHt0b3BPZmZzZXR9cHhgXG4gICAgICAgICRjaGFyYWN0ZXIuc3R5bGUud2lkdGggICAgID0gYCR7dGlsZVNpemUueCAqIDJ9cHhgXG4gICAgICAgICRjaGFyYWN0ZXIuc3R5bGUuaGVpZ2h0ICAgID0gYCR7dGlsZVNpemUueSAqIDJ9cHhgXG4gICAgICAgICRjaGFyYWN0ZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3Bvc2l0aW9uLnh9JSwgJHtwb3NpdGlvbi55fSUpYFxuICAgICAgICAkc3ByaXRlLnN0eWxlLndpZHRoICAgICAgICA9IGAzMDAlYFxuICAgICAgICAkc3ByaXRlLnN0eWxlLmhlaWdodCAgICAgICA9IGA0MDAlYFxuICAgICAgICAkY3J1c2guc3R5bGUubGVmdCAgICAgICAgICA9IGAke2xlZnRPZmZzZXR9cHhgXG4gICAgICAgICRjcnVzaC5zdHlsZS50b3AgICAgICAgICAgID0gYCR7dG9wT2Zmc2V0ICsgdGlsZVNpemUueX1weGBcbiAgICAgICAgJGNydXNoLnN0eWxlLndpZHRoICAgICAgICAgPSBgJHt0aWxlU2l6ZS54fXB4YFxuICAgICAgICAkY3J1c2guc3R5bGUuaGVpZ2h0ICAgICAgICA9IGAke3RpbGVTaXplLnl9cHhgXG4gICAgICAgICRwb2tlZGV4LnN0eWxlLmJvdHRvbSAgICAgID0gYCR7dGlsZVNpemUueX1weGBcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBuZXggcG9zaXRpb24gb2YgY2hhcmFjdGVyIGlzIGFsbG93ZWRcbiAgICBjb25zdCBhbGxvd1Bvc2l0aW9uID0gKHBvc2l0aW9uWCwgcG9zaXRpb25ZKSA9PlxuICAgIHtcbiAgICAgICAgZm9yIChjb25zdCBmb3JiaWRkZW5Qb3NpdGlvbiBvZiBmb3JiaWRkZW4pXG4gICAgICAgICAgICBpZiAoZm9yYmlkZGVuUG9zaXRpb24ueCA9PSBwb3NpdGlvblggJiYgZm9yYmlkZGVuUG9zaXRpb24ueSA9PSBwb3NpdGlvblkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgd2Fsa2luZyBvbiBidXNoXG4gICAgY29uc3Qgc3RlcEJ1c2ggPSAocG9zaXRpb25YLCBwb3NpdGlvblkpID0+XG4gICAge1xuICAgICAgICBmb3IgKGNvbnN0IGJ1c2ggb2YgYnVzaGVzKVxuICAgICAgICAgICAgaWYgKGJ1c2gueCA9PSBwb3NpdGlvblggJiYgYnVzaC55ID09IHBvc2l0aW9uWSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBMb2FkIHBva2Vtb25cbiAgICBjb25zdCBsb2FkUG9rZW1vbiA9IChhcnJheSkgPT5cbiAgICB7XG4gICAgICAgICRjcnVzaC5zdHlsZS5vcGFjaXR5ID0gJzEnXG4gICAgICAgIGNvbnN0IHBva2Vtb25JbmRleCAgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNTEpXG4gICAgICAgIGNvbnN0IHBva2Vtb25TcGF3biAgPSBhcnJheVtwb2tlbW9uSW5kZXhdLnNwYXduX2NoYW5jZVxuICAgICAgICBjb25zdCBwb2tlbW9uQ2hhbmNlID0gTWF0aC5yYW5kb20oKSAqIFNQQVdfUkFURSAtIHBva2Vtb25TcGF3blxuICAgICAgICBjb25zdCBpc1NwYXduZWQgICAgID0gcG9rZW1vbkNoYW5jZSA8IDAgPyB0cnVlIDogZmFsc2VcblxuICAgICAgICAvLyBDaGVjayBpZiBwb2tlbW9uIGlzIHNwYXduZWRcbiAgICAgICAgaWYgKGlzU3Bhd25lZClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gRm9yYmlkIHRvIHdhbGtcbiAgICAgICAgICAgIGNhbldhbGsgPSBmYWxzZVxuXG4gICAgICAgICAgICAvLyBTZW5kIGRhdGFcbiAgICAgICAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICAgICAgICB4aHIub3BlbignUE9TVCcsICcuLycpXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpXG4gICAgICAgICAgICB4aHIuc2VuZChlbmNvZGVVUkkoYGFjdGlvbj1jYXRjaCZwb2tlbW9uX2luZGV4PSR7cG9rZW1vbkluZGV4fSZwb3NpdGlvbl94PSR7cG9zaXRpb24ueCAvIDEwfSZwb3NpdGlvbl95PSR7cG9zaXRpb24ueSAvIDEwfWApKVxuXG4gICAgICAgICAgICAvLyBMaXN0ZW4gdG8gcmVxdWVzdCBkb25lXG4gICAgICAgICAgICB4aHIub25sb2FkID0gKCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBBZGQgcmVjdGFuZ2xlc1xuICAgICAgICAgICAgICAgICRyZWN0YW5nbGVzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG5cbiAgICAgICAgICAgICAgICAvLyBMb2FkIG5ldyBwYWdlXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9jYXRjaCdcbiAgICAgICAgICAgICAgICB9LCAyMDAwKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTG9hZCBwb2tlZHggZGF0YVxuICAgIGxvYWRKU09OKCdwb2tlZGV4JywgKHJlc3BvbnNlKSA9PlxuICAgIHtcbiAgICAgICAgLy8gUGFyc2UgZGF0YVxuICAgICAgICBjb25zdCBKU09OX2ZpbGUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxuICAgICAgICBjb25zdCBwb2tlbW9ucyAgPSBKU09OX2ZpbGUucG9rZW1vblxuXG4gICAgICAgIC8vIExpc3RlbiB0byBrZXlkb3duXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiBjaGFyYWN0ZXIgY2FuIHdhbGtcbiAgICAgICAgICAgIGlmIChjYW5XYWxrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxsb3dQb3NpdGlvbihNYXRoLm1heCgwLCBwb3NpdGlvbi54IC0gNTApLCBwb3NpdGlvbi55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi54ID0gTWF0aC5tYXgoMCwgcG9zaXRpb24ueCAtIDUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGVwQnVzaChwb3NpdGlvbi54LCBwb3NpdGlvbi55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZFBva2Vtb24ocG9rZW1vbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY3J1c2guc3R5bGUub3BhY2l0eSA9ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNwcml0ZS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKDAlLCAtMjUlKWBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzk6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxsb3dQb3NpdGlvbihNYXRoLm1pbigoTUFQX0NPTCAtIDEpICogNTAsIHBvc2l0aW9uLnggKyA1MCksIHBvc2l0aW9uLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnggPSBNYXRoLm1pbigoTUFQX0NPTCAtIDEpICogNTAsIHBvc2l0aW9uLnggKyA1MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RlcEJ1c2gocG9zaXRpb24ueCwgcG9zaXRpb24ueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRQb2tlbW9uKHBva2Vtb25zKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNydXNoLnN0eWxlLm9wYWNpdHkgPSAnMCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICRzcHJpdGUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgwJSwgLTc1JSlgXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFsbG93UG9zaXRpb24ocG9zaXRpb24ueCwgTWF0aC5tYXgoMCwgcG9zaXRpb24ueSAtIDUwKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueSA9IE1hdGgubWF4KDAsIHBvc2l0aW9uLnkgLSA1MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RlcEJ1c2gocG9zaXRpb24ueCwgcG9zaXRpb24ueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRQb2tlbW9uKHBva2Vtb25zKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNydXNoLnN0eWxlLm9wYWNpdHkgPSAnMCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICRzcHJpdGUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgwJSwgLTUwJSlgXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFsbG93UG9zaXRpb24ocG9zaXRpb24ueCwgTWF0aC5taW4oKE1BUF9ST1cgLSAzKSAqIDUwLCBwb3NpdGlvbi55ICsgNTApKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi55ID0gTWF0aC5taW4oKE1BUF9ST1cgLSAzKSAqIDUwLCBwb3NpdGlvbi55ICsgNTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0ZXBCdXNoKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkUG9rZW1vbihwb2tlbW9ucylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjcnVzaC5zdHlsZS5vcGFjaXR5ID0gJzAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3ByaXRlLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoMCUsIDApYFxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgJGNoYXJhY3Rlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7cG9zaXRpb24ueH0lLCAke3Bvc2l0aW9uLnl9JSlgXG4gICAgICAgICAgICAgICAgJGNydXNoLnN0eWxlLnRyYW5zZm9ybSAgICAgPSBgdHJhbnNsYXRlKCR7cG9zaXRpb24ueCAqIDJ9JSwgJHtwb3NpdGlvbi55ICogMn0lKWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgLy8gSW5pdGlhbGl6ZSBtYXAgc2l6ZVxuICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICB7XG4gICAgICAgIHJlc2l6ZUltYWdlKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQsIHNldFN0eWxlcylcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlJylcbiAgICB9LCAyNTApXG5cbiAgICAvLyBMaXN0ZW4gdG8gcmVzaXplXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+XG4gICAge1xuICAgICAgICB3aW5kb3dXaWR0aCAgPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgICB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICAgcmVzaXplSW1hZ2Uod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCwgc2V0U3R5bGVzKVxuICAgIH0pXG59XG4vLyBDaGVjayBpZiBjYXRjaGluZyBwYWdlXG5lbHNlIGlmICgkY29udGFpbmVyQ2F0Y2gpXG57XG4gICAgLy8gR2V0IGVsZW1lbnRzXG4gICAgY29uc3QgJHJlY3RhbmdsZXMgICA9ICRjb250YWluZXJDYXRjaC5xdWVyeVNlbGVjdG9yKCcucmVjdGFuZ2xlcycpXG4gICAgY29uc3QgJHRpdGxlICAgICAgICA9ICRjb250YWluZXJDYXRjaC5xdWVyeVNlbGVjdG9yKCdoMScpXG4gICAgY29uc3QgJGFwcGVhcnMgICAgICA9ICR0aXRsZS5xdWVyeVNlbGVjdG9yKCcuYXBwZWFycycpXG4gICAgY29uc3QgJGNhdWdodCAgICAgICA9ICR0aXRsZS5xdWVyeVNlbGVjdG9yKCcuY2F1Z2h0JylcbiAgICBjb25zdCAkZXNjYXBlZCAgICAgID0gJHRpdGxlLnF1ZXJ5U2VsZWN0b3IoJy5lc2NhcGVkJylcbiAgICBjb25zdCAkYXBwZWFyYW5jZSAgID0gJGNvbnRhaW5lckNhdGNoLnF1ZXJ5U2VsZWN0b3IoJy5hcHBlYXJhbmNlJylcbiAgICBjb25zdCAkaWxsdXN0cmF0aW9uID0gJGNvbnRhaW5lckNhdGNoLnF1ZXJ5U2VsZWN0b3IoJy5pbGx1c3RyYXRpb24nKVxuICAgIGNvbnN0ICRidXR0b24gICAgICAgPSAkY29udGFpbmVyQ2F0Y2gucXVlcnlTZWxlY3RvcignLmJ1dHRvbicpXG4gICAgY29uc3QgJHRvb2wgICAgICAgICA9ICRidXR0b24ucXVlcnlTZWxlY3RvcignLnRvb2wnKVxuICAgIGNvbnN0IENBVENIX1JBVEUgICAgPSA3NVxuXG4gICAgLy8gTG9hZCBwb2tlZGV4IGRhdGFcbiAgICBsb2FkSlNPTigncG9rZWRleCcsIChyZXNwb25zZSkgPT5cbiAgICB7XG4gICAgICAgIC8vIFBhcnNlIGRhdGFcbiAgICAgICAgY29uc3QgSlNPTl9maWxlICAgID0gSlNPTi5wYXJzZShyZXNwb25zZSlcbiAgICAgICAgY29uc3QgcG9rZW1vbnMgICAgID0gSlNPTl9maWxlLnBva2Vtb25cbiAgICAgICAgY29uc3QgcG9rZW1vbk5hbWUgID0gJGFwcGVhcmFuY2UuZ2V0QXR0cmlidXRlKCdhbHQnKVxuICAgICAgICBjb25zdCBwb2tlbW9uICAgICAgPSBwb2tlbW9ucy5maW5kKHBva2Vtb24gPT4gcG9rZW1vbi5uYW1lID09IHBva2Vtb25OYW1lKVxuICAgICAgICBjb25zdCBwb2tlbW9uSW5kZXggPSBwb2tlbW9ucy5pbmRleE9mKHBva2Vtb24pXG4gICAgICAgIGNvbnN0IHBva2Vtb25DYXRjaCA9IHBva2Vtb24uY2F0Y2hfY2hhbmNlXG5cbiAgICAgICAgLy8gUmVtb3ZlIHJlY3RhbmdsZXNcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICAkcmVjdGFuZ2xlcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuXG4gICAgICAgICAgICAvLyBEaXNwbGF5IGVsZW1lbnRzXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJHRpdGxlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgICAgICAgICAgJGFwcGVhcmFuY2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICAkaWxsdXN0cmF0aW9uLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG5cbiAgICAgICAgICAgICAgICAvLyBEaXNwbGF5IGJ1dHRvblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICR0b29sLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgICRjb250YWluZXJDYXRjaC5yZW1vdmVDaGlsZCgkcmVjdGFuZ2xlcylcbiAgICAgICAgICAgICAgICAgICAgJGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgJHRvb2wuY2xhc3NMaXN0LmFkZCgndGhyb3duJylcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhyb3cgcG9rZWJhbGxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGFwcGVhcmFuY2UuY2xhc3NMaXN0LmFkZCgnY2F1Z2h0JylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENhdGNoIHBva2Vtb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkYXBwZWFycy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBva2Vtb25DaGFuY2UgPSBNYXRoLnJhbmRvbSgpICogQ0FUQ0hfUkFURSAtIHBva2Vtb25DYXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0NhdWdodCAgICAgID0gcG9rZW1vbkNoYW5jZSA8IDAgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHBva2Vtb24gaXMgY2F1Z2h0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0NhdWdodClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY2F1Z2h0LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNlbmQgZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5vcGVuKCdQT1NUJywgJy4vJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKGVuY29kZVVSSShgYWN0aW9uPWNhdWdodCZwb2tlbW9uX2luZGV4PSR7cG9rZW1vbkluZGV4fWApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLm9ubG9hZCA9ICgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdmYWRlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTI1MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMjUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZXNjYXBlZC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGFwcGVhcmFuY2UuY2xhc3NMaXN0LnJlbW92ZSgnY2F1Z2h0JylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2V0IHBva2Vtb24gZXNjYXBpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkYXBwZWFyYW5jZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmFkZW91dCB3aW5kb3dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2ZhZGUnKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlZGlyZWN0IHRvIG1hcCBwYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi8nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEyNTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTI1MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDIwMDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA1MDAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTI1MClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9LCAxMDAwKVxuICAgICAgICAgICAgfSwgMTAwMClcbiAgICAgICAgfSwgMjUwKVxuICAgIH0pXG59XG5lbHNlIGlmICgkYXVkaW8pXG57XG4gICAgY29uc3QgJGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGVldC1idXR0b24nKVxuXG4gICAgJGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAge1xuICAgICAgICAkYXVkaW8ucGxheSgpXG4gICAgfSlcbn0iXX0=
