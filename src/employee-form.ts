import EmployeeSample, { RoleSample } from "./common.js";
import { changeElementDisplay, createNewElementWithAttr } from "./module.js";

var employeeList: EmployeeSample[];
var allRoles: RoleSample[];

export function addRoleOption(form:HTMLFormElement, element:string) {
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

// export function displayImagePreview() {
//     let imageInput=document.querySelector("#empl-img")! as HTMLInputElement;
//     let image1 = imageInput.files[0];
//     if (image1) {
//       const reader = new FileReader();
//       reader.readAsDataURL(image1);
//       reader.onload = function () {
//         document.querySelector('.employee-profile-img').src = reader.result;
//       };
//     }
//     let image2 = document.getElementById("edit-empl-img").files[0];
//     if (image2) {
//       const reader = new FileReader();
//       reader.readAsDataURL(image2);
//       reader.onload = function () {
//         document.querySelector('.edit-employee-profile').src = reader.result;
//       };
//     }
//   }

export function closeForm(formClass:string,selectClass:string){
    let elementsToShow = ["employees-container", "alphabet-filter", "reset-filter",];
    elementsToShow.forEach((elementClass) => {
      changeElementDisplay(`.${elementClass}`, 'flex')
    });
    let form = document.querySelector<HTMLFormElement>(`${formClass}`)!;
    form.querySelector(`#${selectClass}`)!.innerHTML = "";
    changeElementDisplay(`${formClass}`, 'none')
    changeElementDisplay(".employee-table-container", 'block')
    //validateField(form, false, 'none')
}

export function openEditEmployeeForm(formClass:string,selectClass:string,e:Event) {
    openEmployeeForm(formClass,selectClass)
    // let selectedRow=e.target as HTMLElement;
    // let row = selectedRow.parentElement!.parentElement!.parentElement!;
    // let empId= row.querySelector<HTMLTableCellElement>('.employee-no')!.innerText;
    // let selectedEmp:EmployeeSample;
    // for (let i = 0; i < employeeList.length; i++) {
    //   if (employeeList[i].empNo == empId) {
    //     selectedEmp = employeeList[i];
    //     break;
    //   }
    // }
    //localStorage.setItem('selectedEmp', JSON.stringify(selectedEmp.empNo))
    // const setFormData = {
    //   "#edit-empl-no": selectedEmp.empNo,
    //   "#edit-empl-fname": selectedEmp.fname,
    //   "#edit-empl-lname": selectedEmp.lname,
    //   "#edit-empl-email": selectedEmp.email,
    //   "#edit-empl-mobile": selectedEmp.mobile,
    //   '#edit-emp-location': selectedEmp.location.toLowerCase(),
    //   '#edit-emp-manager': selectedEmp.managerAssigned.toLowerCase(),
    //   '#edit-emp-project': selectedEmp.projectAssigned.toLowerCase(),
    //   '#edit-emp-dept': selectedEmp.dept.toLowerCase(),
    // };
    // for (const selector in setFormData) {
    //   const element = document.querySelector(selector);
    //   if (element) {
    //     element.value = setFormData[selector];
    //   }
    // }
    // let selectedEmpRole = allRoles.filter(function (role) {
    //   return role.roleId == selectedEmp.role;
    // })
    // if (selectedEmpRole.length != 0)
    //   document.querySelector('#edit-emp-role').value = selectedEmpRole[0].role.toLowerCase();
    // else
    //   document.querySelector('#edit-emp-role').value = '';
    // let selectedEmpDOB = `${selectedEmp.dob.substring(6, 11)}-${selectedEmp.dob.substring(3, 5)}-${selectedEmp.dob.substring(0, 2)}`;
    // setElementAttribute('#edit-empl-dob', 'value', selectedEmpDOB)
    // let selectedEmpJoinDate = `${selectedEmp.joinDate.substring(6, 11)}-${selectedEmp.joinDate.substring(3, 5)}-${selectedEmp.joinDate.substring(0, 2)}`;
    // setElementAttribute('#edit-empl-join-date', 'value', selectedEmpJoinDate)
    // setElementAttribute('.edit-employee-profile', 'src', selectedEmp.img)
  }

export function openEmployeeForm(formClass:string,selectClass:string) {
    let elementsToHide = ["employees-container", "alphabet-filter", "reset-filter", "employee-table-container",];
    elementsToHide.forEach((elementClass) => changeElementDisplay(`.${elementClass}`, 'none'));
    changeElementDisplay(`${formClass}`, 'block')
    let serachBarHeight = document.querySelector<HTMLDivElement>(".search-container")!.offsetHeight;
    let form = document.querySelector<HTMLFormElement>(`${formClass}`)!;
    form.style.top = `${serachBarHeight + 20}px`;
    addRoleOption(form, selectClass);
  }