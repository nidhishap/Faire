// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCGTrvmgit2UBYE9tCAtg2itiTdVLgBt-A",
    authDomain: "faire-28d55.firebaseapp.com",
    projectId: "faire-28d55",
    storageBucket: "faire-28d55.appspot.com",
    messagingSenderId: "994974978244",
    appId: "1:994974978244:web:0ae17ec42e8d5eca46b991",
    measurementId: "G-HBFYFMV9T9",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function hash(str) {
    var res = 0,
        i,
        chr;
    if (str.length === 0) return res;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        res = (res << 5) - res + chr;
        res |= 0; // Convert to 32bit integer
    }
    return res;
}

function signup() {
    const userId = document.getElementById("signup-inputID").value;
    const email = document.getElementById("signup-inputEmail").value;
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    const password = document.getElementById("signup-inputPassword").value;
    const cpass = document.getElementById("inputPasswordConfirm").value;

    if (userId == "" || email == "" || password == "" ) {
        const node = document.getElementById("signup-fail");
        node.innerHTML = "Blank fields not accepted.";
        return;
    }
    if(!validateEmail(email))
    {
        const node = document.getElementById("signup-fail");
        node.innerHTML = "Please give correct Email id.";
        return;
    }
    if(password.length<10)
    {
        const node = document.getElementById("signup-fail");
        node.innerHTML = "Please choose a strong password";
        return;
    }

    if (cpass !== password) {
        const node = document.getElementById("signup-fail");
        node.innerHTML = "Passwords do not match.";
        return;
    }

    const userdata = { username: userId, email: email, hash: hash(password) };

    db.collection("signin")
        .doc(userId)
        .set(userdata)
        .then(() => {
            window.open("index.html", "_self");
        });
    return;
}

function signin() {
    const input = document.getElementById("inputEmail");
    const pass = document.getElementById("inputPassword");

    db.collection("signin")
        .doc(input.value)
        .get()
        .then(function (doc) {
            if (doc.exists) {
                const cpass = doc.data().hash;
                if (cpass !== hash(pass.value))
                {
                  const node = document.getElementById("AuthFail");
                  node.innerHTML = "Wrong Password.";
                  return;
                }
                localStorage.setItem("username", input.value);
                window.open("main.html", "_self");
            } else {
                const node = document.getElementById("AuthFail");
                node.innerHTML = "Invalid Username or Password.";
            }
        })
        .catch(function (error) {
            console.log("Error getting document:", error);
        });

    return;
}

try {
    const signupButton = document.getElementById("signup-button");
    signupButton.onclick = signup;
} catch {}

try {
    const loginButton = document.getElementById("login-button");
    loginButton.onclick = signin;
} catch {}
