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
let curves;
let raycaster;

const curveTypes = {
    BEZIER : "BEZIER",
    CUBIC_SPLINE : "CUBIC_SPLINE",
    CATMULL_ROM : "CATMULL_ROM",
    HERMITE : "HERMITE"
};

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
    curves = [];

    raycaster = new THREE.Raycaster();
}

function getCurves(){
    return curves.slice();
}

function getCurve(i){

    if(i < curvesSize()){
        return curves[i];
    }
}

function setCurve(i, curve){

    if(i < curvesSize()){
        curves[i] = curve;
    }
}

function curvesSize(){
    return curves.length;
}

function getControlPoints(){
    return [...controlPoints];
}

function getControlPoint(i){

    if(i < controlPointsSize()){
        return controlPoints[i];
    }
}

function setControlPoint(i, newPoint){

    if(i < controlPointsSize()){
        controlPoints[i] = newPoint;
    }
}

function controlPointsSize(){
    return controlPoints.length;
}

function getControlPointsLabels(){
    return controlPointsLabels.slice();
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

function popControlPoint(){

    if(controlPoints.length > 0){

        const oldcontrolPoints = controlPoints.slice();
        const oldcurves = curves.slice();
        const oldControlPointsLabels = controlPointsLabels.slice(0,controlPointsLabels.length-1);

        clearScene();

        controlPoints = oldcontrolPoints;
        controlPoints.pop();

        curves = oldcurves;
        updateCurves();
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
        const oldcurves = curves.slice();
        const oldcontrolPointsLabels = controlPointsLabels.slice();

        clearScene();

        controlPoints = [];
        curves = oldcurves;
        updateCurves();
        controlPointsLabels = [];

        animate();
    }
    else{
        alert("Nenhum ponto foi selecionado!");
    }
}

function pushCurve(curve){

    curves.push(curve);
    animate();
}

function removeCurve(i){

    if(i < curvesSize()){

        curves.splice(i,1);
    }
}

function popCurve(){

    if(curves.length > 0){

        const oldcontrolPoints = controlPoints.slice();
        const oldcurves = curves.slice();
        const oldcontrolPointsLabels = controlPointsLabels.slice();

        clearScene();

        controlPoints = oldcontrolPoints;
        curves = oldcurves;
        curves.pop();
        controlPointsLabels = oldcontrolPointsLabels;

        animate();
    }
    else{
        alert("Nenhuma curva foi traçada!");
    }
}

function popAllCurves(){

    if(curves.length > 0){

        const oldcontrolPoints = controlPoints.slice();
        const oldcurves = curves.slice();
        const oldcontrolPointsLabels = controlPointsLabels.slice();

        clearScene();

        controlPoints = oldcontrolPoints;
        curves = [];
        controlPointsLabels = oldcontrolPointsLabels;

        animate();
    }
    else{
        alert("Nenhuma curva foi traçada!");
    }
}

function pushControlPoint(point){

    controlPoints.push(point);

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

    controlPointsLabels.push(labelElement);
}

function setControlPointLabel(i, labelText, [x,y,z]){

    const offsetX = 2.3, offsetY = 2.3, offsetZ = 0;
    let textMesh = new THREE.MeshPhongMaterial( { color: 0xffffff } );

    let labelElement = createTextLabel();
    labelElement.setHTML(labelText);
    labelElement.setParent(canvasContainer);
    labelElement.setPosition(x + offsetX, y + offsetY, z + offsetZ);
    labelElement.updatePosition();

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
        
        let point = controlPoints[i].scene;
        geometry.vertices.push(new THREE.Vector3( point[0], point[1], point[2]) );
    }

    let dotMaterial = new THREE.PointsMaterial( { size: 0.1, sizeAttenuation: true } );
    let dots = new THREE.Points( geometry, dotMaterial );

    scene.add(dots);
    renderer.render( scene, camera );
}

function updateCurves(){

    const curvesToRemove = [];
    
    for(let i = 0;i < curvesSize();i++){

        const curve = getCurve(i);
        const {controlPointsIndex} = curve;
        let pointsInControlPoints = 0;

        if(controlPointsIndex){

            const index = sequence(0, controlPointsSize() - 1, 1);

            controlPointsIndex.forEach(idx=>{
                if(index && idx in index){
                    pointsInControlPoints++;
                }
            });

            if(pointsInControlPoints < controlPointsIndex.length){
                curvesToRemove.push(i);
            }
        }
    }

    curvesToRemove.forEach(curveIndex=>removeCurve(curveIndex));
}

function drawCurves(){

    for(let i = 0;i < curvesSize();i++){

        const curve = getCurve(i);

        if(!curve.controlPointsIndex){

            const controlPointsIndex = getControlPoints().map((e,i)=>i);

            setCurve(i, {...curve, controlPointsIndex : controlPointsIndex});
        }
    }

    //updateCurves();

    for(let i = 0;i < curvesSize();i++){

        const {type, controlPointsIndex} = getCurve(i);

        const controlPoints = getControlPoints().filter((e,i)=>i in controlPointsIndex);

        if(controlPoints.length > 0){

            let geometry = new THREE.Geometry();
            let material = new THREE.LineBasicMaterial( { color: 0xffffff } );

            let points;

            switch(type){
                case curveTypes.BEZIER:
                    points = computeBezier(controlPoints);
                    break;
                case curveTypes.CUBIC_SPLINE:
                    points = computeCubicSplines(controlPoints);
                    break;
                case curveTypes.CATMULL_ROM:
                    points = computeCatmullRomSplines(controlPoints);
                    break;
                case curveTypes.HERMITE:
                    points = computeHermite(controlPoints);
                    break;
            }

            for(let j = 0;j < points.length;j++){
                
                const point = points[j];
                geometry.vertices.push(new THREE.Vector3( point[0], point[1], point[2]) );
            }

            let line = new THREE.Line( geometry, material );
            scene.add( line );
        }

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

function getSelectedControlPoint(mousePosition, delta){

    if(controlPoints.length > 0){
        
        let currControlPoint = null;
        let currDistance = Infinity;
        let index = -1;

        for(let i = 0;i < controlPoints.length;i++){
            const point = controlPoints[i];
            
            const distance = vectorDistance(point.scene, mousePosition.scene);
            
            if(distance <= delta && distance <= currDistance){
                currControlPoint = point; 
                currDistance = distance;
                index = i;
            }
        }

        return (currControlPoint === null ? null : {index, point : currControlPoint});

    }else{
        alert("Nenhum ponto foi adicionado ao canvas!");
    }

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