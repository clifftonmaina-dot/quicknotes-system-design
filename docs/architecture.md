4. App Server writes new note record into Primary Database.
5. App Server invalidates user's cached notes entry in Redis.
6. App Server publishes a NOTE_CREATED task to Message Queue for background search indexing.
7. App Server returns 201 Created with new note object to client.

---

## Trade-offs & Fault Tolerance

### Trade-offs
1. Asynchronous Replication (Eventual Consistency vs Read Latency): Using Read Replicas handles high read loads easily, but brief replication lag (< 100ms) means a newly created note might take a fraction of a second to show on a separate device.
2. In-Memory Caching vs Complexity: Redis speeds up reads dramatically, but requires careful cache invalidation logic on note updates.

### Avoiding Single Points of Failure (SPOFs)
* Multiple App Servers: Running multiple stateless server instances behind the Load Balancer ensures that if one server fails, health checks automatically redirect traffic to healthy instances.
* Multi-AZ Database Failover: If the Primary DB crashes, automated failover instantly promotes the Read Replica to become the new Primary DB.