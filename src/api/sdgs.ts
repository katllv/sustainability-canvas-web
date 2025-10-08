import { supabase } from '../lib/supabaseClient'

export async function getAllSDGs() {
    return await supabase.from('sdgs').select('*').order('number', { ascending: true })
}

export async function getImpactsForSDG(sdgId: string) {
    return await supabase
        .from('impact_sdgs')
        .select('*, impacts(*)')
        .eq('sdg_id', sdgId)
}
