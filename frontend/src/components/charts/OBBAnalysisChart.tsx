import { Doughnut } from "react-chartjs-2";

export const OBBAnalysisChart = () => {
    // ────────────────────────────────────────────────
    // OBB Analysis Data
    // ────────────────────────────────────────────────
    const chartData = {
      labels: ['Positive Observation', 'Unsafe Act', 'Unsafe Condition'],
      datasets: [
        {
          data: [13, 23, 64],
          backgroundColor: [
            '#4472C4', // blue   – Positive Observation
            '#ED7D31', // orange – Unsafe Act
            '#2E86AB', // teal   – Unsafe Condition (new colour, not gray)
          ],
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 8,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '58%',
      plugins: {
        legend: {
          position: 'left' as const,
          labels: {
            font: { size: 13 },
            padding: 24,
            color: '#333',
            usePointStyle: true,
            pointStyleWidth: 14,
          },
        },
        title: {
          display: true,
          text: 'OBB ANALYSIS',
          color: '#000000',
          font: {
            size: 20,
            weight: 'bold' as const,
          },
          padding: { top: 10, bottom: 20 },
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.85)',
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          callbacks: {
            label: (item: any) => ` ${item.label}: ${item.raw}%`,
          },
        },
      },
    };

    return <Doughnut data={chartData} options={options} />;
  };
