"use strict";
let isSidebarCollpased = false;
let isUpdateVisible = true;
window.addEventListener("resize", function () {
    document.querySelector('.logo').src = (window.matchMedia("(max-width: 720px)").matches) ? "./assets/images/tezo-logo-min.png" : "./assets/images/tezo-logo.png";
    setTableHeight();
});
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.sidebar-min-icon').addEventListener("click", layoutChange);
    document.querySelector('.dismiss-btn').addEventListener("click", dismissBtn);
    setTableHeight();
});
const sideSec = document.querySelectorAll('.navbar-item');
for (let i = 0; i < sideSec.length; i++) {
    sideSec[i].addEventListener("mouseover", (e) => { changeIcon(e); });
    sideSec[i].addEventListener('mouseout', (e) => { changeIcon(e); });
}
function setTableHeight() {
    let contentDivHeight = document.querySelector(".content").offsetHeight;
    let serachBarHeight = document.querySelector(".search-container").offsetHeight;
    let employeeContainerHeight = document.querySelector(".employees-container").offsetHeight;
    let alphabetFilterHeight = document.querySelector(".alphabet-filter").offsetHeight;
    let resetFilterHeight = document.querySelector(".reset-filter").offsetHeight;
    let employeeTable = document.querySelector(".employee-table-container");
    employeeTable.style.minHeight = `${contentDivHeight - serachBarHeight - employeeContainerHeight - alphabetFilterHeight - resetFilterHeight - 100}px`;
    console.log(employeeTable.style.minHeight);
}
function layoutChange() {
    if (window.screen.width > 720) {
        document.querySelector('.wrapper').style.gridTemplateColumns = !isSidebarCollpased ? "1fr 20fr" : "1fr 4.5fr";
        document.querySelector('.sidebar-container').style.padding = !isSidebarCollpased ? "0" : "0 0.5rem";
        document.querySelector('.logo').src = !isSidebarCollpased ? "./assets/images/tezo-logo-min.png" : "./assets/images/tezo-logo.png";
        document.querySelector('.logo').style.width = !isSidebarCollpased ? "120%" : "60%";
        document.querySelector('.sidebar-min-icon').classList.toggle("sidebar-min-icon-expand");
        document.querySelector('.sm-heading').style.display = !isSidebarCollpased ? "block" : "none";
        document.querySelector('.md-heading').style.display = !isSidebarCollpased ? "none" : "block";
        const allSecHeading = document.querySelectorAll('.navbar-item-title');
        for (let i = 0; i < allSecHeading.length; i++) {
            allSecHeading[i].style.display = !isSidebarCollpased ? "none" : "block";
        }
        document.querySelector('.app-update-container').style.display = (!isSidebarCollpased || !isUpdateVisible) ? "none" : "block";
        isSidebarCollpased = !isSidebarCollpased;
    }
}
function dismissBtn() {
    document.querySelector(".app-update-container").style.display = "none";
    isUpdateVisible = false;
}
function changeIcon(e) {
    var _a;
    let div = e.currentTarget;
    if (div.classList.contains("active") == false) {
        let imgSrc = div.querySelector('img').src;
        if (imgSrc.indexOf("black") > -1) {
            let newImgSrc = imgSrc.replace("black", "red");
            div.getElementsByTagName('img')[0].src = newImgSrc;
        }
        else {
            let newImgSrc = imgSrc.replace("red", "black");
            div.getElementsByTagName('img')[0].src = newImgSrc;
        }
        let imgSrc2 = (_a = div.getElementsByTagName('img')[1]) === null || _a === void 0 ? void 0 : _a.getAttribute('src');
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
//# sourceMappingURL=index.js.map