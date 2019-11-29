import {drawCubicSplines} from './cubicSplines.js';
import {drawBezier} from './bezier.js';
import {drawCatmullRomSplines} from './catmullRomSplines.js';
import {drawHermite} from './hermite.js';

let buttonBezier = document.getElementById('bezier');
let buttonSplinesCubicas = document.getElementById('splines-cubicas');
let buttonCatmullRom = document.getElementById('catmull-rom');
let buttonHermite = document.getElementById('hermite');

function makeAlert(msg){
    alert(msg);
}

buttonBezier.onclick = function(e){
    console.log('bezier clickado');

    if(selectedPoints.length < 2){
        makeAlert('selecione pelo menos 2 pontos');
        return;
    }

    drawBezier();
};

buttonSplinesCubicas.onclick = function(e){
    console.log('splines-cubicas clickado');

    if(selectedPoints.length < 4){
        makeAlert('selecione pelo menos 4 pontos');
        return;
    }
    
    drawCubicSplines();
};

buttonCatmullRom.onclick = function(e){
    console.log('catmull-rom clickado');

    if(selectedPoints.length < 4){
        makeAlert('selecione pelo menos 4 pontos');
        return;
    }

    drawCatmullRomSplines();
};

buttonHermite.onclick = function(e){
    console.log('hermite clickado');

    if(selectedPoints.length < 2){
        makeAlert('selecione pelo menos 2 pontos');
        return;
    }

    drawHermite();
};