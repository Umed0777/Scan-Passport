import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAdmin, getUserId } from "@shared/lib/utils";
import { getDepartments } from "@/entities/department/model/departmentSlice";
import { getEmployees } from "@/entities/employee/model/employeeSlice";
import {
  addPassport,
  deletePassport,
  editPassport,
  getPassports,
  viewPassport,
} from "@/entities/passport/model/passportSlice";
import { Input } from "@shared/ui/kit/input";
import { Button } from "@shared/ui/kit/button";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Dashboard = () => {
  const dispatch = useDispatch();

  const [selectedClient, setSelectedClient] = useState(null);
  const [openAddPassport, setOpenAddPassport] = useState(false);
  const [openDelete, setOpenDelete] = useState(null);
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");

  const [openEditPassport, setOpenEditPassport] = useState(null);
  const [editFile, setEditFile] = useState(null);

  const departments = useSelector((state) => state.department.departments);
  const employees = useSelector((state) => state.employee.employees);
  const passports = useSelector((state) => state.passport.passports);

  const isViewing = useSelector((state) => state.passport.isViewing);

  const isLoadingDepartments = useSelector(
    (state) => state.department.isLoading,
  );
  const isLoadingPassports = useSelector((state) => state.passport.isLoading);

  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setisUpdating] = useState();

  const userId = getUserId();
  const isAdmin = checkAdmin();

  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getDepartments());
    dispatch(getPassports());
  }, [dispatch]);

  const currentEmployee = employees.find((emp) => emp.userId === userId);
  const currentDepartment = departments.find(
    (dep) => dep.id === currentEmployee?.departmentId,
  );
  // const filteredPassports = passports.filter((passport) => passport.departmentId === currentEmployee?.departmentId);
  const filteredPassports = currentEmployee
    ? passports.filter(
        (passport) =>
          Number(passport.departmentId) ===
          Number(currentEmployee.departmentId),
      )
    : passports;
  const handleAddPassport = async () => {
    if (!file) {
      toast.error("Паспорт не выбран");
      return;
    }

    const formData = new FormData();
    formData.append(`DepartmentId`, currentEmployee.departmentId);
    formData.append(`File`, file);

    setIsAdding(true);

    try {
      await dispatch(addPassport(formData));
      dispatch(getPassports());
      toast.success("Паспорт успешно добавлен");
      setOpenAddPassport(false);
      setFile(null);
    } catch (error) {
      toast.error("Ошибка при добавлении паспорта");
      setIsAdding(false);
    }
  };

  const handleEditPassport = async () => {
    if (!openEditPassport || !editFile) return;

    const formData = new FormData();
    formData.append("File", editFile);
    formData.append("DepartmentId", openEditPassport.departmentId);

    setisUpdating(true);

    try {
      await dispatch(
        editPassport({ id: selectedClient?.id, formData }),
      ).unwrap();
      toast.success("Паспорт успешно обновлён");
      setOpenEditPassport(null);
      setEditFile(null);
    } catch (err) {
      toast.error("Ошибка при обновлении паспорта");
      setisUpdating(false);
    }
  };

  const handleDeletePassport = async (id) => {
    try {
      await dispatch(deletePassport(id)).unwrap();
      toast.success("Паспорт удалён");
      setOpenDelete(null);
    } catch (err) {
      toast.error("Ошибка при удалении паспорта");
    }
  };

  const handleView = (filePath) => {
    if (!filePath) return;

    const url = filePath.startsWith("http")
      ? filePath
      : `http://10.65.10.22:5110${filePath}`;

    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen max-w-[1440px] w-[95%] mx-auto py-6">
      <div className="bg-white/95 shadow-lg rounded-[16px] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {isLoadingDepartments ? (
            <div className="h-[36px] w-48 bg-gray-200 animate-pulse rounded-lg"></div>
          ) : (
            <h2 className="text-[28px] font-semibold text-gray-800">
              {currentDepartment?.name || "Филиал не определён"}
            </h2>
          )}
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 sm:flex-none w-full sm:w-64 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd2b1c]"
            />
            <Button
              className="border border-[#dd2b1c] font-semibold hover:bg-[#dd2b1c] hover:text-white transition-all shadow-md"
              onClick={() => dispatch(getPassports(search.trim()))}
            >
              Найти
            </Button>
          </div>
          <Button
            className="border border-[#dd2b1c] font-semibold hover:bg-[#dd2b1c] hover:text-white transition-all shadow-md"
            onClick={() => setOpenAddPassport(true)}
          >
            <span className="text-sm tracking-wide">Добавить паспорт</span>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse rounded-xl overflow-hidden shadow-md bg-white">
            <thead className="bg-[#dd2b1c]/90 text-white">
              <tr>
                <th className="w-[25%] p-3 text-left font-semibold">Фамилия</th>
                <th className="w-[25%] p-3 text-left font-semibold">Имя</th>
                <th className="w-[25%] p-3 text-left font-semibold">
                  Отчество
                </th>
                <th className="w-[25%] p-3 text-center font-semibold">
                  Дата рождения
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoadingPassports ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="bg-gray-50">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <td key={i} className="p-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredPassports.length > 0 ? (
                filteredPassports.map((passport, index) => (
                  <tr
                    key={passport.filePath || index}
                    className="hover:bg-[#dd2b1c]/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedClient(passport)}
                  >
                    <td className="p-3 text-sm">
                      {passport.data?.surname || "Неизвестно"}
                    </td>
                    <td className="p-3 text-sm">
                      {passport.data?.name || "Неизвестно"}
                    </td>
                    <td className="p-3 text-sm">
                      {passport.data?.patronymic || "Неизвестно"}
                    </td>
                    <td className="p-3 text-center text-sm">
                      {passport.data?.birthDate || "Неизвестно"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    Паспортов нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {openAddPassport && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="sm:max-w-lg w-full mx-4 rounded-xl shadow-xl p-6 bg-white/95 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <h2 className="text-lg font-bold mb-4">Добавить паспорт</h2>
              <div className="space-y-4">
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  accept="application/pdf"
                  className="w-full bg-gray-100 p-2 rounded-lg"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setOpenAddPassport(false)}
                >
                  Отмена
                </Button>
                <Button onClick={handleAddPassport} disabled={isAdding}>
                  {isAdding ? "Загрузка..." : "Загрузить"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedClient && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="sm:max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-sm shadow-xl rounded-xl p-6 relative"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">
                  Информация: {selectedClient.data?.surname}{" "}
                  {selectedClient.data?.name}
                </h2>
                {isAdmin && (
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <ul className="divide-y divide-gray-200 text-gray-700">
                <li className="py-2">
                  <b>Фамилия:</b> {selectedClient.data?.surname || "Неизвестно"}
                </li>
                <li className="py-2">
                  <b>Имя:</b> {selectedClient.data?.name || "Неизвестно"}
                </li>
                <li className="py-2">
                  <b>Отчество:</b>{" "}
                  {selectedClient.data?.patronymic || "Неизвестно"}
                </li>
                <li className="py-2">
                  <b>Пол:</b> {selectedClient.data?.sex || "Неизвестно"}
                </li>
                <li className="py-2">
                  <b>Национальность:</b>{" "}
                  {selectedClient.data?.nationality || "Неизвестно"}
                </li>
                <li className="py-2">
                  <b>Место рождения:</b>{" "}
                  {selectedClient.data?.placeOfBirth || "Неизвестно"}
                </li>
                <li className="py-2">
                  <b>Дата рождения:</b>{" "}
                  {selectedClient.data?.birthDate || "Неизвестно"}
                </li>
                <li className="py-2">
                  <b>Адрес:</b> {selectedClient.data?.address || "Неизвестно"}
                </li>
                <li className="py-2">
                  <b>Дата выдачи:</b>{" "}
                  {selectedClient.data?.dateOfIssue || "Неизвестно"}
                </li>
                <li className="py-2">
                  <b>Дата окончания:</b>{" "}
                  {selectedClient.data?.dateOfExpiry || "Неизвестно"}
                </li>
                <li className="py-2">
                  <b>National ID:</b>{" "}
                  {selectedClient.data?.nationalId || "Неизвестно"}
                </li>
                <li className="py-2">
                  <b>Рақами шиноснома:</b>{" "}
                  {selectedClient.data?.documentNo || "Неизвестно"}
                </li>
                <li className="py-2">
                  <b>ИНН:</b> {selectedClient.data?.inn || "Неизвестно"}
                </li>
                <li className="py-2">
                  <b>Орган выдачи:</b>{" "}
                  {selectedClient.data?.issuingAuthority || "Неизвестно"}
                </li>
                <li className="py-2">
                  <b>Дата загрузки:</b>{" "}
                  {selectedClient.createdAt
                    ? new Date(selectedClient.createdAt).toLocaleDateString()
                    : "Неизвестно"}
                </li>
              </ul>

              <div className="mt-4 flex justify-end space-x-2">
                {isAdmin && (
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setOpenDelete(selectedClient)}
                    >
                      Удалить
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setOpenEditPassport(selectedClient);
                        setEditFile(null);
                      }}
                    >
                      Редактировать
                    </Button>
                  </div>
                )}
                {!isAdmin && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedClient(null)}
                  >
                    Закрыть
                  </Button>
                )}
                <Button onClick={() => handleView(selectedClient.filePath)}>
                  {isViewing ? "Загрузка..." : "Просмотреть документ"}
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
              className="sm:max-w-md w-full mx-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <h2 className="text-lg font-bold mb-4">Удалить паспорт?</h2>
              <p className="text-gray-600 mb-6">
                Вы действительно хотите удалить паспорт{" "}
                <b>
                  {openDelete.data?.surname} {openDelete.data?.name}
                </b>
                ?
              </p>
              <div className="flex justify-end gap-3">
                <Button onClick={() => setOpenDelete(null)}>Отмена</Button>
                <Button
                  variant="outline"
                  onClick={() => handleDeletePassport(openDelete.id)}
                >
                  Удалить
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openEditPassport && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="sm:max-w-lg w-full mx-4 rounded-xl shadow-xl p-6 bg-white/95 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <h2 className="text-lg font-bold mb-4">Редактировать паспорт</h2>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setEditFile(e.target.files[0])}
                className="w-full bg-gray-100 p-2 rounded-lg"
              />
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setOpenEditPassport(null)}
                >
                  Отмена
                </Button>
                <Button onClick={handleEditPassport} disabled={isUpdating}>
                  {isUpdating ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
