import { useContext } from 'react';
import { AuthContext } from './authContextInstance';

/**
 * useAuth hook
 * Custom React hook to access authentication context methods and state.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
