import { Distribution } from './diceUtils'
import { createChart, updateChart } from './distribChart'
import { parse } from './parser'

let distributionChart;

export function updateDistribution(){
    var expr = document.getElementById('expression').value;
    var distribution = parseAndGetDistribution(expr);
    if(distributionChart === undefined){
        distributionChart = createChart('distributionChart')
    }
    updateChart(distributionChart, distribution);
    updateInfo(distribution);
}

export function parseAndGetDistribution(str){
    var dicelist = parse(str);
    var distrib = Distribution.fromDicelist(dicelist);
    return distrib;
}

/**
 * 
 * @param {Distribution} distribution 
 */
function updateInfo(distribution){
    document.getElementById('mean').innerText = distribution.mean.toFixed(2);
    document.getElementById('stddev').innerText = distribution.standardDeviation.toFixed(2);
}