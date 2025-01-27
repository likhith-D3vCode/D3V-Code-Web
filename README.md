##Welcome to your ultimate web development hub!
My project is an interactive web development learning platform designed to help students and beginners master core web technologies: HTML, CSS, and JavaScript. It combines features like a live compiler, AI-powered code evaluation, curated video tutorials, and hands-on labs to provide a structured and practical learning experience. The platform is tailored for those struggling to grasp web development concepts, offering tools and resources to make the learning process easier, more engaging, and highly effective.

###The platform addresses key challenges faced by students learning web development:
1. Lack of Practice-Oriented Learning: Many learners have difficulty transitioning from theory to practical application. This platform provides coding challenges, labs, and real-world tasks to build practical skills.
2. Overwhelming Learning Resources: Beginners often face confusion with the abundance of unorganized online content. This platform curates high-quality HTML, CSS, and JavaScript video tutorials to streamline their learning.
3. Lack of Community and Support: Learning in isolation hinders growth. The platform fosters collaboration with a discussion forum where users can ask questions, share knowledge, and learn together.
4. Real-World Preparation: Most platforms don't offer real-world coding scenarios. This project bridges the gap with labs and challenges that mimic real-world applications, making learners job-ready.

###Features: Key Functionalities of the Application

1. Live Code Compiler
Allows users to write and test HTML, CSS, and JavaScript code directly within the platform.
Displays instant results for submitted code, providing a seamless coding experience.
2. AI-Powered Code Evaluation
Integrates with OpenAI to analyze submitted code and provide intelligent runtime feedback.
3. Test Case Validation
An API evaluates user submissions against predefined test cases to ensure the solution is accurate and meets all requirements.
4. Curated Learning Resources
Recommends high-quality HTML, CSS, and JavaScript video tutorials from trusted YouTube creators to supplement practice.
5. Hands-On Labs
Includes project-based lab tasks and challenges that simulate real-world web development scenarios.
Encourages users to apply their skills and build practical solutions.
6. Core Practice Questions
Offers a collection of carefully designed HTML, CSS, and JavaScript practice questions to strengthen foundational knowledge.
7. Discussion Forum
Provides a community-driven space where users can ask questions, share knowledge, discuss coding problems, and collaborate.
8. Facts and Tips Page
Includes a dedicated section for interesting facts and tips about web development to keep users informed and motivated.
9. Progress Tracking and Gamification
Tracks user progress, celebrates milestones, and offers badges or rewards to keep users engaged and motivated.


###Technologies Used
1. Frontend:
ReactJS: Used to create a dynamic, interactive, and user-friendly interface for the platform.
Backend:

2. Node.js: Provides a robust and scalable runtime environment for building the server-side logic.
Express.js: A lightweight framework used to create APIs for handling requests and managing test case validation, discussions, and more.
Database:

3. MongoDB Atlas: A cloud-based database service used to store user data, code submissions, discussion posts, and other application-related data.
Compiler Integration:

4. iFrame: Used to embed a live HTML, CSS, and JavaScript compiler for users to write and test code in real-time.
AI Integration:

5. OpenAI API: Utilized to evaluate submitted code, provide runtime feedback, and offer intelligent suggestions for improvement.
   
6. Authentication:
JWT (JSON Web Token): Used for secure user authentication and session management.


###To Run The Code
1. create an .env write attributes according to the index.js code (MONGO_DB,MyApiKey).
2. Start the docker in your local system.
3. Start the redis in the docker.
4. docker compose up --build  (to run the application in the docker).
5. now open the appication according to there ports.  `http://localhost:5173`
   

