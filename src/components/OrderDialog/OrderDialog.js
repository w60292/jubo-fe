import { useEffect, useRef, useState } from 'react';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { randomId } from '@mui/x-data-grid-generator';
import { DialogContext } from './DialogContext';
import Toolbar from "./Toolbar";

// const orderMockRows = [
//   { id: 1, message: "就寢時間，臨睡前大劑量給藥" },
//   { id: 2, message: "超過120請施打8u" },
//   { id: 3, message: "繼續同樣治療" },
//   { id: 4, message: "肌肉注射含5%葡萄糖的生理鹽水" },
//   { id: 5, message: "禁食，禁飲水" },
// ];
const _fetchAPI = async (method = 'POST', endpoint, bodyObj) => {
  const headers = new Headers();
  const raw = JSON.stringify(bodyObj);
  const requestOptions = {
    method,
    headers: headers,
    body: raw,
  };

  headers.append("Content-Type", "application/json");
  
  return await fetch(endpoint, requestOptions)
    .then(resp => resp.json())
    .catch(err => console.error(err));
}

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

export default function OrderDialog({ open, data, setShowDialog }) {
  const patientIdRef = useRef(0);
  const [orderList, setOrderList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrderList = async (id) => {
    await fetch(`/order?patientId=${id}`)
      .then((res) => res.json())
      .then((jsonResult) => setOrderList(jsonResult));
  }

  const handleRowClick = (event) => {
    const { row } = event;
    setSelectedOrder(row);
  }

  const processRowUpdate = async (newRow) => {
    const { isNew, message, id } = newRow;
    if (isNew) {
      await _fetchAPI('POST', '/order', {
        patientId: patientIdRef.current,
        message,
        isNew,
      });
    } else {
      await _fetchAPI('POST', '/order', {
        orderId: id,
        message,
      });
    }
    await fetchOrderList(patientIdRef.current);
    setSelectedOrder(null);
  }

  const handleClose = (_, reason) => {
    // Don't close the dialog if user clicks outside of it.
    if (reason && reason === "backdropClick") return;
    else {
      setSelectedOrder(null);
      setShowDialog(false);
    }
  };
  const buttons = [
    {
      text: "Add",
      icon: <AddIcon />,
      disabled: false,
      handler: () => {
        const id = randomId();
        setOrderList((oldRows) => [...oldRows, { id, sno: oldRows.length + 1, message: '', isNew: true }]);
        setSelectedOrder(null);
      },
    },
    {
      text: "Remove",
      icon: <DeleteIcon />,
      disabled: true,
      handler: async () => {
        const { id } = selectedOrder
        await _fetchAPI('DELETE', `/order?orderId=${id}`);
        await fetchOrderList(patientIdRef.current);
        setSelectedOrder(null);
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
      <DialogContext.Provider value={{selectedOrder}}>
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
              onProcessRowUpdateError={()=>{}}
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
