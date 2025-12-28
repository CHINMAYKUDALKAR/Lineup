# PrismaService Usage Examples

## 📚 Complete Usage Guide for All Features

---

## 1. Transaction Support

### Basic Transaction
```typescript
// Create candidate and interview atomically
const result = await this.prisma.$transaction(async (tx) => {
  const candidate = await tx.candidate.create({
    data: { tenantId, name, email },
  });
  
  const interview = await tx.interview.create({
    data: {
      tenantId,
      candidateId: candidate.id,
      date: new Date(),
    },
  });
  
  return { candidate, interview };
});
```

### Transaction with Options
```typescript
await this.prisma.$transaction(
  async (tx) => {
    // Your operations
  },
  {
    maxWait: 5000, // Max time to wait for transaction
    timeout: 10000, // Transaction timeout
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  },
);
```

---

## 2. Soft Delete Helpers

### Soft Delete a Record
```typescript
// Soft delete a candidate
await this.prisma.softDelete(
  this.prisma.candidate,
  { id: candidateId },
  { deletedAt: new Date() }, // Optional
);
```

### Restore a Soft-Deleted Record
```typescript
// Restore a candidate
await this.prisma.restore(
  this.prisma.candidate,
  { id: candidateId },
);
```

### Find Active Records (Exclude Deleted)
```typescript
// Get all active candidates
const activeCandidates = await this.prisma.findManyActive(
  this.prisma.candidate,
  {
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  },
);
```

### Find All Records (Including Deleted)
```typescript
// Get all candidates including deleted ones
const allCandidates = await this.prisma.findManyWithDeleted(
  this.prisma.candidate,
  {
    where: { tenantId },
  },
);
```

---

## 3. Tenant Isolation Helpers

### Tenant-Scoped Queries
```typescript
// Automatically filter by tenantId
const candidates = await this.prisma.candidate.findMany({
  ...this.prisma.withTenant(tenantId, false), // false = exclude deleted
  orderBy: { createdAt: 'desc' },
});
```

### Ensure Tenant Access
```typescript
// Verify candidate belongs to tenant before operations
try {
  const candidate = await this.prisma.ensureTenantAccess(
    this.prisma.candidate,
    { id: candidateId },
    tenantId,
  );
  // Safe to use candidate
} catch (error) {
  // Handle access denied or not found
}
```

### Combined Tenant + Soft Delete Query
```typescript
const candidates = await this.prisma.candidate.findMany({
  where: {
    ...this.prisma.withTenant(tenantId, false).where,
    stage: 'APPLIED',
  },
});
```

---

## 4. Connection Health Check

### Health Check Endpoint
```typescript
@Get('health')
async health() {
  const health = await this.prisma.checkHealth();
  return {
    database: health.status,
    latency: health.latency,
    timestamp: new Date(),
  };
}
```

### Connection Info
```typescript
const info = this.prisma.getConnectionInfo();
console.log(info); // { connected: true, engine: 'library' }
```

---

## 5. Retry Logic

### Automatic Retry for Transient Failures
```typescript
// Retry connection errors automatically
const candidates = await this.prisma.withRetry(
  async () => {
    return this.prisma.candidate.findMany({
      where: { tenantId },
    });
  },
  {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
  },
);
```

---

## 6. Batch Operations

### Bulk Create
```typescript
// Create multiple candidates at once
const candidatesData = [
  { tenantId, name: 'John', email: 'john@example.com' },
  { tenantId, name: 'Jane', email: 'jane@example.com' },
  // ... more candidates
];

const result = await this.prisma.bulkCreate(
  this.prisma.candidate,
  candidatesData,
  1000, // batch size
);

console.log(`Created ${result.count} candidates`);
```

### Bulk Update
```typescript
// Update multiple records in transaction
const updatedCount = await this.prisma.bulkUpdate(
  async (tx) => {
    const updates = [];
    for (const candidate of candidates) {
      updates.push(
        tx.candidate.update({
          where: { id: candidate.id },
          data: { stage: 'INTERVIEWED' },
        }),
      );
    }
    return Promise.all(updates);
  },
);
```

---

## 7. Combined Usage Examples

### Complete Service Example
```typescript
@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

  async createCandidate(tenantId: string, data: CreateCandidateDto) {
    // Use transaction for atomic operations
    return this.prisma.$transaction(async (tx) => {
      const candidate = await tx.candidate.create({
        data: {
          ...data,
          tenantId,
        },
      });
      
      // Create audit log
      await tx.auditLog.create({
        data: {
          tenantId,
          action: 'CREATE_CANDIDATE',
          entityId: candidate.id,
        },
      });
      
      return candidate;
    });
  }

  async getCandidates(tenantId: string, page: number, pageSize: number) {
    const { skip, take } = this.prisma.paginate({ page, pageSize });
    
    // Use tenant filter + active records only
    return this.prisma.findManyActive(
      this.prisma.candidate,
      {
        where: this.prisma.withTenant(tenantId, false).where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      },
    );
  }

  async deleteCandidate(tenantId: string, candidateId: string) {
    // Ensure tenant access first
    await this.prisma.ensureTenantAccess(
      this.prisma.candidate,
      { id: candidateId },
      tenantId,
    );
    
    // Soft delete
    return this.prisma.softDelete(
      this.prisma.candidate,
      { id: candidateId },
    );
  }

  async bulkImportCandidates(tenantId: string, candidates: any[]) {
    // Use retry for bulk operations
    return this.prisma.withRetry(
      async () => {
        return this.prisma.bulkCreate(
          this.prisma.candidate,
          candidates.map(c => ({ ...c, tenantId })),
        );
      },
      { maxRetries: 3 },
    );
  }
}
```

---

## 8. Error Handling

### Using Error Handler
```typescript
try {
  const candidate = await this.prisma.candidate.create({ data });
} catch (error) {
  const { message, statusCode } = this.prisma.handlePrismaError(error);
  throw new HttpException(message, statusCode);
}
```

---

## 9. Pagination

### Basic Pagination
```typescript
const { skip, take } = this.prisma.paginate({ page: 1, pageSize: 20 });

const candidates = await this.prisma.candidate.findMany({
  where: { tenantId },
  skip,
  take,
});
```

### Pagination with Count
```typescript
const { skip, take } = this.prisma.paginate({ page: 1, pageSize: 20 });

const [candidates, total] = await Promise.all([
  this.prisma.candidate.findMany({
    where: { tenantId },
    skip,
    take,
  }),
  this.prisma.candidate.count({
    where: { tenantId },
  }),
]);

return {
  data: candidates,
  pagination: {
    page: 1,
    pageSize: 20,
    total,
    totalPages: Math.ceil(total / 20),
  },
};
```

---

## 🎯 Best Practices

1. **Always use tenant isolation** for multi-tenant queries
2. **Use soft deletes** instead of hard deletes
3. **Use transactions** for related operations
4. **Handle errors** with the error handler
5. **Use retry logic** for transient failures
6. **Use batch operations** for bulk inserts/updates
7. **Check health** in health endpoints

