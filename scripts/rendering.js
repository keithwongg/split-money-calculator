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
    renderListOfWhoToSplitWith(names)
}

function renderListOfNames(names) {
    let listOfNames = document.getElementById('names-list-text')
    listOfNames.innerHTML = ''
    for(let i = 0; i < names.length; i++) {
        listOfNames.appendChild(namePillButtonCreate(names[i]))
    }
    let count = document.getElementById('names-count')
    count.innerText = `(${names.length})  `
}

function renderListOfWhoToSplitWith(names) {
    var listOfNames = document.getElementById('inputSplitWith')
    listOfNames.innerHTML = ''
    for(let i = 0; i < names.length; i++) {
        listOfNames.appendChild(whoToSplitWithPillButtonCreate(names[i]))
    }
}

function renderDropdownOptions(names) {
    var whoPaidDropdown = document.getElementById('opts-who-paid')
    var personPayingDropdown = document.getElementById('opts-person-paying')
    var personReceivingDropdown = document.getElementById('opts-person-receiving')
    whoPaidDropdown.innerHTML = ''
    personPayingDropdown.innerHTML = ''
    personReceivingDropdown.innerHTML = ''
    for (let i = 0; i < names.length; i++) {
        var option = document.createElement('option')
        option.value = names[i]
        option.text = names[i]
        whoPaidDropdown.appendChild(option)
        personPayingDropdown.appendChild(option.cloneNode(true))
        personReceivingDropdown.appendChild(option.cloneNode(true))
    }
}

function renderItemLogsInUi() {
    if (getFromLocalStorage(ITEMS_KEY) === undefined) {
        return
    }
    let items = JSON.parse(getFromLocalStorage(ITEMS_KEY))
    sortItemsById(items)

    let cardContainer = document.getElementById('logs-card-container')
    cardContainer.innerHTML = ''
    for(let i = 0; i < items.length; i++) {
        let card = document.createElement('div')
        card.classList.add("p-2", "flex", "items-center", "justify-between", "w-full", "h-full", "border-2", "border-black","rounded-md","shadow-sm", "bg-slate-50")
        let cardHtml = `
        <div class="flex-col flex-wrap">
            <div class="font-bold">${items[i].description}</div>
            <div>Paid By: ${items[i].who_paid}</div>
            <div>Total Cost: $${items[i].cost}</div>
            <div class="font-bold">Cost Per Pax: $${items[i].cost_per_pax}</div>
            <div>Split Between: ${items[i].to_receive_from}</div>
        </div>
        `
        card.innerHTML += cardHtml
        let delButton = delButtonForItemLogs(items[i].id)
        card.appendChild(delButton)
        cardContainer.appendChild(card)
    }
}

function renderP2PLogsInUi() {
    if (getFromLocalStorage(P2P_KEY) === undefined) {
        return
    }
    let items = JSON.parse(getFromLocalStorage(P2P_KEY))
    // sortItemsById(items)

    let table = document.getElementById('p2p-trf')
    table.innerHTML = ''
    for(let i = 0; i < items.length; i++) {
        let entryRow = document.createElement('tr')
        entryRow.value = i

        let payee = document.createElement('td')
        payee.innerText = items[i].payee
        entryRow.appendChild(payee)

        let recipient = document.createElement('td')
        recipient.innerText = items[i].recipient
        entryRow.appendChild(recipient)

        let cost = document.createElement('td')
        cost.innerText = items[i].cost
        entryRow.appendChild(cost)

        let delButton = delButtonForP2PLogs(items[i].id)
        entryRow.appendChild(delButton)

        table.appendChild(entryRow)
    }
}

function renderSummary() {
    createAdjMatrix()
    addItemCostsToAdjMatrix()
    addP2PDataToAdjMatrix()

    let itemsLength = getFromLocalStorageAsArray(ITEMS_KEY).length
    let p2pLength = getFromLocalStorageAsArray(ITEMS_KEY).length
    let namesArr = getFromLocalStorageAsArray(NAMES_KEY)
    let adjMatrix = getFromLocalStorageAsArray(ADJMATRIX_KEY)
    let pTagsToAdd = []

    let incompleteProgress = itemsLength === 0 ||
        p2pLength === 0 ||
        namesArr.length === 0 ||
        adjMatrix.length === 0

    let settledUpDict = {}
    for (let i = 0; i < namesArr.length; i++) {
        settledUpDict[namesArr[i]] = (incompleteProgress) ? 0 : 1 // default to false
        let br = document.createElement('br')
        pTagsToAdd.push(br)
        for (let j = 0; j < namesArr.length; j++) {
            if (i === j) { // avoid if same person
                continue
            }

            let owingValue = adjMatrix[i][j]
            let receivingValue = adjMatrix[j][i]

            /*
             2D Matrix of possibilities:
                    o
                  |      +           |        -        |
             r  + | owe +, receive + | owe -, receive +|
                - | owe +, receive - | owe -, receive -|
            */
            if (owingValue === receivingValue) {
                continue
            }
            settledUpDict[namesArr[i]] = 0

            // o+r+
            if (owingValue >= 0 && receivingValue >= 0) {
                if (owingValue > receivingValue) {
                    pTagsToAdd.push(createPTag(`${namesArr[i]} owes ${namesArr[j]} $${formatToShow2dpInUi(owingValue - receivingValue)}`))
                } else if (receivingValue > owingValue) {
                    pTagsToAdd.push(createPTag(`${namesArr[i]} to receive $${formatToShow2dpInUi(receivingValue - owingValue)} from ${namesArr[j]}`))
                }
                continue
            }

            // o+r-
            if (owingValue >= 0 && receivingValue < 0) {
                let valueAfterContra = Math.abs(receivingValue - owingValue)
                pTagsToAdd.push(createPTag(`${namesArr[i]} owes ${namesArr[j]} $${formatToShow2dpInUi(valueAfterContra)}`))
                continue
            }

            // o-r+
            if (owingValue < 0 && receivingValue >= 0) {
                pTagsToAdd.push(createPTag(`${namesArr[i]} overpaid ${namesArr[j]} $${formatToShow2dpInUi(Math.abs(owingValue))}`))
                continue
            }

            // o-r-
            if (receivingValue < 0 && owingValue < 0) {
                if (receivingValue < owingValue) {
                    let valueAfterContra = Math.abs(receivingValue - owingValue)
                    pTagsToAdd.push(createPTag(`${namesArr[i]} owes ${namesArr[j]} $${formatToShow2dpInUi(Math.abs(valueAfterContra))}`))
                } else if (owingValue > receivingValue) {
                    let valueAfterContra = Math.abs(owingValue - receivingValue)
                    pTagsToAdd.push(createPTag(`${namesArr[i]} overpaid ${namesArr[j]} $${formatToShow2dpInUi(Math.abs(valueAfterContra))}`))
                }
                continue
            }
        }
    }

    let allSettledUp = true
    console.log(`settledupdict: ${JSON.stringify(settledUpDict)}`)
    for (const [key, value] of Object.entries(settledUpDict)) {
        if (value === 1) {
            pTagsToAdd.push(createPTag(`${key} is all settled up!`))
        } else {
            allSettledUp = false
        }
    }

    if (allSettledUp && !incompleteProgress) {
        addPTagsToSummary([createPTag("All Settled Up! No Balance Remaining")])
        showHappyCat(true)
        return
    }

    showHappyCat(false)
    addPTagsToSummary(pTagsToAdd)
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

function showHappyCat(show) {
    // just for the lols
    let cat = document.getElementById('happy-cat')
    if (show) {
        cat.classList.remove('hidden')
        return
    }
    cat.classList.add('hidden')
}

/*
    Others
*/
function showErrorForSeconds(domId, seconds){
    let alert = document.getElementById(domId)
    alert.classList.remove('hidden')
    setTimeout(() => {
        alert.classList.add('hidden')
    }, (seconds * 1000))
}