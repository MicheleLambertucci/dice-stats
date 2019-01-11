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
                label: 'Distribution',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                hoverBackgroundColor: 'rgba(178, 34, 34, 0.5)'
            }]
        },
        options: {
            legend: {
                display: false
            },
            layout: {
                padding: {
                    top: 10
                }
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        suggestedMin: 0
                    },
                    offset: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Probability'
                    }
                }]
            },
            tooltips: {
                displayColors: false,
                callbacks: {
                    label: function(tooltipItem, data){
                        return String((Number(tooltipItem.yLabel)*100).toFixed(2))+'%'
                    }
                }
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