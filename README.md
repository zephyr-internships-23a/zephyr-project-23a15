# Real Estate Buy Sell Web Portal
This project is a comprehensive real estate buy/sell portal designed to facilitate property transactions between users and agents. The platform offers the following features:
- User Registration: Users can create accounts to participate in the marketplace.
- Agent Approval: Users can request admin approval to become agents. Once approved, agents can list and sell properties.
- Property Transactions: Regular users can browse listed properties and make purchases.
- Communication: The platform includes a chat feature that allows agents and users to communicate directly, enhancing the buying and selling experience.
- Online Payments: All financial transactions are securely processed online, ensuring a smooth and efficient payment process.
This portal aims to streamline the real estate transaction process by providing a user-friendly interface and robust features to support both buyers and sellers. 

## Tech stack used 
### Frontend: React , Tailwind CSS 
### Backend: Nodejs , Mongodb , Express

## How to run the project locally
This project has two folder "frontend" and "backend" <br/>
### Setting up frontend
Frontend is built with React with the latest Vite build tool, in order to run the frontend folder we need to first open the the folder in any of your favorite IDE for example vscode then open the ```frontend``` folder in your integrated terminal and run ```npm install``` after it successfully install all the necessary dependencies now it is time to configure some of the ```env``` variables. Next step is to create an ```.env``` file and inside it paste the following content 
```
VITE_APP_BASE_API = http://localhost:4000/api
```
With this our setup for the frontend is completed and you can run the following command in terminal to run the frontend locally ```npm run dev```.

### Setting up backend 
Backend is built with Nodejs , Express and Mongodb, in order to run the backend open this ```backend``` folder in your integrated terminal and run the following command ```npm install``` this will download and install all the required packages and dependencies. After this is done setup an ```.env``` file as we did in the frontend part. And put the follwing keys  [Generally it is not advisable to put secret keys in env but for the shake of this I'll be putting it as this is an assignment]. 
```
APP_PASSWORD = qdkfuwucwbsrnyqg 
APP_EMAIL = rsaikia362@gmail.com
MONGO_URI = mongodb+srv://wwwamanko12345:1234@cluster0.vmg7cc5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 
PORT = 4000
JWT_SECRET = hfjdhfjdfhkjdfhfdkjsfhaj
```
After this we are ready to run out ```backend``` successfully! Next run the following command to run this backend server locally ```npm run dev```  
### Screenshots of every major module with explanations
Login:
![Login](image-2.png)
Sign up:
![signup](image-3.png)
Forget password:
![Forget password](image-4.png)
Home page for user:
![home page for user](image-5.png)
User profile:
![User profile](image-6.png)
Search page:
![Search page](image-7.png)
Admin dashboard:
![Admin dashboard](image-8.png)




