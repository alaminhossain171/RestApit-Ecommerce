const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/EcommerceDB', { useNewUrlParser: true });

const productSchema = {
    pName: String,
    pPrice: String,
    pDisc: String

}
const Products = mongoose.model("Products", productSchema);

app.route("/products").get(function(req, res) {
    Products.find(function(err, find) {
        if (!err) {
            res.send(find);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res) {


    const newProduct = new Products({
        pName: req.body.pName,
        pPrice: req.body.pPrice,
        pDisc: req.body.pDisc
    });
    newProduct.save(function(err) {
        if (!err) {
            res.send("successfuly inserted product")
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res) {
    Products.deleteMany(function(err) {
        if (!err) {
            res.send("delete succesfully");
        } else {
            res.send(err);
        }
    })
});

//target//
app.route("/products/:productName")

.get(function(req, res) {

        Products.findOne({ pName: req.params.productName }, function(err, found) {
            if (found) {
                res.send(found);
            } else {
                res.send("Product name not matching");
            }
        });
    })
    .put(function(req, res) {
        Products.update({ pName: req.params.productName }, { pName: req.body.pName, pPrice: req.body.pPrice, pDisc: req.body.pDisc },

            { overwrite: true },
            function(err) {
                if (!err) {
                    res.send("updated success");
                }
            });
    })

.patch(function(req, res) {
    Products.update({ pName: req.params.productName }, { $set: req.body },
        function(err) {
            if (!err) {
                res.send("successfuly updated")
            } else {
                res.send(err);
            }
        }
    )
})

.delete(function(req, res) {
    Products.deleteOne({ pName: req.params.productName },
        function(err) {
            if (!err) {
                res.send("successfully deleted the corresponding data")
            } else {
                res.send(err);
            }

        }
    )
});





app.listen(3000, function() {
    console.log("server started at port 3000");
})