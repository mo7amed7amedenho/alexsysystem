"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  actionsRender?: (row: TData) => React.ReactNode; // أزرار إضافية لكل صف
}

export function DataTable<TData>({
  columns,
  data,
  actionsRender,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  // إضافة عمود الرقم التسلسلي تلقائياً
  const serialColumn: ColumnDef<TData, any> = {
    header: "#",
    cell: ({ row }) => row.index + 1,
    id: "serial",
  };
  const actionsColumn: ColumnDef<TData, any>[] = actionsRender
    ? [
        {
          header: "الإجراءات",
          cell: ({ row }) => actionsRender(row.original),
          id: "actions",
        },
      ]
    : [];

  const allColumns: ColumnDef<TData, any>[] = [
    serialColumn,
    ...columns,
    ...actionsColumn,
  ];

  const table = useReactTable({
    data,
    columns: allColumns,

    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 15 },
    },
  });

  return (
    <div className="space-y-4 rtl text-right">
      <Input
        placeholder="ابحث هنا..."
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-right">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-right">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          الصفحة {table.getState().pagination.pageIndex + 1} من{" "}
          {table.getPageCount()}
        </div>

        <div className="space-x-2 rtl:space-x-reverse">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            السابق
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            التالي
          </Button>
        </div>
      </div>
    </div>
  );
}
