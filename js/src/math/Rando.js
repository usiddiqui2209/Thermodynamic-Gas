class Rando {
	static uniform(lb, ub) {
		const dx = Math.abs(ub - lb);
		return lb + (Math.random() * dx);
	}
	
	static uniformInt(lb, ub) {
		const dx = Math.abs(ub - lb);
		return Math.floor(lb + (Math.random() * dx));
	}
	
	static gaussian(mean = 0, sigma = 1) {
		const _2PI = 2 * Math.PI;
		const u1 = Math.random();
		const u2 = Math.random();
		
		const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(_2PI * u2);
		// var z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(_2PI * u2);
		
		return mean + (z0 * sigma);
	}
	
	static conserveSquared(q) {
		const n = (Math.random() >= 0.5) ? -1 : 1;
		const sqrtQ = Math.sqrt(q);
		
		const x = this.uniform(-sqrtQ, sqrtQ);
		const y = Math.sqrt(q - (x * x)) * n;
		
		return [x, y];
	}
}

module.exports = Rando;