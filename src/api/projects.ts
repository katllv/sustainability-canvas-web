import { supabase } from '../lib/supabaseClient'

export async function getProjects(userId: string) {
    return await supabase.from('projects').select('*').eq('user_id', userId)
}

export async function createProject(userId: string, title: string, description?: string) {
    return await supabase.from('projects').insert([{ user_id: userId, title, description }])
}

export async function deleteProject(id: string) {
    return await supabase.from('projects').delete().eq('id', id)
}
