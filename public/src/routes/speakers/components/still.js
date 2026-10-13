// Turns 3D scenes into still images with one shared WebGL renderer, so a page full of models
// costs a single GPU context and no animation loop.
//
//   const { url, points } = await renderStill(build, width, height)
//
// `build(THREE, scene, renderer)` fills the scene and returns { camera, points? }, where points
// is { name: Object3D }. Each point comes back as { name, x, y } in % of the image, for labels.

let shared;

function setup() {
	shared ??= Promise.all([import('three'), import('three/addons/environments/RoomEnvironment.js')]).then(
		([THREE, { RoomEnvironment }]) => {
			const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
			renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.localClippingEnabled = true;
			const pmrem = new THREE.PMREMGenerator(renderer);
			const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
			return { THREE, renderer, environment };
		}
	);
	return shared;
}

// One render at a time: they all share the same canvas
let queue = Promise.resolve();

export function renderStill(build, width, height) {
	const job = queue.then(async () => {
		const { THREE, renderer, environment } = await setup();
		const scene = new THREE.Scene();
		scene.environment = environment;
		const { camera, points = {} } = await build(THREE, scene, renderer);

		renderer.setPixelRatio(1);
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		scene.updateMatrixWorld();
		renderer.render(scene, camera);

		const url = await new Promise((resolve) =>
			renderer.domElement.toBlob((blob) => resolve(URL.createObjectURL(blob)))
		);
		const v = new THREE.Vector3();
		const projected = Object.entries(points).map(([name, obj]) => {
			obj.getWorldPosition(v).project(camera);
			return { name, x: ((v.x + 1) / 2) * 100, y: ((1 - v.y) / 2) * 100 };
		});

		scene.traverse((o) => {
			o.geometry?.dispose();
			[o.material].flat().forEach((m) => {
				if (!m) return;
				Object.values(m).forEach((val) => val?.isTexture && val.dispose());
				m.dispose();
			});
		});
		return { url, points: projected };
	});
	queue = job.catch(() => {});
	return job;
}

// Pixel size to render an element at: its CSS size times the screen density (capped)
export function pixelSize(el) {
	const ratio = Math.min(devicePixelRatio, 2);
	return [Math.round(el.clientWidth * ratio), Math.round(el.clientHeight * ratio)];
}
