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

        const oldcurves = curves.slice();

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


function pushControlPoint(point){

    controlPoints.push(point);

    pushControlPointLabel(`p${controlPoints.length-1}`, point.screen);
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
