import { Bar } from "react-chartjs-2";

 export const ObservationComparisonChart = () => {
    // ────────────────────────────────────────────────
    // Observation Comparison – Last Week OBB vs This Week OBB
    // ────────────────────────────────────────────────
    const labels = [
      'SP-058', 'SP-101', 'SP-103', 'SP-105', 'SP-106',
      'SP-107', 'SP-122', 'SP-123', 'SP-124', 'SP-125',
      'SP-154', 'SP-167', 'SP-229', 'SP-257', 'SP-258',
      'SP-259', 'SP-260', 'SP-261', 'SP-262', 'SP-275',
      'SP-276', 'SP-26',  'SP-27',  'SP-29',  'SP-30',
      'SP-31',  'SP-32',  'SP-306', 'SP-93',  'SP-96',
      'SP-98',  'SP-99',  'SP-70',
    ];

    // Last Week OBB (light green)
    const lastWeekOBB = [
      0,   65,  0,   0,   0,
      0,   0,   0,   0,   0,
      0,   0,   150, 200, 130,
      75,  118, 113, 95,  65,
      40,  62,  0,   90,  362,
      127, 0,   175, 186, 175,
      0,   186, 175,
    ];

    // This Week OBB (red)
    const thisWeekOBB = [
      0,   72,  58,  0,   0,
      0,   0,   0,   0,   0,
      0,   0,   160, 200, 154,
      85,  140, 134, 95,  45,
      45,  58,  0,   0,   240,
      119, 89,  149, 91,  105,
      67,  168, 156,
    ];

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Last Week OBB',
          data: lastWeekOBB,
          backgroundColor: '#9ACD32',  // light green matching image
          borderColor: '#7BA428',
          borderWidth: 1,
          borderRadius: 2,
        },
        {
          label: 'This Week OBB',
          data: thisWeekOBB,
          backgroundColor: '#CC0000',  // red matching image
          borderColor: '#990000',
          borderWidth: 1,
          borderRadius: 2,
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
            boxWidth: 20,
          },
        },
        title: {
          display: true,
          text: 'Observation Comparison',
          color: '#666666',
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
          mode: 'index' as const,
          intersect: false,
        },
      },
      scales: {
        x: {
          ticks: {
            font: { size: window.innerWidth < 768 ? 8 : 10 },
            maxRotation: 90,
            minRotation: 90,
            color: '#333',
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Observation Count',
            font: { size: 13 },
            color: '#444',
          },
          ticks: {
            stepSize: 50,
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