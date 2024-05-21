import { addElementToParent, changeElementDisplay, createEmployeeDiv, createNewElement, createNewElementWithAttr, createToastMessage } from "./module.js";
var allRoles;
var employeeList;
var selectedRole;
document.addEventListener('DOMContentLoaded', function () {
    allRoles = JSON.parse(localStorage.getItem('roles'));
    employeeList = JSON.parse(localStorage.getItem('employeeList'));
    var params = new URLSearchParams(window.location.search);
    let selectedRoleTitle = params.get("selectedRole");
    let getRole;
    if (selectedRoleTitle)
        getRole = allRoles.filter(obj => obj.role == selectedRoleTitle);
    if (getRole)
        selectedRole = getRole[0];
    if (selectedRole && selectedRole.profiles) {
        for (let obj of selectedRole.profiles) {
            let empNo = obj.empNo;
            let emp = employeeList.filter(obj => obj.empNo == empNo);
            createRoleCard(emp[0]);
        }
    }
    document.querySelector('.add-employee').addEventListener('click', openAddEmployeeForm);
    document.querySelector('.cancel-edit-role').addEventListener('click', closeAddRoleForm);
    document.querySelector('#edit-assign-employees').addEventListener('focus', (event) => {
        let targetElement = event.target;
        targetElement.parentElement.querySelector('.all-employees').style.display = "block";
    });
    document.querySelector(`#edit-assign-employees`).addEventListener('keyup', (event) => {
        let targetElement = event.target;
        let searchValue = targetElement.value.toLowerCase();
        let allEmpList = document.querySelectorAll('.employee-name-img');
        allEmpList.forEach((emp) => {
            let name = emp.innerText.toLowerCase();
            emp.style.display = (name.startsWith(searchValue)) ? "block" : "none";
        });
    });
    document.querySelector('.edit-role').addEventListener('submit', (event) => { editRole(event); });
});
function createRoleCard(employee) {
    let cardContainer = createNewElement('div', ["role-card", "flex-container", "flex-col", 'employee-card']);
    let empCardDetail = createNewElement('div', ['employee-card-title', 'w-100', 'd-flex']);
    let profileImage = createNewElementWithAttr('img', [['src', employee.img], ['alt', 'admin']]);
    profileImage.classList.add('employee-card-img');
    let employeeDetails = createNewElement('div', ['employee-detail']);
    let employeeName = createNewElement('div', ['employee-name']);
    employeeName.textContent = `${employee.fname} ${employee.lname}`;
    let employeeDept = createNewElement('div', ['employee-dept']);
    employeeDept.textContent = selectedRole.role;
    employeeDetails = addElementToParent(employeeDetails, employeeName, employeeDept);
    empCardDetail = addElementToParent(empCardDetail, profileImage, employeeDetails);
    let employeeContainer = createNewElement('div', ['w-100', 'role-details']);
    let departmentIcon = createNewElement('div', ['dept-icon', 'd-flex']);
    let deptImage = createNewElementWithAttr('img', [['src', "./assets/icons/emp-id.svg"], ['alt', 'department-id']]);
    departmentIcon.appendChild(deptImage);
    let departmentId = createNewElement('div', ['emp-office-detail']);
    departmentId.textContent = employee.empNo;
    let departmentDetails = createNewElement('div', ["role-department", "d-flex", "w-100", "jus-content-start"]);
    departmentDetails = addElementToParent(departmentDetails, departmentIcon, departmentId);
    let emailIcon = createNewElement('div', ["dept-icon", "d-flex"]);
    let emailImage = createNewElementWithAttr('img', [['src', "./assets/icons/email.svg"], ['alt', 'email-icon']]);
    emailIcon.appendChild(emailImage);
    let emailAddress = createNewElement('div', ['emp-office-detail']);
    emailAddress.textContent = employee.email;
    let emailDetails = createNewElement('div', ["role-department", "d-flex", "w-100", "jus-content-start"]);
    emailDetails = addElementToParent(emailDetails, emailIcon, emailAddress);
    let teamIcon = createNewElement('div', ["dept-icon", "d-flex"]);
    let teamImage = createNewElementWithAttr('img', [['src', "./assets/icons/team.svg"], ['alt', 'team-icon']]);
    teamIcon.appendChild(teamImage);
    let teamRole = createNewElement('div', ['emp-office-detail']);
    teamRole.textContent = employee.dept;
    let teamDetails = createNewElement('div', ["role-department", "d-flex", "w-100", "jus-content-start"]);
    teamDetails = addElementToParent(teamDetails, teamIcon, teamRole);
    let locationIcon = createNewElement('div', ["dept-icon", "d-flex"]);
    let locationImage = createNewElementWithAttr('img', [['src', "./assets/icons/location.svg"], ['alt', 'location-icon']]);
    locationIcon.appendChild(locationImage);
    let locationAddress = createNewElement('div', ['emp-office-detail']);
    locationAddress.textContent = employee.location;
    let locationDetails = createNewElement('div', ["role-department", "d-flex", "w-100", "jus-content-start"]);
    locationDetails = addElementToParent(locationDetails, locationIcon, locationAddress);
    employeeContainer = addElementToParent(employeeContainer, departmentDetails, emailDetails, teamDetails, locationDetails);
    let viewAllLink = createNewElementWithAttr('a', [['href', '#'], ['title', 'employee-page'], ['target', '_blank']]);
    viewAllLink.classList.add('anchor', 'view-all-container');
    let viewAllText = createNewElement('div', ["view-all", "d-flex"]);
    viewAllText.textContent = "View ";
    let arrowIcon = createNewElementWithAttr('img', [['src', "./assets/icons/vector.svg"], ['alt', 'right-arrow']]);
    viewAllText.appendChild(arrowIcon);
    viewAllLink.appendChild(viewAllText);
    cardContainer = addElementToParent(cardContainer, empCardDetail, employeeContainer, viewAllLink);
    document.querySelector('.role-card-container').appendChild(cardContainer);
}
function createDivBlock(element) {
    employeeList = JSON.parse(localStorage.getItem('employeeList'));
    employeeList.forEach(emp => (emp.role == '') ? createEmployeeDiv(emp, element, false) : "");
}
function openAddEmployeeForm() {
    var _a;
    let elementsToHide = ["employees-title-container", "role-desc-container", "role-card-container",];
    elementsToHide.forEach(elementClass => document.querySelector(`.${elementClass}`).style.display = "none");
    let form = document.querySelector(".edit-role-container");
    form.style.display = "block";
    let serachBarHeight = document.querySelector(".search-container").offsetHeight;
    document.querySelector(".edit-role-container").style.top = `${serachBarHeight + 20}px`;
    let editObject = {
        'edit-role-name': selectedRole.role,
        'edit-role-dept': selectedRole.dept.toLowerCase(),
        'edit-role-desc': (_a = selectedRole.desc) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
        'edit-role-location': selectedRole.location.toLowerCase()
    };
    for (const selector in editObject) {
        const element = document.querySelector(`#${selector}`);
        (element) ? element.value = editObject[selector] : "";
    }
    let allEmployeeContainer = form.querySelector('.all-employees');
    allEmployeeContainer.innerHTML = "";
    createDivBlock(allEmployeeContainer);
}
function closeAddRoleForm() {
    let display = {
        ".employees-title-container": "flex",
        ".role-desc-container": "block",
        ".role-card-container": "grid",
        '.edit-role-container': "none"
    };
    for (let element in display) {
        changeElementDisplay(`${element}`, display[element]);
    }
    let form = document.querySelector('.edit-role');
    let allEmployeeContainer = form.querySelector('.all-employees');
    allEmployeeContainer.innerHTML = "";
    allEmployeeContainer.style.display = 'none';
}
function editRole(event) {
    event.preventDefault();
    employeeList = JSON.parse(localStorage.getItem('employeeList'));
    allRoles = JSON.parse(localStorage.getItem('roles'));
    let form = document.querySelector(".edit-role");
    let allotedProfiles = (selectedRole.profiles) ? selectedRole.profiles : [];
    let allEmpList = form.querySelectorAll('.employee-name-img');
    allEmpList.forEach((emp) => {
        let input = emp.querySelector('input');
        if (input.checked) {
            let empId = emp.querySelector('.hide').innerText;
            for (let employee of employeeList) {
                if (employee.empNo == empId) {
                    employee.role = selectedRole.roleId;
                    allotedProfiles.push(employee);
                    break;
                }
            }
        }
    });
    selectedRole.profiles = (allotedProfiles) ? allotedProfiles : [];
    allRoles.forEach(role => (role.roleId == selectedRole.roleId) ? role = selectedRole : "");
    localStorage.setItem('employeeList', JSON.stringify(employeeList));
    localStorage.setItem('roles', JSON.stringify(allRoles));
    form.reset();
    createToastMessage('Employee Added');
    document.querySelector('.role-card-container').innerHTML = "";
    if (selectedRole.profiles) {
        for (let obj of selectedRole.profiles) {
            let empNo = obj.empNo;
            let emp = employeeList.filter(obj => obj.empNo == empNo);
            createRoleCard(emp[0]);
        }
    }
    closeAddRoleForm();
}
