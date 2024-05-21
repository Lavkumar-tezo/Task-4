import { EmployeeSample, RoleSample } from "./common.js";
import { changeElementDisplay, createToastMessage, showValidInput } from "./module.js";
import { activateInput, createDivBlock, createRoleCard } from "./role.js";

var allRoles: RoleSample[];
var employeeList: EmployeeSample[];

export function openAddRoleForm(formClass: string):void {
    let elementsToHide:string[] = ["employees-container", "reset-filter", "role-card-container"];
    elementsToHide.forEach((elementClass) => changeElementDisplay(`.${elementClass}`, "none"));
    let form: HTMLFormElement = document.querySelector(`${formClass}`)!;
    changeElementDisplay(`${formClass}`, 'block');
    let serachBarHeight:number = document.querySelector<HTMLDivElement>(".search-container")!.offsetHeight;
    document.querySelector<HTMLFormElement>(`${formClass}`)!.style.top = `${serachBarHeight + 20}px`;
    let allEmployeeContainer: HTMLDivElement = form.querySelector('.all-employees')!;
    allEmployeeContainer.innerHTML = "";
    createDivBlock(allEmployeeContainer);
}

export function closeRoleForm(formClass: string):void {
    let display: Record<string, string> = {
        ".reset-filter": "flex",
        ".employees-container": "flex",
        ".role-card-container": "grid",
    };
    for (let element in display) {
        changeElementDisplay(`${element}`, display[element])
    }
    changeElementDisplay(`${formClass}`, 'none')
    let form: HTMLFormElement = document.querySelector(`${formClass} form`)!;
    form.reset();
    form.querySelector<HTMLSpanElement>('.added-emp-number')!.innerText = ''
    let allEmployeeContainer: HTMLDivElement = form.querySelector('.all-employees')!;
    allEmployeeContainer.innerHTML = "";
    allEmployeeContainer.style.display = 'none';
    validateField(form, false);
    document.querySelector<HTMLButtonElement>('.submit-edit-role')!.innerText = "Edit";
    document.querySelector<HTMLButtonElement>('.submit-edit-role')!.type = "button";
    activateInput(true);
}

export function openEditRoleForm(event: Event, formClass: string):void {
    openAddRoleForm(formClass);
    let triggredElement = event.target as HTMLFormElement;
    let roleTitle:string = triggredElement.parentElement!.querySelector<HTMLDivElement>('.role-title')!.innerText;
    allRoles = JSON.parse(localStorage.getItem('roles')!)
    let selectedRoleDetail:RoleSample[] = allRoles.filter(obj => obj.role == roleTitle);
    localStorage.setItem('selectedRole', JSON.stringify(roleTitle));
    let form: HTMLFormElement = document.querySelector(`${formClass}`)!;
    let initialEmp:number | undefined = selectedRoleDetail[0].profiles?.length;
    if (initialEmp)
        form.querySelector<HTMLSpanElement>('.added-emp-number')!.innerText = `${initialEmp} selected`
    let editObject: Record<string, string | undefined> = {
        'edit-role-name': selectedRoleDetail[0].role,
        'edit-role-dept': selectedRoleDetail[0].dept.toLowerCase(),
        'edit-role-desc': selectedRoleDetail[0].desc?.toLowerCase(),
        'edit-role-location': selectedRoleDetail[0].location.toLowerCase()
    }
    for (const selector in editObject) {
        const element: HTMLFormElement = document.querySelector(`#${selector}`)!;
        (element) ? element.value = editObject[selector]:"";
    }
    let allEmployeeContainer: HTMLDivElement = form.querySelector('.all-employees')!;
    allEmployeeContainer.innerHTML = "";
    createDivBlock(allEmployeeContainer);
}

function validateField(form: HTMLFormElement, flag = true):number {
    let check:number = 1;
    allRoles = JSON.parse(localStorage.getItem('roles')!);
    const DangerInput:string[] = ["role", "dept", "desc", "location",];
    let formInputs = Array.from(form.elements)! as HTMLFormElement[];
    let formInput = formInputs.filter((input):Element | void =>{
        let inputName = input.getAttribute('name');
        let find = (inputName) ? DangerInput.indexOf(inputName?.toLowerCase()):-1;
        if (find != -1)
            return input;
    })
    for (let key in formInput) {
        let element:HTMLFormElement = formInput[key];
        if (element.name == 'desc') {
            continue;
        }
        else if (element.value == "") {
            showValidInput(element, `&#9888; ${DangerInput[key]} is required`, flag);
            check = 0;
        }
        else if (element.name == 'role') {
            let newRoleName: string = element.value.trim().toLowerCase();
            if (!newRoleName.match(/^[a-zA-Z ]+$/)) {
                showValidInput(element, `&#9888; role name should have alphabets`, flag);
                check = 0;
            }
            let selectedRole = JSON.parse(localStorage.getItem('selectedRole')!);
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

export function addRole(event: Event, mode: string) {
    event.preventDefault();
    employeeList = JSON.parse(localStorage.getItem('employeeList')!);
    allRoles = JSON.parse(localStorage.getItem('roles')!)
    let form:HTMLFormElement=(mode=='add') ? document.querySelector(".add-role")!:document.querySelector(".edit-role")!;
    let check = validateField(form, true);
    if (check == 0)
        return;
    let newFormObject: Record<string, string> = {}
    let element:HTMLFormElement = form.querySelector('[name="role"]')!;
    newFormObject[element.name] = element.value;
    element = form.querySelector('[name="desc"]')!;
    newFormObject[element.name] = element.value;
    element = form.querySelector('[name="location"]')!;
    let optionText:string = element.options[element.selectedIndex].innerText;
    newFormObject[element.name] = optionText;
    element = form.querySelector('[name="dept"]')!;
    optionText = element.options[element.selectedIndex].innerText;
    newFormObject[element.name] = optionText;
    let allEmpList:NodeListOf<HTMLDivElement> = form.querySelectorAll('.employee-name-img')!;
    let allAllotedEmp: Record<string, EmployeeSample[]> = {
        profile: []
    }
    allEmpList.forEach((emp) => {
        let input:HTMLInputElement = emp.querySelector('input')!;
        if (input.checked) {
            let empId:string = emp.querySelector<HTMLSpanElement>('.hide')!.innerText;
            for (let employee of employeeList) {
                if (employee.empNo == empId) {
                    allAllotedEmp.profile.push(employee);
                    break;
                }
            }
        }
    })
    let newRoleId:string = getNewRoleId();
    let newRole: RoleSample = {
        role: newFormObject.role,
        dept: newFormObject.dept,
        desc: newFormObject.desc,
        location: newFormObject.location,
        profiles: allAllotedEmp.profile,
        roleId: newRoleId
    }
    if (mode == "edit") {
        let selectedRole:string = JSON.parse(localStorage.getItem("selectedRole")!).toLowerCase();
        let allRoleCard:NodeListOf<HTMLDivElement> = document.querySelectorAll('.role-card')
        allRoleCard.forEach( roleCard => {
            let roleCardTitle:string = roleCard.querySelector<HTMLDivElement>('.role-title')!.innerText.toLowerCase();
            (roleCardTitle == selectedRole) ? roleCard.remove():"";
        })
        let selectedRoleDetails:RoleSample[] = allRoles.filter(obj => obj.role.toLowerCase() == selectedRole);
        let selectedRoleId:string = selectedRoleDetails[0].roleId;
        employeeList.forEach((empl) => {
            if (empl.role == selectedRoleId)
                empl.role = ''
        })
        localStorage.setItem('employeeList', JSON.stringify(employeeList));
        let newRoles:RoleSample[] = allRoles.filter(obj => obj.role.toLowerCase() !== selectedRole);
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
        createToastMessage('Role Added')
    }
    else {
        closeRoleForm('.edit-role-container');
        createToastMessage('Changes Applied')
    }
}

function getNewRoleId(): string {
    allRoles = JSON.parse(localStorage.getItem('roles')!);
    let sortedRole:RoleSample[] = allRoles.sort((a, b) => a.roleId > b.roleId ? 1 : -1)
    let highestRoleId:string = sortedRole[sortedRole.length - 1].roleId;
    let highestRoleNum:string = highestRoleId.substring(2, highestRoleId.length);
    return `IN${Number(highestRoleNum) + 1}`;
}

function addRoleToEmployee(roleId: string, newRole: RoleSample) {
    employeeList = JSON.parse(localStorage.getItem('employeeList')!);
    if (newRole.profiles) {
        for (let i = 0; i < newRole.profiles.length; i++) {
            let empl:EmployeeSample = newRole.profiles[i];
            for (let employee of employeeList) {
                if (employee.empNo == empl.empNo) {
                    employee.role = roleId;
                }
            }
        }
    }
    localStorage.setItem('employeeList', JSON.stringify(employeeList));
}
