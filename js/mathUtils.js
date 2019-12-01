function addVector(v1,v2){
    
    if(v1.length === v2.length){
        let result = [];

        for(let i = 0;i < v1.length;i++){
            result.push(v1[i] + v2[i]);
        }

        return result;
    }
}

function subtractVector(v1,v2){
    if(v1.length === v2.length){
        let result = [];

        for(let i = 0;i < v1.length;i++){
            result.push(v1[i] - v2[i]);
        }

        return result;
    }
}

function multiplyVector(v, s){

    let result = [];

    for(let i = 0;i < v.length;i++){
        result.push(v[i]*s);
    }

    return result;
}

function divideVector(v, s){

    let result = [];

    for(let i = 0;i < v.length;i++){
        result.push(v[i]/s);
    }

    return result;
}

let fact = [1,1];

function factorial(n){
    if(fact[n]){
        return fact[n];
    }

    fact[n] = factorial(n-1)*n;

    return fact[n];
}

function binomial(n,k){
    return ((factorial(n))/(factorial(k)*factorial(n-k)));
}

function zeros(n){
    let ret = [];

    for(let i = 0;i < n;i++){
        ret.push(0);
    }

    return ret;
}

function ones(n){
    let ret = [];

    for(let i = 0;i < n;i++){
        ret.push(1);
    }

    return ret;
}

function vectorDistance(v1,v2){

    const dx = v1[0] - v2[0], dy = v1[1] - v2[1], dz = v1[2] - v2[2];

    return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

function sequence(from, to, delta){
    if(from < to){
        
        let ret = [];

        for(let i = from; i <= to;i+= delta){
            ret.push(i);
        }


        return ret;
    }
}