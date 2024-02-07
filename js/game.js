
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


document.querySelector('.board')
    .addEventListener('contextmenu', (e) => {
        e.preventDefault()
        console.log("🖱 right click detected!")
    })

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
                isMarked: false,
            }

            board[i][j] = cell


        }
    }
    board[1][2].isMine = true
    board[2][3].isMine = true

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

            strHTML += `<td class="${className} cell-${i}-${j}" onclick="onCellClicked(this, ${i}, ${j})" 
            oncontextmenu="return onCellMarked(this, ${i}, ${j})">`

            // if (cell.isMine) strHTML += MINES
            // if (cell.isShown && !cell.isMine) {
            //     strHTML += cell.minesAroundCount = setMinesNegsCount(board, i, j)
            // }

            document.querySelectorAll('td').forEach(cell => {
                cell.addEventListener('click', evt => {
                    console.log('The element that was clicked was ', evt.target);
                });
            });


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

function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    if(cell.isMarked) return
    elCell.classList.add('is-shown')
    cell.isShown = true
    gGame.shownCount++
    console.log(gGame.shownCount)
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
    // if () return

    cell.isMarked = true
    gGame.markedCount++
    elCell.innerHTML = FLAG
    
    console.log('cell cliked',elCell);

}



function expandShown(board,  cellI, cellJ){
    // console.log('elcell:',elCell);
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue

            // Model
            // gBoard[i][j] = EMPTY

            // // DOM
        
            // elCell.classList.add('is-shown')


            const elCell = document.querySelector(`.cell-${i}-${j}`);
            // if (!elCell) continue

            const cell = board[i][j];
            if (!cell.isShown) {
                cell.isShown = true;
                gGame.shownCount++;
                elCell.classList.add('is-shown');
                elCell.innerText    = setMinesNegsCount(gBoard, i, j)

                if (cell.minesAroundCount === 0) {
                



        }
    }
}
    }
}