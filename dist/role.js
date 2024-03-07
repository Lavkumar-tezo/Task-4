import { addElementToParent, changeElementDisplay, createEmployeeDiv, createNewElement, createNewElementWithAttr, resetFilter, updateFilter } from "./module.js";
import { addRole, closeRoleForm, openAddRoleForm, openEditRoleForm } from "./role-form.js";
var allRoles;
var employeeList;
document.addEventListener('DOMContentLoaded', () => {
    updateFilter();
    employeeList = JSON.parse(localStorage.getItem('employeeList'));
    allRoles = JSON.parse(localStorage.getItem('roles'));
    allRoles.forEach(obj => {
        let roleId = obj.roleId;
        obj.profiles = [];
        let filteredEmp = employeeList.filter((obj) => obj.role == roleId);
        obj.profiles = filteredEmp;
    });
    localStorage.removeItem('selectedRole');
    localStorage.setItem('roles', JSON.stringify(allRoles));
    allRoles.forEach(role => createRoleCard(role));
    document.querySelector('.reset-btn').addEventListener('click', resetRoleFilter);
    document.querySelector('.add-role-btn').addEventListener('click', () => openAddRoleForm('.add-role-container'));
    document.querySelector('.apply-btn').addEventListener('click', filterSearch);
    document.querySelectorAll('.all-employees').forEach(empls => empls.addEventListener('click', (event) => event.stopPropagation()));
    document.querySelector('.cancel-add-role').addEventListener('click', () => closeRoleForm('.add-role-container'));
    document.addEventListener('click', () => {
        let allEmployees = document.querySelectorAll('.all-employees');
        allEmployees.forEach(empls => empls.style.display = "none");
    });
    let empCardOption = ['assign-employees', 'edit-assign-employees'];
    empCardOption.forEach((empCard) => {
        document.querySelector(`#${empCard}`).addEventListener('click', (event) => {
            event.stopPropagation();
            let targetElement = event.target;
            targetElement.parentElement.querySelector('.all-employees').style.display = "block";
        });
        document.querySelector(`#${empCard}`).addEventListener('keyup', (event) => {
            let targetElement = event.target;
            let searchValue = targetElement.value.toLowerCase();
            let allEmpList = document.querySelectorAll('.employee-name-img');
            allEmpList.forEach((emp) => {
                emp.style.display = (emp.innerText.toLowerCase().startsWith(searchValue)) ? "block" : "none";
            });
        });
    });
    document.querySelector('.submit-add-role').addEventListener('click', (event) => addRole(event, 'add'));
    document.querySelector('.submit-edit-role').addEventListener("click", (event) => {
        let triggeredButton = event.target;
        if (triggeredButton.innerText == "Edit") {
            triggeredButton.innerText = "Apply Changes";
            activateInput();
        }
        else {
            triggeredButton.type = "submit";
            addRole(event, 'edit');
        }
    });
    document.querySelector('.cancel-edit-role').addEventListener("click", () => {
        activateInput(true);
        localStorage.removeItem('selectedRole');
        closeRoleForm('.edit-role-container');
    });
});
export function createRoleCard(data) {
    const parent = document.querySelector('.role-card-container');
    let roleCard = createNewElement('div', ["role-card", "flex-container", "flex-col"]);
    let roleName = createNewElement('div', ["role-title-icon", "d-flex", "jus-content-btw", "w-100"]);
    let roleTitle = createNewElement('div', ['role-title']);
    roleTitle.textContent = data.role;
    let editIcon = createNewElementWithAttr('img', [['src', "./assets/icons/edit.svg"], ['alt', 'edit-icon']]);
    editIcon.addEventListener('click', (e) => openEditRoleForm(e, '.edit-role-container'));
    roleName = addElementToParent(roleName, roleTitle, editIcon);
    let roleDetails = createNewElement('div', ["w-100", "role-details", "flex-container", "flex-col"]);
    let roleDepartment = createNewElement('div', ["role-department", "d-flex", "jus-content-btw", "w-100"]);
    let deptIcon = createNewElement('div', ['dept-icon', 'd-flex']);
    let deptImg = createNewElementWithAttr('img', [['src', "./assets/icons/emp-id.svg"], ['alt', 'department-icon']]);
    const deptLabel = document.createTextNode("Department");
    deptIcon = addElementToParent(deptIcon, deptImg, deptLabel);
    let roleDeptName = createNewElement('div', ['role-dept-name']);
    roleDeptName.textContent = data.dept;
    roleDepartment = addElementToParent(roleDepartment, deptIcon, roleDeptName);
    let roleLocation = createNewElement('div', ['role-department', 'd-flex', 'jus-content-btw', 'w-100']);
    let locIcon = createNewElement('div', ['dept-icon', 'd-flex']);
    let locImg = createNewElementWithAttr('img', [['src', "./assets/icons/location.svg"], ['alt', 'location-icon']]);
    const locLabel = document.createTextNode("Location");
    locIcon = addElementToParent(locIcon, locImg, locLabel);
    let roleLocName = createNewElement('div', ['role-dept-location']);
    roleLocName.textContent = data.location;
    roleLocation = addElementToParent(roleLocation, locIcon, roleLocName);
    let totalEmployee = createNewElement('div', ['role-department', 'd-flex', 'jus-content-btw', 'w-100']);
    let totalLabel = createNewElement('div', ['dept-icon']);
    totalLabel.textContent = "Total Employee";
    let emplProfileContainer = createNewElement('div', ["empl-profile-container", "d-flex", "jus-content-btw"]);
    if (data.profiles) {
        let minimumProfie = Math.min(data.profiles.length, 4);
        for (let i = 0; i < minimumProfie; i++) {
            const profileImg = document.createElement("img");
            let profileEmpNo = data.profiles[i].empNo;
            let emp = employeeList.filter(employee => employee.empNo == profileEmpNo);
            if (emp.length == 0) {
                data.profiles.splice(i, 1);
                i--;
                continue;
            }
            profileImg.src = emp[0].img;
            profileImg.alt = "profile-img";
            profileImg.className = `profile-${i + 1}`;
            emplProfileContainer.appendChild(profileImg);
        }
        if (data.profiles.length > 4) {
            const plusEmployee = document.createElement("span");
            plusEmployee.className = "plus-employee flex-container";
            plusEmployee.innerText = `+${data.profiles.length - 4}`;
            emplProfileContainer.appendChild(plusEmployee);
        }
        else {
            let width = (data.profiles.length + 1) * 0.5;
            emplProfileContainer.style.width = `${width}rem`;
        }
    }
    totalEmployee = addElementToParent(totalEmployee, totalLabel, emplProfileContainer);
    roleDetails = addElementToParent(roleDetails, roleDepartment, roleLocation, totalEmployee);
    let viewAllContainer = createNewElement('a', ['anchor', 'view-all-container']);
    viewAllContainer.href = `./role-details.html?selectedRole=${data.role}`;
    viewAllContainer.title = 'employee-page';
    let viewAll = createNewElement('div', ['view-all-container', 'd-flex']);
    viewAll.innerText = "View all Employee";
    let rightArrow = createNewElementWithAttr('img', [['src', "./assets/icons/vector.svg"], ['alt', 'right-arrow']]);
    viewAll.appendChild(rightArrow);
    viewAllContainer.appendChild(viewAll);
    roleCard = addElementToParent(roleCard, roleName, roleDetails, viewAllContainer);
    parent.appendChild(roleCard);
}
export function activateInput(flag = false) {
    let allDisabledInputs = ['edit-role-name', 'edit-role-dept', 'edit-role-desc', 'edit-role-location', 'edit-assign-employees'];
    allDisabledInputs.forEach(input => document.querySelector(`#${input}`).disabled = flag);
}
export function createDivBlock(element) {
    let selectedRole = JSON.parse(localStorage.getItem('selectedRole'));
    let selectedRoleTitle = allRoles.filter(obj => obj.role == selectedRole);
    employeeList.forEach(emp => {
        if (emp.role == '')
            createEmployeeDiv(emp, element, false);
        if ((selectedRoleTitle.length != 0) && (emp.role == selectedRoleTitle[0].roleId)) {
            createEmployeeDiv(emp, element, true);
        }
    });
}
function resetRoleFilter() {
    resetFilter();
    filterSearch();
}
function filterCheck(role, check) {
    let status = document.querySelector(`#${check}`);
    if (!status.value)
        return true;
    let selectedStatus = [];
    let allOptions = status.parentElement.querySelectorAll(".custom-option input");
    for (let option of allOptions) {
        if (option.checked)
            selectedStatus.push(option.value.toLowerCase());
    }
    let empStatus = (check == "department") ? role.querySelector(`.role-dept-name`).innerText.toLowerCase().replace(/[^a-zA-Z/ ]/g, "") : role.querySelector(`.role-dept-location`).innerText.toLowerCase();
    for (let i = 0; i < selectedStatus.length; i++) {
        if (selectedStatus[i] == empStatus)
            return true;
    }
    return false;
}
function filterSearch() {
    let allRoles = document.querySelector(".role-card-container");
    let role = allRoles.querySelectorAll(".role-card");
    let count = 0;
    for (let i = 0; i < role.length; i++) {
        let deptCheck = filterCheck(role[i], "department");
        let locationCheck = filterCheck(role[i], "location");
        if (deptCheck && locationCheck) {
            role[i].style.display = "flex";
            count++;
        }
        else {
            role[i].style.display = "none";
        }
    }
    (count == 0) ? changeElementDisplay('.no-record-card', 'flex') : changeElementDisplay('.no-record-card', 'none');
}
