const fs = require('fs');

const { CONTAINER_RADIUS, OUTPUT_FILE_DIRECTORY } = require('./config.js');
const { Vector } = require('./math/Vector');

class WriteOutput {
	constructor() {
		this.output = [];
		this.containerCircumference = 2 * 3.14159 * CONTAINER_RADIUS;
	}

	stateMeasurement(App) {
		const { time, ballCollisions, wallCollisions, balls, dp } = App;
		const totalCollisions = ballCollisions + wallCollisions;

		// NOTE:	These are data-expensive calculations
		//			and should only be used to record the
		//			state of the system occassionally
		//
		//			These calculations return long arrays

		const stateMeasurements = this.performStateMeasurements(balls);
		this.output.push({
			time: time,
			ballCollisions: ballCollisions,
			wallCollisions: wallCollisions,
			kineticEnergy: stateMeasurements.kineticEnergy,
			particleSpeed: stateMeasurements.particleSpeed,
			particleMomentum: stateMeasurements.particleMomentum,
			meanFreePath: stateMeasurements.meanFreePath,
			distanceFromCenter: stateMeasurements.distanceFromCenter,
			distanceFromBalls: stateMeasurements.distanceFromBalls,
			pressure: (time === 0) ? 0 : dp / (this.containerCircumference * time)
		});
	}

	printLine(App) {
	    
		const { time, ballCollisions, wallCollisions, balls, ballsInContainer, dp } = App;
		const totalCollisions = ballCollisions + wallCollisions;

		// Continuous measurements
		const continuousMeasurements = this.performContinuousMeasurements(balls, ballsInContainer);
		this.output.push({
			time: time,
			ballCollisions: ballCollisions,
			wallCollisions: wallCollisions,
			totalCollisions: totalCollisions,
			innerConcentration: continuousMeasurements.innerConcentration,
			kineticEnergy: continuousMeasurements.kineticEnergy,
			rmsSpeed: continuousMeasurements.rmsSpeed,
			pressure: (time === 0) ? 0 : dp / (this.containerCircumference * time)
		});
	}

	// NOTE:	Total momentum is NOT conserved
	//			This is because we are not taking into
	//			account the momentum of the container
	performContinuousMeasurements(balls, ballsInContainer) {
		let kineticEnergy = 0;
		let sumOfSquaredSpeed = 0;
		let innerConcentration = 0;

		for (let b of balls) {
			kineticEnergy += b.kineticEnergy();
			sumOfSquaredSpeed += b.velocity.magnitudeSquared();
			innerConcentration += (b.position.magnitude() < 50) ? 1 : 0;
		}

		return {
			innerConcentration: innerConcentration,
			kineticEnergy: kineticEnergy,
			rmsSpeed: Math.sqrt(sumOfSquaredSpeed / ballsInContainer),
		};
	}

	performStateMeasurements(balls) {
	    let l = balls.length;

		let kineticEnergy = [];
		let particleSpeed = [];
		let particleMomentum = [];
		let distanceFromCenter = [];
		let distanceFromBalls = [];
		let meanFreePath = [];

		for (let i = 0; i < l; i++) {
		    const b = balls[i];
			kineticEnergy.push(b.kineticEnergy());
			particleSpeed.push(b.velocity.magnitude());
			particleMomentum.push(b.momentum());
			distanceFromCenter.push(b.position.magnitude());
			for (let j = i + 1; j < l; j++) {
			    const b2 = balls[j];
			    const separation = Vector.subtract(b.position, b2.position).magnitude();
			    distanceFromBalls.push(separation);
			}
			meanFreePath.push((b.ballCollisions > 0) ? b.distanceTravelled / b.ballCollisions : 0);
		}

		return {
			kineticEnergy: kineticEnergy,
			particleSpeed: particleSpeed,
			particleMomentum: particleMomentum,
			distanceFromCenter: distanceFromCenter,
			distanceFromBalls: distanceFromBalls,
			meanFreePath: meanFreePath,
		};
	}

	save() {
		const date = Date.now().toString();
		const fileDirectory = `${OUTPUT_FILE_DIRECTORY}${date}.json`;
		const output = JSON.stringify(this.output);

		fs.writeFile(fileDirectory, output, function(err) {
			if (err) throw err;

			console.log(fileDirectory);
		});
	}
}

module.exports = WriteOutput;
