import { Bar } from "react-chartjs-2";

 export const YTDOBBChart = () => {
    // ────────────────────────────────────────────────
    // YTD OBB 2025 – Data from chart image
    // ────────────────────────────────────────────────
    const labels = [
      'SP-585',
      'SP-41',
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
      'SP-26',
      'SP-260',
      'SP-261',
      'SP-262',
      'SP-271',
      'SP-2751',
      'SP-276',
      'SP-29',
      'SP-30',
      'SP-3046',
      'SP-31',
      'SP-32',
      'SP-70',
      'SP-93',
      'SP-96',
      'SP-98',
      'SP-99',
    ];

    const dataValues = [
      100,    // SP-585 (very small, near 0)
      6163,   // SP-41
      2109,   // SP-101
      2270,   // SP-103
      1739,   // SP-105
      1758,   // SP-106
      1897,   // SP-107
      1791,   // SP-122
      812,    // SP-123
      1,      // SP-124 (very small)
      1468,   // SP-125/889
      1474,   // SP-154
      1,      // SP-167 (very small)
      6813,   // SP-229
      6896,   // SP-257
      8852,   // SP-258 (peak)
      6505,   // SP-259
      4603,   // SP-26
      4666,   // SP-260
      5561,   // SP-261
      4869,   // SP-262
      4349,   // SP-271
      100,    // SP-2751 (very small)
      3681,   // SP-276
      7212,   // SP-29
      5162,   // SP-30
      646,    // SP-3046
      5130,   // SP-31
      8456,   // SP-32
      8380,   // SP-70
      5088,   // SP-93
      6404,   // SP-96
      4869,   // SP-98
      4347,   // SP-99
    ];

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Total',
          data: dataValues,
          backgroundColor: '#4CAF50', // green matching the image
          borderColor: '#388E3C',
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
          },
        },
        title: {
          display: true,
          text: 'YTD OBB -2025',
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
          callbacks: {
            // Show label as: Series "Total" Point "SP-258" Value: 8852
            title: (items: any[]) => `Series "Total" Point "${items[0].label}"`,
            label: (item: any) => `Value: ${item.raw.toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: { size: window.innerWidth < 768 ? 9 : 11 },
            maxRotation: 90,
            minRotation: 90,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Value',
            font: { size: 13 },
          },
          ticks: {
            stepSize: 2000,
          },
        },
      },
    };

    return <Bar data={chartData} options={options} />;
  };