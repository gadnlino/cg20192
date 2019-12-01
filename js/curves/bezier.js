export function drawBezier(){
    computeBezier();
    animate();
}

let dx = 1/1e4;
let it = 0, ft = 1;

const curveType = "BEZIER";

//https://www.freecodecamp.org/news/nerding-out-with-bezier-curves-6e3c0bc48e2f/
function computeBezier(){

    //clearCurveVertices();

    let curveVertices = [];

    let n = controlPointsSize();
    let ndim = getControlPoint(0).scene.length;

    for(let t = it;t <= ft; t += dx ){

        let bt = zeros(ndim);

        for(let i = 0;i < n;i++){
            
            let p = getControlPoint(i).scene;
            let coef = binomial(n-1,i)*Math.pow(1-t, n-1-i)*Math.pow(t,i);
            let cp = multiplyVector(p, coef);
            bt = addVector(cp,bt);
        }
        
        curveVertices.push(bt);
    }

    pushCurve({
        type : curveType,
        points : curveVertices
    });
}