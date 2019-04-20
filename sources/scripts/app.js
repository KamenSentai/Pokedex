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
  const $top        = $containerMap.querySelector('.top')
  const $right      = $containerMap.querySelector('.right')
  const $bottom     = $containerMap.querySelector('.bottom')
  const $left       = $containerMap.querySelector('.left')
  const $map        = $containerMap.querySelector('.map')
  const $character  = $containerMap.querySelector('.character')
  const $crush      = $containerMap.querySelector('.crush')
  const $sprite     = $character.querySelector('.sprite')
  const $pokedex    = $containerMap.querySelector('.pokedex')
  const $rectangles = $containerMap.querySelector('.rectangles')

  // Define valuesw
  const position    = {x: parseInt($character.dataset.positionx * 10), y: parseInt($character.dataset.positiony * 10)}
  const tileSize    = {x: 0, y: 0}
  const SPAW_RATE   = 25
  const MAP_ROW     = 12
  const MAP_COL     = 15
  const MAP_RATIO   = MAP_COL / MAP_ROW
  const forbidden   = [
    {x: 0, y: 0},
    {x: 0, y: 50},
    {x: 0, y: 100},
    {x: 0, y: 150},
    {x: 0, y: 200},
    {x: 0, y: 250},
    {x: 0, y: 350},
    {x: 0, y: 400},
    {x: 0, y: 450},
    {x: 50, y: 0},
    {x: 650, y: 0},
    {x: 700, y: 0},
    {x: 700, y: 50},
    {x: 700, y: 100},
    {x: 700, y: 200},
    {x: 700, y: 250},
    {x: 700, y: 300},
    {x: 700, y: 350},
    {x: 700, y: 400},
    {x: 700, y: 450},
  ]
  const bushes = [
    {x: 150, y: 0},
    {x: 200, y: 0},
    {x: 300, y: 0},
    {x: 350, y: 0},
    {x: 450, y: 0},
    {x: 500, y: 0},
    {x: 200, y: 50},
    {x: 250, y: 50},
    {x: 300, y: 50},
    {x: 350, y: 50},
    {x: 400, y: 50},
    {x: 500, y: 50},
    {x: 550, y: 50},
    {x: 150, y: 100},
    {x: 200, y: 100},
    {x: 300, y: 100},
    {x: 400, y: 100},
    {x: 450, y: 100},
    {x: 550, y: 100},
    {x: 150, y: 150},
    {x: 200, y: 150},
    {x: 250, y: 150},
    {x: 300, y: 150},
    {x: 350, y: 150},
    {x: 400, y: 150},
    {x: 450, y: 150},
    {x: 500, y: 150},
    {x: 550, y: 150},
    {x: 600, y: 150},
    {x: 100, y: 200},
    {x: 200, y: 200},
    {x: 300, y: 200},
    {x: 400, y: 200},
    {x: 500, y: 200},
    {x: 550, y: 200},
    {x: 600, y: 200},
    {x: 100, y: 250},
    {x: 150, y: 250},
    {x: 200, y: 250},
    {x: 250, y: 250},
    {x: 300, y: 250},
    {x: 350, y: 250},
    {x: 400, y: 250},
    {x: 450, y: 250},
    {x: 550, y: 250},
    {x: 150, y: 300},
    {x: 250, y: 300},
    {x: 350, y: 300},
    {x: 400, y: 300},
    {x: 500, y: 300},
    {x: 600, y: 300},
    {x: 100, y: 350},
    {x: 200, y: 350},
    {x: 250, y: 350},
    {x: 300, y: 350},
    {x: 400, y: 350},
    {x: 450, y: 350},
    {x: 500, y: 350},
    {x: 550, y: 350},
    {x: 600, y: 350},
    {x: 250, y: 400},
    {x: 350, y: 400},
    {x: 400, y: 400},
    {x: 550, y: 400},
    {x: 300, y: 450}
  ]
  let windowWidth  = window.innerWidth
  let windowHeight = window.innerHeight
  let canWalk      = true

  // Set size to map
  const setImageSize= (left, top, width, height, transform) => {
    $map.style.left      = left
    $map.style.top       = top
    $map.style.width     = width
    $map.style.height    = height
    $map.style.transform = transform
  }

  // Resize images
  const resizeImage = (windowWidth, windowHeight, callback) => {
    // Check if landscape or portrait
    if (windowWidth / windowHeight <= MAP_RATIO) {
      setImageSize('0', '50%', '100%', 'auto', 'translateY(-50%)')
      $top.style.zIndex    = '1'
      $right.style.zIndex  = '0'
      $bottom.style.zIndex = '1'
      $left.style.zIndex   = '0'
    } else {
      setImageSize('50%', '0', 'auto', '100%', 'translateX(-50%)')
      $top.style.zIndex    = '0'
      $right.style.zIndex  = '1'
      $bottom.style.zIndex = '0'
      $left.style.zIndex   = '1'
    }
    callback()
  }

  // Set style to elements
  const setStyles = () => {
    const topOffset            = $map.getBoundingClientRect().top
    const leftOffset           = $map.getBoundingClientRect().left
    const widthOffset          = $map.getBoundingClientRect().width
    const heightOffset         = $map.getBoundingClientRect().height
    $top.style.bottom          = `${topOffset}px`
    $right.style.left          = `${leftOffset}px`
    $bottom.style.top          = `${topOffset}px`
    $left.style.right          = `${leftOffset}px`
    tileSize.x                 = widthOffset  / MAP_COL
    tileSize.y                 = heightOffset / MAP_ROW
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
    const pokemonIndex  = Math.floor(Math.random() * 151)
    const pokemonSpawn  = array[pokemonIndex].spawn_chance
    const pokemonChance = Math.random() * SPAW_RATE - pokemonSpawn
    const isSpawned     = pokemonChance < 0 ? true : false

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
    resizeImage(windowWidth, windowHeight, setStyles)
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
  const CATCH_RATE    = 75

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
                const pokemonChance = Math.random() * CATCH_RATE - pokemonCatch
                const isCaught      = pokemonChance < 0 ? true : false

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
