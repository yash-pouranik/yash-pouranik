const devlogData = [
    {
        date: "2026-01-16",
        title: "Dashboard Query Optimization: Hydration & Projections",
        context: "The User Dashboard loads all projects owned by the currently logged-in user. This is a high-frequency read endpoint where the UI only requires the project name and description, not the full dataset.",
        problem: "The original implementation fetched the entire `Project` document (≈15 fields) and performed full Mongoose document hydration. This resulted in excessive data transfer for unused fields, high CPU overhead due to Mongoose wrapping every result in a document instance, and slow execution on the 'hot path' for the dashboard.",
        analysis: "Profiling revealed that the bottleneck wasn't just the database lookup, but the application-level data processing (hydration). Additionally, without a specific index, the query relied on less efficient collection scans.",
        solution: `// New Implementation
const projects = await Project.find({ owner: req.user._id })
    .select('name description')
    .lean();

// Database Index
projectSchema.index({ owner: 1 });`,
        whyWorks: "1. .select(): Reduces network payload and deserialization limits.\n2. .lean(): Returns plain JavaScript objects instead of Mongoose Documents, skipping the expensive hydration logic entirely.\n3. Indexing: Changes the lookup time complexity from O(N) to O(log N).",
        result: "Significantly faster dashboard load times. Reduced memory pressure on the backend Node.js process. Cleaner API response payload.",
        keyLearning: "For read-heavy, display-only endpoints, always use `.lean()`. The overhead of an Active Record pattern (Mongoose Documents) is unnecessary when no mutation is performed."
    },
    {
        date: "2026-01-16",
        title: "High-Throughput Request Authentication via Redis",
        context: "The API verification middleware executes on every single incoming request to validate the API key and check the project owner's status. It effectively acts as a gatekeeper for the entire system.",
        problem: "The middleware was querying MongoDB for every request. This caused redundant load (identical API keys triggered identical database reads), increased latency (auth checks added a fixed latency floor to every endpoint), and poor scalability (database CPU usage scaled linearly with request count).",
        analysis: "Since API keys and project status change infrequently, this data is an ideal candidate for caching. The system needed a 'look-aside' pattern to protect the primary database.",
        solution: `// Strategy: Check Cache -> Hit? Return. -> Miss? Query DB, Cache, Return.
// Key: project:apikey:{hashedApiKey}
// TTL: 2 hours`,
        whyWorks: "Reduces the authentication step from a disk-based database operation (potentially slow) to an in-memory key-value lookup (sub-millisecond).",
        result: "Authentication latency dropped to near-zero (Redis response). Drastic reduction in MongoDB query volume. Decoupled API throughput from database read capacity.",
        keyLearning: "Middleware is the highest-leverage place for caching. Optimizing code that runs once per request pays significantly higher dividends than optimizing specific endpoints."
    },
    {
        date: "2026-01-17",
        title: "Handling Mutations with Cached RContext Objects",
        context: "After implementing Redis for authentication, the `req.project` object injected into controllers was now a plain JavaScript object (from Redis) rather than a Mongoose Document (from MongoDB).",
        problem: "Write operations in controllers (e.g., updating `databaseUsed`) began failing with `project.save is not a function`. The caching layer broke the Active Record pattern: cached data cannot save itself because it lacks the database connection and model methods.",
        analysis: "We faced a choice: Rehydrate the object (expensive, defeats the purpose of caching) or switch to atomic updates (safe, efficient).",
        solution: `// New (Safe & Atomic)
await Project.updateOne(
    { _id: project._id },
    { $inc: { databaseUsed: docSize } }
);`,
        whyWorks: "Type Agnostic: Works whether `project` is a Mongoose Document or a plain object.\nConcurrency: `$inc` is atomic within MongoDB, preventing race conditions.\nPerformance: Executes a single write command without requiring a preceding read.",
        result: "Resolved runtime errors. Improved data integrity via atomic increments. Maintained the performance benefits of the Redis cache.",
        keyLearning: "Treat cached data as strictly read-only. Mutating state should always be done via explicit, atomic database commands rather than relying on object-level methods."
    },
    {
        date: "2026-01-26",
        title: "Latency Optimization via Geographic Infrastructure Alignment",
        context: "Despite code and query optimizations, the system exhibited inconsistent and high baseline latency (approx. 100ms floor).",
        problem: "Profiling isolated the latency to network transit time. Backend was in Singapore, Database (Atlas) in Frankfurt. Every single database query incurred an intercontinental round-trip penalty.",
        analysis: "Moving the database is operationally expensive (data migration). Moving the stateless backend service is cheap. The goal was to minimize the physical distance between compute and storage.",
        solution: "Redeployed the Backend Server to the Frankfurt region to coexist with the MongoDB Atlas cluster and the Redis instance.",
        whyWorks: "Drastically shortens the network path for database connection pooling and query execution. Application-to-Data latency is the dominant factor in backend performance for data-intensive apps.",
        result: "MongoDB query latency reduced by ~100ms. Redis response times improved to 1-2ms. Immediate, system-wide performance improvement without a code change.",
        keyLearning: "Geography is a primitive of system design. Before optimizing O(N) algorithms, ensure your compute is physically adjacent to your data."
    }
];

export default devlogData;
