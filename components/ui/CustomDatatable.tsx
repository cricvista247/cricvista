// components/CustomDataTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CustomDataTableProps<T> = {
  title?: string;
  data: T[];
  columns: TableColumn<T>[];
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
};

export default function CustomDataTable<T extends Record<string, any>>({
  title = "Data Table",
  data,
  columns,
  onAdd,

  searchable = true,
  searchPlaceholder = "Search...",
}: CustomDataTableProps<T>) {
  const [filterText, setFilterText] = useState("");

  const filteredData = useMemo(() => {
    if (!filterText) return data;
    return data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(filterText.toLowerCase())
    );
  }, [data, filterText]);
  const customStyles = {
    headCells: {
      style: {
        fontWeight: "600",
        fontSize: "14px",
        backgroundColor: "#f9fafb",
      },
    },
    rows: {
      style: {
        minHeight: "56px",
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #e5e7eb",
        paddingTop: "10px",
      },
    },
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          {searchable && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          )}

          {onAdd && (
            <Button
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              onClick={onAdd}
            >
              <Plus className="h-4 w-4 mr-2" />
              {`Add`}
            </Button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        customStyles={customStyles}
        responsive
      />
    </div>
  );
}
