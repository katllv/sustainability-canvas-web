
const API_URL = import.meta.env.VITE_API_URL;
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


export type SectionType = 'UVP' | 'CS' | 'CR' | 'CH' | 'GO' | 'KS' | 'KA' | 'WM' | 'KTR' | 'CO' | 'RE'
export type RelationType = 'Direct' | 'Indirect' | 'Hidden'
export type Dimension = 'Environmental' | 'Social' | 'Economic'
export type ImpactLevel = '+' | '0' | '-'

export interface Impact {
  id: string
  project_id: string
  section_type: SectionType
  relation_type: RelationType
  dimension: Dimension
  impact_level: ImpactLevel
  description: string
}

export async function getProjectImpacts(projectId: string) {
    const res = await fetch(`${API_URL}/projects/${projectId}/impacts`);
    if (!res.ok) throw new Error('Failed to fetch project impacts');
    return res.json();
}

export async function getImpactsBySection(projectId: string, sectionType: SectionType) {
    const res = await fetch(`${API_URL}/projects/${projectId}/impacts?sectionType=${sectionType}`);
    if (!res.ok) throw new Error('Failed to fetch impacts by section');
    return res.json();
}

export async function createImpact(impact: Omit<Impact, 'id'>) {
    const res = await fetch(`${API_URL}/impacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(impact),
    });
    if (!res.ok) throw new Error('Failed to create impact');
    return res.json();
}

export async function updateImpact(id: string, updates: Partial<Omit<Impact, 'id' | 'project_id'>>) {
    const res = await fetch(`${API_URL}/impacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update impact');
    return res.json();
}

export async function deleteImpact(id: string) {
    const res = await fetch(`${API_URL}/impacts/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete impact');
    return res.json();
}

export async function linkImpactToSDG(impactId: string, sdgId: string) {
// Implement this if/when you have an endpoint for linking impacts to SDGs
    throw new Error('Not implemented: linkImpactToSDG');
}

export async function unlinkImpactFromSDG(impactId: string, sdgId: string) {
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
            // Invalidate impacts for the relevant project
            queryClient.invalidateQueries({ queryKey: ['projectImpacts', variables.project_id] });
        },
    });
}

export function useUpdateImpact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Impact, 'id' | 'project_id'>> }) => updateImpact(id, updates),
        onSuccess: (_data, variables) => {
            // Invalidate impacts for the relevant project
            queryClient.invalidateQueries({ queryKey: ['projectImpacts'] });
        },
    });
}

export function useDeleteImpact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteImpact,
        onSuccess: (_data, id) => {
            // Invalidate all project impacts queries
            queryClient.invalidateQueries({ queryKey: ['projectImpacts'] });
        },
    });
}
