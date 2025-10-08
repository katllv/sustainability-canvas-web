import { supabase } from '../lib/supabaseClient'

export async function linkImpactToSDG(impactId: string, sdgId: string) {
    return await supabase.from('impact_sdgs').insert([{ impact_id: impactId, sdg_id: sdgId }])
}

export async function unlinkImpactFromSDG(impactId: string, sdgId: string) {
    return await supabase
        .from('impact_sdgs')
        .delete()
        .eq('impact_id', impactId)
        .eq('sdg_id', sdgId)
}
