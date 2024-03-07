import { addEmployee, closeForm, displayImagePreview, openEditEmployeeForm, openEmployeeForm } from "./employee-form.js";
import { createNewElement, createNewElementWithAttr, addElementToParent, updateFilter, resetFilter, setElementAttribute } from "./module.js";
var employeeList;
var allRoles;
window.addEventListener("resize", () => setTableHeight);
document.addEventListener("DOMContentLoaded", function () {
    var _a, _b, _c;
    employeeList = JSON.parse(localStorage.getItem('employeeList'));
    allRoles = JSON.parse(localStorage.getItem('roles'));
    employeeList.forEach(employee => insertEmployee(employee));
    setTableHeight();
    localStorage.removeItem('selectedEmp');
    localStorage.removeItem('selectedAlpha');
    localStorage.removeItem('deleteRow');
    checkEmployeeStatus();
    let alphabet = document.querySelectorAll(".alphabet");
    for (let i = 0; i < alphabet.length; i++) {
        alphabet[i].addEventListener("click", (e) => { alphabetSort(e.currentTarget); });
    }
    updateFilter();
    document.querySelector('.export-btn').addEventListener('click', exportTableToExcel);
    (_a = document.querySelector('.employee-form')) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (event) => addEmployee(event, 'add'));
    const eventListeners = {
        ".filter-icon": { event: "click", callback: toggleFilterSection },
        '.reset-btn': { event: 'click', callback: resetEmployeeFilter },
        '.apply-btn': { event: 'click', callback: filterSearch },
        '.delete-row-btn': { event: 'click', callback: deleteSelectedEmployee },
        '.cancel-delete': { event: 'click', callback: hideDeleteDialogBox },
        '.delete-dialog-cross': { event: 'click', callback: hideDeleteDialogBox },
        '.employee-select': { event: 'click', callback: selectAllEmployee },
        '.cancel-new-empl': { event: 'click', callback: () => closeForm('.employee-form-container', 'select-role') },
        '.add-employee': { event: 'click', callback: () => openEmployeeForm('.employee-form-container', 'select-role') },
        '.table-delete-btn': { event: 'click', callback: () => showDeleteDialogBox(false) },
    };
    for (const selector in eventListeners) {
        (_b = document.querySelector(selector)) === null || _b === void 0 ? void 0 : _b.addEventListener(eventListeners[selector].event, eventListeners[selector].callback);
    }
    (_c = document.querySelector('.edit-form-close')) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        activateEmployeeInput(true);
        document.querySelector('.final-edit-empl').innerText = "Edit";
        document.querySelector('.final-edit-empl').type = "button";
        localStorage.removeItem('selectedEmp');
        closeForm('.edit-employee-form-container', "edit-emp-role");
    });
    document.querySelector('#empl-img').addEventListener('change', () => displayImagePreview("#empl-img", ".employee-profile-img"));
    document.querySelector('#edit-empl-img').addEventListener('change', () => displayImagePreview("#edit-empl-img", '.edit-employee-profile'));
    let allHeaders = document.querySelectorAll(".employee-table th");
    for (let i = 1; i < allHeaders.length - 1; i++) {
        allHeaders[i].addEventListener("click", () => {
            const tableElement = allHeaders[i].parentElement.parentElement.parentElement;
            const headerIndex = Array.prototype.indexOf.call(allHeaders[i].parentElement.children, allHeaders[i]);
            const currentIsAscending = allHeaders[i].classList.contains("th-sort-asc");
            sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
        });
    }
    document.querySelector(".dob-input").addEventListener("click", (event) => {
        let input = document.querySelector(".new-emp-dob");
        setElementAttribute("#new-emp-dob", "type", "date");
        input.focus();
        input.showPicker();
        let dobDiv = event.target;
        dobDiv.parentElement.style.borderColor = 'var(--blue)';
    });
    document.querySelector("#new-emp-dob").addEventListener("focus", (event) => {
        let input = event.target;
        setElementAttribute("#new-emp-dob", "type", "date");
        input.showPicker();
        input.parentElement.style.borderColor = 'var(--blue)';
    });
    document.querySelector("#new-emp-dob").addEventListener("blur", (event) => {
        let input = event.target;
        if (!input.value) {
            input.type = "text";
        }
        input.parentElement.style.borderColor = 'rgba(227,229,233,255)';
    });
    const currDate = new Date();
    const todayDate = formatDate(currDate);
    const lastWeek = new Date(currDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekDate = formatDate(lastWeek);
    let joinDateInput = document.querySelector("#new-emp-join-date");
    joinDateInput.setAttribute("value", todayDate);
    joinDateInput.setAttribute("min", lastWeekDate);
    let dobInput = document.querySelector("#new-emp-dob");
    dobInput.setAttribute("max", todayDate);
    let empDobInput = document.querySelector("#edit-empl-dob");
    empDobInput.setAttribute('max', todayDate);
    document.querySelector('.final-edit-empl').addEventListener("click", (event) => {
        let formBtnElement = event.target;
        if (formBtnElement.innerText == "Edit") {
            formBtnElement.innerText = "Apply Changes";
            activateEmployeeInput();
        }
        else {
            formBtnElement.type = "submit";
            addEmployee(event, 'edit');
        }
    });
    document.querySelector('#search-input').addEventListener('keyup', tableSearch);
});
function toggleFilterSection() {
    let filterSection = document.querySelector(".reset-filter");
    let filterTitle = document.querySelector(".toggle-filter-section");
    let filterIcon = document.querySelector(".filter-icon");
    filterSection.style.display =
        filterSection.style.display === "none" ? "flex" : "none";
    if (filterTitle.getAttribute("title") === "Hide Filter Section") {
        filterTitle.setAttribute("title", "Show Filter Section");
        filterIcon.src = filterIcon.src.replace("red", "black");
    }
    else {
        filterTitle.setAttribute("title", "Hide Filter Section");
        filterIcon.src = filterIcon.src.replace("black", "red");
    }
}
function selectAllEmployee() {
    let headCheckbox = document.querySelector(".employee-select");
    let table = document.querySelector(".employee-table-body");
    let tr = table.querySelectorAll(".emp-table-row");
    let isChecked = headCheckbox.checked;
    for (let row of tr) {
        row.querySelector(".select").checked = isChecked;
    }
    changeTableDeleteBtnBG(isChecked ? "red" : "#F89191", false);
}
function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}
export function toggleEditOption(element) {
    let td = element.parentElement;
    let dots = td.children[1];
    dots.classList.toggle("hide");
    document.addEventListener("click", function (event) {
        let triggredRow = event.target;
        let isOutside = !td.contains(triggredRow);
        (isOutside) ? dots.classList.add("hide") : "";
    });
}
export function activateEmployeeInput(flag = false) {
    let allDisabledInputs = ['edit-empl-fname', 'edit-empl-lname', 'edit-empl-dob', 'edit-empl-email', 'edit-empl-mobile', 'edit-empl-join-date', 'edit-emp-location', 'edit-emp-dept', 'edit-emp-role', 'edit-emp-manager', 'edit-emp-project', 'edit-empl-img'];
    allDisabledInputs.forEach((input) => document.querySelector(`#${input}`).disabled = flag);
    let profileUploadBtn = document.querySelector('.profile-upload-btn');
    (!flag) ? profileUploadBtn.style.backgroundColor = "red" : profileUploadBtn.style.backgroundColor = "#f89191";
}
export function toggleStatus(e) {
    let selectedRow = e.target;
    let status = selectedRow.parentElement.parentElement.parentElement.querySelector(".employee-status-value");
    let isActive = status.innerText === "Active";
    status.innerText = isActive ? "In Active" : "Active";
    status.style.color = isActive ? "red" : "green";
    status.style.backgroundColor = isActive ? "#ffe6e6" : "#E7F4E8";
    selectedRow.parentElement.classList.add("hide");
    (status.innerText == "Active") ? selectedRow.innerText = 'Mark as In active' : selectedRow.innerText = 'Mark as Active';
    filterSearch();
}
function setTableHeight() {
    let contentDivHeight = document.querySelector(".content").offsetHeight;
    let serachBarHeight = document.querySelector(".search-container").offsetHeight;
    let employeeContainerHeight = document.querySelector(".employees-container").offsetHeight;
    let alphabetFilterHeight = document.querySelector(".alphabet-filter").offsetHeight;
    let resetFilterHeight = document.querySelector(".reset-filter").offsetHeight;
    let employeeTable = document.querySelector(".employee-table-container");
    employeeTable.style.minHeight = `${contentDivHeight - serachBarHeight - employeeContainerHeight - alphabetFilterHeight - resetFilterHeight - 100}px`;
}
function resetEmployeeFilter() {
    resetFilter();
    document.querySelectorAll(".alphabet.active-alphabet-filter").forEach(alpha => alpha.classList.remove("active-alphabet-filter"));
    filterSearch();
}
export function insertEmployee(employee) {
    let tr = createNewElement("tr", ["emp-table-row"]);
    let tdCheckbox = createNewElement("td", ["selected-employee"]);
    let inputCheckbox = createNewElementWithAttr('input', [["type", "checkbox"], ["name", "select"]]);
    inputCheckbox.classList.add("select");
    inputCheckbox.addEventListener("click", findSelectedRow);
    tdCheckbox.appendChild(inputCheckbox);
    let tdProfile = createNewElement("td", ["d-flex", "jus-content-start", "emp-profile"]);
    let tdProfileContainer = createNewElement("div", ["d-flex", 'empl-profile-detail']);
    let profilDiv = createNewElement("div", ["emp-profile-container", "flex-container"]);
    (!employee.img) ? employee.img = "./assets/images/dummy-profile-image.jpg" : "";
    let imgProfile = createNewElementWithAttr("img", [["src", employee.img], ["alt", "employee-image"]]);
    imgProfile.classList.add("employee-img");
    profilDiv.appendChild(imgProfile);
    let divProfile = createNewElement("div", ["employee-profile", "d-flex", "flex-col"]);
    let spanName = createNewElement('span', ['employee-name']);
    let employeeName = `${employee.fname} ${employee.lname}`;
    spanName.textContent = employeeName;
    (employeeName.length > 18) ? spanName.setAttribute('title', employeeName) : spanName.setAttribute('title', '');
    let spanEmail = createNewElement('span', ['employee-email']);
    spanEmail.textContent = employee.email;
    (employee.email.length > 18) ? spanEmail.setAttribute('title', employee.email) : spanEmail.setAttribute('title', '');
    divProfile = addElementToParent(divProfile, spanName, spanEmail);
    tdProfileContainer = addElementToParent(tdProfileContainer, profilDiv, divProfile);
    tdProfile.appendChild(tdProfileContainer);
    let tdLocation = createNewElement('td', ['employee-location']);
    tdLocation.textContent = employee.location;
    let tdDepartment = createNewElement('td', ['employee-department']);
    tdDepartment.textContent = employee.dept;
    let tdRole = createNewElement('td', ['employee-role']);
    let roleDiv = document.createElement('div');
    if (employee.role) {
        let roleName = '';
        for (let i = 0; i < allRoles.length; i++) {
            (allRoles[i].roleId == employee.role) ? roleName = allRoles[i].role : "";
        }
        roleDiv.textContent = roleName;
    }
    else
        roleDiv.textContent = 'N/A';
    tdRole.appendChild(roleDiv);
    let tdEmpNo = createNewElement('td', ['employee-no']);
    tdEmpNo.textContent = employee.empNo;
    let tdStatus = createNewElement('td', ['employee-status']);
    let spanStatus = createNewElement("span", ["employee-status-value"]);
    spanStatus.textContent = employee.status ? employee.status : "Active";
    tdStatus.appendChild(spanStatus);
    let tdJoinDate = createNewElement('td', ['employee-join-dt']);
    tdJoinDate.textContent = employee.joiningDate;
    let tdDots = createNewElement('td', ['row-edit-container']);
    let btnDots = createNewElement('button', ['three-dots']);
    btnDots.addEventListener("click", (e) => toggleEditOption(e.currentTarget));
    let imgDots = createNewElementWithAttr('img', [["src", "./assets/icons/three-dot.svg"], ["alt", "three-dot"]]);
    btnDots.appendChild(imgDots);
    let editDiv = createNewElement('div', ["empl-edit-options", "d-flex", "flex-col", "hide"]);
    let option1 = createNewElement('span', ['row-edit']);
    option1.innerText = "Edit";
    option1.addEventListener("click", (e) => { openEditEmployeeForm(".edit-employee-form-container", "edit-emp-role", e); });
    let option2 = createNewElement('span', ['row-delete']);
    option2.innerText = "Delete";
    option2.addEventListener("click", deleteEmployeeRow);
    let option3 = createNewElement('option', ['status-change']);
    option3.innerText = (spanStatus.innerText == "Active") ? "Mark as In Active" : "Mark as Active";
    option3.addEventListener("click", (e) => toggleStatus(e));
    editDiv = addElementToParent(editDiv, option1, option2, option3);
    tdDots = addElementToParent(tdDots, btnDots, editDiv);
    tr = addElementToParent(tr, tdCheckbox, tdProfile, tdLocation, tdDepartment, tdRole, tdEmpNo, tdStatus, tdJoinDate, tdDots);
    let table = document.getElementsByClassName("employee-table-body")[0];
    table.appendChild(tr);
}
function checkEmployeeStatus() {
    let table = document.querySelector(".employee-table-body");
    let tr = table.querySelectorAll(".emp-table-row");
    for (let i = 0; i < tr.length; i++) {
        let employeeStatus = tr[i].querySelector(".employee-status-value");
        if (employeeStatus.textContent.toLowerCase() == "active") {
        }
        else {
            employeeStatus.style.color = "red";
            employeeStatus.style.backgroundColor = "#ffe6e6";
        }
    }
}
function alphabetSort(element) {
    let table = document.querySelector(".employee-table-body");
    let tr = table.querySelectorAll(".emp-table-row");
    let isActive = element.classList.contains("active-alphabet-filter");
    let alphabet = element.innerText.toLowerCase();
    if (isActive) {
        element.classList.remove("active-alphabet-filter");
        tr.forEach((row) => (row.style.display = "table-row"));
        localStorage.removeItem('selectedAlpha');
        document.querySelector('.no-records-container').classList.add('hide');
        filterSearch();
        return;
    }
    localStorage.setItem('selectedAlpha', JSON.stringify(alphabet));
    document.querySelectorAll(".alphabet").forEach(alphabet => alphabet.classList.remove("active-alphabet-filter"));
    element.classList.add("active-alphabet-filter");
    filterSearch();
}
function filterCheck(tr, check, alpha = 'none') {
    if (alpha != 'none') {
        return (tr.querySelector(".employee-name").textContent.toLowerCase().startsWith(alpha));
    }
    let status = document.querySelector(`#${check}`);
    if (!status.value)
        return true;
    let selectedStatus = [];
    let allOptions = status.parentElement.querySelectorAll('.custom-option input');
    for (let option of allOptions) {
        if (option.checked)
            selectedStatus.push(option.value.toLowerCase());
    }
    let empStatus = tr.querySelector(`.employee-${check}`);
    let empStatusValue = empStatus.innerText.toLowerCase();
    for (let i = 0; i < selectedStatus.length; i++) {
        if (selectedStatus[i] == empStatusValue)
            return true;
    }
    return false;
}
function filterSearch() {
    let table = document.querySelector(".employee-table-body");
    let tr = table.querySelectorAll(".emp-table-row");
    let selectedAlpha = localStorage.getItem('selectedAlpha');
    if (selectedAlpha)
        selectedAlpha = JSON.parse(selectedAlpha);
    let count = 0;
    for (let i = 0; i < tr.length; i++) {
        let alphacheck = true;
        if (selectedAlpha)
            alphacheck = filterCheck(tr[i], "status", selectedAlpha);
        let statusCheck = filterCheck(tr[i], 'status');
        let deptCheck = filterCheck(tr[i], 'department');
        let locationCheck = filterCheck(tr[i], 'location');
        if (statusCheck && deptCheck && locationCheck && alphacheck) {
            tr[i].style.display = "table-row";
            count++;
        }
        else
            tr[i].style.display = "none";
    }
    (count == 0) ? document.querySelector('.no-records-container').classList.remove('hide') : document.querySelector('.no-records-container').classList.add('hide');
}
function findSelectedRow() {
    let table = document.querySelector(".employee-table-body");
    let tr = table.querySelectorAll(".emp-table-row");
    let count = 0;
    for (let row of tr) {
        let rowCheck = row.querySelector(".select");
        if (rowCheck.checked) {
            changeTableDeleteBtnBG("red", false);
            count++;
        }
    }
    if (count == 0)
        changeTableDeleteBtnBG("#F89191");
    else {
        let headCheckbox = document.querySelector(".employee-select");
        headCheckbox.checked = (count == employeeList.length);
    }
    return count;
}
function changeTableDeleteBtnBG(color, flag = true) {
    let tableDeleteBtn = document.querySelector(".table-delete-btn");
    tableDeleteBtn.style.backgroundColor = color;
    tableDeleteBtn.disabled = flag;
}
function showDeleteDialogBox(flag = false) {
    let count = (flag) ? "this" : findSelectedRow();
    document.querySelector('.delete-pop-up').style.display = 'flex';
    document.querySelector('.delete-pop-up span').innerText = `Do you really want to delete ${count} row`;
    document.querySelector('.wrapper').style.filter = 'blur(4px)';
    document.querySelector('.wrapper').style.pointerEvents = 'none';
}
function hideDeleteDialogBox() {
    document.querySelector('.delete-pop-up').style.display = 'none';
    document.querySelector('.wrapper').style.filter = 'blur(0px)';
    document.querySelector('.wrapper').style.pointerEvents = 'auto';
}
function deleteSelectedEmployee() {
    let table = document.querySelector(".employee-table-body");
    let tr = table.querySelectorAll(".emp-table-row");
    let deleteRow = localStorage.getItem('deleteRow');
    if (deleteRow) {
        for (let i = 0; i < tr.length; i++) {
            (tr[i].innerHTML == deleteRow) ? deleteEmployee(tr[i]) : "";
        }
        localStorage.removeItem('deleteRow');
        hideDeleteDialogBox();
        return;
    }
    for (let i = 0; i < tr.length; i++) {
        let rowCheck = tr[i].querySelector(".select");
        (rowCheck.checked == true) ? deleteEmployee(tr[i]) : "";
    }
    changeTableDeleteBtnBG("#F89191");
    let headCheckbox = document.querySelector(".employee-select");
    headCheckbox.checked = false;
    hideDeleteDialogBox();
}
export function deleteEmployeeRow(e) {
    let selctedRow = e.currentTarget;
    let row = selctedRow.parentElement.parentElement.parentElement;
    showDeleteDialogBox(true);
    localStorage.setItem('deleteRow', row.innerHTML);
}
function deleteEmployee(row) {
    let rowEmpId = row.querySelector(".employee-no").innerText;
    document.querySelector(".employee-table").deleteRow(row.rowIndex);
    let newEmps = employeeList.filter(employee => employee.empNo !== rowEmpId);
    employeeList = newEmps;
    localStorage.setItem('employeeList', JSON.stringify(employeeList));
}
function sortTableByColumn(table, column, asc = true) {
    let dirModifier = asc ? 1 : -1;
    let tBody = table.tBodies[0];
    let rows = Array.from(tBody.querySelectorAll(".emp-table-row"));
    let sortedRows;
    if (column == 7) {
        sortedRows = rows.sort((a, b) => {
            var _a, _b;
            let aColText = (_a = a.querySelector(`td:nth-child(${column + 1})`).textContent) === null || _a === void 0 ? void 0 : _a.trim().split("/").reverse().join("/");
            let bColText = (_b = b.querySelector(`td:nth-child(${column + 1})`).textContent) === null || _b === void 0 ? void 0 : _b.trim().split("/").reverse().join("/");
            return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
        });
    }
    else {
        sortedRows = rows.sort((a, b) => {
            var _a, _b;
            let aColText = (_a = a.querySelector(`td:nth-child(${column + 1})`).textContent) === null || _a === void 0 ? void 0 : _a.trim();
            let bColText = (_b = b.querySelector(`td:nth-child(${column + 1})`).textContent) === null || _b === void 0 ? void 0 : _b.trim();
            return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
        });
    }
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }
    tBody.append(...sortedRows);
    table.querySelectorAll("th").forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
}
function exportTableToExcel() {
    var tableElement = document.querySelector('.employee-table');
    var sourceData = "data:text/csv;charset=utf-8,";
    var i = 0;
    let row;
    while (row = tableElement.rows[i]) {
        if (i == 0) {
            sourceData += (['Name', 'Email', row.cells[2].innerText, row.cells[3].innerText, row.cells[4].innerText, row.cells[5].innerText, row.cells[6].innerText, row.cells[7].innerText,]).join(",") + "\r\n";
        }
        else {
            if (row.querySelectorAll('td').length != 1) {
                sourceData += ([row.cells[1].querySelector('.employee-name').innerText, row.cells[1].querySelector('.employee-email').innerText, row.cells[2].innerText, row.cells[3].innerText, row.cells[4].innerText, row.cells[5].innerText, row.cells[6].innerText, row.cells[7].innerText,]).join(",") + "\r\n";
            }
        }
        i++;
    }
    window.location.href = encodeURI(sourceData);
}
function tableSearch() {
    let searchName = document.querySelector('#search-input').value.toLowerCase();
    let table = document.querySelector('.employee-table-body').querySelectorAll('.emp-table-row');
    table.forEach((row) => row.style.display = (!row.querySelector('.employee-name').innerText.toLowerCase().startsWith(searchName)) ? "none" : "table-row");
}
