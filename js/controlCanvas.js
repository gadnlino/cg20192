let canvasDiv = document.getElementsByTagName('canvas')[0];
let botaoLimparUltimoPonto = document.getElementById("limpar-ultimo-ponto");
let botaoLimparPontos = document.getElementById("limpar-pontos");
let botaoLimparUltimaCurva = document.getElementById("limpar-ultima-curva");
let botaoLimparCurvas = document.getElementById("limpar-curvas");
let botaoLimparTudo = document.getElementById('limpar-tudo');
 
canvasDiv.onclick = e => {
    
    const posX = e.clientX - canvasDiv.getBoundingClientRect().x;
    const posY = e.clientY - canvasDiv.getBoundingClientRect().y;

    const canvasWidth = canvasDiv.getBoundingClientRect().width;
    const canvasHeight = canvasDiv.getBoundingClientRect().height;


    //TA ERRADO, CONSERTAR!!!!!
    const posXRel = (posX - (canvasWidth/2))/8;
    const posYRel = ((canvasHeight/2) - posY)/8;//excuse me, wtf??????
    const posZRel = 0;

    pushPoint([posXRel, posYRel, posZRel]);
    
    animate();
};

botaoLimparUltimoPonto.onclick = e => {
    popPoint();
}

botaoLimparPontos.onclick = e => {
    popAllPoints();
}

botaoLimparUltimaCurva.onclick = e => {
    popCurve();
}

botaoLimparCurvas.onclick = e => {
    popAllCurves();
}

botaoLimparTudo.onclick = e => {
        
    clearScene();
};