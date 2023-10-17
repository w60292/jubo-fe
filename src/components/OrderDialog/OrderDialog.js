import {
  Add as AddIcon,
  Mode as ModeIcon,
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
import Toolbar from "./Toolbar";

const orderMockRows = [
  { id: 1, message: "就寢時間，臨睡前大劑量給藥" },
  { id: 2, message: "超過120請施打8u" },
  { id: 3, message: "繼續同樣治療" },
  { id: 4, message: "肌肉注射含5%葡萄糖的生理鹽水" },
  { id: 5, message: "禁食，禁飲水" },
];

const orderColumns = [
  {
    field: "id",
    headerName: "#",
    width: 50,
    headerClassName: "jubo-theme-header",
  },
  {
    field: "message",
    headerName: "Message",
    flex: 1,
    headerClassName: "jubo-theme-header",
  },
];

export default function OrderDialog({ open, data, setShowDialog }) {
  const handleClose = (_, reason) => {
    // Don't close the dialog if user clicks outside of it.
    if (reason && reason === "backdropClick") return;
    else setShowDialog(false);
  };
  const buttons = [
    {
      text: "Add",
      icon: <AddIcon />,
      handler: () => console.log("新增醫囑"),
    },
    {
      text: "Edit",
      icon: <ModeIcon />,
      handler: () => console.log("更新醫囑"),
    },
    {
      text: "Remove",
      icon: <DeleteIcon />,
      handler: () => console.log("移除醫囑"),
    },
  ];

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
          <DataGrid rows={orderMockRows} columns={orderColumns} />
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
    </Dialog>
  );
}
