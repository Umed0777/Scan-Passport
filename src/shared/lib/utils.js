import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const roleMap = {
  'c69b6aa9-e195-4d75-bbee-f26491de5702': 'Admin',
  '6bc00194-d090-4852-bcc9-5df3cb03c8da': 'User',
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function parseJWT(token) {
  try {
    const base64 = token.split('.')[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function getUserId() {
  const token = localStorage.getItem('access_token');
  return parseJWT(token)?.nameid || null;
}

export function getUserData(employees) {
  const userId = getUserId();
  if (!userId) return null;

  const employee = employees.find((emp) => emp.userId === userId);
  if (!employee) return null;

  const roleName = roleMap[employee.roleId] || 'User';

  return {
    fullName: employee.fullName,
    departmentId: employee.departmentId,
    roleId: employee.roleId,
    isAdmin: roleName === 'Admin',
  };
}

export function checkAdmin() {
  const userId = getUserId();
  const adminIds = ['c69b6aa9-e195-4d75-bbee-f26491de5702'];
  return adminIds.includes(String(userId));
}

export const apiUrl = import.meta.env.VITE_API_URL;
