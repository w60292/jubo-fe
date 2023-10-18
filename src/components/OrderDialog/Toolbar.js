import { Stack, Typography } from "@mui/material";
import ToolbarButton from "./ToolbarButton";

export default function Toolbar({ buttons }) {
  return (
    <Stack direction="row" spacing={2} padding={"10px 0"}>
      <Typography component="div" sx={{ display: 'flex', alignItems: 'center', color: 'var(--black-jubo-color)', flexGrow: 1 }}>雙擊Message以編輯</Typography>
      {buttons.map((item, index) => (
        <ToolbarButton key={`toolbar-button-${index}`} {...item} />
      ))}
    </Stack>
  );
}
