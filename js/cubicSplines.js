//para resolver os sistemas lineares
//math.usolve(A, b)

export function drawCubicSplines(){
    computeCubicSplines();
    animate();
}

let du = 1/1e2;
let iu = 0, fu = 1;

////http://www2.cs.uregina.ca/~anima/408/Notes/Interpolation/UniformBSpline.htm
function computeCubicSplines(){

    clearCurveVertices();

    let n = selectedPoints.length;

    for(let i = 0;i < n-3;i++){

        const p0 = selectedPoints[i];
        const p1 = selectedPoints[i+1];
        const p2 = selectedPoints[i+2];
        const p3 = selectedPoints[i+3];

        for(let u = iu;u <= fu;u += du){

            const m1 = [Math.pow(u,3),Math.pow(u,2),u,1];
            const m2 = [[-1, 3, -3, 1], [3, -6, 3, 4], [-3, 0, 3, 0], [1, 4, 1, 0]];
            const m3 = [p0,p1,p2,p3];

            const r = math.multiply(1/6, math.multiply(m1, math.multiply(m2,m3)));

            pushVertex(r);

            //console.log(u);
        }
    }

    //console.log(curveVertices[0], curveVertices[curveVertices.length-1]);

}

