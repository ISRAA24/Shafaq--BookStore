var http = new XMLHttpRequest();
http.open("get", "https://api.itbook.store/1.0/new", true);

http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
        var data = JSON.parse(http.responseText);
        console.log(data);

        var output = "";

        for (var item of data.books) {
            output += `
            <div class="product">
                <img src="${item.image}" alt="${item.title}">
                <p class="title">${item.title}</p>
                <p class="description">${item.subtitle}</p>
                <p class="price">
                    <span>${item.price}</span>
                    
                </p>
                <p class="cart">Add to cart <i class="bx bx-cart-alt"></i></p>
            </div>
            `;
        }

        document.querySelector(".products").innerHTML = output;
    }
};

http.send();

const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnLogin-popup");
const iconClose = document.querySelector(".icon-close");

registerLink.addEventListener("click", () => {
    wrapper.classList.add("active");
});
loginLink.addEventListener("click", () => {
    wrapper.classList.remove("active");
});
btnPopup.addEventListener("click", () => {
    wrapper.classList.add("active-popup");
});
iconClose.addEventListener("click", () => {
    wrapper.classList.remove("active-popup");
});
var content = document.getElementsByTagName("body")[0];
var header = document.getElementById("header");
var darkMode = document.getElementById("dark-change");

darkMode.addEventListener("click", function () {
    darkMode.classList.toggle("active");
    content.classList.toggle("night");
    header.classList.toggle("night");
});

function hexString(buffer) {
    const byteArray = new Uint8Array(buffer);
    const hexCodes = [...byteArray].map((value) =>
        value.toString(16).padStart(2, "0")
    );
    return hexCodes.join("");
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return hexString(hash);
}

async function saveUser(email, password) {
    const hashedPassword = await hashPassword(password);

    const apiEndpoint = "https://jsonplaceholder.typicode.com/users"; 
    const userData = {
        email: email,
        password: hashedPassword,
    };

    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("User saved successfully:", result);
            alert("User registered successfully!");
        } else {
            console.error(
                "Failed to save user:",
                response.status,
                response.statusText
            );
            alert("Failed to register user. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const registerForm = event.target; 
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;

    await saveUser(email, password);
}

async function handleLogin(event) {
    event.preventDefault();
    const loginForm = event.target; 
    const email = loginForm.querySelector('input[type="email"]').value;
    
    
    try {
        const response = await fetch("/users.json");
        if (!response.ok) {
            throw new Error("Failed to retrieve users");
        }

        const users = await response.json();
        let userFound = false;

        
        for (const user of users) {
            if (user.email === email ) {
                alert("Welcome " + user.name);
                userFound = true;
                break;
            }
        }

        if (!userFound) {
            alert("Unauthorized");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while processing your request.");
    }
}
