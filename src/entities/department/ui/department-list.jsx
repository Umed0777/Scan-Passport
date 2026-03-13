'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartments, addDepartment, editDepartment, deleteDepartment } from '@/entities/department/model/departmentSlice';
import { Button } from '@/shared/ui/kit/button';
import { Input } from '@/shared/ui/kit/input';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const DepartmentList = () => {
  const dispatch = useDispatch();
  const { departments, isLoading, totalPages, error } = useSelector((state) => state.department);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(null);
  const [openDelete, setOpenDelete] = useState(null);

  const [addName, setAddName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [editName, setEditName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const params = searchTerm ? { Name: searchTerm } : { pageNumber: currentPage, pageSize: 10 };
    dispatch(getDepartments(params));
  }, [dispatch, currentPage, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  };

  const handleAddDepartment = async () => {
    if (!addName.trim()) {
      toast.error('Введите название филиала');
      return;
    }
    setIsAdding(true);
    await dispatch(addDepartment({ name: addName }));
    toast.success('Филиал добавлен');
    setAddName('');
    setOpenAdd(false);
    setIsAdding(false);
    dispatch(getDepartments());
  };

  const handleEditDepartment = async (dept) => {
    if (!editName.trim()) {
      toast.error('Введите название филиала');
      return;
    }
    setIsEditing(true);
    await dispatch(editDepartment({ id: dept.id, name: editName }));
    toast.success('Филиал обновлён');
    setOpenEdit(null);
    setIsEditing(false);
    dispatch(getDepartments());
  };

  const handleDeleteDepartment = async (id) => {
    await dispatch(deleteDepartment(id));
    toast.success('Филиал удалён');
    setOpenDelete(null);
    dispatch(getDepartments());
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
        <h2 className="text-xl font-semibold text-gray-900">Список филиалов</h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => setOpenAdd(true)}>Добавить филиал</Button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full table-fixed border-collapse rounded-xl overflow-hidden">
          <thead className="bg-[#dd2b1c]/90 text-white">
            <tr>
              <th className="p-3 text-left font-semibold w-[60%]">Название</th>
              <th className="p-3 text-right font-semibold w-[40%]">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {departments.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-4 text-center text-gray-500">
                  Филиалы не найдены
                </td>
              </tr>
            ) : (
              departments
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((dept) => (
                  <tr key={dept.id} className="hover:bg-[#dd2b1c]/10 cursor-pointer transition-colors">
                    <td className="p-3 text-sm text-gray-700">{dept.name}</td>
                    <td className="p-3 text-sm text-center">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setOpenEdit(dept.id);
                            setEditName(dept.name);
                          }}
                        >
                          Редактировать
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setOpenDelete(dept.id)}>
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

      <AnimatePresence>
        {openAdd && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="sm:max-w-md w-full mx-4 rounded-xl shadow-xl p-6 bg-white/95" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}>
              <h2 className="text-lg font-bold mb-4">Добавить филиал</h2>
              <div className="space-y-3">
                <Input placeholder="Название" value={addName} onChange={(e) => setAddName(e.target.value)} />
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => setOpenAdd(false)} variant="outline">
                    Отмена
                  </Button>
                  <Button onClick={handleAddDepartment} disabled={isAdding}>
                    {isAdding ? 'Добавляем...' : 'Добавить'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {openEdit && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="sm:max-w-md w-full mx-4 rounded-xl shadow-xl p-6 bg-white/95" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}>
              <h2 className="text-lg font-bold mb-4">Редактировать филиал</h2>
              <div className="space-y-3">
                <Input placeholder="Название" value={editName} onChange={(e) => setEditName(e.target.value)} />
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => setOpenEdit(null)} variant="outline">
                    Отмена
                  </Button>
                  <Button onClick={() => handleEditDepartment(departments.find((d) => d.id === openEdit))} disabled={isEditing}>
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
              <h2 className="text-lg font-bold mb-4">Удалить филиал?</h2>
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => setOpenDelete(null)}>Отмена</Button>
                <Button variant="outline" onClick={() => handleDeleteDepartment(openDelete)}>
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

export default DepartmentList;
