/*
    UI Components
*/
function namePillButtonCreate(content) {
    let del = delButtonForNamesList(content)
    let pill = pillButtonComponentCreate(content, del)
    return pill
}

function whoToSplitWithPillButtonCreate(content) {
    let del = delButtonForWhoToSplitWith(content)
    let pill = pillButtonComponentCreate(content, del)
    return pill
}

function createDelButton() {
    let del = document.createElement('button')
    del.innerHTML = 'X'
    del.classList.add('rounded-md', 'bg-red-100', 'px-2', 'ml-2')
    return del
}

function delButtonForNamesList(content) {
    let del = createDelButton()
    del.onclick = function () {
        removeName(content)
        renderNamesInUi()
    }
    return del
}

function delButtonForWhoToSplitWith(content) {
    let del = createDelButton()
    del.onclick = function () {
        let container = document.getElementById('inputSplitWith')
        container.childNodes.forEach((node) => {
            if (node.value === content) {
                node.remove()
            }
        })
    }
    return del
}

function delButtonForItemLogs(id) {
    let del = createDelButton()
    del.onclick = function () {
        removeItem(id)
        renderLogsInUi()
    }
    return del
}

function pillButtonComponentCreate(content, delButton) {
    let pill = document.createElement('button')
    pill.value = content
    pill.innerHTML = content
    pill.classList.add('rounded-md', 'bg-slate-100', 'mb-2', 'px-2', 'flex')
    pill.appendChild(delButton)
    return pill
}

