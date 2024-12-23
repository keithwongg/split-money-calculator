/*
    UI Rendering
*/
function renderNamesInUi() {
    if (getFromLocalStorage(NAMES_KEY) === undefined) {
        return
    }
    let names = JSON.parse(getFromLocalStorage(NAMES_KEY))
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

function renderListOfWhoToSplitWith(names) {
    var listOfNames = document.getElementById('inputSplitWith')
    listOfNames.innerHTML = ''
    for(let i = 0; i < names.length; i++) {
        listOfNames.appendChild(whoToSplitWithPillButtonCreate(names[i]))
    }
}

function renderDropdownOptions(names) {
    var dropdownList = document.getElementById('opts-who-paid')
    dropdownList.innerHTML = ''
    for (let i = 0; i < names.length; i++) {
        console.log(names[i])
        var option = document.createElement('option')
        option.value = names[i]
        option.text = names[i]
        dropdownList.appendChild(option)
    }
}

function renderLogsInUi() {
    if (getFromLocalStorage(ITEMS_KEY) === undefined) {
        return
    }
    let items = JSON.parse(getFromLocalStorage(ITEMS_KEY))
    sortItemsByWhoPaid(items)

    let table = document.getElementById('log-items')
    table.innerHTML = ''
    for(let i = 0; i < items.length; i++) {
        let entryRow = document.createElement('tr')

        let whoPaid = document.createElement('td')
        whoPaid.innerText = items[i].who_paid
        entryRow.appendChild(whoPaid)

        let itemDescription = document.createElement('td')
        itemDescription.innerText = items[i].description
        entryRow.appendChild(itemDescription)

        let cost = document.createElement('td')
        cost.innerText = items[i].cost
        entryRow.appendChild(cost)

        let splitWith = document.createElement('td')
        splitWith.innerText = items[i].to_receive_from
        entryRow.appendChild(splitWith)

        table.appendChild(entryRow)
    }
}

function sortItemsByWhoPaid(items) {
    items.sort(function(a, b) {
        if (a.who_paid < b.who_paid) {
            return -1
        }
        if (a.who_paid > b.who_paid) {
            return 1
        }
        return 0
    })
}
