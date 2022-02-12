import React, { useState, useRef, useEffect } from "react";
import Sketch from "react-p5";
import ProgressWidget from "./ProgressWidget";
import AmmoCount from "./AmmoCount";

export default () => {
  const MAP_SIZE_X_IN_PIXELS = 8000;
  const MAP_SIZE_Y_IN_PIXELS = 8000;
  const MOVEMENT_SPEED = 40;
  const BACKGROUND_SIZE_X_IN_PIXELS = 2893;
  const BACKGROUND_SIZE_Y_IN_PIXELS = 4340;
  const BORDER_WIDTH = 100;
  const BULLET_SPEED = 20;
  const BULLET_FIRING_SPEED_IN_FRAMES = 15;

  const [hp, setHp] = useState(100);
  const [totalAmmoCount, setTotalAmmoCount] = useState(180);
  const [currentAmmoInMagazine, setCurrentAmmoInMagazine] = useState(30);
  const [waveCounter, setWaveCounter] = useState(1);
  const [timerInSeconds, setTimerInSeconds] = useState(15);
  const timeSinceLastBullet = useRef(BULLET_FIRING_SPEED_IN_FRAMES);

  const bullets = useRef([]);

  const mouseDown = useRef(false);

  const playerPosition = useRef({
    X: Math.floor(MAP_SIZE_X_IN_PIXELS / 2) - 1000,
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
    };
    document.addEventListener("mousemove", mouseMovementHandler);

    return () =>
      document.removeEventListener("mousemove", mouseMovementHandler);
  });

  function movement(p5) {
    // left
    if (playerPosition.current.X > BORDER_WIDTH) {
      if (p5.keyIsDown(65)) {
        playerPosition.current.X -= MOVEMENT_SPEED;
      }
    }

    // right
    if (playerPosition.current.X < MAP_SIZE_X_IN_PIXELS - BORDER_WIDTH) {
      if (p5.keyIsDown(68)) {
        playerPosition.current.X += MOVEMENT_SPEED;
      }
    }

    // top
    if (playerPosition.current.Y > BORDER_WIDTH) {
      if (p5.keyIsDown(87)) {
        playerPosition.current.Y -= MOVEMENT_SPEED;
      }
    }

    // bottom
    if (playerPosition.current.Y < MAP_SIZE_Y_IN_PIXELS - BORDER_WIDTH) {
      if (p5.keyIsDown(83)) {
        playerPosition.current.Y += MOVEMENT_SPEED;
      }
    }
  }

  function drawPlayer(p5) {
    p5.fill(0);
    p5.angleMode(p5.DEGREES);

    p5.push();

    p5.translate(
      Math.floor(window.innerWidth / 2),
      Math.floor(window.innerHeight / 2)
    );

    if (mousePosition.current.X - Math.floor(window.innerWidth / 2) === 0) {
      if (mousePosition.current.Y - Math.floor(window.innerHeight / 2) > 0) {
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

    p5.rect(-25, -25, 50, 50);
    p5.pop();
  }

  function fireBullets(p5) {
    if (timeSinceLastBullet.current < BULLET_FIRING_SPEED_IN_FRAMES) {
      return;
    } else {
      timeSinceLastBullet.current = 0;
    }

    const vectorX = mousePosition.current.X - Math.floor(window.innerWidth / 2);
    const vectorY =
      mousePosition.current.Y - Math.floor(window.innerHeight / 2);

    const vector = p5.createVector(
      (BULLET_SPEED * vectorX) / (Math.abs(vectorX) + Math.abs(vectorY)),
      (BULLET_SPEED * vectorY) / (Math.abs(vectorX) + Math.abs(vectorY))
    );

    bullets.current.push({
      vector,
      positionX: Math.floor(window.innerWidth / 2),
      positionY: Math.floor(window.innerHeight / 2),
    });
  }

  function drawBullets(p5) {
    let i = 0;
    while (i < bullets.current.length) {
      const bullet = bullets.current[i];

      p5.push();
      p5.fill(255);

      p5.ellipse(bullet.positionX, bullet.positionY, 20);

      bullet.positionX += bullet.vector.x;
      bullet.positionY += bullet.vector.y;

      p5.pop();

      if (
        bullet.positionX > window.innerWidth ||
        bullet.positionX < 0 ||
        bullet.positionY < 0 ||
        bullet.positionY > window.innerHeight
      ) {
        bullets.current.splice(i, 1);
      } else {
        i++;
      }
    }
  }

  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
    p5.frameRate(60);
    window.scrollTo(
      Math.floor(window.innerWidth / 2),
      Math.floor(window.innerHeight / 2)
    );
  };

  const drawMap = (p5) => {
    p5.image(
      background.current,
      0,
      0,
      window.innerWidth,
      window.innerHeight,
      (playerPosition.current.X / MAP_SIZE_X_IN_PIXELS) *
        (BACKGROUND_SIZE_X_IN_PIXELS - window.innerWidth),
      (playerPosition.current.Y / MAP_SIZE_Y_IN_PIXELS) *
        (BACKGROUND_SIZE_Y_IN_PIXELS - window.innerHeight),
      window.innerWidth,
      window.innerHeight
    );

    p5.image(
      img.current,
      0,
      0,
      window.innerWidth,
      window.innerHeight,
      Math.floor(playerPosition.current.X - window.innerWidth / 2),
      Math.floor(playerPosition.current.Y - window.innerHeight / 2),
      window.innerWidth,
      window.innerHeight
    );
  };

  const draw = (p5) => {
    timeSinceLastBullet.current++;
    mouseDown.current && fireBullets(p5);

    p5.background(0);
    movement(p5);
    drawMap(p5);
    drawPlayer(p5);

    if (bullets.current !== undefined && bullets.current.length > 0) {
      drawBullets(p5);
    }
  };

  const img = useRef();
  const background = useRef();

  const preload = (p5) => {
    img.current = p5.loadImage(process.env.PUBLIC_URL + "/img/map.png");
    background.current = p5.loadImage(
      process.env.PUBLIC_URL + "/img/star-background.jpg"
    );
  };

  return (
    <>
      <ProgressWidget
        waveCounter={waveCounter}
        timerInSeconds={timerInSeconds}
      />
      <AmmoCount
        totalAmmoCount={totalAmmoCount}
        currentAmmoInMagazine={currentAmmoInMagazine}
      />
      <Sketch
        mousePressed={() => (mouseDown.current = true)}
        mouseReleased={() => (mouseDown.current = false)}
        preload={preload}
        setup={setup}
        draw={draw}
      />
    </>
  );
};
