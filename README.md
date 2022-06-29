# saimon-global-task

A sample node js (Express Js) CRUD API Package.     

## Steps

**Note**  
This sample express app, has https enabled already.    

## Step-1: From github
### Clone the repository, install node packages  and verify routes locally

```
git clone https://github.com/mdRazunMia/saimon-global-task
cd saimon-global-task 
npm install
```
## Step-2: If Redis database is not installed in your machine, install Redis. Otherwise the project will not run. 
## Step-3: Change the value .env file value if you want or run it by keeping as it is. 
## Step-4: Run the following command to run the project.
```
npm start
```
### Open your local browser and verify the saimon-global-task API is working by accessing the routes given below:  
```
`http://localhost:3000/api/packages/create` | method: POST | Create a package.  
`http://localhost:3000/api/packages` | method: GET | Get all the packages.  
`http://localhost:3000/api/packages?cityName=Dhaka` | method: GET | Get all the packages where cityName = Dhaka.  
`http://localhost:3000/api/packages/:id` | method: GET | Get a single package.  
`http://localhost:3000/api/packages/:id` | method: PUT | Update a package.  
`http://localhost:3000/api/packages/:id` | method: DELETE | Delete a package.  
`http://localhost:3000/api/packages/plan/:id` | method: PUT | Update the package by adding a plan where `id` is the package id.  

```




