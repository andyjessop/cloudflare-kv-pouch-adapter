import type { AsyncMap } from "async-map/src/types.ts";

export class KVLevel<Env = unknown> implements AsyncMap<string, unknown> {
	kvNamespace: KVNamespace;
	env: Env;

	constructor(kvNamespace: KVNamespace, env: Env) {
		this.kvNamespace = kvNamespace;
		this.env = env;
	}

	/**
	 * Removes all entries from the map.
	 */
	async clear(): Promise<void> {
		const keys = await this.kvNamespace.list();
		for (const { name } of keys.keys) {
			await this.kvNamespace.delete(name);
		}
		return;
	}

	/**
	 * Removes the specified key from the map.
	 * @param key The key to delete.
	 * @returns A promise that resolves to a boolean indicating whether the key existed and was deleted.
	 */
	async delete(key: string): Promise<boolean> {
		const exists = await this.has(key);
		if (exists) {
			await this.kvNamespace.delete(key);
		}
		return exists;
	}

	/**
	 * Executes a provided function once for each key-value pair in the map, in insertion order.
	 * @param callbackfn A function that is called for each entry in the map.
	 * @param thisArg Optional. A value to use as `this` when executing the callback.
	 */
	async forEach(
		callbackfn: (
			value: unknown,
			key: string,
			map: AsyncMap<string, unknown>,
		) => void | Promise<void>,
		thisArg?: any,
	): Promise<void> {
		const entries = await this.kvNamespace.list();
		for (const { name: key } of entries.keys) {
			const value = await this.kvNamespace.get(key);
			await callbackfn.call(thisArg, value, key, this);
		}
	}

	/**
	 * Gets the value associated with the specified key.
	 * @param key The key to retrieve.
	 * @returns A promise that resolves to the value associated with the key, or undefined if the key does not exist.
	 */
	async get(key: string): Promise<unknown> {
		return this.kvNamespace.get(key);
	}

	/**
	 * Checks if the specified key exists in the map.
	 * @param key The key to check.
	 * @returns A promise that resolves to a boolean indicating whether the key exists.
	 */
	async has(key: string): Promise<boolean> {
		const value = await this.kvNamespace.get(key);
		return value !== null;
	}

	/**
	 * Sets a key-value pair in the map.
	 * @param key The key to set.
	 * @param value The value to associate with the key.
	 * @returns A promise that resolves to the instance of the map.
	 */
	async set(key: string, value: string): Promise<void> {
		await this.kvNamespace.put(key, value);
		return;
	}

	/**
	 * Retrieves the number of key-value pairs in the map.
	 * @returns A promise that resolves to the size of the map.
	 */
	async size(): Promise<number> {
		const entries = await this.kvNamespace.list();
		return entries.keys.length;
	}
}
