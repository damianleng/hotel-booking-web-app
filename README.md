# Hotel Booking Web App

The **Hotel Booking Web App** is designed to streamline hotel operations by offering real-time room availability, unique room access codes, and contactless check-ins, which target reduced travel-related stress and enhance user convenience and safety.

## Features

- Real-time room availability
- Contactless check-ins and checkouts
- User-focused design prioritizing privacy and security

## Project Directory Structure

To run this project locally, ensure you have the following installed:

- **Node.js** (version 16.x or above)
- **npm** (Node Package Manager)
- **Angular CLI** (version 14.2.1)

## Getting Started
### Running the Client Side
1. **Clone the Repository**

   ```bash
   git clone https://github.com/damianleng/hotel-booking-web-app.git
   cd hotel-booking-web-app
   
2. **Install Angular CLI globally**

   ```bash
   npm install -g @angular/cli@14.2.1

3. **Navigate to your project folder**

   ```bash
   cd path/to/hotel-booking-web-app
4. **Install Dependencies**

   Navigate to the client directory and install the necessary dependencies:

   ```bash
   cd client
   npm install
5. **Start the Angular server with**
   ```bash
   ng serve
### Running the Server Side
Ensure `config.env` File is Present
Make sure the `config.env` file is located in the server folder. `config.env` file is included in the blackboard submission
1. **Navigate to the Server Folder**
    ```bash
    cd ../server
2. **Install Server Dependencies**
   Install the required server dependencies:
    ```bash
    npm install
3. **Start the Server **
   Start the backend server with
   ```bash
   node server
### Connect to MongoDB Atlas
1. **Configure the Connection String**
   Ensure that you have the latest `config.env` files.
2. **Verfiy Access**
    - Ensure that your IP address is whitelisted in MongoDB Atlas under Network Access in the Atlas dashboard.
    - Confirm the connection by running the server and checking for a successful connection message in the console.
    
