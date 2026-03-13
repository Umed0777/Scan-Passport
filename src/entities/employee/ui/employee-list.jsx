'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployees, addEmployee, editEmployee, deleteEmployee } from '@/entities/employee/model/employeeSlice';
import { getUsers } from '@/entities/user/model/userSlice';
import { getDepartments } from '@/entities/department/model/departmentSlice';
import { Button } from '@/shared/ui/kit/button';
import { Input } from '@/shared/ui/kit/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/kit/select';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { employees, isLoading, totalPages, error } = useSelector((state) => state.employee);
  const users = useSelector((state) => state.user.users);
  const departments = useSelector((state) => state.department.departments);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(null);
  const [openDelete, setOpenDelete] = useState(null);

  const [addFullName, setAddFullName] = useState('');
  const [addUserId, setAddUserId] = useState('');
  const [addDepartmentId, setAddDepartmentId] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [editFullName, setEditFullName] = useState('');
  const [editUserId, setEditUserId] = useState('');
  const [editDepartmentId, setEditDepartmentId] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getDepartments());
  }, [dispatch]);

  useEffect(() => {
    const params = searchTerm ? { FullName: searchTerm } : { pageNumber: currentPage, pageSize: 10 };
    dispatch(getEmployees(params));
  }, [dispatch, currentPage, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  };

  const getDepartmentName = (id) => {
    const dep = departments.find((d) => d.id === Number(id));
    return dep ? dep.name : 'Другой отдел';
  };

  const handleAddEmployee = async () => {
    if (!addFullName || !addUserId || !addDepartmentId) {
      toast.error('Заполните все поля');
      return;
    }
    setIsAdding(true);
    await dispatch(addEmployee({ fullName: addFullName, userId: addUserId, departmentId: addDepartmentId }));
    toast.success('Сотрудник добавлен');
    setAddFullName('');
    setAddUserId('');
    setAddDepartmentId('');
    setOpenAdd(false);
    setIsAdding(false);
  };

  const handleEditEmployee = async (employee) => {
    if (!editFullName || !editUserId || !editDepartmentId) {
      toast.error('Заполните все поля');
      return;
    }
    setIsEditing(true);
    await dispatch(
      editEmployee({
        id: employee.id,
        fullName: editFullName,
        userId: editUserId,
        departmentId: editDepartmentId,
      })
    );
    toast.success('Сотрудник обновлён');
    setOpenEdit(null);
    setIsEditing(false);
  };

  const handleDeleteEmployee = async (id) => {
    await dispatch(deleteEmployee(id));
    toast.success('Сотрудник удалён');
    setOpenDelete(null);
  };

  if (isLoading) {
    return (
      <section className="bg-[#fafbff] rounded-[10px] shadow-black/10 shadow-md mb-8 w-full overflow-hidden animate-pulse">
        <div className="bg-white rounded-t-[10px] p-6 border-b border-gray-300">
          <div className="h-6 w-1/3 bg-gray-300 rounded" />
        </div>
        <div className="p-6 overflow-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-3 mb-3 animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section className="bg-white/95 shadow-lg rounded-[16px] p-6 space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Список сотрудников</h2>

        <div className="flex items-center gap-2">
          <Input type="text" placeholder="Поиск по ФИО" className="max-w-xs" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          <Button size="icon" onClick={handleSearch}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </Button>
          <Button onClick={() => setOpenAdd(true)}>Добавить сотрудника</Button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full table-fixed border-collapse rounded-xl overflow-hidden">
          <thead className="bg-[#dd2b1c]/90 text-white">
            <tr>
              <th className="p-3 text-left font-semibold w-[25%]">ФИО</th>
              <th className="p-3 text-left font-semibold w-[35%]">Отдел</th>
              <th className="p-3 text-right font-semibold w-[20%]">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Сотрудники не найдены
                </td>
              </tr>
            ) : (
              employees
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#dd2b1c]/10 cursor-pointer transition-colors">
                    <td className="p-3 text-sm text-gray-700">{emp.fullName}</td>
                    <td className="p-3 text-sm text-gray-700">{getDepartmentName(emp.departmentId)}</td>
                    <td className="p-3 text-sm text-center">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setOpenEdit(emp.id);
                            setEditFullName(emp.fullName);
                            setEditUserId(emp.userId);
                            setEditDepartmentId(String(emp.departmentId));
                          }}
                        >
                          Редактировать
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setOpenDelete(emp.id)}>
                          Удалить
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-2">
          <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            Назад
          </Button>
          <span className="text-sm text-gray-700">
            {currentPage} / {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
            Вперёд
          </Button>
        </div>
      )}

      <AnimatePresence>
        {openAdd && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="sm:max-w-lg w-full mx-4 rounded-xl shadow-xl p-6 bg-white/95" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}>
              <h2 className="text-lg font-bold mb-4">Добавить сотрудника</h2>
              <div className="space-y-3">
                <Input placeholder="ФИО" value={addFullName} onChange={(e) => setAddFullName(e.target.value)} />
                <Select value={addUserId} onValueChange={setAddUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Пользователь" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.userName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={addDepartmentId} onValueChange={setAddDepartmentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Отдел" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => setOpenAdd(false)} variant="outline">
                    Отмена
                  </Button>
                  <Button onClick={handleAddEmployee} disabled={isAdding}>
                    {isAdding ? 'Добавляем...' : 'Добавить'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {openEdit && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="sm:max-w-lg w-full mx-4 rounded-xl shadow-xl p-6 bg-white/95" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}>
              <h2 className="text-lg font-bold mb-4">Редактировать сотрудника</h2>
              <div className="space-y-3">
                <Input placeholder="ФИО" value={editFullName} onChange={(e) => setEditFullName(e.target.value)} />
                <Select value={editUserId} onValueChange={setEditUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Пользователь" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.userName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={editDepartmentId} onValueChange={setEditDepartmentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Отдел" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => setOpenEdit(null)} variant="outline">
                    Отмена
                  </Button>
                  <Button onClick={() => handleEditEmployee(employees.find((e) => e.id === openEdit))} disabled={isEditing}>
                    {isEditing ? 'Сохраняем...' : 'Сохранить'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {openDelete && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="sm:max-w-sm w-full mx-4 rounded-xl shadow-xl p-6 bg-white/95" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}>
              <h2 className="text-lg font-bold mb-4">Удалить сотрудника?</h2>
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => setOpenDelete(null)}>Отмена</Button>
                <Button variant="outline" onClick={() => handleDeleteEmployee(openDelete)}>
                  Удалить
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EmployeeList;
