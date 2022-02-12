import React, { useState, useRef, useEffect } from "react";
import { makeStyles, Typography, useTheme, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "10vw",
  },
  ammoCount: {
    fontSize: theme.typography.pxToRem(50),
  },
}));

export default ({ currentAmmoInMagazine, totalAmmoCount }) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Paper
      elevation={4}
      style={{
        padding: theme.spacing(2),
        position: "fixed",
        right: 25,
        bottom: 25,
      }}
      className={classes.root}
    >
      <Typography className={classes.ammoCount}>
        {currentAmmoInMagazine}/{totalAmmoCount}
      </Typography>
    </Paper>
  );
};
