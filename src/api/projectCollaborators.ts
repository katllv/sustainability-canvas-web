import { supabase } from '../lib/supabaseClient'

export async function getCollaborators(projectId: string) {
    return await supabase
        .from('project_collaborators')
        .select('*, profiles(name)')
        .eq('project_id', projectId)
}

export async function addCollaborator(projectId: string, userId: string, role: 'owner' | 'editor' | 'viewer') {
    return await supabase
        .from('project_collaborators')
        .insert([{ project_id: projectId, user_id: userId, role }])
}

export async function updateCollaboratorRole(projectId: string, userId: string, role: 'owner' | 'editor' | 'viewer') {
    return await supabase
        .from('project_collaborators')
        .update({ role })
        .eq('project_id', projectId)
        .eq('user_id', userId)
}

export async function removeCollaborator(projectId: string, userId: string) {
    return await supabase
        .from('project_collaborators')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId)
}
