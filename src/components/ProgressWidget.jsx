import React from "react";
import { makeStyles, Typography, useTheme, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "20vw",
  },
  waveCounter: {
    fontSize: theme.typography.pxToRem(50),
  },
  timeLeft: {
    fontSize: theme.typography.pxToRem(50),
  },
}));

export default ({ waveCounter, timerInSeconds }) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Paper
      elevation={4}
      style={{
        padding: theme.spacing(2),
        position: "fixed",
        left: 25,
        top: 25,
      }}
      className={classes.root}
    >
      <Typography className={classes.waveCounter}>
        Wave: {waveCounter}
      </Typography>
      <Typography className={classes.timeLeft}>
        Time left: {timerInSeconds}
      </Typography>
    </Paper>
  );
};
