const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');

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

		// make sure you use verifyAdmin after verifyJWT

		/*
        

         random secure key jeneretor //* require('crypto').randomBytes(64).toString('hex')
        */
		app.get('/bikes', async (req, res) => {
			const bikes = await bikesCollection.find({}).toArray();
			res.send(bikes);
		});

		// getting bikes brand names as for category section
		app.get('/brands', async (req, res) => {
			// const brands = await bikesCollection
			// 	.find({})
			// 	.project({ brand: 1 })
			// 	.toArray();
			const brands = await bikesCollection.distinct('brand');

			console.log(brands);
			res.send(brands);
		});

		// creating user
		app.post('/users', async (req, res) => {
			const user = req.body;
			const addUser = await usersCollection.insertOne(user);
			console.log(user);
			res.send(addUser);
		});
	} finally {
	}
};
run().catch((err) => console.log(err));

app.listen(port, () => {
	console.log('server running at port', port);
});
