const NAMES_KEY = "names";
const ITEMS_KEY = "items";
const BALANCE_KEY = "balance";

/*
schema:

names: ["person 1", "person 2"]

items: [{
    description: "item1",
    cost: "20",
    who_paid: "person 1",
    to_receive_from: ["person 1", "person 2"]
}]

balance: [{
    "person 1" : {
        "person 2": 30,
        "person 2": 20
    }
    to_receive: 50
}]
*/

window.onload = function (e) {
    renderNamesInUi()
    renderLogsInUi()
    // render balance in ui??
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

    let itemsArr = getFromLocalStorage(ITEMS_KEY)
    if (itemsArr === undefined) {
        itemsArr = []
    } else {
        itemsArr = JSON.parse(itemsArr)
    }
    let item = {
        id: itemsArr.length + 1,
        description: description.value,
        cost: cost.value,
        who_paid: whoPaid.value,
        to_receive_from: names
    }
    itemsArr.push(item)

    saveInLocalStorage(ITEMS_KEY, itemsArr)
    saveInLocalStorage(BALANCE_KEY, itemsArr)

    // render logs in UI
    renderLogsInUi()

    // tally balance
    // tallyBalance()

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

function removeItem(id) {
    let items = getFromLocalStorage(ITEMS_KEY)
    if (items === undefined) {
        return;
    }
    let itemsArray = JSON.parse(items)
    for (let i = 0; i < itemsArray.length; i++) {
        if (itemsArray[i].id === id) {
            itemsArray.splice(i, 1)
        }
    }
    saveInLocalStorage(ITEMS_KEY, itemsArray)
    return itemsArray
}

function tallyBalance() {
    // calculationlogic
    if (getFromLocalStorage(BALANCE_KEY) === undefined) {
        return
    }
    let items = JSON.parse(getFromLocalStorage(BALANCE_KEY))
    let dictBalance = {}
    for (let i = 0; i < items.length; i++) {
        if (dictBalance[items.who_paid] === undefined) {
            dictBalance[items.who_paid] = {
                to_receive: items.cost,
                to_receive_from: items.to_receive_from
            }
        } else {
            dictBalance[items.who_paid] += items.cost
        }
    }
    // render in UI
    let balanceDiv = document.getElementById('balance-description')
    dictBalance.forEach((key, value) => {
        console.log(`moneeky: key ${key} value ${value}`)
    })
}

