const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Your Express app
const should = chai.should();

let categoryId = null;

chai.use(chaiHttp);

describe("Category API", () => {
    // Create a category before running tests
    before((done) => {
        chai.request(server)
            .post("/api/v1/category/createCategory")
            .set("Content-Type", "multipart/form-data") // Ensure proper content type
            .field("name", "Test fCffaftegory")
            .field("description", "Ad test category") // Fixed typo from "descripgtion" to "description"
            .attach("categoryImage", Buffer.from("dummy file"), "test-image.jpg") // Simulate file upload
            .end((err, res) => {
                console.log("Category Response:", res.body); // Debugging log

                if (err || !res.body.success) {
                    console.error("Category creation failed:", res.body);
                    return done(err || new Error("Category creation failed"));
                }

                categoryId = res.body.data._id; // Store category ID for later tests
                done();
            });
    });

    // Test: Get All Categories
    it("should get all categories", (done) => {
        chai.request(server)
            .get("/api/v1/category/getCategories")
            .end((err, res) => {
                if (err) return done(err);

                res.should.have.status(200);
                res.body.should.have.property("success").eql(true);
                res.body.should.have.property("count").eql(1); // Adjust based on your setup
                res.body.should.have.property("data").which.is.an("array");
                done();
            });
    });

    // // Test: Get a Single Category by ID
    // it("should get a single category by ID", (done) => {
    //     chai.request(server)
    //         .get(`/api/v1/category/getCategory/${categoryId}`)
    //         .end((err, res) => {
    //             if (err) return done(err);

    //             res.should.have.status(200);
    //             res.body.should.have.property("success").eql(true);
    //             res.body.should.have.property("data").which.is.an("object");
    //             res.body.data.should.have.property("_id").eql(categoryId); // Ensure correct categoryId
    //             done();
    //         });
    // });


});
