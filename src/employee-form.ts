import {EmployeeSample, RoleSample } from "./common.js";
import { activateEmployeeInput, insertEmployee } from "./index.js";
import { changeElementDisplay, createNewElementWithAttr, createToastMessage, setElementAttribute, showValidInput } from "./module.js";

var employeeList: EmployeeSample[];
var allRoles: RoleSample[];

export function addRoleOption(form: HTMLFormElement, element: string):void {
  let select:HTMLSelectElement = form.querySelector(`#${element}`)!;
  let selectOption:HTMLElement= createNewElementWithAttr('option', [['value', ''], ['selected', "true"], ['hidden', "true"]])
  selectOption.innerText = "Select Role";
  select.appendChild(selectOption);
  allRoles = JSON.parse(localStorage.getItem('roles')!);
  allRoles.forEach((obj) => {
    let option:HTMLElement = createNewElementWithAttr('option', [['value', obj.role.toLowerCase()]])
    option.innerText = obj.role;
    select.appendChild(option);
  })
}

export function displayImagePreview(inputClass:string,outputClass:string):void {
  let imageInput2:HTMLInputElement = document.querySelector(`${inputClass}`)!;
  if (imageInput2.files) {
    let image2:File = imageInput2.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image2);
    reader.onload = function () {
      document.querySelector<HTMLImageElement>(`${outputClass}`)!.src = <string>reader.result;
    };
  }
}

export function closeForm(formClass: string, selectClass: string):void {
  let elementsToShow:string[] = ["employees-container", "alphabet-filter", "reset-filter",];
  elementsToShow.forEach((elementClass:string) => changeElementDisplay(`.${elementClass}`, 'flex'));
  let form:HTMLFormElement = document.querySelector(`${formClass}`)!;
  form.querySelector(`#${selectClass}`)!.innerHTML = "";
  changeElementDisplay(`${formClass}`, 'none');
  changeElementDisplay(".employee-table-container", 'block');
  validateField(form, false, 'none');
}

export function openEditEmployeeForm(formClass: string, selectClass: string, e: Event):void {
  openEmployeeForm(formClass, selectClass);
  let selectedRow = e.target as HTMLElement;
  let row:HTMLElement = selectedRow.parentElement!.parentElement!.parentElement!;
  let empId:string = row.querySelector<HTMLTableCellElement>('.employee-no')!.innerText;
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
      (element) ? element.value = setFormData[selector]:"";
    }
    let selectedEmpRole:RoleSample[] = allRoles.filter((role:RoleSample)=> role.roleId == selectedEmp?.role)
    document.querySelector<HTMLSelectElement>('#edit-emp-role')!.value=(selectedEmpRole.length != 0) ?selectedEmpRole[0].role.toLowerCase():""
    let selectedEmpDOB:string = `${selectedEmp.dob.substring(6, 11)}-${selectedEmp.dob.substring(3, 5)}-${selectedEmp.dob.substring(0, 2)}`;
    setElementAttribute('#edit-empl-dob', 'value', selectedEmpDOB);
    let selectedEmpJoinDate:string = `${selectedEmp.joiningDate.substring(6, 11)}-${selectedEmp.joiningDate.substring(3, 5)}-${selectedEmp.joiningDate.substring(0, 2)}`;
    setElementAttribute('#edit-empl-join-date', 'value', selectedEmpJoinDate);
    setElementAttribute('.edit-employee-profile', 'src', selectedEmp.img);
    activateEmployeeInput(true);
  }
}

export function openEmployeeForm(formClass: string, selectClass: string):void {
  let elementsToHide:string[] = ["employees-container", "alphabet-filter", "reset-filter", "employee-table-container",];
  elementsToHide.forEach((elementClass) => changeElementDisplay(`.${elementClass}`, 'none'));
  changeElementDisplay(`${formClass}`, 'block');
  let serachBarHeight:number = document.querySelector<HTMLDivElement>(".search-container")!.offsetHeight;
  let form = document.querySelector<HTMLFormElement>(`${formClass}`)!;
  form.style.top = `${serachBarHeight + 20}px`;
  addRoleOption(form, selectClass);
}

export function validateField(form:HTMLFormElement, flag = true, mode:string):number {
  employeeList = JSON.parse(localStorage.getItem('employeeList')!);
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
  let check:number = 1;
  for (let key in formInput) {
    let element:HTMLInputElement = formInput[key];
    if (element.name == 'empNo') {
      let empNo:string = element.value.toUpperCase()
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
      let empNum:string = element.value
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
      let email:string = element.value.toLowerCase();
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
    let element:HTMLSelectElement = formSelect[key];
    if (element.value == "" && element.name != 'role') {
      showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required field`, flag)
      check = 0;
    }
  }
  return check;
}

export function addEmployee(event:Event, mode:string):void {
  event.preventDefault();
  let form:HTMLFormElement = (mode=='add') ? document.querySelector<HTMLFormElement>(".employee-form")!:document.querySelector<HTMLFormElement>(".edit-employee-form")!;
  let check:number = validateField(form, true, mode);
  if (check == 0)
    return;
  let image:string=(mode == 'add') ? document.querySelector<HTMLImageElement>('.employee-profile-img')!.src : document.querySelector<HTMLImageElement>('.edit-employee-profile')!.src
  let newFormObject:Record<string,string | number>={}
  const formElements=Array.from(form.elements) as HTMLFormElement[];
  formElements.forEach((element) => {
      if (element.type == "date") {
        let value = <string>element.value.split("-");
        newFormObject[element.name] = `${value[2]}/${value[1]}/${value[0]}`;
      }
      else if (element.type == "file") {
        newFormObject[element.name] = (mode == 'add') ? document.querySelector<HTMLImageElement>('.employee-profile-img')!.src : document.querySelector<HTMLImageElement>('.edit-employee-profile')!.src
      }
      else if (element.name == 'role') {
        allRoles = JSON.parse(localStorage.getItem('roles')!);
        let allotedRoleId:RoleSample[] = allRoles.filter(function (obj):string | void {
          if (obj.role.toLowerCase() == element.value.toLowerCase())
            return obj.roleId;
        })
        if (allotedRoleId.length != 0)
          newFormObject[element.name] = allotedRoleId[0].roleId;
        else
          newFormObject[element.name] = '';
      }
      else if (element.name == 'empNo') {
        newFormObject[element.name] = element.value.toUpperCase();
      }
      else if (element.tagName.toLowerCase() == "select") {
        let optionText:string = element.options[element.selectedIndex].innerText;
        newFormObject[element.name] = optionText;
      } else if (element.type != "submit") {
        newFormObject[element.name] = element.value;
      }
  });
  let newObject:EmployeeSample={
    img:image,
    fname:<string>newFormObject.fname,
    lname:<string>newFormObject.lname,
    email:<string>newFormObject.email,
    location:newFormObject.location.toString().toUpperCase(),
    dept:<string>newFormObject.dept,
    empNo:<string>newFormObject.empNo,
    joiningDate:newFormObject.joiningDate.toString().split('-').reverse().join('/'),
    dob:<string>newFormObject.dob,
    projectAssigned:<string>newFormObject.projectAssigned,
    managerAssigned:<string>newFormObject.managerAssigned,
    mobile:<number>(newFormObject.mobile),
    status:'Active',
    role:<string>newFormObject.role
  };
  if (check) {
    if (mode == "edit") {
      let rowId:string = JSON.parse(localStorage.getItem("selectedEmp")!);
      let rowIndex:number = employeeList.findIndex( employee => employee.empNo == rowId);
      document.querySelector<HTMLTableElement>('.employee-table-body')!.deleteRow(rowIndex + 1);
      let newEmps:EmployeeSample[] = employeeList.filter(employee => employee.empNo !== rowId);
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
