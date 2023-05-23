function createActionHTML(name, type, category, description) {
    return `
    <div class="action">
        <div class="action__name">
            <span class="action__title">${name}</span>
            <img class="action__type" src="img/${type == "Light" ? "LA" : "HA"}.png"></img>
            <div class="button button__small"><span>+</span></div>
        </div>
        <span class="action__category">${category}</span>
        <span class="action__description">${description}</span>
    </div>
    `;
}

// restrict actions to the current class
async function loadActions(name) {
    let actionsJSON = await fetch("./data/actions.json");
    actionsJSON = await actionsJSON.json();
    console.log(actionsJSON);

    let actionList = document.querySelector(".action-list");
    actionList.innerHTML = ``;
    for (let actionName in actionsJSON) {
        let action = actionsJSON[actionName];
        if (action["users"].toLowerCase().includes(name)) {
            let html = createActionHTML(actionName, action["type"], action["category"], action["description"]);
            actionList.insertAdjacentHTML("beforeend", html);
        }
    }

    for (let element of actionList.querySelectorAll(".action")) {
        element.addEventListener("click", (e) => useAction(e.target));
    }

    for (let element of actionList.querySelectorAll(".button")) {
        element.addEventListener("click", (e) => addAction(e.target));
    }

    loadActionsFromLocal();
}

function loadActionsFromLocal() {
    let actionNames = [];
    for (let val in window.localStorage) {
        if (val.includes("SRR")) {
            actionNames.push(val.split("-")[1]);
        }
    }

    for (let action of document.querySelectorAll(".action")) {
        if (actionNames.includes(action.querySelector(".action__title").innerText)) {
            action.querySelector(".button").click();
        }
    }
}

function useAction(actionHTML) {
    while (!actionHTML.classList.contains("action")) {
        if (actionHTML.classList.contains("button")) {
            return;
        }
        actionHTML = actionHTML.parentElement;
    }

    let actionType = null;
    if (actionHTML.querySelector(".action__type").src.includes("LA.png")) {
        actionType = "LA";
    } else {
        actionType = "HA";
    }

    for (let actionIcon of document.querySelectorAll(".action-icon")) {
        if (actionIcon.classList.contains("action-icon__rested")) {
            continue;
        }
        // has to use the actions in order; can't use a HA when the next action is a LA
        if ((actionIcon.src.includes("LA.png") && actionType == "LA") || (actionIcon.src.includes("HA.png") && actionType == "HA")) {
            toggleAction(actionIcon);
        }
        break;
    }
}

function addAction(actionHTML) {
    while (!actionHTML.classList.contains("action")) {
        actionHTML = actionHTML.parentElement;
    }

    let myActions = document.querySelectorAll(".action-list")[1]
    myActions.appendChild(actionHTML);

    actionHTML.querySelector(".button").removeEventListener("click", addAction);
    actionHTML.querySelector(".button").addEventListener("click", (e) => removeAction(actionHTML));
    actionHTML.querySelector(".button").querySelector("span").innerText = "-";

    saveActionToLocal(actionHTML.querySelector(".action__title").innerText);
}

function removeAction(actionHTML) {
    while (!actionHTML.classList.contains("action")) {
        actionHTML = actionHTML.parentElement;
    }

    let allActions = document.querySelector(".action-list");
    allActions.appendChild(actionHTML);

    actionHTML.querySelector(".button").removeEventListener("click", removeAction);
    actionHTML.querySelector(".button").addEventListener("click", (e) => addAction(actionHTML));
    actionHTML.querySelector(".button").querySelector("span").innerText = "+";

    removeActionFromLocal(actionHTML.querySelector(".action__title").innerText);
}


function createActionIconHTML(type) {
    return `<img class="action-icon" src="img/${type == "Light" ? "LA" : "HA"}.png">`;
}

let classJSON = null;
let classes = [];
function changeClass(name) {
    let actions = classJSON[name].split("");
    let actionBar = document.querySelector("#action-bar")
    actionBar.innerHTML = '';
    for (let action of actions) {
        if (action == "L") {
            actionBar.insertAdjacentHTML("beforeend", createActionIconHTML("Light"));
        } else {
            actionBar.insertAdjacentHTML("beforeend", createActionIconHTML("Heavy"));
        }
    }

    for (let element of document.querySelectorAll(".action-icon")) {
        element.addEventListener("click", (e) => toggleAction(e.target));
    }

    removeClassFromLocal();
    saveClassToLocal(name);
    loadActions(name);
}

function loadClassFromLocal() {
    for (let val in window.localStorage) {
        if (val.includes("SRR") && classes.includes(val.split("-")[1])) {
            let c = val.split("-")[1];
            changeClass(c);
            document.querySelector(`option[name=${c}]`).setAttribute("selected", true);
        }
    }
}

function toggleAction(element) {
    element.classList.toggle("action-icon__rested");
}

function reinvigorate() {
    for (let actionIcon of document.querySelectorAll(".action-icon")) {
        if (actionIcon.classList.contains("action-icon__rested")) {
            toggleAction(actionIcon);
        }
    }
}

function saveActionToLocal(actionName) {
    window.localStorage.setItem("SRR-" + actionName, "1");
}

function removeActionFromLocal(actionName) {
    window.localStorage.removeItem("SRR-" + actionName);
}

function saveClassToLocal(className) {
    window.localStorage.setItem("SRR-" + className, "1");
}

function removeClassFromLocal() {
    for (let c of classes) {
        window.localStorage.removeItem("SRR-" + c);
    }
}

window.onload = async () => {
    await loadActions();

    classJSON = await fetch("./data/classes.json");
    classJSON = await classJSON.json();
    for (let c in classJSON) {
        classes.push(c);
    }

    document.querySelector("#class-select").addEventListener("change", (e) => changeClass(e.target.value));
    loadClassFromLocal();
    for (let element of document.querySelectorAll(".action-icon")) {
        element.addEventListener("click", (e) => toggleAction(e.target));
    }

    document.querySelector("#reinvigorate-button").addEventListener("click", reinvigorate);
}
