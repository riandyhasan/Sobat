import { Dispatch, SetStateAction } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

export interface DataTableProps {
  columns: GridColDef[];
  data: any[];
  loading: boolean;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: Dispatch<
    SetStateAction<{ pageSize: number; page: number }>
  >;
  dataLen: number;
}

export default function DataTable({
  columns,
  data,
  loading,
  dataLen,
  paginationModel,
  setPaginationModel,
}: DataTableProps) {
  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pagination
        rowCount={dataLen}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 20, page: 0 },
          },
        }}
        loading={loading}
        pageSizeOptions={[20, 50, 100]}
        sx={{ maxWidth: "90vw" }}
      />
    </div>
  );
}
