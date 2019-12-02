let tension = 0.25;
let alpha = 0.5;
let dtCR = 1/1e2;
let itCR = 0, ftCR = 1;
const npoints = 50;

//Extraído de 
//https://qroph.github.io/2018/07/30/smooth-paths-using-catmull-rom-splines.html
/*function computeCatmullRomSplines(controlPoints){

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

            curveVertices.push(point);
        }
    }

   return curveVertices;
}*/

//Extraido de
//https://en.wikipedia.org/wiki/Centripetal_Catmull–Rom_spline
function computeCatmullRomSplines(controlPoints){

    let curveVertices = [];

    const n = controlPoints.length;

    let getT = (t, p0, p1) => {

        const a = Math.pow(p0[0] - p1[0], 2) + Math.pow(p0[1] - p1[1], 2) + Math.pow(p0[2] - p1[2], 2);
        const b = Math.pow(a, 0.5);
        const c = Math.pow(b, alpha);

        return c+t;
    };

    for(let i = 0;i < n-3;i++){

        const p0 = controlPoints[i].scene;
        const p1 = controlPoints[i+1].scene;
        const p2 = controlPoints[i+2].scene;
        const p3 = controlPoints[i+3].scene;

        const t0 = 0.0;
        const t1 = getT(t0,p0,p1);
        const t2 = getT(t1, p1, p2);
        const t3 = getT(t2, p2, p3);

        for(let t = t1;t < t2;t += (t2-t1)/npoints){

            const aux0 = (t1-t)/(t1-t0);
            const aux1 = (t-t0)/(t1-t0);

            const a1 = addVector(multiplyVector(p0,aux0), multiplyVector(p1,aux1));
            
            const aux2 = (t2-t)/(t2-t1);
            const aux3 = (t-t1)/(t2-t1);

            const a2 = addVector(multiplyVector(p1, aux2), multiplyVector(p2, aux3));

            const aux4 = (t3-t)/(t3-t2);
            const aux5 = (t-t2)/(t3-t2);

            const a3 = addVector(multiplyVector(p2, aux4), multiplyVector(p3, aux5));

            const aux6 = (t2-t)/(t2-t0);
            const aux7 = (t-t0)/(t2-t0);

            const b1 = addVector(multiplyVector(a1, aux6), multiplyVector(a2, aux7));

            const aux8 = (t3-t)/(t3-t1);
            const aux9 = (t-t1)/(t3-t1);

            const b2 = addVector(multiplyVector(a2, aux8) , multiplyVector(a3, aux9));

            const aux10 = (t2-t)/(t2-t1);
            const aux11 = (t-t1)/(t2-t1);

            const c = addVector(multiplyVector(b1, aux10), multiplyVector(b2, aux11));

            curveVertices.push(c);
        }
    }

    return curveVertices;
}