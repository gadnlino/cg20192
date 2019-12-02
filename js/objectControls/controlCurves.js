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