
'use strict'

const MINES = '💣'
const FLAG = '🚩'
const EMPTY = ''
const SMILEY = `<img src="img/smiley.png">`
const EXPLODE_SMILEY = `<img src="img/smiley_explode.png">`
const SUNGLASSES_SMILEY = `<img src="img/smiley_glasses.png">`

var gBoard
var gGameInterval

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,

}

function onInit() {
    clearInterval(gGameInterval)
    gGame.isOn = true
    gGame.secsPassed = 0
    gGame.markedCount = 0
    gBoard = buildBoard()
    renderBoard(gBoard)
    gGame.lives = 3
    renderLives()

    document.querySelector('.board')
        .addEventListener('contextmenu', (e) => {
            e.preventDefault()
        })
    const elTime = document.querySelector('span.time')
    elTime.innerHTML = '000'
    handleSmiley(SMILEY)
    hideModal()

}

function onClickLevel(level, mines) {

    gLevel = {
        size: level,
        mines: mines,
    }

    const elTime = document.querySelector('span.time')
    elTime.innerHTML = '000'
    const elMine = document.querySelector('span.mine')
    elMine.innerText = gLevel.mines

    onInit()

}

function buildBoard() {
    const board = []
    var copyBoard = []

    for (var i = 0; i < gLevel.size; i++) {
        board.push([])

        for (var j = 0; j < gLevel.size; j++) {
            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }

            board[i][j] = cell
        }
    }
    copyBoard = board.slice()

    // board[0][0].isMine = true
    // board[0][1].isMine = true

    addMines(copyBoard)


    return board
}

function addMines(board) {
    var minesToAdd = gLevel.mines
    while (minesToAdd > 0) {
        var row = Math.floor(Math.random() * gLevel.size)
        var col = Math.floor(Math.random() * gLevel.size)
        if (!board[row][col].isMine) {
            board[row][col].isMine = true
            minesToAdd--
        }
    }
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = cell.isShown ? 'is-shown' : 'close'

            strHTML += `<td class="${className} cell-${i}-${j}" onclick="onCellClicked(this, ${i}, ${j})" 
            oncontextmenu="return onCellMarked(this, ${i}, ${j})">`

        }
        strHTML += '</td>'
        strHTML += '</tr>'
    }
    renderLives()

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {

    if (!gGame.isOn) return

    clearInterval(gGameInterval)
    gGameInterval = setInterval(timeStart, 1000)

    const cell = gBoard[i][j]

    elCell.classList.add('is-shown')
    cell.isShown = true
    gGame.shownCount++

    if (cell.isMine) {
        elCell.style.backgroundColor = 'red'
        elCell.innerHTML = MINES
        gGame.lives--
        renderLives()
        handleSmiley(EXPLODE_SMILEY)
    } else {

        handleSmiley(SMILEY)
    }

    expandShown(gBoard, i, j)
    gameOver()
    checkGameOver()
}

function onCellMarked(elCell, i, j) {
    if (!gGame.isOn) return
    const cell = gBoard[i][j]
    gGame.markedCount++
    if (gGame.markedCount > gLevel.mines || cell.isShown) return

    cell.isMarked = true
    elCell.innerHTML = FLAG
    checkGameOver()

}

function checkGameOver() {

    var allMinesMarked = true
    var allNonMineCellsShown = true

    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            const cell = gBoard[i][j]
            if (cell.isMine && !cell.isMarked) {
                allMinesMarked = false
            }
            if (!cell.isMine && !cell.isShown) {
                allNonMineCellsShown = false
            }
        }
    }

    if (allMinesMarked === true && allNonMineCellsShown === true) {

        handleSmiley(SUNGLASSES_SMILEY)
        clearInterval(gGameInterval)
        showModal('You Won !')
        gGame.isOn = false

    }


}

function gameOver() {
    if (gGame.lives === 0) {
        clearInterval(gGameInterval)
        gGame.isOn = false
        showModal('You Lost !')
    }

    return
}

function setMinesNegsCount(board, celI, celJ) {

    var countMinesNegs = 0

    for (var i = celI - 1; i <= celI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = celJ - 1; j <= celJ + 1; j++) {
            if (i === celI && j === celJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine) countMinesNegs++
        }
    }
    return countMinesNegs

}

function timeStart() {
    const elTime = document.querySelector('.time')
    gGame.secsPassed++
    elTime.innerHTML = gGame.secsPassed.toString().padStart(3, '0')

    if (!gGame.isOn) {
        clearInterval(gGameInterval)
        gGame.secsPassed = 0
        elTime.innerHTML = '000'
    }

}



function expandShown(board, cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue

            const elCell = document.querySelector(`.cell-${i}-${j}`)

            const cell = board[i][j]
            if (!cell.isShown && !cell.isMine) {
                cell.isShown = true
                gGame.shownCount++
                elCell.classList.add('is-shown')

                const minesCount = setMinesNegsCount(board, i, j)
                if (minesCount > 0) {
                    elCell.innerText = minesCount
                } else {
                    elCell.innerText = EMPTY
                }

                if (minesCount < 1 && !cell.isMine) {
                    expandShown(board, i, j)
                } else if (minesCount > 0) {
                    elCell.innerText = minesCount
                }
            }
        }
    }
}

function renderLives() {

    const elLives = document.querySelector('span.lives')
    elLives.innerHTML = ''

    for (var i = 0; i < gGame.lives; i++) {
        elLives.innerHTML += `<img src="img/heart.png">`
    }

}

function handleSmiley(smiley) {

    const elSmiley = document.querySelector('.smiley')
    elSmiley.innerHTML = smiley
}


function showModal(result) {

    const elModal = document.querySelector('.modal')
    elModal.classList.remove('hide')
    const elH3 = document.querySelector('h3.game-result')
    elH3.innerText = result
}

function hideModal() {

    const elModal = document.querySelector('.modal')
    elModal.classList.add('hide')
}