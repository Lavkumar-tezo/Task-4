let isSidebarCollpased:boolean=false;
let isUpdateVisible:boolean=true;
var employeeList:EmployeeSample[] = [
    {
        "img": "./assets/images/profile.webp",
        "fname": "Rajesh",
        "lname": "Singh",
        "email": "rajesh.singh@tezo.com",
        "location": "HYDERABAD",
        "dept": "Product Engg",
        "role": "IN124",
        "empNo": "TZ876543",
        "status": "Active",
        "joiningDate": "12/03/2019",
        "dob": "17/01/2004",
        "projectAssigned": "dummy project 1",
        "managerAssigned": "manager 1",
        "mobile": 1212121212,
        "dots": "./assets/icons/three-dot.svg"
    },
    {
        "img": "./assets/images/dummy-profile-image.jpg",
        "fname": "Lisa",
        "lname": "Smith",
        "email": "lisa.smith@tezo.com",
        "location": "USA",
        "dept": "UI/UX",
        "role": "IN122",
        "empNo": "TZ123456",
        "status": "In Active",
        "joiningDate": "05/06/2018",
        "dob": "17/01/2004",
        "projectAssigned": "dummy project 1",
        "managerAssigned": "manager 1",
        "mobile": 1212121212,
        "dots": "./assets/icons/three-dot.svg"
    },
    {
        "img": "./assets/images/dummy-profile-image.jpg",
        "fname": "Emily",
        "lname": "Jones",
        "email": "emily.jones@tezo.com",
        "location": "USA",
        "dept": "Product Engg",
        "role": "IN128",
        "empNo": "TZ345678",
        "status": "In Active",
        "joiningDate": "15/07/2017",
        "dob": "17/01/2004",
        "projectAssigned": "dummy project 1",
        "managerAssigned": "manager 1",
        "mobile": 1212121212,
        "dots": "./assets/icons/three-dot.svg"
    }
];

var allRoles:RoleSample[] = [
    {
        "role": "Customer Service Manager",
        "roleId": "IN125",
        "desc": "",
        "dept": "IT",
        "location": "Hyderabad",
    },
    {
        "role": "UX Designer",
        "roleId": "IN128",
        "desc": "",
        "dept": "Product Engg",
        "location": "Hyderabad",
    },
    {
        "role": "Assistant Backend Designer",
        "roleId": "IN130",
        "desc": "",
        "dept": "UI/UX",
        "location": "Hyderabad",
    },
    {
        "role": "Human Resource Manager",
        "roleId": "IN135",
        "desc": "",
        "dept": "IT",
        "location": "Hyderabad",
    },
    {
        "role": "Front End Developer",
        "roleId": "IN124",
        "desc": "",
        "dept": "Product Engg",
        "location": "Hyderabad",
    },
    {
        "role": "Senior Developer",
        "roleId": "IN122",
        "desc": "",
        "dept": "UI/UX",
        "location": "Hyderabad",
    }
];

document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector<HTMLImageElement>('.logo')!.src = (window.matchMedia("(max-width: 720px)").matches) ? "./assets/images/tezo-logo-min.png" : "./assets/images/tezo-logo.png"
    let storedAllEmps: string | null= localStorage.getItem('employeeList');   
    (storedAllEmps) ? employeeList = JSON.parse(storedAllEmps):localStorage.setItem('employeeList', JSON.stringify(employeeList));
    let storedAllroles: string | null=localStorage.getItem('roles');  
    (storedAllroles)?allRoles = JSON.parse(storedAllroles):localStorage.setItem('roles', JSON.stringify(allRoles));
    document.querySelector<HTMLImageElement>('.sidebar-min-icon')!.addEventListener("click", layoutChange);
    document.querySelector<HTMLButtonElement>('.dismiss-btn')!.addEventListener("click", dismissBtn);
    const sideSec:NodeListOf<HTMLElement> = document.querySelectorAll('.navbar-item');
    for (let i = 0; i < sideSec.length; i++) {
        sideSec[i].addEventListener("mouseover",(e:Event)=>{changeIcon(e)});
        sideSec[i].addEventListener('mouseout', (e:Event)=>{changeIcon(e)});
    }
})

window.addEventListener("resize",() =>document.querySelector<HTMLImageElement>('.logo')!.src = (window.matchMedia("(max-width: 720px)").matches) ? "./assets/images/tezo-logo-min.png" : "./assets/images/tezo-logo.png");

function layoutChange():void {
    if(window.screen.width > 720){
        document.querySelector<HTMLElement>('.wrapper')!.style.gridTemplateColumns= !isSidebarCollpased ? "1fr 20fr":"1fr 4.5fr";
        document.querySelector<HTMLElement>('.sidebar-container')!.style.padding = !isSidebarCollpased ? "0":"0 0.5rem";
        document.querySelector<HTMLImageElement>('.logo')!.src= !isSidebarCollpased ? "./assets/images/tezo-logo-min.png":"./assets/images/tezo-logo.png";
        document.querySelector<HTMLImageElement>('.logo')!.style.width=!isSidebarCollpased? "120%":"60%";
        document.querySelector<HTMLImageElement>('.sidebar-min-icon')!.classList.toggle("sidebar-min-icon-expand");
        document.querySelector<HTMLElement>('.sm-heading')!.style.display= !isSidebarCollpased? "block":"none";
        document.querySelector<HTMLElement>('.md-heading')!.style.display= !isSidebarCollpased ? "none":"block";
        const allSecHeading:NodeListOf<HTMLElement>=document.querySelectorAll('.navbar-item-title');
        for(let i=0;i<allSecHeading.length;i++){
            allSecHeading[i].style.display= !isSidebarCollpased? "none":"block"
        }
        document.querySelector<HTMLElement>('.app-update-container')!.style.display= (!isSidebarCollpased || !isUpdateVisible)? "none":"block";
        isSidebarCollpased=!isSidebarCollpased;
    }
}

function dismissBtn():void {
    document.querySelector<HTMLElement>(".app-update-container")!.style.display = "none";
    isUpdateVisible=false;
}

function changeIcon(e:Event):void {
    let div=e.currentTarget as HTMLDivElement;
    if (div.classList.contains("active") == false) {
        let imgSrc:string = div.querySelector<HTMLImageElement>('img')!.src;
        div.getElementsByTagName('img')[0].src = (imgSrc.indexOf("black") > -1)? imgSrc.replace("black", "red"):imgSrc.replace("red", "black")
        let imgSrc2:string | null = div.getElementsByTagName('img')[1]?.getAttribute('src');
        if (imgSrc2) {
            div.getElementsByTagName('img')[1].src= (imgSrc2.indexOf("black") > -1)? imgSrc2.replace("black", "red"):imgSrc2.replace("red", "black");
        }
    }
}

export interface EmployeeSample {
    img:string, fname:string, lname:string, email:string, location:string, dept:string, role?:string, empNo:string, status:string, joiningDate:string, dob:string, projectAssigned:string, managerAssigned:string, mobile:number, dots?:string,
}

export interface RoleSample{
    role:string, roleId:string, desc?:string, dept:string, location:string, profiles?:EmployeeSample[]
}

//  For Object created for adding eventlistners on dom content loading
export interface EventMap {
    [selector: string]: { event: string, callback: EventListenerOrEventListenerObject };
}