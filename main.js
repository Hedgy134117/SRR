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

window.onload = async () => {
    await loadActions();
}