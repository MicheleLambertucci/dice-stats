import { parseAndGetDistribution, Distribution } from './dice'
import { Chart } from 'chart.js'

export function updateDistribution(){
    console.log("Called ghei")
    var expr = document.getElementById('expression').value;
    var distribution = parseAndGetDistribution(expr);
    if(distributionChart === undefined){
        distributionChart = createChart()
    }
    updateChart(distributionChart, distribution);
    updateInfo(distribution);
}

/**
 * Update a chart.js chart with new distribution
 * @param {Chart} chart 
 * @param {Distribution} distribution 
 */
function updateChart(chart, distribution){
    chart.data.labels = distribution.labels;
    chart.data.datasets[0].data = distribution.probabilities;
    chart.update();
}

/**
 * 
 * @param {Distribution} distribution 
 */
function updateInfo(distribution){
    document.getElementById('mean').innerText = distribution.mean.toFixed(2);
    document.getElementById('stddev').innerText = distribution.standardDeviation.toFixed(2);
}

export let distributionChart;

/**
 * Create a new blank chart.js in <canvas id='distributionChart'>
 */
export function createChart(){
    var ctx = document.getElementById('distributionChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [1, 2, 3, 4, 5, 6],
            datasets: [{
                label: 'Probability',
                data: [0, 0, 0, 0, 0, 0]
            }]
        }
    })
    return chart;
}

