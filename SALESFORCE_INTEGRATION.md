# Salesforce Integration Guide

## Overview

FitHub CRM integrates with Salesforce using the JSForce API to provide bi-directional synchronization of:
- Member data
- Fitness classes
- Trainer information

## Prerequisites

1. Salesforce account (Developer or Production)
2. Connected App in Salesforce
3. OAuth credentials

## Step 1: Create Custom Objects in Salesforce

### Member Object
```
API Name: Member__c
Fields:
- FirstName__c (Text)
- LastName__c (Text)
- Email__c (Email)
- Phone__c (Phone)
- Status__c (Picklist: Active, Inactive, Suspended)
- MembershipType__c (Picklist: Basic, Premium, VIP)
- JoinDate__c (Date)
- ExpiryDate__c (Date)
- RenewalDate__c (Date)
```

### FitnessClass Object
```
API Name: FitnessClass__c
Fields:
- Name (Text)
- ClassType__c (Picklist: Yoga, Pilates, CrossFit, HIIT, Spinning, Zumba, Strength, Cardio, Flexibility)
- Trainer__c (Lookup to Trainer__c)
- MaxCapacity__c (Number)
- CurrentEnrollment__c (Number)
- Status__c (Picklist: Active, Cancelled, OnHold)
- DifficultyLevel__c (Picklist: Beginner, Intermediate, Advanced)
- ScheduleDay__c (Picklist: Monday - Sunday)
- StartTime__c (Time)
- EndTime__c (Time)
```

### Trainer Object
```
API Name: Trainer__c
Fields:
- FirstName__c (Text)
- LastName__c (Text)
- Email__c (Email)
- Phone__c (Phone)
- Specializations__c (Text - semicolon separated)
- Status__c (Picklist: Active, Inactive, OnLeave)
- Rating__c (Number)
- ExperienceYears__c (Number)
```

## Step 2: Create Connected App

1. Go to Setup → Apps → App Manager
2. Click "New Connected App"
3. Fill in details:
   - **Connected App Name**: FitHub CRM
   - **API Name**: FitHub_CRM
   - **Contact Email**: your@email.com
4. Enable OAuth:
   - **Enable OAuth Settings**
   - **Callback URL**: http://localhost:3000/oauth/callback
   - **Selected OAuth Scopes**:
     - Access and manage your data (api)
     - Perform requests on your behalf at any time (refresh_token, offline_access)
5. Save

## Step 3: Get Credentials

1. Click on the Connected App
2. Click "Manage"
3. Click "Edit Policies"
4. Set **IP Relaxation**: Relaxed IP restrictions (for development)
5. Copy **Consumer Key** and **Consumer Secret**

## Step 4: Generate Security Token

1. Click Profile Icon → Settings
2. Security → Reset Security Token
3. Security token sent to email

## Step 5: Configure Backend

1. Update `.env` file:
```env
SALESFORCE_CLIENT_ID=your_consumer_key
SALESFORCE_CLIENT_SECRET=your_consumer_secret
SALESFORCE_USERNAME=your_salesforce_email
SALESFORCE_PASSWORD=your_salesforce_password
SALESFORCE_SECURITY_TOKEN=your_security_token
SALESFORCE_LOGIN_URL=https://login.salesforce.com
```

2. Restart backend server

## Step 6: Test Connection

Call this endpoint to verify:
```bash
curl -X POST http://localhost:5000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Member",
    "email": "test@example.com",
    "phone": "555-1234"
  }'
```

Check Salesforce Member__c object for the synced record.

## API Implementation

### Sync Member to Salesforce

**Request**:
```javascript
POST /api/members
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "status": "Active",
  "membershipType": "Premium",
  "expiryDate": "2025-12-31"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Member created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "salesforceId": "a001X00000IRFmaQAH",
    "firstName": "John",
    "syncedToSalesforce": true,
    "lastSyncDate": "2026-04-05T10:30:00Z"
  }
}
```

## Sync Status Tracking

Each record includes:
- `salesforceId`: ID from Salesforce
- `syncedToSalesforce`: Boolean indicating sync status
- `lastSyncDate`: Timestamp of last sync

## Error Handling

If sync fails:
1. Record is saved locally in MongoDB
2. Error is logged
3. Manual sync can be triggered later
4. Admin notified of sync failure

## Manual Data Sync

To sync existing MongoDB records to Salesforce:

```javascript
// In future, implement:
POST /api/sync/members
POST /api/sync/classes
POST /api/sync/trainers
```

## Troubleshooting

### Connection Failed
- Verify OAuth credentials in .env
- Check IP address is not restricted
- Ensure security token is correct

### Sync Failed
- Check field names in Salesforce match API names
- Verify custom objects exist
- Check data type compatibility
- Review logs in MongoDB

### Missing Records
- Check `syncedToSalesforce` flag
- Review `lastSyncDate` for timing
- Check network connectivity

## Security Best Practices

1. Never commit .env with credentials
2. Use IP restrictions in production
3. Rotate security tokens periodically
4. Use OAuth with refresh tokens
5. Enable MFA on Salesforce account
6. Audit sync logs regularly
7. Encrypt sensitive data

## Monitoring

Monitor sync health:
```javascript
// Future endpoints
GET /api/sync/status
GET /api/sync/logs
GET /api/sync/errors
```

## Limitations

Current limitations to address:
1. One-way sync (can be made two-way)
2. Manual triggering (can be scheduled)
3. No conflict resolution (can implement)
4. No roll-back capability (can add)

## Resources

- [JSForce Documentation](https://jsforce.github.io/)
- [Salesforce REST API](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/)
- [Connected Apps Documentation](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth.htm)

---

**Version**: 1.0.0
**Last Updated**: April 2026
