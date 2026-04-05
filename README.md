# FitHub CRM - Fitness Center Management System

A comprehensive Salesforce-integrated CRM solution for managing fitness centers with membership tracking, class scheduling, trainer assignments, and real-time notifications.

## 🎯 Features

### Core Features
- **Membership Management**: Track member profiles, subscriptions, renewal dates, and expiry alerts
- **Class Scheduling**: Create and manage fitness classes with trainer assignments
- **Trainer Management**: Maintain trainer profiles, specializations, availability, and ratings
- **Dynamic Allocation**: Assign trainers to classes and members based on specialization
- **Notifications**: Send alerts for expiring subscriptions and important events
- **Reporting Tools**: Generate data-driven reports for operational insights

### Technology Stack
- **Backend**: Node.js + Express.js
- **Frontend**: React
- **Database**: MongoDB
- **Salesforce Integration**: JSForce API
- **Authentication**: JWT
- **Styling**: CSS3 with responsive design

## 📁 Project Structure

```
fithub-crm/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Member.js
│   │   │   ├── FitnessClass.js
│   │   │   └── Trainer.js
│   │   ├── controllers/
│   │   │   ├── memberController.js
│   │   │   ├── classController.js
│   │   │   └── trainerController.js
│   │   ├── routes/
│   │   │   ├── memberRoutes.js
│   │   │   ├── classRoutes.js
│   │   │   ├── trainerRoutes.js
│   │   │   └── authRoutes.js
│   │   ├── services/
│   │   │   └── salesforceService.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── MembersPage.jsx
│   │   │   ├── ClassesPage.jsx
│   │   │   ├── TrainersPage.jsx
│   │   │   └── DetailsPages
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MemberList.jsx
│   │   │   ├── MemberForm.jsx
│   │   │   ├── ClassList.jsx
│   │   │   ├── ClassForm.jsx
│   │   │   ├── TrainerList.jsx
│   │   │   └── TrainerForm.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   └── App.jsx
│   ├── public/
│   │   └── index.html
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn
- Salesforce account (for integration)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your configuration**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fithub-crm
   SALESFORCE_CLIENT_ID=your_client_id
   SALESFORCE_CLIENT_SECRET=your_client_secret
   SALESFORCE_USERNAME=your_username
   SALESFORCE_PASSWORD=your_password
   SALESFORCE_SECURITY_TOKEN=your_token
   JWT_SECRET=your_jwt_secret
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   Application runs on `http://localhost:3000`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member
- `GET /api/members/expiring` - Get expiring subscriptions
- `POST /api/members/:id/assign-trainer` - Assign trainer to member
- `POST /api/members/:id/enroll-class` - Enroll member in class

### Classes
- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create new class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class
- `GET /api/classes/available` - Get available classes
- `GET /api/classes/type/:classType` - Get classes by type
- `POST /api/classes/:id/remove-enrollment` - Remove member from class

### Trainers
- `GET /api/trainers` - Get all trainers
- `GET /api/trainers/:id` - Get trainer by ID
- `POST /api/trainers` - Create new trainer
- `PUT /api/trainers/:id` - Update trainer
- `DELETE /api/trainers/:id` - Delete trainer
- `GET /api/trainers/specialization/:specialization` - Get trainers by specialization
- `GET /api/trainers/available` - Get available trainers
- `GET /api/trainers/:id/schedule` - Get trainer schedule
- `POST /api/trainers/:id/assign-class` - Assign class to trainer

## 📊 Data Models

### Member
- First name, Last name, Email, Phone
- Date of birth, Gender
- Status (Active, Inactive, Suspended)
- Membership Type (Basic, Premium, VIP)
- Join date, Renewal date, Expiry date
- Assigned trainer, Enrolled classes
- Emergency contact, Medical conditions
- Address, Notes

### FitnessClass
- Name, Description
- Class type (Yoga, Pilates, CrossFit, etc.)
- Assigned trainer
- Schedule (Day, start time, end time)
- Max capacity, Current enrollment
- Difficulty level (Beginner, Intermediate, Advanced)
- Status (Active, Cancelled, OnHold)
- Enrolled members

### Trainer
- First name, Last name, Email, Phone
- Date of birth
- Specializations (multiple)
- Certifications
- Experience
- Availability (by day of week)
- Status (Active, Inactive, OnLeave)
- Assigned members, Assigned classes
- Rating (1-5 stars)
- Address, Emergency contact

## 🔐 Salesforce Integration

The application integrates with Salesforce using JSForce API to:
- Sync member data to Salesforce
- Sync class schedules
- Sync trainer information
- Bi-directional data synchronization
- Track sync status and timestamps

### Configuration Required
1. Create Salesforce connected app
2. Generate OAuth tokens
3. Add custom fields in Salesforce:
   - `FirstName__c`, `LastName__c`, `Email__c`, `Phone__c`
   - `Status__c`, `MembershipType__c`, `ExpiryDate__c`

## 🎨 Frontend UI

### Pages
1. **Login/Register** - User authentication
2. **Dashboard** - Overview with key metrics
3. **Members** - Manage fitness center members
4. **Classes** - Schedule and manage classes
5. **Trainers** - Manage trainer profiles

### Features
- Responsive design for mobile and desktop
- Real-time search and filtering
- Form validation
- Toast notifications
- Data tables with sorting
- Intuitive UI with icons

## 📝 Usage Examples

### Create a Member
```javascript
POST /api/members
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "membershipType": "Premium",
  "status": "Active"
}
```

### Create a Class
```javascript
POST /api/classes
{
  "name": "Morning Yoga",
  "classType": "Yoga",
  "trainer": "trainer_id",
  "maxCapacity": 30,
  "schedule": {
    "dayOfWeek": "Monday",
    "startTime": "09:00",
    "endTime": "10:00"
  }
}
```

### Assign Trainer to Member
```javascript
POST /api/members/{memberId}/assign-trainer
{
  "trainerId": "trainer_id"
}
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📄 License

MIT License - Feel free to use and modify for your needs.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues or questions, please create an issue in the repository.

## 🎓 Future Enhancements

- Payment processing integration
- Advanced reporting and analytics
- Mobile app (React Native)
- Email notification system
- SMS alerts
- Performance tracking
- Social features
- Video tutorials
- AI-powered trainer recommendations

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**Status**: Production Ready
