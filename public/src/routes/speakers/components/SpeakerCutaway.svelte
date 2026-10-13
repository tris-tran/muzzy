<script>
	// A speaker driver cut in half and pulled apart along its axis (an exploded view), rendered once
	// as a still image with its parts labelled: magnet, frame, spider, voice coil, cone with its
	// surround, and dust cap.
	//   height – CSS height of the picture
	//   labels – show the part names
	import LabelledStill from './LabelledStill.svelte';

	let { height = '28rem', labels = true } = $props();

	function build(THREE, scene) {
		const key = new THREE.DirectionalLight(0xffffff, 1.6);
		key.position.set(8, 10, 6);
		scene.add(key, new THREE.AmbientLight(0xffffff, 0.3));

		// Cut away everything on the camera's side of x = 0
		const clippingPlanes = [new THREE.Plane(new THREE.Vector3(1, 0, 0), 0)];
		const material = (color, metalness, roughness) =>
			new THREE.MeshStandardMaterial({ color, metalness, roughness, side: THREE.DoubleSide, clippingPlanes });
		const mat = {
			steel: material(0xaab2bd, 0.85, 0.3),
			magnet: material(0x2a2e35, 0.2, 0.55),
			copper: material(0xd07a3a, 0.9, 0.28),
			spider: material(0xd8c39a, 0, 0.95),
			cone: material(0x30343c, 0, 0.85),
			cap: material(0x454a54, 0, 0.6),
			rubber: material(0x1b1d22, 0, 0.75)
		};

		// Everything is built around the Y axis (front = +Y), then the whole speaker is turned so
		// Y points at +Z. Profiles are [radius, height] points.
		const lathe = (pts) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), 96);
		const ring = (r1, r2, y1, y2) => lathe([[r1, y1], [r2, y1], [r2, y2], [r1, y2], [r1, y1]]);
		const mesh = (geometry, m) => new THREE.Mesh(geometry, m);

		const speaker = new THREE.Group();
		speaker.rotation.x = Math.PI / 2;
		scene.add(speaker);

		// Each part gets its own group, slid `offset` along the axis to pull the speaker apart.
		// Its label anchor sits on the cut face (x = 0) at height r (negative r = lower half);
		// `left` puts the name on the left of its dot.
		const points = {};
		function part(offset, name, y, r, left = false) {
			const group = new THREE.Group();
			group.position.y = offset;
			speaker.add(group);
			const anchor = new THREE.Object3D();
			anchor.position.set(0, y, -r);
			group.add(anchor);
			points[(left ? '<' : '') + name] = anchor;
			return group;
		}

		// Magnet assembly: back plate + centre pole, ring magnet, top plate. The coil sits in the gap.
		part(-3.5, 'Magnet', -1.5, 2.3).add(
			mesh(lathe([[0, -3.3], [2.3, -3.3], [2.3, -2.9], [0.72, -2.9], [0.72, -1.5], [0, -1.5]]), mat.steel),
			mesh(ring(1.05, 2.3, -2.9, -1.9), mat.magnet),
			mesh(ring(0.86, 2.3, -1.9, -1.5), mat.steel)
		);

		// Voice coil: copper wire wound on a tube that hangs in the magnet gap
		const coil = part(5.2, 'Voice coil', -1.4, -0.85);
		coil.add(mesh(new THREE.CylinderGeometry(0.77, 0.77, 1.3, 64, 1, true), mat.spider).translateY(-1.15));
		for (let y = -1.75; y < -1.05; y += 0.07) {
			const turn = mesh(new THREE.TorusGeometry(0.79, 0.035, 8, 64), mat.copper);
			turn.rotation.x = Math.PI / 2;
			turn.position.y = y;
			coil.add(turn);
		}

		// Spider: the wavy fabric ring that keeps the coil centred
		const spider = [];
		for (let i = 0; i <= 24; i++) spider.push([0.8 + (i / 24) * 1.4, -0.9 + Math.sin(i * Math.PI * 0.5) * 0.07]);
		part(3.4, 'Spider', -0.88, -2.2).add(mesh(lathe(spider), mat.spider));

		// Cone: a gently curved paper funnel from the coil out to the surround
		const cone = [];
		for (let i = 0; i <= 16; i++) {
			const t = i / 16;
			cone.push([0.8 + t * 2.95, -0.55 + t * 1.25 + Math.sin(t * Math.PI) * 0.25]);
		}
		part(7.2, 'Cone', 0.33, 2.3).add(mesh(lathe(cone), mat.cone));

		// Dust cap: the dome that keeps dirt out of the gap
		const cap = mesh(new THREE.SphereGeometry(1.25, 48, 16, 0, Math.PI * 2, 0, 0.75), mat.cap);
		cap.position.y = -1.48;
		part(9.8, 'Dust cap', -0.4, 0.85).add(cap);

		// Surround: the soft rubber roll that joins the cone to the frame
		const roll = [];
		for (let i = 0; i <= 16; i++) {
			const a = Math.PI - (i / 16) * Math.PI;
			roll.push([3.98 + Math.cos(a) * 0.23, 0.7 + Math.sin(a) * 0.25]);
		}
		part(7.2, 'Surround', 0.95, 3.98).add(mesh(lathe(roll), mat.rubber));

		// Frame (basket): front flange plus four arms down to the magnet
		const frame = part(0, 'Frame', 0.7, 4.65);
		frame.add(mesh(ring(4.2, 4.65, 0.55, 0.7), mat.steel), mesh(ring(2.0, 2.35, -1.5, -1.35), mat.steel));
		for (let i = 0; i < 4; i++) {
			const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
			const from = new THREE.Vector3(Math.cos(a) * 2.2, -1.45, Math.sin(a) * 2.2);
			const to = new THREE.Vector3(Math.cos(a) * 4.35, 0.6, Math.sin(a) * 4.35);
			const arm = mesh(new THREE.BoxGeometry(0.5, from.distanceTo(to), 0.08), mat.steel);
			arm.position.copy(from).lerp(to, 0.5);
			arm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
			arm.rotateY(Math.PI / 2);
			frame.add(arm);
		}

		// Look at the cut face from the side, a little from the front, so the speaker faces right
		const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
		camera.position.set(-21, 6, 7);
		camera.lookAt(0, 0, 2.9);
		return { camera, points };
	}
</script>

<LabelledStill {build} {height} {labels} alt="A speaker driver cut in half and pulled apart, showing its parts" />
