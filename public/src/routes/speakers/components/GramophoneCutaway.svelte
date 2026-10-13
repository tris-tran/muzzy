<script>
	// A wind-up gramophone cut in half down the middle, rendered once as a still image. The labels
	// are numbered in the order things happen: the crank winds a spring, the spring turns the
	// record, the groove shakes the needle, the needle shakes a thin diaphragm, and the tone arm and
	// horn carry that sound out. An accent line traces the sound's path, no electricity anywhere.
	//   height – CSS height of the picture
	//   labels – show the part names
	import LabelledStill from './LabelledStill.svelte';

	let { height = '36rem', labels = true } = $props();

	function build(THREE, scene) {
		const key = new THREE.DirectionalLight(0xffffff, 1.5);
		key.position.set(6, 12, 10);
		scene.add(key, new THREE.AmbientLight(0xffffff, 0.35));

		// Everything sits on the z = 0 plane; cut away the front half (z > 0) to see inside
		const clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)];
		const material = (color, metalness, roughness) =>
			new THREE.MeshStandardMaterial({ color, metalness, roughness, side: THREE.DoubleSide, clippingPlanes });
		const mat = {
			wood: material(0x9a6a3f, 0, 0.7),
			woodDark: material(0x6f4a28, 0, 0.75),
			brass: material(0xd4a24c, 0.9, 0.3),
			steel: material(0xaab2bd, 0.85, 0.3),
			record: material(0x16181c, 0.1, 0.35),
			label: material(0xb91c1c, 0, 0.6),
			felt: material(0x2f5d3a, 0, 1),
			mica: material(0xe9dfc6, 0.1, 0.4),
			spring: material(0x3b3f46, 0.8, 0.35),
			// The sound path is drawn whole, not cut
			sound: new THREE.MeshBasicMaterial({ color: 0x6366f1 })
		};
		const mesh = (geometry, m) => new THREE.Mesh(geometry, m);
		const cylinder = (r, h, m, x, y, z = 0) => mesh(new THREE.CylinderGeometry(r, r, h, 64), m).translateX(x).translateY(y).translateZ(z);

		const points = {};
		const label = (name, x, y, left = false) => {
			const anchor = new THREE.Object3D();
			anchor.position.set(x, y, 0);
			scene.add(anchor);
			points[(left ? '<' : '') + name] = anchor;
		};

		// --- The wooden case: six slabs, so the cut shows its walls ---
		const W = [-4.8, 5.0], H = [-3, 0], D = [-4.2, 4.2], T = 0.25;
		const slab = (x1, x2, y1, y2, z1, z2, m = mat.wood) =>
			mesh(new THREE.BoxGeometry(x2 - x1, y2 - y1, z2 - z1), m).translateX((x1 + x2) / 2).translateY((y1 + y2) / 2).translateZ((z1 + z2) / 2);
		scene.add(
			slab(W[0], W[1], H[1] - T, H[1], D[0], D[1]), // top
			slab(W[0], W[1], H[0], H[0] + T, D[0], D[1]), // bottom
			slab(W[0], W[0] + T, H[0], H[1], D[0], D[1]), // left
			slab(W[1] - T, W[1], H[0], H[1], D[0], D[1]), // right
			slab(W[0], W[1], H[0], H[1], D[0], D[0] + T) // back
		);
		for (const x of [W[0] + 0.4, W[1] - 0.4]) scene.add(cylinder(0.3, 0.3, mat.woodDark, x, H[0] - 0.15, -3.6));

		// --- 1. Crank: a handle outside, on a shaft into the case ---
		const across = (r, length, m, x, y) => {
			const c = cylinder(r, length, m, x, y);
			c.rotation.z = Math.PI / 2;
			return c;
		};
		scene.add(across(0.1, 5.1, mat.steel, 2.85, -1.6)); // shaft, from the motor out through the case
		scene.add(slab(5.3, 5.45, -1.6, -0.3, -0.12, 0.12, mat.steel)); // handle arm
		scene.add(across(0.16, 0.8, mat.woodDark, 5.8, -0.45)); // knob
		label('1 · Crank', 6.2, -0.4);

		// --- 2. Spring motor: a coiled spring in a brass drum, turning the spindle ---
		const MX = -1;
		scene.add(cylinder(1.3, 1.2, mat.brass, MX, -1.6));
		const coil = [];
		for (let i = 0; i <= 400; i++) {
			const a = (i / 400) * Math.PI * 2 * 7;
			const r = 0.25 + (i / 400) * 0.9;
			coil.push(new THREE.Vector3(MX + Math.cos(a) * r, -1.6, Math.sin(a) * r));
		}
		for (const dy of [-0.35, 0, 0.35]) {
			const spring = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(coil), 600, 0.035, 6), mat.spring);
			spring.position.y = dy;
			scene.add(spring);
		}
		scene.add(cylinder(0.12, 2.0, mat.steel, MX, -0.6));
		label('2 · Spring motor', MX - 1.3, -1.6, true);

		// --- 3. Record on a felt-covered turntable ---
		scene.add(cylinder(3.4, 0.18, mat.felt, MX, 0.09));
		scene.add(cylinder(3.2, 0.06, mat.record, MX, 0.21));
		scene.add(cylinder(1.0, 0.065, mat.label, MX, 0.215));
		for (let r = 1.3; r < 3.15; r += 0.18) {
			const groove = mesh(new THREE.TorusGeometry(r, 0.012, 4, 96), mat.spring);
			groove.rotation.x = Math.PI / 2;
			groove.position.set(MX, 0.245, 0);
			scene.add(groove);
		}
		label('3 · Record', MX - 2.8, 0.25, true);

		// --- 4–5. Sound box: a round case holding a thin mica diaphragm; the needle hangs below it ---
		const SB = new THREE.Vector3(1.6, 1.45, 0);
		const box = mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.5, 64, 1, true), mat.brass);
		box.rotation.z = Math.PI / 2;
		box.position.copy(SB);
		scene.add(box);
		const back = mesh(new THREE.CircleGeometry(1.0, 64), mat.brass);
		back.rotation.y = Math.PI / 2;
		back.position.set(SB.x + 0.25, SB.y, 0);
		scene.add(back);
		const diaphragm = mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.03, 64), mat.mica);
		diaphragm.rotation.z = Math.PI / 2;
		diaphragm.position.set(SB.x - 0.15, SB.y, 0);
		scene.add(diaphragm);
		// Needle bar: from the middle of the diaphragm down to the groove
		const tip = new THREE.Vector3(1.25, 0.26, 0);
		const barFrom = new THREE.Vector3(SB.x - 0.15, SB.y, 0);
		const bar = mesh(new THREE.CylinderGeometry(0.045, 0.02, barFrom.distanceTo(tip), 12), mat.steel);
		bar.position.copy(barFrom).lerp(tip, 0.5);
		bar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), barFrom.clone().sub(tip).normalize());
		scene.add(bar);
		label('4 · Needle', 1.2, 0.5, true);
		label('5 · Diaphragm', SB.x - 0.15, SB.y + 0.75, true);

		// --- 6–7. Tone arm and horn: one hollow tube that starts narrow and flares out ---
		const path = new THREE.CatmullRomCurve3(
			[
				[1.85, 1.45], [3.0, 1.45], [4.0, 1.5], [4.6, 1.95], [4.85, 2.8],
				[4.6, 4.0], [3.8, 5.4], [2.6, 6.6], [1.2, 7.6]
			].map(([x, y]) => new THREE.Vector3(x, y, 0))
		);
		const ARM = 0.36; // the first part of the tube is the arm, the rest is the horn
		const radius = (t) => (t < ARM ? 0.2 : 0.2 + 2.3 * ((t - ARM) / (1 - ARM)) ** 2.6);
		scene.add(mesh(sweep(THREE, path, radius), mat.brass));
		// The post the arm turns on
		scene.add(cylinder(0.18, 1.85, mat.brass, 4.75, 0.9));
		scene.add(cylinder(0.32, 0.15, mat.brass, 4.75, 0.06));
		label('6 · Tone arm', 3.2, 1.75);
		const mouth = path.getPointAt(1);
		const out = path.getTangentAt(1);
		label('7 · Horn', 4.35, 5.7);

		// --- The sound's path: groove → needle → diaphragm → arm → horn → room ---
		const soundPath = new THREE.CurvePath();
		soundPath.add(new THREE.LineCurve3(tip.clone().setZ(0.05), barFrom.clone().setZ(0.05)));
		soundPath.add(new THREE.LineCurve3(barFrom.clone().setZ(0.05), new THREE.Vector3(1.85, 1.45, 0.05)));
		soundPath.add(new THREE.CatmullRomCurve3(path.getSpacedPoints(60).map((p) => p.clone().setZ(0.05))));
		const dashes = 34;
		for (let i = 0; i < dashes; i++) {
			const sub = new THREE.CatmullRomCurve3(
				[0, 0.5, 1].map((k) => soundPath.getPointAt(Math.min(1, (i + k * 0.55) / dashes)))
			);
			scene.add(mesh(new THREE.TubeGeometry(sub, 4, 0.05, 8), mat.sound));
		}
		// Sound leaving the horn: arcs in the cut plane
		const angle = Math.atan2(out.y, out.x);
		[1.2, 2.1, 3.0].forEach((d, i) => {
			const arc = 1.4;
			const ring = mesh(new THREE.TorusGeometry(2.5 + d, 0.06, 8, 64, arc));
			ring.position.copy(mouth).addScaledVector(out, -2.5);
			ring.rotation.z = angle - arc / 2;
			ring.material = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 1 - i * 0.28 });
			scene.add(ring);
		});

		const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
		camera.position.set(6, 7, 25);
		camera.lookAt(0.4, 3.4, 0);
		return { camera, points };
	}

	// A tube along `curve` whose radius changes along the way: radius(t), t from 0 to 1
	function sweep(THREE, curve, radius, segments = 160, sides = 64) {
		const frames = curve.computeFrenetFrames(segments, false);
		const positions = [];
		const index = [];
		for (let i = 0; i <= segments; i++) {
			const t = i / segments;
			const p = curve.getPointAt(t);
			const r = radius(t);
			const n = frames.normals[i];
			const b = frames.binormals[i];
			for (let j = 0; j <= sides; j++) {
				const a = (j / sides) * Math.PI * 2;
				positions.push(
					p.x + r * (Math.cos(a) * n.x + Math.sin(a) * b.x),
					p.y + r * (Math.cos(a) * n.y + Math.sin(a) * b.y),
					p.z + r * (Math.cos(a) * n.z + Math.sin(a) * b.z)
				);
			}
		}
		for (let i = 0; i < segments; i++)
			for (let j = 0; j < sides; j++) {
				const a = i * (sides + 1) + j;
				const c = a + sides + 1;
				index.push(a, c, a + 1, c, c + 1, a + 1);
			}
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		geometry.setIndex(index);
		geometry.computeVertexNormals();
		return geometry;
	}
</script>

<LabelledStill {build} {height} {labels} alt="A wind-up gramophone cut in half, showing how the sound travels from the record to the horn" />
