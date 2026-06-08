import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simple Survey',
  description: 'Survey Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
