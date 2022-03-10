let accordion = document.querySelector('#accordion');
let span_accordion = document.querySelector('#span_accordion');

accordion.addEventListener('click', ()=> {
    span_accordion.classList.toggle("span_accordion");
    console.log(span_accordion.classList.contains("span_accordion"));
    accordion.classList.toggle("more");
    accordion.classList.toggle("less");
});
