import EmployeeSample from "./common.js";
export function changeElementDisplay(element: string, value: string): void {
    document.querySelector<HTMLElement>(`${element}`)!.style.display = value;
}

export function showValidInput(element: HTMLElement, message: string, flag: boolean): void {
    if (!flag) return hideRequiredMessage(element)
    element.style.borderColor = 'red';
    let parentDiv = element.parentElement as HTMLElement;
    let span = parentDiv.querySelector('span')!;
    span.innerHTML = message;
    span.style.color = 'red';
    element.addEventListener('change', (event: Event) => {
        hideRequiredMessage(event.currentTarget as HTMLElement);
    });
}

export function hideRequiredMessage(element: HTMLElement): void {
    element.style.borderColor = 'rgba(227,229,233,255)';
    let parentDiv = element.parentElement as HTMLElement;
    let span = parentDiv.querySelector('span');
    if (!span) {
        parentDiv = parentDiv.parentElement as HTMLElement;
        span = parentDiv.querySelector('span');
    }
    if (span) span.innerText = '';
}

export function setElementAttribute(element: string, attr: string, value: string): void {
    document.querySelector<HTMLElement>(`${element}`)!.setAttribute(`${attr}`, value)
}

export function hidePopUp(): void {
    let popup = document.querySelector('.toast');
    if (popup)
        popup.remove();
}

export function createToastMessage(message: string): void {
    let toastDiv = createNewElement('Div', ["toast", "flex-container"])
    let tickContainer = createNewElement('Div', ["toast-tick-container", "flex-container"])
    let tickImg = createNewElementWithAttr('Img', [['src', "./assets/icons/tick.svg"], ['alt', 'tick']]);
    let textSpan = document.createElement("span");
    textSpan.textContent = message;
    let crossContainer = createNewElement('Div', ["toast-cross-container", "flex-container"])
    let crossImg = createNewElementWithAttr('Img', [['src', "./assets/icons/cross.svg"], ['alt', 'cross']])
    crossContainer.addEventListener('click', hidePopUp);
    tickContainer.appendChild(tickImg);
    crossContainer.appendChild(crossImg);
    toastDiv = addElementToParent(toastDiv,tickContainer, textSpan,crossContainer)
    setTimeout(hidePopUp, 4500);
    let content = document.querySelector<HTMLDivElement>(".content")!;
    content.appendChild(toastDiv);
}

export function updateInput(event: HTMLElement, mainInput: string, parent: string): void {
    let input: NodeListOf<HTMLInputElement> = event.querySelectorAll(`.${mainInput} input`);
    let count = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i].checked) {
            count++;
        }
    }
    let customInput: HTMLInputElement | HTMLSpanElement = event.querySelector(`.${parent}`)!;
    (customInput instanceof HTMLSpanElement) ? customInput.innerText = count == 0 ? "" : `${count} selected` : customInput.value = count == 0 ? "" : `${count} selected`;

}

export function toggleOptions(event: HTMLDivElement, check: string): void {
    let customOptions: HTMLDivElement = event.querySelector(`.${check}`)!;
    if (customOptions.style.display === "block") {
        customOptions.style.display = "none";
    } else {
        customOptions.style.display = "block";
    }
}

export function createEmployeeDiv(employee: EmployeeSample, main: HTMLElement, flag = false): void {
    let div = createNewElement('Div', ["employee-name-img", "w-100"]) as HTMLDivElement;
    let label = createNewElement('Label', ["assignable-employee", "d-flex", "jus-content-btw"]) as HTMLLabelElement
    let detail = createNewElement('Div', ['assign-emp-detail', 'd-flex']) as HTMLDivElement
    let img = createNewElementWithAttr('Img', [['src', employee.img], ['alt', 'employee-image']]) as HTMLImageElement
    let span = document.createElement("Span");
    let employeeName = `${employee.fname} ${employee.lname}`
    span.textContent = `${employeeName} (${employee.empNo})`;
    (employeeName.length > 18) ? span.setAttribute('title', employeeName) : span.setAttribute('title', '')
    let input = createNewElementWithAttr('Input', [['type', 'checkbox']]) as HTMLInputElement;
    input.checked = flag;
    input.addEventListener('click', (event) => {
        let eventTriggredElement = event.target as HTMLElement;
        updateInput(eventTriggredElement.parentElement!.parentElement!.parentElement!.parentElement! as HTMLElement, 'all-employees', 'added-emp-number');
    })
    detail.appendChild(img);
    detail.appendChild(span);
    label.appendChild(detail);
    label.appendChild(input);
    div.appendChild(label);
    let empid = document.createElement("span");
    empid.innerText = employee.empNo;
    empid.classList.add('hide');
    div.appendChild(empid);
    main.appendChild(div);
}

export function createNewElement(type: string, classes: string[]): HTMLElement {
    let element = document.createElement(`${type}`);
    element.classList.add(...classes);
    return element;
}

export function createNewElementWithAttr(type: string, attrArray: string[][]): HTMLElement {
    let element = document.createElement(`${type}`);
    for (let i = 0; i < attrArray.length; i++)
        element.setAttribute(`${attrArray[i][0]}`, `${attrArray[i][1]}`)
    return element;
}

export function addElementToParent(parent: HTMLElement, ...child: HTMLElement[]): HTMLElement {
    child.forEach((elementOrArray) => parent.appendChild(elementOrArray));
    return parent;
}

export function updateFilter():void{
    let allFilterSelects = document.querySelectorAll('.custom-select');
    allFilterSelects.forEach((filter) => {
      var customInput:HTMLInputElement = filter.querySelector(".custom-input")!;
      var customOption = filter.querySelectorAll(".custom-option");
      customInput.addEventListener("focus", (event) => {
        let triggeredElement=event.target as HTMLInputElement;
        let selectedInputParent=triggeredElement.parentElement as HTMLDivElement;
        toggleOptions(selectedInputParent, 'custom-options');
      });
  
      for (var i = 0; i < customOption.length; i++) {
        customOption[i].querySelector('input')!.addEventListener("click", (event) => {
            let inputTriggeredTarget=event.target as HTMLInputElement;
          updateInput(inputTriggeredTarget.parentElement!.parentElement!.parentElement as HTMLElement, 'custom-option', 'custom-input')
        })
      }
  
      document.addEventListener("click", function (event) {
        var target = event.target! as HTMLElement;
        if (!filter.contains(target)) {
            let openedSelectFilter=filter.querySelector('.custom-options')! as HTMLDivElement;
            openedSelectFilter.style.display = "none";
        }
      });
    })
}

export function resetFilter() {
    localStorage.removeItem('selectedAlpha');
    let allFilterInput:NodeListOf<HTMLInputElement>=document.querySelectorAll(".filter-select .custom-input");
    allFilterInput.forEach((select) =>select.value = "");
    let allFilterCheckbox:NodeListOf<HTMLInputElement>=document.querySelectorAll(".filter-select .custom-option input");
    allFilterCheckbox.forEach((input) =>input.checked = false);
    
}

// export function validateField(form, flag = true, mode) {
//     const dangerInputName = {
//       "img": "Image",
//       "fname": "First Name",
//       "lname": "Last Name",
//       "email": "Email",
//       "location": "Location",
//       "dept": "Department",
//       "empNo": "Emp Number",
//       "status": "Status",
//       "joinDate": "Join Date",
//       "dob": "Date of Birth",
//       "projectAssigned": "Project",
//       "managerAssigned": "Manager",
//       "mobile": "Mobile Number",
//     }
//     let formInput = form.getElementsByTagName("input");
//     let check = 1;
//     for (let key in formInput) {
//       let element = formInput[key];
//       if (element.name == 'empNo') {
//         let empNo = element.value.toUpperCase()
//         if (empNo == "") {
//           showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required`, flag);
//           check = 0
//         }
//         else if (!empNo.startsWith("TZ")) {
//           showValidInput(element, `&#9888; employee Id Should start with TZ`, flag)
//           check = 0;
//         }
//         else if (!empNo.match(/^TZ[0-9]+$/)) {
//           showValidInput(element, `&#9888; ${dangerInputName[element.name]} should have number starting with TZ`, flag);
//           check = 0
//         }
//         else if (empNo.startsWith("TZ") && mode == 'add') {
//           for (let i = 0; i < employeeList.length; i++) {
//             if (employeeList[i].empNo == empNo) {
//               showValidInput(element, `&#9888;This Emp Number is already taken`, flag)
//               check = 0;
//             }
//           }
//         }
  
//       }
//       else if (element.type == 'number') {
//         let empNum = element.value
//         if (empNum == "") {
//           showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required`, flag);
//           check = 0
//         }
//         else if (empNum.length != 10) {
//           showValidInput(element, `&#9888; Mobile number should be of 10 digit`, true)
//           check = 0;
//         }
//       }
//       else if (element.type == 'email') {
//         let email = element.value.toLowerCase();
//         if (!email.endsWith("tezo.com")) {
//           showValidInput(element, `&#9888;Email should be of tezo`, flag)
//           check = 0;
//         }
//       }
//       if (element.value == "" && element.name != "dob" && element.type != "file") {
//         showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required`, flag);
//         check = 0;
//       }
//       else if (element.value == "" && element.type != "file") {
//         showValidInput(element.parentElement, `&#9888; ${dangerInputName[element.name]} is required`, flag);
//         check = 0;
//       }
//     }
//     let formSelect = form.getElementsByTagName('select');
//     for (let key in formSelect) {
//       let element = formSelect[key];
//       if (element.value == "" && element.name != 'role') {
//         showValidInput(element, `&#9888; ${dangerInputName[element.name]} is required field`, flag)
//         check = 0;
//       }
//     }
//     return check;
//   }

