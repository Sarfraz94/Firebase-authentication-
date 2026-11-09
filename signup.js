
// ===================================
// 1. FIREBASE IMPORTS
// ===================================

import { firebaseConfig } from './firebase_config.js';

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";


// ===================================
// 2. INITIALIZE FIREBASE
// ===================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ===================================
// 3. GET HTML ELEMENTS
// ===================================

const signupForm = document.getElementById("signupForm");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const terms = document.getElementById("terms");

const signupBtn = document.getElementById("signupBtn");
const btnText = document.getElementById("btnText");

const message = document.getElementById("message");


// Password strength elements

const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

const ruleLength = document.getElementById("ruleLength");
const ruleUpper = document.getElementById("ruleUpper");
const ruleLower = document.getElementById("ruleLower");
const ruleNumber = document.getElementById("ruleNumber");
const ruleSpecial = document.getElementById("ruleSpecial");


// ===================================
// 4. SHOW / HIDE PASSWORD
// ===================================

const toggleButtons = document.querySelectorAll(".toggle-password");

toggleButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const targetId = button.dataset.target;

        const input = document.getElementById(targetId);

        const icon = button.querySelector("i");

        if (input.type === "password") {

            input.type = "text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

            button.setAttribute("aria-label", "Hide password");

        } else {

            input.type = "password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

            button.setAttribute("aria-label", "Show password");

        }

    });

});


// ===================================
// 5. PASSWORD RULES
// ===================================

function checkPasswordRules(value) {

    return {

        length: value.length >= 8,

        upper: /[A-Z]/.test(value),

        lower: /[a-z]/.test(value),

        number: /[0-9]/.test(value),

        special: /[^A-Za-z0-9]/.test(value)

    };

}


// ===================================
// 6. UPDATE PASSWORD RULE UI
// ===================================

function updateRule(element, isValid) {

    const icon = element.querySelector("i");

    if (isValid) {

        icon.classList.remove("fa-circle");
        icon.classList.add("fa-circle-check");

        element.classList.add("valid");

    } else {

        icon.classList.remove("fa-circle-check");
        icon.classList.add("fa-circle");

        element.classList.remove("valid");

    }

}


// ===================================
// 7. PASSWORD STRENGTH CHECKER
// ===================================

password.addEventListener("input", () => {

    const value = password.value;

    const rules = checkPasswordRules(value);

    const score = Object.values(rules).filter(Boolean).length;


    updateRule(ruleLength, rules.length);

    updateRule(ruleUpper, rules.upper);

    updateRule(ruleLower, rules.lower);

    updateRule(ruleNumber, rules.number);

    updateRule(ruleSpecial, rules.special);


    strengthBar.style.width = (score * 20) + "%";


    if (value.length === 0) {

        strengthText.textContent = "Password strength: Not entered";

    } else if (score <= 2) {

        strengthText.textContent = "Password strength: Weak";

    } else if (score <= 4) {

        strengthText.textContent = "Password strength: Medium";

    } else {

        strengthText.textContent = "Password strength: Strong";

    }

});


// ===================================
// 8. SHOW MESSAGE FUNCTION
// ===================================

function showMessage(text, type) {

    message.textContent = text;

    message.className = "message " + type;

}


// ===================================
// 9. SIGNUP FORM SUBMIT
// ===================================

signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    // Get input values

    const name = fullName.value.trim();

    const userEmail = email.value.trim();

    const userPassword = password.value;

    const confirmPass = confirmPassword.value;


    showMessage("", "");


    // Name validation

    if (name.length < 2) {

        showMessage("Please enter your full name.", "error");

        return;

    }


    // Password validation

    const rules = checkPasswordRules(userPassword);

    const isStrongPassword = Object.values(rules).every(Boolean);

    if (!isStrongPassword) {

        showMessage("Please create a strong password.", "error");

        return;

    }


    // Confirm password validation

    if (userPassword !== confirmPass) {

        showMessage("Passwords do not match.", "error");

        return;

    }


    // Terms validation

    if (!terms.checked) {

        showMessage("Please accept Terms & Conditions.", "error");

        return;

    }


    try {

        // Disable button

        signupBtn.disabled = true;

        btnText.textContent = "Creating Account...";


        // ===================================
        // 10. CREATE FIREBASE AUTH ACCOUNT
        // ===================================

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            userEmail,
            userPassword
        );

        const user = userCredential.user;

        console.log("1. Account created successfully");


        // ===================================
        // 11. UPDATE USER PROFILE
        // ===================================

        await updateProfile(user, {

            displayName: name

        });

        console.log("2. Profile updated");


        // ===================================
        // 12. SAVE USER DATA IN FIRESTORE
        // ===================================

        await setDoc(doc(db, "users", user.uid), {

            uid: user.uid,

            fullName: name,

            email: userEmail,

            createdAt: new Date().toISOString()

        });

        console.log("3. Firestore data saved");


        // ===================================
        // 13. SEND EMAIL VERIFICATION
        // ===================================

        btnText.textContent = "Sending Verification Email...";

        await sendEmailVerification(user);

        console.log("4. Verification email sent");


        // ===================================
        // 14. SUCCESS MESSAGE
        // ===================================

        showMessage(
            "Account created successfully! Verification email sent. Please check your inbox.",
            "success"
        );

        btnText.textContent = "Email Sent Successfully!";


        // ===================================
        // 15. REDIRECT TO LOGIN
        // ===================================

        setTimeout(() => {

            window.location.href = "index.html";

        }, 3000);


    } catch (error) {

        console.error("Signup Error:", error);


        // ===================================
        // 16. ERROR HANDLING
        // ===================================

        switch (error.code) {

            case "auth/email-already-in-use":

                showMessage("This email is already registered.", "error");

                break;


            case "auth/invalid-email":

                showMessage("Please enter a valid email address.", "error");

                break;


            case "auth/weak-password":

                showMessage("Your password is too weak.", "error");

                break;


            case "auth/too-many-requests":

                showMessage("Too many attempts. Try again later.", "error");

                break;


            case "auth/network-request-failed":

                showMessage("Network error. Check your internet connection.", "error");

                break;


            default:

                showMessage(
                    "Signup failed: " + error.message,
                    "error"
                );

        }

    } finally {

        // ===================================
        // 17. RESET BUTTON
        // ===================================

        signupBtn.disabled = false;

        if (btnText.textContent !== "Email Sent Successfully!") {

            btnText.textContent = "Create Account";

        }

    }

});
