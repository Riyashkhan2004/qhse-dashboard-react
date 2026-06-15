import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const mvvApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface MVVRecord {
  id?: number;
  project: string;
  violation_type: string;
  mvv_count: number;
  reporting_month: string; // ISO format YYYY-MM-DD
  created_at?: string;
}

export interface MVVByMonthProject {
  month: string;
  project: string;
  total_count: number;
}

export interface MVVByProject {
  project: string;
  total_count: number;
}

// Helper function to extract month from reporting_month
const extractMonth = (reportingMonth: string): number => {
  const date = new Date(reportingMonth);
  return date.getMonth(); // 0-11
};

// Helper function to extract year from reporting_month
const extractYear = (reportingMonth: string): number => {
  const date = new Date(reportingMonth);
  return date.getFullYear();
};

export const mvvAPI = {
  /**
   * Get all MVV records
   */
  getAll: async (): Promise<MVVRecord[]> => {
    const response = await mvvApi.get<MVVRecord[]>('/mvv');
    return response.data;
  },

  /**
   * Get total MVV count for each project (from backend)
   * This is more efficient than client-side aggregation
   */
  getProjectTotals: async (year?: number): Promise<MVVByProject[]> => {
    const params = year ? `?year=${year}` : '';
    const response = await mvvApi.get<MVVByProject[]>(`/mvv/totals${params}`);
    return response.data;
  },

  /**
   * Get MVV records by year
   */
  getByYear: async (year: number): Promise<MVVRecord[]> => {
    const allRecords = await mvvApi.get<MVVRecord[]>('/mvv');
    return allRecords.data.filter(record => extractYear(record.reporting_month) === year);
  },

  /**
   * Get MVV data by month and project for a specific year
   * Returns data formatted for the MVV BY MONTH / PROJECTS chart
   * Now uses backend aggregation instead of client-side
   */
  getByMonthAndProject: async (year?: number): Promise<MVVByMonthProject[]> => {
    const params = year ? `?year=${year}` : '';
    const response = await mvvApi.get<MVVByMonthProject[]>(`/mvv/by-month-project${params}`);
    return response.data;
  },

  /**
   * Get MVV data by project for a specific year
   * Returns data formatted for the MVV Violation By Project chart
   * Now uses backend aggregation instead of client-side
   */
  getByProject: async (year?: number): Promise<MVVByProject[]> => {
    const params = year ? `?year=${year}` : '';
    const response = await mvvApi.get<MVVByProject[]>(`/mvv/by-project${params}`);
    return response.data;
  },

  /**
   * Get MVV record by ID
   */
  getById: async (id: number): Promise<MVVRecord> => {
    const response = await mvvApi.get<MVVRecord>(`/mvv/${id}`);
    return response.data;
  },

  /**
   * Create a new MVV record
   */
  create: async (data: {
    project: string;
    violation_type: string;
    mvv_count: number;
    reporting_month: string;
  }): Promise<MVVRecord> => {
    const response = await mvvApi.post<MVVRecord>('/mvv', data);
    return response.data;
  },

  /**
   * Update an existing MVV record
   */
  update: async (
    id: number,
    data: {
      project: string;
      violation_type: string;
      mvv_count: number;
      reporting_month: string;
    }
  ): Promise<MVVRecord> => {
    const response = await mvvApi.put<MVVRecord>(`/mvv/${id}`, data);
    return response.data;
  },

  /**
   * Delete an MVV record
   */
  delete: async (id: number): Promise<void> => {
    await mvvApi.delete(`/mvv/${id}`);
  },
};

export default mvvAPI;
