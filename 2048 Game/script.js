function createBoard(){
    let grid = document.querySelector('.grid')
    for (let i = 0; i < 16; i++){
        let div = document.createElement('div')
        div.setAttribute("id",`id_${i}`)
        div.textContent = 0
        grid.appendChild(div)
    }
}
createBoard()

function generate(){
    let optionArray = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4]
    let allBlocks = document.querySelectorAll('.grid > div') // NodeList, can't directly apply filter

    let emptyBlocks = Array.from(allBlocks).filter((a) => a.textContent == 0)
    if (emptyBlocks.length == 0){
        return
    }
    let randomNumber = optionArray[Math.floor((Math.random() * 10))] // a value between 0 and 9
    let randomBlock = emptyBlocks[Math.floor((Math.random() * emptyBlocks.length))] // select a random empty block
    randomBlock.textContent = randomNumber
}

let totalScore = 0

function shiftArrayLeft(valueArray){
    let finalArray = valueArray.filter((a) => a != 0)
    let index = finalArray.length
    while (index < 4){
        finalArray.push(0)
        index++
    }
    return finalArray
}

function combineArrayLeft(valueArray){
    let index = 1
    while (index < 4){
        if (valueArray[index] == valueArray[index - 1]){
            valueArray[index - 1] = valueArray[index] * 2
            totalScore += (valueArray[index] * 2)
            document.querySelector("#score").textContent = totalScore
            valueArray[index] = 0
        }
        index++
    }
    return valueArray
}

function shiftArrayRight(valueArray){
    let finalArray = valueArray.filter((a) => a != 0)
    let index = finalArray.length
    while (index < 4){
        finalArray.unshift(0)
        index++
    }
    return finalArray
}

function combineArrayRight(valueArray){
    let index = valueArray.length - 1
    while (index > 0){
        if (valueArray[index] == valueArray[index - 1]){
            totalScore += (valueArray[index] * 2)
            document.querySelector("#score").textContent = totalScore
            valueArray[index] = valueArray[index] * 2
            valueArray[index - 1] = 0
        }
        index--;
    }
    return valueArray
}
function getRowValues(rowNumber){
    let rowValues = []
    for (let i = 4 * (rowNumber - 1); i < 4 * rowNumber; i++){
        rowValues.push(Number(document.querySelector(`#id_${i}`).textContent))
    }
    return rowValues
}
function moveRow(rowNumber, direction){
    let rowValues = getRowValues(rowNumber)
    if (direction == 'L'){
        rowValues = shiftArrayLeft(rowValues)
        rowValues = combineArrayLeft(rowValues)
        rowValues = shiftArrayLeft(rowValues)

    }
    if (direction == 'R'){
        rowValues = shiftArrayRight(rowValues)
        rowValues = combineArrayRight(rowValues)
        rowValues = shiftArrayRight(rowValues)
    }
    for (let i = 4 * (rowNumber - 1); i < 4 * rowNumber; i++){
        document.querySelector(`#id_${i}`).textContent = rowValues[i % 4]
    }
}

function moveLeft(){
    for (let i of [1, 2, 3, 4]){
        moveRow(i, 'L')
    }
}

function moveRight(){
    for (let i of [1, 2, 3, 4]){
        moveRow(i, 'R')
    }
}

function getColumnValues(colNumber){
    let colValues = []
    for (let i = colNumber - 1; i < 16; i+= 4){
        colValues.push(Number(document.querySelector(`#id_${i}`).textContent))
    }
    return colValues
}
function moveColumn(colNumber, direction){
    let colValues = getColumnValues(colNumber)
    if (direction == 'U'){
        colValues = shiftArrayLeft(colValues)
        colValues = combineArrayLeft(colValues)
        colValues = shiftArrayLeft(colValues)
    }
    if (direction == 'D'){
        colValues = shiftArrayRight(colValues)
        colValues = combineArrayRight(colValues)
        colValues = shiftArrayRight(colValues)
    }
    let counter = 0
    for (let i = colNumber - 1; i < 16; i+= 4){
        document.querySelector(`#id_${i}`).textContent = colValues[counter]
        counter++
    }
}

function moveUp(){
    for (let i of [1, 2, 3, 4]){
        moveColumn(i, 'U')
    }
}

function moveDown(){
    for (let i of [1, 2, 3, 4]){
        moveColumn(i, 'D')
    }
}

function keyupHandler(event){
    switch(event.keyCode){
        case 37:
            moveLeft()
            break;
        case 38:
            moveUp()
            break;
        case 39:
            moveRight()
            break;
        case 40:
            moveDown()
            break;
    }
    generate()
    if (checkForWin()){
        document.body.removeEventListener('keyup', keyupHandler);
        const resultElement = document.querySelector('#result');
        resultElement.textContent = "YOU WIN!";
        resultElement.classList.add('win');
    }
    else if (isGameOver()){
        document.body.removeEventListener('keyup', keyupHandler);
        const resultElement = document.querySelector('#result');
        resultElement.innerText = "Game Over";
        resultElement.classList.add('over');
    }
}
document.body.addEventListener('keyup', keyupHandler);

function checkAdjacent(values){
    let index = values.length - 1
    while (index > 0) {
        if (values[index] === values[index - 1]) {
            return true
        }
        index--;
    }
    return false
}
function isGameOver(){
    let allBlocks = document.querySelectorAll('.grid > div')
    let emptyBlocks = Array.from(allBlocks).filter((a) => a.textContent == 0)
    if (emptyBlocks.length != 0){
        return false
    }
    for (let rowNumber of [1, 2, 3, 4]){
        let rowValues = []
        for (let i = 4 * (rowNumber - 1); i < 4 * rowNumber; i++){
            rowValues.push(Number(document.querySelector(`#id_${i}`).textContent))
            if (rowValues.length > 1 && (rowValues[i % 4] == rowValues[i % 4 - 1])){
                return false
            }
        }
    }
    for (let colNumber of [1, 2, 3, 4]){
        let colValues = []
        let count = 0
        for (let i = (colNumber - 1); i < 16; i+=4){
            colValues.push(Number(document.querySelector(`#id_${i}`).textContent))
            if (colValues.length > 1 && (colValues[count] == colValues[count - 1])){
                return false
            }
        count++
        }
    }
    return true
}
function checkForWin(){
    let allBlocks = document.querySelectorAll('.grid > div')
    let winningBlocks = Array.from(allBlocks).filter((a) => a.textContent == 2048)
    return winningBlocks.length != 0
}
document.querySelector('#restart-button').addEventListener('click', () => {
    document.querySelector('.grid').innerHTML = ''
    totalScore = 0
    document.querySelector("#score").textContent = totalScore
    document.querySelector('#result').innerText = "Join the numbers and get to the 2048 tile!"
    createBoard()
    generate()
    generate()
    document.body.addEventListener('keyup', keyupHandler);
})