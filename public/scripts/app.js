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
    }

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9zY3JpcHRzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQSxJQUFNLFdBQVcsU0FBWCxRQUFXLENBQUMsSUFBRCxFQUFPLFFBQVAsRUFDakI7QUFDSSxRQUFNLE9BQU8sSUFBSSxjQUFKLEVBQWI7QUFDQSxTQUFLLGdCQUFMLENBQXNCLGtCQUF0QjtBQUNBLFNBQUssSUFBTCxDQUFVLEtBQVYsbUJBQWdDLElBQWhDLFlBQTZDLElBQTdDO0FBQ0EsU0FBSyxrQkFBTCxHQUEwQixZQUMxQjtBQUNJLFlBQUksS0FBSyxVQUFMLElBQW1CLENBQW5CLElBQXdCLEtBQUssTUFBTCxJQUFlLEtBQTNDLEVBQ0ksU0FBUyxLQUFLLFlBQWQ7QUFDUCxLQUpEO0FBS0EsU0FBSyxJQUFMLENBQVUsSUFBVjtBQUNILENBWEQ7O0FBYUE7QUFDQSxJQUFNLGdCQUFrQixTQUFTLGFBQVQsQ0FBdUIsMEJBQXZCLENBQXhCO0FBQ0EsSUFBTSxrQkFBa0IsU0FBUyxhQUFULENBQXVCLDRCQUF2QixDQUF4Qjs7QUFFQTtBQUNBLElBQUksYUFBSixFQUNBO0FBQ0k7QUFDQSxRQUFNLE9BQWMsY0FBYyxhQUFkLENBQTRCLE1BQTVCLENBQXBCO0FBQ0EsUUFBTSxTQUFjLGNBQWMsYUFBZCxDQUE0QixRQUE1QixDQUFwQjtBQUNBLFFBQU0sVUFBYyxjQUFjLGFBQWQsQ0FBNEIsU0FBNUIsQ0FBcEI7QUFDQSxRQUFNLFFBQWMsY0FBYyxhQUFkLENBQTRCLE9BQTVCLENBQXBCO0FBQ0EsUUFBTSxPQUFjLGNBQWMsYUFBZCxDQUE0QixNQUE1QixDQUFwQjtBQUNBLFFBQU0sYUFBYyxjQUFjLGFBQWQsQ0FBNEIsWUFBNUIsQ0FBcEI7QUFDQSxRQUFNLFNBQWMsY0FBYyxhQUFkLENBQTRCLFFBQTVCLENBQXBCO0FBQ0EsUUFBTSxVQUFjLFdBQVcsYUFBWCxDQUF5QixTQUF6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UyxHQUFHLEdBQVosRUFmSixFQWdCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWhCSixFQWlCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWpCSixFQWtCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWxCSixFQW1CSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQW5CSixFQW9CSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXBCSixFQXFCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXJCSixFQXNCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXRCSixFQXVCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXZCSixFQXdCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXhCSixFQXlCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXpCSixFQTBCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTFCSixFQTJCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTNCSixFQTRCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTVCSixFQTZCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTdCSixFQThCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTlCSixFQStCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQS9CSixFQWdDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWhDSixFQWlDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWpDSixFQWtDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWxDSixFQW1DSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQW5DSixFQW9DSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXBDSixFQXFDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXJDSixFQXNDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXRDSixFQXVDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXZDSixFQXdDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXhDSixFQXlDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXpDSixFQTBDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTFDSixFQTJDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTNDSixFQTRDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTVDSixFQTZDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTdDSixFQThDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTlDSixFQStDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQS9DSixFQWdESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWhESixFQWlESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWpESixFQWtESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWxESixFQW1ESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQW5ESixFQW9ESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXBESixFQXFESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXJESixFQXNESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXRESixFQXVESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXZESixFQXdESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXhESixFQXlESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXpESixFQTBESSxFQUFDLEdBQUcsR0FB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Q0FBckM7QUFDQSw0Q0FBSSxJQUFKLENBQVMsMkNBQXlDLFlBQXpDLENBQVQ7QUFDQSw0Q0FBSSxNQUFKLEdBQWEsWUFDYjtBQUNJLHVEQUFXLFlBQ1g7QUFDSSx5REFBUyxJQUFULENBQWMsU0FBZCxDQUF3QixHQUF4QixDQUE0QixNQUE1QjtBQUNBLDJEQUFXLFlBQ1g7QUFDSSwyREFBTyxRQUFQLENBQWdCLElBQWhCLEdBQXVCLElBQXZCO0FBQ0gsaURBSEQsRUFHRyxJQUhIO0FBSUgsNkNBUEQsRUFPRyxJQVBIO0FBUUgseUNBVkQ7QUFXSCxxQ0FyQkQsTUF1QkE7QUFDSTtBQUNBLGlEQUFTLEtBQVQsQ0FBZSxPQUFmLEdBQXlCLE9BQXpCO0FBQ0Esb0RBQVksU0FBWixDQUFzQixNQUF0QixDQUE2QixRQUE3Qjs7QUFFQTtBQUNBLG1EQUFXLFlBQ1g7QUFDSSx3REFBWSxTQUFaLENBQXNCLE1BQXRCLENBQTZCLFFBQTdCOztBQUVBO0FBQ0EsdURBQVcsWUFDWDtBQUNJLHlEQUFTLElBQVQsQ0FBYyxTQUFkLENBQXdCLEdBQXhCLENBQTRCLE1BQTVCOztBQUVBO0FBQ0EsMkRBQVcsWUFDWDtBQUNJLDJEQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsR0FBdUIsSUFBdkI7QUFDSCxpREFIRCxFQUdHLElBSEg7QUFJSCw2Q0FURCxFQVNHLElBVEg7QUFVSCx5Q0FmRCxFQWVHLElBZkg7QUFnQkg7QUFDSixpQ0FyREQsRUFxREcsSUFyREg7QUFzREgsNkJBM0RELEVBMkRHLElBM0RIO0FBNERILHlCQWxFRDtBQW1FSCxxQkF2RUQsRUF1RUcsSUF2RUg7QUF3RUgsaUJBL0VELEVBK0VHLElBL0VIO0FBZ0ZILGFBckZELEVBcUZHLEdBckZIO0FBc0ZILFNBakdEO0FBa0dIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gTG9hZCBKU09OIGZpbGVcbmNvbnN0IGxvYWRKU09OID0gKGZpbGUsIGNhbGxiYWNrKSA9Plxue1xuICAgIGNvbnN0IHhvYmogPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHhvYmoub3ZlcnJpZGVNaW1lVHlwZSgnYXBwbGljYXRpb24vanNvbicpXG4gICAgeG9iai5vcGVuKCdHRVQnLCBgLi4vZGF0YWJhc2UvJHtmaWxlfS5qc29uYCwgdHJ1ZSlcbiAgICB4b2JqLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+XG4gICAge1xuICAgICAgICBpZiAoeG9iai5yZWFkeVN0YXRlID09IDQgJiYgeG9iai5zdGF0dXMgPT0gJzIwMCcpXG4gICAgICAgICAgICBjYWxsYmFjayh4b2JqLnJlc3BvbnNlVGV4dClcbiAgICB9XG4gICAgeG9iai5zZW5kKG51bGwpXG59XG5cbi8vIEdldCBjb250YWluZXJcbmNvbnN0ICRjb250YWluZXJNYXAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXIuY29udGFpbmVyLW1hcCcpXG5jb25zdCAkY29udGFpbmVyQ2F0Y2ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyLmNvbnRhaW5lci1jYXRjaCcpXG5cbi8vIENoZWNrIGlmIG1hcCBwYWdlXG5pZiAoJGNvbnRhaW5lck1hcClcbntcbiAgICAvL0dldCBlbGVtZW50c1xuICAgIGNvbnN0ICR0b3AgICAgICAgID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcudG9wJylcbiAgICBjb25zdCAkcmlnaHQgICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLnJpZ2h0JylcbiAgICBjb25zdCAkYm90dG9tICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLmJvdHRvbScpXG4gICAgY29uc3QgJGxlZnQgICAgICAgPSAkY29udGFpbmVyTWFwLnF1ZXJ5U2VsZWN0b3IoJy5sZWZ0JylcbiAgICBjb25zdCAkbWFwICAgICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLm1hcCcpXG4gICAgY29uc3QgJGNoYXJhY3RlciAgPSAkY29udGFpbmVyTWFwLnF1ZXJ5U2VsZWN0b3IoJy5jaGFyYWN0ZXInKVxuICAgIGNvbnN0ICRjcnVzaCAgICAgID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcuY3J1c2gnKVxuICAgIGNvbnN0ICRzcHJpdGUgICAgID0gJGNoYXJhY3Rlci5xdWVyeVNlbGVjdG9yKCcuc3ByaXRlJylcbiAgICBjb25zdCAkcG9rZWRleCAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLnBva2VkZXgnKVxuICAgIGNvbnN0ICRyZWN0YW5nbGVzID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcucmVjdGFuZ2xlcycpXG4gICAgXG4gICAgLy8gRGVmaW5lIHZhbHVlc3dcbiAgICBjb25zdCBwb3NpdGlvbiAgICA9IHt4OiBwYXJzZUludCgkY2hhcmFjdGVyLmRhdGFzZXQucG9zaXRpb254ICogMTApLCB5OiBwYXJzZUludCgkY2hhcmFjdGVyLmRhdGFzZXQucG9zaXRpb255ICogMTApfVxuICAgIGNvbnN0IHRpbGVTaXplICAgID0ge3g6IDAsIHk6IDB9XG4gICAgY29uc3QgU1BBV19SQVRFICAgPSAyNVxuICAgIGNvbnN0IE1BUF9ST1cgICAgID0gMTJcbiAgICBjb25zdCBNQVBfQ09MICAgICA9IDE1XG4gICAgY29uc3QgTUFQX1JBVElPICAgPSBNQVBfQ09MIC8gTUFQX1JPV1xuICAgIGNvbnN0IGZvcmJpZGRlbiAgID1cbiAgICBbXG4gICAgICAgIHt4OiAwLCB5OiAwfSxcbiAgICAgICAge3g6IDAsIHk6IDUwfSxcbiAgICAgICAge3g6IDAsIHk6IDEwMH0sXG4gICAgICAgIHt4OiAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDAsIHk6IDI1MH0sXG4gICAgICAgIHt4OiAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMCwgeTogNDAwfSxcbiAgICAgICAge3g6IDAsIHk6IDQ1MH0sXG4gICAgICAgIHt4OiA1MCwgeTogMH0sXG4gICAgICAgIHt4OiA2NTAsIHk6IDB9LFxuICAgICAgICB7eDogNzAwLCB5OiAwfSxcbiAgICAgICAge3g6IDcwMCwgeTogNTB9LFxuICAgICAgICB7eDogNzAwLCB5OiAxMDB9LFxuICAgICAgICB7eDogNzAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNzAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogNzAwLCB5OiAzMDB9LFxuICAgICAgICB7eDogNzAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNzAwLCB5OiA0MDB9LFxuICAgICAgICB7eDogNzAwLCB5OiA0NTB9LFxuICAgIF1cbiAgICBjb25zdCBidXNoZXMgPVxuICAgIFtcbiAgICAgICAge3g6IDE1MCwgeTogMH0sXG4gICAgICAgIHt4OiAyMDAsIHk6IDB9LFxuICAgICAgICB7eDogMzAwLCB5OiAwfSxcbiAgICAgICAge3g6IDM1MCwgeTogMH0sXG4gICAgICAgIHt4OiA0NTAsIHk6IDB9LFxuICAgICAgICB7eDogNTAwLCB5OiAwfSxcbiAgICAgICAge3g6IDIwMCwgeTogNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiA1MH0sXG4gICAgICAgIHt4OiAzMDAsIHk6IDUwfSxcbiAgICAgICAge3g6IDM1MCwgeTogNTB9LFxuICAgICAgICB7eDogNDAwLCB5OiA1MH0sXG4gICAgICAgIHt4OiA1MDAsIHk6IDUwfSxcbiAgICAgICAge3g6IDU1MCwgeTogNTB9LFxuICAgICAgICB7eDogMTUwLCB5OiAxMDB9LFxuICAgICAgICB7eDogMjAwLCB5OiAxMDB9LFxuICAgICAgICB7eDogMzAwLCB5OiAxMDB9LFxuICAgICAgICB7eDogNDAwLCB5OiAxMDB9LFxuICAgICAgICB7eDogNDUwLCB5OiAxMDB9LFxuICAgICAgICB7eDogNTUwLCB5OiAxMDB9LFxuICAgICAgICB7eDogMTUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMjAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMzAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMzUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNDAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNDUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNTAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNTUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNjAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMTAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogMjAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogMzAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNDAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNTAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNTUwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNjAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogMTAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMTUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMjAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMzAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMzUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogNDAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogNDUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogNTUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMTUwLCB5OiAzMDB9LFxuICAgICAgICB7eDogMjUwLCB5OiAzMDB9LFxuICAgICAgICB7eDogMzUwLCB5OiAzMDB9LFxuICAgICAgICB7eDogNDAwLCB5OiAzMDB9LFxuICAgICAgICB7eDogNTAwLCB5OiAzMDB9LFxuICAgICAgICB7eDogNjAwLCB5OiAzMDB9LFxuICAgICAgICB7eDogMTAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMjAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMzAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNDAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNDUwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNTAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNTUwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNjAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiA0MDB9LFxuICAgICAgICB7eDogMzUwLCB5OiA0MDB9LFxuICAgICAgICB7eDogNDAwLCB5OiA0MDB9LFxuICAgICAgICB7eDogNTUwLCB5OiA0MDB9LFxuICAgICAgICB7eDogMzAwLCB5OiA0NTB9XG4gICAgXVxuICAgIGxldCB3aW5kb3dXaWR0aCAgPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICBsZXQgY2FuV2FsayAgICAgID0gdHJ1ZVxuXG4gICAgLy8gU2V0IHNpemUgdG8gbWFwXG4gICAgY29uc3Qgc2V0SW1hZ2VTaXplPSAobGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0LCB0cmFuc2Zvcm0pID0+XG4gICAge1xuICAgICAgICAkbWFwLnN0eWxlLmxlZnQgICAgICA9IGxlZnRcbiAgICAgICAgJG1hcC5zdHlsZS50b3AgICAgICAgPSB0b3BcbiAgICAgICAgJG1hcC5zdHlsZS53aWR0aCAgICAgPSB3aWR0aFxuICAgICAgICAkbWFwLnN0eWxlLmhlaWdodCAgICA9IGhlaWdodFxuICAgICAgICAkbWFwLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuICAgIH1cblxuICAgIC8vIFJlc2l6ZSBpbWFnZXNcbiAgICBjb25zdCByZXNpemVJbWFnZSA9ICh3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0LCBjYWxsYmFjaykgPT5cbiAgICB7XG4gICAgICAgIC8vIENoZWNrIGlmIGxhbmRzY2FwZSBvciBwb3J0cmFpdFxuICAgICAgICBpZiAod2luZG93V2lkdGggLyB3aW5kb3dIZWlnaHQgPD0gTUFQX1JBVElPKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZXRJbWFnZVNpemUoJzAnLCAnNTAlJywgJzEwMCUnLCAnYXV0bycsICd0cmFuc2xhdGVZKC01MCUpJylcbiAgICAgICAgICAgICR0b3Auc3R5bGUuekluZGV4ICAgID0gJzEnXG4gICAgICAgICAgICAkcmlnaHQuc3R5bGUuekluZGV4ICA9ICcwJ1xuICAgICAgICAgICAgJGJvdHRvbS5zdHlsZS56SW5kZXggPSAnMSdcbiAgICAgICAgICAgICRsZWZ0LnN0eWxlLnpJbmRleCAgID0gJzAnXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBzZXRJbWFnZVNpemUoJzUwJScsICcwJywgJ2F1dG8nLCAnMTAwJScsICd0cmFuc2xhdGVYKC01MCUpJylcbiAgICAgICAgICAgICR0b3Auc3R5bGUuekluZGV4ICAgID0gJzAnXG4gICAgICAgICAgICAkcmlnaHQuc3R5bGUuekluZGV4ICA9ICcxJ1xuICAgICAgICAgICAgJGJvdHRvbS5zdHlsZS56SW5kZXggPSAnMCdcbiAgICAgICAgICAgICRsZWZ0LnN0eWxlLnpJbmRleCAgID0gJzEnXG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2soKVxuICAgIH1cblxuICAgIC8vIFNldCBzdHlsZSB0byBlbGVtZW50c1xuICAgIGNvbnN0IHNldFN0eWxlcyA9ICgpID0+XG4gICAge1xuICAgICAgICBjb25zdCB0b3BPZmZzZXQgICAgPSAkbWFwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICAgICAgICBjb25zdCBsZWZ0T2Zmc2V0ICAgPSAkbWFwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcbiAgICAgICAgY29uc3Qgd2lkdGhPZmZzZXQgID0gJG1hcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuICAgICAgICBjb25zdCBoZWlnaHRPZmZzZXQgPSAkbWFwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodFxuICAgICAgICAkdG9wLnN0eWxlLmJvdHRvbSAgPSBgJHt0b3BPZmZzZXR9cHhgXG4gICAgICAgICRyaWdodC5zdHlsZS5sZWZ0ICA9IGAke2xlZnRPZmZzZXR9cHhgXG4gICAgICAgICRib3R0b20uc3R5bGUudG9wICA9IGAke3RvcE9mZnNldH1weGBcbiAgICAgICAgJGxlZnQuc3R5bGUucmlnaHQgID0gYCR7bGVmdE9mZnNldH1weGBcbiAgICAgICAgdGlsZVNpemUueCAgICAgICAgID0gd2lkdGhPZmZzZXQgIC8gTUFQX0NPTFxuICAgICAgICB0aWxlU2l6ZS55ICAgICAgICAgPSBoZWlnaHRPZmZzZXQgLyBNQVBfUk9XXG4gICAgICAgICRjaGFyYWN0ZXIuc3R5bGUubGVmdCAgICAgID0gYCR7bGVmdE9mZnNldCAtIHRpbGVTaXplLnggLyAyfXB4YFxuICAgICAgICAkY2hhcmFjdGVyLnN0eWxlLnRvcCAgICAgICA9IGAke3RvcE9mZnNldH1weGBcbiAgICAgICAgJGNoYXJhY3Rlci5zdHlsZS53aWR0aCAgICAgPSBgJHt0aWxlU2l6ZS54ICogMn1weGBcbiAgICAgICAgJGNoYXJhY3Rlci5zdHlsZS5oZWlnaHQgICAgPSBgJHt0aWxlU2l6ZS55ICogMn1weGBcbiAgICAgICAgJGNoYXJhY3Rlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7cG9zaXRpb24ueH0lLCAke3Bvc2l0aW9uLnl9JSlgXG4gICAgICAgICRzcHJpdGUuc3R5bGUud2lkdGggICAgICAgID0gYDMwMCVgXG4gICAgICAgICRzcHJpdGUuc3R5bGUuaGVpZ2h0ICAgICAgID0gYDQwMCVgXG4gICAgICAgICRjcnVzaC5zdHlsZS5sZWZ0ICAgICAgICAgID0gYCR7bGVmdE9mZnNldH1weGBcbiAgICAgICAgJGNydXNoLnN0eWxlLnRvcCAgICAgICAgICAgPSBgJHt0b3BPZmZzZXQgKyB0aWxlU2l6ZS55fXB4YFxuICAgICAgICAkY3J1c2guc3R5bGUud2lkdGggICAgICAgICA9IGAke3RpbGVTaXplLnh9cHhgXG4gICAgICAgICRjcnVzaC5zdHlsZS5oZWlnaHQgICAgICAgID0gYCR7dGlsZVNpemUueX1weGBcbiAgICAgICAgJHBva2VkZXguc3R5bGUuYm90dG9tICAgICAgPSBgJHt0aWxlU2l6ZS55fXB4YFxuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIG5leCBwb3NpdGlvbiBvZiBjaGFyYWN0ZXIgaXMgYWxsb3dlZFxuICAgIGNvbnN0IGFsbG93UG9zaXRpb24gPSAocG9zaXRpb25YLCBwb3NpdGlvblkpID0+XG4gICAge1xuICAgICAgICBmb3IgKGNvbnN0IGZvcmJpZGRlblBvc2l0aW9uIG9mIGZvcmJpZGRlbilcbiAgICAgICAgICAgIGlmIChmb3JiaWRkZW5Qb3NpdGlvbi54ID09IHBvc2l0aW9uWCAmJiBmb3JiaWRkZW5Qb3NpdGlvbi55ID09IHBvc2l0aW9uWSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB3YWxraW5nIG9uIGJ1c2hcbiAgICBjb25zdCBzdGVwQnVzaCA9IChwb3NpdGlvblgsIHBvc2l0aW9uWSkgPT5cbiAgICB7XG4gICAgICAgIGZvciAoY29uc3QgYnVzaCBvZiBidXNoZXMpXG4gICAgICAgICAgICBpZiAoYnVzaC54ID09IHBvc2l0aW9uWCAmJiBidXNoLnkgPT0gcG9zaXRpb25ZKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIC8vIExvYWQgcG9rZW1vblxuICAgIGNvbnN0IGxvYWRQb2tlbW9uID0gKGFycmF5KSA9PlxuICAgIHtcbiAgICAgICAgJGNydXNoLnN0eWxlLm9wYWNpdHkgPSAnMSdcbiAgICAgICAgY29uc3QgcG9rZW1vbkluZGV4ICA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE1MSlcbiAgICAgICAgY29uc3QgcG9rZW1vblNwYXduICA9IGFycmF5W3Bva2Vtb25JbmRleF0uc3Bhd25fY2hhbmNlXG4gICAgICAgIGNvbnN0IHBva2Vtb25DaGFuY2UgPSBNYXRoLnJhbmRvbSgpICogU1BBV19SQVRFIC0gcG9rZW1vblNwYXduXG4gICAgICAgIGNvbnN0IGlzU3Bhd25lZCAgICAgPSBwb2tlbW9uQ2hhbmNlIDwgMCA/IHRydWUgOiBmYWxzZVxuXG4gICAgICAgIC8vIENoZWNrIGlmIHBva2Vtb24gaXMgc3Bhd25lZFxuICAgICAgICBpZiAoaXNTcGF3bmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBGb3JiaWQgdG8gd2Fsa1xuICAgICAgICAgICAgY2FuV2FsayA9IGZhbHNlXG5cbiAgICAgICAgICAgIC8vIFNlbmQgZGF0YVxuICAgICAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgICAgICAgIHhoci5vcGVuKCdQT1NUJywgJy4vJylcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcbiAgICAgICAgICAgIHhoci5zZW5kKGVuY29kZVVSSShgYWN0aW9uPWNhdGNoJnBva2Vtb25faW5kZXg9JHtwb2tlbW9uSW5kZXh9JnBvc2l0aW9uX3g9JHtwb3NpdGlvbi54IC8gMTB9JnBvc2l0aW9uX3k9JHtwb3NpdGlvbi55IC8gMTB9YCkpXG5cbiAgICAgICAgICAgIC8vIExpc3RlbiB0byByZXF1ZXN0IGRvbmVcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIEFkZCByZWN0YW5nbGVzXG4gICAgICAgICAgICAgICAgJHJlY3RhbmdsZXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcblxuICAgICAgICAgICAgICAgIC8vIExvYWQgbmV3IHBhZ2VcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2NhdGNoJ1xuICAgICAgICAgICAgICAgIH0sIDIwMDApXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBMb2FkIHBva2VkeCBkYXRhXG4gICAgbG9hZEpTT04oJ3Bva2VkZXgnLCAocmVzcG9uc2UpID0+XG4gICAge1xuICAgICAgICAvLyBQYXJzZSBkYXRhXG4gICAgICAgIGNvbnN0IEpTT05fZmlsZSA9IEpTT04ucGFyc2UocmVzcG9uc2UpXG4gICAgICAgIGNvbnN0IHBva2Vtb25zICA9IEpTT05fZmlsZS5wb2tlbW9uXG5cbiAgICAgICAgLy8gTGlzdGVuIHRvIGtleWRvd25cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGNoYXJhY3RlciBjYW4gd2Fsa1xuICAgICAgICAgICAgaWYgKGNhbldhbGspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzNzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxvd1Bvc2l0aW9uKE1hdGgubWF4KDAsIHBvc2l0aW9uLnggLSA1MCksIHBvc2l0aW9uLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnggPSBNYXRoLm1heCgwLCBwb3NpdGlvbi54IC0gNTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0ZXBCdXNoKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkUG9rZW1vbihwb2tlbW9ucylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjcnVzaC5zdHlsZS5vcGFjaXR5ID0gJzAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3ByaXRlLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoMCUsIC0yNSUpYFxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxvd1Bvc2l0aW9uKE1hdGgubWluKChNQVBfQ09MIC0gMSkgKiA1MCwgcG9zaXRpb24ueCArIDUwKSwgcG9zaXRpb24ueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueCA9IE1hdGgubWluKChNQVBfQ09MIC0gMSkgKiA1MCwgcG9zaXRpb24ueCArIDUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGVwQnVzaChwb3NpdGlvbi54LCBwb3NpdGlvbi55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZFBva2Vtb24ocG9rZW1vbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY3J1c2guc3R5bGUub3BhY2l0eSA9ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNwcml0ZS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKDAlLCAtNzUlKWBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxsb3dQb3NpdGlvbihwb3NpdGlvbi54LCBNYXRoLm1heCgwLCBwb3NpdGlvbi55IC0gNTApKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi55ID0gTWF0aC5tYXgoMCwgcG9zaXRpb24ueSAtIDUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGVwQnVzaChwb3NpdGlvbi54LCBwb3NpdGlvbi55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZFBva2Vtb24ocG9rZW1vbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY3J1c2guc3R5bGUub3BhY2l0eSA9ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNwcml0ZS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKDAlLCAtNTAlKWBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxsb3dQb3NpdGlvbihwb3NpdGlvbi54LCBNYXRoLm1pbigoTUFQX1JPVyAtIDMpICogNTAsIHBvc2l0aW9uLnkgKyA1MCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnkgPSBNYXRoLm1pbigoTUFQX1JPVyAtIDMpICogNTAsIHBvc2l0aW9uLnkgKyA1MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RlcEJ1c2gocG9zaXRpb24ueCwgcG9zaXRpb24ueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRQb2tlbW9uKHBva2Vtb25zKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNydXNoLnN0eWxlLm9wYWNpdHkgPSAnMCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICRzcHJpdGUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgwJSwgMClgXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAkY2hhcmFjdGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtwb3NpdGlvbi54fSUsICR7cG9zaXRpb24ueX0lKWBcbiAgICAgICAgICAgICAgICAkY3J1c2guc3R5bGUudHJhbnNmb3JtICAgICA9IGB0cmFuc2xhdGUoJHtwb3NpdGlvbi54ICogMn0lLCAke3Bvc2l0aW9uLnkgKiAyfSUpYFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyBJbml0aWFsaXplIG1hcCBzaXplXG4gICAgc2V0VGltZW91dCgoKSA9PlxuICAgIHtcbiAgICAgICAgcmVzaXplSW1hZ2Uod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCwgc2V0U3R5bGVzKVxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGUnKVxuICAgIH0sIDI1MClcblxuICAgIC8vIExpc3RlbiB0byByZXNpemVcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT5cbiAgICB7XG4gICAgICAgIHdpbmRvd1dpZHRoICA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICByZXNpemVJbWFnZSh3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0LCBzZXRTdHlsZXMpXG4gICAgfSlcbn1cbi8vIENoZWNrIGlmIGNhdGNoaW5nIHBhZ2VcbmVsc2UgaWYgKCRjb250YWluZXJDYXRjaClcbntcbiAgICAvLyBHZXQgZWxlbWVudHNcbiAgICBjb25zdCAkcmVjdGFuZ2xlcyAgID0gJGNvbnRhaW5lckNhdGNoLnF1ZXJ5U2VsZWN0b3IoJy5yZWN0YW5nbGVzJylcbiAgICBjb25zdCAkdGl0bGUgICAgICAgID0gJGNvbnRhaW5lckNhdGNoLnF1ZXJ5U2VsZWN0b3IoJ2gxJylcbiAgICBjb25zdCAkYXBwZWFycyAgICAgID0gJHRpdGxlLnF1ZXJ5U2VsZWN0b3IoJy5hcHBlYXJzJylcbiAgICBjb25zdCAkY2F1Z2h0ICAgICAgID0gJHRpdGxlLnF1ZXJ5U2VsZWN0b3IoJy5jYXVnaHQnKVxuICAgIGNvbnN0ICRlc2NhcGVkICAgICAgPSAkdGl0bGUucXVlcnlTZWxlY3RvcignLmVzY2FwZWQnKVxuICAgIGNvbnN0ICRhcHBlYXJhbmNlICAgPSAkY29udGFpbmVyQ2F0Y2gucXVlcnlTZWxlY3RvcignLmFwcGVhcmFuY2UnKVxuICAgIGNvbnN0ICRpbGx1c3RyYXRpb24gPSAkY29udGFpbmVyQ2F0Y2gucXVlcnlTZWxlY3RvcignLmlsbHVzdHJhdGlvbicpXG4gICAgY29uc3QgJGJ1dHRvbiAgICAgICA9ICRjb250YWluZXJDYXRjaC5xdWVyeVNlbGVjdG9yKCcuYnV0dG9uJylcbiAgICBjb25zdCAkdG9vbCAgICAgICAgID0gJGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCcudG9vbCcpXG4gICAgY29uc3QgQ0FUQ0hfUkFURSAgICA9IDc1XG5cbiAgICAvLyBMb2FkIHBva2VkZXggZGF0YVxuICAgIGxvYWRKU09OKCdwb2tlZGV4JywgKHJlc3BvbnNlKSA9PlxuICAgIHtcbiAgICAgICAgLy8gUGFyc2UgZGF0YVxuICAgICAgICBjb25zdCBKU09OX2ZpbGUgICAgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxuICAgICAgICBjb25zdCBwb2tlbW9ucyAgICAgPSBKU09OX2ZpbGUucG9rZW1vblxuICAgICAgICBjb25zdCBwb2tlbW9uTmFtZSAgPSAkYXBwZWFyYW5jZS5nZXRBdHRyaWJ1dGUoJ2FsdCcpXG4gICAgICAgIGNvbnN0IHBva2Vtb24gICAgICA9IHBva2Vtb25zLmZpbmQocG9rZW1vbiA9PiBwb2tlbW9uLm5hbWUgPT0gcG9rZW1vbk5hbWUpXG4gICAgICAgIGNvbnN0IHBva2Vtb25JbmRleCA9IHBva2Vtb25zLmluZGV4T2YocG9rZW1vbilcbiAgICAgICAgY29uc3QgcG9rZW1vbkNhdGNoID0gcG9rZW1vbi5jYXRjaF9jaGFuY2VcblxuICAgICAgICAvLyBSZW1vdmUgcmVjdGFuZ2xlc1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgICRyZWN0YW5nbGVzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG5cbiAgICAgICAgICAgIC8vIERpc3BsYXkgZWxlbWVudHNcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkdGl0bGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICAkYXBwZWFyYW5jZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICAgICAgICAgICRpbGx1c3RyYXRpb24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcblxuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgYnV0dG9uXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJHRvb2wuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lckNhdGNoLnJlbW92ZUNoaWxkKCRyZWN0YW5nbGVzKVxuICAgICAgICAgICAgICAgICAgICAkYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAkdG9vbC5jbGFzc0xpc3QuYWRkKCd0aHJvd24nKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaHJvdyBwb2tlYmFsbFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiBcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkYXBwZWFyYW5jZS5jbGFzc0xpc3QuYWRkKCdjYXVnaHQnKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2F0Y2ggcG9rZW1vblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRhcHBlYXJzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9rZW1vbkNoYW5jZSA9IE1hdGgucmFuZG9tKCkgKiBDQVRDSF9SQVRFIC0gcG9rZW1vbkNhdGNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQ2F1Z2h0ICAgICAgPSBwb2tlbW9uQ2hhbmNlIDwgMCA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgcG9rZW1vbiBpcyBjYXVnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ2F1Z2h0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjYXVnaHQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2VuZCBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnLi8nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQoZW5jb2RlVVJJKGBhY3Rpb249Y2F1Z2h0JnBva2Vtb25faW5kZXg9JHtwb2tlbW9uSW5kZXh9YCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIub25sb2FkID0gKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2ZhZGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMjUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEyNTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlc2NhcGVkLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkYXBwZWFyYW5jZS5jbGFzc0xpc3QucmVtb3ZlKCdjYXVnaHQnKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXQgcG9rZW1vbiBlc2NhcGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRhcHBlYXJhbmNlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGYWRlb3V0IHdpbmRvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnZmFkZScpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVkaXJlY3QgdG8gbWFwIHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTI1MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMjUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMDApXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMjUwKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0sIDEwMDApXG4gICAgICAgICAgICB9LCAxMDAwKVxuICAgICAgICB9LCAyNTApXG4gICAgfSlcbn0iXX0=
