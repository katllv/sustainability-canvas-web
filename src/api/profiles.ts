import { supabase } from '../lib/supabaseClient'

export async function getProfile(userId: string) {
    return await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
}

export async function updateProfile(userId: string, updates: {
    name?: string
    picture_url?: string
}) {
    return await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
}

export async function getProjectCollaborators(projectId: string) {
    return await supabase
        .from('project_collaborators')
        .select(`
            *,
            profiles(name, picture_url)
        `)
        .eq('project_id', projectId)
}

export async function addCollaborator(projectId: string, userId: string, role: 'owner' | 'editor' | 'viewer') {
    return await supabase
        .from('project_collaborators')
        .insert([{
            project_id: projectId,
            user_id: userId,
            role
        }])
}

export async function updateCollaboratorRole(collaboratorId: string, role: 'owner' | 'editor' | 'viewer') {
    return await supabase
        .from('project_collaborators')
        .update({ role })
        .eq('id', collaboratorId)
}

export async function removeCollaborator(collaboratorId: string) {
    return await supabase
        .from('project_collaborators')
        .delete()
        .eq('id', collaboratorId)
}