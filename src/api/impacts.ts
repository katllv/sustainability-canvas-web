import { supabase } from '../lib/supabaseClient'

export async function getImpacts(sectionId: string) {
    return await supabase.from('impacts').select('*').eq('section_id', sectionId)
}

export async function addImpact(sectionId: string, data: {
    relation_type: string
    dimension: string
    impact_level: string
    description: string
}) {
    return await supabase.from('impacts').insert([{ section_id: sectionId, ...data }])
}

export async function deleteImpact(id: string) {
    return await supabase.from('impacts').delete().eq('id', id)
}
