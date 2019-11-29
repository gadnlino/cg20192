let canvasElement;
let menu;
let w;
let h;
let font;
let renderer;
let camera;
let scene;
let selectedPoints;
let pointLabels;
let curveVertices;

function init(){
    canvasElement = document.getElementById("threejs-canvas-div");
    menu = document.getElementById("menu");
    w = window.innerWidth - menu.clientWidth;
    h = canvasElement.clientHeight;
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( w, h );
    canvasElement.appendChild(renderer.domElement);
    
    let manager = new THREE.LoadingManager();
    let loader = new THREE.FontLoader(manager);
    loader.load('https://threejs.org/examples/fonts/droid/droid_serif_bold.typeface.json', function(response) {
        font = response;
        //console.log(response);
    });

    camera = new THREE.PerspectiveCamera( 45, w / h, 1, 500 );
    camera.position.set( 0, 0, 100 );
    camera.lookAt( 0, 0, 0 );

    scene = new THREE.Scene();

    selectedPoints = [];
    pointLabels = [];
    curveVertices = [];
}

function clearScene(){
    
    while(scene.children.length > 0){
        scene.remove(scene.children[scene.children.length-1]);
    }

    curveVertices = [];
    selectedPoints = [];
    pointLabels = [];

    animate();
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

function pushVertex(vertex){
    curveVertices.push(vertex);
}

function hasVertex(){
    return curveVertices.length > 0;
}

function clearCurveVertices(){
    curveVertices = [];
}

function drawPoints(){

    let geometry = new THREE.Geometry();

    for(let i = 0;i < selectedPoints.length;i++){
        let point = selectedPoints[i];
        geometry.vertices.push(new THREE.Vector3( point[0], point[1], point[2]) );
    }

    let dotMaterial = new THREE.PointsMaterial( { size: 2, sizeAttenuation: true } );
    let dots = new THREE.Points( geometry, dotMaterial );

    scene.add(dots);
    renderer.render( scene, camera );
}

function drawLines(){
    let geometry = new THREE.Geometry();
    let material = new THREE.LineBasicMaterial( { color: 0xffffff } );

    for(let i = 0;i < curveVertices.length;i++){

        let point = curveVertices[i];
        geometry.vertices.push(new THREE.Vector3( point[0], point[1], point[2]) );
        
    }

    let line = new THREE.Line( geometry, material );
    scene.add( line );
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
    drawPointLabels();
    drawLines();
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