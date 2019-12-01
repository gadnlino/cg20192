let canvasDiv = document.getElementsByTagName('canvas')[0];
let botaoLimparUltimoPonto = document.getElementById("limpar-ultimo-ponto");
let botaoLimparPontos = document.getElementById("limpar-pontos");
let botaoLimparUltimaCurva = document.getElementById("limpar-ultima-curva");
let botaoLimparCurvas = document.getElementById("limpar-curvas");
let botaoLimparTudo = document.getElementById('limpar-tudo');
let botaoMoverPontos = document.getElementById('mover-pontos');

const canvasWidth = canvasDiv.getBoundingClientRect().width;
const canvasHeight = canvasDiv.getBoundingClientRect().height;
const canvasLeft = canvasDiv.getBoundingClientRect().x;
const canvasTop = canvasDiv.getBoundingClientRect().y;

document.addEventListener("mousedown", e=>handleMouseDownEvent(e), false);
document.addEventListener("mousemove", e=>handleMouseMoveEvent(e), false);
document.addEventListener("mouseup", e=>handleMouseUpEvent(e), false);

let selection = null;

let handleMouseDownEvent = e => {

    const mouseXyz = getMousePosition(e);
    const mouseCanvas = mouseXyz.canvas;
    const mouse = new THREE.Vector3(mouseXyz.screen[0], mouseXyz.screen[1], mouseXyz.screen[2]);

    if(mouseCanvas[0] >= 0 && mouseCanvas[1] >= 0){
        
        if(getProgramMode() === programModes.MOVING_POINTS){

            const DELTA = 0.12229631614255307; //tentativa e erro

            selection = getSelectedControlPoint(mouseXyz, DELTA);
        }
        else if(getProgramMode() === programModes.STANDARD){
            
            pushControlPoint(mouseXyz);
            animate();
        }
    }
}

let handleMouseMoveEvent = e => {

    const mouseXyz = getMousePosition(e);
    const mouseCanvas = mouseXyz.canvas;
    const mouse = new THREE.Vector3(mouseXyz.screen[0], mouseXyz.screen[1], mouseXyz.screen[2]);

    if(mouseCanvas[0] >= 0 && mouseCanvas[1] >= 0){
        
        if(getProgramMode() === programModes.MOVING_POINTS){
            
            if(selection != null){
                
                setControlPoint(selection.index, mouseXyz);
                const points = getControlPoints();
                const curves = getCurves();

                if(controlPointsSize() > 0){
                    popAllControlPoints();
                }

                if(curvesSize() > 0){
                    popAllCurves();
                }

                for(let i = 0;i < points.length;i++){
                    
                    pushControlPoint(points[i]);
                }

                for(let i = 0;i < curves.length;i++){
                    pushCurve(curves[i]);
                }

                animate();
            }
        }
    }
}

let handleMouseUpEvent = e => {

    const mouseXyz = getMousePosition(e);
    const mouseCanvas = mouseXyz.canvas;
    const mouse = new THREE.Vector3(mouseXyz.screen[0], mouseXyz.screen[1], mouseXyz.screen[2]);

    if(mouseCanvas[0] >= 0 && mouseCanvas[1] >= 0){

        if(getProgramMode() === programModes.MOVING_POINTS){

           selection = null;
        }
    }
}

botaoMoverPontos.onclick = e => {

    if(currProgramMode === programModes.STANDARD){
        setProgramMode(programModes.MOVING_POINTS);

        botaoMoverPontos.innerHTML = "Parar de mover";
    }
    else if(currProgramMode === programModes.MOVING_POINTS){
        setProgramMode(programModes.STANDARD);

        botaoMoverPontos.innerHTML = "Mover pontos";
    }
};

botaoLimparUltimoPonto.onclick = () => popControlPoint();

botaoLimparPontos.onclick = () => popAllControlPoints();

botaoLimparUltimaCurva.onclick = () => popCurve();

botaoLimparCurvas.onclick = () => popAllCurves();

botaoLimparTudo.onclick = () => clearScene();