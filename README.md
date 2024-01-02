# Khabo-Ki Server

Welcome to the server-side codebase for the Khabo-Ki Food Ordering System. This server is built using Node.js, Express, and MongoDB for efficient data storage.

## Features

1. **User Authentication**: Secured user authentication using bcrypt for password hashing.
2. **API Endpoints**: Define various API endpoints to handle user, food, and order-related operations.
3. **CORS Handling**: Utilizes CORS middleware for handling Cross-Origin Resource Sharing.
4. **Environment Variables**: Securely manage environment variables using the dotenv package.
5. **Database Integration**: Interacts with MongoDB database using Mongoose for seamless data transactions.
6. **Payment Integration**: Implements Stripe for secure payment processing.
7. **Middleware**: Uses body-parser middleware for parsing incoming request bodies.

## Technology Stack

- Node.js
- Express
- MongoDB (via Mongoose)
- Stripe for Payment Integration
- Other dependencies: bcrypt, cors, dotenv, nodemon, react-redux, redux, uuid.
  
Visit the live application: [Live Server Link](https://khabo-ki.netlify.app/)


## Environment Variables

Make sure to set the following environment variables in your `.env` file:

- `PORT`: Port on which the server will run.
- `URL`: MongoDB connection string.
- `STRIPE_SECRET_KEY`: Stripe secret key for payment processing.

## Contributing

Feel free to contribute to the development of this server-side codebase. Create a fork, make your changes, and submit a pull request!

## Social Links

- GitHub: [zamanmonirbu](https://github.com/zamanmonirbu)
- LinkedIn: [mdmoniruzzamanbu](https://www.linkedin.com/in/mdmoniruzzamanbu)
- Email: monir.cse6.bu@gmail.com
