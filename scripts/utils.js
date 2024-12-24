/*
    UTILS
*/
function getFromLocalStorage(key) {
    return localStorage.getItem(key) ?? undefined
}

function getFromLocalStorageAsArray(key) {
    let itemsArr = getFromLocalStorage(key)
    if (itemsArr === undefined) {
        itemsArr = []
    } else {
        itemsArr = JSON.parse(itemsArr)
    }
    return itemsArr
}

function getIndexOfPersonByName(name) {
    let namesArr = getFromLocalStorageAsArray(NAMES_KEY)
    return namesArr.indexOf(name)
}

function saveInLocalStorage(key, content) {
    localStorage.setItem(key, JSON.stringify(content))
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

function clearAll() {
    localStorage.removeItem(NAMES_KEY)
    localStorage.removeItem(ITEMS_KEY)
    localStorage.removeItem(P2P_KEY)
    location.reload()
}

function roundToTwoDp(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function formatToShow2dpInUi(num) {
    return roundToTwoDp(num).toLocaleString("en-US", {maximumFractionDigits: 2, minimumFractionDigits: 2})
}