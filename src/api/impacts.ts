
const API_URL = import.meta.env.VITE_API_URL || '';
// --- Impacts API functions ---
// Endpoints:
// - CreateImpact:   [POST]   /api/impacts
// - GetImpactById:  [GET]    /api/impacts/{id}
// - GetImpacts:     [GET]    /api/impacts
// - GetImpactsByProjectId: [GET] /api/projects/{projectId}/impacts
// - UpdateImpact:   [PUT]    /api/impacts/{id}
// - DeleteImpact:   [DELETE] /api/impacts/{id}
//
// TanStack Query hooks:
// - useProjectImpacts, useCreateImpact, useUpdateImpact, useDeleteImpact

const getToken = () => localStorage.getItem('jwt') || '';

export type SectionType = 'UVP' | 'CS' | 'CR' | 'CH' | 'GO' | 'KS' | 'KA' | 'WM' | 'KTR' | 'CO' | 'RE'
export type RelationType = 'Direct' | 'Indirect' | 'Hidden'
export type Dimension = 'Environmental' | 'Social' | 'Economic'
export type ImpactScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface Impact {
  id: number
  title: string
  projectId: number
  type: SectionType
  relation: RelationType
  dimension: Dimension
  score: ImpactScore
  description?: string
  createdAt?: string
  updatedAt?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  impactSdgs?: Array<any>
}

export async function getProjectImpacts(projectId: string) {
    const res = await fetch(`${API_URL}/api/projects/${projectId}/impacts`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!res.ok) throw new Error('Failed to fetch project impacts');
    return res.json();
}

export async function getImpactsBySection(projectId: string, sectionType: SectionType) {
    const res = await fetch(`${API_URL}/api/projects/${projectId}/impacts?sectionType=${sectionType}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!res.ok) throw new Error('Failed to fetch impacts by section');
    return res.json();
}

export async function createImpact(impact: Omit<Impact, 'id' | 'createdAt' | 'updatedAt' | 'impactSdgs'>) {
    const res = await fetch(`${API_URL}/api/impacts`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(impact),
    });
    if (!res.ok) throw new Error('Failed to create impact');
    return res.json();
}

export async function updateImpact(id: number, updates: Partial<Omit<Impact, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'impactSdgs'>>) {
    const res = await fetch(`${API_URL}/api/impacts/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update impact');
    return res.json();
}

export async function deleteImpact(id: number) {
    const res = await fetch(`${API_URL}/api/impacts/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!res.ok) throw new Error('Failed to delete impact');
    return res.json();
}

export async function linkImpactToSDG(_impactId: string, _sdgId: string): Promise<void> {
    // Implement this if/when you have an endpoint for linking impacts to SDGs
    throw new Error('Not implemented: linkImpactToSDG');
}

export async function unlinkImpactFromSDG(_impactId: string, _sdgId: string): Promise<void> {
    // Implement this if/when you have an endpoint for unlinking impacts from SDGs
    throw new Error('Not implemented: unlinkImpactFromSDG');
}

// --- TanStack Query hooks ---
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useProjectImpacts(projectId: string) {
    return useQuery({
        queryKey: ['projectImpacts', projectId],
        queryFn: () => getProjectImpacts(projectId),
        enabled: !!projectId,
    });
}

export function useCreateImpact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createImpact,
        onSuccess: (_data, variables) => {
            // Invalidate impacts for the relevant project (convert number back to string to match query key)
            queryClient.invalidateQueries({ queryKey: ['projectImpacts', String(variables.projectId)] });
        },
    });
}

export function useUpdateImpact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: number; updates: Partial<Omit<Impact, 'Id' | 'ProjectId' | 'CreatedAt' | 'UpdatedAt'>> }) => updateImpact(id, updates),
        onSuccess: () => {
            // Invalidate impacts for the relevant project
            queryClient.invalidateQueries({ queryKey: ['projectImpacts'] });
        },
    });
}

export function useDeleteImpact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteImpact,
        onSuccess: (_data, _id) => {
            // Invalidate all project impacts queries
            queryClient.invalidateQueries({ queryKey: ['projectImpacts'] });
        },
    });
}
