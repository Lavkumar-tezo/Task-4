import { activateEmployeeInput, insertEmployee } from "./index.js";
import { changeElementDisplay, createNewElementWithAttr, createToastMessage, setElementAttribute, showValidInput } from "./module.js";
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
export function displayImagePreview(inputClass, outputClass) {
    let imageInput2 = document.querySelector(`${inputClass}`);
    if (imageInput2.files) {
        let image2 = imageInput2.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image2);
        reader.onload = function () {
            document.querySelector(`${outputClass}`).src = reader.result;
        };
    }
}
export function closeForm(formClass, selectClass) {
    let elementsToShow = ["employees-container", "alphabet-filter", "reset-filter",];
    elementsToShow.forEach((elementClass) => changeElementDisplay(`.${elementClass}`, 'flex'));
    let form = document.querySelector(`${formClass}`);
    form.querySelector(`#${selectClass}`).innerHTML = "";
    changeElementDisplay(`${formClass}`, 'none');
    changeElementDisplay(".employee-table-container", 'block');
    validateField(form, false, 'none');
}
export function openEditEmployeeForm(formClass, selectClass, e) {
    openEmployeeForm(formClass, selectClass);
    let selectedRow = e.target;
    let row = selectedRow.parentElement.parentElement.parentElement;
    let empId = row.querySelector('.employee-no').innerText;
    let selectedEmp;
    employeeList = JSON.parse(localStorage.getItem('employeeList'));
    for (let i = 0; i < employeeList.length; i++) {
        if (employeeList[i].empNo == empId) {
            selectedEmp = employeeList[i];
            break;
        }
    }
    if (selectedEmp) {
        localStorage.setItem('selectedEmp', JSON.stringify(selectedEmp.empNo));
        const setFormData = {
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
            const element = document.querySelector(selector);
            (element) ? element.value = setFormData[selector] : "";
        }
        let selectedEmpRole = allRoles.filter((role) => role.roleId == (selectedEmp === null || selectedEmp === void 0 ? void 0 : selectedEmp.role));
        document.querySelector('#edit-emp-role').value = (selectedEmpRole.length != 0) ? selectedEmpRole[0].role.toLowerCase() : "";
        let selectedEmpDOB = `${selectedEmp.dob.substring(6, 11)}-${selectedEmp.dob.substring(3, 5)}-${selectedEmp.dob.substring(0, 2)}`;
        setElementAttribute('#edit-empl-dob', 'value', selectedEmpDOB);
        let selectedEmpJoinDate = `${selectedEmp.joiningDate.substring(6, 11)}-${selectedEmp.joiningDate.substring(3, 5)}-${selectedEmp.joiningDate.substring(0, 2)}`;
        setElementAttribute('#edit-empl-join-date', 'value', selectedEmpJoinDate);
        setElementAttribute('.edit-employee-profile', 'src', selectedEmp.img);
        activateEmployeeInput(true);
    }
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
export function validateField(form, flag = true, mode) {
    employeeList = JSON.parse(localStorage.getItem('employeeList'));
    const dangerInputName = {
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
    };
    let formInput = form.querySelectorAll("input");
    let check = 1;
    for (let key in formInput) {
        let element = formInput[key];
        if (element.name == 'empNo') {
            let empNo = element.value.toUpperCase();
            if (empNo == "") {
                showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required`, flag);
                check = 0;
            }
            else if (!empNo.startsWith("TZ")) {
                showValidInput(element, `&#9888; employee Id Should start with TZ`, flag);
                check = 0;
            }
            else if (!empNo.match(/^TZ[0-9]+$/)) {
                showValidInput(element, `&#9888; ${dangerInputName[element.name]} should have number starting with TZ`, flag);
                check = 0;
            }
            else if (empNo.startsWith("TZ") && mode == 'add') {
                for (let i = 0; i < employeeList.length; i++) {
                    if (employeeList[i].empNo == empNo) {
                        showValidInput(element, `&#9888;This Emp Number is already taken`, flag);
                        check = 0;
                    }
                }
            }
        }
        else if (element.type == 'number') {
            let empNum = element.value;
            if (empNum == "") {
                showValidInput(element, `&#9888;${dangerInputName[element.name]} is required`, flag);
                check = 0;
            }
            else if (empNum.length != 10) {
                showValidInput(element, `&#9888; ${dangerInputName[element.name]} should be of 10 digit`, true);
                check = 0;
            }
        }
        else if (element.type == 'email') {
            let email = element.value.toLowerCase();
            if (!email.endsWith("tezo.com")) {
                showValidInput(element, `&#9888;${dangerInputName[element.name]} should be of tezo`, flag);
                check = 0;
            }
        }
        if (element.value == "" && element.name != "dob" && element.type != "file") {
            showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required`, flag);
            check = 0;
        }
        else if (element.value == "" && element.type != "file") {
            showValidInput(element.parentElement, `&#9888; ${dangerInputName[element.name]} is required`, flag);
            check = 0;
        }
    }
    let formSelect = form.querySelectorAll('select');
    for (let key in formSelect) {
        let element = formSelect[key];
        if (element.value == "" && element.name != 'role') {
            showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required field`, flag);
            check = 0;
        }
    }
    return check;
}
export function addEmployee(event, mode) {
    event.preventDefault();
    let form = (mode == 'add') ? document.querySelector(".employee-form") : document.querySelector(".edit-employee-form");
    let check = validateField(form, true, mode);
    if (check == 0)
        return;
    let image = (mode == 'add') ? document.querySelector('.employee-profile-img').src : document.querySelector('.edit-employee-profile').src;
    let newFormObject = {};
    const formElements = Array.from(form.elements);
    formElements.forEach((element) => {
        if (element.type == "date") {
            let value = element.value.split("-");
            newFormObject[element.name] = `${value[2]}/${value[1]}/${value[0]}`;
        }
        else if (element.type == "file") {
            newFormObject[element.name] = (mode == 'add') ? document.querySelector('.employee-profile-img').src : document.querySelector('.edit-employee-profile').src;
        }
        else if (element.name == 'role') {
            allRoles = JSON.parse(localStorage.getItem('roles'));
            let allotedRoleId = allRoles.filter(function (obj) {
                if (obj.role.toLowerCase() == element.value.toLowerCase())
                    return obj.roleId;
            });
            if (allotedRoleId.length != 0)
                newFormObject[element.name] = allotedRoleId[0].roleId;
            else
                newFormObject[element.name] = '';
        }
        else if (element.name == 'empNo') {
            newFormObject[element.name] = element.value.toUpperCase();
        }
        else if (element.tagName.toLowerCase() == "select") {
            let optionText = element.options[element.selectedIndex].innerText;
            newFormObject[element.name] = optionText;
        }
        else if (element.type != "submit") {
            newFormObject[element.name] = element.value;
        }
    });
    let newObject = {
        img: image,
        fname: newFormObject.fname,
        lname: newFormObject.lname,
        email: newFormObject.email,
        location: newFormObject.location.toString().toUpperCase(),
        dept: newFormObject.dept,
        empNo: newFormObject.empNo,
        joiningDate: newFormObject.joiningDate.toString().split('-').reverse().join('/'),
        dob: newFormObject.dob,
        projectAssigned: newFormObject.projectAssigned,
        managerAssigned: newFormObject.managerAssigned,
        mobile: (newFormObject.mobile),
        status: 'Active',
        role: newFormObject.role
    };
    if (check) {
        if (mode == "edit") {
            let rowId = JSON.parse(localStorage.getItem("selectedEmp"));
            let rowIndex = employeeList.findIndex(employee => employee.empNo == rowId);
            document.querySelector('.employee-table-body').deleteRow(rowIndex + 1);
            let newEmps = employeeList.filter(employee => employee.empNo !== rowId);
            employeeList = newEmps;
            localStorage.setItem('employeeList', JSON.stringify(employeeList));
            localStorage.removeItem("selectedEmp");
        }
        if (newObject) {
            insertEmployee(newObject);
            employeeList.push(newObject);
        }
        document.querySelector('.final-edit-empl').innerText = 'Edit';
        localStorage.setItem('employeeList', JSON.stringify(employeeList));
        if (mode == 'add') {
            closeForm('.employee-form-container', 'select-role');
            createToastMessage('Employee Added');
        }
        else {
            closeForm('.edit-employee-form-container', "edit-emp-role");
            document.querySelector('.final-edit-empl').type = "button";
            createToastMessage('Changes Applied');
        }
        form.reset();
        form.querySelector('img').src = "./assets/images/dummy-profile-image.jpg";
    }
}
