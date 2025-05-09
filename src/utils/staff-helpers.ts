import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

export type StaffMember = {
  id: string;
  name: string;
  position: string;
  departmentId?: string;
  departmentName?: string;
  bio?: string;
  email?: string;
  phone?: string;
  image_url?: string;
};

export type Department = {
  id: string;
  name: string;
};

export async function fetchStaffMembers(): Promise<StaffMember[]> {
  const { data: staffData, error } = await supabase
    .from('staff_members')
    .select('*, departments(name)')
    .order('name');

  if (error) {
    console.error('Error fetching staff:', error);
    return [];
  }

  return staffData.map(staff => ({
    id: staff.id,
    name: staff.name,
    position: staff.position,
    departmentId: staff.department_id,
    departmentName: staff.departments?.name,
    bio: staff.bio,
    email: staff.email,
    phone: staff.phone,
    image_url: staff.image_url
  }));
}

export async function fetchDepartments(): Promise<Department[]> {
  const { data: departmentsData, error } = await supabase
    .from('departments')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching departments:', error);
    return [];
  }

  return departmentsData.map(dept => ({
    id: dept.id,
    name: dept.name
  }));
}

export async function fetchStaffByDepartment(departmentId: string): Promise<StaffMember[]> {
  const { data: staffData, error } = await supabase
    .from('staff_members')
    .select('*')
    .eq('department_id', departmentId)
    .order('name');

  if (error) {
    console.error('Error fetching staff by department:', error);
    return [];
  }

  return staffData.map(staff => ({
    id: staff.id,
    name: staff.name,
    position: staff.position,
    departmentId: staff.department_id,
    bio: staff.bio,
    email: staff.email,
    phone: staff.phone,
    image_url: staff.image_url
  }));
}

export async function fetchExecutives(): Promise<StaffMember[]> {
  // Fetch staff members from the "Руководство" department
  const { data: departmentData, error: deptError } = await supabase
    .from('departments')
    .select('id')
    .eq('name', 'Руководство')
    .single();

  if (deptError) {
    console.error('Error fetching executives department:', deptError);
    return [];
  }

  if (departmentData) {
    return fetchStaffByDepartment(departmentData.id);
  }

  return [];
}

export async function fetchDepartmentHeads(): Promise<StaffMember[]> {
  // Fetch staff members from the "Отделы" department
  const { data: departmentData, error: deptError } = await supabase
    .from('departments')
    .select('id')
    .eq('name', 'Отделы')
    .single();

  if (deptError) {
    console.error('Error fetching department heads:', deptError);
    return [];
  }

  if (departmentData) {
    return fetchStaffByDepartment(departmentData.id);
  }

  return [];
}

export async function addStaffMember(staffMember: Omit<StaffMember, 'id' | 'departmentName'>): Promise<StaffMember | null> {
  const { data, error } = await supabase
    .from('staff_members')
    .insert({
      name: staffMember.name,
      position: staffMember.position,
      department_id: staffMember.departmentId,
      bio: staffMember.bio || null,
      email: staffMember.email || null,
      phone: staffMember.phone || null,
      image_url: staffMember.image_url || null
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding staff member:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    position: data.position,
    departmentId: data.department_id,
    bio: data.bio || undefined,
    email: data.email || undefined,
    phone: data.phone || undefined,
    image_url: data.image_url || undefined
  };
}

export async function updateStaffMember(id: string, staffMember: Partial<Omit<StaffMember, 'id' | 'departmentName'>>): Promise<boolean> {
  const updates: any = {};
  
  if (staffMember.name !== undefined) updates.name = staffMember.name;
  if (staffMember.position !== undefined) updates.position = staffMember.position;
  if (staffMember.departmentId !== undefined) updates.department_id = staffMember.departmentId;
  if (staffMember.bio !== undefined) updates.bio = staffMember.bio;
  if (staffMember.email !== undefined) updates.email = staffMember.email;
  if (staffMember.phone !== undefined) updates.phone = staffMember.phone;
  if (staffMember.image_url !== undefined) updates.image_url = staffMember.image_url;

  const { error } = await supabase
    .from('staff_members')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating staff member:', error);
    return false;
  }

  return true;
}

export async function deleteStaffMember(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('staff_members')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting staff member:', error);
    return false;
  }

  return true;
}

export async function addDepartment(name: string): Promise<Department | null> {
  const { data, error } = await supabase
    .from('departments')
    .insert({ name })
    .select()
    .single();

  if (error) {
    console.error('Error adding department:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name
  };
}

export async function updateDepartment(id: string, name: string): Promise<boolean> {
  const { error } = await supabase
    .from('departments')
    .update({ name })
    .eq('id', id);

  if (error) {
    console.error('Error updating department:', error);
    return false;
  }

  return true;
}

export async function deleteDepartment(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting department:', error);
    return false;
  }

  return true;
}
