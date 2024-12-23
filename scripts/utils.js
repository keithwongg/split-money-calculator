/*
    UTILS
*/
function getFromLocalStorage(key) {
    return localStorage.getItem(key) ?? undefined
}

function saveInLocalStorage(key, content) {
    localStorage.setItem(key, JSON.stringify(content))
}

function clearAll() {
    localStorage.removeItem(NAMES_KEY)
    localStorage.removeItem(ITEMS_KEY)
    location.reload()
}