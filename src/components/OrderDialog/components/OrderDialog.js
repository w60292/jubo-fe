import { useEffect, useReducer, useRef } from "react";
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
  const initialState = {
    orderList: [],
    selectedOrder: null,
  };
  const orderReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
      // List orders
      case "LIST": {
        const { orderList } = payload;
        return {
          ...state,
          orderList,
          selectedOrder: null,
        };
      }
      case "SELECT":
        // Select an order to edit or delete.
        const { row } = payload;
        return {
          ...state,
          selectedOrder: row,
        };
      case "NEW": {
        // Create a new row and remark isNew to true.
        const { orderList } = state;

        return {
          ...state,
          orderList: [
            ...orderList,
            {
              id: randomId(),
              sno: orderList.length + 1,
              message: "",
              isNew: true,
            },
          ],
          selectedOrder: null,
        };
      }
      case "RESET": {
        return {
          ...state,
          selectedOrder: null,
        };
      }
      default:
        break;
    }
  };
  const [state, dispatch] = useReducer(orderReducer, initialState);

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
  const fetchOrderList = async (patientId) => {
    const orderList = await fetchAPI("GET", `/order?patientId=${patientId}`);
    dispatch({ type: "LIST", payload: { orderList } });
  };

  // Remove an order
  const deleteOrder = async (orderId) => {
    await fetchAPI("DELETE", `/order?orderId=${orderId}`);
    await fetchOrderList(patientIdRef.current);
  };

  // Select an order to edit or remove.
  const handleRowClick = (event) => {
    dispatch({ type: "SELECT", payload: { row: event.row } });
  };

  // While user press "Enter" or focus out of the field, we will treat as
  // editing complete, and insert/update the data row to BE server.
  const processRowUpdate = async (newRow) => {
    const { isNew, message, id } = newRow;
    const patientId = patientIdRef.current;

    if (isNew) {
      await fetchAPI("POST", "/order", {
        patientId,
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
    await fetchOrderList(patientId);
  };

  const handleClose = (_, reason) => {
    // Don't close the dialog if user clicks outside of it.
    // We would only accept user to close the dialog from the "CLOSE" button.
    if (reason && reason === "backdropClick") return;
    else {
      dispatch({ type: "RESET" });
      setShowDialog(false);
    }
  };

  // Button config for the toolbar.
  const buttons = [
    {
      text: "Add",
      icon: <AddIcon />,
      disabled: false,
      handler: () => dispatch({ type: "NEW" }),
    },
    {
      text: "Remove",
      icon: <DeleteIcon />,
      disabled: true,
      handler: async () => {
        const { id } = state.selectedOrder || {};
        await deleteOrder(id);
      },
    },
  ];

  useEffect(() => {
    if (data && data.id && data.id !== patientIdRef.current) {
      patientIdRef.current = data.id;
      fetchOrderList(data.id);
    }
  }, [data, state]);

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
      <DialogContext.Provider value={state.selectedOrder}>
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
              rows={state.orderList || []}
              columns={orderColumns}
              onRowClick={handleRowClick}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={() => {}}
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
