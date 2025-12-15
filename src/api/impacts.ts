
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
export type ImpactScore = 1 | 2 | 3 | 4 | 5

export type SDGId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17

export interface ImpactSDG {
  sdgId?: number
  id?: number
}

export interface Impact {
  id: number
  title: string
  projectId: number
  type: SectionType // UVP, CS, CR, CH, GO, KS, KA, WM, KTR, CO, RE
  relation: RelationType // direct, indirect, hidden
  dimension: Dimension // e, s, or ec
  score: ImpactScore // 1-10
  description?: string
  createdAt?: string
  updatedAt?: string
  impactSdgs?: ImpactSDG[]
  sdgIds?: SDGId[] // For sending to backend
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
    // 204 No Content - no response body
    if (res.status === 204) return { success: true };
    return res.json();
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
        onSuccess: (newImpact, variables) => {
            // Update the specific project impacts cache
            queryClient.setQueryData<Impact[]>(
                ['projectImpacts', String(variables.projectId)],
                (old) => {
                    if (!old) return [newImpact];
                    return [...old, newImpact];
                }
            );
            // Invalidate analysis data to refetch
            queryClient.invalidateQueries({ queryKey: ['projectAnalysis', String(variables.projectId)] });
        },
    });
}

export function useUpdateImpact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: number; updates: Partial<Omit<Impact, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'impactSdgs'>> }) => updateImpact(id, updates),
        onSuccess: (updatedImpact, { id }) => {
            // Update the cache directly instead of invalidating
            queryClient.setQueriesData<Impact[]>(
                { queryKey: ['projectImpacts'] },
                (old) => {
                    if (!old) return old;
                    return old.map((impact) => 
                        impact.id === id ? { ...impact, ...updatedImpact } : impact
                    );
                }
            );
            // Invalidate analysis data for the project
            const projectId = updatedImpact.projectId || (queryClient.getQueriesData<Impact[]>({ queryKey: ['projectImpacts'] })?.[0]?.[1]?.find((i) => i.id === id)?.projectId);
            if (projectId) {
                queryClient.invalidateQueries({ queryKey: ['projectAnalysis', String(projectId)] });
            }
        },
    });
}

export function useDeleteImpact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteImpact,
        onMutate: async (impactId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['projectImpacts'] });
            
            // Snapshot the previous values
            const previousImpacts = queryClient.getQueriesData({ queryKey: ['projectImpacts'] });
            
            // Optimistically update all projectImpacts queries
            queryClient.setQueriesData<Impact[]>(
                { queryKey: ['projectImpacts'] },
                (old) => old?.filter((impact) => impact.id !== impactId) ?? []
            );
            
            return { previousImpacts };
        },
        onError: (_err, _impactId, context) => {
            // Rollback on error
            if (context?.previousImpacts) {
                context.previousImpacts.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: (_data, _error, impactId) => {
            // Always refetch to ensure data is in sync
            queryClient.invalidateQueries({ queryKey: ['projectImpacts'] });
            // Also invalidate analysis data
            const allImpacts = queryClient.getQueriesData<Impact[]>({ queryKey: ['projectImpacts'] });
            const projectId = allImpacts?.[0]?.[1]?.find((i) => i.id === impactId)?.projectId;
            if (projectId) {
                queryClient.invalidateQueries({ queryKey: ['projectAnalysis', String(projectId)] });
            }
        },
    });
}
