class Die{
    /**
     * 
     * @param {number} n 
     * @param {number} m 
     * @param {number} multiplier 
     */
    constructor(n, m, multiplier=1){
        this.n = n;
        this.m = m;
        this.multiplier = multiplier;
    }

    get distribution(){
        var entries = Array.from({length: this.m}, (value, index) => [this.multiplier*(index+1), 1]);
        const start = new Distribution(entries);
        var result = new Distribution(entries);

        for(var i = 1; i < this.n; i++){
            result = cross(result, start);
        }

        return result;
    }

    roll(){
        var extractions = Array.from({length: this.n} , ()=>Math.floor(Math.random()*this.m + 1))
        return {
            'extractions': extractions,
            'sum': extractions.reduce((result, val) => result+val)
        };
    }
}

export class Distribution extends Map {
    get totalCombinations(){
        return Array.from(this.values()).reduce((total, value) => total + value);
    }

    get labels(){
        return Array.from(this.keys());
    }

    get probabilities(){
        return Array.from(this.values(), (val, _) => val / this.totalCombinations);
    }

    probability(key){
        return this.get(key) / this.totalCombinations;
    }

    get mean(){
        return Array.from(this.keys(), (key, _) => 
                this.probability(key) * key
            ).reduce((total, value) => total + value);
    }

    get standardDeviation(){
        var variance = Array.from(this.keys(), (val, _) => this.probability(val) * Math.pow(val - this.mean, 2))
            .reduce((total, val) => total + val);
        console.log(variance)
        return Math.sqrt(variance);
    }
}

function cross(a, b){
    var result = new Distribution();
    for(const first of a.entries()){
        for(const second of b.entries()){
            var sum = first[0] + second[0];
            var occurrencies = first[1] * second[1];
            var newEntry = result.has(sum) ? result.get(sum) + occurrencies : occurrencies;
            result.set(sum, newEntry);
        }
    }
    return result;
}

/**
 * @param {Array<Die>} dicelist
 */
function distributionFromArray(dicelist){
    if(dicelist.length === 0) return null;
    var result = new Distribution();
    result = dicelist[0].distribution;

    for(var i = 1; i < dicelist.length; i++){
        result = cross(result, dicelist[i].distribution);
    }
    return result;
}

export function parseAndGetDistribution(str){
    var dicelist = parse(str);
    var distrib = distributionFromArray(dicelist);
    return distrib;
}

export class ParsingError extends Error {}

export function parse(str){
    const languageExpr = /^((\+|\-|^)(\d+|d\d+|\d+d\d+))+$/gm;
    const constantNumbers = /(?:(\+|\-|^)(\d+)(?!d)(?:(\+|\-|$)))/gm;
    const missingDiceNumber = /(\+|\-|^)(d\d+)/gm;

    var result = str.replace(/\s/gm, ``);

    if(!languageExpr.test(result)) throw new ParsingError();

    result = result.replace(constantNumbers, `$&d1`);
    result = result.replace(missingDiceNumber, `$11$2`);
    
    const diceExpr = /(?<sign>\+|\-|^)(?<n_of>\d+)d(?<dtype>\d+)/gm;
    var ret = []

    let match;
    while((match = diceExpr.exec(result)) !== null){
        var multiplier;
        switch(match.groups['sign']){
            case "+":
                multiplier = 1;
                break;
            case "-":
                multiplier = -1;
                break;
            default:
                multiplier = 1;
        }

        ret.push(new Die(
            Number(match.groups['n_of']),
            Number(match.groups['dtype']),
            multiplier
        ))
    }

    return ret;
}