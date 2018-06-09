(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var loadJSON = function loadJSON(file, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', '../database/' + file + '.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == '200') callback(xobj.responseText);
    };
    xobj.send(null);
};

var $containerMap = document.querySelector('.container.container-map');
var $containerCatch = document.querySelector('.container.container-catch');
if ($containerMap) {
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

    var setImageSize = function setImageSize(left, top, width, height, transform) {
        $map.style.left = left;
        $map.style.top = top;
        $map.style.width = width;
        $map.style.height = height;
        $map.style.transform = transform;
    };

    var resizeImage = function resizeImage(windowWidth, windowHeight, callback) {
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

    var loadPokemon = function loadPokemon(array) {
        $crush.style.opacity = '1';
        var pokemonIndex = Math.floor(Math.random() * 151);
        var pokemonSpawn = array[pokemonIndex].spawn_chance;
        var pokemonChance = Math.random() * SPAW_RATE - pokemonSpawn;
        var isSpawned = pokemonChance < 0 ? true : false;
        if (isSpawned) {
            canWalk = false;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', './');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(encodeURI('action=catch&pokemon_index=' + pokemonIndex + '&position_x=' + position.x / 10 + '&position_y=' + position.y / 10));
            xhr.onload = function () {
                $rectangles.classList.add('active');
                setTimeout(function () {
                    window.location.href = './catch';
                }, 2000);
            };
        }
    };

    loadJSON('pokedex', function (response) {
        var JSON_file = JSON.parse(response);
        var pokemons = JSON_file.pokemon;

        window.addEventListener('keydown', function (event) {
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
                $character.style.transform = 'translate(' + position.x + '%, ' + position.y + '%)';
                $crush.style.transform = 'translate(' + position.x * 2 + '%, ' + position.y * 2 + '%)';
            }
        });
    });

    setTimeout(function () {
        resizeImage(windowWidth, windowHeight, setStyles);
        document.body.classList.remove('fade');
    }, 250);

    window.addEventListener('resize', function () {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        resizeImage(windowWidth, windowHeight, setStyles);
    });
} else if ($containerCatch) {
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

    loadJSON('pokedex', function (response) {
        var JSON_file = JSON.parse(response);
        var pokemons = JSON_file.pokemon;
        var pokemonName = $appearance.getAttribute('alt');
        var pokemon = pokemons.find(function (pokemon) {
            return pokemon.name == pokemonName;
        });
        var pokemonIndex = pokemons.indexOf(pokemon);
        var pokemonCatch = pokemon.catch_chance;

        setTimeout(function () {
            _$rectangles.classList.remove('active');
            setTimeout(function () {
                $title.classList.add('active');
                $appearance.classList.add('active');
                $illustration.classList.add('active');
                setTimeout(function () {
                    $tool.classList.add('active');
                    $containerCatch.removeChild(_$rectangles);
                    $button.addEventListener('click', function (event) {
                        event.preventDefault();
                        $tool.classList.add('thrown');
                        setTimeout(function () {
                            $appearance.classList.add('caught');
                            setTimeout(function () {
                                $appears.style.display = 'none';
                                var pokemonChance = Math.random() * CATCH_RATE - pokemonCatch;
                                var isCaught = pokemonChance < 0 ? true : false;
                                if (isCaught) {
                                    $caught.style.display = 'block';
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
                                    $escaped.style.display = 'block';
                                    $appearance.classList.remove('caught');
                                    setTimeout(function () {
                                        $appearance.classList.remove('active');
                                        setTimeout(function () {
                                            document.body.classList.add('fade');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9zY3JpcHRzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBTSxXQUFXLFNBQVgsUUFBVyxDQUFDLElBQUQsRUFBTyxRQUFQLEVBQ2pCO0FBQ0ksUUFBTSxPQUFPLElBQUksY0FBSixFQUFiO0FBQ0EsU0FBSyxnQkFBTCxDQUFzQixrQkFBdEI7QUFDQSxTQUFLLElBQUwsQ0FBVSxLQUFWLG1CQUFnQyxJQUFoQyxZQUE2QyxJQUE3QztBQUNBLFNBQUssa0JBQUwsR0FBMEIsWUFDMUI7QUFDSSxZQUFJLEtBQUssVUFBTCxJQUFtQixDQUFuQixJQUF3QixLQUFLLE1BQUwsSUFBZSxLQUEzQyxFQUNJLFNBQVMsS0FBSyxZQUFkO0FBQ1AsS0FKRDtBQUtBLFNBQUssSUFBTCxDQUFVLElBQVY7QUFDSCxDQVhEOztBQWFBLElBQU0sZ0JBQWtCLFNBQVMsYUFBVCxDQUF1QiwwQkFBdkIsQ0FBeEI7QUFDQSxJQUFNLGtCQUFrQixTQUFTLGFBQVQsQ0FBdUIsNEJBQXZCLENBQXhCO0FBQ0EsSUFBSSxhQUFKLEVBQ0E7QUFDSSxRQUFNLE9BQWMsY0FBYyxhQUFkLENBQTRCLE1BQTVCLENBQXBCO0FBQ0EsUUFBTSxTQUFjLGNBQWMsYUFBZCxDQUE0QixRQUE1QixDQUFwQjtBQUNBLFFBQU0sVUFBYyxjQUFjLGFBQWQsQ0FBNEIsU0FBNUIsQ0FBcEI7QUFDQSxRQUFNLFFBQWMsY0FBYyxhQUFkLENBQTRCLE9BQTVCLENBQXBCO0FBQ0EsUUFBTSxPQUFjLGNBQWMsYUFBZCxDQUE0QixNQUE1QixDQUFwQjtBQUNBLFFBQU0sYUFBYyxjQUFjLGFBQWQsQ0FBNEIsWUFBNUIsQ0FBcEI7QUFDQSxRQUFNLFNBQWMsY0FBYyxhQUFkLENBQTRCLFFBQTVCLENBQXBCO0FBQ0EsUUFBTSxVQUFjLFdBQVcsYUFBWCxDQUF5QixTQUF6QixDQUFwQjtBQUNBLFFBQU0sV0FB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LEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWhCSixFQWlCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWpCSixFQWtCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWxCSixFQW1CSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQW5CSixFQW9CSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXBCSixFQXFCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXJCSixFQXNCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXRCSixFQXVCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXZCSixFQXdCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXhCSixFQXlCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXpCSixFQTBCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTFCSixFQTJCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTNCSixFQTRCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTVCSixFQTZCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTdCSixFQThCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTlCSixFQStCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQS9CSixFQWdDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWhDSixFQWlDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWpDSixFQWtDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWxDSixFQW1DSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQW5DSixFQW9DSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXBDSixFQXFDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXJDSixFQXNDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXRDSixFQXVDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXZDSixFQXdDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXhDSixFQXlDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXpDSixFQTBDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTFDSixFQTJDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTNDSixFQTRDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTVDSixFQTZDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTdDSixFQThDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTlDSixFQStDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQS9DSixFQWdESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWhESixFQWlESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWpESixFQWtESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWxESixFQW1ESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQW5ESixFQW9ESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXBESixFQXFESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXJESixFQXNESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXRESixFQXVESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXZESixFQXdESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXhESixFQXlESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXpESixFQTBESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTFESixFQTJE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RUFHRyxJQUhIO0FBSUgseUNBUEQsRUFPRyxJQVBIO0FBUUgscUNBVkQ7QUFXSCxpQ0FsQkQsTUFvQkE7QUFDSSw2Q0FBUyxLQUFULENBQWUsT0FBZixHQUF5QixPQUF6QjtBQUNBLGdEQUFZLFNBQVosQ0FBc0IsTUFBdEIsQ0FBNkIsUUFBN0I7QUFDQSwrQ0FBVyxZQUNYO0FBQ0ksb0RBQVksU0FBWixDQUFzQixNQUF0QixDQUE2QixRQUE3QjtBQUNBLG1EQUFXLFlBQ1g7QUFDSSxxREFBUyxJQUFULENBQWMsU0FBZCxDQUF3QixHQUF4QixDQUE0QixNQUE1QjtBQUNBLHVEQUFXLFlBQ1g7QUFDSSx1REFBTyxRQUFQLENBQWdCLElBQWhCLEdBQXVCLElBQXZCO0FBQ0gsNkNBSEQsRUFHRyxJQUhIO0FBSUgseUNBUEQsRUFPRyxJQVBIO0FBUUgscUNBWEQsRUFXRyxJQVhIO0FBWUg7QUFDSiw2QkF6Q0QsRUF5Q0csSUF6Q0g7QUEwQ0gseUJBN0NELEVBNkNHLElBN0NIO0FBOENILHFCQWxERDtBQW1ESCxpQkF2REQsRUF1REcsSUF2REg7QUF3REgsYUE3REQsRUE2REcsSUE3REg7QUE4REgsU0FqRUQsRUFpRUcsR0FqRUg7QUFrRUgsS0EzRUQ7QUE0RUgiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBsb2FkSlNPTiA9IChmaWxlLCBjYWxsYmFjaykgPT5cbntcbiAgICBjb25zdCB4b2JqID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICB4b2JqLm92ZXJyaWRlTWltZVR5cGUoJ2FwcGxpY2F0aW9uL2pzb24nKVxuICAgIHhvYmoub3BlbignR0VUJywgYC4uL2RhdGFiYXNlLyR7ZmlsZX0uanNvbmAsIHRydWUpXG4gICAgeG9iai5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PlxuICAgIHtcbiAgICAgICAgaWYgKHhvYmoucmVhZHlTdGF0ZSA9PSA0ICYmIHhvYmouc3RhdHVzID09ICcyMDAnKVxuICAgICAgICAgICAgY2FsbGJhY2soeG9iai5yZXNwb25zZVRleHQpXG4gICAgfVxuICAgIHhvYmouc2VuZChudWxsKVxufVxuXG5jb25zdCAkY29udGFpbmVyTWFwICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyLmNvbnRhaW5lci1tYXAnKVxuY29uc3QgJGNvbnRhaW5lckNhdGNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lci5jb250YWluZXItY2F0Y2gnKVxuaWYgKCRjb250YWluZXJNYXApXG57XG4gICAgY29uc3QgJHRvcCAgICAgICAgPSAkY29udGFpbmVyTWFwLnF1ZXJ5U2VsZWN0b3IoJy50b3AnKVxuICAgIGNvbnN0ICRyaWdodCAgICAgID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcucmlnaHQnKVxuICAgIGNvbnN0ICRib3R0b20gICAgID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcuYm90dG9tJylcbiAgICBjb25zdCAkbGVmdCAgICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLmxlZnQnKVxuICAgIGNvbnN0ICRtYXAgICAgICAgID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcubWFwJylcbiAgICBjb25zdCAkY2hhcmFjdGVyICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLmNoYXJhY3RlcicpXG4gICAgY29uc3QgJGNydXNoICAgICAgPSAkY29udGFpbmVyTWFwLnF1ZXJ5U2VsZWN0b3IoJy5jcnVzaCcpXG4gICAgY29uc3QgJHNwcml0ZSAgICAgPSAkY2hhcmFjdGVyLnF1ZXJ5U2VsZWN0b3IoJy5zcHJpdGUnKVxuICAgIGNvbnN0ICRwb2tlZGV4ICAgID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcucG9rZWRleCcpXG4gICAgY29uc3QgJHJlY3RhbmdsZXMgPSAkY29udGFpbmVyTWFwLnF1ZXJ5U2VsZWN0b3IoJy5yZWN0YW5nbGVzJylcbiAgICBjb25zdCBwb3NpdGlvbiAgICA9IHt4OiBwYXJzZUludCgkY2hhcmFjdGVyLmRhdGFzZXQucG9zaXRpb254ICogMTApLCB5OiBwYXJzZUludCgkY2hhcmFjdGVyLmRhdGFzZXQucG9zaXRpb255ICogMTApfVxuICAgIGNvbnN0IHRpbGVTaXplICAgID0ge3g6IDAsIHk6IDB9XG4gICAgY29uc3QgU1BBV19SQVRFICAgPSAyNVxuICAgIGNvbnN0IE1BUF9ST1cgICAgID0gMTJcbiAgICBjb25zdCBNQVBfQ09MICAgICA9IDE1XG4gICAgY29uc3QgTUFQX1JBVElPICAgPSBNQVBfQ09MIC8gTUFQX1JPV1xuICAgIGNvbnN0IGZvcmJpZGRlbiAgID1cbiAgICBbXG4gICAgICAgIHt4OiAwLCB5OiAwfSxcbiAgICAgICAge3g6IDAsIHk6IDUwfSxcbiAgICAgICAge3g6IDAsIHk6IDEwMH0sXG4gICAgICAgIHt4OiAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDAsIHk6IDI1MH0sXG4gICAgICAgIHt4OiAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMCwgeTogNDAwfSxcbiAgICAgICAge3g6IDAsIHk6IDQ1MH0sXG4gICAgICAgIHt4OiA1MCwgeTogMH0sXG4gICAgICAgIHt4OiA2NTAsIHk6IDB9LFxuICAgICAgICB7eDogNzAwLCB5OiAwfSxcbiAgICAgICAge3g6IDcwMCwgeTogNTB9LFxuICAgICAgICB7eDogNzAwLCB5OiAxMDB9LFxuICAgICAgICB7eDogNzAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNzAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogNzAwLCB5OiAzMDB9LFxuICAgICAgICB7eDogNzAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNzAwLCB5OiA0MDB9LFxuICAgICAgICB7eDogNzAwLCB5OiA0NTB9LFxuICAgIF1cbiAgICBjb25zdCBidXNoZXMgPVxuICAgIFtcbiAgICAgICAge3g6IDE1MCwgeTogMH0sXG4gICAgICAgIHt4OiAyMDAsIHk6IDB9LFxuICAgICAgICB7eDogMzAwLCB5OiAwfSxcbiAgICAgICAge3g6IDM1MCwgeTogMH0sXG4gICAgICAgIHt4OiA0NTAsIHk6IDB9LFxuICAgICAgICB7eDogNTAwLCB5OiAwfSxcbiAgICAgICAge3g6IDIwMCwgeTogNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiA1MH0sXG4gICAgICAgIHt4OiAzMDAsIHk6IDUwfSxcbiAgICAgICAge3g6IDM1MCwgeTogNTB9LFxuICAgICAgICB7eDogNDAwLCB5OiA1MH0sXG4gICAgICAgIHt4OiA1MDAsIHk6IDUwfSxcbiAgICAgICAge3g6IDU1MCwgeTogNTB9LFxuICAgICAgICB7eDogMTUwLCB5OiAxMDB9LFxuICAgICAgICB7eDogMjAwLCB5OiAxMDB9LFxuICAgICAgICB7eDogMzAwLCB5OiAxMDB9LFxuICAgICAgICB7eDogNDAwLCB5OiAxMDB9LFxuICAgICAgICB7eDogNDUwLCB5OiAxMDB9LFxuICAgICAgICB7eDogNTUwLCB5OiAxMDB9LFxuICAgICAgICB7eDogMTUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMjAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMzAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMzUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNDAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNDUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNTAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNTUwLCB5OiAxNTB9LFxuICAgICAgICB7eDogNjAwLCB5OiAxNTB9LFxuICAgICAgICB7eDogMTAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogMjAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogMzAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNDAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNTAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNTUwLCB5OiAyMDB9LFxuICAgICAgICB7eDogNjAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogMTAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMTUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMjAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMzAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMzUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogNDAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogNDUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogNTUwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMTUwLCB5OiAzMDB9LFxuICAgICAgICB7eDogMjUwLCB5OiAzMDB9LFxuICAgICAgICB7eDogMzUwLCB5OiAzMDB9LFxuICAgICAgICB7eDogNDAwLCB5OiAzMDB9LFxuICAgICAgICB7eDogNTAwLCB5OiAzMDB9LFxuICAgICAgICB7eDogNjAwLCB5OiAzMDB9LFxuICAgICAgICB7eDogMTAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMjAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMzAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNDAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNDUwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNTAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNTUwLCB5OiAzNTB9LFxuICAgICAgICB7eDogNjAwLCB5OiAzNTB9LFxuICAgICAgICB7eDogMjUwLCB5OiA0MDB9LFxuICAgICAgICB7eDogMzUwLCB5OiA0MDB9LFxuICAgICAgICB7eDogNDAwLCB5OiA0MDB9LFxuICAgICAgICB7eDogNTUwLCB5OiA0MDB9LFxuICAgICAgICB7eDogMzAwLCB5OiA0NTB9XG4gICAgXVxuICAgIGxldCB3aW5kb3dXaWR0aCAgPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICBsZXQgY2FuV2FsayAgICAgID0gdHJ1ZVxuXG4gICAgY29uc3Qgc2V0SW1hZ2VTaXplPSAobGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0LCB0cmFuc2Zvcm0pID0+XG4gICAge1xuICAgICAgICAkbWFwLnN0eWxlLmxlZnQgICAgICA9IGxlZnRcbiAgICAgICAgJG1hcC5zdHlsZS50b3AgICAgICAgPSB0b3BcbiAgICAgICAgJG1hcC5zdHlsZS53aWR0aCAgICAgPSB3aWR0aFxuICAgICAgICAkbWFwLnN0eWxlLmhlaWdodCAgICA9IGhlaWdodFxuICAgICAgICAkbWFwLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuICAgIH1cblxuICAgIGNvbnN0IHJlc2l6ZUltYWdlID0gKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQsIGNhbGxiYWNrKSA9PlxuICAgIHtcbiAgICAgICAgaWYgKHdpbmRvd1dpZHRoIC8gd2luZG93SGVpZ2h0IDw9IE1BUF9SQVRJTylcbiAgICAgICAge1xuICAgICAgICAgICAgc2V0SW1hZ2VTaXplKCcwJywgJzUwJScsICcxMDAlJywgJ2F1dG8nLCAndHJhbnNsYXRlWSgtNTAlKScpXG4gICAgICAgICAgICAkdG9wLnN0eWxlLnpJbmRleCAgICA9ICcxJ1xuICAgICAgICAgICAgJHJpZ2h0LnN0eWxlLnpJbmRleCAgPSAnMCdcbiAgICAgICAgICAgICRib3R0b20uc3R5bGUuekluZGV4ID0gJzEnXG4gICAgICAgICAgICAkbGVmdC5zdHlsZS56SW5kZXggICA9ICcwJ1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgc2V0SW1hZ2VTaXplKCc1MCUnLCAnMCcsICdhdXRvJywgJzEwMCUnLCAndHJhbnNsYXRlWCgtNTAlKScpXG4gICAgICAgICAgICAkdG9wLnN0eWxlLnpJbmRleCAgICA9ICcwJ1xuICAgICAgICAgICAgJHJpZ2h0LnN0eWxlLnpJbmRleCAgPSAnMSdcbiAgICAgICAgICAgICRib3R0b20uc3R5bGUuekluZGV4ID0gJzAnXG4gICAgICAgICAgICAkbGVmdC5zdHlsZS56SW5kZXggICA9ICcxJ1xuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrKClcbiAgICB9XG5cbiAgICBjb25zdCBzZXRTdHlsZXMgPSAoKSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgdG9wT2Zmc2V0ICAgID0gJG1hcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgICAgICAgY29uc3QgbGVmdE9mZnNldCAgID0gJG1hcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG4gICAgICAgIGNvbnN0IHdpZHRoT2Zmc2V0ICA9ICRtYXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcbiAgICAgICAgY29uc3QgaGVpZ2h0T2Zmc2V0ID0gJG1hcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHRcbiAgICAgICAgJHRvcC5zdHlsZS5ib3R0b20gID0gYCR7dG9wT2Zmc2V0fXB4YFxuICAgICAgICAkcmlnaHQuc3R5bGUubGVmdCAgPSBgJHtsZWZ0T2Zmc2V0fXB4YFxuICAgICAgICAkYm90dG9tLnN0eWxlLnRvcCAgPSBgJHt0b3BPZmZzZXR9cHhgXG4gICAgICAgICRsZWZ0LnN0eWxlLnJpZ2h0ICA9IGAke2xlZnRPZmZzZXR9cHhgXG4gICAgICAgIHRpbGVTaXplLnggICAgICAgICA9IHdpZHRoT2Zmc2V0ICAvIE1BUF9DT0xcbiAgICAgICAgdGlsZVNpemUueSAgICAgICAgID0gaGVpZ2h0T2Zmc2V0IC8gTUFQX1JPV1xuICAgICAgICAkY2hhcmFjdGVyLnN0eWxlLmxlZnQgICAgICA9IGAke2xlZnRPZmZzZXQgLSB0aWxlU2l6ZS54IC8gMn1weGBcbiAgICAgICAgJGNoYXJhY3Rlci5zdHlsZS50b3AgICAgICAgPSBgJHt0b3BPZmZzZXR9cHhgXG4gICAgICAgICRjaGFyYWN0ZXIuc3R5bGUud2lkdGggICAgID0gYCR7dGlsZVNpemUueCAqIDJ9cHhgXG4gICAgICAgICRjaGFyYWN0ZXIuc3R5bGUuaGVpZ2h0ICAgID0gYCR7dGlsZVNpemUueSAqIDJ9cHhgXG4gICAgICAgICRjaGFyYWN0ZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3Bvc2l0aW9uLnh9JSwgJHtwb3NpdGlvbi55fSUpYFxuICAgICAgICAkc3ByaXRlLnN0eWxlLndpZHRoICAgICAgICA9IGAzMDAlYFxuICAgICAgICAkc3ByaXRlLnN0eWxlLmhlaWdodCAgICAgICA9IGA0MDAlYFxuICAgICAgICAkY3J1c2guc3R5bGUubGVmdCAgICAgICAgICA9IGAke2xlZnRPZmZzZXR9cHhgXG4gICAgICAgICRjcnVzaC5zdHlsZS50b3AgICAgICAgICAgID0gYCR7dG9wT2Zmc2V0ICsgdGlsZVNpemUueX1weGBcbiAgICAgICAgJGNydXNoLnN0eWxlLndpZHRoICAgICAgICAgPSBgJHt0aWxlU2l6ZS54fXB4YFxuICAgICAgICAkY3J1c2guc3R5bGUuaGVpZ2h0ICAgICAgICA9IGAke3RpbGVTaXplLnl9cHhgXG4gICAgICAgICRwb2tlZGV4LnN0eWxlLmJvdHRvbSAgICAgID0gYCR7dGlsZVNpemUueX1weGBcbiAgICB9XG5cbiAgICBjb25zdCBhbGxvd1Bvc2l0aW9uID0gKHBvc2l0aW9uWCwgcG9zaXRpb25ZKSA9PlxuICAgIHtcbiAgICAgICAgZm9yIChjb25zdCBmb3JiaWRkZW5Qb3NpdGlvbiBvZiBmb3JiaWRkZW4pXG4gICAgICAgICAgICBpZiAoZm9yYmlkZGVuUG9zaXRpb24ueCA9PSBwb3NpdGlvblggJiYgZm9yYmlkZGVuUG9zaXRpb24ueSA9PSBwb3NpdGlvblkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgY29uc3Qgc3RlcEJ1c2ggPSAocG9zaXRpb25YLCBwb3NpdGlvblkpID0+XG4gICAge1xuICAgICAgICBmb3IgKGNvbnN0IGJ1c2ggb2YgYnVzaGVzKVxuICAgICAgICAgICAgaWYgKGJ1c2gueCA9PSBwb3NpdGlvblggJiYgYnVzaC55ID09IHBvc2l0aW9uWSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCBsb2FkUG9rZW1vbiA9IChhcnJheSkgPT5cbiAgICB7XG4gICAgICAgICRjcnVzaC5zdHlsZS5vcGFjaXR5ID0gJzEnXG4gICAgICAgIGNvbnN0IHBva2Vtb25JbmRleCAgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNTEpXG4gICAgICAgIGNvbnN0IHBva2Vtb25TcGF3biAgPSBhcnJheVtwb2tlbW9uSW5kZXhdLnNwYXduX2NoYW5jZVxuICAgICAgICBjb25zdCBwb2tlbW9uQ2hhbmNlID0gTWF0aC5yYW5kb20oKSAqIFNQQVdfUkFURSAtIHBva2Vtb25TcGF3blxuICAgICAgICBjb25zdCBpc1NwYXduZWQgICAgID0gcG9rZW1vbkNoYW5jZSA8IDAgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgaWYgKGlzU3Bhd25lZClcbiAgICAgICAge1xuICAgICAgICAgICAgY2FuV2FsayA9IGZhbHNlXG4gICAgICAgICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnLi8nKVxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKVxuICAgICAgICAgICAgeGhyLnNlbmQoZW5jb2RlVVJJKGBhY3Rpb249Y2F0Y2gmcG9rZW1vbl9pbmRleD0ke3Bva2Vtb25JbmRleH0mcG9zaXRpb25feD0ke3Bvc2l0aW9uLnggLyAxMH0mcG9zaXRpb25feT0ke3Bvc2l0aW9uLnkgLyAxMH1gKSlcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICRyZWN0YW5nbGVzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9jYXRjaCdcbiAgICAgICAgICAgICAgICB9LCAyMDAwKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZEpTT04oJ3Bva2VkZXgnLCAocmVzcG9uc2UpID0+XG4gICAge1xuICAgICAgICBjb25zdCBKU09OX2ZpbGUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxuICAgICAgICBjb25zdCBwb2tlbW9ucyAgPSBKU09OX2ZpbGUucG9rZW1vblxuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoY2FuV2FsaylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFsbG93UG9zaXRpb24oTWF0aC5tYXgoMCwgcG9zaXRpb24ueCAtIDUwKSwgcG9zaXRpb24ueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueCA9IE1hdGgubWF4KDAsIHBvc2l0aW9uLnggLSA1MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RlcEJ1c2gocG9zaXRpb24ueCwgcG9zaXRpb24ueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRQb2tlbW9uKHBva2Vtb25zKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNydXNoLnN0eWxlLm9wYWNpdHkgPSAnMCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICRzcHJpdGUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgwJSwgLTI1JSlgXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM5OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFsbG93UG9zaXRpb24oTWF0aC5taW4oKE1BUF9DT0wgLSAxKSAqIDUwLCBwb3NpdGlvbi54ICsgNTApLCBwb3NpdGlvbi55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi54ID0gTWF0aC5taW4oKE1BUF9DT0wgLSAxKSAqIDUwLCBwb3NpdGlvbi54ICsgNTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0ZXBCdXNoKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkUG9rZW1vbihwb2tlbW9ucylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjcnVzaC5zdHlsZS5vcGFjaXR5ID0gJzAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3ByaXRlLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoMCUsIC03NSUpYFxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxvd1Bvc2l0aW9uKHBvc2l0aW9uLngsIE1hdGgubWF4KDAsIHBvc2l0aW9uLnkgLSA1MCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnkgPSBNYXRoLm1heCgwLCBwb3NpdGlvbi55IC0gNTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0ZXBCdXNoKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkUG9rZW1vbihwb2tlbW9ucylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjcnVzaC5zdHlsZS5vcGFjaXR5ID0gJzAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3ByaXRlLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoMCUsIC01MCUpYFxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxvd1Bvc2l0aW9uKHBvc2l0aW9uLngsIE1hdGgubWluKChNQVBfUk9XIC0gMykgKiA1MCwgcG9zaXRpb24ueSArIDUwKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueSA9IE1hdGgubWluKChNQVBfUk9XIC0gMykgKiA1MCwgcG9zaXRpb24ueSArIDUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGVwQnVzaChwb3NpdGlvbi54LCBwb3NpdGlvbi55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZFBva2Vtb24ocG9rZW1vbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY3J1c2guc3R5bGUub3BhY2l0eSA9ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNwcml0ZS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKDAlLCAwKWBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRjaGFyYWN0ZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3Bvc2l0aW9uLnh9JSwgJHtwb3NpdGlvbi55fSUpYFxuICAgICAgICAgICAgICAgICRjcnVzaC5zdHlsZS50cmFuc2Zvcm0gICAgID0gYHRyYW5zbGF0ZSgke3Bvc2l0aW9uLnggKiAyfSUsICR7cG9zaXRpb24ueSAqIDJ9JSlgXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICB7XG4gICAgICAgIHJlc2l6ZUltYWdlKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQsIHNldFN0eWxlcylcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlJylcbiAgICB9LCAyNTApXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT5cbiAgICB7XG4gICAgICAgIHdpbmRvd1dpZHRoICA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICByZXNpemVJbWFnZSh3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0LCBzZXRTdHlsZXMpXG4gICAgfSlcbn1cbmVsc2UgaWYgKCRjb250YWluZXJDYXRjaClcbntcbiAgICBjb25zdCAkcmVjdGFuZ2xlcyAgID0gJGNvbnRhaW5lckNhdGNoLnF1ZXJ5U2VsZWN0b3IoJy5yZWN0YW5nbGVzJylcbiAgICBjb25zdCAkdGl0bGUgICAgICAgID0gJGNvbnRhaW5lckNhdGNoLnF1ZXJ5U2VsZWN0b3IoJ2gxJylcbiAgICBjb25zdCAkYXBwZWFycyAgICAgID0gJHRpdGxlLnF1ZXJ5U2VsZWN0b3IoJy5hcHBlYXJzJylcbiAgICBjb25zdCAkY2F1Z2h0ICAgICAgID0gJHRpdGxlLnF1ZXJ5U2VsZWN0b3IoJy5jYXVnaHQnKVxuICAgIGNvbnN0ICRlc2NhcGVkICAgICAgPSAkdGl0bGUucXVlcnlTZWxlY3RvcignLmVzY2FwZWQnKVxuICAgIGNvbnN0ICRhcHBlYXJhbmNlICAgPSAkY29udGFpbmVyQ2F0Y2gucXVlcnlTZWxlY3RvcignLmFwcGVhcmFuY2UnKVxuICAgIGNvbnN0ICRpbGx1c3RyYXRpb24gPSAkY29udGFpbmVyQ2F0Y2gucXVlcnlTZWxlY3RvcignLmlsbHVzdHJhdGlvbicpXG4gICAgY29uc3QgJGJ1dHRvbiAgICAgICA9ICRjb250YWluZXJDYXRjaC5xdWVyeVNlbGVjdG9yKCcuYnV0dG9uJylcbiAgICBjb25zdCAkdG9vbCAgICAgICAgID0gJGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCcudG9vbCcpXG4gICAgY29uc3QgQ0FUQ0hfUkFURSAgICA9IDc1XG5cbiAgICBsb2FkSlNPTigncG9rZWRleCcsIChyZXNwb25zZSkgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IEpTT05fZmlsZSAgICA9IEpTT04ucGFyc2UocmVzcG9uc2UpXG4gICAgICAgIGNvbnN0IHBva2Vtb25zICAgICA9IEpTT05fZmlsZS5wb2tlbW9uXG4gICAgICAgIGNvbnN0IHBva2Vtb25OYW1lICA9ICRhcHBlYXJhbmNlLmdldEF0dHJpYnV0ZSgnYWx0JylcbiAgICAgICAgY29uc3QgcG9rZW1vbiAgICAgID0gcG9rZW1vbnMuZmluZChwb2tlbW9uID0+IHBva2Vtb24ubmFtZSA9PSBwb2tlbW9uTmFtZSlcbiAgICAgICAgY29uc3QgcG9rZW1vbkluZGV4ID0gcG9rZW1vbnMuaW5kZXhPZihwb2tlbW9uKVxuICAgICAgICBjb25zdCBwb2tlbW9uQ2F0Y2ggPSBwb2tlbW9uLmNhdGNoX2NoYW5jZVxuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgJHJlY3RhbmdsZXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkdGl0bGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICAkYXBwZWFyYW5jZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICAgICAgICAgICRpbGx1c3RyYXRpb24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkdG9vbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAkY29udGFpbmVyQ2F0Y2gucmVtb3ZlQ2hpbGQoJHJlY3RhbmdsZXMpXG4gICAgICAgICAgICAgICAgICAgICRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICR0b29sLmNsYXNzTGlzdC5hZGQoJ3Rocm93bicpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRhcHBlYXJhbmNlLmNsYXNzTGlzdC5hZGQoJ2NhdWdodCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGFwcGVhcnMuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2tlbW9uQ2hhbmNlID0gTWF0aC5yYW5kb20oKSAqIENBVENIX1JBVEUgLSBwb2tlbW9uQ2F0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNDYXVnaHQgICAgICA9IHBva2Vtb25DaGFuY2UgPCAwID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0NhdWdodClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNhdWdodC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5vcGVuKCdQT1NUJywgJy4vJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKGVuY29kZVVSSShgYWN0aW9uPWNhdWdodCZwb2tlbW9uX2luZGV4PSR7cG9rZW1vbkluZGV4fWApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLm9ubG9hZCA9ICgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdmYWRlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTI1MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMjUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVzY2FwZWQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRhcHBlYXJhbmNlLmNsYXNzTGlzdC5yZW1vdmUoJ2NhdWdodCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGFwcGVhcmFuY2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2ZhZGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMjUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEyNTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTAwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEyNTApXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSwgMTAwMClcbiAgICAgICAgICAgIH0sIDEwMDApXG4gICAgICAgIH0sIDI1MClcbiAgICB9KVxufSJdfQ==
