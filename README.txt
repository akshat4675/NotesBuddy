React Vite Web Application with AWS Core Services
Website Address - NotesVerse.click
Overview
This project demonstrates a full-stack web application built using React with Vite, showcasing seamless integration with AWS core services such as S3, DynamoDB, and Cognito. The application leverages AWS's scalable and secure infrastructure to handle user authentication, data storage, and user-specific data access.
Features:
* User Authentication: Secure user authentication implemented with Amazon Cognito.
* User-specific Data Access: Data is restricted and accessible only to authenticated users using Cognito Identity Pool and Access Tokens.
* Scalable Data Storage: DynamoDB is used for efficient and scalable data storage.
* File Storage: S3 bucket integration for storing and retrieving user-uploaded files.
* Modern Frontend: A fast and responsive UI built with React and Vite.
* DevOps Skills: CI/CD pipeline implemented using AWS Amplify, showcasing integration with GitHub for version control and streamlined deployments.
________________


Tech Stack
Frontend:
* React (with Vite for fast builds)
* JavaScript  (ES6+)
* TypeScript 
Backend:
* AWS DynamoDB (NoSQL database for data storage)
* AWS S3 (for file storage)
* AWS Cognito (authentication and user management)
* AWS Amplify (CI/CD and hosting)
________________


How It Works
Authentication
* Cognito User Pool handles user registration and login.
* Identity Pool provides temporary AWS credentials for accessing S3 and DynamoDB without hardcoding access keys.
User-Specific Data Access
* DynamoDB stores data with userSub as the primary key and includes the URLs of S3 objects to ensure seamless and secure access to user-specific data.
* Access Token and userSub (stored in session storage) are used to securely access DynamoDB and S3 resources.
* S3 files are organized with paths prefixed by the userSub to maintain user isolation, ensuring data privacy and integrity.
CI/CD Pipeline
* AWS Amplify is used for continuous integration and continuous deployment (CI/CD), automating build and deployment processes.
* Integration with GitHub ensures version control and a robust workflow, demonstrating proficiency in DevOps practices.

________________


Key Highlights
* Built with modern web technologies for fast and responsive performance.
* Leveraged AWS's secure and scalable services for authentication, data storage, and CI/CD.
* DynamoDB design ensures efficient user-specific data access by storing userSub as the primary key and S3 object URLs for enhanced usability.
* Demonstrated strong DevOps skills with AWS Amplify and GitHub-based version control for streamlined development and deployment workflows.
________________


Future Enhancements
1. Add unit and integration tests for better reliability.
2. Enhance analytics to monitor user engagement and application performance.
3. Expand the CI/CD pipeline to include automated tests and quality checks.
________________


Contribution
Contributions are welcome! Please create a fork and submit a PR.
________________


License
MIT License. See LICENSE file for details.
________________


Contact
For any questions, feel free to reach out:
* Email: akshat4675@gmail.com
* LinkedIn: https://www.linkedin.com/in/akshat-sharma-89880a277/ 
* GitHub: https://github.com/akshat4675
