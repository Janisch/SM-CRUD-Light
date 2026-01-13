# What is this?
A lightweit social media CRUD application built with Node.js, MongoDB and Express.
Supports Posts, comments, likes and optional image uploads via Cloudinary.

## Requirements
Before installing, make soure you have the following installed on your system:
- Node.js
- MongoDB

## Installation
1. Clone or download the repository
2. Navigate to the project directory
3. Install dependencies
```
npm install
```
4. create a .env file in the root directory and add the following variables:
```
SESSION_SECRET=YourSecret
MONGO_DB=mongodb://localhost:27017/myDB
```
If the specified MongoDB database does not exist, it will be created automatically.
If you want to use Cloudinary Image Upload you first need to create an account and add the following to the .env file:
```
CLOUDINARY_CLOUD_NAME=YourCloudName
CLOUDINARY_KEY=YourCloudinaryKey
CLOUDINARY_SECRET=YourCloudinarySecret
```
5. To generate example users and posts, run:
```
node seeds
```
6. Start the server with
```
node app.js
```
Then open your browser and navigate to 
> http://localhost:3000

optional:
```
NODE_ENV = prototyping || production (depending on the current state)
CLOUDINARY_CLOUD_NAME= <YourName>
CLOUDINARY_KEY = <YourKey>
CLOUDINARY_SECRET = <YourSecret>
```
These will be provided by cloudinary. 

7. Use ```node seeds``` for example users and posts.
Then ```node app``` to start the application
go to **localhost:3000** to view.


## API Endpoints:

| Method | Endpoint                         | Description                              |
|--------|----------------------------------|------------------------------------------|
| POST   | /posts                           | Create a post (image optional)            |
| PATCH  | /posts/:postId                   | Update a post                             |
| DELETE | /posts/:postId                  | Delete a post                             |
| POST   | /posts/:postId/like              | Like a post                               |
| POST   | /posts/:postId                   | Create a top-level comment                |
| POST   | /posts/:postId/:commentId        | Create a reply to a comment               |
| DELETE | /posts/:postId/:commentId        | Delete a comment                          |
| POST   | /posts/:postId/like              | Like a comment                            |

## Notes
- This project is intended for learning and prototyping purposes only
- Authentication is session-based
- **NOT suitable for real-world use due to known security limitations**



