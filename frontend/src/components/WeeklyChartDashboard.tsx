// WeeklyChartDashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ObservationComparisonChart } from './charts/ObservationComparisonChart';
import { OBBAnalysisChart } from './charts/OBBAnalysisChart';
import { NearMissComparisonChart } from './charts/NearMissComparisonChart';
import { YTDOBBChart } from './charts/YTDOBBChart';
import { YearWithoutLTIChart } from './charts/YearWithoutLTIChart';
import IncidentCorrectiveActionChart from './charts/IncidentCorrectiveActionChart';
import { mvvAPI, MVVByMonthProject, MVVByProject } from '../services/mvvAPI';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// REUSABLE STYLES & COMPONENTS

// Common chart container style (used throughout the dashboard)
const CHART_CONTAINER_STYLE: React.CSSProperties = {
  height: '480px',
  background: '#ffff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

// Common row grid style (used for chart rows)
const CHART_ROW_STYLE: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))',
  gap: '32px',
  marginBottom: '48px',
};

// Chart wrapper component for consistent styling
interface ChartContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ children, style }) => (
  <div style={{ ...CHART_CONTAINER_STYLE, ...style }}>
    {children}
  </div>
);

// Chart row component for grid layout
interface ChartRowProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const ChartRow: React.FC<ChartRowProps> = ({ children, style }) => (
  <div style={{ ...CHART_ROW_STYLE, ...style }}>
    {children}
  </div>
);

// REUSABLE CHART OPTION BUILDERS

// Base bar chart options factory
interface BarChartOptionsParams {
  title: string;
  yAxisTitle?: string;
  indexAxis?: 'x' | 'y';
  stepSize?: number;
  beginAtZero?: boolean;
  maxRotation?: number;
  minRotation?: number;
  stacked?: boolean;
}

const createBarChartOptions = (params: BarChartOptionsParams): ChartOptions<'bar'> => {
  const {
    title,
    yAxisTitle = 'Count',
    indexAxis = 'x',
    stepSize,
    beginAtZero = true,
    maxRotation = 0,
    minRotation = 0,
    stacked = false,
  } = params;

  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: title,
        font: { size: 18, weight: 'bold' as const },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked,
        ticks: {
          font: { size: window.innerWidth < 768 ? 11 : 13 },
          maxRotation,
          minRotation,
        },
      },
      y: {
        stacked,
        beginAtZero,
        title: { display: true, text: yAxisTitle, font: { size: 14 } },
        ticks: stepSize ? { stepSize } : undefined,
      },
    },
  };
};

// Base doughnut chart options factory
interface DoughnutChartOptionsParams {
  title: string;
  cutout?: string;
  rotation?: number;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
}

const createDoughnutChartOptions = (params: DoughnutChartOptionsParams): ChartOptions<'doughnut'> => {
  const {
    title,
    cutout = '60%',
    rotation = 0,
    legendPosition = 'right',
  } = params;

  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout,
    rotation,
    plugins: {
      legend: {
        position: legendPosition,
        labels: {
          font: { size: 13, weight: 500 },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          generateLabels: (chart) => {
            const data = chart.data.datasets[0];
            const colors = data.backgroundColor as string[];
            return chart.data.labels?.map((label, i) => ({
              text: `${label} ${data.data[i]}%`,
              fillStyle: colors[i] || '#000',
              strokeStyle: '#fff',
              lineWidth: 2,
              hidden: false,
              index: i,
            })) || [];
          },
        },
      },
      title: {
        display: true,
        text: title,
        font: { size: 20, weight: 'bold' },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return ` ${label}: ${value}%`;
          },
        },
      },
    },
  };
};

// Create percentage labels plugin for doughnut charts
interface PercentageLabelsPluginParams {
  minValueForDisplay?: number;
  largeThreshold?: number;
}

const createPercentageLabelsPlugin = (params: PercentageLabelsPluginParams = {}) => {
  const { minValueForDisplay = 3, largeThreshold = 15 } = params;

  return {
    id: 'percentageLabels',
    afterDatasetsDraw(chart: any) {
      const { ctx, data } = chart;
      ctx.save();

      data.datasets.forEach((dataset: any, dsIndex: number) => {
        const meta = chart.getDatasetMeta(dsIndex);
        meta.data.forEach((arc: any, index: number) => {
          const value = dataset.data[index];
          if (value < minValueForDisplay) return;

          const { x, y } = arc.tooltipPosition();
          const percentage = `${value}%`;

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = value >= largeThreshold ? 'bold 16px Arial' : 'bold 13px Arial';
          ctx.fillStyle = value >= largeThreshold ? '#ffffff' : '#000000';
          ctx.fillText(percentage, x, y);
        });
      });

      ctx.restore();
    },
  };
};

// MAIN COMPONENT

const WeeklyChartDashboard = () => {
  // ────────────────────────────────────────────────
  // MVV Data State
  // ────────────────────────────────────────────────
  const [mvvByMonthProject, setMvvByMonthProject] = useState<MVVByMonthProject[]>([]);
  const [mvvByProject, setMvvByProject] = useState<MVVByProject[]>([]);
  const [mvvLoading, setMvvLoading] = useState(true);

  // Get current year for filtering
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchMVVData = async () => {
      try {
        setMvvLoading(true);
        // Fetch MVV by month and project
        const monthProjectData = await mvvAPI.getByMonthAndProject(currentYear);
        setMvvByMonthProject(monthProjectData);

        // Fetch MVV by project
        const projectData = await mvvAPI.getByProject(currentYear);
        setMvvByProject(projectData);
      } catch (error) {
        console.error('Error fetching MVV data:', error);
      } finally {
        setMvvLoading(false);
      }
    };

    fetchMVVData();
  }, []);
  // ────────────────────────────────────────────────
  // Leading Indicators (only Observations in your table)
  // ────────────────────────────────────────────────
  const leadingData = {
    labels: ['Observations'],
    datasets: [
      {
        label: 'YTD',
        data: [135684],
        backgroundColor: '#4e79a7',
      },
      {
        label: 'Last Week',
        data: [2668],
        backgroundColor: '#f28e2c',
      },
      {
        label: 'This Week',
        data: [2274],
        backgroundColor: '#59a14f',
      },
    ],
  };

  const leadingOptions = createBarChartOptions({
    title: 'Leading Indicators – Observations',
    yAxisTitle: 'Count',
  });

  // ────────────────────────────────────────────────
  // Lagging Indicators – exact values from your table
  // ────────────────────────────────────────────────
  const laggingLabels = [
    'FAT',
    'LTI',
    'RDI',
    'MTC',
    'FIRST AID',
    'NEAR MISS',
    'FIRE',
    'MVA',
    'OFF JOB INCIDENT',
    'OIL SPILL',
    'NON WORK RELATED-NWR',
    'PROPERTY DAMAGE',
  ];

  const laggingData = {
    labels: laggingLabels,
    datasets: [
      {
        label: 'YTD',
        data: [0, 2, 1, 0, 19, 2571, 1, 1, 0, 0, 13, 4],
        backgroundColor: '#4e79a7',
      },
      {
        label: 'Last Week',
        data: [0, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#f28e2c',
      },
      {
        label: 'This Week',
        data: [0, 0, 0, 0, 0, 33, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#59a14f',
      },
    ],
  };

  const laggingOptions = createBarChartOptions({
    title: 'Lagging Indicators – YTD / Last Week / This Week',
    yAxisTitle: 'Number of Incidents',
    stepSize: 500,
    maxRotation: 50,
    minRotation: 50,
  });

  // Exact data from your screenshot
  const labels = [
    'FAT',
    'LTI',
    'RDI',
    'MTC',
    'FIRST AID',
    'FIRE',
    'MVA',
    'OFF JOB INCIDENT',
    'OIL SPILL',
    'NON WORK RELATED-NWR',
    'PROPERTY DAMAGE',
  ];

  const dataValues = [0, 2, 1, 0, 19, 1, 1, 0, 0, 13, 4];

  const ytdBarchartData = {
    labels,
    datasets: [
      {
        label: 'YTD Incidents',
        data: dataValues,
        backgroundColor: [
          '#4e79a7', // muted blue
          '#f28e2c', // orange
          '#e15759', // red
          '#76b7b2', // teal
          '#59a14f', // green
          '#edc949', // yellow
          '#af7aa1', // purple
          '#ff9da7', // pink
          '#9c755f', // brown
          '#bab0ab', // gray
          '#7c4dff', // indigo
        ],
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const ytdBarOptions = createBarChartOptions({
    title: 'YTD Incident Statistics Classification',
    yAxisTitle: 'Number of Incidents',
    stepSize: 5,
    maxRotation: 45,
    minRotation: 45,
  });

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Color palette for projects
  const projectColors = [
    '#4e79a7', '#f28e2c', '#bab0ab', '#edc949', 
    '#e15759', '#76b7b2', '#59a14f', '#b07aa1'
  ];

  // Transform MVV by month/project data for chart
  const getMVVDatasets = () => {
    if (mvvLoading || mvvByMonthProject.length === 0) {
      // Return empty datasets when loading
      return [];
    }

    // Get unique projects from data
    const uniqueProjects = Array.from(new Set(mvvByMonthProject.map(item => item.project)));
    
    return uniqueProjects.map((project, index) => {
      // Create data array for each month (12 months)
      const monthData = months.map((_, monthIndex) => {
        const matchingRecord = mvvByMonthProject.find(
          item => item.project === project && parseInt(item.month) === monthIndex + 1
        );
        return matchingRecord ? matchingRecord.total_count : 0;
      });

      return {
        label: project,
        data: monthData,
        backgroundColor: projectColors[index % projectColors.length],
        borderColor: projectColors[index % projectColors.length],
        borderWidth: 1,
      };
    });
  };

  const MVVchartData = {
    labels: months,
    datasets: getMVVDatasets(),
  };

  const mvvOptions = createBarChartOptions({
    title: 'MVV BY MONTH / PROJECTS',
    yAxisTitle: 'MVV Count',
    stepSize: 1,
  });

  // ────────────────────────────────────────────────
  // 4.  SINOPEC LTI/TRI INCIDENT RATE – YTD (new chart)
  // ────────────────────────────────────────────────
  const rateLabels = ['LTI', 'TRI', 'MVA', 'PS Tier-1 Events'];

  const rateData = {
    labels: rateLabels,
    datasets: [
      {
        label: 'Upper Boundary',
        data: [0.024, 0.06, 0.15, 0.076],
        backgroundColor: '#4e79a7',
        borderColor: '#4e79a7',
        borderWidth: 1,
      },
      {
        label: 'SINOPEC ',
        data: [0.010347, 0.031042, 0.007407, 0],
        backgroundColor: '#f28e2c',
        borderColor: '#f28e2c',
        borderWidth: 1,
      },
    ],
  };

  const rateOptions = createBarChartOptions({
    title: ' SINOPEC LTI/TRI INCIDENT RATE – YTD',
    yAxisTitle: 'Incident Rate',
    stepSize: 0.02,
  });

  // Transform MVV by project data for chart
  const getMVVProjectData = () => {
    if (mvvLoading || mvvByProject.length === 0) {
      return {
        labels: [] as string[],
        datasets: [{
          label: 'MVV Violations',
          data: [] as number[],
          backgroundColor: '#e15759',
          borderColor: '#c0392b',
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 40,
        }]
      };
    }

    return {
      labels: mvvByProject.map(item => item.project),
      datasets: [{
        label: 'MVV Violations',
        data: mvvByProject.map(item => item.total_count),
        backgroundColor: '#e15759',
        borderColor: '#c0392b',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 40,
      }]
    };
  };

  const MVVProjectchartData = getMVVProjectData();

  const MVVProjectOptions = createBarChartOptions({
    title: 'MVV Violation By Project',
    yAxisTitle: 'Number of Violations',
    indexAxis: 'y',
    stepSize: 1,
  });

  const OBBAnalysisChartData = {
    labels: ['Positive Observation', 'Unsafe Act', 'Unsafe Condition'],
    datasets: [
      {
        label: 'OBB Distribution',
        data: [13, 23, 64],
        backgroundColor: [
          '#4e79a7',
          '#f28e2c',
          '#bab0ab',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 20,
      },
    ],
  };

  const OBBAnalysisOptions = createDoughnutChartOptions({
    title: 'OBB ANALYSIS',
    cutout: '60%',
  });

  // ────────────────────────────────────────────────
  // Data extracted / interpreted from your image
  // ────────────────────────────────────────────────
  const spLabels = [
    'SP-98', 'SP-70', 'SP-26', 'SP-261', 'SP-123', 'SP-259', 'SP-32',
    'SP-229', 'SP-93', 'SP-276', 'SP-30', 'SP-260', 'SP-258', 'SP-257',
  ];

  const incidentTypes = [
    'LTI', 'PD', 'FAI', 'RDI', 'MTC', 'Drop Object', 'Fire', 'MVA', 'NWR', 'SPILL',
  ];

  const typeColors: Record<string, string> = {
    'LTI':        '#007bff',
    'PD':         '#fd7e14',
    'FAI':        '#6c757d',
    'RDI':        '#ffc107',
    'MTC':        '#17a2b8',
    'Drop Object': '#28a745',
    'Fire':       '#dc3545',
    'MVA':        '#6f42c1',
    'NWR':        '#6610f2',
    'SPILL':      '#e83e8c',
  };

  const datasetData = [
    [0,0,0,0,0,0,0,0,0,0,2,0,0],
    [0,1,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [3,0,0,0,0,0,0,0,0,0,0,0,0],
  ];

  const datasets = incidentTypes.map((label, idx) => ({
    label,
    data: datasetData[idx],
    backgroundColor: typeColors[label] || '#adb5bd',
    borderColor: '#333',
    borderWidth: 0.5,
    barPercentage: 0.92,
    categoryPercentage: 0.85,
  }));

  const YTD2chartData = {
    labels: spLabels,
    datasets,
  };

  const YTD2options = createBarChartOptions({
    title: ' YTD Incident Classification',
    yAxisTitle: 'Number of Incidents',
    indexAxis: 'y',
    stepSize: 1,
  });

  const pieData: ChartData<'doughnut'> = {
    labels: ['MTC', 'FIRST AID', 'RDI', 'FAT', 'LTI', 'PROPERTY DAMAGE', 'MVA'],
    datasets: [
      {
        label: 'YTD Classification',
        data: [70, 15, 4, 7, 0, 4, 0],
        backgroundColor: [
          '#d4a017',
          '#4e79a7',
          '#76b7b2',
          '#e15759',
          '#f28e2c',
          '#bab0ab',
          '#59a14f',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 4,
        hoverOffset: 20,
      },
    ],
  };

  const pieOptions = createDoughnutChartOptions({
    title: 'YTD Incident Statistics Classification',
    legendPosition: 'bottom',
  });

  // Create percentage labels plugin
  const piePlugins = [createPercentageLabelsPlugin()];

  const NearMissdata: ChartData<'doughnut'> = {
    labels: [
      'Slip, Trip & Fall',
      'Poor Situational Awareness',
      'Other',
      'Poor Housekeeping',
      'Incorrect Use Of Tool',
      'Pinch Point',
    ],
    datasets: [
      {
        label: 'Weekly Near Miss Analysis',
        data: [58, 15, 12, 6, 6, 3],
        backgroundColor: [
          '#4e79a7',
          '#f28e2c',
          '#76b7b2',
          '#e15759',
          '#59a14f',
          '#edc949',
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
        borderRadius: 8,
        hoverOffset: 24,
      },
    ],
  };

  const NearMissOptions = createDoughnutChartOptions({
    title: 'Weekly Near Miss Analysis',
    cutout: '65%',
    rotation: -90,
  });

  // Create percentage labels plugin for near miss
  const nearMissPlugins = [createPercentageLabelsPlugin({ largeThreshold: 20 })];

  // OBB Main Categories pie chart data
  const obbData = {
    labels: [
      'Procedures and House Keeping',
      'Tools and Equipment',
      'Personal Protective Equipment',
      'Forklifts/Cranes/Trucks/Vehicles',
      'Position of People',
      'Other',
    ],
    datasets: [
      {
        label: 'OBB Main Categories',
        data: [43, 30, 11, 7, 6, 3],
        backgroundColor: [
          '#808080',
          '#f28e2c',
          '#4e79a7',
          '#e15759',
          '#76b7b2',
          '#59a14f',
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
        borderRadius: 6,
        hoverOffset: 20,
      },
    ],
  };

  const obbOptions = createDoughnutChartOptions({
    title: 'OBB Main Categories',
    cutout: '68%',
    rotation: -90,
  });

  // Create inner percentage plugin for OBB
  const obbPlugins = [createPercentageLabelsPlugin({ largeThreshold: 30 })];

  // YTD Near Miss -  Vertical Bar Chart (Sorted Top 10)
  const ytdNearMissData = {
    labels: ['SP-123', 'SP-70', 'SP-276', 'SP-101', 'SP-125', 'SP-31', 'SP-106', 'SP-154', 'SP-167', 'SP-260', 'SP-29', 'SP-258', 'SP-259', 'SP-261', 'SP-229', 'SP-262', 'SP-27', 'SP-257', 'SP-105', 'SP-30', 'SP-306', 'SP-122', 'SP-32', 'SP-58', 'SP-103', 'SP-93', 'SP-96', 'SP-99'],
    datasets: [{
      label: 'Near Misses',
      data: [5, 46, 0, 111, 16, 0, 37, 17, 0, 230, 127, 175, 118, 207, 202, 1, 49, 23, 81, 43, 6, 43, 22, 6, 176, 417, 2, 40],
      backgroundColor: '#dc2626',
      borderColor: '#b91c1c',
      borderWidth: 1,
      borderRadius: 6,
      hoverBackgroundColor: '#b91c1c',
    }]
  };

  // Sort data high to low and take top 10
  const sortedIndices = Array.from(ytdNearMissData.datasets[0].data.keys()).sort((a, b) => ytdNearMissData.datasets[0].data[b] - ytdNearMissData.datasets[0].data[a]);
  const top10Indices = sortedIndices.slice(0, 10);
  const top10Labels = top10Indices.map(i => ytdNearMissData.labels[i]);
  const top10DataValues = top10Indices.map(i => ytdNearMissData.datasets[0].data[i]);

  const ytdNearMissTop10Data = {
    labels: top10Labels,
    datasets: [{
      ...ytdNearMissData.datasets[0],
      data: top10DataValues,
    }]
  };

  const ytdNearMissOptions = createBarChartOptions({
    title: 'YTD Near Miss –  (Sorted)',
    yAxisTitle: 'Count',
  });

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '24px 16px',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        color: '#1565C0',
        fontSize: '1.5rem',
        fontWeight: 600
      }}>
        RIG SAFETY QHSE DASHBOARD
      </h2>

      {/* ────────────────────────────────────────────────
          Row 1 – Leading & Lagging Indicators
      ──────────────────────────────────────────────── */}
      <ChartRow>
        <ChartContainer>
          <Bar data={leadingData} options={leadingOptions} />
        </ChartContainer>

        <ChartContainer>
          <Bar data={laggingData} options={laggingOptions} />
        </ChartContainer>
      </ChartRow>

      {/* ────────────────────────────────────────────────
          Row 2 – YTD Incident Classification + SINOPEC Rate
      ──────────────────────────────────────────────── */}
      <ChartRow>
        <ChartContainer>
          <Bar data={ytdBarchartData} options={ytdBarOptions} />
        </ChartContainer>

        <ChartContainer>
          <Bar data={rateData} options={rateOptions} />
        </ChartContainer>
      </ChartRow>

      {/* ────────────────────────────────────────────────
          Row 3 – MVV by Month/Projects + MVV by Project
      ──────────────────────────────────────────────── */}
      <ChartRow>
        <ChartContainer>
          <Bar data={MVVchartData} options={mvvOptions} />
        </ChartContainer>

        <ChartContainer>
          <Bar data={MVVProjectchartData} options={MVVProjectOptions} />
        </ChartContainer>
      </ChartRow>

      {/* ────────────────────────────────────────────────
          Row 4 – Weekly Near Miss + OBB Main Categories
      ──────────────────────────────────────────────── */}
      <ChartRow>
        <ChartContainer>
          <Doughnut data={NearMissdata} options={NearMissOptions} plugins={nearMissPlugins} />
        </ChartContainer>

        <ChartContainer>
          <Doughnut data={obbData} options={obbOptions} plugins={obbPlugins} />
        </ChartContainer>
      </ChartRow>

      {/* ────────────────────────────────────────────────
          Row 5 – Observation Comparison + Near Miss Comparison
      ──────────────────────────────────────────────── */}
      <ChartRow>
        <ChartContainer>
          <ObservationComparisonChart />
        </ChartContainer>

        <ChartContainer>
          <NearMissComparisonChart />
        </ChartContainer>
      </ChartRow>

      {/* ────────────────────────────────────────────────
          Row 6 – OBB Analysis + YTD OBB
      ──────────────────────────────────────────────── */}
      <ChartRow>
        <ChartContainer>
          <OBBAnalysisChart />
        </ChartContainer>

        <ChartContainer>
          <YTDOBBChart />
        </ChartContainer>
      </ChartRow>

       {/* ────────────────────────────────────────────────
          Additional Charts – YTD2 Incident Classification + YTD Classification
      ──────────────────────────────────────────────── */}
      <ChartRow>
        <ChartContainer>
          <Bar data={YTD2chartData} options={YTD2options} />
        </ChartContainer>

        <ChartContainer>
          <Doughnut data={pieData} options={pieOptions} plugins={piePlugins} />
        </ChartContainer>
      </ChartRow>

      {/* ────────────────────────────────────────────────
          Row 7 – Year without LTI + YTD Near Miss Top 10
      ──────────────────────────────────────────────── */}
      <ChartRow>
        <ChartContainer>
          <YearWithoutLTIChart />
        </ChartContainer>

        <ChartContainer>
          <Bar data={ytdNearMissTop10Data} options={ytdNearMissOptions} />
        </ChartContainer>
      </ChartRow>

      <ChartRow style={{ marginBottom: 0 }}>
        <ChartContainer>
          <IncidentCorrectiveActionChart />
        </ChartContainer>
      </ChartRow>

    </div>
  );
};

export default WeeklyChartDashboard;