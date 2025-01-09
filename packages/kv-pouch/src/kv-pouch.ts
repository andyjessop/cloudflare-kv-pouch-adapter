import type { AsyncMap } from "async-map/src/types.ts";
import CoreLevelPouch from "pouchdb-adapter-leveldb-core";
import { AsyncMapLevel } from "./AsyncMapLevel.ts";

export function createKvPouch(stub: AsyncMap<string, string>) {
	KVPouch.valid = () => true;
	KVPouch.use_prefix = false;

	function KVPouch(opts: any, callback: any) {
		const _opts = Object.assign(
			{
				db: (location: string) => {
					return new AsyncMapLevel(stub, location);
				},
			},
			opts,
		);

		// @ts-ignore
		CoreLevelPouch.call(this, _opts, callback);
	}

	return KVPouch;
}
