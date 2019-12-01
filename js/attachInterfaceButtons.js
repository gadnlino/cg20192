import {drawCubicSplines} from './curves/cubicSplines.js';
import {drawBezier} from './curves/bezier.js';
import {drawCatmullRomSplines} from './curves/catmullRomSplines.js';
import {drawHermite} from './curves/hermite.js';

let buttonBezier = document.getElementById('bezier');
let buttonSplinesCubicas = document.getElementById('splines-cubicas');
let buttonCatmullRom = document.getElementById('catmull-rom');
let buttonHermite = document.getElementById('hermite');

function makeAlert(msg){
    alert(msg);
}

buttonBezier.onclick = function(e){
    console.log('bezier clickado');

    if(controlPoints.length < 2){
        makeAlert('Selecione pelo menos 2 pontos');
        return;
    }

    drawBezier();
};

buttonSplinesCubicas.onclick = function(e){
    console.log('splines-cubicas clickado');

    if(controlPoints.length < 4){
        makeAlert('Selecione pelo menos 4 pontos');
        return;
    }
    
    drawCubicSplines();
};

buttonCatmullRom.onclick = function(e){
    console.log('catmull-rom clickado');

    if(controlPoints.length < 4){
        makeAlert('Selecione pelo menos 4 pontos');
        return;
    }

    drawCatmullRomSplines();
};

buttonHermite.onclick = function(e){
    console.log('hermite clickado');

    if(controlPoints.length < 2){
        makeAlert('Selecione pelo menos 2 pontos');
        return;
    }

    drawHermite();
};
