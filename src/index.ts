let isSidebarCollpased:boolean=false;
let isUpdateVisible:boolean=true;

window.addEventListener("resize", function () {
    document.querySelector<HTMLImageElement>('.logo')!.src= (window.matchMedia("(max-width: 720px)").matches) ? "./assets/images/tezo-logo-min.png":"./assets/images/tezo-logo.png"
    setTableHeight()
})

document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector<HTMLImageElement>('.sidebar-min-icon')!.addEventListener("click", layoutChange);
    document.querySelector<HTMLButtonElement>('.dismiss-btn')!.addEventListener("click", dismissBtn);
    setTableHeight()
})

const sideSec:NodeListOf<HTMLElement> = document.querySelectorAll('.navbar-item');
for (let i = 0; i < sideSec.length; i++) {
    sideSec[i].addEventListener("mouseover",(e:Event)=>{changeIcon(e)});
    sideSec[i].addEventListener('mouseout', (e:Event)=>{changeIcon(e)});
}

function setTableHeight(){
    let contentDivHeight=document.querySelector<HTMLElement>(".content")!.offsetHeight;
    let serachBarHeight = document.querySelector<HTMLElement>(".search-container")!.offsetHeight;
    let employeeContainerHeight=document.querySelector<HTMLElement>(".employees-container")!.offsetHeight;
    let alphabetFilterHeight=document.querySelector<HTMLElement>(".alphabet-filter")!.offsetHeight;
    let resetFilterHeight=document.querySelector<HTMLElement>(".reset-filter")!.offsetHeight;
    let employeeTable=document.querySelector<HTMLElement>(".employee-table-container")!;
    employeeTable.style.minHeight=`${contentDivHeight-serachBarHeight-employeeContainerHeight-alphabetFilterHeight-resetFilterHeight-100}px`;
    console.log(employeeTable.style.minHeight)
}

function layoutChange() {
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

function dismissBtn() {
    document.querySelector<HTMLElement>(".app-update-container")!.style.display = "none";
    isUpdateVisible=false;
}

function changeIcon(e:Event) {
    let div=e.currentTarget as HTMLDivElement;
    if (div.classList.contains("active") == false) {
        let imgSrc:string = div.querySelector<HTMLImageElement>('img')!.src;
        if (imgSrc.indexOf("black") > -1) {
            let newImgSrc = imgSrc.replace("black", "red");
            div.getElementsByTagName('img')[0].src = newImgSrc;
        }
        else {
            let newImgSrc = imgSrc.replace("red", "black");
            div.getElementsByTagName('img')[0].src = newImgSrc;
        }
        let imgSrc2 = div.getElementsByTagName('img')[1]?.getAttribute('src');
        if (imgSrc2) {
            if (imgSrc2.indexOf("black") > -1) {
                let newImgSrc = imgSrc2.replace("black", "red");
                div.getElementsByTagName('img')[1].src = newImgSrc;
            }
            else {
                let newImgSrc = imgSrc2.replace("red", "black");
                div.getElementsByTagName('img')[1].src = newImgSrc;
            }
        }

    }
}