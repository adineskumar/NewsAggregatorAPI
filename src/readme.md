**Welcome to News Aggregator API.**

**Project Structure:**

src/
├── app.js
├── config
│   └── env.js
├── constants
│   ├── app.constants.js
│   └── schema.constants.js
├── controllers
│   ├── auth.controller.js
│   ├── news.controller.js
│   └── preferences.controller.js
├── middlewares
│   └── auth.middleware.js
├── readme.md
├── routers
│   ├── authRouter.js
│   ├── newsRouter.js
│   └── preferenceRouter.js
└── schemas
    ├── preferences.schema.js
    └── users.schema.js

6 directories, 14 files


**Endpoints:**
1. POST /register	    Register a new user.
      **Sample Request Body:**
          {
            "username" : "xxxxxx",
            "password" : "pppppppp",
            "preferences": {
              "sources": ["google-news-in", "google-news-us"],
              "category": ["business", "science"]
            }
          }
   
      **Sample Response:**
          {
            "message": "User registered successfully"
          }
   
2. POST /login	      Log in a user.
      **Sample Request Body:**
          {
            "username" : "xxxxxx",
            "password" : "pppppppp",
            "preferences": {
              "sources": ["google-news-in", "google-news-us"],
              "category": ["business", "science"]
            }
          }
   
      **Sample Response:**
          {
            "message": "Login successful",
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ld3VzZXIiLCJpYXQiOjE2ODg2NDI5NzAsImV4cCI6MTY4ODcyOTM3MH0.fPIet0KjT-9QxObPcSAtOUphHWUhpBQT9Myq5cBRKEA"
          }

3. GET /preferences	  Retrieve the news preferences for the logged-in user.
   **Sample Request Body:**
          curl --location --request GET 'https://newaggregaterapi.dineshkumar318.repl.co/preferences' \
--header 'Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdhbmVzaCIsImlhdCI6MTY4ODY0MTE5NCwiZXhwIjoxNjg4NzI3NTk0fQ.WL_X7XEzLSGtqSpa6XFA7u_vXPDoU6lPR6RVDkcviSs'
   
      **Sample Response:**
          {
            "category": [
                "business",
                "science"
            ],
            "sources": [
                "google-news-in",
                "google-news-us"
            ]
          }
   
5. PUT /preferences	  Update the news preferences for the logged-in user.
          **Sample Request Body:**
              {
                  "username" : "xxxxxxx",
                  "password" : "pppppp",
                  "preferences": {
                      "sources": ["google-news-in", "google-news-us"],
                      "category": ["business", "science", "sports"]
                  }
              }
          **Sample Response:**
              {
                "message" : "News preferences updated"
              }
   
7. GET /news	        Fetch news articles based on the logged-in user's preferences


**Additional Notes:**
    Room for improvement:
      1. Code refractoring
      2. Organizing Status Code and Response Messages as constants
      3. Implement async/await wherever possible