import { changeElementDisplay, createNewElementWithAttr } from "./module.js";
var employeeList;
var allRoles;
export function addRoleOption(form, element) {
    let select = form.querySelector(`#${element}`);
    let selectOption = createNewElementWithAttr('option', [['value', ''], ['selected', "true"], ['hidden', "true"]]);
    selectOption.innerText = "Select Role";
    select.appendChild(selectOption);
    allRoles = JSON.parse(localStorage.getItem('roles'));
    allRoles.forEach((obj) => {
        let option = createNewElementWithAttr('option', [['value', obj.role.toLowerCase()]]);
        option.innerText = obj.role;
        select.appendChild(option);
    });
}
export function closeForm(formClass, selectClass) {
    let elementsToShow = ["employees-container", "alphabet-filter", "reset-filter",];
    elementsToShow.forEach((elementClass) => {
        changeElementDisplay(`.${elementClass}`, 'flex');
    });
    let form = document.querySelector(`${formClass}`);
    form.querySelector(`#${selectClass}`).innerHTML = "";
    changeElementDisplay(`${formClass}`, 'none');
    changeElementDisplay(".employee-table-container", 'block');
}
export function openEditEmployeeForm(formClass, selectClass, e) {
    openEmployeeForm(formClass, selectClass);
}
export function openEmployeeForm(formClass, selectClass) {
    let elementsToHide = ["employees-container", "alphabet-filter", "reset-filter", "employee-table-container",];
    elementsToHide.forEach((elementClass) => changeElementDisplay(`.${elementClass}`, 'none'));
    changeElementDisplay(`${formClass}`, 'block');
    let serachBarHeight = document.querySelector(".search-container").offsetHeight;
    let form = document.querySelector(`${formClass}`);
    form.style.top = `${serachBarHeight + 20}px`;
    addRoleOption(form, selectClass);
}
