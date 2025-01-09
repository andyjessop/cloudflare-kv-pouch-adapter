import { AbstractLevelDOWN } from "abstract-leveldown";
import { AsyncMap } from "async-map/src/types";

type Callback<T = void> = (error?: Error | null, result?: T) => void;

export class AsyncMapLevel extends AbstractLevelDOWN<string, string> {
	#storage: AsyncMap<string, string>;

	constructor(storage: AsyncMap<string, string>, location?: string) {
		super(typeof location === "string" ? location : "");

		this.#storage = storage;
	}

	protected _serializeKey(key: string | Buffer): string {
		// If you want pure pass-through, treat Buffers as UTF-8 or otherwise
		// handle them. For plain strings, simply return the string itself.
		return key.toString();
	}

	protected _serializeValue(value: string | Buffer): string {
		return value.toString();
	}

	_info(callback: Callback<any>): void {
		Promise.resolve().then(() => callback(null, { type: "async-map" }));
	}

	_open(_: any, callback: Callback<this>): void {
		Promise.resolve().then(() => callback(null, this));
	}

	_put(key: string, value: string, _: any, callback: Callback): void {
		this.#storage.set(key, value).then(() => callback());
	}

	_get(key: string, _: any, callback: Callback<string | Buffer>): void {
		this.#storage.get(key).then((value) => {
			if (value === undefined) {
				callback(new Error("NotFound"));
			} else {
				callback(null, value);
			}
		});
	}

	_del(key: string, _: any, callback: Callback): void {
		this.#storage.delete(key).then(() => callback());
	}

	_batch(
		array: Array<{ key: string; value?: string; type: "put" | "del" }>,
		_: any,
		callback: Callback,
	): void {
		const promises = [];
		for (const operation of array) {
			if (!operation) continue;
			const { key, value, type } = operation;
			if (type === "put" && value !== undefined) {
				promises.push(this.#storage.set(key, value));
			} else if (type === "del") {
				promises.push(this.#storage.delete(key));
			}
		}
		Promise.all(promises).then(() => callback());
	}

	static destroy(_: string, callback: Callback): void {
		Promise.resolve().then(() => callback());
	}
}
