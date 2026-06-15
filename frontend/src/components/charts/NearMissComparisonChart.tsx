import { Bar } from "react-chartjs-2";

 export const NearMissComparisonChart = () => {
    // ────────────────────────────────────────────────
    // Near Miss Comparison – Last Week NM vs This Week NM
    // ────────────────────────────────────────────────
    const labels = [
      'SP-058',
      'SP-101',
      'SP-103',
      'SP-105',
      'SP-106',
      'SP-107',
      'SP-122',
      'SP-123',
      'SP-124',
      'SP-125',
      'SP-154',
      'SP-167',
      'SP-229',
      'SP-257',
      'SP-258',
      'SP-259',
      'SP-260',
      'SP-261',
      'SP-262',
      'SP-275',
      'SP-276',
      'SP-26',
      'SP-27',
      'SP-29',
      'SP-30',
      'SP-31',
      'SP-32',
      'SP-306',
      'SP-93',
      'SP-96',
      'SP-98',
      'SP-99',
      'SP-70',
    ];

    // Last Week NM values (light green bars)
    const lastWeekNM = [
      0,  // SP-058
      0,  // SP-101
      0,  // SP-103
      0,  // SP-105
      0,  // SP-106
      0,  // SP-107
      0,  // SP-122
      0,  // SP-123
      0,  // SP-124
      0,  // SP-125
      0,  // SP-154
      0,  // SP-167
      2,  // SP-229
      2,  // SP-257
      0,  // SP-258
      4,  // SP-259
      8,  // SP-260
      4,  // SP-261
      4,  // SP-262
      0,  // SP-275
      1,  // SP-276
      1,  // SP-26
      2,  // SP-27
      1,  // SP-29
      4,  // SP-30
      4,  // SP-31
      0,  // SP-32
      0,  // SP-306
      0,  // SP-93
      1,  // SP-96
      1,  // SP-98
      0,  // SP-99
      0,  // SP-70
    ];

    // This Week NM values (red bars)
    const thisWeekNM = [
      0,  // SP-058
      0,  // SP-101
      0,  // SP-103
      0,  // SP-105
      0,  // SP-106
      0,  // SP-107
      0,  // SP-122
      0,  // SP-123
      0,  // SP-124
      0,  // SP-125
      0,  // SP-154
      0,  // SP-167
      4,  // SP-229
      2,  // SP-257
      1,  // SP-258
      4,  // SP-259
      8,  // SP-260
      3,  // SP-261
      4,  // SP-262
      0,  // SP-275
      1,  // SP-276
      11, // SP-26
      0,  // SP-27
      0,  // SP-29
      1,  // SP-30
      7,  // SP-31
      5,  // SP-32
      0,  // SP-306
      0,  // SP-93
      2,  // SP-96
      0,  // SP-98
      1,  // SP-99
      0,  // SP-70
    ];

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Last Week NM',
          data: lastWeekNM,
          backgroundColor: '#9ACD32', // yellow-green matching image
          borderColor: '#7BA428',
          borderWidth: 1,
          borderRadius: 2,
        },
        {
          label: 'This Week NM',
          data: thisWeekNM,
          backgroundColor: '#CC0000', // red matching image
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
            usePointStyle: false,
            boxWidth: 20,
          },
        },
        title: {
          display: true,
          text: 'Near Miss Comparison',
          font: {
            size: 18,
            weight: 'bold' as const,
          },
          padding: { top: 10, bottom: 20 },
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          mode: 'index' as const,
          intersect: false,
        },
      },
      scales: {
        x: {
          ticks: {
            font: { size: window.innerWidth < 768 ? 9 : 10 },
            maxRotation: 90,
            minRotation: 90,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Near Miss Count',
            font: { size: 13 },
          },
          ticks: {
            stepSize: 2,
          },
        },
      },
    };

    return (
      <div
        style={{
          height: '450px',
          background: '#ffff',
          borderRadius: '8px',
          padding: '4px',
        }}
      >
        <Bar data={chartData} options={options} />
      </div>
    );
  };