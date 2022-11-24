const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { query } = require('express');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('hello from behind');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.e9mltxe.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

const run = async () => {
	try {
		const bikeHatDB = client.db('bike-hat');
		const bikesCollection = bikeHatDB.collection('bikes-collection');
		const usersCollection = bikeHatDB.collection('users');
		const bookingsollection = bikeHatDB.collection('bookings');

		// make sure you use verifyAdmin after verifyJWT

		/*
        

         random secure key jeneretor //* require('crypto').randomBytes(64).toString('hex')
        */

		// getting bikes by brand name

		app.get('/bikes/:brand', async (req, res) => {
			const brand = req.params.brand;
			const query = {
				brand: brand,
			};
			const bikes = await bikesCollection.find(query).toArray();

			res.send(bikes);
		});

		// getting bikes  brand names as for category section
		app.get('/brands', async (req, res) => {
			const brands = await bikesCollection.distinct('brand');
			res.send(brands);
		});

		//| adding bikes in database

		app.post('/bikes', async (req, res) => {
			const bikeObj = req.body;

			const result = await bikesCollection.insertOne(bikeObj);
			console.log(result);

			res.send(result);
		});

		// creating user
		app.put('/users', async (req, res) => {
			const user = req.body;
			const filter = {
				email: user.email,
			};
			const updatedDoc = {
				$set: user,
			};
			console.log(user);
			const addUser = await usersCollection.updateOne(filter, updatedDoc);

			console.log(addUser);

			res.send(addUser);
		});

		//?| getting all buyers from users collection
		app.get('/buyers', async (req, res) => {
			const query = {
				role: 'buyer',
			};

			const buyers = await usersCollection.find(query).toArray();
			// console.log(buyers
			res.send(buyers);
		});
		// getting all buyers from users collection
		app.get('/sellers', async (req, res) => {
			const query = {
				role: 'seller',
			};

			const sellers = await usersCollection.find(query).toArray();
			// console.log(sellers);
			res.send(sellers);
		});

		// | deleting user

		app.delete('/users/:id', async (req, res) => {
			const id = req.params.id;
			const query = {
				_id: ObjectId(id),
			};
			const result = await usersCollection.deleteOne(query);
			res.send(result);
		});
		// | deleting product by id

		app.delete('/product/:id', async (req, res) => {
			const id = req.params.id;
			const query = {
				_id: ObjectId(id),
			};
			const result = await bikesCollection.deleteOne(query);
			res.send(result);
		});

		//  getting all  bookings
		app.get('/bookings', async (req, res) => {
			const email = req.query.email;
			const query = {
				email: email,
			};
			console.log(email);

			const result = await bookingsollection.find(query).toArray();
			res.send(result);
		});
		// creating bookings
		app.post('/bookings', async (req, res) => {
			const booking = req.body;

			const result = await bookingsollection.insertOne(booking);

			res.send(result);
		});

		// | getting sellerProducts by email

		app.get('/sellerProducts/:email', async (req, res) => {
			const email = req.params.email;

			const query = {
				email: email,
			};

			const result = await bikesCollection.find(query).toArray();
			res.send(result);
		});
	} finally {
	}
};
run().catch((err) => console.log(err));

app.listen(port, () => {
	console.log('server running at port', port);
});
