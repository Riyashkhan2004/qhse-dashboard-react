// IncidentCorrectiveActionChart.tsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Plugin,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ── Custom plugin: white % labels inside top of each bar ─────────────────────
const insideTopLabelsPlugin: Plugin<'bar'> = {
  id: 'insideTopLabels',
  afterDatasetsDraw(chart) {
    const { ctx, data } = chart;
    const dataset = data.datasets[0];
    const meta = chart.getDatasetMeta(0);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#ffffff';

    meta.data.forEach((bar: any, i: number) => {
      const value = dataset.data[i] as number;
      const label = `${value}%`;
      const x = bar.x;
      const y = bar.y + 4;
      ctx.fillText(label, x, y);
    });

    ctx.restore();
  },
};

ChartJS.register(insideTopLabelsPlugin);

const IncidentCorrectiveActionChart = () => {
  // ────────────────────────────────────────────────
  // Labels & Data – exact values from image (L → R)
  // ────────────────────────────────────────────────
  const labels = [
    'SP-103', 'SP-105', 'SP-106', 'SP-110', 'SP-120',
    'SP-121', 'SP-123', 'SP-124', 'SP-125', 'SP-154',
    'SP-160', 'SP-161', 'SP-165', 'SP-167', 'SP-275',
    'SP-101', 'SP-058', 'SP-122', 'SP-306', 'SP-257',
    'SP-259', 'SP-261', 'SP-276', 'SP-258', 'SP-260',
    'SP-262', 'SP-30',  'SP-31',  'SP-27',  'SP-26',
    'SP-29',  'SP-32',  'SP-107', 'SP-70',  'SP-93',
    'SP-96',  'SP-98',  'SP-229', 'SP-99',  'SP-053',
  ];

  const dataValues = [
    100, 99,  100,
    63,
    74,  74,
    99,  100, 100, 100,
    63,
    74,  74,
    100, 100, 100, 100, 100,
    99,  99,
    100, 100, 100, 100, 100,
    100, 100, 100,
    92,
    100,
    100, 100, 100, 100,
    98,
    100, 100, 100,
    99,
    100,
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Corrective Action Progress (%)',
        data: dataValues,
        backgroundColor: '#5B9BD5', // steel blue matching image
        borderColor: '#5B9BD5',
        borderWidth: 0,
        borderRadius: 0,
        barPercentage: 0.78,
        categoryPercentage: 0.88,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '2024 Incident Corrective Action- Progress Update',
        color: '#666666',
        font: {
          size: 16,
          weight: 'bold' as const,
          family: 'Arial',
        },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.82)',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        callbacks: {
          label: (item: any) => ` Progress: ${item.raw}%`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: window.innerWidth < 900 ? 8 : 10 },
          maxRotation: 90,
          minRotation: 90,
          color: '#222',
        },
        grid: { display: false },
        border: { display: true, color: '#aaa' },
      },
      y: {
        beginAtZero: true,
        max: 108,
        display: false, // y-axis hidden like image
        grid: { display: false },
      },
    },
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '16px',
        boxSizing: 'border-box' as const,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          height: '420px',
          borderRadius: '8px',
          padding: '10px',
        }}
      >
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default IncidentCorrectiveActionChart;