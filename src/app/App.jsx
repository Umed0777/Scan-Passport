import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Loading } from '../shared/ui/custom/loading';
import './styles/App.css';
import { Dashboard, Layout, Settings } from './providers/lazy/lazy';
import AuthCheck from './providers/AuthCheck';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthCheck>
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<Loading />}>
                  <Layout />
                </Suspense>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="/admin" element={<Settings />} />
            </Route>
          </Routes>
        </AuthCheck>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);