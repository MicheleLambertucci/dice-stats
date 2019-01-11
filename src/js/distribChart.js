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
            onHover: function(e, elements){
                var colors = 'rgba(0, 0, 0, 0.3)'
                if(elements.length > 0){
                    var index = elements[0]._index;
                    colors = Array.from(elements[0]._chart.config.data.labels, 
                        (_, i) => {
                            if(i <= index) return 'rgba(178, 34, 34, 0.5)'
                            else return 'rgba(0, 0, 0, 0.3'
                        });
                    }
                chart.data.datasets[0].backgroundColor = colors;
                chart.update()
            },
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
                        var partialSum = data.datasets[0].data.slice(0, tooltipItem.index+1).reduce(
                            (total, value) => total+value
                        )
                        return String((partialSum*100).toFixed(2))+'%'
                    },
                    title: function(tooltipItem, data){
                        return '1 - ' + String(tooltipItem[0].index+1)
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