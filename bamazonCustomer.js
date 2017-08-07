const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	database: 'bamazon'
});

connection.connect(function(err) {
	if (err) {
		throw err;
	}

	connection.query('SELECT * FROM products', (err, res) => {
	    if (err) {
	    	throw err;
	    }

	    console.log('Product for sale:');
	    console.log('ID | Name | Price');

	   	for (let i = 0; i < res.length; i++) {
	   		console.log(`${res[i].item_id} | ${res[i].product_name} | $${res[i].price}`);
	   	}

	   	inquirer
			.prompt([
				{
					type: 'input',
					message: 'What is the ID of the product you\'d like to buy?',
					name: 'id'
				},
				{
					type: 'input',
					message: 'How many would you like to buy?',
					name: 'quantity'
				},
			])
			.then((res) => {
				const id = res.id;
				const quantity = parseInt(res.quantity);

				connection.query(`SELECT * FROM products WHERE item_id = ${id}`, (err, res) => {
				    if (err) {
				    	throw err;
				    }

				    if (quantity > res[0].stock_quantity) {
				    	console.log('Insufficient quantity!');
				    } else {
				    	const newQuantity = res[0].stock_quantity - quantity;
				    	const totalPrice = quantity * res[0].price;

				    	connection.query(`UPDATE products SET stock_quantity = ${newQuantity} WHERE item_id = ${id}`, (err, res) => {
						    if (err) {
						    	throw err;
						    }

						    console.log(`You will be charged $${totalPrice} for your order.`);
						});
				    }
				});
			});
	});

	// console.log(id, quantity);

	// connection.query(`SELECT ${id} FROM products`, (err, res) => {
	//     if (err) {
	//     	throw err;
	//     }

	//     console.log(res);
	// });
});