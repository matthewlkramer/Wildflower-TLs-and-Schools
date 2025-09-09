# Custom Routes Examples

This document shows the different types of custom business logic that exist beyond standard CRUD operations.

## 1. **Relationship Queries** - Get related data by foreign key

These routes fetch data filtered by relationships to other entities:

```typescript
// Get schools for a specific user
app.get("/api/schools/user/:userId", async (req, res) => {
  const schools = await storage.getSchoolsByUserId(userId);
  res.json(schools);
});

// Get locations for a specific school
app.get("/api/locations/school/:schoolId", async (req, res) => {
  const locations = await storage.getLocationsBySchoolId(schoolId);
  res.json(locations);
});

// Get educator associations by educator
app.get("/api/educator-school-associations/educator/:educatorId", async (req, res) => {
  const associations = await storage.getEducatorAssociations(educatorId);
  res.json(associations);
});

// Get governance documents for a school
app.get("/api/governance-documents/school/:schoolId", async (req, res) => {
  const docs = await storage.getGovernanceDocumentsBySchoolId(schoolId);
  res.json(docs);
});

// Get action steps for a user
app.get("/api/action-steps/user/:userId", async (req, res) => {
  const steps = await storage.getActionStepsByUserId(userId);
  res.json(steps);
});
```

## 2. **Complex Operations** - Multi-step business processes

```typescript
// Merge duplicate educators into one primary record
app.post("/api/teachers/merge", async (req, res) => {
  const { primaryId, duplicateIds } = req.body;
  
  // 1. Validate primary educator exists
  const primary = await storage.getEducator(primaryId);
  if (!primary) return res.status(404).json({ message: 'Primary educator not found' });
  
  // 2. Copy missing fields from duplicates to primary
  const fieldsToConsider = ['fullName','firstName','nickname','lastName','currentPrimaryEmailAddress'];
  const updates: any = {};
  for (const field of fieldsToConsider) {
    if (!primary[field]) {
      for (const dupId of duplicateIds) {
        const dup = await storage.getEducator(dupId);
        if (dup?.[field]) {
          updates[field] = dup[field];
          break;
        }
      }
    }
  }
  
  // 3. Update primary if needed
  if (Object.keys(updates).length > 0) {
    await storage.updateEducator(primaryId, updates);
  }
  
  // 4. Archive duplicates
  for (const dupId of duplicateIds) {
    await storage.updateEducator(dupId, { archived: true });
  }
  
  // 5. Clear caches
  cache.invalidate('educators');
  cache.invalidate('teachers');
  
  return res.json({ ok: true, primaryId, archived: duplicateIds });
});

// Make an email address primary for an educator
app.post("/api/email-addresses/:id/make-primary", async (req, res) => {
  const emailId = req.params.id;
  const email = await storage.getEmailAddress(emailId);
  
  // Deactivate all other emails for this educator
  await storage.deactivateOtherEmails(email.educatorId, emailId);
  
  // Make this one primary
  await storage.makeEmailPrimary(emailId);
  
  // Update educator's primary email field
  await storage.updateEducator(email.educatorId, {
    currentPrimaryEmailAddress: email.address
  });
  
  res.json({ success: true });
});
```

## 3. **Loan System with Database** - Complex financial operations

These routes handle loans using PostgreSQL database (not Airtable):

```typescript
// Get loans by school
app.get("/api/loans/school/:schoolId", async (req, res) => {
  const loans = await loanStorage.getLoansBySchoolId(req.params.schoolId);
  res.json(loans);
});

// Approve a loan application
app.post("/api/loan-applications/:id/approve", async (req, res) => {
  const { approvedAmount, approvedRate, approvedTermMonths } = req.body;
  
  // Complex approval logic
  const result = await loanStorage.approveLoanApplication(applicationId, {
    approvedAmount,
    approvedRate,
    approvedTermMonths
  });
  
  // Create loan record
  const loan = await loanStorage.createLoanFromApplication(result);
  
  // Send notifications
  await notificationService.sendLoanApproval(loan);
  
  res.json(loan);
});

// Get origination pipeline report
app.get("/api/loans/origination-pipeline", async (req, res) => {
  const pipeline = await loanStorage.getOriginationPipeline();
  res.json(pipeline);
});
```

## 4. **Stripe Payment Integration** - ACH payments

```typescript
// Set up ACH payment method
app.post("/api/loans/:id/ach-setup", async (req, res) => {
  const { paymentMethodId } = req.body;
  const loan = await loanStorage.getLoanById(loanId);
  
  // Create or retrieve Stripe customer
  let customerId = loan.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      name: loan.borrowerName,
      email: loan.borrowerEmail,
      metadata: { loanId: loan.id, schoolId: loan.schoolId }
    });
    customerId = customer.id;
  }
  
  // Attach payment method to customer
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });
  
  // Create ACH mandate
  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method: paymentMethodId,
    payment_method_types: ['us_bank_account'],
    confirm: true,
  });
  
  // Update loan with Stripe details
  await loanStorage.completeLoanACHSetup(loanId, {
    stripeCustomerId: customerId,
    stripePaymentMethodId: paymentMethodId,
    achMandateActive: true,
  });
  
  res.json({ message: "ACH setup completed successfully" });
});

// Process ACH payment
app.post("/api/loans/:loanId/payments/ach", async (req, res) => {
  const { amount, description } = req.body;
  
  // Create payment intent with Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    customer: loan.stripeCustomerId,
    payment_method: loan.stripePaymentMethodId,
    payment_method_types: ['us_bank_account'],
    confirm: true,
    description: description || `Loan payment for ${loan.loanNumber}`,
    metadata: { loanId, loanNumber, schoolId }
  });
  
  // Record payment in database
  const payment = await loanStorage.createLoanPayment({
    loanId,
    amount,
    paymentDate: new Date().toISOString(),
    paymentMethod: 'ACH',
    stripePaymentIntentId: paymentIntent.id,
    status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
  });
  
  res.json({ payment, stripeStatus: paymentIntent.status });
});
```

## 5. **Dynamic Subtable Routing** - Flexible related data queries

```typescript
// Generic subtable endpoint that routes to specific implementations
app.get("/api/subtable/:tableName", async (req, res) => {
  const tableName = req.params.tableName;
  const queryParams = req.query;
  
  switch (tableName) {
    case "Montessori Certs":
      if (queryParams.educator_id) {
        const certs = await storage.getMontessoriCertificationsByEducatorId(queryParams.educator_id);
        return res.json(certs);
      }
      break;
      
    case "Event Attendance":
      if (queryParams.educator_id) {
        const attendance = await storage.getEventAttendancesByEducatorId(queryParams.educator_id);
        return res.json(attendance);
      }
      break;
      
    case "Public funding":
      if (queryParams.school_id) {
        // Direct Airtable query with filtering
        const records = await base('Public funding').select().all();
        const filtered = records.filter(r => {
          const schools = r.fields.Schools;
          return Array.isArray(schools) && schools.includes(queryParams.school_id);
        });
        return res.json(filtered.map(r => ({ 
          id: r.id, 
          name: r.fields.Name 
        })));
      }
      break;
      
    default:
      return res.status(404).json({ message: `Table '${tableName}' not supported` });
  }
});
```

## 6. **Reporting & Analytics** - Aggregated data

```typescript
// Get quarterly reports
app.get("/api/reports/quarterly/:year/:quarter", async (req, res) => {
  const { year, quarter } = req.params;
  const reports = await loanStorage.getQuarterlyReports(parseInt(year), parseInt(quarter));
  
  // Aggregate data
  const summary = {
    totalLoans: reports.length,
    totalOutstanding: reports.reduce((sum, r) => sum + r.outstandingBalance, 0),
    totalPayments: reports.reduce((sum, r) => sum + r.paymentsReceived, 0),
    delinquencyRate: calculateDelinquencyRate(reports),
  };
  
  res.json({ reports, summary });
});

// Get enrollment trends
app.get("/api/analytics/enrollment-trends", async (req, res) => {
  const trends = await storage.getEnrollmentTrends();
  const analysis = analyzeGrowthPatterns(trends);
  res.json({ trends, analysis });
});

// Get school metrics
app.get("/api/analytics/school-metrics/:schoolId", async (req, res) => {
  const metrics = await storage.getSchoolMetrics(req.params.schoolId);
  const benchmarks = await storage.getNetworkBenchmarks();
  const comparison = compareToNetwork(metrics, benchmarks);
  res.json({ metrics, benchmarks, comparison });
});
```

## 7. **Bulk Operations** - Mass updates

```typescript
// Bulk update schools
app.post("/api/schools/bulk-update", async (req, res) => {
  const { ids, updates } = req.body;
  
  const results = await Promise.all(
    ids.map(id => storage.updateSchool(id, updates))
  );
  
  cache.invalidate('schools');
  res.json({ updated: results.filter(Boolean).length, total: ids.length });
});

// Bulk import educators
app.post("/api/educators/bulk-import", async (req, res) => {
  const { educators } = req.body;
  
  // Validate all records first
  const validated = educators.map(e => educatorSchema.parse(e));
  
  // Import in batches
  const batchSize = 100;
  const results = [];
  for (let i = 0; i < validated.length; i += batchSize) {
    const batch = validated.slice(i, i + batchSize);
    const imported = await storage.bulkCreateEducators(batch);
    results.push(...imported);
  }
  
  cache.invalidate('educators');
  res.json({ imported: results.length, errors: [] });
});
```

## 8. **Cache Management** - Performance optimization

```typescript
// Get cache statistics
app.get("/api/cache/stats", async (req, res) => {
  const stats = cache.getStats();
  res.json({
    entries: stats.size,
    hitRate: stats.hitRate,
    memoryUsage: stats.memoryUsage,
    tables: stats.tableBreakdown
  });
});

// Clear cache selectively
app.post("/api/cache/clear", async (req, res) => {
  const { tables } = req.body;
  
  if (tables && Array.isArray(tables)) {
    tables.forEach(table => cache.invalidate(table));
    res.json({ cleared: tables });
  } else {
    cache.clearAll();
    res.json({ cleared: 'all' });
  }
});
```

## 9. **Metadata & Configuration** - Dynamic schema info

```typescript
// Get field options for dropdowns
app.get("/api/metadata/school-field-options", async (req, res) => {
  const options = {
    status: storage.SCHOOL_STATUS_OPTIONS,
    membershipStatus: storage.MEMBERSHIP_STATUS_OPTIONS,
    governanceModel: storage.GOVERNANCE_MODEL_OPTIONS,
    stageOfDevelopment: storage.STAGE_OPTIONS,
  };
  res.json(options);
});

// Get table metadata
app.get("/api/metadata", async (req, res) => {
  const metadata = await storage.getTableMetadata();
  res.json(metadata);
});
```

## Summary of Custom Logic Categories

1. **Relationship Queries** - Get related data by foreign keys
2. **Complex Operations** - Multi-step business processes (merging, archiving)
3. **External Database** - Loan system using PostgreSQL
4. **Payment Processing** - Stripe ACH integration
5. **Dynamic Routing** - Flexible subtable queries
6. **Analytics & Reporting** - Aggregated data and trends
7. **Bulk Operations** - Mass updates and imports
8. **Cache Management** - Performance optimization
9. **Metadata Endpoints** - Dynamic configuration

These custom routes represent business logic that goes beyond simple CRUD and would remain as custom code even when using auto-generated routes for standard operations.