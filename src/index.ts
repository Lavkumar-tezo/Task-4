import  {EmployeeSample, EventMap, RoleSample } from "./common.js";
import { closeForm, displayImagePreview, openEditEmployeeForm, openEmployeeForm } from "./employee-form.js";
import { createNewElement, createNewElementWithAttr, addElementToParent, updateFilter, resetFilter, setElementAttribute } from "./module.js";

var employeeList: EmployeeSample[];
var allRoles: RoleSample[];

window.addEventListener("resize", function () {
    document.querySelector<HTMLImageElement>('.logo')!.src = (window.matchMedia("(max-width: 720px)").matches) ? "./assets/images/tezo-logo-min.png" : "./assets/images/tezo-logo.png"
    setTableHeight()
})

document.addEventListener("DOMContentLoaded", function () {
    employeeList = JSON.parse(localStorage.getItem('employeeList')!);
    allRoles = JSON.parse(localStorage.getItem('roles')!);
    employeeList.forEach((empl) => {
        insertEmployee(empl)
    })
    setTableHeight();
    localStorage.removeItem('selectedEmp');
    localStorage.removeItem('selectedAlpha');
    localStorage.removeItem('deleteRow');
    checkEmployeeStatus();
    let alphabet: NodeListOf<HTMLDivElement> = document.querySelectorAll(".alphabet")!;
    for (let i = 0; i < alphabet.length; i++) {
        alphabet[i].addEventListener("click", (e: Event) => { alphabetSort(e.currentTarget as HTMLElement) });
    }
    updateFilter();
    //document.querySelector('.export-btn').addEventListener('click', exportTableToExcel);
    // document.querySelector('.employee-form')?.addEventListener("submit", (event) => {
    //   addEmployee(event, 'add');
    // });
    
    
    const eventListeners: EventMap = {
        ".filter-icon":{event:"click",callback: toggleFilterSection},
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
        document.querySelector(selector)?.addEventListener(eventListeners[selector].event, eventListeners[selector].callback);
    }
    document.querySelector('.edit-form-close')?.addEventListener("click", () => {
      activateInput(true);
      document.querySelector<HTMLInputElement>('.final-edit-empl')!.innerText = "Edit";
      document.querySelector<HTMLInputElement>('.final-edit-empl')!.type = "button";
      localStorage.removeItem('selectedEmp')
        closeForm('.edit-employee-form-container',"edit-emp-role");
    });
    document.querySelector('#empl-img')!.addEventListener('change', displayImagePreview);
    document.querySelector('#edit-empl-img')!.addEventListener('change', displayImagePreview);
    let allHeaders = document.querySelectorAll(".employee-table th")!;
    for (let i = 1; i < allHeaders.length - 1; i++) {
        allHeaders[i].addEventListener("click", () => {
            const tableElement =allHeaders[i].parentElement!.parentElement!.parentElement as HTMLTableElement;
            const headerIndex = Array.prototype.indexOf.call(allHeaders[i].parentElement!.children, allHeaders[i]);
            const currentIsAscending = allHeaders[i].classList.contains("th-sort-asc");
            sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
        });
    }
    document.querySelector(".dob-input")!.addEventListener("click", (event:Event) => {
        let input = document.querySelector<HTMLInputElement>(".new-emp-dob")!;
        setElementAttribute("#new-emp-dob", "type", "date")
        input.focus();
        input.showPicker();
        let dobDiv=event.target as HTMLElement;
        dobDiv.parentElement!.style.borderColor = 'var(--blue)';
      });
      document.querySelector<HTMLInputElement>("#new-emp-dob")!.addEventListener("focus", (event) => {
        let input = event.target as HTMLInputElement;
        setElementAttribute("#new-emp-dob", "type", "date")
        input.showPicker();
        input.parentElement!.style.borderColor = 'var(--blue)';
      });
      document.querySelector<HTMLInputElement>("#new-emp-dob")!.addEventListener("blur", (event) => {
        let input = event.target as HTMLInputElement;
        if (!input.value) {
          input.type = "text";
        }
        input.parentElement!.style.borderColor = 'rgba(227,229,233,255)';
      });
    const currDate = new Date();
    const todayDate = formatDate(currDate);
    const lastWeek = new Date(currDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekDate = formatDate(lastWeek);
    let joinDateInput = document.querySelector<HTMLInputElement>("#new-emp-join-date")!;
    joinDateInput.setAttribute("value", todayDate);
    joinDateInput.setAttribute("min", lastWeekDate);
    let dobInput = document.querySelector<HTMLInputElement>("#new-emp-dob")!;
    dobInput.setAttribute("max", todayDate);
    let empDobInput = document.querySelector<HTMLInputElement>("#edit-empl-dob")!;
    empDobInput.setAttribute('max', todayDate);
    let allRowEdit = document.querySelectorAll(".three-dots");
    allRowEdit.forEach((row) => {
        row.addEventListener("click", (e: Event) => toggleEditOption(e.currentTarget as HTMLElement));
    });
    let rowsDelete = document.querySelectorAll(".row-delete");
    rowsDelete.forEach((row) => {
        row.addEventListener("click", deleteEmployeeRow);
    });
    let rowsStatus: NodeListOf<HTMLOptionElement> = document.querySelectorAll(".status-change");
    rowsStatus.forEach((row) => {
        let parentRow = row.parentElement!.parentElement!.parentElement!;
        let rowStatusValue = parentRow.querySelector<HTMLTableCellElement>('.employee-status')!.innerText.toLowerCase();
        (rowStatusValue == 'active') ? rowStatusValue = "In active" : rowStatusValue = "Active"
        row.innerText = `Mark as ${rowStatusValue}`
        row.addEventListener("click", (e: Event) => toggleStatus(e));
    });
    let allRowEditForm: NodeListOf<HTMLOptionElement> = document.querySelectorAll(".row-edit");
    allRowEditForm.forEach((row) =>row.addEventListener("click",(e:Event)=>{openEditEmployeeForm(".edit-employee-form-container","edit-emp-role",e)}));
    document.querySelector<HTMLFormElement>('.final-edit-empl')!.addEventListener("click", (event) => {
        let formBtnElement = event.target as HTMLFormElement;
        if (formBtnElement.innerText == "Edit") {
            formBtnElement.innerText = "Apply Changes";
            activateInput();
        }
        else {
            formBtnElement.type = "submit";
            // addEmployee(event, 'edit');
        }
    });
    document.querySelector<HTMLInputElement>('#search-input')!.addEventListener('keyup', tableSearch)
});

function toggleFilterSection() {
    let filterSection = document.querySelector<HTMLDivElement>(".reset-filter")!;
    let filterTitle = document.querySelector<HTMLDivElement>(".toggle-filter-section")!;
    let filterIcon = document.querySelector<HTMLImageElement>(".filter-icon")!;
    filterSection.style.display =
      filterSection.style.display === "none" ? "flex" : "none";
    if (filterTitle.getAttribute("title") === "Hide Filter Section") {
      filterTitle.setAttribute("title", "Show Filter Section");
      filterIcon.src = filterIcon.src.replace("red", "black");
    } else {
      filterTitle.setAttribute("title", "Hide Filter Section");
      filterIcon.src = filterIcon.src.replace("black", "red");
    }
  }

function selectAllEmployee() {
    let headCheckbox: HTMLInputElement = document.querySelector(".employee-select")!;
    let table: HTMLTableElement = document.querySelector(".employee-table-body")!;
    let tr: NodeListOf<HTMLTableRowElement> = table.querySelectorAll(".emp-table-row")!;
    let isChecked = headCheckbox.checked;
    for (let row of tr) {
        row.querySelector<HTMLInputElement>(".select")!.checked = isChecked;
    }
    changeTableDeleteBtnBG(isChecked ? "red" : "#F89191", false);
}

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function toggleEditOption(element: HTMLElement) {
    let td = element.parentElement!;
    let dots = element.parentElement!.children[1];
    dots.classList.toggle("hide");
    document.addEventListener("click", function (event) {
        let triggredRow = event.target as HTMLElement
        let isOutside = !td.contains(triggredRow);
        if (isOutside) {
            dots.classList.add("hide");
        }
    });
}

function activateInput(flag = false) {
    let allDisabledInputs = ['edit-empl-fname', 'edit-empl-lname', 'edit-empl-dob', 'edit-empl-email', 'edit-empl-mobile', 'edit-empl-join-date', 'edit-emp-location', 'edit-emp-dept', 'edit-emp-role', 'edit-emp-manager', 'edit-emp-project', 'edit-empl-img'];
    allDisabledInputs.forEach((input) => {
        document.querySelector<HTMLFormElement>(`#${input}`)!.disabled = flag;
    })
    let profileUploadBtn: HTMLButtonElement = document.querySelector('.profile-upload-btn')!;
    (!flag) ? profileUploadBtn.style.backgroundColor = "red" : profileUploadBtn.style.backgroundColor = "#f89191"
}

export function toggleStatus(e: Event) {
    let selectedRow = e.target as HTMLElement;
    let status = selectedRow.parentElement!.parentElement!.parentElement!.querySelector(".employee-status-value")! as HTMLSpanElement;
    let isActive = status.innerText === "Active";
    status.innerText = isActive ? "In Active" : "Active";
    status.style.color = isActive ? "red" : "green";
    status.style.backgroundColor = isActive ? "#ffe6e6" : "#E7F4E8";
    selectedRow.parentElement!.classList.add("hide");
    (status.innerText == "Active") ? selectedRow.innerText = 'Mark as In active' : selectedRow.innerText = 'Mark as Active';
    filterSearch();
}

function setTableHeight() {
    let contentDivHeight = document.querySelector<HTMLElement>(".content")!.offsetHeight;
    let serachBarHeight = document.querySelector<HTMLElement>(".search-container")!.offsetHeight;
    let employeeContainerHeight = document.querySelector<HTMLElement>(".employees-container")!.offsetHeight;
    let alphabetFilterHeight = document.querySelector<HTMLElement>(".alphabet-filter")!.offsetHeight;
    let resetFilterHeight = document.querySelector<HTMLElement>(".reset-filter")!.offsetHeight;
    let employeeTable = document.querySelector<HTMLElement>(".employee-table-container")!;
    employeeTable.style.minHeight = `${contentDivHeight - serachBarHeight - employeeContainerHeight - alphabetFilterHeight - resetFilterHeight - 100}px`;
}

function resetEmployeeFilter() {
    resetFilter();
    document.querySelectorAll(".alphabet.active-alphabet-filter").forEach((el) => el.classList.remove("active-alphabet-filter"));
    filterSearch();
}

export function insertEmployee(employee: EmployeeSample) {
    let tr = createNewElement("tr", ["emp-table-row"]);
    let tdCheckbox = createNewElement("td", ["selected-employee"]);
    let inputCheckbox = createNewElementWithAttr('input', [["type", "checkbox"], ["name", "select"]])
    inputCheckbox.classList.add("select");
    inputCheckbox.addEventListener("click", findSelectedRow);
    tdCheckbox.appendChild(inputCheckbox);
    let tdProfile = createNewElement("td", ["d-flex", "jus-content-start", "emp-profile"]);
    let tdProfileContainer = createNewElement("div", ["d-flex", 'empl-profile-detail'])
    let profilDiv = createNewElement("div", ["emp-profile-container", "flex-container"])
    if (!employee.img) {
        employee.img = "./assets/images/dummy-profile-image.jpg"
    }
    let imgProfile = createNewElementWithAttr("img", [["src", employee.img], ["alt", "employee-image"]]);
    imgProfile.classList.add("employee-img");
    profilDiv.appendChild(imgProfile)
    let divProfile = createNewElement("div", ["employee-profile", "d-flex", "flex-col"]);
    let spanName = createNewElement('span', ['employee-name']);
    let employeeName = `${employee.fname} ${employee.lname}`;
    spanName.textContent = employeeName;
    (employeeName.length > 18) ? spanName.setAttribute('title', employeeName) : spanName.setAttribute('title', '')
    let spanEmail = createNewElement('span', ['employee-email']);
    spanEmail.textContent = employee.email;
    (employee.email.length > 18) ? spanEmail.setAttribute('title', employee.email) : spanEmail.setAttribute('title', '');
    divProfile = addElementToParent(divProfile, spanName, spanEmail)
    tdProfileContainer = addElementToParent(tdProfileContainer, profilDiv, divProfile);
    tdProfile.appendChild(tdProfileContainer);
    let tdLocation = createNewElement('td', ['employee-location'])
    tdLocation.textContent = employee.location;
    let tdDepartment = createNewElement('td', ['employee-department'])
    tdDepartment.textContent = employee.dept;
    let tdRole = createNewElement('td', ['employee-role'])
    let roleDiv = document.createElement('div');
    if (employee.role) {
        let roleName: string = '';
        for (let i = 0; i < allRoles.length; i++) {
            if (allRoles[i].roleId == employee.role)
                roleName = allRoles[i].role;
        }
        roleDiv.textContent = roleName;
    }
    else
        roleDiv.textContent = 'N/A';
    tdRole.appendChild(roleDiv)
    let tdEmpNo = createNewElement('td', ['employee-no']);
    tdEmpNo.textContent = employee.empNo;
    let tdStatus = createNewElement('td', ['employee-status'])
    let spanStatus = createNewElement("span", ["employee-status-value"])
    spanStatus.textContent = employee.status ? employee.status : "Active";
    tdStatus.appendChild(spanStatus)
    let tdJoinDate = createNewElement('td', ['employee-join-dt'])
    tdJoinDate.textContent = employee.joiningDate;
    let tdDots = createNewElement('td', ['row-edit-container'])
    let btnDots = createNewElement('button', ['three-dots'])
    let imgDots = createNewElementWithAttr('img', [["src", "./assets/icons/three-dot.svg"], ["alt", "three-dot"]])
    btnDots.appendChild(imgDots);
    let editDiv = createNewElement('div', ["empl-edit-options", "d-flex", "flex-col", "hide"])
    let option1 = createNewElement('span', ['row-edit'])
    option1.innerText = "Edit";
    let option2 = createNewElement('span', ['row-delete'])
    option2.innerText = "Delete";
    let option3 = createNewElement('option', ['status-change'])
    option3.innerText = "Mark as In Active";
    editDiv = addElementToParent(editDiv, option1, option2, option3);
    tdDots = addElementToParent(tdDots, btnDots, editDiv)
    tr = addElementToParent(tr, tdCheckbox, tdProfile, tdLocation, tdDepartment, tdRole, tdEmpNo, tdStatus, tdJoinDate, tdDots)
    let table = document.getElementsByClassName("employee-table-body")[0];
    table.appendChild(tr);
}

export function checkEmployeeStatus() {
    let table, tr, i;
    table = document.getElementsByClassName("employee-table-body");
    tr = table[0].getElementsByClassName("emp-table-row");
    for (i = 0; i < tr.length; i++) {
        let employeeStatus: HTMLElement = tr[i].querySelector(".employee-status-value")!;
        if (employeeStatus.textContent!.toLowerCase() == "active") {
        } else {
            employeeStatus.style.color = "red";
            employeeStatus.style.backgroundColor = "#ffe6e6";
        }
    }
}

function alphabetSort(element: HTMLElement) {
    let table: HTMLTableElement = document.querySelector(".employee-table-body")!;
    let tr: NodeListOf<HTMLTableRowElement> = table.querySelectorAll(".emp-table-row")!;
    let isActive = element.classList.contains("active-alphabet-filter");
    let alphabet = element.innerText.toLowerCase();
    if (isActive) {
        element.classList.remove("active-alphabet-filter");
        tr.forEach((row) => (row.style.display = "table-row"));
        localStorage.removeItem('selectedAlpha');
        document.querySelector('.no-records-container')!.classList.add('hide')
        filterSearch();
        return;
    }
    localStorage.setItem('selectedAlpha', JSON.stringify(alphabet));
    document
        .querySelectorAll(".alphabet")
        .forEach((alphabet) => alphabet.classList.remove("active-alphabet-filter"));
    element.classList.add("active-alphabet-filter");
    filterSearch()
}

function filterCheck(tr: HTMLTableRowElement, check: string, alpha = 'none'): boolean {
    if (alpha != 'none') {
        let rowName = tr.querySelector(".employee-name")!.textContent!.toLowerCase();
        return (rowName.startsWith(alpha))
    }
    let status = document.getElementById(check)! as HTMLInputElement;
    if (!status.value) return true;
    let selectedStatus = [];
    let allOptions: NodeListOf<HTMLInputElement> = status.parentElement!.querySelectorAll('.custom-option input');
    for (let option of allOptions) {
        if (option.checked) selectedStatus.push(option.value.toLowerCase());
    }
    let empStatus = tr.querySelector(`.employee-${check}`)! as HTMLTableCellElement;
    let empStatusValue: string = empStatus.innerText.toLowerCase();
    for (let i = 0; i < selectedStatus.length; i++) {
        if (selectedStatus[i] == empStatusValue) return true;
    }
    return false;
}

function filterSearch(): void {
    let table: HTMLTableElement = document.querySelector(".employee-table-body")!;
    let tr: NodeListOf<HTMLTableRowElement> = table.querySelectorAll(".emp-table-row")!;
    let selectedAlpha = localStorage.getItem('selectedAlpha');
    if (selectedAlpha)
        selectedAlpha = JSON.parse(selectedAlpha)
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
    (count == 0) ? document.querySelector('.no-records-container')!.classList.remove('hide') : document.querySelector('.no-records-container')!.classList.add('hide');
}

function findSelectedRow(): void | number {
    let table: HTMLTableElement = document.querySelector(".employee-table-body")!;
    let tr: NodeListOf<HTMLTableRowElement> = table.querySelectorAll(".emp-table-row");
    let count = 0;
    for (let row of tr) {
        let rowCheck: HTMLInputElement = row.querySelector(".select")!;
        if (rowCheck.checked) {
            changeTableDeleteBtnBG("red", false);
            count++;
        }
    }
    if (count == 0)
        changeTableDeleteBtnBG("#F89191",);
    else {
        let headCheckbox: HTMLInputElement = document.querySelector(".employee-select")!;
        headCheckbox.checked = (count == employeeList.length);
        return count;
    }
}

function changeTableDeleteBtnBG(color: string, flag = true): void {
    let tableDeleteBtn: HTMLButtonElement = document.querySelector(".table-delete-btn")!;
    tableDeleteBtn.style.backgroundColor = color;
    tableDeleteBtn.disabled = flag;
}

function showDeleteDialogBox(flag = false) {
    let count = (flag) ? "this" : findSelectedRow();
    document.querySelector<HTMLDivElement>('.delete-pop-up')!.style.display = 'flex';
    document.querySelector<HTMLSpanElement>('.delete-pop-up span')!.innerText = `Do you really want to delete ${count} row`;
    document.querySelector<HTMLDivElement>('.wrapper')!.style.filter = 'blur(4px)';
    document.querySelector<HTMLDivElement>('.wrapper')!.style.pointerEvents = 'none';
}

function hideDeleteDialogBox() {
    document.querySelector<HTMLDivElement>('.delete-pop-up')!.style.display = 'none';
    document.querySelector<HTMLDivElement>('.wrapper')!.style.filter = 'blur(0px)';
    document.querySelector<HTMLDivElement>('.wrapper')!.style.pointerEvents = 'auto';
}

function deleteSelectedEmployee() {
    let table: HTMLTableElement = document.querySelector(".employee-table-body")!;
    let tr: NodeListOf<HTMLTableRowElement> = table.querySelectorAll(".emp-table-row")!;
    let deleteRow = localStorage.getItem('deleteRow');
    if (deleteRow) {
        for (let i = 0; i < tr.length; i++) {
            if (tr[i].innerHTML == deleteRow)
                deleteEmployee(tr[i]);
        }
        localStorage.removeItem('deleteRow')
        hideDeleteDialogBox()
        return;

    }
    for (let i = 0; i < tr.length; i++) {
        let rowCheck: HTMLInputElement = tr[i].querySelector(".select")!;
        if (rowCheck.checked == true) {
            deleteEmployee(tr[i]);
            i--;
        }
    }
    changeTableDeleteBtnBG("#F89191");
    let headCheckbox: HTMLInputElement = document.querySelector(".employee-select")!;
    headCheckbox.checked = false;
    hideDeleteDialogBox()
}

export function deleteEmployeeRow(e: Event) {
    let selctedRow = e.currentTarget as HTMLElement;
    let row = selctedRow.parentElement!.parentElement!.parentElement;
    showDeleteDialogBox(true);
    localStorage.setItem('deleteRow', row!.innerHTML)
}

function deleteEmployee(row: HTMLTableRowElement) {
    let rowEmpId = row.querySelector<HTMLTableElement>(".employee-no")!.innerText
    document.querySelector<HTMLTableElement>(".employee-table")!.deleteRow(row.rowIndex);
    let newEmps = employeeList.filter((obj) => { return obj.empNo !== rowEmpId });
    employeeList = newEmps;
    localStorage.setItem('employeeList', JSON.stringify(employeeList))
}

function sortTableByColumn(table: HTMLTableElement, column: number, asc = true) {
    let dirModifier = asc ? 1 : -1;
    let tBody = table.tBodies[0];
    let rows = Array.from(tBody.querySelectorAll(".emp-table-row"));
    let sortedRows;
    if (column == 7) {
        sortedRows = rows.sort((a: Element, b: Element) => {
            let aColText = a
                .querySelector(`td:nth-child(${column + 1})`)!
                .textContent?.trim().split("/").reverse().join("/")!;
            let bColText = b
                .querySelector(`td:nth-child(${column + 1})`)!
                .textContent?.trim().split("/").reverse().join("/")!;
            return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
        });
    }
    else {
        sortedRows = rows.sort((a, b) => {
            let aColText = a
                .querySelector(`td:nth-child(${column + 1})`)!
                .textContent?.trim()!;
            let bColText = b
                .querySelector(`td:nth-child(${column + 1})`)!
                .textContent?.trim()!;
            return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
        });
    }
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }
    tBody.append(...sortedRows);
    table
        .querySelectorAll("th")
        .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table
        .querySelector(`th:nth-child(${column + 1})`)!
        .classList.toggle("th-sort-asc", asc);
    table
        .querySelector(`th:nth-child(${column + 1})`)!
        .classList.toggle("th-sort-desc", !asc);
}

//   function exportTableToExcel() {
//     var tableElement:HTMLTableElement = document.querySelector('.employee-table')!;
//     var sourceData = "data:text/csv;charset=utf-8,";
//     var i = 0;
//     while (row = tableElement.rows[i]) {
//       if (i == 0) {
// sourceData += (['Name', 'Email',row.cells[2].innerText,row.cells[3].innerText,row.cells[4].innerText,row.cells[5].innerText,row.cells[6].innerText,row.cells[7].innerText,]).join(",") + "\r\n";}
//       else {
//         if (row.querySelectorAll('td').length != 1) {
//           sourceData += ([row.cells[1].querySelector('.employee-name').innerText,row.cells[1].querySelector('.employee-email').innerText,row.cells[2].innerText,row.cells[3].innerText,row.cells[4].innerText,row.cells[5].innerText,row.cells[6].innerText,row.cells[7].innerText,]).join(",") + "\r\n";
//         }
//       }
//       i++
//     }
//     window.location.href = encodeURI(sourceData);
//   }

function tableSearch() {
    let searchName = document.querySelector<HTMLInputElement>('#search-input')!.value.toLowerCase();
    let table: NodeListOf<HTMLTableRowElement> = document.querySelector('.employee-table-body')!.querySelectorAll('.emp-table-row')!;
    table.forEach((row) => {
        row.style.display = (!row.querySelector<HTMLSpanElement>('.employee-name')!.innerText.toLowerCase().startsWith(searchName)) ? "none" : "table-row";
    })
}
