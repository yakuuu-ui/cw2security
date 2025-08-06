const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Adjust path to your server file
const { expect } = require("chai");

// Use Chai HTTP plugin for HTTP requests
chai.use(chaiHttp);

let subcategoryId;
let categoryId = "67c473c74f20853252b6e978"; // Sample category ID, ensure this category exists in your DB

// Testing Subcategory API
describe("Subcategory API", () => {

    // Create subcategory before tests
    before((done) => {
        chai.request(server)
            .post("/api/v1/subcategory/createSubcategory")
            .send({
                name: "Test Subcategory",
                description: "A test subcategory",
                category: categoryId,  // Make sure categoryId exists in the DB
            })
            .end((err, res) => {
                if (err) {
                    console.error("Error:", err);
                    return done(err);
                }

                // Log the response to check the structure and extract the subcategory ID
                console.log("Subcategory creation response:", res.body);

                // Check if the response has the correct structure and store the subcategory ID
                if (res.body && res.body.success && res.body.data && res.body.data._id) {
                    subcategoryId = res.body.data._id; // Store the subcategory ID for later use
                    console.log("Subcategory created with ID:", subcategoryId); // Log the ID for debugging
                    done();
                } else {
                    done(new Error("Subcategory creation failed: " + JSON.stringify(res.body)));
                }
            });
    });

    // Test: Get all subcategories
    it("should get all subcategories", (done) => {
        chai.request(server)
            .get("/api/v1/subcategory/getSubcategories")
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("success").eql(true);
                expect(res.body.data).to.be.an("array").that.is.not.empty;
                done();
            });
    });

    // Test: Get a single subcategory by ID
    it("should get a single subcategory by ID", (done) => {
        chai.request(server)
            .get(`/api/v1/subcategory/getSubcategory/${subcategoryId}`)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("success").eql(true);
                expect(res.body.data).to.have.property("_id").eql(subcategoryId);
                done();
            });
    });

    // Test: Update subcategory by ID
    it("should update an existing subcategory", (done) => {
        chai.request(server)
            .put(`/api/v1/subcategory/updateSubcategory/${subcategoryId}`)
            .send({
                name: "Updated Subcategory",
                description: "Updated description",
                category: categoryId, // Make sure the category ID is valid
            })
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("success").eql(true);
                expect(res.body.data).to.have.property("name").eql("Updated Subcategory");
                done();
            });
    });

    // Test: Delete subcategory by ID
    it("should delete a subcategory", (done) => {
        chai.request(server)
            .delete(`/api/v1/subcategory/deleteSubcategory/${subcategoryId}`)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("success").eql(true);
                expect(res.body.message).to.eql("Subcategory deleted successfully");
                done();
            });
    });

    // Test: Get subcategories by category ID
    it("should get subcategories by category ID", (done) => {
        chai.request(server)
            .get(`/api/v1/subcategory/getSubcategoriesByCategoryId/${categoryId}`)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("success").eql(true);
                expect(res.body.data).to.be.an("array").that.is.not.empty;
                done();
            });
    });
});

