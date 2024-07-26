import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DecodedWsprData } from "../../types/DecodedWsprData";

export default function WsprLocationsTable(props: {
  wsprData: DecodedWsprData[];
}) {
  const { wsprData } = props;

  const columnHelper = createColumnHelper<DecodedWsprData>();

  const columns = [
    columnHelper.accessor("timestamp", {
      header: "UTC Time",
      cell: (info) => {
        const timestamp = info.getValue();
        return Intl.DateTimeFormat(undefined, {
          timeZone: "UTC",
          hour12: false,
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }).format(timestamp);
      },
    }),
    columnHelper.accessor("timestamp", {
      id: "localTime",
      header: "Local Time",
      cell: (info) => {
        const timestamp = info.getValue();
        return Intl.DateTimeFormat(undefined, {
          hour12: false,
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }).format(timestamp);
      },
    }),
    { header: "Callsign", accessorKey: "callsign" },
    { header: "dBm", accessorKey: "dBm" },
    { header: "Locator", accessorKey: "locator" },
    { header: "Altitude", accessorKey: "altitude" },
    { header: "Speed", accessorKey: "speed" },
    columnHelper.accessor("temperature", {
      header: "Temperature",
      cell: (info) =>
        info.getValue() ? Math.round(info.getValue()! * 10) / 10 : "",
    }),
    columnHelper.accessor("voltage", {
      header: "Voltage",
      cell: (info) =>
        info.getValue() ? Math.round(info.getValue()! * 100) / 100 : "",
    }),
    { header: "Latitude", accessorKey: "lat" },
    { header: "Longitude", accessorKey: "long" },
  ];

  const table = useReactTable({
    data: wsprData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
