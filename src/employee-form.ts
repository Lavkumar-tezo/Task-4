import {EmployeeSample, RoleSample } from "./common.js";
import { checkEmployeeStatus, deleteEmployeeRow, insertEmployee, toggleEditOption, toggleStatus } from "./index.js";
import { changeElementDisplay, createNewElementWithAttr, createToastMessage, setElementAttribute, showValidInput } from "./module.js";

var employeeList: EmployeeSample[];
var allRoles: RoleSample[];

export function addRoleOption(form: HTMLFormElement, element: string) {
  let select = form.querySelector<HTMLSelectElement>(`#${element}`)!;
  let selectOption = createNewElementWithAttr('option', [['value', ''], ['selected', "true"], ['hidden', "true"]])
  selectOption.innerText = "Select Role";
  select.appendChild(selectOption);
  allRoles = JSON.parse(localStorage.getItem('roles')!);
  allRoles.forEach((obj) => {
    let option = createNewElementWithAttr('option', [['value', obj.role.toLowerCase()]])
    option.innerText = obj.role;
    select.appendChild(option);
  })
}

export function displayImagePreview() {
  let imageInput = document.querySelector("#empl-img")! as HTMLInputElement;
  if (imageInput.files) {
    let image1 = imageInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image1);
    reader.onload = function () {
      document.querySelector<HTMLImageElement>('.employee-profile-img')!.src = <string>reader.result;
    };
  }
  imageInput = document.querySelector("#edit-empl-img")! as HTMLInputElement;
  if (imageInput.files) {
    let image2 = imageInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image2);
    reader.onload = function () {
      document.querySelector<HTMLImageElement>('.edit-employee-profile')!.src = <string>reader.result;
    };
  }
}

export function closeForm(formClass: string, selectClass: string) {
  let elementsToShow = ["employees-container", "alphabet-filter", "reset-filter",];
  elementsToShow.forEach((elementClass) => {
    changeElementDisplay(`.${elementClass}`, 'flex')
  });
  let form = document.querySelector<HTMLFormElement>(`${formClass}`)!;
  form.querySelector(`#${selectClass}`)!.innerHTML = "";
  changeElementDisplay(`${formClass}`, 'none')
  changeElementDisplay(".employee-table-container", 'block')
  validateField(form, false, 'none')
}

export function openEditEmployeeForm(formClass: string, selectClass: string, e: Event) {
  openEmployeeForm(formClass, selectClass)
  let selectedRow = e.target as HTMLElement;
  let row = selectedRow.parentElement!.parentElement!.parentElement!;
  let empId = row.querySelector<HTMLTableCellElement>('.employee-no')!.innerText;
  let selectedEmp: EmployeeSample | undefined;
  employeeList = JSON.parse(localStorage.getItem('employeeList')!);
  for (let i = 0; i < employeeList.length; i++) {
    if (employeeList[i].empNo == empId) {
      selectedEmp = employeeList[i];
      break;
    }
  }
  if (selectedEmp) {
    localStorage.setItem('selectedEmp', JSON.stringify(selectedEmp.empNo))
    const setFormData: Record<string, string | number> = {
      "#edit-empl-no": selectedEmp.empNo,
      "#edit-empl-fname": selectedEmp.fname,
      "#edit-empl-lname": selectedEmp.lname,
      "#edit-empl-email": selectedEmp.email,
      "#edit-empl-mobile": selectedEmp.mobile,
      '#edit-emp-location': selectedEmp.location.toLowerCase(),
      '#edit-emp-manager': selectedEmp.managerAssigned.toLowerCase(),
      '#edit-emp-project': selectedEmp.projectAssigned.toLowerCase(),
      '#edit-emp-dept': selectedEmp.dept.toLowerCase(),
    };
    for (const selector in setFormData) {
      const element = document.querySelector(selector) as HTMLFormElement;
      if (element) {
        element.value = setFormData[selector];
      }
    }
    let selectedEmpRole = allRoles.filter(function (role:RoleSample) {
      return role.roleId == selectedEmp?.role;
    })
    document.querySelector<HTMLSelectElement>('#edit-emp-role')!.value=(selectedEmpRole.length != 0) ?selectedEmpRole[0].role.toLowerCase():""
    let selectedEmpDOB = `${selectedEmp.dob.substring(6, 11)}-${selectedEmp.dob.substring(3, 5)}-${selectedEmp.dob.substring(0, 2)}`;
    setElementAttribute('#edit-empl-dob', 'value', selectedEmpDOB)
    let selectedEmpJoinDate = `${selectedEmp.joiningDate.substring(6, 11)}-${selectedEmp.joiningDate.substring(3, 5)}-${selectedEmp.joiningDate.substring(0, 2)}`;
    setElementAttribute('#edit-empl-join-date', 'value', selectedEmpJoinDate)
    setElementAttribute('.edit-employee-profile', 'src', selectedEmp.img)
  }
}

export function openEmployeeForm(formClass: string, selectClass: string) {
  let elementsToHide = ["employees-container", "alphabet-filter", "reset-filter", "employee-table-container",];
  elementsToHide.forEach((elementClass) => changeElementDisplay(`.${elementClass}`, 'none'));
  changeElementDisplay(`${formClass}`, 'block')
  let serachBarHeight = document.querySelector<HTMLDivElement>(".search-container")!.offsetHeight;
  let form = document.querySelector<HTMLFormElement>(`${formClass}`)!;
  form.style.top = `${serachBarHeight + 20}px`;
  addRoleOption(form, selectClass);
}

export function validateField(form:HTMLFormElement, flag = true, mode:string) {
  const dangerInputName:Record<string,string> = {
    "img": "Image",
    "fname": "First Name",
    "lname": "Last Name",
    "email": "Email",
    "location": "Location",
    "dept": "Department",
    "empNo": "Emp Number",
    "status": "Status",
    "joiningDate": "Join Date",
    "dob": "Date of Birth",
    "projectAssigned": "Project",
    "managerAssigned": "Manager",
    "mobile": "Mobile Number",
  }
  let formInput:NodeListOf<HTMLInputElement> = form.querySelectorAll("input");
  let check = 1;
  for (let key in formInput) {
    let element = formInput[key] as HTMLInputElement;
    if (element.name == 'empNo') {
      let empNo = element.value.toUpperCase()
      if (empNo == "") {
        showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required`, flag);
        check = 0;
      }
      else if (!empNo.startsWith("TZ")) {
        showValidInput(element, `&#9888; employee Id Should start with TZ`, flag)
        check = 0;
      }
      else if (!empNo.match(/^TZ[0-9]+$/)) {
        showValidInput(element, `&#9888; ${dangerInputName[element.name]} should have number starting with TZ`, flag);
        check = 0
      }
      else if (empNo.startsWith("TZ") && mode == 'add') {
        for (let i = 0; i < employeeList.length; i++) {
          if (employeeList[i].empNo == empNo) {
            showValidInput(element, `&#9888;This Emp Number is already taken`, flag)
            check = 0;
          }
        }
      }

    }
    else if (element.type == 'number') {
      let empNum = element.value
      if (empNum == "") {
        showValidInput(element, `&#9888;${dangerInputName[element.name]} is required`, flag);
        check = 0
      }
      else if (empNum.length != 10) {
        showValidInput(element, `&#9888; ${dangerInputName[element.name]} should be of 10 digit`, true)
        check = 0;
      }
    }
    else if (element.type == 'email') {
      let email = element.value.toLowerCase();
      if (!email.endsWith("tezo.com")) {
        showValidInput(element, `&#9888;${dangerInputName[element.name]} should be of tezo`, flag)
        check = 0;
      }
    }
    if (element.value == "" && element.name != "dob" && element.type != "file") {
      showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required`, flag);
      check = 0;
    }
    else if (element.value == "" && element.type != "file") {
      showValidInput(element.parentElement!, `&#9888; ${dangerInputName[element.name]} is required`, flag);
      check = 0;
    }
  }
  let formSelect:NodeListOf<HTMLSelectElement> = form.querySelectorAll('select');
  for (let key in formSelect) {
    let element = formSelect[key] as HTMLSelectElement;
    if (element.value == "" && element.name != 'role') {
      showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required field`, flag)
      check = 0;
    }
  }
  return check;
}

export function addEmployee(event:Event, mode:string) {
  event.preventDefault();
  let form:HTMLFormElement;
  if (mode == 'add') {
    form = document.querySelector<HTMLFormElement>(".employee-form")!;
  }
  else {
    form = document.querySelector<HTMLFormElement>(".edit-employee-form")!;
  }
  let check = validateField(form, true, mode);
  if (check == 0)
    return;
  let image:File;
  let imagefile= (mode == 'add') ?document.querySelector<HTMLInputElement>("#empl-img")!.files:document.querySelector<HTMLInputElement>("edit-empl-img")!.files;
  if(imagefile)
    image=imagefile[0];

  if (check) {
    if (mode == "edit") {
      let rowId = JSON.parse(localStorage.getItem("selectedEmp")!);
      let rowIndex = employeeList.findIndex(
        (employee) => employee.empNo == rowId
      );
      document.querySelector<HTMLTableElement>('.employee-table-body')!.deleteRow(rowIndex + 1);
      let newEmps = employeeList.filter(function (obj) {
        return obj.empNo !== rowId;
      });
      // activateInput(true);
      employeeList = newEmps;
      localStorage.setItem('employeeList', JSON.stringify(employeeList))
      localStorage.removeItem("selectedEmp");
    }
    if(newObject){
      insertEmployee(newObject);
      employeeList.push(newObject);
    }
    document.querySelector<HTMLButtonElement>('.final-edit-empl')!.innerText = 'Edit'
    localStorage.setItem('employeeList', JSON.stringify(employeeList))
    let row = document.getElementsByClassName("three-dots");
    row[row.length - 1].addEventListener("click",(e:Event)=> toggleEditOption(e.target as HTMLElement));
    let rowDelete = document.getElementsByClassName("row-delete");
    rowDelete[rowDelete.length - 1].addEventListener("click", deleteEmployeeRow);
    let rowStatus = document.getElementsByClassName("status-change");
    rowStatus[rowStatus.length - 1].addEventListener("click", toggleStatus);
    let rowEditForm = document.getElementsByClassName("row-edit");
    rowEditForm[rowEditForm.length - 1].addEventListener("click",(e:Event)=>{openEditEmployeeForm(".edit-employee-form-container","edit-emp-role",e)});
    checkEmployeeStatus();
    if (mode == 'add') {
      closeForm('.employee-form-container', 'select-role');
      createToastMessage('Employee Added')
    }
    else {
      closeForm('.edit-employee-form-container',"edit-emp-role")
      document.querySelector<HTMLFormElement>('.final-edit-empl')!.type = "button";
      createToastMessage('Changes Applied');
    }
    form.reset();
    form.querySelector('img')!.src = "./assets/images/dummy-profile-image.jpg";
  }
}