# Home Harmony
## Project Overview
Home Harmony is a web application designed to make shared living easier and more enjoyable. It helps with communication, organization, and building a sense of community among roommates. The platform includes features for managing chores, planning events, organizing documents, and tracking expenses.

## Features
1. Chores Roulette: Fairly distributes household tasks among roommates in a gamified system.
2. Event Planning and Notifications: Simplifies the coordination of household events with automatic reminders.
3. Document Repository and Contact Hub: Stores crucial household documents and important contacts.
4. Virtual Bulletin Board and Home Inventory Management: Allows roommates to post messages and track household items.
5. Expense Tracking and Shared Purchases: Enables transparent financial management and expense tracking.
   
## System Architecture
Home Harmony utilizes AWS cloud services for data storage, push notifications, and more. The main components include:
* EC2: For scalable computing capacity.
* Cognito: For user authentication.
* RDS (PostgreSQL): For reliable and scalable database management.

## Database Schema
We use PostgreSQL with the following data tables:
* UsersTable: Stores user information.
* ApartmentsTable: Stores apartment details.
* ExpensesTable: Tracks shared expenses.
* DocumentsTable: Manages household documents.
* BulletinsTable: Handles messages on the virtual bulletin board.
* ChoresTable: Manages household chores.

## Development Tools
* React: For building the user interface.
* PostgreSQL: For database management.
* AWS: For cloud services.
* TypeScript: For type safety in JavaScript.
* VS Code: As the development environment.
* GitHub: For version control.
* Postman: For API testing.
* Node.js: For server-side development.
* GPT/CoPilot: For coding assistance.

## Installation
To set up the project locally, follow these steps:
1. Clone the repository: git clone https://github.com/moranpol/Home-Harmony.git
2. Navigate to the project directory: cd Home-Harmony
2. Install the dependencies: npm install
3. Set up the environment variables as specified in the .env.example file.
4. Start the development server: npm start
