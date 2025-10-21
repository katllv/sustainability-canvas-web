import { supabase } from '../lib/supabaseClient'

export async function getProjects(userId: string) {
    // First get the project IDs where user is a collaborator
    const { data: userProjects } = await supabase
        .from('project_collaborators')
        .select('project_id')
        .eq('user_id', userId);
    
    if (!userProjects || userProjects.length === 0) {
        return { data: [], error: null };
    }
    
    const projectIds = userProjects.map(p => p.project_id);
    
    // Then get all project details with ALL collaborators for each project
    return await supabase
        .from('projects')
        .select(`
            *,
            project_collaborators(role, user_id),
            impacts(count)
        `)
        .in('id', projectIds)
        .order('created_at', { ascending: true }); // Oldest first for redirect
}

export async function getProject(projectId: string) {
    return await supabase
        .from('projects')
        .select(`
            *,
            project_collaborators(
                user_id,
                role,
                profiles(name, picture_url)
            )
        `)
        .eq('id', projectId)
        .single()
}

export async function createProject(userId: string, title: string, description?: string) {
    // Start a transaction to create project and add owner as collaborator
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([{ 
            user_id: userId, 
            title, 
            description,
            updated_at: new Date().toISOString()
        }])
        .select()
        .single();

    if (projectError || !project) {
        return { data: null, error: projectError };
    }

    // Add the owner as a collaborator with 'owner' role
    const { error: collaboratorError } = await supabase
        .from('project_collaborators')
        .insert([{
            project_id: project.id,
            user_id: userId,
            role: 'owner'
        }]);

    if (collaboratorError) {
        // If collaborator creation fails, we could optionally delete the project
        // For now, just return the error
        return { data: project, error: collaboratorError };
    }

    return { data: project, error: null };
}

export async function updateProject(id: string, title: string, description?: string) {
    return await supabase
        .from('projects')
        .update({ 
            title, 
            description, 
            updated_at: new Date().toISOString() 
        })
        .eq('id', id)
}

export async function deleteProject(id: string) {
    return await supabase.from('projects').delete().eq('id', id)
}
