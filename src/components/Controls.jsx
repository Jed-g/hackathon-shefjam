import React from "react";
import { makeStyles, Typography, useTheme, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 180,
  },
  controls: {
    fontSize: theme.typography.pxToRem(30),
  },
}));

export default () => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Paper
      elevation={4}
      style={{
        padding: theme.spacing(2),
        position: "fixed",
        top: 25,
        right: 25,
        width: "16vw",
      }}
      className={classes.root}
    >
      <Typography className={classes.controls}>Control: W,A,S,D</Typography>
      <Typography className={classes.controls}>Reload: R</Typography>
    </Paper>
  );
};
