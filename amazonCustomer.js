var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: 8889,
  database: "amazon_db"
});

showProducts();

function promptUser() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is id of the product you would like to purchase?\nID:",
        name: "item_id"
      },
      {
        type: "input",
        message: "How much would you like to purchase today?\nQuantity:",
        name: "quantity"
      }
    ])
    .then(function(answers) {
      stockCheck(answers.item_id, answers.quantity);
    });
}

function stockCheck(item_id, quantity) {
  connection.query(
    "SELECT * FROM products WHERE `item_id` = " + item_id,
    function(err, res) {
      if (quantity <= res[0].stock_quantity) {
        var newStockCount = res[0].stock_quantity - quantity;
        var totalCost = res[0].price * quantity;
        updateProduct(newStockCount, res[0].item_id, totalCost);
      } else {
        console.log(
          "We're sorry. Your request has overexceeded our stock limit. Please try again."
        );
        connection.end();
      }
    }
  );
}

function showProducts() {
  connection.query("SELECT * FROM `products`", function(err, res) {
    console.log("\nWelcome to the Amazon Marketplace!\n");
    for (var i = 0; i < res.length; i++) {
      console.log(
        "ID: " +
          res[i].item_id +
          " || Product: " +
          res[i].product_name +
          " || Department: " +
          res[i].department_name +
          " || Price: $" +
          res[i].price +
          " || Stock: " +
          res[i].stock_quantity +
          "\n"
      );
    }

    promptUser();
  });
}

function updateProduct(stock, id, cost) {
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: stock
      },
      {
        item_id: id
      }
    ],
    function(err, res) {
      console.log(
        "\nYour total payment of $" + cost + " has been processed.\n"
      );
      continueShopping();
    }
  );
}

function continueShopping() {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: "Continue Shopping?\n",
        name: "confirmed"
      }
    ])
    .then(function(answers) {
      if (answers.confirmed) {
        showProducts();
      } else {
        connection.end();
      }
    });
}
