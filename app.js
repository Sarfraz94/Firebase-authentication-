
import { firebaseConfig } from './firebase_config.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    signOut
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";


// 1. Firebase Initialize

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// 2. HTML Elements

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

const remember = document.getElementById("remember");

const loginBtn = document.getElementById("loginBtn");
const btnText = document.getElementById("btnText");

const message = document.getElementById("message");

const togglePassword = document.getElementById("togglePassword");


// 3. Show / Hide Password

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';

        togglePassword.setAttribute("aria-label", "Hide password");

    } else {

        password.type = "password";

        togglePassword.innerHTML = '<i class="fa-regular fa-eye"></i>';

        togglePassword.setAttribute("aria-label", "Show password");

    }

});


// 4. Login Form

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const userEmail = email.value.trim();
    const userPassword = password.value;

    // Button Loading

    loginBtn.disabled = true;
    btnText.textContent = "Signing In...";

    message.textContent = "";
    message.className = "message";


    try {

        // 5. Remember Me Persistence

        if (remember.checked) {

            await setPersistence(auth, browserLocalPersistence);

        } else {

            await setPersistence(auth, browserSessionPersistence);

        }


        // 6. Firebase Login

        const userCredential = await signInWithEmailAndPassword(
            auth,
            userEmail,
            userPassword
        );

        const user = userCredential.user;


        // 7. Email Verification Check

        if (!user.emailVerified) {

            await signOut(auth);

            message.textContent = "Please verify your email before signing in.";
            message.className = "message error";

            return;

        }


        // 8. Successful Login

        message.textContent = "Login successful! Redirecting...";
        message.className = "message success";

        window.location.href = "dashboard.html";


    } catch (error) {

        console.log("Login Error:", error.code);


        // 9. Error Handling

        switch (error.code) {

            case "auth/invalid-email":
                message.textContent = "Please enter a valid email address.";
                break;

            case "auth/invalid-credential":
                message.textContent = "Incorrect email or password.";
                break;

            case "auth/user-not-found":
                message.textContent = "No account found with this email.";
                break;

            case "auth/wrong-password":
                message.textContent = "Incorrect password.";
                break;

            case "auth/user-disabled":
                message.textContent = "This account has been disabled.";
                break;

            case "auth/too-many-requests":
                message.textContent = "Too many attempts. Please try again later.";
                break;

            case "auth/network-request-failed":
                message.textContent = "Network error. Please check your internet.";
                break;

            default:
                message.textContent = "Login failed. Please try again.";

        }

        message.className = "message error";


    } finally {

        // 10. Reset Button

        loginBtn.disabled = false;
        btnText.textContent = "Sign In";

    }

});
