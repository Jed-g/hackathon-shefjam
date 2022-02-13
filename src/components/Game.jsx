import React, { useState, useRef, useEffect } from "react";
import Sketch from "react-p5";
import ProgressWidget from "./ProgressWidget";
import AmmoCount from "./AmmoCount";
import HpBar from "./HpBar";
import { Typography, makeStyles, useTheme } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "10vw",
  },
  message: {
    fontSize: theme.typography.pxToRem(200),
  },
}));

export default () => {
  const MAP_SIZE_X_IN_PIXELS = 8000;
  const MAP_SIZE_Y_IN_PIXELS = 8000;
  const MOVEMENT_SPEED = 10;
  const BACKGROUND_SIZE_X_IN_PIXELS = 2893;
  const BACKGROUND_SIZE_Y_IN_PIXELS = 4340;
  const BORDER_WIDTH = 100;
  const BULLET_SPEED = 30;
  const BULLET_FIRING_SPEED_IN_FRAMES = 15;
  const ZOMBIE_SPEED = 5;
  const FRAME_RATE = 60;

  const [hp, setHp] = useState(100);
  const [totalAmmoCount, setTotalAmmoCount] = useState(180);
  const [currentAmmoInMagazine, setCurrentAmmoInMagazine] = useState(30);
  const [waveCounter, setWaveCounter] = useState(1);
  const [timerInSeconds, setTimerInSeconds] = useState(90);
  const timeSinceLastBullet = useRef(BULLET_FIRING_SPEED_IN_FRAMES);
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  const theme = useTheme();
  const classes = useStyles();

  const bullets = useRef([]);

  const zombies = useRef([]);
  const zombiesSpawnIntervalInSeconds = useRef(10);
  const frameCounter = useRef(0);
  const timeWhenLastZombieSpawned = useRef(timerInSeconds);

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
  }, []);

  function movement(p5) {
    // left
    if (playerPosition.current.X > BORDER_WIDTH) {
      if (p5.keyIsDown(65)) {
        playerPosition.current.X -= MOVEMENT_SPEED;
        bullets.current.forEach((bullet) => {
          bullet.positionX += MOVEMENT_SPEED;
        });
      }
    }

    // right
    if (playerPosition.current.X < MAP_SIZE_X_IN_PIXELS - BORDER_WIDTH) {
      if (p5.keyIsDown(68)) {
        playerPosition.current.X += MOVEMENT_SPEED;
        bullets.current.forEach((bullet) => {
          bullet.positionX -= MOVEMENT_SPEED;
        });
      }
    }

    // top
    if (playerPosition.current.Y > BORDER_WIDTH) {
      if (p5.keyIsDown(87)) {
        playerPosition.current.Y -= MOVEMENT_SPEED;
        bullets.current.forEach((bullet) => {
          bullet.positionY += MOVEMENT_SPEED;
        });
      }
    }

    // bottom
    if (playerPosition.current.Y < MAP_SIZE_Y_IN_PIXELS - BORDER_WIDTH) {
      if (p5.keyIsDown(83)) {
        playerPosition.current.Y += MOVEMENT_SPEED;
        bullets.current.forEach((bullet) => {
          bullet.positionY -= MOVEMENT_SPEED;
        });
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
    p5.fill(255, 0, 0);
    p5.rect(25, -5, 25, 10);

    p5.pop();
  }

  function moveZombiesToPlayer() {
    zombies.current.forEach((zombie) => {
      const vectorX = playerPosition.current.X - zombie.positionX;
      const vectorY = playerPosition.current.Y - zombie.positionY;

      zombie.positionX +=
        (ZOMBIE_SPEED * vectorX) / (Math.abs(vectorX) + Math.abs(vectorY));
      zombie.positionY +=
        (ZOMBIE_SPEED * vectorY) / (Math.abs(vectorX) + Math.abs(vectorY));
    });
  }

  function zombieCoordinatesGenerator() {
    const side = Math.floor(Math.random() * 4);

    switch (side) {
      case 0:
        return [Math.floor(Math.random() * window.innerWidth), 0];
      case 1:
        return [
          window.innerWidth,
          Math.floor(Math.random() * window.innerHeight),
        ];
      case 2:
        return [
          Math.floor(Math.random() * window.innerWidth),
          window.innerHeight,
        ];
      case 3:
        return [0, Math.floor(Math.random() * window.innerHeight)];
      default:
        return;
    }
  }

  function spawnZombie() {
    timeWhenLastZombieSpawned.current = timerInSeconds;
    const [zombieCoordsNotOffsetX, zombieCoordsNotOffsetY] =
      zombieCoordinatesGenerator();
    zombies.current.push({
      positionX:
        zombieCoordsNotOffsetX +
        playerPosition.current.X -
        Math.floor(window.innerWidth / 2),
      positionY:
        zombieCoordsNotOffsetY +
        playerPosition.current.Y -
        Math.floor(window.innerHeight / 2),
        health: 100,
    });
  }

  function drawZombie(p5) {
    zombies.current.forEach((zombie) => {
      p5.push();
      
      if (zombie.health === 100) {
        p5.fill(0, 128, 0);
      } 
      else if (zombie.health === 66) {
        p5.fill(255, 165, 0);
      } 
      else {
        p5.fill(255, 0, 0);
      }

      p5.rect(
        zombie.positionX -
          playerPosition.current.X +
          Math.floor(window.innerWidth / 2) -
          25,
        zombie.positionY -
          playerPosition.current.Y +
          Math.floor(window.innerHeight / 2) -
          25,
        50,
        50
      );

      p5.pop();
    });
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
      positionX: playerPosition.current.X,
      positionY: playerPosition.current.Y,
    });
  }

  function drawBullets(p5) {
    let i = 0;
    while (i < bullets.current.length) {
      const bullet = bullets.current[i];

      p5.push();
      p5.fill(255);

      p5.ellipse(
        bullet.positionX -
          playerPosition.current.X +
          Math.floor(window.innerWidth / 2),
        bullet.positionY -
          playerPosition.current.Y +
          Math.floor(window.innerHeight / 2),
        20
      );

      bullet.positionX += bullet.vector.x;
      bullet.positionY += bullet.vector.y;

      p5.pop();

      if (
        bullet.positionX > MAP_SIZE_X_IN_PIXELS ||
        bullet.positionX < 0 ||
        bullet.positionY < 0 ||
        bullet.positionY > MAP_SIZE_Y_IN_PIXELS
      ) {
        bullets.current.splice(i, 1);
      } else {
        i++;
      }
    }
  }

  function checkBulletCollision(p5) {
    let i = 0
    while (i < zombies.current.length) {
      const zombie = zombies.current[i];

      let j = 0
      while (j < bullets.current.length) {
        const bullet = bullets.current[j];

        if (zombie.positionX <= (bullet.positionX + 20) && (zombie.positionX + 50) >= bullet.positionX &&
        zombie.positionY <= (bullet.positionY + 20) && (zombie.positionY + 50) >= bullet.positionY) {
          zombie.health -= 34;

          if (zombie.health < 0) {
            zombies.current.splice(i, 1);
          }

          bullets.current.splice(j, 1);
        }
        j++;
      }
      i++;
    }
  }

  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
    p5.frameRate(FRAME_RATE);
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

    if (frameCounter.current % FRAME_RATE == 0) {
      setTimerInSeconds((prev) => prev - 1);
    }

    if (
      timeWhenLastZombieSpawned.current - timerInSeconds >
      zombiesSpawnIntervalInSeconds.current
    ) {
      spawnZombie();
    }

    frameCounter.current++;

    p5.background(0);
    movement(p5);
    drawMap(p5);
    drawPlayer(p5);
    moveZombiesToPlayer();

    if (bullets.current !== undefined && bullets.current.length > 0) {
      drawBullets(p5);
    }

    if (zombies.current !== undefined && zombies.current.length > 0) {
      drawZombie(p5);
    }

    checkBulletCollision(p5);
  };

  const img = useRef();
  const background = useRef();

  const preload = (p5) => {
    img.current = p5.loadImage(process.env.PUBLIC_URL + "/img/map.png");
    background.current = p5.loadImage(
      process.env.PUBLIC_URL + "/img/star-background.jpg"
    );
  };

  const messageRef = useRef();
  const [message, setMessage] = useState("");
  const dispatchMessage = (message) => {
    setMessage(message);
    setOverlayOpacity(0.8);

    messageRef.current.style.top = "50vh";

    setTimeout(() => {
      messageRef.current.style.top = "calc(100vh + 100px)";
      setOverlayOpacity(0);

      setTimeout(() => {
        messageRef.current.style.transition = "none";
        messageRef.current.style.top = "-100px";
        setTimeout(() => {
          messageRef.current.style.transition = "top 2s ease-in-out 0s";
        }, 50);
        messageRef.current.style.transitionDuration = "2s";
      }, 2000);
    }, 2500);
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
      <HpBar hp={hp} />
      <Sketch
        mousePressed={() => (mouseDown.current = true)}
        mouseReleased={() => (mouseDown.current = false)}
        preload={preload}
        setup={setup}
        draw={draw}
      />
      <div
        style={{
          position: "fixed",
          transition: "opacity 2s ease-in-out 0s",
          height: "100vh",
          width: "100vw",
          opacity: overlayOpacity,
          backgroundColor: "black",
          top: 0,
        }}
      ></div>
      <Typography
        className={classes.message}
        ref={messageRef}
        style={{
          position: "fixed",
          top: -100,
          left: "50vw",
          transform: "translate(-50%, -50%)",
          transition: "top 2s ease-in-out 0s",
        }}
      >
        {message}
      </Typography>
    </>
  );
};
