const Ball = require('./Ball');
const Canvas = require('./Canvas');
const CollisionUtils = require('./physics/CollisionUtils');
const Config = require('./Config');
const WriteOutput = require('./WriteOutput');

const {
	CANVAS_ID,
	CANVAS_DIMENSIONS,
	CONTAINER_RADIUS,
	OUTPUT_FILE_DIRECTORY,
	MAX_COLLISIONS,
} = require('./Config');

const { PolarVector, Vector } = require('./math/Vector');

// Stores initial conditions of simulation
const InitialConditions = require('./data/InitialConditions.json');

class App {
	constructor() {
		this.wallCollisions = 0;
		this.ballCollisions = 0;
		this.dp = 0;
		this.time = 0;
		this.balls = [];
		this.isNode = (typeof window === 'undefined') ? true : false; // Detects runtime environment

		if (this.isNode) {
			this.out = new WriteOutput();
		} else {
			this.cc = new Canvas(CANVAS_ID, CANVAS_DIMENSIONS, CONTAINER_RADIUS);
		}

		this.init();
	}

	init() {
		this.parseInitialConditions();
		this.ballsInContainer = this.countBallsInContainer();

		if (!this.isNode) {
			this.updateState(0); // Render state at time t = 0s
		} else {
			this.out.stateMeasurement(this);
		}

		setTimeout(this.runSimulation.bind(this), 100);
	}

	parseInitialConditions() {
		// TODO: Create setup generator
		for (let ball of InitialConditions) {

			const position = ball.position;
			const velocity = ball.velocity;
			const mass = ball.mass;
			const radius = ball.radius;

			const positionVector = new Vector(position[0], position[1], position[2]);
			const velocityVector = new Vector(velocity[0], velocity[1], velocity[2]);

			const ballInstance = new Ball(positionVector, velocityVector, mass, radius);
			this.balls.push(ballInstance);
		}
	}

	runSimulation() {
		const collisions = this.ballCollisions + this.wallCollisions;

		if (collisions % 250 === 0) {
			this.ballsInContainer = this.countBallsInContainer();
		}

		const nextCollision = this.findNextCollision();

		this.time += nextCollision.collisionTime;
		this.processCollision(nextCollision);

		if (this.isNode) {
			console.log(`${((collisions / MAX_COLLISIONS) * 100).toPrecision(3)}%`);
			this.out.printLine(this);
			if (collisions < MAX_COLLISIONS) {
				setImmediate(this.runSimulation.bind(this));
			} else {
				this.out.stateMeasurement(this);
				this.out.save();
			}
		} else {
			if (collisions < MAX_COLLISIONS) {
				window.requestAnimationFrame(this.runSimulation.bind(this));
			}
		}
	}

	findNextCollision() {
		let timeToWallCollision = Infinity;
		let ballIdWallCollision = [];
		let timeToBallCollision = Infinity;
		let ballIdBallCollision = [];

		const l = this.balls.length;

		for (let i = 0; i < l; i++) {
			const collisionWithWall = CollisionUtils.b2wPredictCollisionTime(this.balls[i]);
			if (collisionWithWall < timeToWallCollision) {
				timeToWallCollision = collisionWithWall;
				ballIdWallCollision = [i];
			}

			for (let j = i; j < l; j++) {
				if (i === j) continue;

				const collisionWithBall = CollisionUtils.b2bPredictCollisionTime(this.balls[i], this.balls[j]);
				if (collisionWithBall < timeToBallCollision) {
					timeToBallCollision = collisionWithBall;
					ballIdBallCollision = [i, j];
				}
			}
		}

		if (timeToWallCollision < timeToBallCollision) {
			this.wallCollisions += 1;
			return {
				collisionTime: timeToWallCollision,
				collidingEntities: ballIdWallCollision
			};
		} else {
			this.ballCollisions += 1;
			return {
				collisionTime: timeToBallCollision,
				collidingEntities: ballIdBallCollision
			};
		}
	}

	updateState(collisionTime) {
		if (!this.isNode) {
			this.cc.clearCanvas();
			this.cc.renderEmptyState(this.time, this.wallCollisions, this.ballCollisions, this.ballsInContainer, this.performContinuousMeasurements());
		}

		for (let b of this.balls) {
			b.updatePosition(collisionTime);

			if (!this.isNode) b.render(this.cc.ctx);
		}
	}

	processCollision(nextCollision) {
		this.updateState(nextCollision.collisionTime);

		if (nextCollision.collidingEntities.length === 1) {
			// Wall collision
			const ball = this.balls[nextCollision.collidingEntities[0]];
			const reboundVelocity = CollisionUtils.b2wCollision(ball);
			const initialMomentum = ball.momentum();
			const finalMomentum = reboundVelocity.scale(ball.mass);
			const changeInMomentum = Vector.subtract(finalMomentum, initialMomentum).magnitude();
			this.dp += changeInMomentum;

			this.balls[nextCollision.collidingEntities[0]].wallCollision();
			this.balls[nextCollision.collidingEntities[0]].updateVelocity(reboundVelocity);
		} else {
			// Ball collision
			const reboundVelocity = CollisionUtils.b2bCollision(this.balls[nextCollision.collidingEntities[0]], this.balls[nextCollision.collidingEntities[1]]);
			this.balls[nextCollision.collidingEntities[0]].ballCollision();
			this.balls[nextCollision.collidingEntities[1]].ballCollision();

			this.balls[nextCollision.collidingEntities[0]].updateVelocity(reboundVelocity[0]);
			this.balls[nextCollision.collidingEntities[1]].updateVelocity(reboundVelocity[1]);
		}
	}

	countBallsInContainer() {
		let ballCount = 0;

		for (let b of this.balls) {
			if (b.position.magnitude() + b.radius <= CONTAINER_RADIUS) {
				ballCount += 1;
			}
		}

		return ballCount;
	}

	performContinuousMeasurements(balls) {
		let kineticEnergy = 0;
		let sumOfSquaredSpeed = 0;

		for (let b of this.balls) {
			kineticEnergy += this.kineticEnergy(b);
			sumOfSquaredSpeed += b.velocity.magnitudeSquared();
		}

		return {
			kineticEnergy: kineticEnergy,
			rmsSpeed: Math.sqrt(sumOfSquaredSpeed / this.ballsInContainer),
			pressure: (this.time === 0) ? 0 : this.dp / (2 * 3.14159 * CONTAINER_RADIUS * this.time)
		};
	}

	kineticEnergy(b) {
		return 0.5 * b.mass * b.velocity.magnitudeSquared();
	}
}

new App();
