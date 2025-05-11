
import { supabase } from "@/integrations/supabase/client";
import { Project, ProjectFormData } from "@/types/project";
import { toast } from "@/components/ui/use-toast";

export async function fetchProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    toast({
      title: "Error fetching projects",
      description: "Please try again later",
      variant: "destructive",
    });
    return [];
  }
}

export async function addProject(project: ProjectFormData): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error adding project:", error);
    toast({
      title: "Error adding project",
      description: "Please try again later",
      variant: "destructive",
    });
    return null;
  }
}

export async function updateProject(
  id: string,
  project: ProjectFormData
): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .update(project)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating project:", error);
    toast({
      title: "Error updating project",
      description: "Please try again later",
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    toast({
      title: "Error deleting project",
      description: "Please try again later",
      variant: "destructive",
    });
    return false;
  }
}
