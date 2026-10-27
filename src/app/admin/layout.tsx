import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4EFE8' }}>
      <aside style={{ width: '250px', backgroundColor: '#1F2A44', color: '#F4EFE8', padding: '20px' }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', color: '#F0C823', marginBottom: '30px' }}>BAABFEST Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link href="/admin" style={{ color: '#fff' }}>Dashboard</Link>
          <Link href="/admin/applications" style={{ color: '#fff' }}>Applications</Link>
          <Link href="/admin/subscribers" style={{ color: '#fff' }}>Newsletter Subscribers</Link>
          <Link href="/admin/archives" style={{ color: '#fff' }}>Festival Archives</Link>
          <Link href="/" style={{ color: '#F0C823', marginTop: '20px' }}>← Back to Site</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', color: '#2B2B2B' }}>
        {children}
      </main>
    </div>
  );
}
