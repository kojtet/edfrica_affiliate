// app/Providers.js
'use client'; // This marks the component as a Client Component

import { AuthProvider } from '../contexts/AuthContext';

export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
