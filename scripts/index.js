const NAMES_KEY = "names";
const ITEMS_KEY = "items";
const P2P_KEY = "p2p";
const ADJMATRIX_KEY = "adjmatrix"; // this holds 2 matrix, for the balances


window.onload = function (e) {
    renderNamesInUi()
    renderItemLogsInUi()
    renderP2PLogsInUi()
    renderSummary()
}

function addName() {
    var name = document.getElementById('name')
    if (name.value.length <= 0) {
        return;
    }
    saveName(name.value)
    renderNamesInUi()
    name.value = ''
}

/*
    NAMES
*/
function saveName(name) {
    let names = getFromLocalStorage(NAMES_KEY)
    if (names === undefined) {
        saveInLocalStorage(NAMES_KEY, [name])
        return
    }
    let namesArray = JSON.parse(names)
    namesArray.push(name)
    let uniqueNames = [...new Set(namesArray)]
    saveInLocalStorage(NAMES_KEY, uniqueNames)
}

function removeName(name) {
    let names = getFromLocalStorage(NAMES_KEY)
    if (names === undefined) {
        return;
    }
    let namesArray = JSON.parse(names)
    let index = namesArray.indexOf(name)
    if (index > -1) {
        namesArray.splice(index, 1)
    }
    saveInLocalStorage(NAMES_KEY, namesArray)
    return namesArray
}

/*
    ITEMS and COSTS
*/
function splitWithAll() {
    if (getFromLocalStorage(NAMES_KEY) === undefined) {
        return
    }
    let names = JSON.parse(getFromLocalStorage(NAMES_KEY))
    renderListOfWhoToSplitWith(names)
}

function addWhoPaidForItemsLog() {
    let whoPaid = document.getElementById('opts-who-paid')
    let description = document.getElementById('item-description')
    let cost = document.getElementById('item-cost')
    let names = getWhoToSplitNamesFromUi()

    let itemsArr = getFromLocalStorageAsArray(ITEMS_KEY)
    let item = {
        id: itemsArr.length + 1,
        description: description.value,
        cost: roundToTwoDp(cost.value),
        cost_per_pax: roundToTwoDp(cost.value/names.length),
        who_paid: whoPaid.value,
        to_receive_from: names
    }
    itemsArr.push(item)
    saveInLocalStorage(ITEMS_KEY, itemsArr)
    renderItemLogsInUi()
    renderSummary()
}

function getWhoToSplitNamesFromUi() {
    let container = document.getElementById('inputSplitWith')
    let buttonNames = container.childNodes
    let names = []
    buttonNames.forEach((name) => {
        names.push(name.value)
    })
    return names
}

/*
    Who Paid Who?
*/

function whoPayWhoAddLog() {
    let payee = document.getElementById('opts-person-paying')
    let recipient = document.getElementById('opts-person-receiving')
    let cost = document.getElementById('who-pay-who-cost')

    if (payee.value === recipient.value) {
        showErrorForSeconds('error-who-paid-who', 5)
        return
    }

    let p2pData = getFromLocalStorageAsArray(P2P_KEY)
    let item = {
        id: p2pData.length + 1,
        payee: payee.value,
        recipient: recipient.value,
        cost: roundToTwoDp(cost.value)
    }
    p2pData.push(item)
    saveInLocalStorage(P2P_KEY, p2pData)
    renderP2PLogsInUi()
    renderSummary()
}

/*
    Adjacency Matrix - For Summary
*/
function createAdjMatrix() {
    let namesArr = getFromLocalStorageAsArray(NAMES_KEY)
    // 0: x owes y, 1: y owes x
    let adjMatrixes = []
    for(let i = 0; i < namesArr.length; i++) {
        adjMatrixes.push(Array(namesArr.length).fill(0))
    }
    saveInLocalStorage(ADJMATRIX_KEY, adjMatrixes)
}

function addItemCostsToAdjMatrix() {
    let itemsArr = getFromLocalStorageAsArray(ITEMS_KEY)
    let adjMatrix = getFromLocalStorageAsArray(ADJMATRIX_KEY)
    for(let i = 0; i < itemsArr.length; i++) {
        let idxPersonToReceive = getIndexOfPersonByName(itemsArr[i].who_paid)
        if (idxPersonToReceive === -1) {
            console.log('something wrong')
            return
        }
        let peopleToReceiveFrom = itemsArr[i].to_receive_from
        for (let j = 0; j < peopleToReceiveFrom.length; j++) {
            let idxPersonOwe = getIndexOfPersonByName(peopleToReceiveFrom[j])
            if (idxPersonOwe === idxPersonToReceive) { // skip if owing and paying person is the same
                continue
            }
            adjMatrix[idxPersonOwe][idxPersonToReceive] += itemsArr[i].cost_per_pax
        }
    }
    saveInLocalStorage(ADJMATRIX_KEY, adjMatrix)
}

function addP2PDataToAdjMatrix() {
    let p2pData = getFromLocalStorageAsArray(P2P_KEY)
    let adjMatrix = getFromLocalStorageAsArray(ADJMATRIX_KEY)
    for(let i = 0; i < p2pData.length; i++) {
        let idxPersonWhoOwe = getIndexOfPersonByName(p2pData[i].payee)
        let idxPersonToReceive = getIndexOfPersonByName(p2pData[i].recipient)
        if (idxPersonWhoOwe === -1 || idxPersonToReceive === -1) {
            console.log('something wrong')
            return
        }
        adjMatrix[idxPersonWhoOwe][idxPersonToReceive] -= p2pData[i].cost
    }
    saveInLocalStorage(ADJMATRIX_KEY, adjMatrix)
}


