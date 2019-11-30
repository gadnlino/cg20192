let canvasElement;
let menu;
let w;
let h;
let aspectRatio;
let viewSize;
let font;
let renderer;
let camera;
let scene;
let manager;
let loader;
let selectedPoints;
let pointLabels;
let curvesPoints;

const mode = "2D";

function init(){

    canvasElement = document.getElementById("threejs-canvas-div");
    menu = document.getElementById("menu");
    w = window.innerWidth - menu.clientWidth;
    h = canvasElement.clientHeight;

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( w, h );
    canvasElement.appendChild(renderer.domElement);
    
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

    selectedPoints = [];
    pointLabels = [];
    curvesPoints = [];
}

function clearScene(){
    
    if(selectedPoints.length > 0 || curvesPoints.length > 0){
        
        while(scene.children.length > 0){
            scene.remove(scene.children[scene.children.length-1]);
        }
    
        curvesPoints = [];
        selectedPoints = [];
        pointLabels = [];
    
        animate();
    }
    else{
        alert("Nenhum ponto foi escolhido e nenhuma curva foi traçada!");
    }
   
}

function popPoint(){

    if(selectedPoints.length > 0){

        const oldSelectedPoints = selectedPoints;
        const oldCurvesPoints = curvesPoints;
        const oldPointLabels = pointLabels;

        clearScene();

        selectedPoints = oldSelectedPoints;
        selectedPoints.pop();

        curvesPoints = oldCurvesPoints;
        pointLabels = oldPointLabels;
        pointLabels.pop();

        animate();
    }
    else{
        alert("Nenhum ponto foi selecionado!");
    }
}

function popAllPoints(){

    if(selectedPoints.length > 0){

        const oldSelectedPoints = selectedPoints;
        const oldCurvesPoints = curvesPoints;
        const oldPointLabels = pointLabels;

        clearScene();

        selectedPoints = [];

        curvesPoints = oldCurvesPoints;
        pointLabels = oldPointLabels;
        pointLabels.pop();

        animate();
    }
    else{
        alert("Nenhum ponto foi selecionado!");
    }
}

function popCurve(){

    if(curvesPoints.length > 0){

        const oldSelectedPoints = selectedPoints;
        const oldCurvesPoints = curvesPoints;
        const oldPointLabels = pointLabels;

        clearScene();

        selectedPoints = oldSelectedPoints;
        curvesPoints = oldCurvesPoints;
        curvesPoints.pop();
        pointLabels = oldPointLabels;
        pointLabels.pop();

        animate();
    }
    else{
        alert("Nenhuma curva foi traçada!");
    }
}

function popAllCurves(){

    if(curvesPoints.length > 0){

        const oldSelectedPoints = selectedPoints;
        const oldCurvesPoints = curvesPoints;
        const oldPointLabels = pointLabels;

        clearScene();

        selectedPoints = oldSelectedPoints;
        curvesPoints = [];
        pointLabels = oldPointLabels;
        pointLabels.pop();

        animate();
    }
    else{
        alert("Nenhuma curva foi traçada!");
    }
}

function pushPoint(point){
    
    selectedPoints.push(point);

    pushPointLabel(point, `p${selectedPoints.length-1}`);
}

function pushPointLabel([x,y,z], label){

    pointLabels.push({
        text : label,
        position : {
            x: x, y: y, z: z
        }
    });
}

function pushCurve(curveVertices){
    curvesPoints.push(curveVertices);
    animate();
}

function drawPoints(){

    let geometry = new THREE.Geometry();

    for(let i = 0;i < selectedPoints.length;i++){
        let point = selectedPoints[i];
        geometry.vertices.push(new THREE.Vector3( point[0], point[1], point[2]) );
    }

    let dotMaterial = new THREE.PointsMaterial( { size: 0.1, sizeAttenuation: true } );
    let dots = new THREE.Points( geometry, dotMaterial );

    scene.add(dots);
    renderer.render( scene, camera );
}

function drawCurves(){

    for(let i = 0;i < curvesPoints.length;i++){

        let geometry = new THREE.Geometry();
        let material = new THREE.LineBasicMaterial( { color: 0xffffff } );

        const curve = curvesPoints[i];

        for(let j = 0;j < curve.length;j++){
            
            const point = curve[j];
            geometry.vertices.push(new THREE.Vector3( point[0], point[1], point[2]) );
        }

        let line = new THREE.Line( geometry, material );
        scene.add( line );
    }

    
    renderer.render( scene, camera );
}

function drawPointLabels(){

    if(font){

        pointLabels.forEach(label=>{
            const {text, position} = label;
            const {x,y,z} = position;

            var textGeo = new THREE.TextGeometry( text, {

                font: font,
                size: 0.5,
                height: 0.5,
                weight:'normal',
                bevelThickness: 2,
                bevelSize: 1,
                bevelEnabled: true
            } );
        
            var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );
        
            var mesh = new THREE.Mesh( textGeo, textMaterial );

            const offsetX = 2.3, offsetY = 2.3, offsetZ = 1;

            mesh.position.set( x+offsetX, y+offsetY, z+offsetZ );
        
            scene.add( mesh );
        });
        
        // Now, show what the camera sees on the screen:
        renderer.render(scene, camera);

    }

}

function animate(){

    drawPoints();
    drawCurves();
    //drawPointLabels();
}

function onWindowResize(){

    let w = window.innerWidth - menu.clientWidth;
    let h = canvasElement.clientHeight;
    camera.aspect = w/ h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    animate();
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();