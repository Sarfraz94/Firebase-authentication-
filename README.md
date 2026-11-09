# SecureAuth – Firebase Authentication System

A modern and responsive authentication system built using HTML, CSS, JavaScript, and Firebase Authentication. SecureAuth provides a clean user experience with account registration, login, password recovery, and email verification.

## Features

- **User Registration:** Create a new account using full name, email, and password.
- **User Login:** Authenticate users with email and password.
- **Email Verification:** Send verification emails to newly registered users.
- **Forgot Password:** Reset passwords through email.
- **Password Strength Checker:** Validate password requirements in real time.
- **Show/Hide Password:** Toggle password visibility.
- **Form Validation:** Validate user inputs before submission.
- **Firebase Authentication:** Manage user accounts securely.
- **Cloud Firestore:** Store user profile information.
- **Responsive Design:** User-friendly interface across different screen sizes.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Firebase Authentication
- Cloud Firestore
- Font Awesome

## Project Structure

```text
SecureAuth/
│
├── index.html
├── signup.html
├── forget_password.html
├── dashboard.html
│
├── style.css
│
├── firebase_config.js
├── app.js
└── signup.js
```

## Firebase Configuration

This project uses Firebase Authentication and Cloud Firestore.

To run the project:

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Email/Password Authentication**.
3. Create a **Cloud Firestore Database**.
4. Register your web application.
5. Copy your Firebase configuration into `firebase_config.js`.

Example:

```javascript
export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

**Important:** Never upload private credentials or sensitive information to a public repository.

## Firestore Security Rules

Use appropriate Firestore Security Rules to ensure authenticated users can access only their own profile documents.

## How to Run

1. Clone or download this repository.
2. Add your Firebase configuration.
3. Open the project using VS Code.
4. Run the project with the Live Server extension.
5. Register an account and test the authentication features.

## Authentication Flow

1. User creates an account.
2. Firebase Authentication registers the user.
3. User profile information is saved in Cloud Firestore.
4. A verification email is sent.
5. User verifies their email address.
6. User can log in using their registered credentials.

## Learning Objectives

This project demonstrates practical implementation of:

- JavaScript ES6 Modules
- Async/Await
- Promises and Error Handling
- DOM Manipulation
- Form Validation
- Firebase Authentication
- Cloud Firestore Integration
- Authentication Workflows

## Author

**Sarfraz Ali**

Computer Science Graduate | Web Developer

GitHub: [@Sarfraz94](https://github.com/Sarfraz94)

---

*Secure authentication. Simple experience. Built with modern web technologies.*
