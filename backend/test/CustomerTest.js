// Import necessary modules
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');  // Your Express app
const should = chai.should();

// Use chai-http
chai.use(chaiHttp);

// Test case for POST /api/v1/auth/login
describe('Customer Authentication', () => {
  // Registering a new customer for login testing
  before((done) => {
    chai.request(server)
      .post('/api/v1/auth/register')
      .send({
        fname: 'John',
        lname: 'Doe',
        phone: '1234567890',
        email: 'sauravg@gmail.com',
        password: 'password123',
      })
      .end((err, res) => {
        done();
      });
  });

  it('should login a customer with correct credentials', (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'sauravg@example.com',  // Same email as the one used for registration
        password: 'password123',  // Correct password
      })
      .end((err, res) => {
        console.log(res.body);  // Log the response body for debugging
        res.should.have.status(200);  // Expecting status code 200 (OK)
        res.body.should.have.property('success').eql(true);  // Check for success
        res.body.should.have.property('token');  // Check for token
        res.body.should.have.property('userId');  // Check for userId
        res.body.should.have.property('role').eql('customer');  // Check for role
        done();
      });
  });

  it('should return all customers for admin', (done) => {


    chai.request(server)
      .get('/api/v1/auth/getAllCustomers')

      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('count').be.above(0);  // Ensure there is at least one customer
        res.body.should.have.property('data').that.is.an('array');
        done();
      });
  });



  it('should return error for invalid credentials', (done) => {
    chai.request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'saurav@example.com',  // Correct email
        password: 'wrongpassword',  // Incorrect password
      })
      .end((err, res) => {
        res.should.have.status(401);  // Expecting status code 401 (Unauthorized)
        res.body.should.have.property('message').eql('Invalid credentials');
        done();
      });
  });

  it('should return the customer details for the customer himself', (done) => {

    const customerId = "67c43e8a5e9deb37468f27d1";  // Replace with the logged-in customer ID
    const customerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzQzZThhNWU5ZGViMzc0NjhmMjdkMSIsImlhdCI6MTc0MDkyMTA3OCwiZXhwIjoxNzQzNTEzMDc4fQ.7uz5Y76VhG1_Zmxv6abEba9AkN81o5rMmExuSNXrzvk";  // Replace with the logged-in customer ID

    chai.request(server)
      .get(`/api/v1/auth/getCustomer/${customerId}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('data').that.is.an('object');
        done();
      });
  });
});
