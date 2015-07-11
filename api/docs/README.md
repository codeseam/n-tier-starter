#API

###Installation
Install the latest stable release  of Sails with the command-line tool:

`sudo npm -g install sails`

###Creating a New Sails Project
Create a new app:

`sails new api --no-frontend`
*--no-frontend flag states we are not using sails views*

Now lift the server:

`cd api`
`sails lift`

*Hint*
Alter models for easy development `config/models.js` uncomment `migrate: alter`

[Authentication](docs/Authentication.md)
[x] Create Authentication api
  `sails generate api auth`
  [x] Require npm modules
    `npm install jwt-simple moment --save`
  [x] Add Authentication endpoints
    *Login*
    *Signup*
  [x] Add policies
      [x] check if authenticated 'api/policies/isAuthorized.js'
      [ ] check if admin
  [x] Add policies to routes 'config/policies'

[Users](docs/Users.md)
[x] Create Users api
  `sails generate api users`
  [X] Create User model
  [x] Require npm modulues
    `npm install bcryptjs --save`
