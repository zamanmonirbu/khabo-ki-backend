
# Pizza-House Food Ordering System - Backend

[Live Link](https://pizza-house-client.vercel.app/) | [Front-end Code](https://github.com/zamanmonirbu/pizza-house-client) | [Back-end Code](https://github.com/zamanmonirbu/pizza-house-backend) | [Demo Video](https://www.youtube.com/watch?v=V6lktb2HYu4)


## Overview

This repository contains the backend code for the Pizza-House Food Ordering System. It provides API endpoints for managing food items, orders, user accounts, and admin functions. The backend is built using Node.js, Express, and MongoDB to create a robust and scalable system for food ordering.

## Features

- **CRUD Operations for Food Items:** Admins can create, read, update, and delete food items.
- **Order Management:** Users can place orders, and the system tracks order status. Admins can update order statuses.
- **User Management:** Supports user registration, authentication, and profile management.
- **Admin Panel:** Provides authorized admins with exclusive access to manage food items, users, and orders.
- **Food Filtering:** Users can filter food items based on size, category, and other criteria.
- **Most Ordered Food Suggestions:** Displays the most ordered food items on the homepage to help users choose popular items.
- **Payment System:** Secure payment processing for users to complete their orders.
- **Search Functionality (Future Work):** Users will be able to search for food items by category or name.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/zamanmonirbu/pizza-house-backend.git
   cd pizza-house-backend
   ```

2. **Install Dependencies:**

   Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Run the following command to install the required dependencies:

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root directory of the project with the following content:

   ```env
   PORT=5000
   MONGO_URI=
   JWT_SECRET=
   STRIPE_SECRET_KEY=
   ```

4. **Start the Server:**

   ```bash
   npm start
   ```

   The server will start and listen on the port specified in the `.env` file. By default, it will run on `http://localhost:5000`.

## API Endpoints

### Food Items

- **GET /api/foods**
  - **Description:** Retrieves a list of all available food items.
  
- **POST /api/foods**
  - **Description:** Creates a new food item (Admin only).
  - **Request Body:**
    ```json
    {
      "name": "Margherita Pizza",
      "description": "Classic cheese pizza with tomato sauce",
      "price": 9.99,
      "size": "Medium",
      "category": "Pizza",
      "image": "url-to-image"
    }
    ```

- **PUT /api/foods/:id**
  - **Description:** Updates an existing food item (Admin only).
  - **Request Body:** Similar to the POST request body.

- **DELETE /api/foods/:id**
  - **Description:** Deletes a food item (Admin only).

### Orders

- **POST /api/orders**
  - **Description:** Places a new order.
  - **Request Body:**
    ```json
    {
      "userId": "user-id",
      "items": [
        {
          "foodId": "food-id",
          "quantity": 2
        }
      ],
      "totalPrice": 19.98,
      "paymentStatus": "Pending",
      "deliveryAddress": "123 Main St"
    }
    ```

- **GET /api/orders/user/:userId**
  - **Description:** Retrieves all orders for a specific user.

- **GET /api/orders/:orderId**
  - **Description:** Retrieves details of a specific order.

- **PUT /api/orders/:orderId**
  - **Description:** Updates the status of an order (Admin only).

### Users

- **POST /api/users/register**
  - **Description:** Registers a new user.
  - **Request Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

- **POST /api/users/login**
  - **Description:** Authenticates a user and returns a JWT token.
  - **Request Body:**
    ```json
    {
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

- **GET /api/users/profile**
  - **Description:** Retrieves the profile of the authenticated user.

## Dependencies

- `express` - A minimal and flexible Node.js web application framework.
- `mongoose` - MongoDB object modeling for Node.js.
- `jsonwebtoken` - For secure authentication with JWTs.
- `bcryptjs` - For hashing passwords.
- `dotenv` - Loads environment variables from a `.env` file.
- `stripe` - Payment processing via Stripe.
- `cors` - Enables cross-origin resource sharing.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request. For any issues or suggestions, feel free to open an issue.


## Connect with Me

- **Email:** [monir.cse6.bu@gmail.com](mailto:monir.cse6.bu@gmail.com)
- **GitHub:** [![GitHub Icon](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zamanmonirbu)
- **LinkedIn:** [![LinkedIn Icon](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mdmoniruzzamanbu/)
- **Codeforces:** [![Codeforces Icon](https://img.shields.io/badge/Codeforces-00FF00?style=for-the-badge&logo=codeforces&logoColor=white)](https://codeforces.com/profile/ZaMo)
- **LeetCode:** [![LeetCode Icon](https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=white)](https://leetcode.com/u/moniruzzamancse6/)
- **Portfolio:** [![Portfolio Icon](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=codeforces&logoColor=white)](https://moniruzzamanbu.netlify.app/)
- **Medium:** [![Medium Icon](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@zamanmonirbu)

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
