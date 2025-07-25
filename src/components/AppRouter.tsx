import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginPage } from '../pages/LoginPage';
import { Dashboard } from '../pages/Dashboard';
import { WorkReports } from '../pages/WorkReports';
import { CreateReport } from '../pages/CreateReport';
import { EditReport } from '../pages/EditReport';
import { UserManagement } from '../pages/UserManagement';
import { Settings } from '../pages/Settings';
import { Layout } from './Layout/Layout';

export function AppRouter() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [selectedReportId, setSelectedReportId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'reports':
        return <WorkReports onEdit={(id) => {
          setSelectedReportId(id);
          setCurrentPage('edit-report');
        }} />;
      case 'create-report':
        return <CreateReport onSuccess={() => setCurrentPage('reports')} />;
      case 'edit-report':
        return <EditReport 
          reportId={selectedReportId!} 
          onSuccess={() => setCurrentPage('reports')} 
        />;
      case 'users':
        return user.role === 'admin' ? <UserManagement /> : <Dashboard onNavigate={setCurrentPage} />;
      case 'settings':
        return (user.role === 'admin' || user.role === 'penanggung_jawab') ? 
          <Settings /> : <Dashboard onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}