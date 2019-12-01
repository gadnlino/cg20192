let tension = 0.25;
let alpha = 1;
let dtCR = 1/1e2;
let itCR = 0, ftCR = 1;

//Extraído de 
//https://qroph.github.io/2018/07/30/smooth-paths-using-catmull-rom-splines.html
function computeCatmullRomSplines(controlPoints){

    let curveVertices = [];

    let n = controlPoints.length;

    for(let i = 0;i < n-3;i++){

        const p0 = controlPoints[i].scene;    
        const p1 = controlPoints[i+1].scene;
        const p2 = controlPoints[i+2].scene;
        const p3 = controlPoints[i+3].scene;
        
        const t0 = 0;
        const t1 = t0 + Math.pow(vectorDistance(p0, p1), alpha);
        const t2 = t1 + Math.pow(vectorDistance(p1, p2), alpha);
        const t3 = t2 + Math.pow(vectorDistance(p2, p3), alpha);


        const m1 = multiplyVector(subtractVector(divideVector(subtractVector(p1,p0), t1-t0), 
                                    addVector(divideVector(subtractVector(p2,p0), t2-t0), 
                                                divideVector(subtractVector(p2,p1), t2-t1))), 
                                (1.0-tension)*(t2-t1));



        const m2 = multiplyVector(subtractVector(divideVector(subtractVector(p2,p1), t2-t1), 
                                    addVector(divideVector(subtractVector(p3,p1), t3-t1), 
                                                divideVector(subtractVector(p3,p2), t3-t2))),
                                (1.0-tension)*(t2-t1));

        const a = addVector(multiplyVector(subtractVector(p1,p2), 2.0), addVector(m1,m2));
        const b = addVector(multiplyVector(subtractVector(p1,p2), -3.0), 
                            subtractVector(multiplyVector(m1, -2.0),m2));
        const c = m1;
        const d = p1;

        for(let t =itCR;t <= ftCR;t+=dtCR){
            
            const g3 = multiplyVector(a, Math.pow(t,3));
            const g2 = multiplyVector(b, Math.pow(t,2));
            const g1 = multiplyVector(c,t);

            const point = addVector(g3, addVector(g2, addVector(g1, d)));

            /*const m1 = [Math.pow(t,3), Math.pow(t,2), t, 1];
            const m2 = [[-1, 3, -3, 1], [2, -5, 4, 1], [-1, 0, 1, 0],[0, 2, 0, 0]];
            const m3 = [p0,p1,p2,p3];

            const point = math.multiply(m1, math.multiply(m2,m3));*/

            curveVertices.push(point);
        }
    }

   return curveVertices;
}