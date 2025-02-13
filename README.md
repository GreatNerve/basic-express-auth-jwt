# Basic Express Auth

This project is a basic authentication system built with Express.js. It provides endpoints for user registration, login, logout, and token refresh.

## Endpoints

### Get Current User
- **URL:** `/api/v1/users/`
- **Method:** `GET`

### Register User
- **URL:** `/api/v1/users/register`
- **Method:** `POST`
- **Body:**
    ```json
    {
        "fullName": "your_full_name",
        "username": "your_username",
        "email": "your_email@example.com",
        "password": "your_password",
        "date_of_birth": "your_date_of_birth",
        "gender": "your_gender",
        "country": "your_country"
    }
    ```

### Login User
- **URL:** `/api/v1/users/login`
- **Method:** `POST`
- **Body:**
    ```json
    {
        "username": "your_username",
        "password": "your_password"
    }
    ```
    or
    ```json
    {
        "email": "your_email@example.com",
        "password": "your_password"
    }
    ```

### Logout User
- **URL:** `/api/v1/users/logout`
- **Method:** `POST`

### Refresh Token
- **URL:** `/api/v1/users/refresh-token`
- **Method:** `POST`

### Find User by Email
- **URL:** `/api/v1/users/find`
- **Method:** `GET`
- **Params:**
    - `username`: The username of the user to find.
    - `email`: The email of the user to find.

## Installation

1. Clone the repository:
     ```sh
     git clone https://github.com/GreatNerve/basic-express-auth-jwt
     ```
2. Install dependencies:
     ```sh
     cd basic-express-auth
     npm install
     ```

3. Configure environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=8000
    MONGO_URI=your_mongo_uri
    JWT_ACCESS_SECRET=your_jwt_access_secret
    JWT_REFRESH_SECRET=your_jwt_refresh_secret
    JWT_ACCESS_EXPIRATION=your_jwt_access_expiration
    JWT_REFRESH_EXPIRATION=your_jwt_refresh_expiration
    COOKIE_SECRET=your_cookie_secret
    ```

4. Start the server:
    ```sh
    npm start
    ```
