function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let user = {username, password};

    $.ajax({
        type: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: 'http://localhost:8080/login',
        data: JSON.stringify(user),
        success: function (data) {
            if (data != null) {
                localStorage.setItem("user", JSON.stringify(data));
                window.location = "home.html";
            }
        },
        error: function (err) {
            checkUser(user);
        }
    });
}

function checkEmpty(user) {

    if (!user.username) {
        document.getElementById("username-fail").style.color = "red";
        document.getElementById("username-fail").innerHTML = "Tên đăng nhập không được để trống";
    }
    if (!user.password) {
        document.getElementById("password-fail").style.color = "red";
        document.getElementById("password-fail").innerHTML = "Mật khẩu không được để trống";
    }
}

function checkUser(user) {
    checkEmpty(user);
    if (user.username && user.password) {
        $.ajax({
            type: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            url: 'http://localhost:8080/login/fail',
            data: JSON.stringify(user),
            success: function (data) {
                if (data.includes("username")) {
                    document.getElementById("username-fail").style.color = "red";
                    document.getElementById("username-fail").innerHTML = "Sai tên đăng nhập";
                }
                if (data.includes("password")) {
                    document.getElementById("password-fail").style.color = "red";
                    document.getElementById("password-fail").innerHTML = "Sai mật khẩu";
                }
                console.log(data);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}


function showRegister() {
    window.location = "register.html";
}

