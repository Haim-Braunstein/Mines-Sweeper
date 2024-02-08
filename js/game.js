
'use strict'

const MINES = '💣'
const FLAG = '🚩'
const EMPTY = ''

var gBoard

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,

}
var gGameInterval

document.querySelector('.board')
    .addEventListener('contextmenu', (e) => {
        e.preventDefault()
        console.log("🖱 right click detected!")
    })

function onInit() {
    gGame.secsPassed = 0
    clearInterval(gGame.secsPassed)
    gBoard = buildBoard()
    renderBoard(gBoard)

}

function onClickLevel(level, mines) {

    gLevel = {
        size: level,
        mines: mines,
    }
    onInit()

}

function buildBoard() {
    const board = []

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
            getRandomInt()

        }
    }
    board[1][2].isMine = true
    board[2][3].isMine = true

    // addMines(board)

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
            // const className = `cell cell-${i}-${j}`
            const className = cell.isShown ? 'is-shown' : 'close'

            strHTML += `<td class="${className} cell-${i}-${j}" onclick="onCellClicked(this, ${i}, ${j})" 
            oncontextmenu="return onCellMarked(this, ${i}, ${j})">`

            // if (cell.isMine) strHTML += MINES
            // if (cell.isShown && !cell.isMine) {
            //     strHTML += cell.minesAroundCount = setMinesNegsCount(board, i, j)
            // }



        }
        strHTML += '</td>'
        strHTML += '</tr>'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function checkGameOver() {

    const allCellsShown = (gGame.shownCount +gLevel.mines === gLevel.size**2)

    if (gLevel.mines === 0 && )
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
}

function onCellClicked(elCell, i, j) {
    // addMines(gBoard)
    clearInterval(gGameInterval)
    gGameInterval = setInterval(timeStart, 1000)

    const cell = gBoard[i][j]
    if (cell.isMarked) return
    elCell.classList.add('is-shown')
    cell.isShown = true
    gGame.shownCount++
    //   cell.minesAroundCount= setMinesNegsCount(gBoard, i, j)

    if (cell.isMine) {
        elCell.style.backgroundColor = 'red'
        elCell.innerHTML = MINES
        playSound()
    }

    if (!cell.isMine) elCell.innerText = cell.minesAroundCount = setMinesNegsCount(gBoard, i, j)

    expandShown(gBoard, i, j)
}


function onCellMarked(elCell, i, j) {
    const cell = gBoard[i][j]


    if (gGame.markedCount === gLevel.mines || cell.isShown) return
    if (cell.isMarked && cell.isMine) gLevel.mines--
    console.log(gLevel.mines);
    cell.isMarked = true
    gGame.markedCount++
    elCell.innerHTML = FLAG

}

function expandShown(board, cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue

            const elCell = document.querySelector(`.cell-${i}-${j}`)

            const cell = board[i][j];
            if (!cell.isShown) {
                cell.isShown = true
                gGame.shownCount++
                elCell.classList.add('is-shown')
                elCell.innerText = setMinesNegsCount(gBoard, i, j)

                // if (cell.minesAroundCount === 0) {
                //     expandShown(board, i, j);
                // } else {
                //     elCell.innerText = cell.minesAroundCount;
                // }
            }
        }
    }
}
