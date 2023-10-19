import { Stack, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ToolbarButton from "./ToolbarButton";

/**
 * Toolbar with some information and buttons.
 *
 * Usage:
 *  const buttons = [{
 *    text: "Add",
 *    icon: <AddIcon />,
 *    disabled: false,
 *    handler: () => console.log('Toggle Add!'),
 *  }, ...];
 *
 *  <Toolbar buttons={buttons} />
 */
export default function Toolbar({ buttons }) {
  return (
    <Stack direction="row" spacing={2} padding={"10px 0"}>
      <Typography
        component="div"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          color: "var(--black-jubo-color)",
          flexGrow: 1,
        }}
      >
        <HelpOutlineIcon />
        <span
          style={{
            paddingLeft: "5px",
          }}
        >
          Double-click the message for editing.
        </span>
      </Typography>
      {buttons.map((item, index) => (
        <ToolbarButton key={`toolbar-button-${index}`} {...item} />
      ))}
    </Stack>
  );
}
