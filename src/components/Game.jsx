import React, { useState } from "react";
import Sketch from "react-p5";

export default () => {
	const [hp, setHp] = useState(100);
	const [totalAmmoCount, setTotalAmmoCount] = useState(180);
	const [currentAmmoInMagazine, setCurrentAmmoInMagazine] = useState(30);
	const [waveCounter, setWaveCounter] = useState(1);
	const [timerInSeconds, setTimerInSeconds] = useState(15);

	

	const setup = (p5, canvasParentRef) => {
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
	};

	const draw = (p5) => {
		p5.background(0);
		p5.ellipse(x, y, 70, 70);
		// NOTE: Do not use setState in the draw function or in functions that are executed
		// in the draw function...
		// please use normal variables or class properties for these purposes
		x++;
	};

	return <Sketch setup={setup} draw={draw} />;
};