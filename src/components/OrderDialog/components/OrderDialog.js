import { useEffect, useRef, useState } from "react";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";

import { fetchAPI } from "../../../utils";
import { DialogContext } from "./DialogContext";
import Toolbar from "./Toolbar";

export default function OrderDialog({ open, data, setShowDialog }) {
  // Current patient ID
  const patientIdRef = useRef(0);
  // The order list of current patient
  const [orderList, setOrderList] = useState([]);
  // The selected order to edit or remove
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orderColumns = [
    {
      field: "sno",
      headerName: "#",
      width: 50,
      headerClassName: "jubo-theme-header",
    },
    {
      field: "message",
      headerName: "Message",
      flex: 1,
      headerClassName: "jubo-theme-header",
      editable: true,
    },
  ];

  // Get order list from the BE server.
  const fetchOrderList = async (id) => {
    const results = await fetchAPI("GET", `/order?patientId=${id}`);
    // Set order list
    setOrderList(results);
    // Clear the selected order.
    setSelectedOrder(null);
  };

  // Select an order to edit or remove.
  const handleRowClick = (event) => {
    const { row } = event;
    setSelectedOrder(row);
  };

  // While user press "Enter" or focus out of the field, we will treat as
  // editing complete, and insert/update the data row to BE server.
  const processRowUpdate = async (newRow) => {
    const { isNew, message, id } = newRow;
    if (isNew) {
      await fetchAPI("POST", "/order", {
        patientId: patientIdRef.current,
        message,
        isNew,
      });
    } else {
      await fetchAPI("POST", "/order", {
        orderId: id,
        message,
      });
    }
    // After insert/update operation, we'll refetch the order list and renew
    // the data grid.
    await fetchOrderList(patientIdRef.current);
  };

  const handleClose = (_, reason) => {
    // Don't close the dialog if user clicks outside of it.
    // We would only accept user to close the dialog from the "CLOSE" button.
    if (reason && reason === "backdropClick") return;
    else {
      setSelectedOrder(null);
      setShowDialog(false);
    }
  };

  // Button config for the toolbar.
  const buttons = [
    {
      text: "Add",
      icon: <AddIcon />,
      disabled: false,
      handler: () => {
        // Create a new row and remark isNew to true.
        setOrderList((oldRows) => {
          return [
            ...oldRows,
            {
              id: randomId(),
              sno: oldRows.length + 1,
              message: "",
              isNew: true,
            },
          ];
        });
        setSelectedOrder(null);
      },
    },
    {
      text: "Remove",
      icon: <DeleteIcon />,
      disabled: true,
      handler: async () => {
        const { id } = selectedOrder;
        await fetchAPI("DELETE", `/order?orderId=${id}`);
        await fetchOrderList(patientIdRef.current);
      },
    },
  ];

  useEffect(() => {
    if (data && data.id && data.id !== patientIdRef.current) {
      patientIdRef.current = data.id;
      fetchOrderList(data.id);
    }
  }, [data, orderList, selectedOrder]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "75%",
          minHeight: "300",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogContext.Provider value={{ selectedOrder }}>
        <DialogTitle
          sx={{
            backgroundColor: "var(--header-color)",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Orders - {data?.name} ({data?.telephone})
        </DialogTitle>
        <DialogContent
          dividers={true}
          sx={{
            paddingTop: "0",
          }}
        >
          <Toolbar buttons={buttons} />
          <Box
            sx={{
              "& .jubo-theme-header": {
                backgroundColor: "var(--dark-jubo-color)",
                color: "white",
              },
            }}
          >
            <DataGrid
              experimentalFeatures={{ newEditingApi: true }}
              editMode="row"
              rows={orderList}
              columns={orderColumns}
              onRowClick={handleRowClick}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={(err) => console.error(err)}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: "var(--footer-color)",
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              fontWeight: "bold",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </DialogContext.Provider>
    </Dialog>
  );
}
