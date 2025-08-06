// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const server = require("../server"); // Your Express app
// const should = chai.should();

// // Use chai-http
// chai.use(chaiHttp);

// let itemId = null;
// let categoryId = null;
// let subcategoryId = null;

// describe("Item API", () => {
//     before((done) => {
//         chai.request(server)
//             .post("/api/v1/category/createCategory")
//             .set("Content-Type", "multipart/form-data") // Ensure proper content type
//             .field("name", "Crfffdfdaftegory")
//             .field("description", "test")
//             .attach("categoryImage", Buffer.from("dummy file"), "test-image.jpg") // Simulate file upload
//             .end((err, res) => {
//                 console.log("Category Response:", res.body); // Debugging log

//                 if (err || !res.body.success) {
//                     console.error("Category creation failed:", res.body);
//                     return done(err || new Error("Category creation failed"));
//                 }

//                 categoryId = res.body.data._id;

//                 chai.request(server)
//                     .post("/api/v1/subcategory/createSubcategory")
//                     .send({ name: "Test Subcfdfffategory", category: categoryId, description: "test" })
//                     .end((err, res) => {
//                         console.log("Subcategory Response:", res.body); // Debugging log

//                         if (err || !res.body.success) {
//                             console.error("Subcategory creation failed:", res.body);
//                             return done(err || new Error("Subcategory creation failed"));
//                         }

//                         subcategoryId = res.body.data._id;
//                         done();
//                     });
//             });
//     });



//     // Test: Create an Item
//     it("should create a new item with an image", (done) => {
//         chai.request(server)
//             .post("/api/v1/item/createItem")
//             .set("Content-Type", "multipart/form-data") // Set content type for file upload
//             .field("name", "Test Item")
//             .field("description", "This is a test item")
//             .field("price", 9.99)
//             .field("availability", "Out of Stock")
//             .field("category", categoryId)
//             .field("subcategory", subcategoryId)
//             .field("tags", ["Featured", "Popular"])
//             .attach("itemImage", Buffer.from("dummy file content"), "test-item-image.jpg") // Simulate file upload
//             .end((err, res) => {
//                 if (err) return done(err);

//                 res.should.have.status(201);
//                 res.body.should.have.property("success").eql(true);
//                 res.body.should.have.property("data").which.is.an("object");
//                 itemId = res.body.data._id;
//                 done();
//             });
//     });


//     // Test: Get All Items
//     it("should get all items", (done) => {
//         chai.request(server)
//             .get("/api/v1/item/getItems")
//             .end((err, res) => {
//                 if (err) return done(err);

//                 res.should.have.status(200);
//                 res.body.should.have.property("success").eql(true);
//                 res.body.should.have.property("data").which.is.an("array");
//                 done();
//             });
//     });

//     // Test: Get a Single Item by ID
//     it("should get a single item by ID", (done) => {
//         chai.request(server)
//             .get(`/api/v1/item/getItem/${itemId}`)
//             .end((err, res) => {
//                 if (err) return done(err);

//                 res.should.have.status(200);
//                 res.body.should.have.property("success").eql(true);
//                 res.body.should.have.property("data").which.is.an("object");
//                 res.body.data.should.have.property("_id").eql(itemId);
//                 done();
//             });
//     });

//     // Test: Update an Item
//     it("should update an existing item", (done) => {
//         chai.request(server)
//             .put(`/api/v1/item/updateItem/${itemId}`)
//             .send({ name: "Updated Test Item", price: 14.99 })
//             .end((err, res) => {
//                 if (err) return done(err);

//                 res.should.have.status(200);
//                 res.body.should.have.property("success").eql(true);
//                 res.body.should.have.property("data").which.is.an("object");
//                 res.body.data.should.have.property("name").eql("Updated Test Item");
//                 res.body.data.should.have.property("price").eql(14.99);
//                 done();
//             });
//     });
// });

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Your Express app
const should = chai.should();

chai.use(chaiHttp);

describe("Item API", () => {
    let itemId;
    let categoryId = "67c46dd7683da446fb871e03"; // Replace with an actual category ID
    let subcategoryId = "67c46eda683da446fb871e0c"; // Replace with an actual subcategory ID
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

    // ✅ Create an item
    it("should create a new item", (done) => {
        chai.request(server)
            .post("/api/v1/item/createItem")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test Item",
                description: "This is a test item",
                price: 10.99,
                availability: true,
                category: categoryId,
                subcategory: subcategoryId,
                tags: "Popular, Special"
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property("data");
                itemId = res.body.data._id;
                done();
            });
    });

    // ✅ Get all items
    it("should get all items", (done) => {
        chai.request(server)
            .get("/api/v1/item/getItems")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("count");
                res.body.should.have.property("data").that.is.an("array");
                done();
            });
    });

    // ✅ Get single item
    it("should get a single item by ID", (done) => {
        chai.request(server)
            .get(`/api/v1/item/getItem/${itemId}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("data");
                res.body.data.should.have.property("_id").eql(itemId);
                done();
            });
    });

    // ✅ Update item
    it("should update an item", (done) => {
        chai.request(server)
            .put(`/api/v1/item/updateItem/${itemId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Test Item",
                price: 12.99
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("data");
                res.body.data.should.have.property("name").eql("Updated Test Item");
                res.body.data.should.have.property("price").eql(12.99);
                done();
            });
    });

    // ✅ Delete item
    it("should delete an item", (done) => {
        chai.request(server)
            .delete(`/api/v1/item/deleteItem/${itemId}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("message").eql("Item deleted successfully");
                done();
            });
    });

    // ✅ Get items by category
    it("should get items by category", (done) => {
        chai.request(server)
            .get(`/api/v1/item/getItems/category/${categoryId}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("count");
                res.body.should.have.property("data").that.is.an("array");
                done();
            });
    });

    // ✅ Search items
    it("should search for items", (done) => {
        chai.request(server)
            .get("/api/v1/item/search?query=Test")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("array");
                done();
            });
    });

    // ✅ Get items by tags
    it("should get items by tags", (done) => {
        chai.request(server)
            .get("/api/v1/item/items-by-tags")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("Featured").that.is.an("array");
                res.body.should.have.property("Popular").that.is.an("array");
                done();
            });
    });
});

