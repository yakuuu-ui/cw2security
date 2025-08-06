const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Your Express app
const should = chai.should();

chai.use(chaiHttp);

describe("Wishlist API", () => {
    let customerId = "67c45a65a8647dd0a36a824d"; // Replace with an existing customer ID
    let itemId = "67c46f22683da446fb871e19"; // Replace with an existing item ID
    let token;

    // Log in with an existing customer to get the token
    before((done) => {
        chai
            .request(server)
            .post("/api/v1/auth/login")
            .send({
                email: "existinguser@example.com", // Use the existing customer's email
                password: "password123", // Use the correct password
            })
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    // ✅ Test: Add item to wishlist
    it("should add an item to the wishlist", (done) => {
        chai
            .request(server)
            .post("/api/v1/wishlist/add")
            .set("Authorization", `Bearer ${token}`)
            .send({ customerId, itemId })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eql("Added to wishlist");
                res.body.should.have.property("wishlistItem");
                done();
            });
    });
    // ✅ Test: Check if item is in wishlist
    it("should check if an item is in the wishlist", (done) => {
        chai
            .request(server)
            .get(`/api/v1/wishlist/check/${itemId}?customerId=${customerId}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("isWishlisted").eql(true);
                done();
            });
    });
});
