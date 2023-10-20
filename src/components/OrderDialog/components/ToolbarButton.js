import { useContext } from "react";
import { Button } from "@mui/material";
import { DialogContext } from "./DialogContext";

/**
 * It's a button component for toolbar.
 *
 * Usage:
 *  <ToolbarButton
 *    icon=<DeleteIcon />
 *    text="Remove",
 *    disabled={true},
 *    handler={() => {
 *      console.log('Toggle Remove');
 *    }}
 * />
 */
export default function ToolbarButton({ text, icon, handler = {}, disabled }) {
  const selected = useContext(DialogContext);

  return (
    <Button
      variant="contained"
      onClick={handler}
      startIcon={icon}
      disabled={disabled && !selected?.id}
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
