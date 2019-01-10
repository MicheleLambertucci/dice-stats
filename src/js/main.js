import { parseAndGetDistribution, parse } from './dice'
import { Chart } from 'chart.js'

export const parser = parse;

export function updateDistribution(){
    console.log("Called ghei")
    var expr = document.getElementById('expression').value;
    var distribution = parseAndGetDistribution(expr);
    if(distributionChart === undefined){
        distributionChart = createChart()
    }
    updateChart(distributionChart, distribution);
}

/**
 * Update a chart.js chart with new distribution
 * @param {Chart} chart 
 * @param {Map<Number, Number>} distribution 
 */
function updateChart(chart, distribution){
    chart.data.labels = Array.from(distribution.keys());
    var total = Array.from(distribution.values()).reduce(
        (total, value) => total + value
    )
    chart.data.datasets[0].data = Array.from(distribution.values(), 
        (value, position) => value / total);
    chart.update();
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
            labels: [],
            datasets: [{
                label: 'Probability',
                data: []
            }]
        }
    })
    return chart;
}

