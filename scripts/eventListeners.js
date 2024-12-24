function setEventListeners() {
    setEnterKeyListenerForElement('name', addName)
    setEnterKeyListenerForElement('who-pay-who-cost', whoPayWhoAddLog)
}

function setEnterKeyListenerForElement(elemId, fn) {
    let domElement = document.getElementById(elemId)
    domElement.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {
            fn()
        }
    })
}