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
        message: "ATTN: ONLY AUTHORIZED PERSONAL MAY PERFORM THE TASKS BELOW\n",
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
          break;
        case "View Low Inventory":
          stockCheck();
          break;
        case "Add to Inventory":
          console.log("Test Completed");
          break;
        case "Add New Product":
          console.log("Test Completed");
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
    console.log(table.toString());
    returnHome();
  });
}

// If a manager selects `View Low Inventory`, then
// it should list all items with an inventory count
// lower than five.
function stockCheck() {
  connection.query(
    "SELECT * FROM products GROUP BY stock_quantity HAVING count(*) <= 5",
    function(err, res) {
      var table = new Table({
        head: ["ID", "Product", "Department", "Price", "Stock"],
        colWidths: [4, 18, 17, 10, 7]
      });

      for (var i = 0; i < res.length; i++) {
        if (res[i].stock_quantity <= 5) {
          table.push([
            res[i].item_id,
            res[i].product_name,
            res[i].department_name,
            res[i].price,
            res[i].stock_quantity
          ]);
          console.log(res[i].stock_quantity);
          console.log(res[i].product_name);
        }
      }
      //   console.log(table);
      returnHome();
    }
  );
  // console.log(
  //   "There is currently no stock running low for any Amazon product at this time."
  // );
}

// If a manager selects `Add to Inventory`, your app
// should display a prompt that will let the manager
// "add more" of any item currently in the store.
function updateStock() {}

// If a manager selects `Add New Product`, it should
// allow the manager to add a completely new product
// to the store.
function createProduct() {}

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
