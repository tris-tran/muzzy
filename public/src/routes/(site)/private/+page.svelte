<script>
	import { asset, resolve } from '$app/paths';

	let password = $state('');
	let error = $state('');
	let busy = $state(false);
	let html = $state('');

	const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

	async function unlock(event) {
		event.preventDefault();
		busy = true;
		error = '';
		try {
			const res = await fetch(asset('vault.json'));
			if (!res.ok) throw new Error('No private site has been built yet.');
			const vault = await res.json();

			const keyMaterial = await crypto.subtle.importKey(
				'raw',
				new TextEncoder().encode(password),
				'PBKDF2',
				false,
				['deriveKey']
			);
			const key = await crypto.subtle.deriveKey(
				{ name: 'PBKDF2', salt: fromB64(vault.salt), iterations: vault.iterations, hash: 'SHA-256' },
				keyMaterial,
				{ name: 'AES-GCM', length: 256 },
				false,
				['decrypt']
			);

			let plain;
			try {
				plain = await crypto.subtle.decrypt(
					{ name: 'AES-GCM', iv: fromB64(vault.iv) },
					key,
					fromB64(vault.data)
				);
			} catch {
				throw new Error('Wrong password.');
			}
			html = new TextDecoder().decode(plain);
		} catch (e) {
			error = e.message;
		} finally {
			busy = false;
		}
	}
</script>

{#if html}
	<!-- Pass these permissions through so embeds inside the private site (e.g. YouTube) can use them -->
	<iframe
		title="Private"
		srcdoc={html}
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
		allowfullscreen
	></iframe>
{:else}
	<a class="back" href={resolve('/')}>← Muzzy</a>
	<h1>Private</h1>
	<form onsubmit={unlock}>
		<input type="password" bind:value={password} placeholder="Password" autocomplete="current-password" />
		<button disabled={busy || !password}>{busy ? 'Unlocking…' : 'Unlock'}</button>
	</form>
	{#if error}<p class="error">{error}</p>{/if}
{/if}

<style>
	iframe {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
		background: white;
	}
	.back {
		color: var(--ink-soft);
		text-decoration: none;
	}
	.back:hover {
		color: var(--ink);
	}
	h1 {
		margin: 1.5rem 0 1rem;
	}
	form {
		max-width: 28rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	input,
	button {
		font: inherit;
		padding: 0.6rem 0.9rem;
		border-radius: 10px;
		border: 1px solid var(--line);
		background: var(--card);
		color: var(--ink);
	}
	button {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--on-accent);
		font-weight: 700;
		cursor: pointer;
	}
	button:disabled {
		opacity: 0.5;
		cursor: default;
	}
	input {
		flex: 1 1 12rem;
		min-width: 0;
	}
	button {
		flex: 0 0 auto;
	}
	.error {
		color: #fda4af;
	}
</style>
