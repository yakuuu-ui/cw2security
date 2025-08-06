const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Your Express app
const should = chai.should();

chai.use(chaiHttp);

describe("Order API", () => {
    let orderId;
    let userId = "67c45a65a8647dd0a36a824d"; // Replace with an actual user ID
    let token;

    // Log in to get token before tests
    before((done) => {
        chai.request(server)
            .post("/api/v1/auth/login")
            .send({
                email: "admin@example.com", // Use actual credentials
                password: "adminpassword"
            })
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    // ✅ Create an order
    it("should create a new order", (done) => {
        chai.request(server)
            .post("/api/v1/order/orders")
            .set("Authorization", `Bearer ${token}`)
            .send({
                userId,
                cartItems: [{ itemId: "65f25a8d7c654be4a3e1f123", quantity: 2 }],
                billingDetails: {
                    name: "John Doe",
                    address: "123 Street, City",
                    phone: "9876543210"
                },
                paymentMethod: "eSewa",
                paymentStatus: "Completed",
                subtotal: 20.00,
                deliveryCharge: 5.00,
                totalPrice: 25.00,
                orderStatus: "Pending"
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property("_id");
                orderId = res.body._id;
                done();
            });
    });

    // ✅ Get all orders
    it("should get all orders", (done) => {
        chai.request(server)
            .get("/api/v1/order/orders")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("array");
                done();
            });
    });

    // ✅ Get order by ID
    it("should get a single order by ID", (done) => {
        chai.request(server)
            .get(`/api/v1/order/orders/${orderId}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("_id").eql(orderId);
                done();
            });
    });

    // ✅ Get orders by user ID
    it("should get orders for a specific user", (done) => {
        chai.request(server)
            .get(`/api/v1/order/orders/user/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("array");
                done();
            });
    });

    // ✅ Get total revenue
    it("should get the total revenue", (done) => {
        chai.request(server)
            .get("/api/v1/order/revenue")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("totalRevenue");
                done();
            });
    });

    // ✅ Get orders revenue by month
    it("should get revenue by month", (done) => {
        chai.request(server)
            .get("/api/v1/order/orders-revenue")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("array");
                done();
            });
    });
});
