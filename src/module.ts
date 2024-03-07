import {EmployeeSample} from "./common.js";

export function changeElementDisplay(element: string, value: string): void {
    document.querySelector<HTMLElement>(`${element}`)!.style.display = value;
}

export function showValidInput(element: HTMLElement, message: string, flag: boolean): void {
    if (!flag) return hideRequiredMessage(element)
    element.style.borderColor = 'red';
    let parentDiv:HTMLElement = element.parentElement!;
    let span:HTMLSpanElement = parentDiv.querySelector('span')!;
    span.innerHTML = message;
    span.style.color = 'red';
    element.addEventListener('change', (event: Event) => hideRequiredMessage(event.currentTarget as HTMLElement));
}

export function hideRequiredMessage(element: HTMLElement): void {
    element.style.borderColor = 'rgba(227,229,233,255)';
    let parentDiv:HTMLElement = element.parentElement!;
    let span:HTMLSpanElement | null = parentDiv.querySelector('span');
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
    let popup:HTMLElement | null = document.querySelector('.toast');
    if (popup)
        popup.remove();
}

export function createToastMessage(message: string): void {
    let toastDiv:HTMLElement = createNewElement('Div', ["toast", "flex-container"])
    let tickContainer:HTMLElement = createNewElement('Div', ["toast-tick-container", "flex-container"])
    let tickImg:HTMLElement = createNewElementWithAttr('Img', [['src', "./assets/icons/tick.svg"], ['alt', 'tick']]);
    let textSpan:HTMLElement = document.createElement("span");
    textSpan.textContent = message;
    let crossContainer:HTMLElement = createNewElement('Div', ["toast-cross-container", "flex-container"])
    let crossImg :HTMLElement= createNewElementWithAttr('Img', [['src', "./assets/icons/cross.svg"], ['alt', 'cross']])
    crossContainer.addEventListener('click', hidePopUp);
    tickContainer.appendChild(tickImg);
    crossContainer.appendChild(crossImg);
    toastDiv = addElementToParent(toastDiv,tickContainer, textSpan,crossContainer)
    setTimeout(hidePopUp, 4500);
    let content:HTMLDivElement = document.querySelector(".content")!;
    content.appendChild(toastDiv);
}

export function updateInput(event: HTMLElement, mainInput: string, parent: string): void {
    let input: NodeListOf<HTMLInputElement> = event.querySelectorAll(`.${mainInput} input`);
    let count:number = 0;
    for (let i = 0; i < input.length; i++) {
        (input[i].checked) ? count++:"";
    }
    let customInput: HTMLInputElement | HTMLSpanElement = event.querySelector(`.${parent}`)!;
    (customInput instanceof HTMLSpanElement) ? customInput.innerText = count == 0 ? "" : `${count} selected` : customInput.value = count == 0 ? "" : `${count} selected`;

}

export function toggleOptions(event: HTMLDivElement, check: string): void {
    let customOptions: HTMLDivElement = event.querySelector(`.${check}`)!;
    customOptions.style.display = (customOptions.style.display === "block") ? "none":"block";
}

export function createEmployeeDiv(employee: EmployeeSample, main: HTMLElement, flag:boolean): void {
    let div = createNewElement('Div', ["employee-name-img", "w-100"]) as HTMLDivElement;
    let label = createNewElement('Label', ["assignable-employee", "d-flex", "jus-content-btw"]) as HTMLLabelElement
    let detail = createNewElement('Div', ['assign-emp-detail', 'd-flex']) as HTMLDivElement
    let img = createNewElementWithAttr('Img', [['src', employee.img], ['alt', 'employee-image']]) as HTMLImageElement
    let span = document.createElement("Span");
    let employeeName:string = `${employee.fname} ${employee.lname}`
    span.textContent = `${employeeName} (${employee.empNo})`;
    (employeeName.length > 18) ? span.setAttribute('title', employeeName) : span.setAttribute('title', '')
    let input = createNewElementWithAttr('Input', [['type', 'checkbox']]) as HTMLInputElement;
    input.checked = flag;
    input.addEventListener('click', (event) => {
        let eventTriggredElement = event.target as HTMLElement;
        updateInput(eventTriggredElement.parentElement!.parentElement!.parentElement!.parentElement! as HTMLElement, 'all-employees', 'added-emp-number');
    })
    detail=addElementToParent(detail,img,span) as HTMLDivElement;
    label=addElementToParent(label,detail,input)as HTMLLabelElement;
    div.appendChild(label);
    let empid = document.createElement("span");
    empid.innerText = employee.empNo;
    empid.classList.add('hide');
    div.appendChild(empid);
    main.appendChild(div);
}

export function createNewElement(type: string, classes: string[]): HTMLElement {
    let element:HTMLElement = document.createElement(`${type}`);
    element.classList.add(...classes);
    return element;
}

export function createNewElementWithAttr(type: string, attrArray: string[][]): HTMLElement {
    let element:HTMLElement = document.createElement(`${type}`);
    for (let i = 0; i < attrArray.length; i++)
        element.setAttribute(`${attrArray[i][0]}`, `${attrArray[i][1]}`)
    return element;
}

export function addElementToParent(parent: HTMLElement, ...child: (HTMLElement | Node)[]): HTMLElement {
    child.forEach((elementOrArray) => parent.appendChild(elementOrArray));
    return parent;
}

export function updateFilter():void{
    let allFilterSelects:NodeListOf<HTMLDivElement> = document.querySelectorAll('.custom-select');
    allFilterSelects.forEach((filter) => {
      var customInput:HTMLInputElement = filter.querySelector(".custom-input")!;
      var customOption:NodeListOf<HTMLLabelElement> = filter.querySelectorAll(".custom-option");
      customInput.addEventListener("focus", (event:Event) => {
        let triggeredElement=event.target as HTMLInputElement;
        let selectedInputParent=triggeredElement.parentElement as HTMLDivElement;
        toggleOptions(selectedInputParent, 'custom-options');
      });
  
      for (var i = 0; i < customOption.length; i++) {
        customOption[i].querySelector('input')!.addEventListener("click", (event:Event) => {
            let inputTriggeredTarget=event.target as HTMLInputElement;
            updateInput(inputTriggeredTarget.parentElement!.parentElement!.parentElement as HTMLElement, 'custom-option', 'custom-input')
        })
      }
      document.addEventListener("click", function (event:Event) {
        var target = event.target! as HTMLElement;
        if (!filter.contains(target)) {
            let openedSelectFilter=filter.querySelector('.custom-options')! as HTMLDivElement;
            openedSelectFilter.style.display = "none";
        }
      });
    })
}

export function resetFilter():void {
    localStorage.removeItem('selectedAlpha');
    let allFilterInput:NodeListOf<HTMLInputElement>=document.querySelectorAll(".filter-select .custom-input");
    allFilterInput.forEach((select) =>select.value = "");
    let allFilterCheckbox:NodeListOf<HTMLInputElement>=document.querySelectorAll(".filter-select .custom-option input");
    allFilterCheckbox.forEach((input) =>input.checked = false);
}

