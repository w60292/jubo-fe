import { Stack, Typography } from "@mui/material";
import ToolbarButton from "./ToolbarButton";

export default function Toolbar({ buttons }) {
  return (
    <Stack direction="row" spacing={2} padding={"10px 0"}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
      {buttons.map((item, index) => (
        <ToolbarButton key={`toolbar-button-${index}`} {...item} />
      ))}
    </Stack>
  );
}
