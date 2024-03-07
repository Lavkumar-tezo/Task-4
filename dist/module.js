export function changeElementDisplay(element, value) {
    document.querySelector(`${element}`).style.display = value;
}
export function showValidInput(element, message, flag) {
    if (!flag)
        return hideRequiredMessage(element);
    element.style.borderColor = 'red';
    let parentDiv = element.parentElement;
    let span = parentDiv.querySelector('span');
    span.innerHTML = message;
    span.style.color = 'red';
    element.addEventListener('change', (event) => hideRequiredMessage(event.currentTarget));
}
export function hideRequiredMessage(element) {
    element.style.borderColor = 'rgba(227,229,233,255)';
    let parentDiv = element.parentElement;
    let span = parentDiv.querySelector('span');
    if (!span) {
        parentDiv = parentDiv.parentElement;
        span = parentDiv.querySelector('span');
    }
    if (span)
        span.innerText = '';
}
export function setElementAttribute(element, attr, value) {
    document.querySelector(`${element}`).setAttribute(`${attr}`, value);
}
export function hidePopUp() {
    let popup = document.querySelector('.toast');
    if (popup)
        popup.remove();
}
export function createToastMessage(message) {
    let toastDiv = createNewElement('Div', ["toast", "flex-container"]);
    let tickContainer = createNewElement('Div', ["toast-tick-container", "flex-container"]);
    let tickImg = createNewElementWithAttr('Img', [['src', "./assets/icons/tick.svg"], ['alt', 'tick']]);
    let textSpan = document.createElement("span");
    textSpan.textContent = message;
    let crossContainer = createNewElement('Div', ["toast-cross-container", "flex-container"]);
    let crossImg = createNewElementWithAttr('Img', [['src', "./assets/icons/cross.svg"], ['alt', 'cross']]);
    crossContainer.addEventListener('click', hidePopUp);
    tickContainer.appendChild(tickImg);
    crossContainer.appendChild(crossImg);
    toastDiv = addElementToParent(toastDiv, tickContainer, textSpan, crossContainer);
    setTimeout(hidePopUp, 4500);
    let content = document.querySelector(".content");
    content.appendChild(toastDiv);
}
export function updateInput(event, mainInput, parent) {
    let input = event.querySelectorAll(`.${mainInput} input`);
    let count = 0;
    for (let i = 0; i < input.length; i++) {
        (input[i].checked) ? count++ : "";
    }
    let customInput = event.querySelector(`.${parent}`);
    (customInput instanceof HTMLSpanElement) ? customInput.innerText = count == 0 ? "" : `${count} selected` : customInput.value = count == 0 ? "" : `${count} selected`;
}
export function toggleOptions(event, check) {
    let customOptions = event.querySelector(`.${check}`);
    customOptions.style.display = (customOptions.style.display === "block") ? "none" : "block";
}
export function createEmployeeDiv(employee, main, flag) {
    let div = createNewElement('Div', ["employee-name-img", "w-100"]);
    let label = createNewElement('Label', ["assignable-employee", "d-flex", "jus-content-btw"]);
    let detail = createNewElement('Div', ['assign-emp-detail', 'd-flex']);
    let img = createNewElementWithAttr('Img', [['src', employee.img], ['alt', 'employee-image']]);
    let span = document.createElement("Span");
    let employeeName = `${employee.fname} ${employee.lname}`;
    span.textContent = `${employeeName} (${employee.empNo})`;
    (employeeName.length > 18) ? span.setAttribute('title', employeeName) : span.setAttribute('title', '');
    let input = createNewElementWithAttr('Input', [['type', 'checkbox']]);
    input.checked = flag;
    input.addEventListener('click', (event) => {
        let eventTriggredElement = event.target;
        updateInput(eventTriggredElement.parentElement.parentElement.parentElement.parentElement, 'all-employees', 'added-emp-number');
    });
    detail = addElementToParent(detail, img, span);
    label = addElementToParent(label, detail, input);
    div.appendChild(label);
    let empid = document.createElement("span");
    empid.innerText = employee.empNo;
    empid.classList.add('hide');
    div.appendChild(empid);
    main.appendChild(div);
}
export function createNewElement(type, classes) {
    let element = document.createElement(`${type}`);
    element.classList.add(...classes);
    return element;
}
export function createNewElementWithAttr(type, attrArray) {
    let element = document.createElement(`${type}`);
    for (let i = 0; i < attrArray.length; i++)
        element.setAttribute(`${attrArray[i][0]}`, `${attrArray[i][1]}`);
    return element;
}
export function addElementToParent(parent, ...child) {
    child.forEach((elementOrArray) => parent.appendChild(elementOrArray));
    return parent;
}
export function updateFilter() {
    let allFilterSelects = document.querySelectorAll('.custom-select');
    allFilterSelects.forEach((filter) => {
        var customInput = filter.querySelector(".custom-input");
        var customOption = filter.querySelectorAll(".custom-option");
        customInput.addEventListener("focus", (event) => {
            let triggeredElement = event.target;
            let selectedInputParent = triggeredElement.parentElement;
            toggleOptions(selectedInputParent, 'custom-options');
        });
        for (var i = 0; i < customOption.length; i++) {
            customOption[i].querySelector('input').addEventListener("click", (event) => {
                let inputTriggeredTarget = event.target;
                updateInput(inputTriggeredTarget.parentElement.parentElement.parentElement, 'custom-option', 'custom-input');
            });
        }
        document.addEventListener("click", function (event) {
            var target = event.target;
            if (!filter.contains(target)) {
                let openedSelectFilter = filter.querySelector('.custom-options');
                openedSelectFilter.style.display = "none";
            }
        });
    });
}
export function resetFilter() {
    localStorage.removeItem('selectedAlpha');
    let allFilterInput = document.querySelectorAll(".filter-select .custom-input");
    allFilterInput.forEach((select) => select.value = "");
    let allFilterCheckbox = document.querySelectorAll(".filter-select .custom-option input");
    allFilterCheckbox.forEach((input) => input.checked = false);
}
