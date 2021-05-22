class Vector {
	constructor(x, y, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	magnitude() {
		return Math.sqrt(
			this.x * this.x +
			this.y * this.y +
			this.z * this.z
		);
	}
	
	scale(scaleFactor) {
		return new Vector(
			this.x * scaleFactor,
			this.y * scaleFactor,
			this.z * scaleFactor
		);
	}
	
	normalize() {
		const magnitude = this.magnitude();
		
		if(magnitude !== 0) {
			return new Vector(
				this.x / magnitude,
				this.y / magnitude,
				this.z / magnitude
			);
		}
	}
	
	scaleToMagnitude(magnitude) {
		return this.scale(magnitude / this.magnitude());
	}
	
	magnitudeSquared() {
		return Vector.dotProduct(this, this);
	}
	
	static add() {
		let x = 0;
		let y = 0;
		let z = 0;
		
		for (let v of arguments) {
			x += v.x;
			y += v.y;
			z += v.z;
		}
		return new Vector(x, y, z);
	}
	
	/* v1 - v2 */
	static subtract(v1, v2) {
		return this.add(v1, v2.scale(-1));
	}
	
	static dotProduct(v1, v2) {
		return (
			(v1.x * v2.x) +
			(v1.y * v2.y) +
			(v1.z * v2.z)
		);
	}
	
	static angleBetween(v1, v2) {
		return Math.acos(Vector.dotProduct(v1, v2) / (v1.magnitude() * v2.magnitude()));
	}
}

class PolarVector extends Vector {
	
	/* Theta in radians expected */
	constructor(r, theta, z = 0) {
		const x = r * Math.cos(theta);
		const y = r * Math.sin(theta);
		
		super(x, y, z);
	}
}

module.exports = {
	Vector: Vector,
	PolarVector: PolarVector,
};