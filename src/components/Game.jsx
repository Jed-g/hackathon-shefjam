import React, { useState, useRef, useEffect } from "react";
import Sketch from "react-p5";

export default () => {
  const MAP_SIZE_X_IN_PIXELS = 10000;
  const MAP_SIZE_Y_IN_PIXELS = 10000;
  const MOVEMENT_SPEED = 40;

  const [hp, setHp] = useState(100);
  const [totalAmmoCount, setTotalAmmoCount] = useState(180);
  const [currentAmmoInMagazine, setCurrentAmmoInMagazine] = useState(30);
  const [waveCounter, setWaveCounter] = useState(1);
  const [timerInSeconds, setTimerInSeconds] = useState(15);

  const playerPosition = useRef({
    X: Math.floor(MAP_SIZE_X_IN_PIXELS / 2),
    Y: Math.floor(MAP_SIZE_Y_IN_PIXELS / 2),
  });

  const mousePosition = useRef({
    X: Math.floor(window.innerWidth / 2),
    Y: Math.floor(window.innerHeight / 2),
  });

  useEffect(() => {
	  const mouseMovementHandler = (e) => {
		mousePosition.current.X = e.clientX;
		mousePosition.current.Y = e.clientY;
	  }
	  document.addEventListener("mousemove", mouseMovementHandler);

	  return () => document.removeEventListener("mousemove", mouseMovementHandler);
  });

  function movement(p5) {
    if (p5.keyIsDown(p5.LEFT_ARROW)) {
      playerPosition.current.X -= MOVEMENT_SPEED;
    }

    if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      playerPosition.current.X += MOVEMENT_SPEED;
    }

    if (p5.keyIsDown(p5.UP_ARROW)) {
      playerPosition.current.Y -= MOVEMENT_SPEED;
    }

    if (p5.keyIsDown(p5.DOWN_ARROW)) {
      playerPosition.current.Y += MOVEMENT_SPEED;
    }
  }

  function drawPlayer(p5) {
    p5.fill(0);
    p5.angleMode(p5.DEGREES);


	p5.push();

    // p5.translate(
    //   Math.floor(window.innerWidth / 2),
    //   Math.floor(window.innerHeight / 2)
    // );

    if (mousePosition.current.X - Math.floor(window.innerWidth / 2) === 0) {
      if (mousePosition.current.Y - Math.floor(window.innerHeight / 2) >= 0) {
        p5.rotate(90);
      } else {
        p5.rotate(270);
      }
    } else {
      p5.rotate(
        p5.atan2(
          mousePosition.current.Y - Math.floor(window.innerHeight / 2),
          mousePosition.current.X - Math.floor(window.innerWidth / 2)
        )
      );
    }

	p5.translate(
		Math.floor(window.innerWidth / 2),
		Math.floor(window.innerHeight / 2)
	  );

    p5.rect(
      -25,
      -25,
      50,
      50
    );



	p5.pop();

  }

  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
    window.scrollTo(
      Math.floor(window.innerWidth / 2),
      Math.floor(window.innerHeight / 2)
    );
  };

  const drawMap = (p5) => {
    p5.image(
      img.current,
      0,
      0,
      window.innerWidth,
      window.innerHeight,
      Math.floor(playerPosition.current.X / 2 - window.innerWidth / 2),
      Math.floor(playerPosition.current.Y / 2 - window.innerHeight / 2),
      window.innerWidth,
      window.innerHeight
    );
  };

  const draw = (p5) => {
    movement(p5);
    drawMap(p5);
    drawPlayer(p5);
  };

  const img = useRef();

  const preload = (p5) => {
    img.current = p5.loadImage(process.env.PUBLIC_URL + "/img/map.png");
  };

  return <Sketch preload={preload} setup={setup} draw={draw} />;
};
