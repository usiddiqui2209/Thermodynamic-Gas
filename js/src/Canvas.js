class Canvas {
	constructor(canvasId, dimensions, containerRadius) {
		
		this.ctx = document.getElementById(canvasId).getContext('2d');
		this.containerRadius = containerRadius;
		this.ctx.canvas.width = dimensions;
		this.ctx.canvas.height = dimensions;
		
		this.CENTER_X = this.ctx.canvas.width / 2;
		this.CENTER_Y = this.ctx.canvas.height / 2;
	}
	
	clearCanvas() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}
	
	renderEmptyState(time, wallCollisions, ballCollisions, numParticles, stateMeasurements) {
		// Draw container
		this.ctx.beginPath();
		this.ctx.arc(this.CENTER_X, this.CENTER_Y, this.containerRadius, 0, 2 * Math.PI);
		this.ctx.stroke();
		
		const timeStr = `Time: ${time.toPrecision(3)}s`;
		const particleCountStr = `Particles: ${numParticles}`;
		const wallCollisionsStr = `Wall Collisions: ${wallCollisions}`;
		const ballCollisionsStr = `Ball Collisions: ${ballCollisions}`;
		const totalCollisionsStr = `Collisions: ${wallCollisions + ballCollisions}`;
		const kineticEnergyStr = `Kinetic Energy: ${stateMeasurements.kineticEnergy.toPrecision(3)}J`;
		const rmsSpeedStr = `RMS Speed: ${stateMeasurements.rmsSpeed.toPrecision(3)}m/s`;
		const pressureStr = `Pressure: ${stateMeasurements.pressure.toPrecision(3)}Pa`;
		this.ctx.fillText(timeStr, 10, 10);
		this.ctx.fillText(particleCountStr, 10, 20);
		this.ctx.fillText(wallCollisionsStr, 10, 30);
		this.ctx.fillText(ballCollisionsStr, 10, 40);
		this.ctx.fillText(totalCollisionsStr, 10, 50);
		this.ctx.fillText(kineticEnergyStr, 10, 60);
		this.ctx.fillText(rmsSpeedStr, 10, 70);
		this.ctx.fillText(pressureStr, 10, 80)
	}
}

module.exports = Canvas;