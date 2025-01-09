import type { AsyncMap } from "async-map/src/types";

export class CloudflareKVMap<K, V> implements AsyncMap<K, V> {
	private kvNamespace: KVNamespace;

	constructor(kvNamespace: KVNamespace) {
		this.kvNamespace = kvNamespace;
	}

	async clear(): Promise<void> {
		const keys = await this.kvNamespace.list();
		for (const key of keys.keys) {
			await this.kvNamespace.delete(key.name);
		}
	}

	async delete(key: K): Promise<boolean> {
		const keyString = String(key); // Ensure the key is a string (Cloudflare KV requires string keys)
		const value = await this.kvNamespace.get(keyString);
		if (value === null) {
			return false; // Key doesn't exist
		}
		await this.kvNamespace.delete(keyString);
		return true;
	}

	async forEach(
		callbackFn: (value: V, key: K, map: AsyncMap<K, V>) => void | Promise<void>,
		thisArg?: any,
	): Promise<void> {
		const keys = await this.kvNamespace.list();
		for (const key of keys.keys) {
			const value = await this.kvNamespace.get(key.name);
			if (value !== null) {
				await callbackFn.call(thisArg, value as V, key.name as K, this);
			}
		}
	}

	async get(key: K): Promise<V | undefined> {
		const keyString = String(key); // Ensure the key is a string
		const value = await this.kvNamespace.get(keyString);
		return value ? (value as V) : undefined;
	}

	async has(key: K): Promise<boolean> {
		const keyString = String(key); // Ensure the key is a string
		const value = await this.kvNamespace.get(keyString);
		return value !== null;
	}

	async set(key: K, value: V): Promise<void> {
		const keyString = String(key); // Ensure the key is a string
		// @ts-ignore
		await this.kvNamespace.put(keyString, value);
	}

	async size(): Promise<number> {
		const keys = await this.kvNamespace.list();
		return keys.keys.length;
	}
}
