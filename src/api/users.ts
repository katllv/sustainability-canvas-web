import { supabase } from '../lib/supabaseClient'

export async function getProfile(id: string) {
    return await supabase.from('profiles').select('*').eq('id', id).single()
}

export async function updateProfile(id: string, updates: Record<string, any>) {
    return await supabase.from('profiles').update(updates).eq('id', id)
}
