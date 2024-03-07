import { EmployeeSample, RoleSample } from "./common.js";
import { addElementToParent, changeElementDisplay, createEmployeeDiv, createNewElement, createNewElementWithAttr, resetFilter, updateFilter } from "./module.js"
import { addRole, closeRoleForm, openAddRoleForm, openEditRoleForm } from "./role-form.js";

var allRoles: RoleSample[];
var employeeList: EmployeeSample[];

document.addEventListener('DOMContentLoaded', () => {
    updateFilter();
    employeeList = JSON.parse(localStorage.getItem('employeeList')!);
    allRoles = JSON.parse(localStorage.getItem('roles')!)
    allRoles.forEach( obj => {
        let roleId:string = obj.roleId;
        obj.profiles = [];
        let filteredEmp:EmployeeSample[] = employeeList.filter((obj) => obj.role == roleId)
        obj.profiles = filteredEmp;
    })
    localStorage.removeItem('selectedRole');
    localStorage.setItem('roles', JSON.stringify(allRoles));
    allRoles.forEach(role => createRoleCard(role))
    document.querySelector<HTMLButtonElement>('.reset-btn')!.addEventListener('click',resetRoleFilter);
    document.querySelector('.add-role-btn')!.addEventListener('click',()=>openAddRoleForm('.add-role-container'))
    document.querySelector<HTMLButtonElement>('.apply-btn')!.addEventListener('click',filterSearch);
    document.querySelectorAll('.all-employees').forEach(empls => empls.addEventListener('click', (event: Event) => event.stopPropagation()))
    document.querySelector('.cancel-add-role')!.addEventListener('click',()=>closeRoleForm('.add-role-container'));
    document.addEventListener('click', () => {
        let allEmployees: NodeListOf<HTMLDivElement> = document.querySelectorAll('.all-employees');
        allEmployees.forEach(empls => empls.style.display = "none")
    })
    let empCardOption:string[] = ['assign-employees', 'edit-assign-employees'];
    empCardOption.forEach((empCard) => {
        document.querySelector<HTMLInputElement>(`#${empCard}`)!.addEventListener('click', (event:Event) => {
            event.stopPropagation();
            let targetElement=event.target as HTMLInputElement;
            targetElement.parentElement!.querySelector<HTMLDivElement>('.all-employees')!.style.display = "block";
        })
        document.querySelector<HTMLInputElement>(`#${empCard}`)!.addEventListener('keyup', (event) => {
            let targetElement=event.target as HTMLInputElement;
            let searchValue:string = targetElement.value.toLowerCase()
            let allEmpList:NodeListOf<HTMLDivElement> = document.querySelectorAll('.employee-name-img');
            allEmpList.forEach((emp) => {
                emp.style.display = (emp.innerText.toLowerCase().startsWith(searchValue)) ? "block":"none";})
        })
    })
    document.querySelector<HTMLButtonElement>('.submit-add-role')!.addEventListener('click', (event:Event) => addRole(event, 'add'))
    document.querySelector<HTMLButtonElement>('.submit-edit-role')!.addEventListener("click", (event:Event) => {
        let triggeredButton=event.target as HTMLButtonElement;
        if (triggeredButton.innerText == "Edit") {
            triggeredButton.innerText = "Apply Changes";
            activateInput();
        }
        else {
            triggeredButton.type = "submit";
            addRole(event, 'edit');
        }
      });
      document.querySelector<HTMLButtonElement>('.cancel-edit-role')!.addEventListener("click", () => {
        activateInput(true);
        localStorage.removeItem('selectedRole');
        closeRoleForm('.edit-role-container');
      });
})

export function createRoleCard(data: RoleSample):void {
    const parent:HTMLDivElement = document.querySelector('.role-card-container')!;
    let roleCard:HTMLElement = createNewElement('div', ["role-card", "flex-container", "flex-col"])
    let roleName:HTMLElement = createNewElement('div', ["role-title-icon", "d-flex", "jus-content-btw", "w-100"])
    let roleTitle:HTMLElement = createNewElement('div', ['role-title'])
    roleTitle.textContent = data.role;
    let editIcon:HTMLElement = createNewElementWithAttr('img', [['src', "./assets/icons/edit.svg"], ['alt', 'edit-icon']])
    editIcon.addEventListener('click', (e:Event) => openEditRoleForm(e,'.edit-role-container'))
    roleName = addElementToParent(roleName, roleTitle, editIcon);
    let roleDetails:HTMLElement = createNewElement('div', ["w-100", "role-details", "flex-container", "flex-col"])
    let roleDepartment:HTMLElement = createNewElement('div', ["role-department", "d-flex", "jus-content-btw", "w-100"])
    let deptIcon:HTMLElement = createNewElement('div', ['dept-icon', 'd-flex'])
    let deptImg:HTMLElement = createNewElementWithAttr('img', [['src', "./assets/icons/emp-id.svg"], ['alt', 'department-icon']])
    const deptLabel = document.createTextNode("Department");
    deptIcon = addElementToParent(deptIcon, deptImg, deptLabel);
    let roleDeptName:HTMLElement = createNewElement('div', ['role-dept-name'])
    roleDeptName.textContent = data.dept;
    roleDepartment = addElementToParent(roleDepartment, deptIcon, roleDeptName);
    let roleLocation:HTMLElement = createNewElement('div', ['role-department', 'd-flex', 'jus-content-btw', 'w-100'])
    let locIcon:HTMLElement = createNewElement('div', ['dept-icon', 'd-flex'])
    let locImg:HTMLElement = createNewElementWithAttr('img', [['src', "./assets/icons/location.svg"], ['alt', 'location-icon']])
    const locLabel:Node = document.createTextNode("Location");
    locIcon = addElementToParent(locIcon, locImg, locLabel);
    let roleLocName:HTMLElement = createNewElement('div', ['role-dept-location'])
    roleLocName.textContent = data.location;
    roleLocation = addElementToParent(roleLocation, locIcon, roleLocName);
    let totalEmployee:HTMLElement = createNewElement('div', ['role-department', 'd-flex', 'jus-content-btw', 'w-100']);
    let totalLabel:HTMLElement = createNewElement('div', ['dept-icon'])
    totalLabel.textContent = "Total Employee";
    let emplProfileContainer:HTMLElement = createNewElement('div', ["empl-profile-container", "d-flex", "jus-content-btw"])
    if (data.profiles) {
        let minimumProfie:number = Math.min(data.profiles.length, 4);
        for (let i = 0; i < minimumProfie; i++) {
            const profileImg:HTMLImageElement = document.createElement("img");
            let profileEmpNo:string = data.profiles[i].empNo;
            let emp:EmployeeSample[] = employeeList.filter(employee => employee.empNo == profileEmpNo);
            if (emp.length == 0) {
                data.profiles.splice(i, 1)
                i--;
                continue;
            }
            profileImg.src = emp[0].img;
            profileImg.alt = "profile-img";
            profileImg.className = `profile-${i + 1}`;
            emplProfileContainer.appendChild(profileImg);
        }
        if (data.profiles.length > 4) {
            const plusEmployee:HTMLSpanElement = document.createElement("span");
            plusEmployee.className = "plus-employee flex-container";
            plusEmployee.innerText = `+${data.profiles.length - 4}`;
            emplProfileContainer.appendChild(plusEmployee);
        }
        else {
            let width:number = (data.profiles.length + 1) * 0.5;
            emplProfileContainer.style.width = `${width}rem`;
        }
    }
    totalEmployee = addElementToParent(totalEmployee, totalLabel, emplProfileContainer);
    roleDetails = addElementToParent(roleDetails, roleDepartment, roleLocation, totalEmployee)
    let viewAllContainer= createNewElement('a', ['anchor', 'view-all-container']) as HTMLAnchorElement
    viewAllContainer.href = `./role-details.html?selectedRole=${data.role}`;
    viewAllContainer.title = 'employee-page';
    let viewAll:HTMLElement = createNewElement('div', ['view-all-container', 'd-flex'])
    viewAll.innerText = "View all Employee";
    let rightArrow:HTMLElement = createNewElementWithAttr('img', [['src', "./assets/icons/vector.svg"], ['alt', 'right-arrow']])
    viewAll.appendChild(rightArrow);
    viewAllContainer.appendChild(viewAll)
    roleCard = addElementToParent(roleCard, roleName, roleDetails, viewAllContainer)
    parent.appendChild(roleCard);
}

export function activateInput(flag = false):void {
    let allDisabledInputs:string[] = ['edit-role-name', 'edit-role-dept', 'edit-role-desc', 'edit-role-location', 'edit-assign-employees'];
    allDisabledInputs.forEach(input => document.querySelector<HTMLFormElement>(`#${input}`)!.disabled = flag)
}

export function createDivBlock(element: HTMLElement):void {
    let selectedRole:string = JSON.parse(localStorage.getItem('selectedRole')!);
    let selectedRoleTitle:RoleSample[] = allRoles.filter(obj => obj.role == selectedRole);
    employeeList.forEach( emp => {
        if (emp.role == '')
            createEmployeeDiv(emp, element,false)
        if ((selectedRoleTitle.length != 0) && (emp.role == selectedRoleTitle[0].roleId)){
                createEmployeeDiv(emp, element, true)}
    })
}

function resetRoleFilter():void {
    resetFilter();
    filterSearch()
}

function filterCheck(role: HTMLDivElement, check: string):boolean {
    let status:HTMLInputElement = document.querySelector(`#${check}`)!;
    if (!status.value) return true;
    let selectedStatus:string[] = [];
    let allOptions: NodeListOf<HTMLInputElement> = status.parentElement!.querySelectorAll(".custom-option input");
    for (let option of allOptions) {
        if (option.checked)
            selectedStatus.push(option.value.toLowerCase());
    }
    let empStatus:string = (check == "department") ? role.querySelector<HTMLDivElement>(`.role-dept-name`)!.innerText.toLowerCase().replace(/[^a-zA-Z/ ]/g, "") : role.querySelector<HTMLDivElement>(`.role-dept-location`)!.innerText.toLowerCase();
    for (let i = 0; i < selectedStatus.length; i++) {
        if (selectedStatus[i] == empStatus)
            return true;
    }
    return false;
}

function filterSearch():void {
    let allRoles:HTMLDivElement = document.querySelector(".role-card-container")!;
    let role: NodeListOf<HTMLDivElement> = allRoles.querySelectorAll(".role-card");
    let count:number = 0;
    for (let i = 0; i < role.length; i++) {
        let deptCheck:boolean = filterCheck(role[i], "department");
        let locationCheck:boolean = filterCheck(role[i], "location");
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
