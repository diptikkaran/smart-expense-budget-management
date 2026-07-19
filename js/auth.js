// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (
            fullName === "" ||
            email === "" ||
            phone === "" ||
            username === "" ||
            password === "" ||
            confirmPassword === ""
        ) {
            alert("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const exists = users.find(
            user => user.username === username
        );

        if (exists) {
            alert("Username already exists.");
            return;
        }

        users.push({
            fullName,
            email,
            phone,
            username,
            password
        });

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        alert("Registration Successful!");

        window.location.href = "login.html";

    });

}
// LOGIN

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const username =
                document.getElementById("loginUser").value.trim();

            const password =
                document.getElementById("loginPassword").value;

            const users =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];

            const user =
                users.find(
                    user =>
                        user.username === username &&
                        user.password === password
                );

            if (!user) {

                alert("Invalid Username or Password");

                return;

            }

            localStorage.setItem(
                "currentUser",
                user.fullName
            );

            localStorage.setItem(
                "currentUsername",
                user.username
            );

            localStorage.setItem(
                "currentWorkspace",
                "Personal Finance"
            );

            localStorage.setItem(
                "lastLogin",
                new Date().toLocaleString()
            );

            alert("Login Successful!");

            window.location.href =
                "dashboard.html";

        }
    );

}
// FORGOT PASSWORD

const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const username =
                document.getElementById("forgotUser").value.trim();

            const newPassword =
                document.getElementById("newPassword").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            if (
                username === "" ||
                newPassword === "" ||
                confirmPassword === ""
            ) {

                alert("Please fill all fields.");

                return;

            }

            if (newPassword !== confirmPassword) {

                alert("Passwords do not match.");

                return;

            }

            let users =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];

            const userIndex =
                users.findIndex(
                    user => user.username === username
                );

            if (userIndex === -1) {

                alert("Username not found.");

                return;

            }

            users[userIndex].password =
                newPassword;

            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );

            alert("Password Updated Successfully!");

            window.location.href =
                "login.html";

        }
    );

}
// SESSION CHECK

const protectedPages = [
    "dashboard.html",
    "personal.html",
    "group.html",
    "reports.html"
];

const currentPage =
    window.location.pathname.split("/").pop();

if (protectedPages.includes(currentPage)) {

    const currentUser =
        localStorage.getItem("currentUser");

    if (!currentUser) {

        alert("Please Login First.");

        window.location.href = "login.html";

    }

}
// LOGOUT

function logout() {

    if (confirm("Are you sure you want to Logout?")) {

        localStorage.removeItem("currentUser");
        localStorage.removeItem("currentUsername");
        localStorage.removeItem("currentWorkspace");
        localStorage.removeItem("lastLogin");

        alert("Logout Successful!");

        window.location.href = "login.html";

    }

}