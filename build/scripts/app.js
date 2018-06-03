const $containerMap = document.querySelector('.container.container-map')
const $form         = document.querySelector('form')
const $pokemon      = $form.querySelector('input[name="pokemon"]')
const $positionX    = $form.querySelector('input[name="positionX"]')
const $positionY    = $form.querySelector('input[name="positionY"]')
const $submit       = $form.querySelector('input[type="submit"]')
if ($containerMap)
{
    const $top       = $containerMap.querySelector('.top')
    const $right     = $containerMap.querySelector('.right')
    const $bottom    = $containerMap.querySelector('.bottom')
    const $left      = $containerMap.querySelector('.left')
    const $map       = $containerMap.querySelector('.map')
    const $character = $containerMap.querySelector('.character')
    const $sprite    = $character.querySelector('.sprite')
    const position   = {x: parseInt($positionX.value), y: parseInt($positionY.value)}
    const tileSize   = {x: 0, y: 0}
    const SPAWN_RATE = 0.25
    const MAP_ROW    = 12
    const MAP_COL    = 15
    const MAP_RATIO  = MAP_COL / MAP_ROW
    const forbidden  =
    [
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
    const bushes =
    [
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
    let canSubmit    = false
    
    $form.addEventListener('submit', (event) =>
    {
        if (!canSubmit)
            event.preventDefault()
    })
    
    const setImageSize= (left, top, width, height, transform) =>
    {
        $map.style.left      = left
        $map.style.top       = top
        $map.style.width     = width
        $map.style.height    = height
        $map.style.transform = transform
        $map.style.zIndex    = '2'
    }
    
    const resizeImage = (windowWidth, windowHeight, callback) =>
    {
        if (windowWidth / windowHeight <= MAP_RATIO)
        {
            setImageSize('0', '50%', '100%', 'auto', 'translateY(-50%)')
            $top.style.zIndex    = '1'
            $right.style.zIndex  = '0'
            $bottom.style.zIndex = '1'
            $left.style.zIndex   = '0'
        }
        else
        {
            setImageSize('50%', '0', 'auto', '100%', 'translateX(-50%)')
            $top.style.zIndex    = '0'
            $right.style.zIndex  = '1'
            $bottom.style.zIndex = '0'
            $left.style.zIndex   = '1'
        }
        callback()
    }
    
    const setOffetset = () =>
    {
        const topOffset   = $map.getBoundingClientRect().top
        const leftOffset  = $map.getBoundingClientRect().left
        $top.style.bottom = `${topOffset}px`
        $right.style.left = `${leftOffset}px`
        $bottom.style.top = `${topOffset}px`
        $left.style.right = `${leftOffset}px`
        tileSize.x = $map.getBoundingClientRect().width  / MAP_COL
        tileSize.y = $map.getBoundingClientRect().height / MAP_ROW
        $character.style.left      = `${leftOffset - tileSize.x / 2}px`
        $character.style.top       = `${topOffset}px`
        $character.style.width     = `${tileSize.x * 2}px`
        $character.style.height    = `${tileSize.y * 2}px`
        $character.style.transform = `translate(${position.x}%, ${position.y}%)`
        $sprite.style.width        = `300%`
        $sprite.style.height       = `400%`
    }
    
    const allowPosition = (positionX, positionY) =>
    {
        for (const forbiddenPosition of forbidden)
            if (forbiddenPosition.x == positionX && forbiddenPosition.y == positionY)
                return false
        return true
    }
    
    const stepBush = (positionX, positionY) =>
    {
        for (const bush of bushes)
            if (bush.x == positionX && bush.y == positionY)
            {
                return true
            }
        return false
    }
    
    const loadJSON = (callback) =>
    {
        const xobj = new XMLHttpRequest()
        xobj.overrideMimeType('application/json')
        xobj.open('GET', './database/pokedex.json', true)
        xobj.onreadystatechange = () =>
        {
            if (xobj.readyState == 4 && xobj.status == '200')
            {
                callback(xobj.responseText)
            }
        }
        xobj.send(null)
    }
    
    const loadPokemon = (array) =>
    {
        if (Math.random() - SPAWN_RATE < 0)
        {
            const pokemonNumber = Math.floor(Math.random() * 151)
            const pokemonSpawn  = array[pokemonNumber].spawn_chance
            const pokemonChance = Math.random() - pokemonSpawn
            const isSpawning    = pokemonChance < 0 ? true : false
            if (isSpawning)
            {
                canSubmit        = true
                $pokemon.value   = pokemonNumber
                $positionX.value = position.x
                $positionY.value = position.y
                $submit.click()
            }
        }
    }
    
    loadJSON((response) =>
    {
        const JSON_file     = JSON.parse(response)
        const pokemon_array = JSON_file.pokemon
    
        window.addEventListener('keydown', (event) =>
        {
            switch (event.keyCode)
            {
                case 37:
                    if (allowPosition(Math.max(0, position.x - 50), position.y))
                    {
                        position.x = Math.max(0, position.x - 50)
                        if (stepBush(position.x, position.y))
                            loadPokemon(pokemon_array)
                    }
                    $sprite.style.transform = `translate(0%, -25%)`
                    break
                case 39:
                    if (allowPosition(Math.min((MAP_COL - 1) * 50, position.x + 50), position.y))
                    {
                        position.x = Math.min((MAP_COL - 1) * 50, position.x + 50)
                        if (stepBush(position.x, position.y))
                            loadPokemon(pokemon_array)
                    }
                        $sprite.style.transform = `translate(0%, -75%)`
                    break
                case 38:
                    if (allowPosition(position.x, Math.max(0, position.y - 50)))
                    {
                        position.y = Math.max(0, position.y - 50)
                        if (stepBush(position.x, position.y))
                            loadPokemon(pokemon_array)
                    }
                    $sprite.style.transform = `translate(0%, -50%)`
                    break
                case 40:
                    if (allowPosition(position.x, Math.min((MAP_ROW - 3) * 50, position.y + 50)))
                    {
                        position.y = Math.min((MAP_ROW - 3) * 50, position.y + 50)
                        if (stepBush(position.x, position.y))
                            loadPokemon(pokemon_array)
                    }
                    $sprite.style.transform = `translate(0%, 0)`
                    break
            }
            $character.style.transform = `translate(${position.x}%, ${position.y}%)`
        })
    })
    
    resizeImage(windowWidth, windowHeight, setOffetset)
    setTimeout(() =>
    {
        resizeImage(windowWidth, windowHeight, setOffetset)
    }, 250)
    
    window.addEventListener('resize', () =>
    {
        windowWidth  = window.innerWidth
        windowHeight = window.innerHeight
        resizeImage(windowWidth, windowHeight, setOffetset)
    })
}

const $return = document.querySelector('.return')
if ($return)
{
    $return.addEventListener('click', () =>
    {
        $submit.click()
    })
}