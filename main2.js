// const canvass = document.getElementById("canvas");

// let ctx = canvas.getContext("2d");
// let start_background_color = "white";

canvas.addEventListener("touchstart", handleStart, false);
canvas.addEventListener("touchend", handleEnd, false);
canvas.addEventListener("touchcancel", handleCancel, false);
canvas.addEventListener("touchmove", handleMove, false);

var ongoingTouches = [];

// let draw_color = "black";
// let draw_width = "2";

function handleStart(event) {
    event.preventDefault();
    // console.log("touchstart.");
    var touches = event.changedTouches;

    for (var i = 0; i < touches.length; i++) {
    //   console.log("touchstart:" + i + "...");
        ongoingTouches.push(copyTouch(touches[i]));
        context.beginPath();
        context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        // ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
        // ctx.fillStyle = start_background_color;
        // ctx.fill();
    //   console.log("touchstart:" + i + ".");
    }
}

function handleMove(event) {
    event.preventDefault();
    var touches = event.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        // var color = colorForTouch(touches[i]);
        var idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
        // console.log("continuing touch "+idx);
        // context.beginPath();
        // console.log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
        context.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
        // console.log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
        context.lineTo(touches[i].pageX, touches[i].pageY);
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();

        ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
        // console.log(".");
        } else {
        console.log("can't figure out which touch to continue");
        }
    }
}

function handleEnd(event) {
event.preventDefault();
// log("touchend");
var touches = event.changedTouches;

for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
    context.lineWidth = 4;
    context.fillStyle = start_background_color;
    // context.beginPath();
    context.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
    context.lineTo(touches[i].pageX, touches[i].pageY);
    context.fillRect(0,0, canvas.width, canvas.heigh);  // and a square at the end
    ongoingTouches.splice(idx, 1);  // remove it; we're done
    } else {
    console.log("can't figure out which touch to end");
    }
}
}

function handleCancel(evt) {
evt.preventDefault();
// console.log("touchcancel.");
var touches = evt.changedTouches;

for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1);  // remove it; we're done
}
}

function colorForTouch(touch) {
var r = touch.identifier % 16;
var g = Math.floor(touch.identifier / 3) % 16;
var b = Math.floor(touch.identifier / 7) % 16;
r = r.toString(16); // make it a hex digit
g = g.toString(16); // make it a hex digit
b = b.toString(16); // make it a hex digit
var color = "#" + r + g + b;
// console.log("color for touch with identifier " + touch.identifier + " = " + color);
return color;
}

function copyTouch({ identifier, pageX, pageY }) {
return { identifier, pageX, pageY };
}

function ongoingTouchIndexById(idToFind) {
for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    if (id == idToFind) {
    return i;
    }
}
return -1;    // not found
}

//   function log(msg) {
//     var p = document.getElementById('log');
//     p.innerHTML = msg + "\n" + p.innerHTML;
//   }