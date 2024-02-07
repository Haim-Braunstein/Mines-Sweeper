
'use strict'

const MINES = '💣'
const FLAG = '🚩'
const EMPTY = ''

var gBoard

var gLevel = {
    size: 4,
    mines: 2,

}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,

}


function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)

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
                isMarked: true
            }

            board[i][j] = cell

            // if (i === 0 || i === gGame.level - 1 ||
            //     j === 0 || j === gGame.level - 1 ||
            //     (j === 3 && i > 4 && i < gGame.level - 2)) {
            //     board[i][j] = WALL
            //     gGame.foodCount--
            //     console.log(foodCount);

            // }

        }
    }
    board[1][2].isMine = true
    board[2][3].isMine = true
    board[2][2].isShown = true

    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            // const className = `cell cell-${i}-${j}`
            const className = cell.isShown ? 'is-shown' : 'close'

            strHTML += `<td class="${className} cell-${i}-${j}">`

            if (cell.isMine) strHTML += MINES
            if (cell.isShown && !cell.isMine) {
                strHTML += cell.minesAroundCount = setMinesNegsCount(board, i, j)
            }
        }
        strHTML += '</td>'
        strHTML += '</tr>'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML


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


