import { Chart } from 'chart.js'
import { Distribution } from './diceUtils'

/**
 * Create a new blank chart.js in <canvas id=`canvasId`>
 * @param {String} canvasId
 */
export function createChart(canvasId){
    var ctx = document.getElementById(canvasId).getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [1, 2, 3, 4, 5, 6],
            datasets: [{
                label: 'Probability',
                data: [0, 0, 0, 0, 0, 0]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        suggestedMin: 0
                    }
                }]
            }
        }
    })
    return chart;
}

/**
 * Update a chart.js chart with new distribution
 * @param {Chart} chart 
 * @param {Distribution} distribution 
 */
export function updateChart(chart, distribution){
    chart.data.labels = distribution.labels;
    chart.data.datasets[0].data = distribution.probabilities;
    chart.update();
}