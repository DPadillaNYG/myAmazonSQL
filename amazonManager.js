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

promptUser();

function promptUser() {
  console.log("\nWelcome to the Amazon Management Center.\n");

  inquirer
    .prompt([
      {
        type: "rawlist",
        message:
          "ATTN: ONLY AUTHORIZED PERSONAL MAY PERFORM THE TASKS BELOW\n\n",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ],
        name: "admin"
      }
    ])
    .then(function(answers) {
      switch (answers.admin) {
        case "View Products for Sale":
          showProducts();
          setTimeout(returnHome, 100);
          break;
        case "View Low Inventory":
          stockCheck();
          setTimeout(returnHome, 100);
          break;
        case "Add to Inventory":
          showProducts();
          setTimeout(updateStock, 100);
          break;
        case "Add New Product":
          createProduct();
          break;
      }
    });
}

// If a manager selects `View Products for Sale`,
// the app should list every available item: the
// item IDs, names, prices, and quantities.
function showProducts() {
  connection.query("SELECT * FROM `products`", function(err, res) {
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
    console.log("\n" + table.toString() + "\n");
  });
}

// If a manager selects `View Low Inventory`, then
// it should list all items with an inventory count
// lower than five.
function stockCheck() {
  connection.query(
    "SELECT * FROM products WHERE stock_quantity <= 5 ORDER BY stock_quantity ASC",
    function(err, res) {
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

      if (!table.hasOwnProperty("length")) {
        console.log(
          "\nThere is no Amazon product short in supply at this time.\n"
        );
      } else {
        console.log("\n" + table.toString() + "\n");
      }
    }
  );
}

// If a manager selects `Add to Inventory`, your app
// should display a prompt that will let the manager
// "add more" of any item currently in the store.
function updateStock() {
  inquirer
    .prompt([
      {
        type: "input",
        message:
          "What is the product id of the item you wish to increase the quantity of?\nID:",
        name: "item_id"
      },
      {
        type: "input",
        message:
          "How much would you like to increase the quantity of this item by?\nQuantity:",
        name: "quantity"
      }
    ])
    .then(function(answers) {
      connection.query(
        "UPDATE products SET stock_quantity = stock_quantity + " +
          answers.quantity +
          " WHERE `item_id` = " +
          answers.item_id,
        function(err, res) {
          console.log(
            "\nYou have successfully updated Product ID " +
              answers.item_id +
              " with an additional quantity of " +
              answers.quantity +
              ".\n"
          );

          connection.query(
            "SELECT * FROM products WHERE item_id = " + answers.item_id,
            function(err, res) {
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
              console.log("\n" + table.toString() + "\n");
              returnHome();
            }
          );
        }
      );
    });
}

// If a manager selects `Add New Product`, it should
// allow the manager to add a completely new product
// to the store.
function createProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        message:
          "What is the name of the item you would like to post for sale?\nName:",
        name: "product_name"
      },
      {
        type: "input",
        message:
          "Which department would you like to categorize this item under? (i.e. Men's Apparel, Electronics)\nDepartment Name:",
        name: "department_name"
      },
      {
        type: "input",
        message: "How much will this item cost to consumers?\nPrice:",
        name: "price"
      },
      {
        type: "input",
        message: "How much stock is available for this item?\nQuantity:",
        name: "stock_quantity"
      }
    ])
    .then(function(answers) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answers.product_name,
          department_name: answers.department_name,
          price: answers.price,
          stock_quantity: answers.stock_quantity
        },
        function(error, results) {
          console.log(
            "\n" +
              answers.product_name +
              " has been posted to the Amazon Marketplace for buyers.\n"
          );
          returnHome();
        }
      );
    });
}

function returnHome() {
  inquirer
    .prompt([
      {
        type: "rawlist",
        message: "Return Home\n",
        choices: ["Yes", "No"],
        name: "confirmed"
      }
    ])
    .then(function(answers) {
      if (answers.confirmed === "Yes") {
        promptUser();
      } else {
        connection.end();
      }
    });
}
