'use client';

import React, { useState, useRef, useEffect } from 'react';
import { checkAdmin } from '@shared/lib/utils';
import DepartmentList from '@/entities/department/ui/department-list';
import EmployeeList from '@/entities/employee/ui/employee-list';
import UserList from '@/entities/user/ui/user-list';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'users', label: 'Пользователи' },
  { id: 'employees', label: 'Сотрудники' },
  { id: 'departments', label: 'Филиалы' },
];

const Settings = () => {
  const isAdmin = checkAdmin();
  const [activeTab, setActiveTab] = useState('users');
  const [sliderStyle, setSliderStyle] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const buttons = container.querySelectorAll('button');
      const activeIndex = tabs.findIndex((t) => t.id === activeTab);
      const button = buttons[activeIndex];
      setSliderStyle({
        width: button.offsetWidth,
        left: button.offsetLeft, 
      });
    }
  }, [activeTab, containerRef.current]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen py-6 space-y-6">
      <div ref={containerRef} className="relative w-full max-w-lg mx-auto bg-gray-200 rounded-full p-1 flex">
        <motion.div layout transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="absolute top-1 h-10 bg-[#dd2b1c] rounded-full z-0" style={sliderStyle} />
        {tabs.map((tab) => (
          <button key={tab.id} className={`relative z-10 flex-1 text-sm sm:text-base font-medium py-2 transition-colors ${activeTab === tab.id ? 'text-white' : 'text-gray-700'}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'users' && <UserList />}
        {activeTab === 'employees' && <EmployeeList />}
        {activeTab === 'departments' && <DepartmentList />}
      </div>
    </div>
  );
};

export default Settings;
