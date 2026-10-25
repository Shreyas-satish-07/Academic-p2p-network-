import { createContext } from 'react';

/**
 * AuthContext instance
 * Exported separately to comply with Vite React Fast Refresh rules.
 */
export const AuthContext = createContext(null);

export default AuthContext;
