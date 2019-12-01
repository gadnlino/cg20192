let canvasContainer;
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
let controlPoints;
let controlPointsLabels;
let curvesPoints;

const programModes = {
    MOVING_POINTS : "MOVING_POINTS",
    STANDARD : "STANDARD"
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
    curvesPoints = [];
}

function setProgramMode(mode){
    currProgramMode = mode;
}

function createTextLabel(){

    let div = document.createElement('div');
    div.className = 'text-label';
    div.style.position = 'absolute';
    div.style.width = 20;
    div.style.height = 20;
    div.innerHTML = "hi there!";
    div.style.top = -1000;
    div.style.left = -1000;
    div.style.color = "aliceblue";
    
    let _this = this;
    
    return {

      element: div,
      parent: false,
      position: new THREE.Vector3(0,0,0),
      setHTML: function(html) {
        this.element.innerHTML = html;
        this.setId(html);
      },
      setParent : function(threejsobj) {
        this.parent = threejsobj;
      },
      setPosition : function(x,y,z){
        this.position.set(x, y, z);
      },
      setId : function(id){
        this.element.id = id;
      },
      updatePosition: function() {
        
        this.element.style.left = this.position.x + 'px';
        this.element.style.top = this.position.y + 'px';
      }
    };
};

function clearScene(){
    
    if(controlPoints.length > 0 || curvesPoints.length > 0){
        
        while(scene.children.length > 0){
            
            scene.remove(scene.children[scene.children.length-1]);
        }
    
        curvesPoints = [];
        controlPoints = [];
        popAllControlPointsLabels();
    
        animate();
    }
    else{
        alert("Nenhum ponto foi escolhido e nenhuma curva foi traçada!");
    }
   
}

function popControlPoint(){

    if(controlPoints.length > 0){

        const oldcontrolPoints = controlPoints.slice();
        const oldCurvesPoints = curvesPoints.slice();
        const oldControlPointsLabels = controlPointsLabels.slice(0,controlPointsLabels.length-1);

        clearScene();

        controlPoints = oldcontrolPoints;
        controlPoints.pop();

        curvesPoints = oldCurvesPoints;
        controlPointsLabels = oldControlPointsLabels;

        animate();
    }
    else{
        alert("Nenhum ponto foi selecionado!");
    }
}

function popAllControlPoints(){

    if(controlPoints.length > 0){

        const oldcontrolPoints = controlPoints.slice();
        const oldCurvesPoints = curvesPoints.slice();
        const oldcontrolPointsLabels = controlPointsLabels.slice();

        clearScene();

        controlPoints = [];
        curvesPoints = oldCurvesPoints;
        controlPointsLabels = [];

        //popAllControlPointsLabels();

        animate();
    }
    else{
        alert("Nenhum ponto foi selecionado!");
    }
}

function pushCurve(curveVertices){

    curvesPoints.push(curveVertices);
    animate();
}

function popCurve(){

    if(curvesPoints.length > 0){

        const oldcontrolPoints = controlPoints.slice();
        const oldCurvesPoints = curvesPoints.slice();
        const oldcontrolPointsLabels = controlPointsLabels.slice();

        clearScene();

        controlPoints = oldcontrolPoints;
        curvesPoints = oldCurvesPoints;
        curvesPoints.pop();
        controlPointsLabels = oldcontrolPointsLabels;

        animate();
    }
    else{
        alert("Nenhuma curva foi traçada!");
    }
}

function popAllCurves(){

    if(curvesPoints.length > 0){

        const oldcontrolPoints = controlPoints.slice();
        const oldCurvesPoints = curvesPoints.slice();
        const oldcontrolPointsLabels = controlPointsLabels.slice();

        clearScene();

        controlPoints = oldcontrolPoints;
        curvesPoints = [];
        controlPointsLabels = oldcontrolPointsLabels;

        animate();
    }
    else{
        alert("Nenhuma curva foi traçada!");
    }
}

function pushControlPoint(point){

    controlPoints.push(point.scene);

    pushControlPointLabel(`p${controlPoints.length-1}`, point.screen);
}

function pushControlPointLabel(labelText, [x,y,z]){

    const offsetX = 2.3, offsetY = 2.3, offsetZ = 0;
    let textMesh = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    let labelElement = createTextLabel();
    labelElement.setHTML(labelText);
    labelElement.setParent(canvasContainer);
    labelElement.setPosition(x + offsetX, y + offsetY, z + offsetZ);
    labelElement.updatePosition();

    //canvasContainer.appendChild(labelElement.element);
    controlPointsLabels.push(labelElement);
}

function popControlPointLabel(){

    const lastLabel = controlPointsLabels.pop();

    canvasContainer.removeChild(lastLabel.element);
}

function popAllControlPointsLabels(){

    while(controlPointsLabels.length > 0){
        popControlPointLabel();
    }
}

function drawPoints(){

    let geometry = new THREE.Geometry();

    for(let i = 0;i < controlPoints.length;i++){
        let point = controlPoints[i];
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

function drawControlPointsLabels(){

    for(let i = 0;i < controlPointsLabels.length;i++){
        const labelInfo = controlPointsLabels[i];

        canvasContainer.appendChild(labelInfo.element);
    }
    
    renderer.render(scene, camera);
}

function moveControlPoints(mousePosition, delta){

    if(controlPoints.length > 0){
        
        let currControlPoint = null;
        let currDistance = Infinity;
        let index = -1;

        for(let i = 0;i < controlPoints.length;i++){
            const point = controlPoints[i];
            
            const distance = vectorDistance(point, mousePosition.scene);
            
            if(distance <= delta && distance <= currDistance){
                currControlPoint = point; 
                currDistance = distance;
                index = i;
            }
        }


        //mover o ponto, o label, e retraçar as curvas!!!!
        console.log(index);

    }else{
        alert("Nenhum ponto foi selecionado!");
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