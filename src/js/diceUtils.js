export class Die{
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
            result = result.cross(start);
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
        return Math.sqrt(variance);
    }

    /**
     * 
     * @param {Distribution} other 
     */
    cross(other){
        var result = new Distribution();
        for(const first of this.entries()){
            for(const second of other.entries()){
                var sum = first[0] + second[0];
                var occurrencies = first[1] * second[1];
                var newEntry = result.has(sum) ? result.get(sum) + occurrencies : occurrencies;
                result.set(sum, newEntry);
            }
        }
        return result;
    }

    /**
     * Generate new distribution from an array of <Die>
     * @param {Array<Die>} dicelist 
     */
    static fromDicelist(dicelist){
        if(dicelist.length === 0) return null;
        var result = new Distribution();
        result = dicelist[0].distribution;

        for(var i = 1; i < dicelist.length; i++){
            result = result.cross(dicelist[i].distribution);
        }
        return result;
    }
}