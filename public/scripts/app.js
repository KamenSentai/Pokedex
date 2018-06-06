(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var $containerMap = document.querySelector('.container.container-map');
if ($containerMap) {
    var $top = $containerMap.querySelector('.top');
    var $right = $containerMap.querySelector('.right');
    var $bottom = $containerMap.querySelector('.bottom');
    var $left = $containerMap.querySelector('.left');
    var $map = $containerMap.querySelector('.map');
    var $character = $containerMap.querySelector('.character');
    var $crush = $containerMap.querySelector('.crush');
    var $sprite = $character.querySelector('.sprite');
    var position = { x: 0, y: 300 };
    var tileSize = { x: 0, y: 0 };
    var SPAWN_RATE = 0.125;
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

    var setOffetset = function setOffetset() {
        var topOffset = $map.getBoundingClientRect().top;
        var leftOffset = $map.getBoundingClientRect().left;
        $top.style.bottom = topOffset + 'px';
        $right.style.left = leftOffset + 'px';
        $bottom.style.top = topOffset + 'px';
        $left.style.right = leftOffset + 'px';
        tileSize.x = $map.getBoundingClientRect().width / MAP_COL;
        tileSize.y = $map.getBoundingClientRect().height / MAP_ROW;
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

    var loadJSON = function loadJSON(callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType('application/json');
        xobj.open('GET', '../database/pokedex.json', true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == '200') callback(xobj.responseText);
        };
        xobj.send(null);
    };

    var loadPokemon = function loadPokemon(array) {
        $crush.style.opacity = '1';
        if (Math.random() - SPAWN_RATE < 0) {
            var pokemonNumber = Math.floor(Math.random() * 151);
            var pokemonSpawn = array[pokemonNumber].spawn_chance;
            var pokemonChance = Math.random() - pokemonSpawn;
            var isSpawning = pokemonChance < 0 ? true : false;
            if (isSpawning) {
                canWalk = false;
                var xhr = new XMLHttpRequest();
                xhr.open('POST', './');
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send(encodeURI('pokemon_number=' + pokemonNumber));
                xhr.onload = function () {
                    window.location.href = './catch';
                };
            }
        }
    };

    loadJSON(function (response) {
        var JSON_file = JSON.parse(response);
        var pokemon_array = JSON_file.pokemon;

        window.addEventListener('keydown', function (event) {
            if (canWalk) {
                switch (event.keyCode) {
                    case 37:
                        if (allowPosition(Math.max(0, position.x - 50), position.y)) {
                            position.x = Math.max(0, position.x - 50);
                            if (stepBush(position.x, position.y)) loadPokemon(pokemon_array);else $crush.style.opacity = '0';
                        }
                        $sprite.style.transform = 'translate(0%, -25%)';
                        break;
                    case 39:
                        if (allowPosition(Math.min((MAP_COL - 1) * 50, position.x + 50), position.y)) {
                            position.x = Math.min((MAP_COL - 1) * 50, position.x + 50);
                            if (stepBush(position.x, position.y)) loadPokemon(pokemon_array);else $crush.style.opacity = '0';
                        }
                        $sprite.style.transform = 'translate(0%, -75%)';
                        break;
                    case 38:
                        if (allowPosition(position.x, Math.max(0, position.y - 50))) {
                            position.y = Math.max(0, position.y - 50);
                            if (stepBush(position.x, position.y)) loadPokemon(pokemon_array);else $crush.style.opacity = '0';
                        }
                        $sprite.style.transform = 'translate(0%, -50%)';
                        break;
                    case 40:
                        if (allowPosition(position.x, Math.min((MAP_ROW - 3) * 50, position.y + 50))) {
                            position.y = Math.min((MAP_ROW - 3) * 50, position.y + 50);
                            if (stepBush(position.x, position.y)) loadPokemon(pokemon_array);else $crush.style.opacity = '0';
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
        resizeImage(windowWidth, windowHeight, setOffetset);
    }, 250);

    window.addEventListener('resize', function () {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        resizeImage(windowWidth, windowHeight, setOffetset);
    });
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9zY3JpcHRzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBTSxnQkFBZ0IsU0FBUyxhQUFULENBQXVCLDBCQUF2QixDQUF0QjtBQUNBLElBQUksYUFBSixFQUNBO0FBQ0ksUUFBTSxPQUFhLGNBQWMsYUFBZCxDQUE0QixNQUE1QixDQUFuQjtBQUNBLFFBQU0sU0FBYSxjQUFjLGFBQWQsQ0FBNEIsUUFBNUIsQ0FBbkI7QUFDQSxRQUFNLFVBQWEsY0FBYyxhQUFkLENBQTRCLFNBQTVCLENBQW5CO0FBQ0EsUUFBTSxRQUFhLGNBQWMsYUFBZCxDQUE0QixPQUE1QixDQUFuQjtBQUNBLFFBQU0sT0FBYSxjQUFjLGFBQWQsQ0FBNEIsTUFBNUIsQ0FBbkI7QUFDQSxRQUFNLGFBQWEsY0FBYyxhQUFkLENBQTRCLFlBQTVCLENBQW5CO0FBQ0EsUUFBTSxTQUFhLGNBQWMsYUFBZCxDQUE0QixRQUE1QixDQUFuQjtBQUNBLFFBQU0sVUFBYSxXQUFXLGFBQVgsQ0FBeUIsU0FBekIsQ0FBbkI7QUFDQSxRQUFNLFdBQWEsRUFBQyxHQUFHLENBQUosRUFBTyxHQUFHLEdBQVYsRUFBbkI7QUFDQSxRQUFNLFdBQWEsRUFBQyxHQUFHLENBQUosRUFBTyxHQUFHLENBQVYsRUFBbkI7QUFDQSxRQUFNLGFBQWEsS0FBbkI7QUFDQSxRQUFNLFVBQWEsRUFBbkI7QUFDQSxRQUFNLFVBQWEsRUFBbkI7QUFDQSxRQUFNLFlBQWEsVUFBVSxPQUE3QjtBQUNBLFFBQU0sWUFDTixDQUNJLEVBQUMsR0FBRyxDQUFKLEVBQU8sR0FBRyxDQUFWLEVBREosRUFFSSxFQUFDLEdBQUcsQ0FBSixFQUFPLEdBQUcsRUFBVixFQUZKLEVBR0ksRUFBQyxHQUFHLENBQUosRUFBTyxHQUFHLEdBQVYsRUFISixFQUlJLEVBQUMsR0FBRyxDQUFKLEVBQU8sR0FBRyxHQUFWLEVBSkosRUFLSSxF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R0FBWixFQTVCSixFQTZCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTdCSixFQThCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTlCSixFQStCSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQS9CSixFQWdDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWhDSixFQWlDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWpDSixFQWtDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWxDSixFQW1DSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQW5DSixFQW9DSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXBDSixFQXFDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXJDSixFQXNDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXRDSixFQXVDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXZDSixFQXdDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXhDSixFQXlDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQXpDSixFQTBDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTFDSixFQTJDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTNDSixFQTRDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTVDSixFQTZDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTdDSixFQThDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQTlDSixFQStDSSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQS9DSixFQWdESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWhESixFQWlESSxFQUFDLEdBQUcsR0FBSixFQUFTLEdBQUcsR0FBWixFQWpESixFQWtESSxF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Q0EsZ0NBQUksU0FBUyxTQUFTLENBQWxCLEVBQXFCLFNBQVMsQ0FBOUIsQ0FBSixFQUNJLFlBQVksYUFBWixFQURKLEtBR0ksT0FBTyxLQUFQLENBQWEsT0FBYixHQUF1QixHQUF2QjtBQUNQO0FBQ0QsZ0NBQVEsS0FBUixDQUFjLFNBQWQ7QUFDQTtBQTdDUjtBQStDQSwyQkFBVyxLQUFYLENBQWlCLFNBQWpCLGtCQUEwQyxTQUFTLENBQW5ELFdBQTBELFNBQVMsQ0FBbkU7QUFDQSx1QkFBTyxLQUFQLENBQWEsU0FBYixrQkFBMEMsU0FBUyxDQUFULEdBQWEsQ0FBdkQsV0FBOEQsU0FBUyxDQUFULEdBQWEsQ0FBM0U7QUFDSDtBQUNKLFNBdEREO0FBdURILEtBNUREOztBQThEQSxlQUFXLFlBQ1g7QUFDSSxvQkFBWSxXQUFaLEVBQXlCLFlBQXpCLEVBQXVDLFdBQXZDO0FBQ0gsS0FIRCxFQUdHLEdBSEg7O0FBS0EsV0FBTyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxZQUNsQztBQUNJLHNCQUFlLE9BQU8sVUFBdEI7QUFDQSx1QkFBZSxPQUFPLFdBQXRCO0FBQ0Esb0JBQVksV0FBWixFQUF5QixZQUF6QixFQUF1QyxXQUF2QztBQUNILEtBTEQ7QUFNSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0ICRjb250YWluZXJNYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyLmNvbnRhaW5lci1tYXAnKVxuaWYgKCRjb250YWluZXJNYXApXG57XG4gICAgY29uc3QgJHRvcCAgICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLnRvcCcpXG4gICAgY29uc3QgJHJpZ2h0ICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLnJpZ2h0JylcbiAgICBjb25zdCAkYm90dG9tICAgID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcuYm90dG9tJylcbiAgICBjb25zdCAkbGVmdCAgICAgID0gJGNvbnRhaW5lck1hcC5xdWVyeVNlbGVjdG9yKCcubGVmdCcpXG4gICAgY29uc3QgJG1hcCAgICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLm1hcCcpXG4gICAgY29uc3QgJGNoYXJhY3RlciA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLmNoYXJhY3RlcicpXG4gICAgY29uc3QgJGNydXNoICAgICA9ICRjb250YWluZXJNYXAucXVlcnlTZWxlY3RvcignLmNydXNoJylcbiAgICBjb25zdCAkc3ByaXRlICAgID0gJGNoYXJhY3Rlci5xdWVyeVNlbGVjdG9yKCcuc3ByaXRlJylcbiAgICBjb25zdCBwb3NpdGlvbiAgID0ge3g6IDAsIHk6IDMwMH1cbiAgICBjb25zdCB0aWxlU2l6ZSAgID0ge3g6IDAsIHk6IDB9XG4gICAgY29uc3QgU1BBV05fUkFURSA9IDAuMTI1XG4gICAgY29uc3QgTUFQX1JPVyAgICA9IDEyXG4gICAgY29uc3QgTUFQX0NPTCAgICA9IDE1XG4gICAgY29uc3QgTUFQX1JBVElPICA9IE1BUF9DT0wgLyBNQVBfUk9XXG4gICAgY29uc3QgZm9yYmlkZGVuICA9XG4gICAgW1xuICAgICAgICB7eDogMCwgeTogMH0sXG4gICAgICAgIHt4OiAwLCB5OiA1MH0sXG4gICAgICAgIHt4OiAwLCB5OiAxMDB9LFxuICAgICAgICB7eDogMCwgeTogMTUwfSxcbiAgICAgICAge3g6IDAsIHk6IDIwMH0sXG4gICAgICAgIHt4OiAwLCB5OiAyNTB9LFxuICAgICAgICB7eDogMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDAsIHk6IDQwMH0sXG4gICAgICAgIHt4OiAwLCB5OiA0NTB9LFxuICAgICAgICB7eDogNTAsIHk6IDB9LFxuICAgICAgICB7eDogNjUwLCB5OiAwfSxcbiAgICAgICAge3g6IDcwMCwgeTogMH0sXG4gICAgICAgIHt4OiA3MDAsIHk6IDUwfSxcbiAgICAgICAge3g6IDcwMCwgeTogMTAwfSxcbiAgICAgICAge3g6IDcwMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDcwMCwgeTogMjUwfSxcbiAgICAgICAge3g6IDcwMCwgeTogMzAwfSxcbiAgICAgICAge3g6IDcwMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDcwMCwgeTogNDAwfSxcbiAgICAgICAge3g6IDcwMCwgeTogNDUwfSxcbiAgICBdXG4gICAgY29uc3QgYnVzaGVzID1cbiAgICBbXG4gICAgICAgIHt4OiAxNTAsIHk6IDB9LFxuICAgICAgICB7eDogMjAwLCB5OiAwfSxcbiAgICAgICAge3g6IDMwMCwgeTogMH0sXG4gICAgICAgIHt4OiAzNTAsIHk6IDB9LFxuICAgICAgICB7eDogNDUwLCB5OiAwfSxcbiAgICAgICAge3g6IDUwMCwgeTogMH0sXG4gICAgICAgIHt4OiAyMDAsIHk6IDUwfSxcbiAgICAgICAge3g6IDI1MCwgeTogNTB9LFxuICAgICAgICB7eDogMzAwLCB5OiA1MH0sXG4gICAgICAgIHt4OiAzNTAsIHk6IDUwfSxcbiAgICAgICAge3g6IDQwMCwgeTogNTB9LFxuICAgICAgICB7eDogNTAwLCB5OiA1MH0sXG4gICAgICAgIHt4OiA1NTAsIHk6IDUwfSxcbiAgICAgICAge3g6IDE1MCwgeTogMTAwfSxcbiAgICAgICAge3g6IDIwMCwgeTogMTAwfSxcbiAgICAgICAge3g6IDMwMCwgeTogMTAwfSxcbiAgICAgICAge3g6IDQwMCwgeTogMTAwfSxcbiAgICAgICAge3g6IDQ1MCwgeTogMTAwfSxcbiAgICAgICAge3g6IDU1MCwgeTogMTAwfSxcbiAgICAgICAge3g6IDE1MCwgeTogMTUwfSxcbiAgICAgICAge3g6IDIwMCwgeTogMTUwfSxcbiAgICAgICAge3g6IDI1MCwgeTogMTUwfSxcbiAgICAgICAge3g6IDMwMCwgeTogMTUwfSxcbiAgICAgICAge3g6IDM1MCwgeTogMTUwfSxcbiAgICAgICAge3g6IDQwMCwgeTogMTUwfSxcbiAgICAgICAge3g6IDQ1MCwgeTogMTUwfSxcbiAgICAgICAge3g6IDUwMCwgeTogMTUwfSxcbiAgICAgICAge3g6IDU1MCwgeTogMTUwfSxcbiAgICAgICAge3g6IDYwMCwgeTogMTUwfSxcbiAgICAgICAge3g6IDEwMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDIwMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDMwMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDQwMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDUwMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDU1MCwgeTogMjAwfSxcbiAgICAgICAge3g6IDYwMCwgeTogMjAwfSxcbiAgICAgICAge3g6IDEwMCwgeTogMjUwfSxcbiAgICAgICAge3g6IDE1MCwgeTogMjUwfSxcbiAgICAgICAge3g6IDIwMCwgeTogMjUwfSxcbiAgICAgICAge3g6IDI1MCwgeTogMjUwfSxcbiAgICAgICAge3g6IDMwMCwgeTogMjUwfSxcbiAgICAgICAge3g6IDM1MCwgeTogMjUwfSxcbiAgICAgICAge3g6IDQwMCwgeTogMjUwfSxcbiAgICAgICAge3g6IDQ1MCwgeTogMjUwfSxcbiAgICAgICAge3g6IDU1MCwgeTogMjUwfSxcbiAgICAgICAge3g6IDE1MCwgeTogMzAwfSxcbiAgICAgICAge3g6IDI1MCwgeTogMzAwfSxcbiAgICAgICAge3g6IDM1MCwgeTogMzAwfSxcbiAgICAgICAge3g6IDQwMCwgeTogMzAwfSxcbiAgICAgICAge3g6IDUwMCwgeTogMzAwfSxcbiAgICAgICAge3g6IDYwMCwgeTogMzAwfSxcbiAgICAgICAge3g6IDEwMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDIwMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDI1MCwgeTogMzUwfSxcbiAgICAgICAge3g6IDMwMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDQwMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDQ1MCwgeTogMzUwfSxcbiAgICAgICAge3g6IDUwMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDU1MCwgeTogMzUwfSxcbiAgICAgICAge3g6IDYwMCwgeTogMzUwfSxcbiAgICAgICAge3g6IDI1MCwgeTogNDAwfSxcbiAgICAgICAge3g6IDM1MCwgeTogNDAwfSxcbiAgICAgICAge3g6IDQwMCwgeTogNDAwfSxcbiAgICAgICAge3g6IDU1MCwgeTogNDAwfSxcbiAgICAgICAge3g6IDMwMCwgeTogNDUwfVxuICAgIF1cbiAgICBsZXQgd2luZG93V2lkdGggID0gd2luZG93LmlubmVyV2lkdGhcbiAgICBsZXQgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XG4gICAgbGV0IGNhbldhbGsgICAgICA9IHRydWVcblxuICAgIGNvbnN0IHNldEltYWdlU2l6ZT0gKGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCwgdHJhbnNmb3JtKSA9PlxuICAgIHtcbiAgICAgICAgJG1hcC5zdHlsZS5sZWZ0ICAgICAgPSBsZWZ0XG4gICAgICAgICRtYXAuc3R5bGUudG9wICAgICAgID0gdG9wXG4gICAgICAgICRtYXAuc3R5bGUud2lkdGggICAgID0gd2lkdGhcbiAgICAgICAgJG1hcC5zdHlsZS5oZWlnaHQgICAgPSBoZWlnaHRcbiAgICAgICAgJG1hcC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbiAgICB9XG5cbiAgICBjb25zdCByZXNpemVJbWFnZSA9ICh3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0LCBjYWxsYmFjaykgPT5cbiAgICB7XG4gICAgICAgIGlmICh3aW5kb3dXaWR0aCAvIHdpbmRvd0hlaWdodCA8PSBNQVBfUkFUSU8pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNldEltYWdlU2l6ZSgnMCcsICc1MCUnLCAnMTAwJScsICdhdXRvJywgJ3RyYW5zbGF0ZVkoLTUwJSknKVxuICAgICAgICAgICAgJHRvcC5zdHlsZS56SW5kZXggICAgPSAnMSdcbiAgICAgICAgICAgICRyaWdodC5zdHlsZS56SW5kZXggID0gJzAnXG4gICAgICAgICAgICAkYm90dG9tLnN0eWxlLnpJbmRleCA9ICcxJ1xuICAgICAgICAgICAgJGxlZnQuc3R5bGUuekluZGV4ICAgPSAnMCdcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNldEltYWdlU2l6ZSgnNTAlJywgJzAnLCAnYXV0bycsICcxMDAlJywgJ3RyYW5zbGF0ZVgoLTUwJSknKVxuICAgICAgICAgICAgJHRvcC5zdHlsZS56SW5kZXggICAgPSAnMCdcbiAgICAgICAgICAgICRyaWdodC5zdHlsZS56SW5kZXggID0gJzEnXG4gICAgICAgICAgICAkYm90dG9tLnN0eWxlLnpJbmRleCA9ICcwJ1xuICAgICAgICAgICAgJGxlZnQuc3R5bGUuekluZGV4ICAgPSAnMSdcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgY29uc3Qgc2V0T2ZmZXRzZXQgPSAoKSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgdG9wT2Zmc2V0ICAgPSAkbWFwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuICAgICAgICBjb25zdCBsZWZ0T2Zmc2V0ICA9ICRtYXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdFxuICAgICAgICAkdG9wLnN0eWxlLmJvdHRvbSA9IGAke3RvcE9mZnNldH1weGBcbiAgICAgICAgJHJpZ2h0LnN0eWxlLmxlZnQgPSBgJHtsZWZ0T2Zmc2V0fXB4YFxuICAgICAgICAkYm90dG9tLnN0eWxlLnRvcCA9IGAke3RvcE9mZnNldH1weGBcbiAgICAgICAgJGxlZnQuc3R5bGUucmlnaHQgPSBgJHtsZWZ0T2Zmc2V0fXB4YFxuICAgICAgICB0aWxlU2l6ZS54ID0gJG1hcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAgLyBNQVBfQ09MXG4gICAgICAgIHRpbGVTaXplLnkgPSAkbWFwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAvIE1BUF9ST1dcbiAgICAgICAgJGNoYXJhY3Rlci5zdHlsZS5sZWZ0ICAgICAgPSBgJHtsZWZ0T2Zmc2V0IC0gdGlsZVNpemUueCAvIDJ9cHhgXG4gICAgICAgICRjaGFyYWN0ZXIuc3R5bGUudG9wICAgICAgID0gYCR7dG9wT2Zmc2V0fXB4YFxuICAgICAgICAkY2hhcmFjdGVyLnN0eWxlLndpZHRoICAgICA9IGAke3RpbGVTaXplLnggKiAyfXB4YFxuICAgICAgICAkY2hhcmFjdGVyLnN0eWxlLmhlaWdodCAgICA9IGAke3RpbGVTaXplLnkgKiAyfXB4YFxuICAgICAgICAkY2hhcmFjdGVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtwb3NpdGlvbi54fSUsICR7cG9zaXRpb24ueX0lKWBcbiAgICAgICAgJHNwcml0ZS5zdHlsZS53aWR0aCAgICAgICAgPSBgMzAwJWBcbiAgICAgICAgJHNwcml0ZS5zdHlsZS5oZWlnaHQgICAgICAgPSBgNDAwJWBcbiAgICAgICAgJGNydXNoLnN0eWxlLmxlZnQgICAgICAgICAgPSBgJHtsZWZ0T2Zmc2V0fXB4YFxuICAgICAgICAkY3J1c2guc3R5bGUudG9wICAgICAgICAgICA9IGAke3RvcE9mZnNldCArIHRpbGVTaXplLnl9cHhgXG4gICAgICAgICRjcnVzaC5zdHlsZS53aWR0aCAgICAgICAgID0gYCR7dGlsZVNpemUueH1weGBcbiAgICAgICAgJGNydXNoLnN0eWxlLmhlaWdodCAgICAgICAgPSBgJHt0aWxlU2l6ZS55fXB4YFxuICAgIH1cblxuICAgIGNvbnN0IGFsbG93UG9zaXRpb24gPSAocG9zaXRpb25YLCBwb3NpdGlvblkpID0+XG4gICAge1xuICAgICAgICBmb3IgKGNvbnN0IGZvcmJpZGRlblBvc2l0aW9uIG9mIGZvcmJpZGRlbilcbiAgICAgICAgICAgIGlmIChmb3JiaWRkZW5Qb3NpdGlvbi54ID09IHBvc2l0aW9uWCAmJiBmb3JiaWRkZW5Qb3NpdGlvbi55ID09IHBvc2l0aW9uWSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBjb25zdCBzdGVwQnVzaCA9IChwb3NpdGlvblgsIHBvc2l0aW9uWSkgPT5cbiAgICB7XG4gICAgICAgIGZvciAoY29uc3QgYnVzaCBvZiBidXNoZXMpXG4gICAgICAgICAgICBpZiAoYnVzaC54ID09IHBvc2l0aW9uWCAmJiBidXNoLnkgPT0gcG9zaXRpb25ZKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IGxvYWRKU09OID0gKGNhbGxiYWNrKSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgeG9iaiA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICAgIHhvYmoub3ZlcnJpZGVNaW1lVHlwZSgnYXBwbGljYXRpb24vanNvbicpXG4gICAgICAgIHhvYmoub3BlbignR0VUJywgJy4uL2RhdGFiYXNlL3Bva2VkZXguanNvbicsIHRydWUpXG4gICAgICAgIHhvYmoub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHhvYmoucmVhZHlTdGF0ZSA9PSA0ICYmIHhvYmouc3RhdHVzID09ICcyMDAnKVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHhvYmoucmVzcG9uc2VUZXh0KVxuICAgICAgICB9XG4gICAgICAgIHhvYmouc2VuZChudWxsKVxuICAgIH1cblxuICAgIGNvbnN0IGxvYWRQb2tlbW9uID0gKGFycmF5KSA9PlxuICAgIHtcbiAgICAgICAgJGNydXNoLnN0eWxlLm9wYWNpdHkgPSAnMSdcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgLSBTUEFXTl9SQVRFIDwgMClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgcG9rZW1vbk51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE1MSlcbiAgICAgICAgICAgIGNvbnN0IHBva2Vtb25TcGF3biAgPSBhcnJheVtwb2tlbW9uTnVtYmVyXS5zcGF3bl9jaGFuY2VcbiAgICAgICAgICAgIGNvbnN0IHBva2Vtb25DaGFuY2UgPSBNYXRoLnJhbmRvbSgpIC0gcG9rZW1vblNwYXduXG4gICAgICAgICAgICBjb25zdCBpc1NwYXduaW5nICAgID0gcG9rZW1vbkNoYW5jZSA8IDAgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgICAgIGlmIChpc1NwYXduaW5nKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNhbldhbGsgPSBmYWxzZVxuICAgICAgICAgICAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICAgICAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnLi8nKVxuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcbiAgICAgICAgICAgICAgICB4aHIuc2VuZChlbmNvZGVVUkkoYHBva2Vtb25fbnVtYmVyPSR7cG9rZW1vbk51bWJlcn1gKSlcbiAgICAgICAgICAgICAgICB4aHIub25sb2FkID0gKCkgPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vY2F0Y2gnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZEpTT04oKHJlc3BvbnNlKSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgSlNPTl9maWxlICAgICA9IEpTT04ucGFyc2UocmVzcG9uc2UpXG4gICAgICAgIGNvbnN0IHBva2Vtb25fYXJyYXkgPSBKU09OX2ZpbGUucG9rZW1vblxuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoY2FuV2FsaylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFsbG93UG9zaXRpb24oTWF0aC5tYXgoMCwgcG9zaXRpb24ueCAtIDUwKSwgcG9zaXRpb24ueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueCA9IE1hdGgubWF4KDAsIHBvc2l0aW9uLnggLSA1MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RlcEJ1c2gocG9zaXRpb24ueCwgcG9zaXRpb24ueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRQb2tlbW9uKHBva2Vtb25fYXJyYXkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY3J1c2guc3R5bGUub3BhY2l0eSA9ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNwcml0ZS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKDAlLCAtMjUlKWBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzk6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxsb3dQb3NpdGlvbihNYXRoLm1pbigoTUFQX0NPTCAtIDEpICogNTAsIHBvc2l0aW9uLnggKyA1MCksIHBvc2l0aW9uLnkpKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnggPSBNYXRoLm1pbigoTUFQX0NPTCAtIDEpICogNTAsIHBvc2l0aW9uLnggKyA1MClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RlcEJ1c2gocG9zaXRpb24ueCwgcG9zaXRpb24ueSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRQb2tlbW9uKHBva2Vtb25fYXJyYXkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY3J1c2guc3R5bGUub3BhY2l0eSA9ICcwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJHNwcml0ZS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKDAlLCAtNzUlKWBcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWxsb3dQb3NpdGlvbihwb3NpdGlvbi54LCBNYXRoLm1heCgwLCBwb3NpdGlvbi55IC0gNTApKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbi55ID0gTWF0aC5tYXgoMCwgcG9zaXRpb24ueSAtIDUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGVwQnVzaChwb3NpdGlvbi54LCBwb3NpdGlvbi55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZFBva2Vtb24ocG9rZW1vbl9hcnJheSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjcnVzaC5zdHlsZS5vcGFjaXR5ID0gJzAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3ByaXRlLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoMCUsIC01MCUpYFxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxvd1Bvc2l0aW9uKHBvc2l0aW9uLngsIE1hdGgubWluKChNQVBfUk9XIC0gMykgKiA1MCwgcG9zaXRpb24ueSArIDUwKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ueSA9IE1hdGgubWluKChNQVBfUk9XIC0gMykgKiA1MCwgcG9zaXRpb24ueSArIDUwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGVwQnVzaChwb3NpdGlvbi54LCBwb3NpdGlvbi55KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZFBva2Vtb24ocG9rZW1vbl9hcnJheSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjcnVzaC5zdHlsZS5vcGFjaXR5ID0gJzAnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3ByaXRlLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoMCUsIDApYFxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJGNoYXJhY3Rlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7cG9zaXRpb24ueH0lLCAke3Bvc2l0aW9uLnl9JSlgXG4gICAgICAgICAgICAgICAgJGNydXNoLnN0eWxlLnRyYW5zZm9ybSAgICAgPSBgdHJhbnNsYXRlKCR7cG9zaXRpb24ueCAqIDJ9JSwgJHtwb3NpdGlvbi55ICogMn0lKWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgc2V0VGltZW91dCgoKSA9PlxuICAgIHtcbiAgICAgICAgcmVzaXplSW1hZ2Uod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCwgc2V0T2ZmZXRzZXQpXG4gICAgfSwgMjUwKVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+XG4gICAge1xuICAgICAgICB3aW5kb3dXaWR0aCAgPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgICB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICAgcmVzaXplSW1hZ2Uod2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCwgc2V0T2ZmZXRzZXQpXG4gICAgfSlcbn0iXX0=
