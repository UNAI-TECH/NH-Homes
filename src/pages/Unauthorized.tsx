import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { HiOutlineShieldExclamation } from 'react-icons/hi2';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-light-grey flex flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
        <HiOutlineShieldExclamation className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-brand-text mb-2 tracking-tight">Access Denied</h1>
      <p className="text-sm text-brand-dark-grey max-w-md mb-8 leading-relaxed">
        Your user account role does not have the necessary permissions to access this page. Please contact your system administrator if you believe this is an error.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" size="md" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="primary" size="md" onClick={() => navigate('/login')}>
          Login Portal
        </Button>
      </div>
    </div>
  );
};
export default Unauthorized;
