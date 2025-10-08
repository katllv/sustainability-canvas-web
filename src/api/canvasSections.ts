import { supabase } from '../lib/supabaseClient'

export async function getSections(projectId: string) {
    return await supabase.from('canvas_sections').select('*').eq('project_id', projectId)
}

export async function upsertSection(projectId: string, type: string) {
    return await supabase
        .from('canvas_sections')
        .upsert([{ project_id: projectId, type }], { onConflict: 'project_id,type' })
}

export async function deleteSection(id: string) {
    return await supabase.from('canvas_sections').delete().eq('id', id)
}
