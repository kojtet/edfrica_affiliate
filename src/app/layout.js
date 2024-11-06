// app/layout.js

import './globals.css';
import Providers from './providers'; // Import the Providers component

export const metadata = {
  title: 'Affiliates - Edfrica',
  description: 'Manage your Edfrica account',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers> {/* Wrap children with Providers */}
      </body>
    </html>
  );
}
