// A little sunset, drawn rather than downloaded, with a touch of grain like a real photo
export function paintSunset(ctx, w, h) {
	const sky = ctx.createLinearGradient(0, 0, 0, h * 0.7);
	sky.addColorStop(0, '#312e81');
	sky.addColorStop(0.55, '#c026d3');
	sky.addColorStop(1, '#fb923c');
	ctx.fillStyle = sky;
	ctx.fillRect(0, 0, w, h);
	const sun = ctx.createRadialGradient(w * 0.62, h * 0.62, 4, w * 0.62, h * 0.62, w * 0.16);
	sun.addColorStop(0, '#fef9c3');
	sun.addColorStop(0.5, '#fde047');
	sun.addColorStop(1, 'rgba(253, 224, 71, 0)');
	ctx.fillStyle = sun;
	ctx.fillRect(0, 0, w, h);
	const hills = [
		['#7c3aed', 0.68, 0.05],
		['#4c1d95', 0.78, 0.08],
		['#1e1b4b', 0.88, 0.06]
	];
	for (const [colour, y, amp] of hills) {
		const g = ctx.createLinearGradient(0, h * (y - amp), 0, h);
		g.addColorStop(0, colour);
		g.addColorStop(1, '#0f0a2e');
		ctx.fillStyle = g;
		ctx.beginPath();
		ctx.moveTo(0, h);
		for (let x = 0; x <= w; x += 4)
			ctx.lineTo(x, h * y + Math.sin(x / (w * 0.09) + y * 9) * h * amp);
		ctx.lineTo(w, h);
		ctx.fill();
	}
	const img = ctx.getImageData(0, 0, w, h);
	let a = 5;
	for (let i = 0; i < img.data.length; i += 4) {
		a = (a * 16807) % 2147483647;
		const n = ((a % 13) - 6) * 1.2;
		img.data[i] += n;
		img.data[i + 1] += n;
		img.data[i + 2] += n;
	}
	return img;
}
