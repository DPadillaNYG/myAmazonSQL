var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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

    var table = new Table({
      head: ["ID", "Product", "Department", "Price", "Stock"],
      colWidths: [4, 18, 17, 10, 7]
    });

    for (var i = 0; i < res.length; i++) {
      table.push([
        res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        res[i].price,
        res[i].stock_quantity
      ]);
    }
    console.log(table.toString());
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
