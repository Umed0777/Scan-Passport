import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/entities/auth/model/authSlice';
import departmentReducer from '@/entities/department/model/departmentSlice';
import employeeReducer from '@/entities/employee/model/employeeSlice';
import passportReducer from '@/entities/passport/model/passportSlice';
import userReducer from '@/entities/user/model/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    department: departmentReducer,
    employee: employeeReducer,
    passport: passportReducer,
    user: userReducer,
  },
});
