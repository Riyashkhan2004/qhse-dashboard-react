import { Bar } from "react-chartjs-2";

export const YearWithoutLTIChart = () => {
    // ────────────────────────────────────────────────
    // Year without LTI – Descending order from image
    // ────────────────────────────────────────────────
    const labels = [
      'SP-103', 'SP-101', 'SP-229', 'SP-125', 'SP-123',
      'SP-124', 'SP-165', 'SP-154', 'SP-276', 'SP-160',
      'SP-68',  'SP-122', 'SP-53L', 'SP-167', 'SP-306',
      'SP-257', 'SP-259', 'SP-262', 'SP-260', 'SP-258',
      'SP-261', 'SP-105', 'SP-161', 'SP-110', 'SP-120',
      'SP-26',  'SP-29',  'SP-31',  'SP-27',  'SP-32',
      'SP-30',  'SP-106',
    ];

    const dataValues = [
      19.5, 13.7, 13.1, 12.0, 11.9,
      11.9, 11.7, 11.6, 10.8,  7.1,
       6.7,  6.6,  6.6,  6.3,  6.3,
       5.5,  5.5,  5.1,  5.1,  5.1,
       5.0,  4.6,  4.4,  4.4,  3.6,
       3.4,  3.3,  3.3,  3.3,  3.2,
       2.5,  2.3,
    ];

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Year without LTI',
          data: dataValues,
          backgroundColor: '#4472C4',   // blue matching image
          borderColor: '#2F539B',
          borderWidth: 1,
          borderRadius: 3,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            font: { size: 13 },
            padding: 16,
            color: '#333',
            boxWidth: 18,
          },
        },
        title: {
          display: true,
          text: 'Year without LTI',
          color: '#666666',   // gray color
          font: {
            size: 20,
            weight: 'bold' as const,
          },
          padding: { top: 10, bottom: 16 },
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.85)',
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          callbacks: {
            label: (item: any) => `Year without LTI: ${item.raw}`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: { size: window.innerWidth < 768 ? 8 : 10 },
            maxRotation: 90,
            minRotation: 90,
            color: '#000000',   // black x-axis labels
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Years',
            font: { size: 13 },
            color: '#444',
          },
          ticks: {
            stepSize: 5,
            font: { size: 11 },
          },
          grid: {
            color: 'rgba(0,0,0,0.08)',
          },
        },
      },
    };

    return <Bar data={chartData} options={options} />;
  };