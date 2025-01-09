export interface AsyncMap<K, V> {
	/**
	 * Removes all entries from the map.
	 * @returns A promise that resolves when the operation is complete.
	 */
	clear(): Promise<void>;

	/**
	 * Removes the specified key from the map.
	 * @param key The key to delete.
	 * @returns A promise that resolves to a boolean indicating whether the key existed and was deleted.
	 */
	delete(key: K): Promise<boolean>;

	/**
	 * Executes a provided function once for each key-value pair in the map, in insertion order.
	 * @param callbackFn A function that is called for each entry in the map.
	 * @param thisArg Optional. A value to use as `this` when executing the callback.
	 * @returns A promise that resolves when the iteration is complete.
	 */
	forEach(
		callbackFn: (value: V, key: K, map: AsyncMap<K, V>) => void | Promise<void>,
		thisArg?: any,
	): Promise<void>;

	/**
	 * Gets the value associated with the specified key.
	 * @param key The key to retrieve.
	 * @returns A promise that resolves to the value associated with the key, or undefined if the key does not exist.
	 */
	get(key: K): Promise<V | undefined>;

	/**
	 * Checks if the specified key exists in the map.
	 * @param key The key to check.
	 * @returns A promise that resolves to a boolean indicating whether the key exists.
	 */
	has(key: K): Promise<boolean>;

	/**
	 * Sets a key-value pair in the map.
	 * @param key The key to set.
	 * @param value The value to associate with the key.
	 * @returns A promise that resolves to undefined.
	 */
	set(key: K, value: V): Promise<void>;

	/**
	 * Retrieves the number of key-value pairs in the map.
	 * @returns A promise that resolves to the size of the map.
	 */
	size(): Promise<number>;
}
