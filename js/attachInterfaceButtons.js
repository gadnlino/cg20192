let buttonBezier = document.getElementById('BEZIER');
let buttonSplinesCubicas = document.getElementById('CUBIC_SPLINE');
let buttonCatmullRom = document.getElementById('CATMULL_ROM');
let buttonHermite = document.getElementById('HERMITE');

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