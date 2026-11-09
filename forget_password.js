
 // ===================================
 // 1. FIREBASE IMPORTS
 // ===================================

import { firebaseConfig } from './firebase_config.js';

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
    getAuth,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";


// ===================================
// 2. INITIALIZE FIREBASE
// ===================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// ===================================
// 3. GET HTML ELEMENTS
// ===================================

const forgotForm = document.getElementById("forgotForm");

const email = document.getElementById("email");

const resetBtn = document.getElementById("resetBtn");

const btnText = document.getElementById("btnText");

const message = document.getElementById("message");


// ===================================
// 4. SHOW MESSAGE FUNCTION
// ===================================

function showMessage(text, type) {

    message.textContent = text;

    message.className = "message " + type;

}


// ===================================
// 5. FORGOT PASSWORD FORM
// ===================================

forgotForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    // Get email value

    const userEmail = email.value.trim();


    // Clear previous message

    showMessage("", "");


    try {

        // Disable button

        resetBtn.disabled = true;

        btnText.textContent = "Sending...";


        // Send password reset email

        await sendPasswordResetEmail(auth, userEmail);


        // Success message

        showMessage(
            "Password reset link sent! Please check your email inbox.",
            "success"
        );


        // Clear input

        forgotForm.reset();


    } catch (error) {

        console.error("Forgot Password Error:", error);


        // Firebase error handling

        switch (error.code) {

            case "auth/invalid-email":

                showMessage("Please enter a valid email address.", "error");

                break;


            case "auth/user-not-found":

                showMessage("No account found with this email address.", "error");

                break;


            case "auth/too-many-requests":

                showMessage("Too many attempts. Please try again later.", "error");

                break;


            case "auth/network-request-failed":

                showMessage("Network error. Check your internet connection.", "error");

                break;


            default:

                showMessage("Something went wrong. Please try again.", "error");

        }

    } finally {

        // Enable button again

        resetBtn.disabled = false;

        btnText.textContent = "Send Reset Link";

    }

});
