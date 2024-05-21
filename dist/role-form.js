import { changeElementDisplay, createToastMessage, showValidInput } from "./module.js";
import { activateInput, createDivBlock, createRoleCard } from "./role.js";
var allRoles;
var employeeList;
export function openAddRoleForm(formClass) {
    let elementsToHide = ["employees-container", "reset-filter", "role-card-container"];
    elementsToHide.forEach((elementClass) => changeElementDisplay(`.${elementClass}`, "none"));
    let form = document.querySelector(`${formClass}`);
    changeElementDisplay(`${formClass}`, 'block');
    let serachBarHeight = document.querySelector(".search-container").offsetHeight;
    document.querySelector(`${formClass}`).style.top = `${serachBarHeight + 20}px`;
    let allEmployeeContainer = form.querySelector('.all-employees');
    allEmployeeContainer.innerHTML = "";
    createDivBlock(allEmployeeContainer);
}
export function closeRoleForm(formClass) {
    let display = {
        ".reset-filter": "flex",
        ".employees-container": "flex",
        ".role-card-container": "grid",
    };
    for (let element in display) {
        changeElementDisplay(`${element}`, display[element]);
    }
    changeElementDisplay(`${formClass}`, 'none');
    let form = document.querySelector(`${formClass} form`);
    form.reset();
    form.querySelector('.added-emp-number').innerText = '';
    let allEmployeeContainer = form.querySelector('.all-employees');
    allEmployeeContainer.innerHTML = "";
    allEmployeeContainer.style.display = 'none';
    validateField(form, false);
    document.querySelector('.submit-edit-role').innerText = "Edit";
    document.querySelector('.submit-edit-role').type = "button";
    activateInput(true);
}
export function openEditRoleForm(event, formClass) {
    var _a, _b;
    openAddRoleForm(formClass);
    let triggredElement = event.target;
    let roleTitle = triggredElement.parentElement.querySelector('.role-title').innerText;
    allRoles = JSON.parse(localStorage.getItem('roles'));
    let selectedRoleDetail = allRoles.filter(obj => obj.role == roleTitle);
    localStorage.setItem('selectedRole', JSON.stringify(roleTitle));
    let form = document.querySelector(`${formClass}`);
    let initialEmp = (_a = selectedRoleDetail[0].profiles) === null || _a === void 0 ? void 0 : _a.length;
    if (initialEmp)
        form.querySelector('.added-emp-number').innerText = `${initialEmp} selected`;
    let editObject = {
        'edit-role-name': selectedRoleDetail[0].role,
        'edit-role-dept': selectedRoleDetail[0].dept.toLowerCase(),
        'edit-role-desc': (_b = selectedRoleDetail[0].desc) === null || _b === void 0 ? void 0 : _b.toLowerCase(),
        'edit-role-location': selectedRoleDetail[0].location.toLowerCase()
    };
    for (const selector in editObject) {
        const element = document.querySelector(`#${selector}`);
        (element) ? element.value = editObject[selector] : "";
    }
    let allEmployeeContainer = form.querySelector('.all-employees');
    allEmployeeContainer.innerHTML = "";
    createDivBlock(allEmployeeContainer);
}
function validateField(form, flag = true) {
    let check = 1;
    allRoles = JSON.parse(localStorage.getItem('roles'));
    const DangerInput = ["role", "dept", "desc", "location",];
    let formInputs = Array.from(form.elements);
    let formInput = formInputs.filter((input) => {
        let inputName = input.getAttribute('name');
        let find = (inputName) ? DangerInput.indexOf(inputName === null || inputName === void 0 ? void 0 : inputName.toLowerCase()) : -1;
        if (find != -1)
            return input;
    });
    for (let key in formInput) {
        let element = formInput[key];
        if (element.name == 'desc') {
            continue;
        }
        else if (element.value == "") {
            showValidInput(element, `&#9888; ${DangerInput[key]} is required`, flag);
            check = 0;
        }
        else if (element.name == 'role') {
            let newRoleName = element.value.trim().toLowerCase();
            if (!newRoleName.match(/^[a-zA-Z ]+$/)) {
                showValidInput(element, `&#9888; role name should have alphabets`, flag);
                check = 0;
            }
            let selectedRole = JSON.parse(localStorage.getItem('selectedRole'));
            if ((selectedRole && selectedRole.toLowerCase() != newRoleName) || !selectedRole) {
                for (let i = 0; i < allRoles.length; i++) {
                    if ((allRoles[i].role.trim().toLowerCase() === newRoleName)) {
                        showValidInput(element, `&#9888; This role has been already registered`, flag);
                        check = 0;
                        break;
                    }
                }
            }
        }
    }
    return check;
}
export function addRole(event, mode) {
    event.preventDefault();
    employeeList = JSON.parse(localStorage.getItem('employeeList'));
    allRoles = JSON.parse(localStorage.getItem('roles'));
    let form = (mode == 'add') ? document.querySelector(".add-role") : document.querySelector(".edit-role");
    let check = validateField(form, true);
    if (check == 0)
        return;
    let newFormObject = {};
    let element = form.querySelector('[name="role"]');
    newFormObject[element.name] = element.value;
    element = form.querySelector('[name="desc"]');
    newFormObject[element.name] = element.value;
    element = form.querySelector('[name="location"]');
    let optionText = element.options[element.selectedIndex].innerText;
    newFormObject[element.name] = optionText;
    element = form.querySelector('[name="dept"]');
    optionText = element.options[element.selectedIndex].innerText;
    newFormObject[element.name] = optionText;
    let allEmpList = form.querySelectorAll('.employee-name-img');
    let allAllotedEmp = {
        profile: []
    };
    allEmpList.forEach((emp) => {
        let input = emp.querySelector('input');
        if (input.checked) {
            let empId = emp.querySelector('.hide').innerText;
            for (let employee of employeeList) {
                if (employee.empNo == empId) {
                    allAllotedEmp.profile.push(employee);
                    break;
                }
            }
        }
    });
    let newRoleId = getNewRoleId();
    let newRole = {
        role: newFormObject.role,
        dept: newFormObject.dept,
        desc: newFormObject.desc,
        location: newFormObject.location,
        profiles: allAllotedEmp.profile,
        roleId: newRoleId
    };
    if (mode == "edit") {
        let selectedRole = JSON.parse(localStorage.getItem("selectedRole")).toLowerCase();
        let allRoleCard = document.querySelectorAll('.role-card');
        allRoleCard.forEach(roleCard => {
            let roleCardTitle = roleCard.querySelector('.role-title').innerText.toLowerCase();
            (roleCardTitle == selectedRole) ? roleCard.remove() : "";
        });
        let selectedRoleDetails = allRoles.filter(obj => obj.role.toLowerCase() == selectedRole);
        let selectedRoleId = selectedRoleDetails[0].roleId;
        employeeList.forEach((empl) => {
            if (empl.role == selectedRoleId)
                empl.role = '';
        });
        localStorage.setItem('employeeList', JSON.stringify(employeeList));
        let newRoles = allRoles.filter(obj => obj.role.toLowerCase() !== selectedRole);
        allRoles = newRoles;
        localStorage.removeItem("selectedRole");
    }
    createRoleCard(newRole);
    allRoles.push(newRole);
    addRoleToEmployee(newRoleId, newRole);
    localStorage.setItem('roles', JSON.stringify(allRoles));
    form.reset();
    if (mode == 'add') {
        closeRoleForm('.add-role-container');
        createToastMessage('Role Added');
    }
    else {
        closeRoleForm('.edit-role-container');
        createToastMessage('Changes Applied');
    }
}
function getNewRoleId() {
    allRoles = JSON.parse(localStorage.getItem('roles'));
    let sortedRole = allRoles.sort((a, b) => a.roleId > b.roleId ? 1 : -1);
    let highestRoleId = sortedRole[sortedRole.length - 1].roleId;
    let highestRoleNum = highestRoleId.substring(2, highestRoleId.length);
    return `IN${Number(highestRoleNum) + 1}`;
}
function addRoleToEmployee(roleId, newRole) {
    employeeList = JSON.parse(localStorage.getItem('employeeList'));
    if (newRole.profiles) {
        for (let i = 0; i < newRole.profiles.length; i++) {
            let empl = newRole.profiles[i];
            for (let employee of employeeList) {
                if (employee.empNo == empl.empNo) {
                    employee.role = roleId;
                }
            }
        }
    }
    localStorage.setItem('employeeList', JSON.stringify(employeeList));
}
