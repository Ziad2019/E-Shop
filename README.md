# E-Shop API

E-Shop is a backend RESTful API for an e-commerce platform built with NestJS and MongoDB. It supports essential functionalities such as user management, product catalog, shopping cart, orders, and secure payment integration via Stripe.

---

## Features

- Modular architecture using NestJS for scalable and maintainable code
- User authentication and authorization with JWT and password hashing (bcrypt)
- Product and category management with image upload and processing (Sharp)
- Shopping cart and order management with validation
- Secure payment processing using Stripe Checkout
- Input validation using DTOs and class-validator
- API documentation with Swagger for easy testing and integration

---

## Technologies Used

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB & Mongoose](https://mongoosejs.com/)
- [Stripe API](https://stripe.com/docs/api)
- [JWT](https://jwt.io/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [Swagger](https://swagger.io/)
- [Multer](https://github.com/expressjs/multer)
- [Sharp](https://github.com<span class="ml-2" /><span class="inline-block w-3 h-3 rounded-full bg-neutral-a12 align-middle mb-[0.1rem]" />

## How to Run This Project Locally
#Install dependencies
npm install
#Configure environment variables
cp .env.example .env
#Open .env and update the following variables with your own values
# Run MongoDB locally or use a cloud service
# Start the development server#Start the development server
npm run start:dev
#Access API documentation
http://localhost:3000/api
