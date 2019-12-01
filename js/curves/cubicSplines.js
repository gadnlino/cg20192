//para resolver os sistemas lineares
//math.usolve(A, b)

let duS = 1/1e2;
let iuS = 0, fuS = 1;

//Extraido de
//http://www2.cs.uregina.ca/~anima/408/Notes/Interpolation/UniformBSpline.htm
function computeCubicSplines(controlPoints){

    let curveVertices = [];

    let n = controlPoints.length;

    for(let i = 0;i < n-3;i++){

        const p0 = controlPoints[i].scene;    
        const p1 = controlPoints[i+1].scene;
        const p2 = controlPoints[i+2].scene;
        const p3 = controlPoints[i+3].scene;

        for(let u = iuS;u <= fuS;u += duS){

            const m1 = [Math.pow(u,3),Math.pow(u,2),u,1];
            const m2 = [[-1, 3, -3, 1], [3, -6, 3, 4], [-3, 0, 3, 0], [1, 4, 1, 0]];
            const m3 = [p0,p1,p2,p3];

            const r = math.multiply(1/6, math.multiply(m1, math.multiply(m2,m3)));
            curveVertices.push(r);            
        }
    }

   return curveVertices;
}

