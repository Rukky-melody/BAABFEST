import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
  const applicationCount = await prisma.application.count();
  const teamMemberCount = await prisma.teamMember.count();

  return (
    <div>
      <h1 style={{ marginBottom: '20px', fontFamily: 'Fraunces, serif', color: '#841014' }}>Dashboard Overview</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid rgba(43,43,43,0.14)', minWidth: '200px' }}>
          <h3 style={{ marginBottom: '10px' }}>Applications</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#841014' }}>{applicationCount}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid rgba(43,43,43,0.14)', minWidth: '200px' }}>
          <h3 style={{ marginBottom: '10px' }}>Team Members</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#841014' }}>{teamMemberCount}</p>
        </div>
      </div>
    </div>
  );
}
