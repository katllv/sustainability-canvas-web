// --- Analysis API functions ---
const API_URL = import.meta.env.VITE_API_URL || '';
// Endpoints:
// - GetProjectAnalysis: [GET] /api/projects/{projectId}/analysis

const getToken = () => localStorage.getItem('jwt') || '';

export interface AnalysisData {
  summary: {
    totalEntries: number;
    sdgsCovered: number;
    activeDimensions: number;
  };
  impactDistribution: Array<{
    name: 'Direct' | 'Indirect' | 'Hidden';
    value: number;
  }>;
  dimensionDistribution: Array<{
    name: 'Environmental' | 'Social' | 'Economic';
    value: number;
  }>;
  sdgCounts: Array<{
    sdg: number;
    count: number;
  }>;
}

export async function getProjectAnalysis(projectId: string): Promise<AnalysisData> {
  const res = await fetch(`${API_URL}/api/projects/${projectId}/analysis`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch project analysis');
  return res.json();
}

// --- TanStack Query hooks ---
import { useQuery } from '@tanstack/react-query';

export function useProjectAnalysis(projectId: string) {
  return useQuery({
    queryKey: ['projectAnalysis', projectId],
    queryFn: () => getProjectAnalysis(projectId),
    enabled: !!projectId,
  });
}
