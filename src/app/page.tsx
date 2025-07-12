"use client";
import { DataTable } from "@/components/sections/data-table";
import { ColumnDef } from "@tanstack/react-table";

type User = {
  id: string;
  name: string;
  email: string;
};

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "الاسم" },
  { accessorKey: "email", header: "البريد الإلكتروني" },
];

const users: User[] = [
  { id: "1", name: "محمد", email: "mo@example.com" },
  { id: "2", name: "أحمد", email: "ahmed@example.com" },
];

export default function Page() {
  return (
    <DataTable
      columns={columns}
      data={users}
      actionsRender={(row) => (
        <button onClick={() => alert(`Edit user ${row.name}`)}>تعديل</button>
      )}
    />
  );
}
