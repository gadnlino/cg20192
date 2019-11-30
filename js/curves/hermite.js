export function drawHermite(){
    computeHermite();
    animate();
}

let tightness = 0.0;
let dt = 1/1e2;
let it = 0, ft = 1;

//https://www.cubic.org/docs/hermite.htm
function computeHermite(){

    let curveVertices = [];

    const n = selectedPoints.length;
    const ndim = selectedPoints[0].length;

    for(let i = 0;i < n-1;i++){
        const p0 = selectedPoints[i];
        const p1 = selectedPoints[i+1];

        let t0, t1;
        if(n === 2){
            t0 = zeros(ndim);
            t1 = zeros(ndim);
        }
        else if(i === 0){
            t0 = zeros(ndim);
            t1 = multiplyVector(subtractVector(selectedPoints[i+2], p0), tightness);
        }
        else if(i === n-2){
            t0 = multiplyVector(subtractVector(p1, selectedPoints[i-1]), tightness);
            t1 = zeros(ndim);
        }
        else{
            t0 = multiplyVector(subtractVector(p1, selectedPoints[i-1]), tightness);
            t1 = multiplyVector(subtractVector(selectedPoints[i+2], p0), tightness);
        }

        for(let t = it;t <= ft;t+=dt){

            const h0 = 2 * Math.pow(t,3) - 3*Math.pow(t,2) + 1;
            const h1 = -2*Math.pow(t,3) + 3*Math.pow(t,2);
            const h2 = Math.pow(t,3) - 2*Math.pow(t,2) + t;
            const h3 = Math.pow(t,3) - Math.pow(t,2);

            const pa1 = multiplyVector(p0, h0);
            const pa2 = multiplyVector(p1, h1);
            const pa3 = multiplyVector(t0, h2);
            const pa4 = multiplyVector(t1, h3);

            const point = addVector(pa1, addVector(pa2, addVector(pa3, pa4)));
            
            curveVertices.push(point);
        }
    }

    pushCurve(curveVertices);
}