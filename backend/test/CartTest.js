const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Your Express app
const should = chai.should();

chai.use(chaiHttp);

describe("Cart API", () => {
    let customerId = "67c45a65a8647dd0a36a824d"; // Replace with actual customer ID
    let itemId = "67c46f22683da446fb871e19"; // Replace with actual item ID
    let token;

    // Log in to get token before tests
    before((done) => {
        chai.request(server)
            .post("/api/v1/auth/login")
            .send({
                email: "existinguser@example.com", // Use actual credentials
                password: "password123"
            })
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    // ✅ Add item to cart
    it("should add an item to the cart", (done) => {
        chai.request(server)
            .post("/api/v1/cart/add")
            .set("Authorization", `Bearer ${token}`)
            .send({ customerId, itemId, quantity: 2 })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("items").that.is.an("array");
                done();
            });
    });

    // ✅ Get customer cart
    it("should retrieve the cart for a customer", (done) => {
        chai.request(server)
            .get(`/api/v1/cart/${customerId}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("customerId").eql(customerId);
                res.body.should.have.property("items").that.is.an("array");
                done();
            });
    });

    // ✅ Update cart item quantity
    it("should update an item's quantity in the cart", (done) => {
        chai.request(server)
            .put("/api/v1/cart/update")
            .set("Authorization", `Bearer ${token}`)
            .send({ customerId, itemId, quantity: 5 }) // Updating quantity to 5
            .end((err, res) => {
                res.should.have.status(200);
                res.body.items.find(i => i.itemId === itemId).quantity.should.equal(5);
                done();
            });
    });

    // ✅ Remove item from cart
    it("should remove an item from the cart", (done) => {
        chai.request(server)
            .delete(`/api/v1/cart/remove/${itemId}?customerId=${customerId}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eql("Item removed from cart");
                done();
            });
    });

    // ✅ Clear cart
    it("should clear the entire cart", (done) => {
        chai.request(server)
            .delete(`/api/v1/cart/clear/${customerId}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eql("Cart cleared");
                done();
            });
    });
});
