import { useContext } from 'react';
import { Button } from "@mui/material";
import { DialogContext } from './DialogContext';


export default function ToolbarButton({ text, icon, handler = {}, disabled }) {
  const { selectedOrder } = useContext(DialogContext);

  return (
    <Button
      variant="contained"
      onClick={handler}
      startIcon={icon}
      disabled={disabled && !selectedOrder?.id}
      sx={{
        backgroundColor: "var(--dark-jubo-color)",
        fontWeight: "bold",
        ":hover": {
          backgroundColor: "var(--light-jubo-color)",
        },
      }}
    >
      {text}
    </Button>
  );
}
