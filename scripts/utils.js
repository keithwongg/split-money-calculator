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

function saveInLocalStorage(key, content) {
    localStorage.setItem(key, JSON.stringify(content))
}

function clearAll() {
    localStorage.removeItem(NAMES_KEY)
    localStorage.removeItem(ITEMS_KEY)
    localStorage.removeItem(BALANCE_KEY)
    localStorage.removeItem(P2P_KEY)
    location.reload()
}

function roundToTwoDp(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}
