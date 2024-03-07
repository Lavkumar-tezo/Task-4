import { EmployeeSample, RoleSample } from "./common.js";
import { addElementToParent, changeElementDisplay, createEmployeeDiv, createNewElement, createNewElementWithAttr, createToastMessage } from "./module.js";

var allRoles:RoleSample[];
var employeeList:EmployeeSample[];
var selectedRole:RoleSample;

document.addEventListener('DOMContentLoaded', function () {
    allRoles = JSON.parse(localStorage.getItem('roles')!)
    employeeList = JSON.parse(localStorage.getItem('employeeList')!);
    var params:URLSearchParams = new URLSearchParams(window.location.search)
    let selectedRoleTitle:string | null = params.get("selectedRole");
    let getRole:RoleSample[] | undefined;
    if(selectedRoleTitle)
        getRole = allRoles.filter(obj => obj.role == selectedRoleTitle);
    if(getRole)
        selectedRole = getRole[0];
    if(selectedRole && selectedRole.profiles){
        for (let obj of selectedRole.profiles) {
            let empNo = obj.empNo;
            let emp = employeeList.filter(obj => obj.empNo == empNo);
            createRoleCard(emp[0]);
        }
    }
    document.querySelector('.add-employee')!.addEventListener('click', openAddEmployeeForm);
    document.querySelector('.cancel-edit-role')!.addEventListener('click', closeAddRoleForm)
    document.querySelector('#edit-assign-employees')!.addEventListener('focus', (event:Event) => {
        let targetElement=event.target as HTMLInputElement;
        targetElement.parentElement!.querySelector<HTMLDivElement>('.all-employees')!.style.display = "block";
    })
    document.querySelector<HTMLInputElement>(`#edit-assign-employees`)!.addEventListener('keyup', (event:Event) => {
        let targetElement=event.target as HTMLInputElement;
        let searchValue:string = targetElement.value.toLowerCase()
        let allEmpList:NodeListOf<HTMLDivElement> = document.querySelectorAll('.employee-name-img');
        allEmpList.forEach((emp) => {
            let name = emp.innerText.toLowerCase();
            emp.style.display = (name.startsWith(searchValue)) ? "block":"none"
        })
    })
    document.querySelector<HTMLFormElement>('.edit-role')!.addEventListener('submit', (event:Event) => { editRole(event) })
})

function createRoleCard(employee:EmployeeSample):void {
    let cardContainer:HTMLElement = createNewElement('div', ["role-card", "flex-container", "flex-col", 'employee-card'])
    let empCardDetail:HTMLElement = createNewElement('div', ['employee-card-title', 'w-100', 'd-flex'])
    let profileImage:HTMLElement = createNewElementWithAttr('img', [['src', employee.img], ['alt', 'admin']])
    profileImage.classList.add('employee-card-img');
    let employeeDetails:HTMLElement = createNewElement('div', ['employee-detail'])
    let employeeName:HTMLElement = createNewElement('div', ['employee-name'])
    employeeName.textContent = `${employee.fname} ${employee.lname}`;
    let employeeDept:HTMLElement = createNewElement('div', ['employee-dept'])
    employeeDept.textContent = selectedRole.role;
    employeeDetails=addElementToParent(employeeDetails, employeeName, employeeDept)
    empCardDetail=addElementToParent(empCardDetail, profileImage, employeeDetails);
    let employeeContainer:HTMLElement = createNewElement('div', ['w-100', 'role-details'])
    let departmentIcon:HTMLElement = createNewElement('div', ['dept-icon', 'd-flex'])
    let deptImage:HTMLElement = createNewElementWithAttr('img', [['src', "./assets/icons/emp-id.svg"], ['alt', 'department-id']])
    departmentIcon.appendChild(deptImage)
    let departmentId:HTMLElement = createNewElement('div', ['emp-office-detail'])
    departmentId.textContent = employee.empNo;
    let departmentDetails:HTMLElement = createNewElement('div', ["role-department", "d-flex", "w-100", "jus-content-start"])
    departmentDetails=addElementToParent(departmentDetails, departmentIcon, departmentId);
    let emailIcon:HTMLElement = createNewElement('div', ["dept-icon", "d-flex"])
    let emailImage:HTMLElement = createNewElementWithAttr('img', [['src', "./assets/icons/email.svg"], ['alt', 'email-icon']])
    emailIcon.appendChild(emailImage);
    let emailAddress = createNewElement('div', ['emp-office-detail'])
    emailAddress.textContent = employee.email;
    let emailDetails:HTMLElement = createNewElement('div', ["role-department", "d-flex", "w-100", "jus-content-start"])
    emailDetails=addElementToParent(emailDetails,emailIcon,emailAddress)
    let teamIcon:HTMLElement = createNewElement('div', ["dept-icon", "d-flex"])
    let teamImage:HTMLElement = createNewElementWithAttr('img', [['src', "./assets/icons/team.svg"], ['alt', 'team-icon']])
    teamIcon.appendChild(teamImage);
    let teamRole:HTMLElement = createNewElement('div', ['emp-office-detail'])
    teamRole.textContent = employee.dept;
    let teamDetails:HTMLElement = createNewElement('div', ["role-department", "d-flex", "w-100", "jus-content-start"])
    teamDetails=addElementToParent(teamDetails, teamIcon, teamRole)
    let locationIcon:HTMLElement = createNewElement('div', ["dept-icon", "d-flex"])
    let locationImage:HTMLElement = createNewElementWithAttr('img', [['src', "./assets/icons/location.svg"], ['alt', 'location-icon']])
    locationIcon.appendChild(locationImage);
    let locationAddress:HTMLElement = createNewElement('div', ['emp-office-detail'])
    locationAddress.textContent = employee.location;
    let locationDetails:HTMLElement = createNewElement('div', ["role-department", "d-flex", "w-100", "jus-content-start"])
    locationDetails=addElementToParent(locationDetails,locationIcon, locationAddress);
    employeeContainer=addElementToParent(employeeContainer, departmentDetails, emailDetails, teamDetails, locationDetails)
    let viewAllLink:HTMLElement = createNewElementWithAttr('a', [['href', '#'], ['title', 'employee-page'], ['target', '_blank']])
    viewAllLink.classList.add('anchor', 'view-all-container')
    let viewAllText:HTMLElement = createNewElement('div', ["view-all", "d-flex"])
    viewAllText.textContent = "View ";
    let arrowIcon:HTMLElement = createNewElementWithAttr('img', [['src', "./assets/icons/vector.svg"], ['alt', 'right-arrow']])
    viewAllText.appendChild(arrowIcon);
    viewAllLink.appendChild(viewAllText);
    cardContainer = addElementToParent(cardContainer,empCardDetail,employeeContainer,viewAllLink)
    document.querySelector<HTMLDivElement>('.role-card-container')!.appendChild(cardContainer)
}

function createDivBlock(element:HTMLElement):void {
    employeeList = JSON.parse(localStorage.getItem('employeeList')!);
    employeeList.forEach(emp => (emp.role == '') ?createEmployeeDiv(emp, element,false):"");
}

function openAddEmployeeForm():void {
    let elementsToHide:string[] = ["employees-title-container", "role-desc-container", "role-card-container",];
    elementsToHide.forEach(elementClass =>document.querySelector<HTMLDivElement>(`.${elementClass}`)!.style.display = "none");
    let form:HTMLFormElement = document.querySelector(".edit-role-container")!;
    form.style.display = "block";
    let serachBarHeight:number =document.querySelector<HTMLDivElement>(".search-container")!.offsetHeight;
    document.querySelector<HTMLDivElement>(".edit-role-container")!.style.top = `${serachBarHeight + 20}px`;
    let editObject:Record<string, string | undefined> = {
        'edit-role-name': selectedRole.role,
        'edit-role-dept': selectedRole.dept.toLowerCase(),
        'edit-role-desc': selectedRole.desc?.toLowerCase(),
        'edit-role-location': selectedRole.location.toLowerCase()
    }
    for (const selector in editObject) {
        const element:HTMLFormElement = document.querySelector(`#${selector}`)!;
        (element)?element.value = editObject[selector]:"";
    }
    let allEmployeeContainer:HTMLDivElement = form.querySelector('.all-employees')!;
    allEmployeeContainer.innerHTML = ""
    createDivBlock(allEmployeeContainer);
}

function closeAddRoleForm():void {
    let display: Record<string, string> = {
        ".employees-title-container": "flex",
        ".role-desc-container": "block",
        ".role-card-container": "grid",
        '.edit-role-container':"none"
    };
    for (let element in display) {
        changeElementDisplay(`${element}`, display[element])
    }
    let form:HTMLFormElement = document.querySelector('.edit-role')!;
    let allEmployeeContainer:HTMLDivElement = form.querySelector('.all-employees')!;
    allEmployeeContainer.innerHTML = "";
    allEmployeeContainer.style.display = 'none'
}

function editRole(event:Event):void {
    event.preventDefault();
    employeeList = JSON.parse(localStorage.getItem('employeeList')!);
    allRoles = JSON.parse(localStorage.getItem('roles')!)
    let form:HTMLFormElement = document.querySelector(".edit-role")!;
    let allotedProfiles:EmployeeSample[]= (selectedRole.profiles)?selectedRole.profiles:[];
    let allEmpList:NodeListOf<HTMLDivElement> = form.querySelectorAll('.employee-name-img');
    allEmpList.forEach((emp) => {
        let input:HTMLInputElement = emp.querySelector('input')!;
        if (input.checked) {
            let empId:string = emp.querySelector<HTMLSpanElement>('.hide')!.innerText;
            for (let employee of employeeList) {
                if (employee.empNo == empId) {
                    employee.role = selectedRole.roleId;
                    allotedProfiles.push(employee);
                    break;
                }
            }
        }
    })
    selectedRole.profiles = (allotedProfiles)? allotedProfiles:[];
    allRoles.forEach( role => (role.roleId == selectedRole.roleId) ? role=selectedRole:"");
    localStorage.setItem('employeeList', JSON.stringify(employeeList))
    localStorage.setItem('roles', JSON.stringify(allRoles));
    form.reset();
    createToastMessage('Employee Added')
    document.querySelector<HTMLDivElement>('.role-card-container')!.innerHTML = "";
    if(selectedRole.profiles){
        for (let obj of selectedRole.profiles) {
            let empNo = obj.empNo;
            let emp = employeeList.filter(obj => obj.empNo == empNo)
            createRoleCard(emp[0]);
        }
    }
    closeAddRoleForm();
}