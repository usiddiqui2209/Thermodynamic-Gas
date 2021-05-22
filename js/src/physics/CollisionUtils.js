const Config = require('../Config');
const Quadratic = require('../math/Quadratic');

const { Vector } = require('../math/Vector');

class CollisionUtils {
	// TODO: Test this function

	static b2bCollision(b1, b2) {
		const m1 = b1.mass;
		const m2 = b2.mass;

		const r1 = b1.position;
		const r2 = b2.position;

		const u1 = b1.velocity;
		const u2 = b2.velocity;

		const dv = Vector.subtract(u1, u2);
		const dr = Vector.subtract(r1, r2);

		const s = (2 * Vector.dotProduct(dr, dv)) / ((m1 + m2) * dr.magnitudeSquared());

		const v1 = Vector.subtract(u1, dr.scale(m2 * s));
		const v2 = Vector.subtract(u2, dr.scale(-m1 * s));

		return [v1, v2];
	}

	static b2wCollision(b) {
		const r = b.position;
		const u = b.velocity;

		const nHat = r.normalize();
		const u_nHat = nHat.scale(Vector.dotProduct(u, nHat));
		const u_tHat = Vector.subtract(u, u_nHat);

		const v = Vector.add(u_tHat, u_nHat.scale(-1));

		return v;
	}

	// Ball to ball collision prediction
	static b2bPredictCollisionTime(b1, b2) {
		const b1Radius = b1.radius;
		const b2Radius = b2.radius;

		const r1 = b1.position;
		const r2 = b2.position;

		const v1 = b1.velocity;
		const v2 = b2.velocity;

		const dv = Vector.subtract(v1, v2);
		const dr = Vector.subtract(r1, r2);

		const a = dv.magnitudeSquared();
		const b = 2 * Vector.dotProduct(dr, dv);
		const c = dr.magnitudeSquared() - Math.pow(b1Radius + b2Radius, 2);

		const t = this.solveTimePredictiveQuadratic(a, b, c);

		return t;
	}

	// Ball to wall collision prediction
	static b2wPredictCollisionTime(ball) {
		const r = ball.position;
		const v = ball.velocity;
		const radius = ball.radius;
		const CONTAINER_RADIUS = Config.CONTAINER_RADIUS;

		const a = v.magnitudeSquared();
		const b = 2 * Vector.dotProduct(r, v);
		const c = r.magnitudeSquared() - Math.pow(CONTAINER_RADIUS - radius, 2);

		return this.solveTimePredictiveQuadratic(a, b, c);
	}

	static solveTimePredictiveQuadratic(a, b, c) {
		const [t1, t2] = new Quadratic(a, b, c);

		// Solutions with t < 1e-9 are likely t = 0 with rounding errors
		if (t1 < t2 && t1 > 1e-9) {
			return t1;
		}

		if (t2 > 1e-9) {
			return t2;
		}

		return Infinity;
	}
}

module.exports = CollisionUtils;
