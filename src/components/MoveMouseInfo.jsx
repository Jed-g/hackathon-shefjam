import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  message: {
    fontSize: theme.typography.pxToRem(100),
  },
}));

export default () => {
  const classes = useStyles();

  return (
    <div
      style={{
        position: "fixed",
        transition: "opacity 2s ease-in-out 0s",
        height: "100vh",
        width: "100vw",
        opacity: 0.8,
        backgroundColor: "black",
        top: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography className={classes.message}>Move mouse to begin!</Typography>
    </div>
  );
};
