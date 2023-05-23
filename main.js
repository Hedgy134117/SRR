function createActionHTML(name, type, category, description) {
    return `
    <div class="action">
        <div class="action__name">
            <span class="action__title">${name}</span>
            <img class="action__type" src="img/${type == "Light" ? "LA" : "HA"}.png"></img>
        </div>
        <span class="action__category">${category}</span>
        <span class="action__description">${description}</span>
    </div>
    `;
}

async function loadActions() {
    let actionsJSON = await fetch("./data/actions.json");
    actionsJSON = await actionsJSON.json();
    console.log(actionsJSON);

    let actionList = document.querySelector(".action-list");
    for (let actionName in actionsJSON) {
        let action = actionsJSON[actionName];
        let html = createActionHTML(actionName, action["type"], action["category"], action["description"]);
        actionList.insertAdjacentHTML("beforeend", html);
    }
}

function createActionIconHTML(type) {
    return `<img class="action-icon" src="img/${type == "Light" ? "LA" : "HA"}.png">`;
}

let classJSON = null;
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
}

function toggleAction(element) {
    element.classList.toggle("action-icon__rested");
}

window.onload = async () => {
    await loadActions();

    classJSON = await fetch("./data/classes.json");
    classJSON = await classJSON.json();

    document.querySelector("#class-select").addEventListener("change", (e) => changeClass(e.target.value));
    for (let element of document.querySelectorAll(".action-icon")) {
        element.addEventListener("click", (e) => toggleAction(e.target));
    }
}
