let options_cont = document.querySelector(".options-cont");
let display_options = true;

let tools_cont = document.querySelector(".tools-cont");
let pencil_style_cont = document.querySelector(".pencil-style-cont");
let eraser_style_cont = document.querySelector(".eraser-style-cont");

let pencil = document.querySelector(".pencil");
let display_pencil_style = false;
let eraser = document.querySelector(".eraser");
let display_eraser_style = false;

let sticky_note = document.querySelector(".sticky-note");
let upload = document.querySelector(".upload");
let pencil_width_selector=document.querySelector(".pencil-width");
let eraser_width_selector=document.querySelector(".eraser-width");

options_cont.addEventListener("click", function (e) {
    display_options = !display_options;

    let icon = options_cont.children[0];

    if (display_options) {
        icon.innerText = "menu";
        tools_cont.style.display = "flex";
    }

    else {
        icon.innerText = "clear";
        tools_cont.style.display = "none";
        pencil_style_cont.style.display = "none";
        eraser_style_cont.style.display = "none";
    }

    console.log(options_cont);
});

pencil.addEventListener("click", function (e) {

    display_pencil_style = !display_pencil_style;
    if (display_pencil_style) {
        pencil_style_cont.style.display = "flex";
    }

    else {
        pencil_style_cont.style.display = "none";
    }
});

eraser.addEventListener("click", function (e) {

    display_eraser_style = !display_eraser_style;
    if (display_eraser_style) {
        eraser_style_cont.style.display = "flex";
    }

    else {
        eraser_style_cont.style.display = "none";
    }
});

sticky_note.addEventListener("click", function (e) {

    let sticky_div = document.createElement("div");
    sticky_div.setAttribute("class", "sticky-cont");
    let inner_html = `<div class="sticky-header-cont">
                            <div class="sticky-minimize"></div>
                            <div class="sticky-remove"></div>
                            </div>
                            <div class="sticky-note-cont">
                            <textarea class="sticky-note"></textarea>
                            </div>`;

    create_sticky(inner_html);
})

function perform_actions(sticky_div, minimize, remove) {

    remove.addEventListener("click", function (e) {
        sticky_div.remove();
    })

    minimize.addEventListener("click", function (e) {
        let sticky_note = sticky_div.querySelector(".sticky-note-cont");
        let display = window.getComputedStyle(sticky_note).getPropertyValue("display");

        if (display == "none") {
            sticky_note.style.display = "flex";
        }

        else {
            sticky_note.style.display = "none";
        }
    })
}

function perform_drag_drop(sticky_div, event) {

    let shiftX = event.clientX - sticky_div.getBoundingClientRect().left;
    let shiftY = event.clientY - sticky_div.getBoundingClientRect().top;

    sticky_div.style.position = 'absolute';
    sticky_div.style.zIndex = 1000;
    //document.body.append(ball);

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        sticky_div.style.left = pageX - shiftX + 'px';
        sticky_div.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    sticky_div.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        sticky_div.onmouseup = null;
    };

    sticky_div.ondragstart = function () {
        return false;
    };
};

upload.addEventListener("click", function (e) {

    // open the file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", function (e) {
        // read the first file
        let file = input.files[0];
        console.log(file);
        let url = URL.createObjectURL(file);

        // create a sticky
        let sticky_div = document.createElement("div");
        sticky_div.setAttribute("class", "sticky-cont");
        let inner_html=`<div class="sticky-header-cont">
        <div class="sticky-minimize"></div>
        <div class="sticky-remove"></div>
        </div>
        <div class="sticky-note-cont">
        <img src="${url}">
        </div>`;

        create_sticky(inner_html);
    });
})

function create_sticky(inner_html){
    
    // create a sticky
    let sticky_div = document.createElement("div");
    sticky_div.setAttribute("class", "sticky-cont");
    sticky_div.innerHTML = inner_html;

    
    document.body.appendChild(sticky_div);

    sticky_div.onmousedown = function (event) {
        perform_drag_drop(sticky_div, event);
    };

    let minimize = sticky_div.querySelector(".sticky-minimize");
    let remove = sticky_div.querySelector(".sticky-remove");

    perform_actions(sticky_div, minimize, remove);
}