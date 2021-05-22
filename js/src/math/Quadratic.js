class Quadratic {
	constructor(a, b, c) {
		const determinant = Math.pow(b, 2) - (4 * a * c);
		
		if(determinant >= 0) {
			const r1 = (-b - Math.sqrt(determinant)) / (2 * a);
			const r2 = (-b + Math.sqrt(determinant)) / (2 * a);
			return [r1, r2];
		}
		
		return [];
	}
}

module.exports = Quadratic;