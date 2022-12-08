# french-verbs-game

## game rules
The game will display a French word, the player needs to enter the English translation of this word.

They will be provided with two additional pieces of information:
1. The first letter of the translated word
2. The number of letters in the translated word

The player starts with 10 points

When the player makes a mistake they lose a point, when they find the word they gain a point

If a player reaches 0 points they lose 

If a player reaches 20 points they win

## install and setup 

## starting the application

## technical choices

frontend:

My current frontend build-tool of choice is Vite which I have used to initalise a React + TypeScript frontend

I have added react-bootsrap to the project for easy styling since the UI/UX is not the highest priority in this project

backend:

I have used node + typescript to create an express app (as required in the assignment)

I am using a mySQL database since it's free yet fully featured and easy to setup and get going (I considered sqlLite but I have architected this as if I am expecting to eventually receive high enough traffic to warrant a more fully featured standalone db)

To view and query the database I use mySQL Workbench

I have added Prisma as my ORM library (this is actually my first time using it, I have previously used TypeORM and not found it particularly great)

## time spent
