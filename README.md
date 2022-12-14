# French Verbs Game

## Game Rules
The game will display a French word, the player needs to enter the English translation of this word.

They will be provided with two additional pieces of information:
1. The first letter of the translated word
2. The number of letters in the translated word

The player starts with 10 points

When the player makes a mistake they lose a point, when they find the word they gain a point

If a player reaches 0 points they lose 

If a player reaches 20 points they win

## Install and Setup

Pre-requisites to run on local machine:

```
mySQL server - follow install instructions here https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/
nodeJS (v16 has been used to develop this project)
```

To run locally you will need to create a .env file in the backend directory (i.e. backend/.env) and a .env file in the frontend directory (i.e. frontend/.env). This will contain the following secret values:

backend .env:

```
DATABASE_URL="mysql://${username}:${password}@localhost:3306/french-verbs-game"
PORT=4000
GOOGLE_TRANSLATE_API_KEY=""
TOKEN_KEY="LOCALKEY"
```

Note: you will need to obtain an API key to use the Google Translate API, this can be provided on request if needed 

frontend .env:

```
VITE_ENDPOINT="http://localhost:4000"
```

## Starting the Application

First, start the database service on your local machine (on Ubuntu that is the following):

```
sudo service mysql start
```

Then the frontend and backend need to be started from separate shells

Start the frontend:

```
cd frontend
npm install
npm run dev
```

Start the backend:

```
cd frontend
npm install
npx prisma migrate dev --name init
npm run serve
```

You only need to run the prisma migration command the first time starying the application (this will create the schema and all the necessary tables in your local mysql instance)

The first time running the application, you should run the following to load the verbs into the database:

```
cd backend
npm run load-verbs
```

You should then be able to see the game in your browser at http://localhost:5173

## Technical Choices

frontend:

My current frontend build-tool of choice is Vite which I have used to initalise a React + TypeScript frontend

I have added react-bootstrap to the project for easy styling since the UI/UX is not the highest priority in this project

backend:

I have used node + typescript to create an express app (as required in the assignment)

I am using a mySQL database since it's free yet fully featured and easy to setup and get going (I considered sqlLite but I have architected this as if I am expecting to eventually receive high enough traffic to warrant a more fully featured standalone db)

I opted for a relational database as I decided early on that I would be creating a leaderboard and running queries joining multiple tables to view this

To view and query the database I use mySQL Workbench

I have added Prisma as my ORM library (this is actually my first time using it, I have previously used TypeORM and not found it particularly great)

deployment:

I had hoped to have a live deployment of this application ready but I ran into a few issues using AWS Lambdas with Prisma (due to the bundle size of the prisma client), in hindsight using DynamoDB and the AWS SDK would have made more sense for an AWS serverless deployment.

I intend to deploy the backend instead to an EC2 instance when I have time. 

## Time Spent

Roughly 10 - 15 hours developing the code:

```
It was straightforward to hookup to the Google Translate API once I had decided that was what I was going to use

Adding a leaderboard feature took the bulk of the time as I opted to create an authentication flow so that it was possible to track attempts against each indivdual user 
```

Another 10-15 hours spent on unsuccessful deployments...
