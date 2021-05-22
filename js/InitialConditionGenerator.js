const fs = require('fs');

const Rando = require('./src/math/Rando');

const { PolarVector, Vector } = require('./src/math/Vector');
const { CONTAINER_RADIUS, RMS_SPEED, NUM_PARTICLES, DEFAULT_RADIUS } = require('./src/config.js');

class InitialConditionGenerator {
	constructor() {
		this.balls = [];

		for (let i = 0; i < NUM_PARTICLES; i++) {
			this.balls.push(this.generateBall());
		}

		this.save();
	}

	generateBall() {
		const mass = 1;
		const radius = DEFAULT_RADIUS;
		const v = this.conserveKineticEnergy(RMS_SPEED * RMS_SPEED);
		let p = this.generatePosition(CONTAINER_RADIUS, radius);

		return {
			position: p,
			velocity: v,
			mass: mass,
			radius: radius
		};
	}

	isOutsideContainer(x, y, ballRadius, containerRadius) {
		return Math.sqrt(
			(x * x) +
			(y * y)
		) + ballRadius >= containerRadius - 300;
	}

	isColliding(x, y, ballRadius) {
		let collidingWithBall = false;

		for (let b of this.balls) {
			if (Math.sqrt(
				Math.pow(x - b.position[0], 2) +
				Math.pow(y - b.position[1], 2)
			) <= ballRadius + b.radius) {
				collidingWithBall = true;
				break;
			}
		}

		return collidingWithBall;
	}

	conserveKineticEnergy(KE) {
		const [x, y] = Rando.conserveSquared(KE);
		const z = 0;

		return [x, y, z];
	}

	generatePosition(containerRadius, ballRadius) {
		let x = Rando.uniform(-containerRadius, containerRadius);
		let y = Rando.uniform(-containerRadius, containerRadius);
		const z = 0;

		while(this.isOutsideContainer(x, y, ballRadius, containerRadius) || this.isColliding(x, y, ballRadius)) {
			x = Rando.uniform(-containerRadius, containerRadius);
			y = Rando.uniform(-containerRadius, containerRadius);
		}

		return [x, y, z];
	}

	save() {
		const output = JSON.stringify(this.balls);
		const fileDirectory = './src/data/InitialConditions.json';

		fs.writeFile(fileDirectory, output, function(err) {
			if (err) throw err;

			console.log(fileDirectory);
		});
	}
}

new InitialConditionGenerator();
