let canvasDiv = document.getElementsByTagName('canvas')[0];
let botaoLimparUltimoPonto = document.getElementById("limpar-ultimo-ponto");
let botaoLimparPontos = document.getElementById("limpar-pontos");
let botaoLimparUltimaCurva = document.getElementById("limpar-ultima-curva");
let botaoLimparCurvas = document.getElementById("limpar-curvas");
let botaoLimparTudo = document.getElementById('limpar-tudo');
let botaoMoverPontos = document.getElementById('mover-pontos');

canvasDiv.onclick = e => {

    const canvasWidth = canvasDiv.getBoundingClientRect().width;
    const canvasHeight = canvasDiv.getBoundingClientRect().height;
    const canvasLeft = canvasDiv.getBoundingClientRect().x;
    const canvasTop = canvasDiv.getBoundingClientRect().y;

    let posX = e.clientX - canvasLeft;
    let posY = e.clientY - canvasTop;
    let posZ = 0.5;

    let mouse = new THREE.Vector3();

    mouse.x = (posX/canvasWidth)*2 - 1;
    mouse.y = -(posY/canvasHeight)*2 + 1;
    mouse.z = posZ;

    mouse.unproject(camera);

    const point = {
        screen : [e.clientX, e.clientY, 0],
        canvas : [posX, posY, posZ],
        scene : [mouse.x, mouse.y, mouse.z]
    };

    switch(currProgramMode){

        case programModes.STANDARD:

            pushControlPoint(point);
            animate();

            break;

        case programModes.MOVING_POINTS:

            const DELTA = 0.12229631614255307; //tentativa e erro

            moveControlPoints(point, DELTA);
            
            break;
    }
};

botaoMoverPontos.onclick = e => {

    if(currProgramMode === programModes.STANDARD){
        setProgramMode(programModes.MOVING_POINTS);

        botaoMoverPontos.innerHTML = "Parar";
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