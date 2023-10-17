import { Button } from "@mui/material";

export default function ToolbarButton({ text, icon, handler = {} }) {
  return (
    <Button
      variant="contained"
      onClick={handler}
      startIcon={icon}
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
