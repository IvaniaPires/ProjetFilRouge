let open_menu = document.querySelector('#navbar_hamburger_icon');
let menu = document.querySelector("#navbar_menu");
let navbar = document.querySelector("#navbar");


open_menu.addEventListener('click', e =>{
    e.preventDefault();
    if (menu.className === "") {
        menu.className = "open";
        open_menu.className = "open";
        //root.style.overflowY = "hidden";
      } else {
        menu.className = "";                    
        open_menu.className = "";
        //root.style.overflowY = "";
      }  

})

window.addEventListener('scroll', (e)=> { // To listen for event
    e.preventDefault();

    if (window.scrollY > 1000) { // Just an example
        navbar.style.backgroundColor = '#787878'; // or default color
    } else {
        navbar.style.backgroundColor = 'transparent';
    }
});




