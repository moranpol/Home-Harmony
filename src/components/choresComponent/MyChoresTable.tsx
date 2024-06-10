import React, { useCallback, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Checkbox from "@mui/material/Checkbox";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import "./MyChoresTable.css";

const theme = createTheme();

interface Row {
  id: number;
  isDone: boolean;
  task: string;
}

const MyChoresTable = ({ userId }: { userId: number }) => {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    axios
      .get(`/chores/${userId}`)
      .then((res) => {
        const data = res.data;
        console.log(data);
        if (data.success && Array.isArray(data.chores)) {
          const choresList: Row[] = data.chores.map((chore: any) => ({
            id: chore.id,
            isDone: chore.isDone || false,
            task: chore.description || "",
          }));
          setRows(choresList);
        } else {
          console.error("Expected an array but got", data);
        }
      })
      .catch((error) => {
        console.log("Failed to retrieve chores", error);
      });
  }, [userId]);

  const onTaskChange = useCallback(
    (id: number, task: string, checked: boolean) => {
      axios
        .put(`/chores/${id}`, { isDone: checked, task })
        .then(() => {
          const updatedRows = rows.map((row) =>
            row.id === id ? { ...row, isDone: checked } : row
          );
          setRows(updatedRows);
        })
        .catch((error) => {
          console.log("Failed to update chore", error);
        });
    },
    [rows]
  );

  const columns: GridColDef[] = [
    {
      field: "isDone",
      headerName: "",
      width: 50,
      renderCell: (params) => (
        <Checkbox
          checked={params.value as boolean}
          onChange={(event) => {
            const checked = event.target.checked;
            onTaskChange(params.id as number, params.row.task, checked);
          }}
          style={{ padding: "0", color: "#000" }}
        />
      ),
    },
    {
      field: "task",
      headerName: "",
      width: 250,
      editable: true,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter
          disableColumnMenu
          checkboxSelection={false}
          className="MyChoresTable"
        />
      </div>
    </ThemeProvider>
  );
};

export default MyChoresTable;
