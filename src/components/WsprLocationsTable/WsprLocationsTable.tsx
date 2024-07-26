import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import WsprLocation from "../../classes/WsprLocation";

import classes from "./WsprLocationsTable.module.css";

function roundValue(value: number, base: number) {
  return Math.round(value * base) / base;
}

export default function WsprLocationsTable(props: {
  wsprData: WsprLocation[];
}) {
  const { wsprData } = props;

  const columnHelper = createColumnHelper<WsprLocation>();

  const columns = [
    columnHelper.accessor("timestamp", {
      header: "UTC Time",
      cell: (info) => {
        const timestamp = info.getValue();
        return Intl.DateTimeFormat(undefined, {
          timeZone: "UTC",
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
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
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "numeric",
        }).format(timestamp);
      },
    }),
    { header: "Callsign", accessorKey: "callsign" },
    { header: "dBm", accessorKey: "dBm" },
    { header: "Locator", accessorKey: "locator" },
    { header: "Altitude (m)", accessorKey: "altitude" },
    columnHelper.accessor((row) => row.altitudeInFeet(), {
      header: "Altitude (ft)",
      cell: (info) => (info.getValue() ? Math.round(info.getValue()!) : ""),
    }),
    { header: "Speed (kts)", accessorKey: "speed" },
    columnHelper.accessor((row) => row.speedInMph(), {
      header: "Speed (mph)",
      cell: (info) => (info.getValue() ? Math.round(info.getValue()!) : ""),
    }),
    columnHelper.accessor((row) => row.speedInKph(), {
      header: "Speed (kph)",
      cell: (info) => (info.getValue() ? Math.round(info.getValue()!) : ""),
    }),
    columnHelper.accessor("temperature", {
      header: "Temp (C)",
      cell: (info) => (info.getValue() ? roundValue(info.getValue()!, 10) : ""),
    }),
    columnHelper.accessor((row) => row.temperatureInFahrenheit(), {
      header: "Temp (F)",
      cell: (info) => (info.getValue() ? Math.round(info.getValue()!) : ""),
    }),
    columnHelper.accessor("voltage", {
      header: "Voltage",
      cell: (info) =>
        info.getValue() ? roundValue(info.getValue()!, 100) : "",
    }),
    columnHelper.accessor("lat", {
      header: "Latitude",
      cell: (info) =>
        info.row.original.hasTelemetry && info.getValue()
          ? roundValue(info.getValue()!, 10000)
          : "",
    }),
    columnHelper.accessor("long", {
      header: "Longitude",
      cell: (info) =>
        info.row.original.hasTelemetry && info.getValue()
          ? roundValue(info.getValue()!, 10000)
          : "",
    }),
  ];

  const table = useReactTable({
    data: wsprData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className={classes.wsprTable}>
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
