const NAMES_KEY = "names";
var DATA = new Map();

window.onload = function (e) {
    renderDataInUi()
}

function addName() {
    var name = document.getElementById('name')
    if (name.value.length <= 0) {
        return;
    }
    DATA.set(name.value, {})
    name.value = ''

    let names = renderDataInUi()
    console.log(`monkey: ${names}`)
    resaveInLocalStorage(NAMES_KEY, names)
}

function renderDataInUi() {
    var names = getListOfNames()
    renderListOfNames(names)
    renderDropdownOptions(names)
    return names
}

function getListOfNames() {
    let names = Array.from(DATA.keys())
    console.log(names)
    if (names.length <= 0) {
        names = JSON.parse(localStorage.getItem(NAMES_KEY))
    }
    return names
}

function renderListOfNames(names) {
    var listOfNames = document.getElementById('names-list-text')
    // this part need to add pill button for each name with the x to drop the name
    listOfNames.innerHTML = `List of Names: ${names}`
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

function resaveInLocalStorage(key, content) {
    localStorage.removeItem(key)
    localStorage.setItem(key, JSON.stringify(content))
}

function addItemsAndCost() {
    var dropdownName = document.getElementById('opts-name')
    var item = document.getElementById('item')
    var cost = document.getElementById('cost')
    renderLog(dropdownName.value, item.value, cost.value)
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


function calculateCosts() {

}

function clearAll() {
    localStorage.removeItem(NAMES_KEY)
    location.reload()
}