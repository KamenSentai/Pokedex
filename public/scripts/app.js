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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9zY3JpcHRzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBTSxXQUFXLFNBQVgsUUFBVyxDQUFDLElBQUQsRUFBTyxRQUFQLEVBQ2pCO0FBQ0ksUUFBTSxPQUFPLElBQUksY0FBSixFQUFiO0FBQ0EsU0FBSyxnQkFBTCxDQUFzQixrQkFBdEI7QUFDQSxTQUFLLElBQUwsQ0FBVSxLQUFWLG1CQUFnQyxJQUFoQyxZQUE2QyxJQUE3QztBQUNBLFNBQUssa0JBQUwsR0FBMEIsWUFDMUI7QUFDSSxZQUFJLEtBQUssVUFBTCxJQUFtQixDQUFuQixJQUF3QixLQUFLLE1BQUwsSUFBZSxLQUEzQyxFQUNJLFNBQVMsS0FBSyxZQUFkO0FBQ1AsS0FKRDtBQUtBLFNBQUssSUFBTCxDQUFVLElBQVY7QUFDSCxDQVhEOztBQWFBLElBQU0sZ0JBQWtCLFNBQVMsYUFBVCxDQUF1QiwwQkFBdkIsQ0FBeEI7QUFDQSxJQUFNLGtCQUFrQixTQUFTLGFBQVQsQ0FBdUIsNEJBQXZCLENBQXhCO0FBQ0EsSUFBSSxhQUFKLEVBQ0E7QUFDSSxRQUFNLE9BQWMsY0FBYyxhQUFkLENBQTRCLE1BQTVCLENBQXBCO0FBQ0EsUUFBTSxTQUFjLGNBQWMsYUFBZCxDQUE0QixRQUE1QixDQUFwQjtBQUNBLFFBQU0sVUFBYyxjQUFjLGFBQWQsQ0FBNEIsU0FBNUIsQ0FBcEI7QUFDQSxRQUFNLFFBQWMsY0FBYyxhQUFkLENBQTRCLE9BQTVCLENBQXBCO0FBQ0EsUUFBTSxPQUFjLGNBQWMsYUFBZCxDQUE0QixNQUE1QixDQUFwQjtBQUNBLFFBQU0sYUFBYyxjQUFjLGFBQWQsQ0FBNEIsWUFBNUIsQ0FBcEI7QUFDQSxRQUFNLFNBQWMsY0FBYyxhQUFkLENBQTRCLFFBQTVCLENBQXBCO0FBQ0EsUUFBTSxVQUFjLFdBQVcsYUFBWCxDQUF5QixTQUF6QixDQUFwQjtBQUNBLFFBQU0sY0FBYyxjQUFjLGFBQWQsQ0FBNEIsYUFBNUIsQ0FBcEI7QUFDQSxRQUFNLFdBQWMsRUFBQyxHQUFHLFNBQVMsV0FBVyxPQUFYLENBQW1CLFNBQW5CLEdBQStCLEVBQXhDLENBQUosRUFBaUQsR0FBRyxTQUFTLFdBQVcsT0FBWCxDQUFtQixTQUFuQixHQUErQixFQUF4QyxDQUFwRCxFQUFwQjtBQUNBLFFBQU0sV0FBYyxFQUFDLEdBQUcsQ0FBSixFQUFPLEdBQUcsQ0FBVixFQUFwQjtBQUNBLFFBQU0sWUFBYyxFQUFwQjtBQUNBLFFBQU0sVUFBYyxFQUFwQjtBQUNBLFFBQU0sVUFBYyxFQUFwQjtBQUNBLFFBQU0sWUFBYyxVQUFVLE9BQTlCO0FBQ0EsUUFBTSxZQUNOLENBQ0ksRUFBQyxHQUFHLENBQUosRUFBTyxHQUFHLENBQVYsRUFESixFQUVJLEVBQUMsR0FBRyxDQUFKLEVBQU8sR0FBRyxFQUFWLEVBRkosRUFHSSxFQUFDLEdBQUcsQ0FBSixFQUFPLEdBQUcsR0FBVixFQUhKLEVBSUksRUFBQyxHQUFHLENBQUosRUFBTyxHQUFHLEdBQVYsRUFKSixFQUtJLEVBQUMsR0FBRyxDQUFKLEVBQU8sR0FBRyxHQUFWLEVBTEosRUFNSSxFQUFDLEdBQUcsQ0FBSixFQUFPLEdBQUcsR0FBVixFQU5KLEVBT0ksRUFBQyxHQUFHLENBQUosRUFBTyxHQUFHLEdBQVYsRUFQSixFQVFJLEVBQUMsR0FBRyxDQUFKLEVBQU8sR0FBRyxHQUFWLEVBUkosRUFTSSxFQUFDLEdBQUcsQ0FBSixFQUFPLEdBQUcsR0FBVixFQVRKLEVBVUksRUFBQyxHQUFHLEVBQUosRUFBUSxHQUFHLENBQVgsRUFWSixFQVdJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxDQUFaLEVBWEosRUFZSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsQ0FBWixFQVpKLEVBYUksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLEVBQVosRUFiSixFQWNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBZEosRUFlSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWZKLEVBZ0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBaEJKLEVBaUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBakJKLEVBa0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbEJKLEVBbUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbkJKLEVBb0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBcEJKLENBREE7QUF1QkEsUUFBTSxTQUNOLENBQ0ksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLENBQVosRUFESixFQUVJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxDQUFaLEVBRkosRUFHSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsQ0FBWixFQUhKLEVBSUksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLENBQVosRUFKSixFQUtJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxDQUFaLEVBTEosRUFNSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsQ0FBWixFQU5KLEVBT0ksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLEVBQVosRUFQSixFQVFJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxFQUFaLEVBUkosRUFTSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsRUFBWixFQVRKLEVBVUksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLEVBQVosRUFWSixFQVdJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxFQUFaLEVBWEosRUFZSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsRUFBWixFQVpKLEVBYUksRUFBQyxHQUFHLEdBQUosRUFBUyxHQUFHLEVBQVosRUFiSixFQWNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBZEosRUFlSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWZKLEVBZ0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBaEJKLEVBaUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBakJKLEVBa0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbEJKLEVBbUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbkJKLEVBb0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBcEJKLEVBcUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBckJKLEVBc0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdEJKLEVBdUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdkJKLEVBd0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBeEJKLEVBeUJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBekJKLEVBMEJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBMUJKLEVBMkJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBM0JKLEVBNEJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBNUJKLEVBNkJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBN0JKLEVBOEJJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBOUJKLEVBK0JJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBL0JKLEVBZ0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBaENKLEVBaUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBakNKLEVBa0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbENKLEVBbUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbkNKLEVBb0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBcENKLEVBcUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBckNKLEVBc0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdENKLEVBdUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdkNKLEVBd0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBeENKLEVBeUNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBekNKLEVBMENJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBMUNKLEVBMkNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBM0NKLEVBNENJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBNUNKLEVBNkNJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBN0NKLEVBOENJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBOUNKLEVBK0NJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBL0NKLEVBZ0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBaERKLEVBaURJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBakRKLEVBa0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbERKLEVBbURJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBbkRKLEVBb0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBcERKLEVBcURJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBckRKLEVBc0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdERKLEVBdURJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBdkRKLEVBd0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBeERKLEVBeURJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBekRKLEVBMERJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBMURKLEVBMkRJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBM0RKLEVBNERJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBNURKLEVBNkRJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBN0RKLEVBOERJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBOURKLEVBK0RJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBL0RKLEVBZ0VJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBaEVKLEVBaUVJLEVBQUMsR0FBRyxHQUFKLEVBQVMsR0FBRyxHQUFaLEVBakVKLENBREE7QUFvRUEsUUFBSSxjQUFlLE9BQU8sVUFBMUI7QUFDQSxRQUFJLGVBQWUsT0FBTyxXQUExQjtBQUNBLFFBQUksVUFBZSxJQUFuQjs7QUFFQSxRQUFNLGVBQWMsU0FBZCxZQUFjLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxLQUFaLEVBQW1CLE1BQW5CLEVBQTJCLFNBQTNCLEVBQ3BCO0FBQ0ksYUFBSyxLQUFMLENBQVcsSUFBWCxHQUF1QixJQUF2QjtBQUNBLGFBQUssS0FBTCxDQUFXLEdBQVgsR0FBdUIsR0FBdkI7QUFDQSxhQUFLLEtBQUwsQ0FBVyxLQUFYLEdBQXVCLEtBQXZCO0FBQ0EsYUFBSyxLQUFMLENBQVcsTUFBWCxHQUF1QixNQUF2QjtBQUNBLGFBQUssS0FBTCxDQUFXLFNBQVgsR0FBdUIsU0FBdkI7QUFDSCxLQVBEOztBQVNBLFFBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxXQUFELEVBQWMsWUFBZCxFQUE0QixRQUE1QixFQUNwQjtBQUNJLFlBQUksY0FBYyxZQUFkLElBQThCLFNBQWxDLEVBQ0E7QUFDSSx5QkFBYSxHQUFiLEVBQWtCLEtBQWxCLEVBQXlCLE1BQXpCLEVBQWlDLE1BQWpDLEVBQXlDLGtCQUF6QztBQUNBLGlCQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQXVCLEdBQXZCO0FBQ0EsbUJBQU8sS0FBUCxDQUFhLE1BQWIsR0FBdUIsR0FBdkI7QUFDQSxvQkFBUSxLQUFSLENBQWMsTUFBZCxHQUF1QixHQUF2QjtBQUNBLGtCQUFNLEtBQU4sQ0FBWSxNQUFaLEdBQXVCLEdBQXZCO0FBQ0gsU0FQRCxNQVNBO0FBQ0kseUJBQWEsS0FBYixFQUFvQixHQUFwQixFQUF5QixNQUF6QixFQUFpQyxNQUFqQyxFQUF5QyxrQkFBekM7QUFDQSxpQkFBSyxLQUFMLENBQVcsTUFBWCxHQUF1QixHQUF2QjtBQUNBLG1CQUFPLEtBQVAsQ0FBYSxNQUFiLEdBQXVCLEdBQXZCO0FBQ0Esb0JBQVEsS0FBUixDQUFjLE1BQWQsR0FBdUIsR0FBdkI7QUFDQSxrQkFBTSxLQUFOLENBQVksTUFBWixHQUF1QixHQUF2QjtBQUNIO0FBQ0Q7QUFDSCxLQW5CRDs7QUFxQkEsUUFBTSxZQUFZLFNBQVosU0FBWSxHQUNsQjtBQUNJLFlBQU0sWUFBZSxLQUFLLHFCQUFMLEdBQTZCLEdBQWxEO0FBQ0EsWUFBTSxhQUFlLEtBQUsscUJBQUwsR0FBNkIsSUFBbEQ7QUFDQSxZQUFNLGNBQWUsS0FBSyxxQkFBTCxHQUE2QixLQUFsRDtBQUNBLFlBQU0sZUFBZSxLQUFLLHFCQUFMLEdBQTZCLE1BQWxEO0FBQ0EsYUFBSyxLQUFMLENBQVcsTUFBWCxHQUF3QixTQUF4QjtBQUNBLGVBQU8sS0FBUCxDQUFhLElBQWIsR0FBd0IsVUFBeEI7QUFDQSxnQkFBUSxLQUFSLENBQWMsR0FBZCxHQUF3QixTQUF4QjtBQUNBLGNBQU0sS0FBTixDQUFZLEtBQVosR0FBd0IsVUFBeEI7QUFDQSxpQkFBUyxDQUFULEdBQXFCLGNBQWUsT0FBcEM7QUFDQSxpQkFBUyxDQUFULEdBQXFCLGVBQWUsT0FBcEM7QUFDQSxtQkFBVyxLQUFYLENBQWlCLElBQWpCLEdBQWdDLGFBQWEsU0FBUyxDQUFULEdBQWEsQ0FBMUQ7QUFDQSxtQkFBVyxLQUFYLENBQWlCLEdBQWpCLEdBQWdDLFNBQWhDO0FBQ0EsbUJBQVcsS0FBWCxDQUFpQixLQUFqQixHQUFnQyxTQUFTLENBQVQsR0FBYSxDQUE3QztBQUNBLG1CQUFXLEtBQVgsQ0FBaUIsTUFBakIsR0FBZ0MsU0FBUyxDQUFULEdBQWEsQ0FBN0M7QUFDQSxtQkFBVyxLQUFYLENBQWlCLFNBQWpCLGtCQUEwQyxTQUFTLENBQW5ELFdBQTBELFNBQVMsQ0FBbkU7QUFDQSxnQkFBUSxLQUFSLENBQWMsS0FBZDtBQUNBLGdCQUFRLEtBQVIsQ0FBYyxNQUFkO0FBQ0EsZUFBTyxLQUFQLENBQWEsSUFBYixHQUFnQyxVQUFoQztBQUNBLGVBQU8sS0FBUCxDQUFhLEdBQWIsR0FBZ0MsWUFBWSxTQUFTLENBQXJEO0FBQ0EsZUFBTyxLQUFQLENBQWEsS0FBYixHQUFnQyxTQUFTLENBQXpDO0FBQ0EsZUFBTyxLQUFQLENBQWEsTUFBYixHQUFnQyxTQUFTLENBQXpDO0FBQ0gsS0F2QkQ7O0FBeUJBLFFBQU0sZ0JBQWdCLFNBQWhCLGFBQWdCLENBQUMsU0FBRCxFQUFZLFNBQVosRUFDdEI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDSSxpQ0FBZ0MsU0FBaEM7QUFBQSxvQkFBVyxpQkFBWDs7QUFDSSxvQkFBSSxrQkFBa0IsQ0FBbEIsSUFBdUIsU0FBdkIsSUFBb0Msa0JBQWtCLENBQWxCLElBQXVCLFNBQS9ELEVBQ0ksT0FBTyxLQUFQO0FBRlI7QUFESjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUlJLGVBQU8sSUFBUDtBQUNILEtBTkQ7O0FBUUEsUUFBTSxXQUFXLFNBQVgsUUFBVyxDQUFDLFNBQUQsRUFBWSxTQUFaLEVBQ2pCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ0ksa0NBQW1CLE1BQW5CO0FBQUEsb0JBQVcsSUFBWDs7QUFDSSxvQkFBSSxLQUFLLENBQUwsSUFBVSxTQUFWLElBQXVCLEtBQUssQ0FBTCxJQUFVLFNBQXJDLEVBQ0ksT0FBTyxJQUFQO0FBRlI7QUFESjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUlJLGVBQU8sS0FBUDtBQUNILEtBTkQ7O0FBUUEsUUFBTSxjQUFjLFNBQWQsV0FBYyxDQUFDLEtBQUQsRUFDcEI7QUFDSSxlQUFPLEtBQVAsQ0FBYSxPQUFiLEdBQXVCLEdBQXZCO0FBQ0EsWUFBTSxlQUFnQixLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsS0FBZ0IsR0FBM0IsQ0FBdEI7QUFDQSxZQUFNLGVBQWdCLE1BQU0sWUFBTixFQUFvQixZQUExQztBQUNBLFlBQU0sZ0JBQWdCLEtBQUssTUFBTCxLQUFnQixTQUFoQixHQUE0QixZQUFsRDtBQUNBLFlBQU0sWUFBZ0IsZ0JBQWdCLENBQWhCLEdBQW9CLElBQXBCLEdBQTJCLEtBQWpEO0FBQ0EsWUFBSSxTQUFKLEVBQ0E7QUFDSSxzQkFBVSxLQUFWO0FBQ0EsZ0JBQU0sTUFBTSxJQUFJLGNBQUosRUFBWjtBQUNBLGdCQUFJLElBQUosQ0FBUyxNQUFULEVBQWlCLElBQWpCO0FBQ0EsZ0JBQUksZ0JBQUosQ0FBcUIsY0FBckIsRUFBcUMsbUNBQXJDO0FBQ0EsZ0JBQUksSUFBSixDQUFTLDBDQUF3QyxZQUF4QyxvQkFBbUUsU0FBUyxDQUFULEdBQWEsRUFBaEYsb0JBQWlHLFNBQVMsQ0FBVCxHQUFhLEVBQTlHLENBQVQ7QUFDQSxnQkFBSSxNQUFKLEdBQWEsWUFDYjtBQUNJLDRCQUFZLFNBQVosQ0FBc0IsR0FBdEIsQ0FBMEIsUUFBMUI7QUFDQSwyQkFBVyxZQUNYO0FBQ0ksMkJBQU8sUUFBUCxDQUFnQixJQUFoQixHQUF1QixTQUF2QjtBQUNILGlCQUhELEVBR0csSUFISDtBQUlILGFBUEQ7QUFRSDtBQUNKLEtBdkJEOztBQXlCQSxhQUFTLFNBQVQsRUFBb0IsVUFBQyxRQUFELEVBQ3BCO0FBQ0ksWUFBTSxZQUFZLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBbEI7QUFDQSxZQUFNLFdBQVksVUFBVSxPQUE1Qjs7QUFFQSxlQUFPLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DLFVBQUMsS0FBRCxFQUNuQztBQUNJLGdCQUFJLE9BQUosRUFDQTtBQUNJLHdCQUFRLE1BQU0sT0FBZDtBQUVJLHlCQUFLLEVBQUw7QUFDSSw0QkFBSSxjQUFjLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxTQUFTLENBQVQsR0FBYSxFQUF6QixDQUFkLEVBQTRDLFNBQVMsQ0FBckQsQ0FBSixFQUNBO0FBQ0kscUNBQVMsQ0FBVCxHQUFhLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxTQUFTLENBQVQsR0FBYSxFQUF6QixDQUFiO0FBQ0EsZ0NBQUksU0FBUyxTQUFTLENBQWxCLEVBQXFCLFNBQVMsQ0FBOUIsQ0FBSixFQUNJLFlBQVksUUFBWixFQURKLEtBR0ksT0FBTyxLQUFQLENBQWEsT0FBYixHQUF1QixHQUF2QjtBQUNQO0FBQ0QsZ0NBQVEsS0FBUixDQUFjLFNBQWQ7QUFDQTtBQUNKLHlCQUFLLEVBQUw7QUFDSSw0QkFBSSxjQUFjLEtBQUssR0FBTCxDQUFTLENBQUMsVUFBVSxDQUFYLElBQWdCLEVBQXpCLEVBQTZCLFNBQVMsQ0FBVCxHQUFhLEVBQTFDLENBQWQsRUFBNkQsU0FBUyxDQUF0RSxDQUFKLEVBQ0E7QUFDSSxxQ0FBUyxDQUFULEdBQWEsS0FBSyxHQUFMLENBQVMsQ0FBQyxVQUFVLENBQVgsSUFBZ0IsRUFBekIsRUFBNkIsU0FBUyxDQUFULEdBQWEsRUFBMUMsQ0FBYjtBQUNBLGdDQUFJLFNBQVMsU0FBUyxDQUFsQixFQUFxQixTQUFTLENBQTlCLENBQUosRUFDSSxZQUFZLFFBQVosRUFESixLQUdJLE9BQU8sS0FBUCxDQUFhLE9BQWIsR0FBdUIsR0FBdkI7QUFDUDtBQUNELGdDQUFRLEtBQVIsQ0FBYyxTQUFkO0FBQ0E7QUFDSix5QkFBSyxFQUFMO0FBQ0ksNEJBQUksY0FBYyxTQUFTLENBQXZCLEVBQTBCLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxTQUFTLENBQVQsR0FBYSxFQUF6QixDQUExQixDQUFKLEVBQ0E7QUFDSSxxQ0FBUyxDQUFULEdBQWEsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLFNBQVMsQ0FBVCxHQUFhLEVBQXpCLENBQWI7QUFDQSxnQ0FBSSxTQUFTLFNBQVMsQ0FBbEIsRUFBcUIsU0FBUyxDQUE5QixDQUFKLEVBQ0ksWUFBWSxRQUFaLEVBREosS0FHSSxPQUFPLEtBQVAsQ0FBYSxPQUFiLEdBQXVCLEdBQXZCO0FBQ1A7QUFDRCxnQ0FBUSxLQUFSLENBQWMsU0FBZDtBQUNBO0FBQ0oseUJBQUssRUFBTDtBQUNJLDRCQUFJLGNBQWMsU0FBUyxDQUF2QixFQUEwQixLQUFLLEdBQUwsQ0FBUyxDQUFDLFVBQVUsQ0FBWCxJQUFnQixFQUF6QixFQUE2QixTQUFTLENBQVQsR0FBYSxFQUExQyxDQUExQixDQUFKLEVBQ0E7QUFDSSxxQ0FBUyxDQUFULEdBQWEsS0FBSyxHQUFMLENBQVMsQ0FBQyxVQUFVLENBQVgsSUFBZ0IsRUFBekIsRUFBNkIsU0FBUyxDQUFULEdBQWEsRUFBMUMsQ0FBYjtBQUNBLGdDQUFJLFNBQVMsU0FBUyxDQUFsQixFQUFxQixTQUFTLENBQTlCLENBQUosRUFDSSxZQUFZLFFBQVosRUFESixLQUdJLE9BQU8sS0FBUCxDQUFhLE9BQWIsR0FBdUIsR0FBdkI7QUFDUDtBQUNELGdDQUFRLEtBQVIsQ0FBYyxTQUFkO0FBQ0E7QUE3Q1I7QUErQ0EsMkJBQVcsS0FBWCxDQUFpQixTQUFqQixrQkFBMEMsU0FBUyxDQUFuRCxXQUEwRCxTQUFTLENBQW5FO0FBQ0EsdUJBQU8sS0FBUCxDQUFhLFNBQWIsa0JBQTBDLFNBQVMsQ0FBVCxHQUFhLENBQXZELFdBQThELFNBQVMsQ0FBVCxHQUFhLENBQTNFO0FBQ0g7QUFDSixTQXRERDtBQXVESCxLQTVERDs7QUE4REEsZUFBVyxZQUNYO0FBQ0ksb0JBQVksV0FBWixFQUF5QixZQUF6QixFQUF1QyxTQUF2QztBQUNBLGlCQUFTLElBQVQsQ0FBYyxTQUFkLENBQXdCLE1BQXhCLENBQStCLE1BQS9CO0FBQ0gsS0FKRCxFQUlHLEdBSkg7O0FBTUEsV0FBTyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxZQUNsQztBQUNJLHNCQUFlLE9BQU8sVUFBdEI7QUFDQSx1QkFBZSxPQUFPLFdBQXRCO0FBQ0Esb0JBQVksV0FBWixFQUF5QixZQUF6QixFQUF1QyxTQUF2QztBQUNILEtBTEQ7QUFNSCxDQTFSRCxNQTJSSyxJQUFJLGVBQUosRUFDTDtBQUNJLFFBQU0sZUFBZ0IsZ0JBQWdCLGFBQWhCLENBQThCLGFBQTlCLENBQXRCO0FBQ0EsUUFBTSxTQUFnQixnQkFBZ0IsYUFBaEIsQ0FBOEIsSUFBOUIsQ0FBdEI7QUFDQSxRQUFNLFdBQWdCLE9BQU8sYUFBUCxDQUFxQixVQUFyQixDQUF0QjtBQUNBLFFBQU0sVUFBZ0IsT0FBTyxhQUFQLENBQXFCLFNBQXJCLENBQXRCO0FBQ0EsUUFBTSxXQUFnQixPQUFPLGFBQVAsQ0FBcUIsVUFBckIsQ0FBdEI7QUFDQSxRQUFNLGNBQWdCLGdCQUFnQixhQUFoQixDQUE4QixhQUE5QixDQUF0QjtBQUNBLFFBQU0sZ0JBQWdCLGdCQUFnQixhQUFoQixDQUE4QixlQUE5QixDQUF0QjtBQUNBLFFBQU0sVUFBZ0IsZ0JBQWdCLGFBQWhCLENBQThCLFNBQTlCLENBQXRCO0FBQ0EsUUFBTSxRQUFnQixRQUFRLGFBQVIsQ0FBc0IsT0FBdEIsQ0FBdEI7QUFDQSxRQUFNLGFBQWdCLEVBQXRCOztBQUVBLGFBQVMsU0FBVCxFQUFvQixVQUFDLFFBQUQsRUFDcEI7QUFDSSxZQUFNLFlBQWUsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFyQjtBQUNBLFlBQU0sV0FBZSxVQUFVLE9BQS9CO0FBQ0EsWUFBTSxjQUFlLFlBQVksWUFBWixDQUF5QixLQUF6QixDQUFyQjtBQUNBLFlBQU0sVUFBZSxTQUFTLElBQVQsQ0FBYztBQUFBLG1CQUFXLFFBQVEsSUFBUixJQUFnQixXQUEzQjtBQUFBLFNBQWQsQ0FBckI7QUFDQSxZQUFNLGVBQWUsU0FBUyxPQUFULENBQWlCLE9BQWpCLENBQXJCO0FBQ0EsWUFBTSxlQUFlLFFBQVEsWUFBN0I7O0FBRUEsbUJBQVcsWUFDWDtBQUNJLHlCQUFZLFNBQVosQ0FBc0IsTUFBdEIsQ0FBNkIsUUFBN0I7QUFDQSx1QkFBVyxZQUNYO0FBQ0ksdUJBQU8sU0FBUCxDQUFpQixHQUFqQixDQUFxQixRQUFyQjtBQUNBLDRCQUFZLFNBQVosQ0FBc0IsR0FBdEIsQ0FBMEIsUUFBMUI7QUFDQSw4QkFBYyxTQUFkLENBQXdCLEdBQXhCLENBQTRCLFFBQTVCO0FBQ0EsMkJBQVcsWUFDWDtBQUNJLDBCQUFNLFNBQU4sQ0FBZ0IsR0FBaEIsQ0FBb0IsUUFBcEI7QUFDQSxvQ0FBZ0IsV0FBaEIsQ0FBNEIsWUFBNUI7QUFDQSw0QkFBUSxnQkFBUixDQUF5QixPQUF6QixFQUFrQyxVQUFDLEtBQUQsRUFDbEM7QUFDSSw4QkFBTSxjQUFOO0FBQ0EsOEJBQU0sU0FBTixDQUFnQixHQUFoQixDQUFvQixRQUFwQjtBQUNBLG1DQUFXLFlBQ1g7QUFDSSx3Q0FBWSxTQUFaLENBQXNCLEdBQXRCLENBQTBCLFFBQTFCO0FBQ0EsdUNBQVcsWUFDWDtBQUNJLHlDQUFTLEtBQVQsQ0FBZSxPQUFmLEdBQXlCLE1BQXpCO0FBQ0Esb0NBQU0sZ0JBQWdCLEtBQUssTUFBTCxLQUFnQixVQUFoQixHQUE2QixZQUFuRDtBQUNBLG9DQUFNLFdBQWdCLGdCQUFnQixDQUFoQixHQUFvQixJQUFwQixHQUEyQixLQUFqRDtBQUNBLG9DQUFJLFFBQUosRUFDQTtBQUNJLDRDQUFRLEtBQVIsQ0FBYyxPQUFkLEdBQXdCLE9BQXhCO0FBQ0Esd0NBQU0sTUFBTSxJQUFJLGNBQUosRUFBWjtBQUNBLHdDQUFJLElBQUosQ0FBUyxNQUFULEVBQWlCLElBQWpCO0FBQ0Esd0NBQUksZ0JBQUosQ0FBcUIsY0FBckIsRUFBcUMsbUNBQXJDO0FBQ0Esd0NBQUksSUFBSixDQUFTLDJDQUF5QyxZQUF6QyxDQUFUO0FBQ0Esd0NBQUksTUFBSixHQUFhLFlBQ2I7QUFDSSxtREFBVyxZQUNYO0FBQ0kscURBQVMsSUFBVCxDQUFjLFNBQWQsQ0FBd0IsR0FBeEIsQ0FBNEIsTUFBNUI7QUFDQSx1REFBVyxZQUNYO0FBQ0ksdURBQU8sUUFBUCxDQUFnQixJQUFoQixHQUF1QixJQUF2QjtBQUNILDZDQUhELEVBR0csSUFISDtBQUlILHlDQVBELEVBT0csSUFQSDtBQVFILHFDQVZEO0FBV0gsaUNBbEJELE1Bb0JBO0FBQ0ksNkNBQVMsS0FBVCxDQUFlLE9BQWYsR0FBeUIsT0FBekI7QUFDQSxnREFBWSxTQUFaLENBQXNCLE1BQXRCLENBQTZCLFFBQTdCO0FBQ0EsK0NBQVcsWUFDWDtBQUNJLG9EQUFZLFNBQVosQ0FBc0IsTUFBdEIsQ0FBNkIsUUFBN0I7QUFDQSxtREFBVyxZQUNYO0FBQ0kscURBQVMsSUFBVCxDQUFjLFNBQWQsQ0FBd0IsR0FBeEIsQ0FBNEIsTUFBNUI7QUFDQSx1REFBVyxZQUNYO0FBQ0ksdURBQU8sUUFBUCxDQUFnQixJQUFoQixHQUF1QixJQUF2QjtBQUNILDZDQUhELEVBR0csSUFISDtBQUlILHlDQVBELEVBT0csSUFQSDtBQVFILHFDQVhELEVBV0csSUFYSDtBQVlIO0FBQ0osNkJBekNELEVBeUNHLElBekNIO0FBMENILHlCQTdDRCxFQTZDRyxJQTdDSDtBQThDSCxxQkFsREQ7QUFtREgsaUJBdkRELEVBdURHLElBdkRIO0FBd0RILGFBN0RELEVBNkRHLElBN0RIO0FBOERILFNBakVELEVBaUVHLEdBakVIO0FBa0VILEtBM0VEO0FBNEVIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgbG9hZEpTT04gPSAoZmlsZSwgY2FsbGJhY2spID0+XG57XG4gICAgY29uc3QgeG9iaiA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgeG9iai5vdmVycmlkZU1pbWVUeXBlKCdhcHBsaWNhdGlvbi9qc29uJylcbiAgICB4b2JqLm9wZW4oJ0dFVCcsIGAuLi9kYXRhYmFzZS8ke2ZpbGV9Lmpzb25gLCB0cnVlKVxuICAgIHhvYmoub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT5cbiAgICB7XG4gICAgICAgIGlmICh4b2JqLnJlYWR5U3RhdGUgPT0gNCAmJiB4b2JqLnN0YXR1cyA9PSAnMjAwJylcbiAgICAgICAgICAgIGNhbGxiYWNrKHhvYmoucmVzcG9uc2VUZXh0KVxuICAgIH1cbiAgICB4b2JqLnNlbmQobnVsbClcbn1cblxuY29uc3QgJGNvbnRhaW5lck1hcCAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lci5jb250YWluZXItbWFwJylcbmNvbnN0ICRjb250YWluZXJDYXRjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXIuY29udGFpbmVyLWNhdGNoJylcbmlmICgkY29udGFpbmVyTWFwKVxue1xuICAgIGNvbnN0ICR0b3AgICAgICAgID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcudG9wJylcbiAgICBjb25zdCAkcmlnaHQgICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLnJpZ2h0JylcbiAgICBjb25zdCAkYm90dG9tICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLmJvdHRvbScpXG4gICAgY29uc3QgJGxlZnQgICAgICAgPSAkY29udGFpbmVyTWFwLnF1ZXJ5U2VsZWN0b3IoJy5sZWZ0JylcbiAgICBjb25zdCAkbWFwICAgICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLm1hcCcpXG4gICAgY29uc3QgJGNoYXJhY3RlciAgPSAkY29udGFpbmVyTWFwLnF1ZXJ5U2VsZWN0b3IoJy5jaGFyYWN0ZXInKVxuICAgIGNvbnN0ICRjcnVzaCAgICAgID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcuY3J1c2gnKVxuICAgIGNvbnN0ICRzcHJpdGUgICAgID0gJGNoYXJhY3Rlci5xdWVyeVNlbGVjdG9yKCcuc3ByaXRlJylcbiAgICBjb25zdCAkcmVjdGFuZ2xlcyA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLnJlY3RhbmdsZXMnKVxuICAgIGNvbnN0IHBvc2l0aW9uICAgID0ge3g6IHBhcnNlSW50KCRjaGFyYWN0ZXIuZGF0YXNldC5wb3NpdGlvbnggKiAxMCksIHk6IHBhcnNlSW50KCRjaGFyYWN0ZXIuZGF0YXNldC5wb3NpdGlvbnkgKiAxMCl9XG4gICAgY29uc3QgdGlsZVNpemUgICAgPSB7eDogMCwgeTogMH1cbiAgICBjb25zdCBTUEFXX1JBVEUgICA9IDI1XG4gICAgY29uc3QgTUFQX1JPVyAgICAgPSAxMlxuICAgIGNvbnN0IE1BUF9DT0wgICAgID0gMTVcbiAgICBjb25zdCBNQVBfUkFUSU8gICA9IE1BUF9DT0wgLyBNQVBfUk9XXG4gICAgY29uc3QgZm9yYmlkZGVuICAgPVxuICAgIFtcbiAgICAgICAge3g6IDAsIHk6IDB9LFxuICAgICAgICB7eDogMCwgeTogNTB9LFxuICAgICAgICB7eDogMCwgeTogMTAwfSxcbiAgICAgICAge3g6IDAsIHk6IDE1MH0sXG4gICAgICAgIHt4OiAwLCB5OiAyMDB9LFxuICAgICAgICB7eDogMCwgeTogMjUwfSxcbiAgICAgICAge3g6IDAsIHk6IDM1MH0sXG4gICAgICAgIHt4OiAwLCB5OiA0MDB9LFxuICAgICAgICB7eDogMCwgeTogNDUwfSxcbiAgICAgICAge3g6IDUwLCB5OiAwfSxcbiAgICAgICAge3g6IDY1MCwgeTogMH0sXG4gICAgICAgIHt4OiA3MDAsIHk6IDB9LFxuICAgICAgICB7eDogNzAwLCB5OiA1MH0sXG4gICAgICAgIHt4OiA3MDAsIHk6IDEwMH0sXG4gICAgICAgIHt4OiA3MDAsIHk6IDIwMH0sXG4gICAgICAgIHt4OiA3MDAsIHk6IDI1MH0sXG4gICAgICAgIHt4OiA3MDAsIHk6IDMwMH0sXG4gICAgICAgIHt4OiA3MDAsIHk6IDM1MH0sXG4gICAgICAgIHt4OiA3MDAsIHk6IDQwMH0sXG4gICAgICAgIHt4OiA3MDAsIHk6IDQ1MH0sXG4gICAgXVxuICAgIGNvbnN0IGJ1c2hlcyA9XG4gICAgW1xuICAgICAgICB7eDogMTUwLCB5OiAwfSxcbiAgICAgICAge3g6IDIwMCwgeTogMH0sXG4gICAgICAgIHt4OiAzMDAsIHk6IDB9LFxuICAgICAgICB7eDogMzUwLCB5OiAwfSxcbiAgICAgICAge3g6IDQ1MCwgeTogMH0sXG4gICAgICAgIHt4OiA1MDAsIHk6IDB9LFxuICAgICAgICB7eDogMjAwLCB5OiA1MH0sXG4gICAgICAgIHt4OiAyNTAsIHk6IDUwfSxcbiAgICAgICAge3g6IDMwMCwgeTogNTB9LFxuICAgICAgICB7eDogMzUwLCB5OiA1MH0sXG4gICAgICAgIHt4OiA0MDAsIHk6IDUwfSxcbiAgICAgICAge3g6IDUwMCwgeTogNTB9LFxuICAgICAgICB7eDogNTUwLCB5OiA1MH0sXG4gICAgICAgIHt4OiAxNTAsIHk6IDEwMH0sXG4gICAgICAgIHt4OiAyMDAsIHk6IDEwMH0sXG4gICAgICAgIHt4OiAzMDAsIHk6IDEwMH0sXG4gICAgICAgIHt4OiA0MDAsIHk6IDEwMH0sXG4gICAgICAgIHt4OiA0NTAsIHk6IDEwMH0sXG4gICAgICAgIHt4OiA1NTAsIHk6IDEwMH0sXG4gICAgICAgIHt4OiAxNTAsIHk6IDE1MH0sXG4gICAgICAgIHt4OiAyMDAsIHk6IDE1MH0sXG4gICAgICAgIHt4OiAyNTAsIHk6IDE1MH0sXG4gICAgICAgIHt4OiAzMDAsIHk6IDE1MH0sXG4gICAgICAgIHt4OiAzNTAsIHk6IDE1MH0sXG4gICAgICAgIHt4OiA0MDAsIHk6IDE1MH0sXG4gICAgICAgIHt4OiA0NTAsIHk6IDE1MH0sXG4gICAgICAgIHt4OiA1MDAsIHk6IDE1MH0sXG4gICAgICAgIHt4OiA1NTAsIHk6IDE1MH0sXG4gICAgICAgIHt4OiA2MDAsIHk6IDE1MH0sXG4gICAgICAgIHt4OiAxMDAsIHk6IDIwMH0sXG4gICAgICAgIHt4OiAyMDAsIHk6IDIwMH0sXG4gICAgICAgIHt4OiAzMDAsIHk6IDIwMH0sXG4gICAgICAgIHt4OiA0MDAsIHk6IDIwMH0sXG4gICAgICAgIHt4OiA1MDAsIHk6IDIwMH0sXG4gICAgICAgIHt4OiA1NTAsIHk6IDIwMH0sXG4gICAgICAgIHt4OiA2MDAsIHk6IDIwMH0sXG4gICAgICAgIHt4OiAxMDAsIHk6IDI1MH0sXG4gICAgICAgIHt4OiAxNTAsIHk6IDI1MH0sXG4gICAgICAgIHt4OiAyMDAsIHk6IDI1MH0sXG4gICAgICAgIHt4OiAyNTAsIHk6IDI1MH0sXG4gICAgICAgIHt4OiAzMDAsIHk6IDI1MH0sXG4gICAgICAgIHt4OiAzNTAsIHk6IDI1MH0sXG4gICAgICAgIHt4OiA0MDAsIHk6IDI1MH0sXG4gICAgICAgIHt4OiA0NTAsIHk6IDI1MH0sXG4gICAgICAgIHt4OiA1NTAsIHk6IDI1MH0sXG4gICAgICAgIHt4OiAxNTAsIHk6IDMwMH0sXG4gICAgICAgIHt4OiAyNTAsIHk6IDMwMH0sXG4gICAgICAgIHt4OiAzNTAsIHk6IDMwMH0sXG4gICAgICAgIHt4OiA0MDAsIHk6IDMwMH0sXG4gICAgICAgIHt4OiA1MDAsIHk6IDMwMH0sXG4gICAgICAgIHt4OiA2MDAsIHk6IDMwMH0sXG4gICAgICAgIHt4OiAxMDAsIHk6IDM1MH0sXG4gICAgICAgIHt4OiAyMDAsIHk6IDM1MH0sXG4gICAgICAgIHt4OiAyNTAsIHk6IDM1MH0sXG4gICAgICAgIHt4OiAzMDAsIHk6IDM1MH0sXG4gICAgICAgIHt4OiA0MDAsIHk6IDM1MH0sXG4gICAgICAgIHt4OiA0NTAsIHk6IDM1MH0sXG4gICAgICAgIHt4OiA1MDAsIHk6IDM1MH0sXG4gICAgICAgIHt4OiA1NTAsIHk6IDM1MH0sXG4gICAgICAgIHt4OiA2MDAsIHk6IDM1MH0sXG4gICAgICAgIHt4OiAyNTAsIHk6IDQwMH0sXG4gICAgICAgIHt4OiAzNTAsIHk6IDQwMH0sXG4gICAgICAgIHt4OiA0MDAsIHk6IDQwMH0sXG4gICAgICAgIHt4OiA1NTAsIHk6IDQwMH0sXG4gICAgICAgIHt4OiAzMDAsIHk6IDQ1MH1cbiAgICBdXG4gICAgbGV0IHdpbmRvd1dpZHRoICA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgbGV0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIGxldCBjYW5XYWxrICAgICAgPSB0cnVlXG5cbiAgICBjb25zdCBzZXRJbWFnZVNpemU9IChsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQsIHRyYW5zZm9ybSkgPT5cbiAgICB7XG4gICAgICAgICRtYXAuc3R5bGUubGVmdCAgICAgID0gbGVmdFxuICAgICAgICAkbWFwLnN0eWxlLnRvcCAgICAgICA9IHRvcFxuICAgICAgICAkbWFwLnN0eWxlLndpZHRoICAgICA9IHdpZHRoXG4gICAgICAgICRtYXAuc3R5bGUuaGVpZ2h0ICAgID0gaGVpZ2h0XG4gICAgICAgICRtYXAuc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4gICAgfVxuXG4gICAgY29uc3QgcmVzaXplSW1hZ2UgPSAod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCwgY2FsbGJhY2spID0+XG4gICAge1xuICAgICAgICBpZiAod2luZG93V2lkdGggLyB3aW5kb3dIZWlnaHQgPD0gTUFQX1JBVElPKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZXRJbWFnZVNpemUoJzAnLCAnNTAlJywgJzEwMCUnLCAnYXV0bycsICd0cmFuc2xhdGVZKC01MCUpJylcbiAgICAgICAgICAgICR0b3Auc3R5bGUuekluZGV4ICAgID0gJzEnXG4gICAgICAgICAgICAkcmlnaHQuc3R5bGUuekluZGV4ICA9ICcwJ1xuICAgICAgICAgICAgJGJvdHRvbS5zdHlsZS56SW5kZXggPSAnMSdcbiAgICAgICAgICAgICRsZWZ0LnN0eWxlLnpJbmRleCAgID0gJzAnXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBzZXRJbWFnZVNpemUoJzUwJScsICcwJywgJ2F1dG8nLCAnMTAwJScsICd0cmFuc2xhdGVYKC01MCUpJylcbiAgICAgICAgICAgICR0b3Auc3R5bGUuekluZGV4ICAgID0gJzAnXG4gICAgICAgICAgICAkcmlnaHQuc3R5bGUuekluZGV4ICA9ICcxJ1xuICAgICAgICAgICAgJGJvdHRvbS5zdHlsZS56SW5kZXggPSAnMCdcbiAgICAgICAgICAgICRsZWZ0LnN0eWxlLnpJbmRleCAgID0gJzEnXG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2soKVxuICAgIH1cblxuICAgIGNvbnN0IHNldFN0eWxlcyA9ICgpID0+XG4gICAge1xuICAgICAgICBjb25zdCB0b3BPZmZzZXQgICAgPSAkbWFwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICAgICAgICBjb25zdCBsZWZ0T2Zmc2V0ICAgPSAkbWFwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcbiAgICAgICAgY29uc3Qgd2lkdGhPZmZzZXQgID0gJG1hcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuICAgICAgICBjb25zdCBoZWlnaHRPZmZzZXQgPSAkbWFwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodFxuICAgICAgICAkdG9wLnN0eWxlLmJvdHRvbSAgPSBgJHt0b3BPZmZzZXR9cHhgXG4gICAgICAgICRyaWdodC5zdHlsZS5sZWZ0ICA9IGAke2xlZnRPZmZzZXR9cHhgXG4gICAgICAgICRib3R0b20uc3R5bGUudG9wICA9IGAke3RvcE9mZnNldH1weGBcbiAgICAgICAgJGxlZnQuc3R5bGUucmlnaHQgID0gYCR7bGVmdE9mZnNldH1weGBcbiAgICAgICAgdGlsZVNpemUueCAgICAgICAgID0gd2lkdGhPZmZzZXQgIC8gTUFQX0NPTFxuICAgICAgICB0aWxlU2l6ZS55ICAgICAgICAgPSBoZWlnaHRPZmZzZXQgLyBNQVBfUk9XXG4gICAgICAgICRjaGFyYWN0ZXIuc3R5bGUubGVmdCAgICAgID0gYCR7bGVmdE9mZnNldCAtIHRpbGVTaXplLnggLyAyfXB4YFxuICAgICAgICAkY2hhcmFjdGVyLnN0eWxlLnRvcCAgICAgICA9IGAke3RvcE9mZnNldH1weGBcbiAgICAgICAgJGNoYXJhY3Rlci5zdHlsZS53aWR0aCAgICAgPSBgJHt0aWxlU2l6ZS54ICogMn1weGBcbiAgICAgICAgJGNoYXJhY3Rlci5zdHlsZS5oZWlnaHQgICAgPSBgJHt0aWxlU2l6ZS55ICogMn1weGBcbiAgICAgICAgJGNoYXJhY3Rlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7cG9zaXRpb24ueH0lLCAke3Bvc2l0aW9uLnl9JSlgXG4gICAgICAgICRzcHJpdGUuc3R5bGUud2lkdGggICAgICAgID0gYDMwMCVgXG4gICAgICAgICRzcHJpdGUuc3R5bGUuaGVpZ2h0ICAgICAgID0gYDQwMCVgXG4gICAgICAgICRjcnVzaC5zdHlsZS5sZWZ0ICAgICAgICAgID0gYCR7bGVmdE9mZnNldH1weGBcbiAgICAgICAgJGNydXNoLnN0eWxlLnRvcCAgICAgICAgICAgPSBgJHt0b3BPZmZzZXQgKyB0aWxlU2l6ZS55fXB4YFxuICAgICAgICAkY3J1c2guc3R5bGUud2lkdGggICAgICAgICA9IGAke3RpbGVTaXplLnh9cHhgXG4gICAgICAgICRjcnVzaC5zdHlsZS5oZWlnaHQgICAgICAgID0gYCR7dGlsZVNpemUueX1weGBcbiAgICB9XG5cbiAgICBjb25zdCBhbGxvd1Bvc2l0aW9uID0gKHBvc2l0aW9uWCwgcG9zaXRpb25ZKSA9PlxuICAgIHtcbiAgICAgICAgZm9yIChjb25zdCBmb3JiaWRkZW5Qb3NpdGlvbiBvZiBmb3JiaWRkZW4pXG4gICAgICAgICAgICBpZiAoZm9yYmlkZGVuUG9zaXRpb24ueCA9PSBwb3NpdGlvblggJiYgZm9yYmlkZGVuUG9zaXRpb24ueSA9PSBwb3NpdGlvblkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgY29uc3Qgc3RlcEJ1c2ggPSAocG9zaXRpb25YLCBwb3NpdGlvblkpID0+XG4gICAge1xuICAgICAgICBmb3IgKGNvbnN0IGJ1c2ggb2YgYnVzaGVzKVxuICAgICAgICAgICAgaWYgKGJ1c2gueCA9PSBwb3NpdGlvblggJiYgYnVzaC55ID09IHBvc2l0aW9uWSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCBsb2FkUG9rZW1vbiA9IChhcnJheSkgPT5cbiAgICB7XG4gICAgICAgICRjcnVzaC5zdHlsZS5vcGFjaXR5ID0gJzEnXG4gICAgICAgIGNvbnN0IHBva2Vtb25JbmRleCAgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNTEpXG4gICAgICAgIGNvbnN0IHBva2Vtb25TcGF3biAgPSBhcnJheVtwb2tlbW9uSW5kZXhdLnNwYXduX2NoYW5jZVxuICAgICAgICBjb25zdCBwb2tlbW9uQ2hhbmNlID0gTWF0aC5yYW5kb20oKSAqIFNQQVdfUkFURSAtIHBva2Vtb25TcGF3blxuICAgICAgICBjb25zdCBpc1NwYXduZWQgICAgID0gcG9rZW1vbkNoYW5jZSA8IDAgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgaWYgKGlzU3Bhd25lZClcbiAgICAgICAge1xuICAgICAgICAgICAgY2FuV2FsayA9IGZhbHNlXG4gICAgICAgICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnLi8nKVxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKVxuICAgICAgICAgICAgeGhyLnNlbmQoZW5jb2RlVVJJKGBhY3Rpb249Y2F0Y2gmcG9rZW1vbl9pbmRleD0ke3Bva2Vtb25JbmRleH0mcG9zaXRpb25feD0ke3Bvc2l0aW9uLnggLyAxMH0mcG9zaXRpb25feT0ke3Bvc2l0aW9uLnkgLyAxMH1gKSlcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSAoKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICRyZWN0YW5nbGVzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9jYXRjaCdcbiAgICAgICAgICAgICAgICB9LCAyMDAwKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZEpTT04oJ3Bva2VkZXgnLCAocmVzcG9uc2UpID0+XG4gICAge1xuICAgICAgICBjb25zdCBKU09OX2ZpbGUgPSBKU09OLnBhcnNlKHJlc3BvbnNlKVxuICAgICAgICBjb25zdCBwb2tlbW9ucyAgPSBKU09OX2ZpbGUucG9rZW1vblxuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoY2FuV2FsaylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFsbG93UG9zaXRpb24oTWF0aC5tYXgoMCwgcG9zaXRpb24ueCAtIDUwKSwgcG9zaXRpb24ueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueCA9IE1hdGgubWF4KDAsIHBvc2l0aW9uLnggLSA1MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RlcEJ1c2gocG9zaXRpb24ueCwgcG9zaXRpb24ueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRQb2tlbW9uKHBva2Vtb25zKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNydXNoLnN0eWxlLm9wYWNpdHkgPSAnMCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICRzcHJpdGUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgwJSwgLTI1JSlgXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM5OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFsbG93UG9zaXRpb24oTWF0aC5taW4oKE1BUF9DT0wgLSAxKSAqIDUwLCBwb3NpdGlvbi54ICsgNTApLCBwb3NpdGlvbi55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi54ID0gTWF0aC5taW4oKE1BUF9DT0wgLSAxKSAqIDUwLCBwb3NpdGlvbi54ICsgNTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0ZXBCdXNoKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkUG9rZW1vbihwb2tlbW9ucylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjcnVzaC5zdHlsZS5vcGFjaXR5ID0gJzAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3ByaXRlLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoMCUsIC03NSUpYFxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxvd1Bvc2l0aW9uKHBvc2l0aW9uLngsIE1hdGgubWF4KDAsIHBvc2l0aW9uLnkgLSA1MCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnkgPSBNYXRoLm1heCgwLCBwb3NpdGlvbi55IC0gNTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0ZXBCdXNoKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkUG9rZW1vbihwb2tlbW9ucylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjcnVzaC5zdHlsZS5vcGFjaXR5ID0gJzAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3ByaXRlLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoMCUsIC01MCUpYFxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxvd1Bvc2l0aW9uKHBvc2l0aW9uLngsIE1hdGgubWluKChNQVBfUk9XIC0gMykgKiA1MCwgcG9zaXRpb24ueSArIDUwKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueSA9IE1hdGgubWluKChNQVBfUk9XIC0gMykgKiA1MCwgcG9zaXRpb24ueSArIDUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGVwQnVzaChwb3NpdGlvbi54LCBwb3NpdGlvbi55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZFBva2Vtb24ocG9rZW1vbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY3J1c2guc3R5bGUub3BhY2l0eSA9ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNwcml0ZS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKDAlLCAwKWBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRjaGFyYWN0ZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3Bvc2l0aW9uLnh9JSwgJHtwb3NpdGlvbi55fSUpYFxuICAgICAgICAgICAgICAgICRjcnVzaC5zdHlsZS50cmFuc2Zvcm0gICAgID0gYHRyYW5zbGF0ZSgke3Bvc2l0aW9uLnggKiAyfSUsICR7cG9zaXRpb24ueSAqIDJ9JSlgXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICB7XG4gICAgICAgIHJlc2l6ZUltYWdlKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQsIHNldFN0eWxlcylcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlJylcbiAgICB9LCAyNTApXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT5cbiAgICB7XG4gICAgICAgIHdpbmRvd1dpZHRoICA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICByZXNpemVJbWFnZSh3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0LCBzZXRTdHlsZXMpXG4gICAgfSlcbn1cbmVsc2UgaWYgKCRjb250YWluZXJDYXRjaClcbntcbiAgICBjb25zdCAkcmVjdGFuZ2xlcyAgID0gJGNvbnRhaW5lckNhdGNoLnF1ZXJ5U2VsZWN0b3IoJy5yZWN0YW5nbGVzJylcbiAgICBjb25zdCAkdGl0bGUgICAgICAgID0gJGNvbnRhaW5lckNhdGNoLnF1ZXJ5U2VsZWN0b3IoJ2gxJylcbiAgICBjb25zdCAkYXBwZWFycyAgICAgID0gJHRpdGxlLnF1ZXJ5U2VsZWN0b3IoJy5hcHBlYXJzJylcbiAgICBjb25zdCAkY2F1Z2h0ICAgICAgID0gJHRpdGxlLnF1ZXJ5U2VsZWN0b3IoJy5jYXVnaHQnKVxuICAgIGNvbnN0ICRlc2NhcGVkICAgICAgPSAkdGl0bGUucXVlcnlTZWxlY3RvcignLmVzY2FwZWQnKVxuICAgIGNvbnN0ICRhcHBlYXJhbmNlICAgPSAkY29udGFpbmVyQ2F0Y2gucXVlcnlTZWxlY3RvcignLmFwcGVhcmFuY2UnKVxuICAgIGNvbnN0ICRpbGx1c3RyYXRpb24gPSAkY29udGFpbmVyQ2F0Y2gucXVlcnlTZWxlY3RvcignLmlsbHVzdHJhdGlvbicpXG4gICAgY29uc3QgJGJ1dHRvbiAgICAgICA9ICRjb250YWluZXJDYXRjaC5xdWVyeVNlbGVjdG9yKCcuYnV0dG9uJylcbiAgICBjb25zdCAkdG9vbCAgICAgICAgID0gJGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCcudG9vbCcpXG4gICAgY29uc3QgQ0FUQ0hfUkFURSAgICA9IDc1XG5cbiAgICBsb2FkSlNPTigncG9rZWRleCcsIChyZXNwb25zZSkgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IEpTT05fZmlsZSAgICA9IEpTT04ucGFyc2UocmVzcG9uc2UpXG4gICAgICAgIGNvbnN0IHBva2Vtb25zICAgICA9IEpTT05fZmlsZS5wb2tlbW9uXG4gICAgICAgIGNvbnN0IHBva2Vtb25OYW1lICA9ICRhcHBlYXJhbmNlLmdldEF0dHJpYnV0ZSgnYWx0JylcbiAgICAgICAgY29uc3QgcG9rZW1vbiAgICAgID0gcG9rZW1vbnMuZmluZChwb2tlbW9uID0+IHBva2Vtb24ubmFtZSA9PSBwb2tlbW9uTmFtZSlcbiAgICAgICAgY29uc3QgcG9rZW1vbkluZGV4ID0gcG9rZW1vbnMuaW5kZXhPZihwb2tlbW9uKVxuICAgICAgICBjb25zdCBwb2tlbW9uQ2F0Y2ggPSBwb2tlbW9uLmNhdGNoX2NoYW5jZVxuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgJHJlY3RhbmdsZXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkdGl0bGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICAkYXBwZWFyYW5jZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICAgICAgICAgICRpbGx1c3RyYXRpb24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkdG9vbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAkY29udGFpbmVyQ2F0Y2gucmVtb3ZlQ2hpbGQoJHJlY3RhbmdsZXMpXG4gICAgICAgICAgICAgICAgICAgICRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICR0b29sLmNsYXNzTGlzdC5hZGQoJ3Rocm93bicpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRhcHBlYXJhbmNlLmNsYXNzTGlzdC5hZGQoJ2NhdWdodCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGFwcGVhcnMuc3R5bGUuZGlzcGxheSA9ICdub25lJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2tlbW9uQ2hhbmNlID0gTWF0aC5yYW5kb20oKSAqIENBVENIX1JBVEUgLSBwb2tlbW9uQ2F0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNDYXVnaHQgICAgICA9IHBva2Vtb25DaGFuY2UgPCAwID8gdHJ1ZSA6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0NhdWdodClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNhdWdodC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5vcGVuKCdQT1NUJywgJy4vJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKGVuY29kZVVSSShgYWN0aW9uPWNhdWdodCZwb2tlbW9uX2luZGV4PSR7cG9rZW1vbkluZGV4fWApKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLm9ubG9hZCA9ICgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdmYWRlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTI1MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMjUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGVzY2FwZWQuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRhcHBlYXJhbmNlLmNsYXNzTGlzdC5yZW1vdmUoJ2NhdWdodCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGFwcGVhcmFuY2UuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2ZhZGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMjUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEyNTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTAwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEyNTApXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSwgMTAwMClcbiAgICAgICAgICAgIH0sIDEwMDApXG4gICAgICAgIH0sIDI1MClcbiAgICB9KVxufSJdfQ==
