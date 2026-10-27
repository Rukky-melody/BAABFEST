import React from "react";
import SendWelcomeButton from "./SendWelcomeButton";
import prisma from "@/lib/prisma";

export default async function SubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <h1 style={{ marginBottom: '20px', fontFamily: 'Fraunces, serif', color: '#841014' }}>Newsletter Subscribers</h1>
      
      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid rgba(43,43,43,0.14)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F4EFE8', textAlign: 'left', borderBottom: '1px solid rgba(43,43,43,0.14)' }}>
              <th style={{ padding: '16px' }}>Email</th>
              <th style={{ padding: '16px' }}>Date Subscribed</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#666' }}>
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              subscribers.map(sub => (
                <tr key={sub.id} style={{ borderBottom: '1px solid rgba(43,43,43,0.08)' }}>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{sub.email}</td>
                  <td style={{ padding: '16px', color: '#666' }}>{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      backgroundColor: sub.status === 'WELCOMED' ? '#e6f4ea' : '#fef7e0',
                      color: sub.status === 'WELCOMED' ? '#1e8e3e' : '#f29900'
                    }}>
                      {sub.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <SendWelcomeButton subscriberId={sub.id} currentStatus={sub.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
