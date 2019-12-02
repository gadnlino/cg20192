let canvasContainer; let menu; let w; let h; let aspectRatio;
let viewSize; let font; let renderer; let camera; let scene;
let manager; let loader; let controlPoints; let controlPointsLabels;
let curves;

const curveTypes = {
    BEZIER : "BEZIER",
    CUBIC_SPLINE : "CUBIC_SPLINE",
    CATMULL_ROM : "CATMULL_ROM",
    HERMITE : "HERMITE"
};

const programModes = {
    MOVING_POINTS : "MOVING_POINTS",
    STANDARD : "STANDARD",
    VIEWING_INSTRUCTIONS: "VIEWING_INSTRUCTIONS",
    VIEWING_CREDITS : "VIEWING_CREDITS"
};

let currProgramMode = programModes.STANDARD;

function init(){

    canvasContainer = document.getElementById("threejs-canvas-div");
    menu = document.getElementById("menu");
    w = window.innerWidth - menu.clientWidth;
    h = canvasContainer.clientHeight;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( w, h );
    canvasContainer.appendChild(renderer.domElement);
    
    manager = new THREE.LoadingManager();
    loader = new THREE.FontLoader(manager);
    loader.load('https://threejs.org/examples/fonts/droid/droid_serif_bold.typeface.json', function(response) {
        font = response;
    });

    viewSize = 1;
    aspectRatio = w/h;

    camera = new THREE.PerspectiveCamera( 45, w / h, 1, 100000);
    camera.position.set( 0, 0, 200 );
    camera.lookAt( 0, 0, 0 );

    scene = new THREE.Scene();

    controlPoints = [];
    controlPointsLabels = [];
    curves = [];
}

function getProgramMode(){
    return currProgramMode;
}

function setProgramMode(mode){
    currProgramMode = mode;
}

function getMousePosition(e){

    let posX = e.clientX - canvasLeft;
    let posY = e.clientY - canvasTop;
    let posZ = 0.5;

    let mouse = new THREE.Vector3();

    mouse.x = (posX/canvasWidth)*2 - 1;
    mouse.y = -(posY/canvasHeight)*2 + 1;
    mouse.z = posZ;

    mouse.unproject(camera);

    return {
        screen : [e.clientX, e.clientY, 0],
        canvas : [posX, posY, posZ],
        scene : [mouse.x, mouse.y, mouse.z]
    };
}

function clearScene(){
    
    if(controlPoints.length > 0 || curves.length > 0){
        
        while(scene.children.length > 0){
            
            scene.remove(scene.children[scene.children.length-1]);
        }
    
        curves = [];
        controlPoints = [];
        popAllControlPointsLabels();
    
        animate();
    }
    else{
        alert("Nenhum ponto foi escolhido e nenhuma curva foi traçada!");
    }
}

function animate(){

    drawPoints();
    drawCurves();
    drawControlPointsLabels();
}

function onWindowResize(){

    let w = window.innerWidth - menu.clientWidth;
    let h = canvasContainer.clientHeight;
    camera.aspect = w/ h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    animate();
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();