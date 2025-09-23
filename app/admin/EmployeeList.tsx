"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import Toastr from '../components/Toastr';

type EmployeeListProps = {
  initialData: any[];
  total: number;
  initialSort: string;
  initialSortDirection: string;
  initialPageIndex: number;
  initialPageSize: number;
};

const EmployeeList = ({ initialData,
  total,
  initialSort,
  initialSortDirection,
  initialPageIndex,
  initialPageSize }: EmployeeListProps) => {
  const [data, setData] = useState(initialData);
  const [totalRecords, setTotalRecords] = useState(total);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<any>([{ id: initialSort, desc: initialSortDirection === 'desc' }]);
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState({ isVisible: false, message: '', type: 'success' });

  const router = useRouter();
  ;

  // Fetch data on pagination or sorting change
  useEffect(() => {
    if (hasInteracted) {
      const params = new URLSearchParams({
        page: String(pageIndex + 1),
        pageSize: String(pageSize),
        sort: sorting[0]?.id || '',
        order: sorting[0]?.desc ? 'desc' : 'asc',
      });
      setLoading(true);
      fetch(`/api/employees?${params}`)
        .then(res => res.json())
        .then(res => {
          setData(res.employees);
          setTotalRecords(res.total);
        })
        .finally(() => setLoading(false));
    }
  }, [pageIndex, pageSize, sorting, hasInteracted]);

  const handleDelete = async (id: number) => {
    setIsOpen(true);
    setDeleteId(id);
  };

  const onCancelDelete = async () => {
    setIsOpen(false);
    setDeleteId(null);
  };
  const onDelete = async (id: number | null) => {
    if (id === null) return;
    const res = await fetch('/api/employees', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      // Handle error
      setIsOpen(false);
      setDeleteId(null);
      setShowToast({ isVisible: true, message: 'Error deleting employee!', type: 'error' });
      setTimeout(() => setShowToast({ isVisible: false, message: '', type: 'success' }), 3000);
      return;
    }
    setData(data.filter((emp: any) => emp.id !== id));
    setIsOpen(false);
    setDeleteId(null);
    setShowToast({ isVisible: true, message: 'Employee deleted successfully!', type: 'success' });
    setTimeout(() => setShowToast({ isVisible: false, message: '', type: 'success' }), 3000);

  };
  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'email', header: 'Email', enableSorting: true },
    { accessorKey: 'address', header: 'Address', enableSorting: true },
    { accessorKey: 'mobile', header: 'Phone', enableSorting: true },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <button
            className="text-yellow-600 hover:underline"
            title="Edit"
            onClick={() => router.push(`/admin/employee/${row.original.id}`)}
          >
            ✏️
          </button>
          <button
            className="text-red-600 hover:underline"
            title="Delete"
            onClick={() => handleDelete(row.original.id)}
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    manualPagination: true, // Crucial for server-side pagination
    pageCount: Math.ceil(totalRecords / pageSize), // Calculate total pages
    onSortingChange: updater => {
      setHasInteracted(true);
      setSorting(updater);
    },
    onPaginationChange: updater => {
      if (typeof updater === 'function') {
        setHasInteracted(true);
        const { pageIndex: pi, pageSize: ps } = updater({ pageIndex, pageSize });
        setPageIndex(pi);
        setPageSize(ps);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400"></span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow mb-4">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer select-none border-b border-gray-200"
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === 'asc' ? ' ▲' : ' ▼'
                        ) : null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3 border-b border-gray-100 text-gray-800">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1  rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {'First'}
              </button>
              <button
                className="px-3 py-1  rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {'Previous'}
              </button>

              {/* Page Numbers */}
              {Array.from({ length: table.getPageCount() }, (_, i) => (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={`px-3 py-1  rounded-lg transition ${table.getState().pagination.pageIndex === i
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="px-3 py-1  rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {'Next'}
              </button>
              <button
                className="px-3 py-1  rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {'Last'}
              </button>
            </div>

            <span className="text-gray-700">
              Page{' '}
              <strong>{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</strong>
            </span>
            <select className="border rounded-lg px-2 py-1 bg-gray-50" value={table.getState().pagination.pageSize} onChange={e => table.setPageSize(Number(e.target.value))}>
              {[10, 20, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>Show {pageSize}</option>
              ))}
            </select>
          </div>
        </>
      )}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm opacity-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Employee</h2>
            <p className="text-gray-700 mb-1">Are you sure you want to delete these records?</p>
            <p className="text-orange-500 text-sm mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => onCancelDelete()}
                className="px-4 py-2 text-gray-700 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={() => onDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast.isVisible && (
        <Toastr message={showToast.message} type={showToast.type} />
      )}

    </>
  );
};

export default EmployeeList;
