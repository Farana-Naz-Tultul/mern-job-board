\# MERN Job Board API



A simple Job Board API built with the \*\*MERN stack\*\* (MongoDB, Express, Node.js).  

This is the backend part of the project with authentication and job management routes.  



---



\## 🚀 Features

\- User registration \& login (with JWT authentication)

\- Password hashing with bcrypt

\- MongoDB + Mongoose for database models

\- REST API endpoints tested with Postman \& curl

\- Includes bash script and Postman collection for reproducible testing



---



\## 📂 Project Structure



mern-job-board/

│── server/ # Backend (Node/Express)

│ ├── src/

│ │ ├── index.js # Entry point

│ │ ├── models/User.js # User schema

│ │ └── routes/auth.js # Authentication routes

│ ├── .env # Environment variables (ignored in git)

│ └── package.json

│

│── scripts/ # Bash test scripts

│ └── auth\_test.sh

│

│── postman/ # Postman collections

│ └── job-board-collection.json

│

└── README.md





---



\## ⚙️ Setup



\### 1. Clone repo



```bash

git clone https://github.com/YOUR\_USERNAME/mern-job-board.git

cd mern-job-board/server



2\. Install dependencies



npm install



3\. Configure Environment Variables



Create a .env file in the server/ folder:



MONGO\_URI=your\_mongo\_connection\_string

JWT\_SECRET=your\_secret\_key





⚠️ .env is not tracked in git for security reasons.



4\. Run Server



npm run dev





Server should run at:



http://localhost:5000



🧪 Testing



Option 1: Curl Script



Run bash script:



./scripts/auth\_test.sh



Option 2: Postman



Import the collection:



postman/job-board-collection.json





Endpoints:



POST /api/auth/register



POST /api/auth/login



📌 Roadmap



&nbsp;User registration/login



&nbsp;JWT middleware for protected routes



&nbsp;Job posting CRUD routes



&nbsp;React frontend



&nbsp;Deployment



👩‍💻 Author



**Farana Naz Tultul** — [GitHub](https://github.com/Farana-Naz-Tultul)

