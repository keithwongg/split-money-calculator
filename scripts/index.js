const NAMES_KEY = "names";
const ITEMS_KEY = "items";
const BALANCE_KEY = "balance"; // this is the oweing balance
const P2P_KEY = "p2p";

/*
schema:

names: ["person 1", "person 2"]

items: [{
    description: "item1",
    cost: "20",
    who_paid: "person 1",
    to_receive_from: ["person 1", "person 2"]
}]

p2p: [{
    payee: "person 1",
    recipient: "person 2",
    cost: "10"
}]

figure represents oweing
owe_balance: [{
    "person 1" : {
        "person 2": 0,
        "person 3": 0
    },
    "person 2" : {
        "person 1": 30,
        "person 4": 0
    }
}]

counter: 0
person 1 - person 2: 0
person 2 - person 1: -3)

how to know balance of person 1:
store person1's data that he owe to ppl:
for each person that is not person1 data, owe to person 1, + $$ to person1 r/s

final result as shown for person1
*/

window.onload = function (e) {
    renderNamesInUi()
    createBalanceObj()
    calculateBalance()
    renderLogsInUi()
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
    createBalanceObj()
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
        cost: cost.value,
        cost_per_pax: roundToTwoDp(cost.value/names.length),
        who_paid: whoPaid.value,
        to_receive_from: names
    }
    itemsArr.push(item)

    saveInLocalStorage(ITEMS_KEY, itemsArr)

    createBalanceObj()
    calculateBalance()
    // renderWhoOweWhoLogsInUi()

    renderLogsInUi()
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

function removeItemFromStorageById(id, key) {
    let items = getFromLocalStorage(key)
    if (items === undefined) {
        return;
    }
    let itemsArray = JSON.parse(items)
    for (let i = 0; i < itemsArray.length; i++) {
        if (itemsArray[i].id === id) {
            itemsArray.splice(i, 1)
        }
    }
    saveInLocalStorage(key, itemsArray)
    return itemsArray
}

/*
    Balance?
*/
function calculateBalance() {
    let itemsArr = getFromLocalStorageAsArray(ITEMS_KEY)
    let p2pArr = getFromLocalStorageAsArray(P2P_KEY)
    let balanceArr = getFromLocalStorageAsArray(BALANCE_KEY)
    if (balanceArr.length <= 0) {
        return
    }

    // who owe who
    for(let i = 0; i < itemsArr.length; i++) {
        let personToReceive = itemsArr[i].who_paid
        let peopleWhoOwe = itemsArr[i].to_receive_from
        // console.log(`people: ${personToReceive} ${peopleWhoOwe}`)

        // for every person who owe, search for the balance arr, 
        // find the r/s then add the amount
        for (let j = 0; j < peopleWhoOwe.length; j++) {
            balanceArr.forEach((bal) => {
                let valueExist = bal[peopleWhoOwe[j]]
                let oweAndPayNotTheSamePerson = personToReceive !== peopleWhoOwe[j]
                if (valueExist && oweAndPayNotTheSamePerson) {
                    bal[peopleWhoOwe[j]][personToReceive] = roundToTwoDp(bal[peopleWhoOwe[j]][personToReceive] + itemsArr[i].cost_per_pax)
                }
                // console.log(`${JSON.stringify(bal)}`)
            })
        }
    }

    // who paid who
    for(let ii = 0; ii < p2pArr.length; ii++) {
        let personToReceive = p2pArr[ii].recipient
        let peopleWhoOwe = p2pArr[ii].payee
        balanceArr.forEach((bal) => {
            let valueExist = bal[peopleWhoOwe]
            let oweAndPayNotTheSamePerson = personToReceive !== peopleWhoOwe
            if (valueExist && oweAndPayNotTheSamePerson) {
                bal[peopleWhoOwe][personToReceive] = roundToTwoDp(bal[peopleWhoOwe][personToReceive] - p2pArr[ii].cost)
            }
            // console.log(`${JSON.stringify(bal)}`)
        })
    }

    saveInLocalStorage(BALANCE_KEY, balanceArr)
}

// establish the Payee Recipient Relationship
function createBalanceObj() {
    let namesArr = getFromLocalStorageAsArray(NAMES_KEY)
    let overall = []
    for(let i = 0; i < namesArr.length; i++) {
        let pMap = {}
        for(let j = 0; j < namesArr.length; j++) {
            if (namesArr[j] === namesArr[i]) {
                continue
            }
            pMap[namesArr[j]] = 0
        }
        let obj = {}
        obj[namesArr[i]] = pMap
        overall.push(obj)
    }
    saveInLocalStorage(BALANCE_KEY, overall)
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
        cost: cost.value
    }
    p2pData.push(item)
    saveInLocalStorage(P2P_KEY, p2pData)
    renderP2PLogsInUi()

    createBalanceObj()
    calculateBalance()
    renderSummary()
}

function renderSummary() {
    let namesArr = getFromLocalStorageAsArray(NAMES_KEY)
    let balanceArr = getFromLocalStorageAsArray(BALANCE_KEY)
    let pTagsToAdd = []

    for (let i = 0; i < namesArr.length; i++) {
        // iterate through all the balances and get all the data
        let personToFocusOn = namesArr[i]
        // console.log(`persontofocuson: ${personToFocusOn}`)
        for (let j = 0; j < balanceArr.length; j++) {
            if (balanceArr[j][personToFocusOn]) {
                let owingToPeople = balanceArr[j][personToFocusOn]
                // console.log(`monkeyowing: ${JSON.stringify(owingToPeople)}`)

                // show owing money
                for (const [key, value] of Object.entries(owingToPeople)) {
                    if (value !== 0) {
                        pTagsToAdd.push(createPTag(`${personToFocusOn} Owes ${key} $${value}`))
                    }
                }
            }
        }
    }

    if (pTagsToAdd.length <= 0) {
        addPTagsToSummary([createPTag("All Settled Up! No Balance Remaining")])
    } else {
        addPTagsToSummary(pTagsToAdd)
    }
}

function createPTag(text) {
    let pTag = document.createElement('p')
    pTag.innerText = text
    return pTag
}

function addPTagsToSummary(pTags) {
    let summary = document.getElementById('balance-description')
    summary.innerHTML = ''
    for(let i = 0; i < pTags.length; i++) {
        summary.appendChild(pTags[i])
    }
}