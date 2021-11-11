let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencil_colors = document.querySelectorAll(".pencil-color");

let ctx = canvas.getContext('2d');
let mouse_down = false;

let pencil_color = "red";
let pencil_width = "5";
ctx.strokeStyle = pencil_color;
ctx.lineWidth = pencil_width;

let eraser_color = "white";
let eraser_width = "5";

let download=document.querySelector(".download");
let undo=document.querySelector(".undo");
let redo=document.querySelector(".redo");

// tracks paths to support undo and redo
let undo_redo_tracker=[];
// position we are currently at in the above array
let idx=0;


// mousedown -> start new path, mousemove -> path fill (graphics)
canvas.addEventListener("mousedown", (e) => {
    mouse_down = true;
    start_path(e.clientX,e.clientY);
});

canvas.addEventListener("mousemove", (e) => {
    if (mouse_down) {
        draw_path(e.clientX,e.clientY);
    }
})

canvas.addEventListener("mouseup", function (e) {
    mouse_down = false;

    let url=canvas.toDataURL();
    undo_redo_tracker.push(url);
    idx=undo_redo_tracker.length-1;
})

for (let i = 0; i < pencil_colors.length; i++) {
    pencil_colors[i].addEventListener("click", function (e) {
        let color = pencil_colors[i].classList[1];
        pencil_color = color;
        ctx.strokeStyle = color;
    })
}

function start_path(x, y) {
    // start a path
    ctx.beginPath();
    // move start point here
    ctx.moveTo(x, y);
}

function draw_path(x, y) {
    // draw line wherever mouse goes
    ctx.lineTo(x, y);
    ctx.stroke();
}

pencil_width_selector.addEventListener("change", function (e) {
    pencil_width = pencil_width_selector.value;
    console.log("pencil width:", pencil_width);
    ctx.lineWidth = pencil_width;
});

eraser_width_selector.addEventListener("change", function (e) {
    eraser_width = eraser_width_selector.value;
    ctx.lineWidth = eraser_width;
});

eraser.addEventListener("click", function (e) {
    // means we are working with eraser currently
    if (display_eraser_style) {
        ctx.strokeStyle = eraser_color;
        ctx.lineWidth = eraser_width;
    }

    // we are closing the eraser
    else {
        ctx.strokeStyle = pencil_color;
        ctx.lineWidth = pencil_width;
    }
});

download.addEventListener("click",function(e){

    let url=canvas.toDataURL();

    console.log("on downloading:",url);

    let anc=document.createElement("a");
    anc.href=url;
    anc.download="board.png";
    anc.click();
});

undo.addEventListener("click",function(e){
    if(idx > 0) idx--;
 
    let track_obj={
        idx : idx,
        undo_redo_tracker : undo_redo_tracker,
    };

    console.log("track_obj:",track_obj);
    undo_redo_action(track_obj);
});

redo.addEventListener("click",function(e){
    if(idx < undo_redo_tracker.length-1) idx++;

    let track_obj={
        idx : idx,
        undo_redo_tracker : undo_redo_tracker,
    };

    console.log("track_obj:",track_obj);
    undo_redo_action(track_obj); 
})

function undo_redo_action(track_obj){
    idx=track_obj.idx;
    undo_redo_tracker=track_obj.undo_redo_tracker;

    let url=undo_redo_tracker[idx];

    console.log("url:",url);

    let img=new Image();
    img.src=url;
    
    img.onload=function(e){
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
    }
}