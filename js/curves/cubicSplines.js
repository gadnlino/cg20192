//para resolver os sistemas lineares
//math.usolve(A, b)

export function drawCubicSplines(){
    computeCubicSplines();
    animate();
}

let du = 1/1e2;
let iu = 0, fu = 1;
let maxSteps = 100;

const curveType = "CUBIC_SPLINE";

//Extraido de
//http://www2.cs.uregina.ca/~anima/408/Notes/Interpolation/UniformBSpline.htm
function computeCubicSplines(){

    let curveVertices = [];

    let n = controlPointsSize();

    for(let i = 0;i < n-3;i++){

        const p0 = getControlPoint(i).scene;    
        const p1 = getControlPoint(i+1).scene;
        const p2 = getControlPoint(i+2).scene;
        const p3 = getControlPoint(i+3).scene;

        for(let u = iu;u <= fu;u += du){

            const m1 = [Math.pow(u,3),Math.pow(u,2),u,1];
            const m2 = [[-1, 3, -3, 1], [3, -6, 3, 4], [-3, 0, 3, 0], [1, 4, 1, 0]];
            const m3 = [p0,p1,p2,p3];

            const r = math.multiply(1/6, math.multiply(m1, math.multiply(m2,m3)));
            curveVertices.push(r);            
        }
    }

    pushCurve({
        type : curveType,
        points : curveVertices
    });
}

