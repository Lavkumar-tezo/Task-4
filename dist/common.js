let isSidebarCollpased = false;
let isUpdateVisible = true;
var employeeList = [
    {
        "img": "./assets/images/profile.webp",
        "fname": "Rajesh",
        "lname": "Singhg",
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
var allRoles = [
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
document.addEventListener('DOMContentLoaded', () => {
    let storedAllEmps = localStorage.getItem('employeeList');
    (storedAllEmps) ? employeeList = JSON.parse(storedAllEmps) : localStorage.setItem('employeeList', JSON.stringify(employeeList));
    let storedAllroles = localStorage.getItem('roles');
    (storedAllroles) ? allRoles = JSON.parse(storedAllroles) : localStorage.setItem('roles', JSON.stringify(allRoles));
    document.querySelector('.sidebar-min-icon').addEventListener("click", layoutChange);
    document.querySelector('.dismiss-btn').addEventListener("click", dismissBtn);
    const sideSec = document.querySelectorAll('.navbar-item');
    for (let i = 0; i < sideSec.length; i++) {
        sideSec[i].addEventListener("mouseover", (e) => { changeIcon(e); });
        sideSec[i].addEventListener('mouseout', (e) => { changeIcon(e); });
    }
});
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
        (imgSrc.indexOf("black") > -1) ? div.getElementsByTagName('img')[0].src = imgSrc.replace("black", "red") : div.getElementsByTagName('img')[0].src = imgSrc.replace("red", "black");
        let imgSrc2 = (_a = div.getElementsByTagName('img')[1]) === null || _a === void 0 ? void 0 : _a.getAttribute('src');
        if (imgSrc2) {
            (imgSrc2.indexOf("black") > -1) ? div.getElementsByTagName('img')[1].src = imgSrc2.replace("black", "red") : div.getElementsByTagName('img')[1].src = imgSrc2.replace("red", "black");
        }
    }
}
export {};
