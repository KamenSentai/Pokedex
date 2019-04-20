import { forbidden, bushes } from './store/positions'
import { SPAW_RATE, MAP_ROW, MAP_COL, MAP_RATIO } from './store/map'

// Load JSON file
const loadJSON = (file, callback) => {
  const xobj = new XMLHttpRequest()
  xobj.overrideMimeType('application/json')
  xobj.open('GET', `./assets/data/${file}.json`, true)
  xobj.onreadystatechange = () => {
    if (xobj.readyState == 4 && xobj.status == '200')
      callback(xobj.responseText)
  }
  xobj.send(null)
}

// Get container
const $containerMap   = document.querySelector('.container.container-map')
const $containerCatch = document.querySelector('.container.container-catch')
const $audio          = document.querySelector('audio')

if ($containerMap) {
  //Get elements
  const $horizontal = $containerMap.querySelector('.horizontal')
  const $vertical   = $containerMap.querySelector('.vertical')
  const $character  = $containerMap.querySelector('.character')
  const $crush      = $containerMap.querySelector('.crush')
  const $sprite     = $character.querySelector('.sprite')
  const $pokedex    = $containerMap.querySelector('.pokedex')
  const $rectangles = $containerMap.querySelector('.rectangles')

  // Define valuesw
  const position    = {x: parseInt($character.dataset.positionx * 10), y: parseInt($character.dataset.positiony * 10)}
  const tileSize    = {x: 0, y: 0}

  let windowWidth  = window.innerWidth
  let windowHeight = window.innerHeight
  let canWalk      = true

  // Resize images
  const resizeImage = (windowWidth, windowHeight, callback) => {
    // Check if landscape or portrait
    if (windowWidth / windowHeight <= MAP_RATIO) {
      $horizontal.style.display = 'none'
      $vertical.style.display   = 'block'
    } else {
      $horizontal.style.display = 'block'
      $vertical.style.display   = 'none'
    }
    callback()
  }

  // Set style to elements
  const setStyles = () => {
    const realSize             = windowWidth / windowHeight <= MAP_RATIO ? windowWidth : windowHeight
    tileSize.x                 = realSize == windowWidth ? realSize / MAP_COL : realSize / MAP_ROW
    tileSize.y                 = realSize == windowHeight ? realSize / MAP_ROW : realSize / MAP_COL
    const leftOffset           = (windowWidth - tileSize.x * MAP_COL) / 2
    const topOffset            = (windowHeight - tileSize.y * MAP_ROW) / 2
    $character.style.left      = `${leftOffset - tileSize.x / 2}px`
    $character.style.top       = `${topOffset}px`
    $character.style.width     = `${tileSize.x * 2}px`
    $character.style.height    = `${tileSize.y * 2}px`
    $character.style.transform = `translate(${position.x}%, ${position.y}%)`
    $sprite.style.width        = `300%`
    $sprite.style.height       = `400%`
    $crush.style.left          = `${leftOffset}px`
    $crush.style.top           = `${topOffset + tileSize.y}px`
    $crush.style.width         = `${tileSize.x}px`
    $crush.style.height        = `${tileSize.y}px`
    $pokedex.style.bottom      = `${tileSize.y}px`
  }

  // Check if nex position of character is allowed
  const allowPosition = (positionX, positionY) => {
    for (const forbiddenPosition of forbidden)
      if (forbiddenPosition.x == positionX && forbiddenPosition.y == positionY)
        return false
    return true
  }

  // Check if walking on bush
  const stepBush = (positionX, positionY) => {
    for (const bush of bushes)
      if (bush.x == positionX && bush.y == positionY)
        return true
    return false
  }

  // Load pokemon
  const loadPokemon = (array) => {
    $crush.style.opacity = '1'
    const pokemonIndex = Math.floor(Math.random() * 151)
    const pokemonSpawn = array[pokemonIndex].spawn_chance
    const isSpawned    = Math.random() * SPAW_RATE < pokemonSpawn ? true : false

    // Check if pokemon is spawned
    if (isSpawned) {
      // Forbid to walk
      canWalk = false

      // Send data
      const xhr = new XMLHttpRequest()
      xhr.open('POST', './')
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      xhr.send(encodeURI(`action=catch&pokemon_index=${pokemonIndex}&position_x=${position.x / 10}&position_y=${position.y / 10}`))

      // Listen to request done
      xhr.onload = () => {
        // Add rectangles
        $rectangles.classList.add('active')

        // Load new page
        setTimeout(() => {
          window.location.href = './catch'
        }, 2000)
      }
    }
  }

  // Load pokedx data
  loadJSON('pokedex', (response) => {
    // Parse data
    const JSON_file = JSON.parse(response)
    const pokemons  = JSON_file.pokemons

    // Listen to keydown
    window.addEventListener('keydown', (event) => {
      // Check if character can walk
      if (canWalk) {
        switch (event.keyCode) {
          case 37:
            if (allowPosition(Math.max(0, position.x - 50), position.y)) {
              position.x = Math.max(0, position.x - 50)
              if (stepBush(position.x, position.y))
                loadPokemon(pokemons)
              else
                $crush.style.opacity = '0'
            }
            $sprite.style.transform = `translate(0%, -25%)`
            break
          case 39:
            if (allowPosition(Math.min((MAP_COL - 1) * 50, position.x + 50), position.y)) {
              position.x = Math.min((MAP_COL - 1) * 50, position.x + 50)
              if (stepBush(position.x, position.y))
                loadPokemon(pokemons)
              else
                $crush.style.opacity = '0'
            }
            $sprite.style.transform = `translate(0%, -75%)`
            break
          case 38:
            if (allowPosition(position.x, Math.max(0, position.y - 50))) {
              position.y = Math.max(0, position.y - 50)
              if (stepBush(position.x, position.y))
                loadPokemon(pokemons)
              else
                $crush.style.opacity = '0'
            }
            $sprite.style.transform = `translate(0%, -50%)`
            break
          case 40:
            if (allowPosition(position.x, Math.min((MAP_ROW - 3) * 50, position.y + 50))) {
              position.y = Math.min((MAP_ROW - 3) * 50, position.y + 50)
              if (stepBush(position.x, position.y))
                loadPokemon(pokemons)
              else
                $crush.style.opacity = '0'
            }
            $sprite.style.transform = `translate(0%, 0)`
            break
        }
        // Update position
        $character.style.transform = `translate(${position.x}%, ${position.y}%)`
        $crush.style.transform     = `translate(${position.x * 2}%, ${position.y * 2}%)`
      }
    })
  })

  // Initialize map size
  setTimeout(() => {
    resizeImage(windowWidth, windowHeight, setStyles) -
    document.body.classList.remove('fade')
  }, 250)

  // Listen to resize
  window.addEventListener('resize', () => {
    windowWidth  = window.innerWidth
    windowHeight = window.innerHeight
    resizeImage(windowWidth, windowHeight, setStyles)
  })
} else if ($containerCatch) {
  // Get elements
  const $rectangles   = $containerCatch.querySelector('.rectangles')
  const $title        = $containerCatch.querySelector('h1')
  const $appears      = $title.querySelector('.appears')
  const $caught       = $title.querySelector('.caught')
  const $escaped      = $title.querySelector('.escaped')
  const $appearance   = $containerCatch.querySelector('.appearance')
  const $illustration = $containerCatch.querySelector('.illustration')
  const $button       = $containerCatch.querySelector('.button')
  const $tool         = $button.querySelector('.tool')

  // Load pokedex data
  loadJSON('pokedex', (response) => {
    // Parse data
    const JSON_file    = JSON.parse(response)
    const pokemons     = JSON_file.pokemons
    const pokemonName  = $appearance.getAttribute('alt')
    const pokemon      = pokemons.find(pokemon => pokemon.name == pokemonName)
    const pokemonIndex = pokemons.indexOf(pokemon)
    const pokemonCatch = pokemon.catch_chance

    // Remove rectangles
    setTimeout(() => {
      $rectangles.classList.remove('active')

      // Display elements
      setTimeout(() => {
        $title.classList.add('active')
        $appearance.classList.add('active')
        $illustration.classList.add('active')

        // Display button
        setTimeout(() => {
          $tool.classList.add('active')
          $containerCatch.removeChild($rectangles)
          $button.addEventListener('click', (event) => {
            event.preventDefault()
            $tool.classList.add('thrown')

            // Throw pokeball
            setTimeout(() => {
              $appearance.classList.add('caught')

              // Catch pokemon
              setTimeout(() => {
                $appears.style.display = 'none'
                const isCaught = Math.random() * 100 < pokemonCatch ? true : false

                // Check if pokemon is caught
                if (isCaught) {
                  // Update
                  $caught.style.display = 'block'

                  // Send data
                  const xhr = new XMLHttpRequest()
                  xhr.open('POST', './')
                  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
                  xhr.send(encodeURI(`action=caught&pokemon_index=${pokemonIndex}`))
                  xhr.onload = () => {
                    setTimeout(() => {
                      document.body.classList.add('fade')
                      setTimeout(() => {
                        window.location.href = './'
                      }, 1250)
                    }, 1250)
                  }
                } else {
                  // Update
                  $escaped.style.display = 'block'
                  $appearance.classList.remove('caught')

                  // Set pokemon escaping
                  setTimeout(() => {
                    $appearance.classList.remove('active')

                    // Fadeout window
                    setTimeout(() => {
                      document.body.classList.add('fade')

                      // Redirect to map page
                      setTimeout(() => {
                        window.location.href = './'
                      }, 1250)
                    }, 1250)
                  }, 2000)
                }
              }, 5000)
            }, 1250)
          })
        }, 1000)
      }, 1000)
    }, 250)
  })
} else if ($audio) {
  const $button = document.querySelector('.sheet-button')
  $button.addEventListener('click', () => {
    $audio.play()
  })
}

// Remove empty columns
const $sheetCols = document.querySelectorAll('.sheet-col')
if ($sheetCols.length > 0)
  for (const $sheetCol of $sheetCols)
    if ($sheetCol.childElementCount == 0)
      $sheetCol.parentNode.removeChild($sheetCol)
