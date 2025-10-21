import { supabase } from '../lib/supabaseClient'

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
    return await supabase
        .from('impacts')
        .select(`
            *,
            impact_sdgs(
                sdgs(*)
            )
        `)
        .eq('project_id', projectId)
}

export async function getImpactsBySection(projectId: string, sectionType: SectionType) {
    return await supabase
        .from('impacts')
        .select(`
            *,
            impact_sdgs(
                sdgs(*)
            )
        `)
        .eq('project_id', projectId)
        .eq('section_type', sectionType)
}

export async function createImpact(impact: Omit<Impact, 'id'>) {
    return await supabase
        .from('impacts')
        .insert([impact])
        .select()
}

export async function updateImpact(id: string, updates: Partial<Omit<Impact, 'id' | 'project_id'>>) {
    return await supabase
        .from('impacts')
        .update(updates)
        .eq('id', id)
        .select()
}

export async function deleteImpact(id: string) {
    return await supabase
        .from('impacts')
        .delete()
        .eq('id', id)
}

export async function linkImpactToSDG(impactId: string, sdgId: string) {
    return await supabase
        .from('impact_sdgs')
        .insert([{ impact_id: impactId, sdg_id: sdgId }])
}

export async function unlinkImpactFromSDG(impactId: string, sdgId: string) {
    return await supabase
        .from('impact_sdgs')
        .delete()
        .eq('impact_id', impactId)
        .eq('sdg_id', sdgId)
}
