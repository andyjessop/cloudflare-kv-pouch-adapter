# Cloudflare KV PouchDB Adapter

This package provides a PouchDB adapter for Cloudflare's Key-Value (KV) storage. It allows you to use Cloudflare KV as a backend for PouchDB, enabling you to store and retrieve data in a distributed, low-latency key-value store.

## Usage

Below is an example of how to integrate the Cloudflare KV PouchDB adapter into a middleware-based application. This example demonstrates setting up PouchDB with the Cloudflare KV adapter and handling database requests.

### Middleware Setup

The following middleware sets up PouchDB with the Cloudflare KV adapter for a specific database. It attaches the PouchDB instance to the context (`c`) for use in subsequent handlers.

```typescript
app.use("/:db/*", async (c, next) => {
    // Extract the database name from the request parameters
    const { db } = c.req.param();
    logger.info(`Setting up PouchDB for database: ${db}`);

    // Retrieve the Cloudflare KV namespace from the environment
    const kv = c.env.STORAGE;

    // Register the Cloudflare KV adapter with PouchDB
    // @ts-ignore - PouchDB does not have types for the adapter method
    PouchDB.adapter("kv", createKvPouch(new CloudflareKVMap(kv)), true);

    // Create a new PouchDB instance using the Cloudflare KV adapter
    const kvDb = new PouchDB(db, { adapter: "kv" });

    // Attach the PouchDB instance to the context for use in subsequent handlers
    c.set("db", kvDb);
    logger.info("PouchDB setup complete, continuing to next middleware.");
    await next();
});
```

### Handling Database Requests

The following handler retrieves information about the specified database. It uses the PouchDB instance attached to the context by the middleware.

```typescript
app.get("/:db", async (c) => {
    // Extract the database name from the request parameters
    const { db: dbParam } = c.req.param();
    logger.info(`Received GET request for database info: ${dbParam}`);

    // Retrieve the PouchDB instance from the context
    const db = c.get("db");
    logger.info(`Database instance: ${db}`);

    try {
        // Fetch and return database information
        const info = await db.info();
        logger.success(`Database info retrieved for: ${dbParam}`);
        return c.json(info, 200);
    } catch (err) {
        // Handle errors (e.g., database does not exist)
        logger.error(`Error retrieving info for database ${dbParam}:`, err);
        return c.json(
            { error: "not_found", reason: "Database does not exist" },
            404,
        );
    }
});
```

### Explanation

1. **Middleware**:
   - The middleware extracts the database name from the request parameters.
   - It initializes the Cloudflare KV adapter and registers it with PouchDB.
   - A new PouchDB instance is created using the specified database name and the Cloudflare KV adapter.
   - The PouchDB instance is attached to the context for use in subsequent handlers.

2. **Handler**:
   - The handler retrieves the database name and the PouchDB instance from the context.
   - It fetches and returns information about the database using the `db.info()` method.
   - Errors (e.g., database not found) are caught and handled gracefully.

### Notes

- Replace `c.env.STORAGE` with your actual Cloudflare KV namespace.
- Ensure the `logger` is properly configured for logging purposes.
- This example assumes the use of a middleware-based framework (e.g., Hono, Express, etc.). Adjust the code as needed for your specific framework.

For more advanced usage, refer to the [PouchDB documentation](https://pouchdb.com/) and the [Cloudflare Workers KV documentation](https://developers.cloudflare.com/workers/runtime-apis/kv/).

### API

The `kv-pouch` adapter provides the following methods:

- **`createKvPouch(stub: AsyncMap<string, string>)`**: Creates a new PouchDB adapter that uses the provided `AsyncMap` instance as the backend.

### CloudflareKVMap

The `CloudflareKVMap` class implements the `AsyncMap` interface and provides the following methods:

- **`clear(): Promise<void>`**: Removes all entries from the map.
- **`delete(key: K): Promise<boolean>`**: Removes the specified key from the map.
- **`forEach(callbackFn: (value: V, key: K, map: AsyncMap<K, V>) => void | Promise<void>, thisArg?: any): Promise<void>`**: Executes a provided function once for each key-value pair in the map.
- **`get(key: K): Promise<V | undefined>`**: Gets the value associated with the specified key.
- **`has(key: K): Promise<boolean>`**: Checks if the specified key exists in the map.
- **`set(key: K, value: V): Promise<void>`**: Sets a key-value pair in the map.
- **`size(): Promise<number>`**: Retrieves the number of key-value pairs in the map.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/your-repo/kv-pouch).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
