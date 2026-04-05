const jsforce = require('jsforce');

class SalesforceService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.connection = new jsforce.Connection({
        oauth2: {
          clientId: process.env.SALESFORCE_CLIENT_ID,
          clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
          redirectUri: process.env.SALESFORCE_REDIRECT_URI || 'http://localhost:3000/oauth/callback'
        },
        instanceUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'
      });

      await this.connection.login(
        process.env.SALESFORCE_USERNAME,
        process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN
      );

      this.isConnected = true;
      console.log('✓ Connected to Salesforce');
      return true;
    } catch (error) {
      console.error('✗ Failed to connect to Salesforce:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  async syncMemberToSalesforce(memberData) {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const sfData = {
        FirstName__c: memberData.firstName,
        LastName__c: memberData.lastName,
        Email__c: memberData.email,
        Phone__c: memberData.phone,
        Status__c: memberData.status,
        MembershipType__c: memberData.membershipType,
        JoinDate__c: memberData.joinDate,
        ExpiryDate__c: memberData.expiryDate
      };

      if (memberData.salesforceId) {
        // Update existing record
        await this.connection.sobject('Member__c').update({
          Id: memberData.salesforceId,
          ...sfData
        });
      } else {
        // Create new record
        const result = await this.connection.sobject('Member__c').create(sfData);
        return result;
      }
    } catch (error) {
      console.error('Error syncing member to Salesforce:', error.message);
      throw error;
    }
  }

  async syncClassToSalesforce(classData) {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const sfData = {
        Name: classData.name,
        ClassType__c: classData.classType,
        Trainer__c: classData.trainer,
        MaxCapacity__c: classData.maxCapacity,
        CurrentEnrollment__c: classData.currentEnrollment,
        Status__c: classData.status
      };

      if (classData.salesforceId) {
        await this.connection.sobject('FitnessClass__c').update({
          Id: classData.salesforceId,
          ...sfData
        });
      } else {
        const result = await this.connection.sobject('FitnessClass__c').create(sfData);
        return result;
      }
    } catch (error) {
      console.error('Error syncing class to Salesforce:', error.message);
      throw error;
    }
  }

  async syncTrainerToSalesforce(trainerData) {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const sfData = {
        FirstName__c: trainerData.firstName,
        LastName__c: trainerData.lastName,
        Email__c: trainerData.email,
        Phone__c: trainerData.phone,
        Specializations__c: trainerData.specializations?.join(';'),
        Status__c: trainerData.status,
        Rating__c: trainerData.rating?.average
      };

      if (trainerData.salesforceId) {
        await this.connection.sobject('Trainer__c').update({
          Id: trainerData.salesforceId,
          ...sfData
        });
      } else {
        const result = await this.connection.sobject('Trainer__c').create(sfData);
        return result;
      }
    } catch (error) {
      console.error('Error syncing trainer to Salesforce:', error.message);
      throw error;
    }
  }

  async getMembersFromSalesforce() {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      const records = await this.connection.query("SELECT Id, FirstName__c, LastName__c, Email__c, Status__c FROM Member__c");
      return records.records;
    } catch (error) {
      console.error('Error fetching members from Salesforce:', error.message);
      throw error;
    }
  }

  disconnect() {
    if (this.connection) {
      this.connection.logout(() => {
        this.isConnected = false;
        console.log('✓ Disconnected from Salesforce');
      });
    }
  }
}

module.exports = new SalesforceService();
