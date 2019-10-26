//
// start here
//

let state = {
    curve: '',
    showCurve:false,
    controlPoints: []
};

function showInstructions(){
    var x = document.getElementById('instructions');

    if(!x.style.display || x.style.display === "none"){
        x.style.display = "inline";
    }else{
        x.style.display = "none";
    }

}

function onBezierClick(event){
    //console.log('Bezier clickado');

    showInstructions();
    
    document.getElementById('nome-curva').innerHTML = "Desenhando curvas de Bézier";
}

function onHermiteClick(event){
    console.log('Hermite clickado');
    showInstructions();
    document.getElementById('nome-curva').innerHTML = "Desenhando curvas de Hermite";
}

function onSplinesClick(event){
    console.log('Splines clickado');
    showInstructions();
    document.getElementById('nome-curva').innerHTML = "Desenhando curvas splines";
}

function onCatmullRomClick(event){
    console.log('CatmullRom clickado');
    showInstructions();
    document.getElementById('nome-curva').innerHTML = "Desenhando splines de Catmull-Rom";
}

function onOKButtonClick(){
    console.log("ok clickado");
    state.showCurve = true;
}

/*function main() {
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
  
window.onload = main;*/

var canvas = document.getElementById('glCanvas');
var gl = canvas.getContext('experimental-tinygl');

if(!gl){
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    throw new Error("Erro fatal, interrompendo aplicação");
}

gl.debug();
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.matrixMode(gl.PROJECTION);
gl.loadIdentity();
gl.frustum(-2.0, 2.0, -2.0, 2.0, 6.0, 20.0);
gl.matrixMode(gl.MODELVIEW);
gl.loadIdentity();
gl.translatef(0.0, 0.0, -16.0);
gl.color3f(1, 1, 1);
gl.begin(gl.POLYGON);
    gl.vertex3f(-2, -2, 0);
    gl.vertex3f( 2, -2, 0);
    gl.vertex3f( 2,  2, 0);
    gl.vertex3f(-2,  2, 0);
gl.end();
gl.flush();
gl.swapBuffers();