import React, { useRef, useEffect } from "react";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip } from "chart.js";
import ChartAnnotation from 'chartjs-plugin-annotation'; // Make sure to install chartjs-plugin-annotation

// Register components and plugin
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, ChartAnnotation);

const LineChart = ({ chartData }) => {
  const chartRef = useRef(null); // Reference for the chart instance
  const canvasRef = useRef(null); // Reference for the canvas element

  const chartOptions = {
    responsive: true, // This makes the chart responsive
    maintainAspectRatio: false, // Allow the chart to adjust its aspect ratio
    plugins: {
      tooltip: {
        enabled: true,
        mode: "nearest", // Nearest point
        intersect: false, // Tooltip shows on hover anywhere on the chart
        callbacks: {
          label: (tooltipItem) => {
            return `Price: $${tooltipItem.raw.toFixed(2)}`; // Show price in tooltip
          },
          title: (tooltipItem) => {
            const time = tooltipItem[0].label; // Get the time of the hovered point
            const price = tooltipItem[0].raw; // Get the price
            return `${time} - $${price.toFixed(2)}`; // Show time and price
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price in USD",
        },
      },
    },
    annotation: {
      annotations: [
        {
          type: "line", // Line annotation for current value
          scaleID: "y",
          value: chartData.datasets[0].data[chartData.datasets[0].data.length - 1], // Use last data point for current value
          borderColor: "rgba(76, 175, 80, 1)", // Green color for current value line
          borderWidth: 2,
          label: {
            enabled: true,
            position: "end",
            content: `$${chartData.datasets[0].data[chartData.datasets[0].data.length - 1].toFixed(2)}`, // Current value label
            font: {
              size: 14,
              weight: "bold",
            },
            backgroundColor: "rgba(76, 175, 80, 0.7)",
            padding: 5,
            color: "white",
          },
        },
      ],
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy previous chart instance
    }

    if (canvasRef.current) {
      chartRef.current = new Chart(canvasRef.current, {
        type: "line", // Line chart type
        data: chartData,
        options: chartOptions,
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Cleanup on unmount
      }
    };
  }, [chartData]); // Re-run when chartData changes

  return (
    <div style={{ position: 'relative', height: '400px' }}>
      <canvas ref={canvasRef}></canvas> {/* Adjust this as needed */}
    </div>
  );
};

export default LineChart;
