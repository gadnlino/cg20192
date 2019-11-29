let canvasDiv = document.getElementsByTagName('canvas')[0];
let buttonResetarCanvas = document.getElementById('resetar');

canvasDiv.onclick = function(e){
    
    const posX = e.clientX - canvasDiv.getBoundingClientRect().x;
    const posY = e.clientY - canvasDiv.getBoundingClientRect().y;

    const canvasWidth = canvasDiv.getBoundingClientRect().width;
    const canvasHeight = canvasDiv.getBoundingClientRect().height;

    const posXRel = (posX - (canvasWidth/2))/8;
    const posYRel = ((canvasHeight/2) - posY)/8;//excuse me, wtf??????
    const posZRel = 0;

    //console.log([posXRel, posYRel, posZRel]);

    pushPoint([posXRel, posYRel, posZRel]);
    
    animate();
};

buttonResetarCanvas.onclick = function(e){
        
    clearScene();
};

/* 
let selectedPointsElement = document.getElementById("selected-points-element");

function clearChildElements(node){
    while(node.firstChild){
        node.removeChild(node.firstChild);
    }
}

clearChildElements(selectedPointsElement); */