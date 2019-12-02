let buttonBezier = document.getElementById('BEZIER');
let buttonSplinesCubicas = document.getElementById('CUBIC_SPLINE');
let buttonCatmullRom = document.getElementById('CATMULL_ROM');
let buttonHermite = document.getElementById('HERMITE');
let buttonAbrirModalInstrucoes = document.getElementById("button-abrir-modal-instrucoes");
let buttonFecharModalInstrucoes = document.getElementById("button-fechar-modal-instrucoes");
let buttonAbrirModalCreditos = document.getElementById("button-abrir-modal-creditos");
let buttonFecharModalCreditos = document.getElementById("button-fechar-modal-creditos")

let previousProgramMode = null;

buttonBezier.onclick = e => switchCurveButton(e);

buttonSplinesCubicas.onclick = e => switchCurveButton(e);

buttonCatmullRom.onclick = e => switchCurveButton(e);

buttonHermite.onclick = e => switchCurveButton(e);

function makeAlert(msg){
    alert(msg);
}

function switchCurveButton(e){

    const id = e.target.id;

    switch(id){
        
        case curveTypes.BEZIER:

            if(controlPointsSize() < 2){
                makeAlert('Selecione pelo menos 2 pontos');
                break;
            }

            pushCurve({type : curveTypes.BEZIER});
            break;

        case curveTypes.CUBIC_SPLINE:

            if(controlPointsSize() < 4){
                makeAlert('Selecione pelo menos 4 pontos');
                break;
            }

            pushCurve({type : curveTypes.CUBIC_SPLINE});
            break; 
        
        case curveTypes.CATMULL_ROM:
            
            if(controlPointsSize() < 4){
                makeAlert('Selecione pelo menos 4 pontos');
                break;
            }

            pushCurve({type : curveTypes.CATMULL_ROM});
            break;

        case curveTypes.HERMITE:
    
                if(controlPointsSize() < 2){
                    makeAlert('Selecione pelo menos 2 pontos');
                    break;
                }
    
                pushCurve({type : curveTypes.HERMITE});
                break;
    }
}

buttonAbrirModalInstrucoes.onclick = () =>{
    previousProgramMode = getProgramMode();
    setProgramMode(programModes.VIEWING_INSTRUCTIONS);
    document.getElementById("modal-instrucoes").style.display='block';
};

buttonFecharModalInstrucoes.onclick = () =>{
    setProgramMode(previousProgramMode);
    document.getElementById('modal-instrucoes').style.display='none';
};

buttonAbrirModalCreditos.onclick = () =>{
    previousProgramMode = getProgramMode();
    setProgramMode(programModes.VIEWING_CREDITS);
    document.getElementById("modal-creditos").style.display='block';
};

buttonFecharModalCreditos.onclick = () =>{
    setProgramMode(previousProgramMode);
    document.getElementById('modal-creditos').style.display='none';
};