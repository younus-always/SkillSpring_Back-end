require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const stripe = require('stripe')(process.env.SECRET_KEY);
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 4002;

// Middlewares
app.use(cors({
      origin: ["http://localhost:5173", "https://skill-spring25.netlify.app"],
      credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Token verify middleware function
const verifyToken = (req, res, next) => {
      const token = req.cookies?.token;
      console.log(token)
      if (!token) {
            return res.status(401).send({ message: "UnAuthorized Access" })
      }

      jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                  res.status(401).send({ message: "UnAuthorized Access" })
            }
            req.user = decoded;
            next()
      })
};
// store cookie option to variable
const cookiesOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV || "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1aj11.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
      serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
      }
});


async function run() {
      try {
            // Connect the client to the server	(optional starting in v4.7)
            // await client.connect();

            // DB & Collection 
            const database = client.db('skillSpring');
            const userCollection = database.collection('users');
            const classCollection = database.collection('classes');
            const teacherCollection = database.collection('teachers');
            const assignmentCollection = database.collection('assignments');
            const paymentCollection = database.collection('payments');
            const submittedAssignmentCollection = database.collection('submittedAssignments');
            const reviewCollection = database.collection('reviews');

            // jwt related token api
            app.post('/jwt', (req, res) => {
                  const user = req.body;
                  console.log(user);
                  const token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '10d' })
                  res.cookie('token', token, cookiesOptions).send({ success: true })
            })

            app.post('/logout', (req, res) => {
                  res.clearCookie('token', { ...cookiesOptions, maxAge: 0 })
                        .send({ success: true })
            })

            // User Related API'S
            app.post('/users', async (req, res) => {
                  const user = req.body;
                  // is user exist
                  const cursor = { email: user.email };
                  const existingUser = await userCollection.findOne(cursor);
                  if (!existingUser) {
                        const result = await userCollection.insertOne(user);
                        res.send(result);
                  }
            });

            app.get('/users', async (req, res) => {
                  const { search } = req.query;
                  let query = {};
                  if (search) {
                        query = {
                              $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }]
                        }
                  };
                  const result = await userCollection.find(query).toArray();
                  res.send(result);
            });

            app.get('/users/:email', async (req, res) => {
                  const email = req.params.email;
                  const filter = { email: email };
                  const result = await userCollection.findOne(filter);
                  res.send(result);
            });

            app.patch('/users/make-admin/:email', async (req, res) => {
                  const email = req.params.email;
                  const filter = { email: email };
                  const updatedUser = {
                        $set: {
                              role: 'admin'
                        }
                  }
                  const result = await userCollection.updateOne(filter, updatedUser);
                  res.send(result);
            });

            // Teacher Related API'S
            app.post('/teacher', async (req, res) => {
                  const teacher = req.body;
                  const result = await teacherCollection.insertOne(teacher);
                  res.send(result);
            });

            app.get('/teachers', async (req, res) => {
                  const result = await teacherCollection.find().toArray();
                  res.send(result);
            });

            app.get('/teachers/:email', async (req, res) => {
                  const email = req.params.email;
                  const filter = { email: email };
                  const result = await teacherCollection.findOne(filter);
                  res.send(result);
            });
            // this api hit 3 times based on (reject, request-again and approved request)
            app.patch('/teachers/:email', async (req, res) => {
                  const email = req.params.email;
                  const filter = { email: email };
                  const teacher = req.body;
                  const updatedTeacher = {
                        $set: {
                              status: teacher.status,
                              role: teacher.role
                        }
                  };
                  const result = await teacherCollection.updateOne(filter, updatedTeacher);
                  res.send(result);
            });

            // Class Related API'S
            app.post('/classes', async (req, res) => {
                  const classData = req.body;
                  const result = await classCollection.insertOne(classData);
                  res.send(result);
            });

            app.get('/classes', async (req, res) => {
                  const { search } = req.query;
                  let query = {};
                  if (search) {
                        query = {
                              $or: [{ name: new RegExp(search, 'i') }, { title: new RegExp(search, 'i') }]
                        }
                  };
                  const result = await classCollection.find(query).toArray();
                  res.send(result);
            });

            app.get('/classes/:id', async (req, res) => {
                  const id = req.params.id;
                  const filter = { _id: new ObjectId(id) };
                  const result = await classCollection.findOne(filter);
                  res.send(result);
            });

            app.put('/classes/:id', async (req, res) => {
                  const id = req.params.id;
                  const cursor = { _id: new ObjectId(id) };
                  const classData = req.body;
                  const updatedClass = {
                        $set: {
                              title: classData.title,
                              price: classData.price,
                              description: classData.description,
                              status: classData.status
                        }
                  };
                  const result = await classCollection.updateOne(cursor, updatedClass);
                  res.send(result);
            });

            app.patch('/class/:id', async (req, res) => {
                  const id = req.params.id;
                  const filter = { _id: new ObjectId(id) };
                  const data = req.body;
                  const updatedClass = {
                        $set: {
                              status: data.status
                        }
                  };
                  const result = await classCollection.updateOne(filter, updatedClass);
                  res.send(result);
            });

            app.patch('/class-enroll/:id', async (req, res) => {
                  const id = req.params.id;
                  const filter = { _id: new ObjectId(id) };
                  const updatedClass = {
                        $inc: {
                              enroll: 1
                        }
                  };
                  const result = await classCollection.updateOne(filter, updatedClass);
                  res.send(result);
            });

            app.delete('/classes/:id', async (req, res) => {
                  const id = req.params.id;
                  const filter = { _id: new ObjectId(id) };
                  const result = await classCollection.deleteOne(filter);
                  res.send(result);
            });

            app.get('/featuredClass', async (req, res) => {
                  const result = await classCollection.find().sort({ enroll: -1 }).limit(6).toArray();
                  res.send(result);
            });


            // Assignment Related API'S
            app.post('/assignment', async (req, res) => {
                  const assignment = req.body;
                  const result = await assignmentCollection.insertOne(assignment);
                  res.send(result);
            });

            app.get('/assignments', async (req, res) => {
                  const result = await assignmentCollection.find().toArray();
                  res.send(result);
            });

            app.patch('/assignment/:id', async (req, res) => {
                  const id = req.params.id;
                  const filter = { _id: new ObjectId(id) };
                  const updatedAssignment = {
                        $inc: {
                              submission: 1
                        }
                  };
                  const result = await assignmentCollection.updateOne(filter, updatedAssignment);
                  res.send(result);
            });


            app.post('/submittedAssignments', async (req, res) => {
                  const submitAssignment = req.body;
                  const result = await submittedAssignmentCollection.insertOne(submitAssignment);
                  res.send(result);
            });

            app.get('/submittedAssignments', async (req, res) => {
                  const result = await submittedAssignmentCollection.find().toArray();
                  res.send(result);
            });


            // Stripe payment intent
            app.post('/create-payment-intent', async (req, res) => {
                  const { price } = req.body;
                  const amount = parseInt(price * 100);
                  const paymentIntent = await stripe.paymentIntents.create({
                        amount: amount,
                        currency: "usd",
                        payment_method_types: ['card']
                  });
                  res.send({
                        clientSecret: paymentIntent.client_secret
                  });
            });

            // Payments Related API'S 
            app.post('/payments', async (req, res) => {
                  const payment = req.body;
                  const result = await paymentCollection.insertOne(payment);
                  res.send(result);
            });

            app.get('/payments', async (req, res) => {
                  const result = await paymentCollection.find().toArray();
                  res.send(result);
            });

            app.post('/reviews', async (req, res) => {
                  const review = req.body;
                  const result = await reviewCollection.insertOne(review);
                  res.send(result);
            });

            app.get('/reviews', async (req, res) => {
                  const reviews = await reviewCollection.find().toArray();
                  res.send(reviews);
            });


            // Send a ping to confirm a successful connection
            // await client.db("admin").command({ ping: 1 });
            // console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } finally { }
}
run().catch(console.dir);


app.get('/', (req, res) => {
      res.send('Hello World I am SkillSpring Server Side.')
});


app.listen(port, (err) => {
      if (err) {
            return console.error(`Error starting server: ${err.message}`);
      }
      console.log(`SkillSpring server running port : ${port}`)
});