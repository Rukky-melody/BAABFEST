import React from "react";
import AdminShell from "./AdminShell";

export const metadata = {
  title: "BAABFEST CMS - Content Management",
  description: "Content Management System for Benin Arts and Books Festival",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
