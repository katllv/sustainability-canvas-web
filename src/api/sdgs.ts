// --- SDGs API functions ---
const API_URL = import.meta.env.VITE_API_URL;
// Endpoints:
// - GetSdgs:         [GET] /api/sdgs
// - GetImpactsForSDG:[GET] /api/sdgs/{sdgId}/impacts
//
// TanStack Query hooks:
// - useAllSDGs, useImpactsForSDG

export async function getAllSDGs() {
    const res = await fetch(`${API_URL}/api/sdgs`);
    if (!res.ok) throw new Error('Failed to fetch SDGs');
    return res.json();
}

export async function getImpactsForSDG(sdgId: string) {
    const res = await fetch(`${API_URL}/api/sdgs/${sdgId}/impacts`);
    if (!res.ok) throw new Error('Failed to fetch impacts for SDG');
    return res.json();
}

// --- TanStack Query hooks ---
import { useQuery } from '@tanstack/react-query';

export function useAllSDGs() {
    return useQuery({
        queryKey: ['sdgs'],
        queryFn: getAllSDGs,
    });
}

export function useImpactsForSDG(sdgId: string) {
    return useQuery({
        queryKey: ['impactsForSDG', sdgId],
        queryFn: () => getImpactsForSDG(sdgId),
        enabled: !!sdgId,
    });
}