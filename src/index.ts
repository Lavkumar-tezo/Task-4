import  {EmployeeSample, EventMap, RoleSample } from "./common.js";
import { addEmployee, closeForm, displayImagePreview, openEditEmployeeForm, openEmployeeForm } from "./employee-form.js";
import { createNewElement, createNewElementWithAttr, addElementToParent, updateFilter, resetFilter, setElementAttribute } from "./module.js";

var employeeList: EmployeeSample[];
var allRoles: RoleSample[];

window.addEventListener("resize",()=> setTableHeight);

document.addEventListener("DOMContentLoaded", function () {
    employeeList = JSON.parse(localStorage.getItem('employeeList')!);
    allRoles = JSON.parse(localStorage.getItem('roles')!);
    employeeList.forEach(employee => insertEmployee(employee));
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
    document.querySelector('.export-btn')!.addEventListener('click', exportTableToExcel);
    document.querySelector('.employee-form')?.addEventListener("submit", (event:Event) => addEmployee(event, 'add'));
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
        document.querySelector(selector)?.addEventListener(eventListeners[selector].event, eventListeners[selector].callback);}
    document.querySelector('.edit-form-close')?.addEventListener("click", () => {
      activateEmployeeInput(true);
      document.querySelector<HTMLInputElement>('.final-edit-empl')!.innerText = "Edit";
      document.querySelector<HTMLInputElement>('.final-edit-empl')!.type = "button";
      localStorage.removeItem('selectedEmp');
        closeForm('.edit-employee-form-container',"edit-emp-role");
    });
    document.querySelector('#empl-img')!.addEventListener('change',()=> displayImagePreview("#empl-img",".employee-profile-img"));
    document.querySelector('#edit-empl-img')!.addEventListener('change',()=> displayImagePreview("#edit-empl-img",'.edit-employee-profile'));
    let allHeaders = document.querySelectorAll(".employee-table th")!;
    for (let i = 1; i < allHeaders.length - 1; i++) {
        allHeaders[i].addEventListener("click", () => {
            const tableElement =allHeaders[i].parentElement!.parentElement!.parentElement as HTMLTableElement;
            const headerIndex:number = Array.prototype.indexOf.call(allHeaders[i].parentElement!.children, allHeaders[i]);
            const currentIsAscending = allHeaders[i].classList.contains("th-sort-asc");
            sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
        });
    }
    document.querySelector(".dob-input")!.addEventListener("click", (event:Event) => {
        let input:HTMLInputElement = document.querySelector(".new-emp-dob")!;
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
    const currDate:Date = new Date();
    const todayDate:string = formatDate(currDate);
    const lastWeek:Date = new Date(currDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekDate:string = formatDate(lastWeek);
    let joinDateInput:HTMLInputElement = document.querySelector("#new-emp-join-date")!;
    joinDateInput.setAttribute("value", todayDate);
    joinDateInput.setAttribute("min", lastWeekDate);
    let dobInput:HTMLInputElement = document.querySelector("#new-emp-dob")!;
    dobInput.setAttribute("max", todayDate);
    let empDobInput:HTMLInputElement = document.querySelector("#edit-empl-dob")!;
    empDobInput.setAttribute('max', todayDate);
    document.querySelector<HTMLFormElement>('.final-edit-empl')!.addEventListener("click", (event:Event) => {
        let formBtnElement = event.target as HTMLFormElement;
        if (formBtnElement.innerText == "Edit") {
            formBtnElement.innerText = "Apply Changes";
            activateEmployeeInput();
        }
        else {
            formBtnElement.type = "submit";
            addEmployee(event, 'edit');
        }
    });
    document.querySelector<HTMLInputElement>('#search-input')!.addEventListener('keyup', tableSearch)
});

function toggleFilterSection():void {
    let filterSection:HTMLDivElement = document.querySelector(".reset-filter")!;
    let filterTitle:HTMLDivElement = document.querySelector(".toggle-filter-section")!;
    let filterIcon:HTMLImageElement = document.querySelector(".filter-icon")!;
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

function selectAllEmployee():void {
    let headCheckbox: HTMLInputElement = document.querySelector(".employee-select")!;
    let table: HTMLTableElement = document.querySelector(".employee-table-body")!;
    let tr: NodeListOf<HTMLTableRowElement> = table.querySelectorAll(".emp-table-row")!;
    let isChecked:boolean = headCheckbox.checked;
    for (let row of tr) {
        row.querySelector<HTMLInputElement>(".select")!.checked = isChecked;
    }
    changeTableDeleteBtnBG(isChecked ? "red" : "#F89191", false);
}

function formatDate(date: Date):string {
    const year:number = date.getFullYear();
    const month:string = (date.getMonth() + 1).toString().padStart(2, "0");
    const day:string = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function toggleEditOption(element: HTMLElement):void {
    let td:HTMLElement = element.parentElement!;
    let dots:Element = td.children[1];
    dots.classList.toggle("hide");
    document.addEventListener("click", function (event) {
        let triggredRow = event.target as HTMLElement
        let isOutside = !td.contains(triggredRow);
        (isOutside) ? dots.classList.add("hide"): "";
    });
}

export function activateEmployeeInput(flag = false):void {
    let allDisabledInputs:string[] = ['edit-empl-fname', 'edit-empl-lname', 'edit-empl-dob', 'edit-empl-email', 'edit-empl-mobile', 'edit-empl-join-date', 'edit-emp-location', 'edit-emp-dept', 'edit-emp-role', 'edit-emp-manager', 'edit-emp-project', 'edit-empl-img'];
    allDisabledInputs.forEach((input:string) => document.querySelector<HTMLFormElement>(`#${input}`)!.disabled = flag)
    let profileUploadBtn: HTMLButtonElement = document.querySelector('.profile-upload-btn')!;
    (!flag) ? profileUploadBtn.style.backgroundColor = "red" : profileUploadBtn.style.backgroundColor = "#f89191"
}

export function toggleStatus(e: Event):void {
    let selectedRow = e.target as HTMLElement;
    let status:HTMLSpanElement = selectedRow.parentElement!.parentElement!.parentElement!.querySelector(".employee-status-value")!;
    let isActive:boolean = status.innerText === "Active";
    status.innerText = isActive ? "In Active" : "Active";
    status.style.color = isActive ? "red" : "green";
    status.style.backgroundColor = isActive ? "#ffe6e6" : "#E7F4E8";
    selectedRow.parentElement!.classList.add("hide");
    (status.innerText == "Active") ? selectedRow.innerText = 'Mark as In active' : selectedRow.innerText = 'Mark as Active';
    filterSearch();
}

function setTableHeight():void {
    let contentDivHeight:number = document.querySelector<HTMLElement>(".content")!.offsetHeight;
    let serachBarHeight:number = document.querySelector<HTMLElement>(".search-container")!.offsetHeight;
    let employeeContainerHeight:number = document.querySelector<HTMLElement>(".employees-container")!.offsetHeight;
    let alphabetFilterHeight:number = document.querySelector<HTMLElement>(".alphabet-filter")!.offsetHeight;
    let resetFilterHeight:number = document.querySelector<HTMLElement>(".reset-filter")!.offsetHeight;
    let employeeTable:HTMLElement = document.querySelector(".employee-table-container")!;
    employeeTable.style.minHeight = `${contentDivHeight - serachBarHeight - employeeContainerHeight - alphabetFilterHeight - resetFilterHeight - 100}px`;
}

function resetEmployeeFilter():void {
    resetFilter();
    document.querySelectorAll(".alphabet.active-alphabet-filter")!.forEach(alpha=>alpha.classList.remove("active-alphabet-filter"));
    filterSearch();
}

export function insertEmployee(employee: EmployeeSample):void {
    let tr:HTMLElement = createNewElement("tr", ["emp-table-row"]);
    let tdCheckbox:HTMLElement = createNewElement("td", ["selected-employee"]);
    let inputCheckbox:HTMLElement = createNewElementWithAttr('input', [["type", "checkbox"], ["name", "select"]])
    inputCheckbox.classList.add("select");
    inputCheckbox.addEventListener("click", findSelectedRow);
    tdCheckbox.appendChild(inputCheckbox);
    let tdProfile:HTMLElement = createNewElement("td", ["d-flex", "jus-content-start", "emp-profile"]);
    let tdProfileContainer:HTMLElement = createNewElement("div", ["d-flex", 'empl-profile-detail']);
    let profilDiv:HTMLElement = createNewElement("div", ["emp-profile-container", "flex-container"]);
    (!employee.img) ? employee.img = "./assets/images/dummy-profile-image.jpg":"";
    let imgProfile:HTMLElement = createNewElementWithAttr("img", [["src", employee.img], ["alt", "employee-image"]]);
    imgProfile.classList.add("employee-img");
    profilDiv.appendChild(imgProfile)
    let divProfile:HTMLElement = createNewElement("div", ["employee-profile", "d-flex", "flex-col"]);
    let spanName:HTMLElement = createNewElement('span', ['employee-name']);
    let employeeName:string = `${employee.fname} ${employee.lname}`;
    spanName.textContent = employeeName;
    (employeeName.length > 18) ? spanName.setAttribute('title', employeeName) : spanName.setAttribute('title', '')
    let spanEmail:HTMLElement = createNewElement('span', ['employee-email']);
    spanEmail.textContent = employee.email;
    (employee.email.length > 18) ? spanEmail.setAttribute('title', employee.email) : spanEmail.setAttribute('title', '');
    divProfile = addElementToParent(divProfile, spanName, spanEmail)
    tdProfileContainer = addElementToParent(tdProfileContainer, profilDiv, divProfile);
    tdProfile.appendChild(tdProfileContainer);
    let tdLocation:HTMLElement = createNewElement('td', ['employee-location'])
    tdLocation.textContent = employee.location;
    let tdDepartment:HTMLElement = createNewElement('td', ['employee-department'])
    tdDepartment.textContent = employee.dept;
    let tdRole:HTMLElement = createNewElement('td', ['employee-role'])
    let roleDiv:HTMLElement = document.createElement('div');
    if (employee.role) {
        let roleName: string = '';
        for (let i = 0; i < allRoles.length; i++) {
            (allRoles[i].roleId == employee.role) ? roleName = allRoles[i].role:"";
        }
        roleDiv.textContent = roleName;
    }
    else
        roleDiv.textContent = 'N/A';
    tdRole.appendChild(roleDiv);
    let tdEmpNo:HTMLElement = createNewElement('td', ['employee-no']);
    tdEmpNo.textContent = employee.empNo;
    let tdStatus:HTMLElement = createNewElement('td', ['employee-status']);
    let spanStatus:HTMLElement = createNewElement("span", ["employee-status-value"]);
    spanStatus.textContent = employee.status ? employee.status : "Active";
    tdStatus.appendChild(spanStatus);
    let tdJoinDate:HTMLElement = createNewElement('td', ['employee-join-dt']);
    tdJoinDate.textContent = employee.joiningDate;
    let tdDots:HTMLElement = createNewElement('td', ['row-edit-container']);
    let btnDots:HTMLElement = createNewElement('button', ['three-dots']);
    btnDots.addEventListener("click", (e: Event) => toggleEditOption(e.currentTarget as HTMLElement));
    let imgDots:HTMLElement = createNewElementWithAttr('img', [["src", "./assets/icons/three-dot.svg"], ["alt", "three-dot"]]);
    btnDots.appendChild(imgDots);
    let editDiv:HTMLElement = createNewElement('div', ["empl-edit-options", "d-flex", "flex-col", "hide"]);
    let option1:HTMLElement = createNewElement('span', ['row-edit']);
    option1.innerText = "Edit";
    option1.addEventListener("click",(e:Event)=>{openEditEmployeeForm(".edit-employee-form-container","edit-emp-role",e)});
    let option2:HTMLElement = createNewElement('span', ['row-delete']);
    option2.innerText = "Delete";
    option2.addEventListener("click", deleteEmployeeRow);
    let option3:HTMLElement = createNewElement('option', ['status-change']);
    option3.innerText =(spanStatus.innerText=="Active")? "Mark as In Active":"Mark as Active";
    option3.addEventListener("click", (e: Event) => toggleStatus(e));
    editDiv = addElementToParent(editDiv, option1, option2, option3);
    tdDots = addElementToParent(tdDots, btnDots, editDiv);
    tr = addElementToParent(tr, tdCheckbox, tdProfile, tdLocation, tdDepartment, tdRole, tdEmpNo, tdStatus, tdJoinDate, tdDots);
    let table = document.getElementsByClassName("employee-table-body")[0];
    table.appendChild(tr);
}

function checkEmployeeStatus():void {
    let table:HTMLTableElement = document.querySelector(".employee-table-body")!;
    let tr:NodeListOf<HTMLTableRowElement> = table.querySelectorAll(".emp-table-row");
    for (let i = 0; i < tr.length; i++) {
        let employeeStatus: HTMLElement = tr[i].querySelector(".employee-status-value")!;
        if (employeeStatus.textContent!.toLowerCase() == "active") {
        } else {
            employeeStatus.style.color = "red";
            employeeStatus.style.backgroundColor = "#ffe6e6";
        }
    }
}

function alphabetSort(element: HTMLElement):void {
    let table: HTMLTableElement = document.querySelector(".employee-table-body")!;
    let tr: NodeListOf<HTMLTableRowElement> = table.querySelectorAll(".emp-table-row")!;
    let isActive:boolean = element.classList.contains("active-alphabet-filter");
    let alphabet:string = element.innerText.toLowerCase();
    if (isActive) {
        element.classList.remove("active-alphabet-filter");
        tr.forEach((row) => (row.style.display = "table-row"));
        localStorage.removeItem('selectedAlpha');
        document.querySelector('.no-records-container')!.classList.add('hide')
        filterSearch();
        return;
    }
    localStorage.setItem('selectedAlpha', JSON.stringify(alphabet));
    document.querySelectorAll(".alphabet").forEach(alphabet => alphabet.classList.remove("active-alphabet-filter"));
    element.classList.add("active-alphabet-filter");
    filterSearch()
}

function filterCheck(tr: HTMLTableRowElement, check: string, alpha = 'none'): boolean {
    if (alpha != 'none') {
        return (tr.querySelector(".employee-name")!.textContent!.toLowerCase().startsWith(alpha));
    }
    let status:HTMLInputElement = document.querySelector(`#${check}`)!;
    if (!status.value) return true;
    let selectedStatus:string[]=[];
    let allOptions: NodeListOf<HTMLInputElement> = status.parentElement!.querySelectorAll('.custom-option input');
    for (let option of allOptions) {
        if (option.checked) selectedStatus.push(option.value.toLowerCase());
    }
    let empStatus:HTMLTableCellElement = tr.querySelector(`.employee-${check}`)!;
    let empStatusValue: string = empStatus.innerText.toLowerCase();
    for (let i = 0; i < selectedStatus.length; i++) {
        if (selectedStatus[i] == empStatusValue) return true;
    }
    return false;
}

function filterSearch(): void {
    let table: HTMLTableElement = document.querySelector(".employee-table-body")!;
    let tr: NodeListOf<HTMLTableRowElement> = table.querySelectorAll(".emp-table-row")!;
    let selectedAlpha:string | null = localStorage.getItem('selectedAlpha');
    if (selectedAlpha)
        selectedAlpha = JSON.parse(selectedAlpha)
    let count:number = 0;
    for (let i = 0; i < tr.length; i++) {
        let alphacheck:boolean = true;
        if (selectedAlpha)
            alphacheck = filterCheck(tr[i], "status", selectedAlpha);
        let statusCheck:boolean = filterCheck(tr[i], 'status');
        let deptCheck:boolean = filterCheck(tr[i], 'department');
        let locationCheck:boolean = filterCheck(tr[i], 'location');
        if (statusCheck && deptCheck && locationCheck && alphacheck) {
            tr[i].style.display = "table-row";
            count++;
        }
        else
            tr[i].style.display = "none";
    }
    (count == 0) ? document.querySelector('.no-records-container')!.classList.remove('hide') : document.querySelector('.no-records-container')!.classList.add('hide');
}

function findSelectedRow(): number {
    let table: HTMLTableElement = document.querySelector(".employee-table-body")!;
    let tr: NodeListOf<HTMLTableRowElement> = table.querySelectorAll(".emp-table-row");
    let count:number = 0;
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
    }
    return count;
}

function changeTableDeleteBtnBG(color: string, flag = true): void {
    let tableDeleteBtn: HTMLButtonElement = document.querySelector(".table-delete-btn")!;
    tableDeleteBtn.style.backgroundColor = color;
    tableDeleteBtn.disabled = flag;
}

function showDeleteDialogBox(flag = false) {
    let count:string | number = (flag) ? "this" : findSelectedRow();
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
    let deleteRow:string | null = localStorage.getItem('deleteRow');
    if (deleteRow) {
        for (let i = 0; i < tr.length; i++){
            (tr[i].innerHTML == deleteRow)?deleteEmployee(tr[i]):"";}
        localStorage.removeItem('deleteRow')
        hideDeleteDialogBox()
        return;
    }
    for (let i = 0; i < tr.length; i++) {
        let rowCheck: HTMLInputElement = tr[i].querySelector(".select")!;
        (rowCheck.checked == true)?deleteEmployee(tr[i]):""
    }
    changeTableDeleteBtnBG("#F89191");
    let headCheckbox: HTMLInputElement = document.querySelector(".employee-select")!;
    headCheckbox.checked = false;
    hideDeleteDialogBox()
}

export function deleteEmployeeRow(e: Event) {
    let selctedRow = e.currentTarget as HTMLElement;
    let row:HTMLElement = selctedRow.parentElement!.parentElement!.parentElement!;
    showDeleteDialogBox(true);
    localStorage.setItem('deleteRow', row!.innerHTML)
}

function deleteEmployee(row: HTMLTableRowElement) {
    let rowEmpId:string = row.querySelector<HTMLTableElement>(".employee-no")!.innerText
    document.querySelector<HTMLTableElement>(".employee-table")!.deleteRow(row.rowIndex);
    let newEmps:EmployeeSample[] = employeeList.filter( employee => employee.empNo !== rowEmpId );
    employeeList = newEmps;
    localStorage.setItem('employeeList', JSON.stringify(employeeList))
}

function sortTableByColumn(table: HTMLTableElement, column: number, asc = true) {
    let dirModifier:number = asc ? 1 : -1;
    let tBody:HTMLTableSectionElement = table.tBodies[0];
    let rows:HTMLTableRowElement[] = Array.from(tBody.querySelectorAll<HTMLTableRowElement>(".emp-table-row"));
    let sortedRows:HTMLTableRowElement[];
    if (column == 7) {
        sortedRows = rows.sort((a: Element, b: Element) => {
            let aColText = a.querySelector(`td:nth-child(${column + 1})`)!.textContent?.trim().split("/").reverse().join("/")!;
            let bColText = b.querySelector(`td:nth-child(${column + 1})`)!.textContent?.trim().split("/").reverse().join("/")!;
            return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
        });
    }
    else {
        sortedRows = rows.sort((a, b) => {
            let aColText = a.querySelector(`td:nth-child(${column + 1})`)!.textContent?.trim()!;
            let bColText = b.querySelector(`td:nth-child(${column + 1})`)!.textContent?.trim()!;
            return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
        });
    }
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);}
    tBody.append(...sortedRows);
    table.querySelectorAll("th").forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${column + 1})`)!.classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${column + 1})`)!.classList.toggle("th-sort-desc", !asc);
}

  function exportTableToExcel() {
    var tableElement:HTMLTableElement = document.querySelector('.employee-table')!;
    var sourceData = "data:text/csv;charset=utf-8,";
    var i = 0;
    let row:HTMLTableRowElement;
    while (row = tableElement.rows[i]) {
      if (i == 0) {
sourceData += (['Name', 'Email',row.cells[2].innerText,row.cells[3].innerText,row.cells[4].innerText,row.cells[5].innerText,row.cells[6].innerText,row.cells[7].innerText,]).join(",") + "\r\n";}
      else {
        if (row.querySelectorAll('td').length != 1) {
          sourceData += ([row.cells[1].querySelector<HTMLTableCellElement>('.employee-name')!.innerText,row.cells[1].querySelector<HTMLTableCellElement>('.employee-email')!.innerText,row.cells[2].innerText,row.cells[3].innerText,row.cells[4].innerText,row.cells[5].innerText,row.cells[6].innerText,row.cells[7].innerText,]).join(",") + "\r\n";
        }
      }
      i++
    }
    window.location.href = encodeURI(sourceData);
  }

function tableSearch():void{
    let searchName:string = document.querySelector<HTMLInputElement>('#search-input')!.value.toLowerCase();
    let table: NodeListOf<HTMLTableRowElement> = document.querySelector('.employee-table-body')!.querySelectorAll('.emp-table-row')!;
    table.forEach((row) => row.style.display = (!row.querySelector<HTMLSpanElement>('.employee-name')!.innerText.toLowerCase().startsWith(searchName)) ? "none" : "table-row")
}
