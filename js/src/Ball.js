const Config = require('./Config');

const { Vector } = require('./math/Vector');

class Ball {
	constructor(position, velocity, mass = 1, radius = 1) {

		this.position = position; // Vector
		this.velocity = velocity; // Vector
		this.mass = mass;
		this.radius = radius;
		this.distanceTravelled = 0;
		this.ballCollisions = 0;
		this.wallCollisions = 0;
	}

	momentum() {
	    return this.velocity.scale(this.mass);
	}

	kineticEnergy() {
	    return 0.5 * this.mass * this.velocity.magnitudeSquared();
	}

	// New position at time t
	updatePosition(t) {
		const scaledVelocity = this.velocity.scale(t);
		const position = Vector.add(this.position, scaledVelocity);
		this.position = position;
		this.distanceTravelled += scaledVelocity.magnitude();
	}

	updateVelocity(v) {
		this.velocity = v;
	}

	ballCollision() {
		this.ballCollisions += 1;
	}

	wallCollision() {
		this.wallCollisions += 1;
	}

	render(ctx) {
		const centerX = Config.CANVAS_DIMENSIONS / 2;
		const centerY = centerX;

		const x = centerX + this.position.x;
		const y = centerY - this.position.y;

		// TODO: Fill ball color dependent on speed
		ctx.beginPath();
		ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();

		// Draw velocity vector
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + this.velocity.x / 5, y - this.velocity.y / 5);
		ctx.stroke();
	}
}

module.exports = Ball;
