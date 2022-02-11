import React, { useState, useRef } from "react";
import Sketch from "react-p5";

export default () => {
	const MAP_SIZE_X_IN_PIXELS = 10000;
	const MAP_SIZE_Y_IN_PIXELS = 10000;

	const [hp, setHp] = useState(100);
	const [totalAmmoCount, setTotalAmmoCount] = useState(180);
	const [currentAmmoInMagazine, setCurrentAmmoInMagazine] = useState(30);
	const [waveCounter, setWaveCounter] = useState(1);
	const [timerInSeconds, setTimerInSeconds] = useState(15);

	const playerPosition = useRef({
		X: Math.floor(MAP_SIZE_X_IN_PIXELS/2),
		Y: Math.floor(MAP_SIZE_Y_IN_PIXELS/2)
	});
	
	function movement(p5) {
		if (p5.keyIsDown("LEFT_ARROW")) {
			playerPosition.X -= 1;
		}
		
		if (p5.keyIsDown("RIGHT_ARROW")) {
			playerPosition.X += 1;
		}
		
		if (p5.keyIsDown("UP_ARROW")) {
			playerPosition.Y -= 1;
		}
		
		if (p5.keyIsDown("DOWN_ARROW")) {
			playerPosition.Y += 1;
		}
	}

	function generateMap(p5) {
		p5.fill(0);
		p5.rect(0, 0, MAP_SIZE_X_IN_PIXELS, 10);
		p5.rect(0, 0, 10, MAP_SIZE_Y_IN_PIXELS);
		p5.rect(0, MAP_SIZE_X_IN_PIXELS - 10, MAP_SIZE_X_IN_PIXELS, 10);
		p5.rect(MAP_SIZE_Y_IN_PIXELS - 10, 0, 10, MAP_SIZE_Y_IN_PIXELS);
	  }

	function player(p5) {
		p5.fill(0);
		p5.ellipse(playerPosition.X, playerPosition.Y, 10);
	  }

	const setup = (p5, canvasParentRef) => {
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
	};

	const draw = (p5) => {
		p5.background(220);
		generateMap(p5);
		player(p5);
		movement(p5);
	};

	return <Sketch setup={setup} draw={draw} />;
};