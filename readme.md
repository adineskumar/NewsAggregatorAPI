**Welcome to News Aggregator API.**

**Project Structure:**
```

└───src  
    ├───clients   
    ├───config    
    ├───constants    
    ├───controllers  
    ├───log    
    ├───middlewares  
    ├───models    
    ├───routers      
    ├───routes    
    ├───schemas      
    └───test      
        └───routes
```

**Endpoints:**

1. POST /register       -  Registers an user
2. POST /login          -  Logins using the user details
3. GET /preferences     -  List the logged in user preferences
4. PUT /preferences     -  Updates the logged in user preferences
5. GET /news            -  Retrieves the news based on the logged in user preferences
6. GET /news/top        -  Retrieves the top-news based on the logged in user preferences

**User Schema:**
   ```
{
      "username": "test-user",
      "email": "test-user@gmail.com",
      "password": "XXxx@1234",
      "preferences": {
         "categories": [ "general" ],
         "sources": [ "engadget" ] 
      }
   }
```

**PostMan Collection:**
[NewsAggregatorAPI](NewsAggregatorApi.postman_collection.json)

**Note:**
1. Preferences is not mandatory at the time of registration.
2. User can change his preferences later after his registration is complete.
3. News articles were pulled from an external API using async/await
4. Retrieved news articles were stored in REDIS cache, to reduce calling to external API
5. Local caching is also made available with the help of node-cache package.
6. Rolling log file have been made available to this application
7. Quite few unit test cases have also been added to this application

**Unit Test:**
```
npm run test 
``` 

**Starting the application:**
```
npm run dev
```
