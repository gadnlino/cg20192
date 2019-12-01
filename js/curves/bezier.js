let dxB = 1/1e2;
let itB = 0, ftB = 1;

//https://www.freecodecamp.org/news/nerding-out-with-bezier-curves-6e3c0bc48e2f/
function computeBezier(controlPoints){

    //clearCurveVertices();

    let curveVertices = [];

    let n = controlPoints.length;
    let ndim = controlPoints[0].scene.length;

    for(let t = itB;t <= ftB; t += dxB ){

        let bt = zeros(ndim);

        for(let i = 0;i < n;i++){
            
            let p = controlPoints[i].scene;
            let coef = binomial(n-1,i)*Math.pow(1-t, n-1-i)*Math.pow(t,i);
            let cp = multiplyVector(p, coef);
            bt = addVector(cp,bt);
        }
        
        curveVertices.push(bt);
    }

    return curveVertices;
}