# FitHub CRM - Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Frontend (Port 3000)                          │   │
│  │  - Dashboard, Members, Classes, Trainers Pages       │   │
│  │  - Forms & Lists with Search/Filter                  │   │
│  │  - JWT Authentication & Token Management              │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express.js Backend (Port 5000)                      │   │
│  │  ┌────────────────┐  ┌───────────────┐  ┌────────┐ │   │
│  │  │ Routes         │  │ Controllers   │  │Models  │ │   │
│  │  │ - Auth         │  │ - Member      │  │- Member│ │   │
│  │  │ - Members      │  │ - Class       │  │- Class │ │   │
│  │  │ - Classes      │  │ - Trainer     │  │-Trainer│ │   │
│  │  │ - Trainers     │  │               │  │        │ │   │
│  │  └────────────────┘  └───────────────┘  └────────┘ │   │
│  │  ┌────────────────┐  ┌───────────────┐             │   │
│  │  │ Middleware     │  │ Services      │             │   │
│  │  │ - Auth         │  │ - Salesforce  │             │   │
│  │  │ - Error        │  │ - Validation  │             │   │
│  │  └────────────────┘  └───────────────┘             │   │
│  └──────────────────────────────────────────────────────┘   │
└──────┬────────────────────────────────────┬──────────────────┘
       │                                    │
       ▼                                    ▼
┌─────────────────────┐          ┌──────────────────────┐
│   DATABASE LAYER    │          │ SALESFORCE INTEGRATION│
│  ┌───────────────┐  │          │  ┌────────────────┐  │
│  │   MongoDB     │  │          │  │ JSForce API    │  │
│  │  Collections: │  │          │  │ - Sync Members │  │
│  │  - members    │  │          │  │ - Sync Classes │  │
│  │  - classes    │  │          │  │ - Sync Trainers│  │
│  │  - trainers   │  │          │  │ - Bi-directional   │
│  │               │  │          │  └────────────────┘  │
│  │  Indexes:     │  │          │                      │
│  │  - email      │  │          │  ┌────────────────┐  │
│  │  - status     │  │          │  │ Salesforce Org │  │
│  │  - trainer    │  │          │  │ - Custom Objects   │
│  │               │  │          │  │ - Custom Fields    │
│  └───────────────┘  │          │  └────────────────┘  │
└─────────────────────┘          └──────────────────────┘
```

## Data Flow

### User Registration & Login
```
User → Frontend → POST /api/auth/register → Backend → MongoDB → JWT Token → Frontend
```

### Member Creation & Salesforce Sync
```
Admin → Create Member Form → POST /api/members → Backend → MongoDB
                                                      ↓
                                          SalesforceService
                                                      ↓
                                            Salesforce Org
```

### Class Enrollment
```
Member → Select Class → POST /api/members/:id/enroll-class → Backend
                                                              ↓
                                         Update Member & Class in MongoDB
                                         Update Enrollment Count
                                         Trigger Notification (future)
```

## Component Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                      React Components                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  App.jsx (Main Router)                                       │
│      ├── LoginPage (Auth)                                    │
│      ├── DashboardPage                                       │
│      ├── MembersPage                                         │
│      │   ├── MemberList (Displays members)                   │
│      │   ├── MemberForm (Add/Edit member)                    │
│      │   └── MemberDetailsPage                               │
│      ├── ClassesPage                                         │
│      │   ├── ClassList (Displays classes)                    │
│      │   ├── ClassForm (Add/Edit class)                      │
│      │   └── ClassDetailsPage                                │
│      ├── TrainersPage                                        │
│      │   ├── TrainerList (Displays trainers)                 │
│      │   ├── TrainerForm (Add/Edit trainer)                  │
│      │   └── TrainerDetailsPage                              │
│      └── Navbar (Navigation & Logout)                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Members Collection
```javascript
{
  _id: ObjectId,
  salesforceId: String (unique),
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  dateOfBirth: Date,
  status: String (Active, Inactive, Suspended),
  membershipType: String (Basic, Premium, VIP),
  joinDate: Date,
  renewalDate: Date,
  expiryDate: Date,
  assignedTrainer: ObjectId (ref: Trainer),
  enrolledClasses: [ObjectId] (ref: FitnessClass),
  emergencyContact: { name, phone, relation },
  medicalConditions: [String],
  address: { street, city, state, zipCode, country },
  notes: String,
  syncedToSalesforce: Boolean,
  lastSyncDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### FitnessClasses Collection
```javascript
{
  _id: ObjectId,
  salesforceId: String (unique),
  name: String,
  description: String,
  classType: String (Yoga, Pilates, CrossFit, etc.),
  trainer: ObjectId (ref: Trainer),
  schedule: {
    dayOfWeek: String,
    startTime: String (HH:mm),
    endTime: String (HH:mm)
  },
  maxCapacity: Number,
  currentEnrollment: Number,
  enrolledMembers: [ObjectId] (ref: Member),
  location: { room, floor },
  difficultyLevel: String (Beginner, Intermediate, Advanced),
  status: String (Active, Cancelled, OnHold),
  notes: String,
  syncedToSalesforce: Boolean,
  lastSyncDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Trainers Collection
```javascript
{
  _id: ObjectId,
  salesforceId: String (unique),
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  dateOfBirth: Date,
  specializations: [String],
  certifications: [{
    name: String,
    certifyingBody: String,
    expiryDate: Date
  }],
  experience: { years, description },
  availability: {
    Monday: [{ startTime, endTime }],
    Tuesday: [{ startTime, endTime }],
    // ... other days
  },
  status: String (Active, Inactive, OnLeave),
  assignedMembers: [ObjectId] (ref: Member),
  classesAssigned: [ObjectId] (ref: FitnessClass),
  rating: { average: Number, totalReviews: Number },
  address: { street, city, state, zipCode, country },
  emergencyContact: { name, phone, relation },
  notes: String,
  syncedToSalesforce: Boolean,
  lastSyncDate: Date,
  joinDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* object or array */ },
  "count": 10
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ /* optional */ ]
}
```

## Authentication Flow

```
1. User registers → Hash password → Store in DB
2. User logs in → Verify credentials
3. Generate JWT token
4. Client stores token in localStorage
5. API requests include token in Authorization header
6. Backend validates token
7. Access granted/denied based on token validity
```

## Scalability Considerations

1. **Database Indexing**: Indexes on frequently queried fields
2. **Connection Pooling**: MongoDB connection pool management
3. **API Rate Limiting**: Implement rate limiting (future)
4. **Caching**: Redis caching layer (future)
5. **Pagination**: Implement pagination for large datasets (future)
6. **Microservices**: Separate services for notifications, payments (future)

## Security Features

1. JWT Authentication
2. Password hashing (bcryptjs)
3. Input validation (express-validator)
4. CORS protection
5. Error handling & logging
6. Environment variables for sensitive data

## Performance Optimizations

1. Database indexes on hot paths
2. Lean queries (select specific fields)
3. Eager loading with populate
4. Request caching
5. API response compression

## Future Enhancements

1. Payment Processing (Stripe/Razorpay)
2. Email Notifications (Nodemailer)
3. SMS Alerts (Twilio)
4. Advanced Analytics & Reports
5. Real-time Updates (WebSockets)
6. Machine Learning Recommendations
7. Mobile App (React Native)
8. Admin Dashboard with Advanced Features

---

**Created**: April 2026
**Version**: 1.0.0
