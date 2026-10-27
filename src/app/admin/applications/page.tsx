import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <h1 style={{ marginBottom: '20px', fontFamily: 'Fraunces, serif', color: '#841014' }}>Manage Applications</h1>
      {applications.length === 0 ? (
        <p style={{ color: '#2B2B2B', opacity: 0.8 }}>No applications received yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', border: '1px solid rgba(43,43,43,0.14)' }}>
          <thead>
            <tr style={{ backgroundColor: '#1F2A44', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Type</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{app.name}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{app.type}</td>
                <td style={{ padding: '12px' }}>{app.email}</td>
                <td style={{ padding: '12px' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem',
                    backgroundColor: app.status === 'PENDING' ? '#F0C823' : '#e6e6e6',
                    color: '#2B2B2B'
                  }}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
