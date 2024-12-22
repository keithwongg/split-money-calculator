const NAMES_KEY = "names";
const ITEMS_KEY = "items";
/*
schema:

names: ["person 1", "person 2"]

items: [{
    description: "item1",
    cost: "20",
    who_paid: "person 1",
    to_receive_from: ["person 1", "person 2"]
}]

summary: {
    "person 1" : balance
    "person 2" : balance
}
*/

window.onload = function (e) {
    renderNamesInUi()
}

function addName() {
    var name = document.getElementById('name')
    if (name.value.length <= 0) {
        return;
    }
    saveName(name.value)
    renderNamesInUi()
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
    saveInLocalStorage(NAMES_KEY, namesArray)
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

function renderNamesInUi() {
    if (getFromLocalStorage(NAMES_KEY) === undefined) {
        return
    }
    let names = JSON.parse(getFromLocalStorage(NAMES_KEY))
    console.log(`monkey: ${names}`)
    renderListOfNames(names)
    renderDropdownOptions(names)
}

function renderListOfNames(names) {
    var listOfNames = document.getElementById('names-list-text')
    listOfNames.innerHTML = ''
    for(let i = 0; i < names.length; i++) {
        listOfNames.appendChild(namePillButtonCreate(names[i]))
    }
}

function namePillButtonCreate(content) {
        let pill = document.createElement('button')
        pill.value = content
        pill.innerHTML = content
        pill.classList.add('rounded-md', 'bg-blue-100', 'mb-2', 'px-2', 'flex')

        let del = document.createElement('button')
        del.innerHTML = 'X'
        del.classList.add('rounded-md', 'bg-red-100', 'px-2', 'ml-2')
        del.onclick = function () {
            removeName(content)
            renderNamesInUi()
        }

        pill.appendChild(del)
        return pill
}

function renderDropdownOptions(names) {
    var dropdownList = document.getElementById('opts-name')
    dropdownList.innerHTML = ''
    for (let i = 0; i < names.length; i++) {
        console.log(names[i])
        var option = document.createElement('option')
        option.value = names[i]
        option.text = names[i]
        dropdownList.appendChild(option)
    }
}

function getFromLocalStorage(key) {
    return localStorage.getItem(key) ?? undefined
}

function saveInLocalStorage(key, content) {
    localStorage.setItem(key, JSON.stringify(content))
}

function addItemsAndCost() {
    var dropdownName = document.getElementById('opts-name')
    var item = document.getElementById('item')
    var cost = document.getElementById('cost')
    addToData(dropdownName.value, item.value, cost.value)
    renderLog(dropdownName.value, item.value, cost.value)
    calculateCosts()
}

function addToData(name, itemDesc, cost) {
    let dataObj = Object.fromEntries(DATA)
    dataObj[name].items.push({description: itemDesc, cost: cost})
    saveInLocalStorage(DATA_KEY, dataObj)
}

function renderLog(name, item, cost) {
    var logTable = document.getElementById('logs')
    var tr = document.createElement('tr')

    var tdName = document.createElement('td')
    tdName.innerText = name
    tr.appendChild(tdName)

    var tdItem = document.createElement('td')
    tdItem.innerText = item
    tr.appendChild(tdItem)

    var tdCost = document.createElement('td')
    tdCost.innerText = cost
    tr.appendChild(tdCost)

    logTable.appendChild(tr)
}

function clearAll() {
    localStorage.removeItem(NAMES_KEY)
    location.reload()
}

function calculateCosts() {
    for(let item in DATA) {
        console.log(item.key, JSON.stringify(item.value))
    }
}