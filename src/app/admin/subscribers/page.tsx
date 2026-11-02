import React from "react";
import prisma from "@/lib/prisma";
import SubscribersTable from "./SubscribersTable";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ maxWidth: "1100px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h2
          style={{
            margin: "0 0 6px",
            fontFamily: "Georgia, serif",
            fontSize: "26px",
            color: "#1F2A44",
          }}
        >
          Newsletter Subscribers
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#64748B" }}>
          Review audience sign-ups, manually trigger welcome emails, or manage subscriber list.
        </p>
      </div>

      <SubscribersTable initialSubscribers={subscribers} />
    </div>
  );
}
