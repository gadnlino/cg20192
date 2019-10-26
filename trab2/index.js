//
// start here
//

function drawBezier(){
    console.log('Bezier clickado');
}

function drawHermite(){
    console.log('Hermite clickado');
}

function drawSplines(){
    console.log('Splines clickado');
}

function drawCatmullRom(){
    console.log('CatmullRom clickado');
}

function main() {
    const canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    //gl.canvas.width = window.innerWidth;
    //gl.canvas.height = window.innerHeight;

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
}
  
window.onload = main;