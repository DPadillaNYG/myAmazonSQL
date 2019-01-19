DROP DATABASE IF EXISTS amazon_db;
CREATE DATABASE amazon_db;
USE amazon_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price DECIMAL(6,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 10,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Resident Evil 2", "Video Games", 59.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Kingdom Hearts 3", "Video Games", 59.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone XS Max", "Electronics", 999.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Samsung 4K TV", "Electronics", 2599.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blue Jeans", "Clothing", 34.99, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Leather Jacket", "Clothing", 69.99, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Butter", "Food", 4.99, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Milk", "Food", 2.99, DEFAULT);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Crayola Box", "School Supplies", 1.99, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Notebook", "School Supplies", 4.99, 15);

SELECT *
FROM products;