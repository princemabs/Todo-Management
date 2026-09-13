import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EditorAuthProvider } from './context/EditorAuthContext';
import { DashboardPage } from './pages/DashboardPage';
import { PublicTodayPage } from './pages/PublicTodayPage';

export default function App() {
  return (
    <EditorAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/today" element={<PublicTodayPage />} />
        </Routes>
      </BrowserRouter>
    </EditorAuthProvider>
  );
}
