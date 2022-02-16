import React from "react";
import {
  makeStyles,
  Typography,
  useTheme,
  Paper,
  LinearProgress,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    width: "30vw",
  },
  colorPrimary: {
    background: "red",
  },
  linearProgressRoot: {
    height: 10,
    borderRadius: 5,
  },
}));

export default ({ hp }) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Paper
      elevation={4}
      style={{
        border: "2px solid white",
        borderRadius: 20,
        padding: theme.spacing(2),
        position: "fixed",
        left: "50vw",
        transform: "translate(-50%, 0)",
        top: 25,
      }}
      className={classes.root}
    >
      <LinearProgress
        classes={{
          barColorPrimary: classes.colorPrimary,
          root: classes.linearProgressRoot,
        }}
        variant="determinate"
        value={hp}
      />
    </Paper>
  );
};
