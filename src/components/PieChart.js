import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';

const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  let myChart = null;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    myChart = new Chart(chartRef.current, {
      type: 'pie',
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
      data: {
        labels: ['Red', 'Blue', 'Green'],
        datasets: [{
          data: [
            data.red,
            data.blue,
            data.green
          ],
          backgroundColor: [
            '#ff6384',
            '#36a2eb',
            '#ffce56'
          ]
        }]
      }
    });
    return () => {
      myChart.destroy();
    };
  }, [data]);

  useEffect(() => {
    if (myChart) {
      myChart.data.datasets[0].data = [
        data.red,
        data.blue,
        data.green
      ];
      myChart.update();
    }
  }, [data]);

  return (
    <canvas ref={chartRef} />
  );
}

export default PieChart;
