"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  addUser,
  deleteUser,
  editUser,
} from "@/entities/user/model/userSlice";
import { Button } from "@/shared/ui/kit/button";
import { Input } from "@/shared/ui/kit/input";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const UserList = () => {
  const dispatch = useDispatch();
  const { users, isLoading, totalPages } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);
  const [openEdit, setOpenEdit] = useState(null);
  const [openDelete, setOpenDelete] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addConfirm, setAddConfirm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  useEffect(() => {
    dispatch(getUsers({ PageNumber: currentPage, PageSize: 10 }));
  }, [dispatch, currentPage]);
  const handleUpdateUser = (user) => {
    if (!editName || !editEmail) {
      toast.error("Имя и почта обязательны");
      return;
    }

    dispatch(
      editUser({
        id: user.id,
        userName: editName,
        email: editEmail,
        password: editPassword,
      }),
    );
    toast.success("Пользователь обновлён");
    setOpenEdit(null);
  };

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id));
    toast.success("Пользователь успешно удален!");
    setOpenDelete(null);
  };
  const handleAddUser = async () => {
    if (!addName || !addEmail || !addPassword || !addConfirm) {
      toast.error("Заполните все поля");
      return;
    }

    if (addPassword !== addConfirm) {
      toast.error("Пароли не совпадают");
      return;
    }

    setCurrentPage(1);
    setIsAdding(true);

    try {
      await dispatch(
        addUser({
          userName: addName,
          email: addEmail,
          password: addPassword,
          confirmPassword: addConfirm,
        }),
      ).unwrap();

      await dispatch(getUsers({ PageNumber: 1, PageSize: 10 }));
      toast.success("Пользователь успешно добавлен!");

      setAddName("");
      setAddEmail("");
      setAddPassword("");
      setAddConfirm("");
      setOpenAdd(false);
    } catch (err) {
      toast.error(err.message || "Ошибка при добавлении пользователя");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <section className="bg-[#fafbff] rounded-[10px] shadow-black/10 shadow-md mb-8 w-full overflow-hidden animate-pulse">
        <div className="bg-white rounded-t-[10px] p-6 border-b border-gray-300">
          <div className="h-6 w-1/3 bg-gray-300 rounded" />
        </div>
        <div className="p-6 overflow-auto">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-3 mb-3 animate-pulse"
            >
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white/95 shadow-lg rounded-[16px] p-6 space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Список пользователей
        </h2>
        <Button onClick={() => setOpenAdd(true)}>Добавить пользователя</Button>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-500 p-6">Пользователи не найдены.</p>
      ) : (
        <div className=" overflow-auto">
          <table className="w-full table-fixed border-collapse rounded-xl overflow-hidden">
            <thead className="bg-[#dd2b1c]/90 text-white">
              <tr>
                <th className="p-3 text-left font-semibold w-[30%]">Почта</th>
                <th className="p-3 text-right font-semibold w-[20%]">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#dd2b1c]/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="p-3 text-sm text-gray-700">{user.email}</td>
                    <td className="p-3 text-sm text-center">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenEdit(user.id);
                            setEditName(user.userName);
                            setEditEmail(user.email);
                            setEditPassword("");
                          }}
                        >
                          Редактировать
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDelete(user.id);
                          }}
                        >
                          Удалить
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Назад
              </Button>
              <span className="text-sm text-gray-700">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Вперёд
              </Button>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {openAdd && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="sm:max-w-lg w-full mx-4 rounded-xl shadow-xl p-6 bg-white/95"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <h2 className="text-lg font-bold mb-4">Добавить пользователя</h2>
              <div className="space-y-3">
                <Input
                  placeholder="Имя пользователя"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Подтвердите пароль"
                  value={addConfirm}
                  onChange={(e) => setAddConfirm(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setOpenAdd(false)}>
                  Отмена
                </Button>
                <Button onClick={handleAddUser} disabled={isAdding}>
                  {isAdding ? "Добавление..." : "Сохранить"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openEdit && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="sm:max-w-lg w-full mx-4 rounded-xl shadow-xl p-6 bg-white/95"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <h2 className="text-lg font-bold mb-4">
                Редактировать пользователя
              </h2>
              <div className="space-y-3">
                <Input
                  placeholder="Имя пользователя"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Новый пароль (необязательно)"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setOpenEdit(null)}>
                  Отмена
                </Button>
                <Button
                  onClick={() =>
                    handleUpdateUser(users.find((u) => u.id === openEdit))
                  }
                >
                  Сохранить изменения
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openDelete && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="sm:max-w-md w-full mx-4 rounded-xl shadow-xl p-6 bg-white/95"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <h2 className="text-lg font-bold mb-4">Удалить пользователя?</h2>
              <p className="mb-4">
                Вы уверены, что хотите удалить этого пользователя? Действие
                необратимо.
              </p>
              <div className="flex justify-end gap-2">
                <Button onClick={() => setOpenDelete(null)}>Отмена</Button>
                <Button
                  variant="outline"
                  onClick={() => handleDeleteUser(openDelete)}
                >
                  Удалить
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="sm:max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto rounded-xl shadow-xl p-6 bg-white/95"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <h2 className="text-lg font-bold mb-4">
                Информация о пользователе
              </h2>
              <div className="space-y-2 text-gray-800 text-sm">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-500">ID:</span>
                  <span className="font-medium">{selectedUser.id}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-500">Имя:</span>
                  <span className="font-medium">{selectedUser.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">{selectedUser.email}</span>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setSelectedUser(null)}>Закрыть</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default UserList;
