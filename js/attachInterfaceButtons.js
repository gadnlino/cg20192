import {drawCubicSplines} from './curves/cubicSplines.js';
import {drawBezier} from './curves/bezier.js';
import {drawCatmullRomSplines} from './curves/catmullRomSplines.js';
import {drawHermite} from './curves/hermite.js';

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
        
        case "BEZIER":

            if(controlPointsSize() < 2){
                makeAlert('Selecione pelo menos 2 pontos');
                break;
            }

            drawBezier();
            break;

        case "CUBIC_SPLINE":

            if(controlPointsSize() < 4){
                makeAlert('Selecione pelo menos 4 pontos');
                break;
            }

            drawCubicSplines();
            break; 
        
        case "CATMULL_ROM":
            
            if(controlPointsSize() < 4){
                makeAlert('Selecione pelo menos 4 pontos');
                break;
            }

            drawCatmullRomSplines();
            break;

        case "HERMITE":
    
                if(controlPointsSize() < 2){
                    makeAlert('Selecione pelo menos 2 pontos');
                    break;
                }
    
                drawHermite();
                break;
    }
}