function checkEmail() {
    let email = document.getElementById("email").value;
    if (!email) {
        document.getElementById("email-err").innerHTML = "Vui lòng nhập email";
    } else {
        let emailCheck = {email};
        $.ajax({
            type: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            url: "http://localhost:8080/forgot-password/check-email",
            data: JSON.stringify(emailCheck),
            success: function (response) {
                window.location = "forgot_password.html?email=" + email;
            },
            error: function (err) {
                document.getElementById("email-err").innerHTML = "Email không tồn tại";
            }
        })
    }

}


function checkCode() {

    let token = document.getElementById("code").value;
    if (token) {
        let codeToken = {token};
        $.ajax({
            type: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            url: "http://localhost:8080/forgot-password/check-code",
            data: JSON.stringify(codeToken),
            success: function (response) {
                document.getElementById("code-err").innerHTML = "Mã xác thực hợp lệ , hãy nhập mật khẩu mới";
            },
            error: function (err) {
                console.log(err);
                document.getElementById("code-err").innerHTML = "Mã hợp không hợp lệ";
            }
        })
    }

}


function resetPassword() {
    let email = getParamFromCurrentURL("email");
    let token = document.getElementById("reset-password").value;
    let code = document.getElementById("code").value;
    if (!code) {
        document.getElementById("code-err").innerHTML = "Hãy nhập mã xác thực";
    }
    if (!token) {
        document.getElementById("password-err").innerHTML = "Hãy nhập mật khẩu mới";
    }
    if (code && token) {
        let newPassword = {email, token};
        let codeToken = {token: code};
        $.ajax({
            type: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            url: "http://localhost:8080/forgot-password/check-code",
            data: JSON.stringify(codeToken),
            success: function (response) {
                console.log(newPassword)
                $.ajax({
                    type: "POST",
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    },
                    url: "http://localhost:8080/forgot-password/reset",
                    data: JSON.stringify(newPassword),
                    success: function (data) {
                        alert("Thay đổi mật khẩu thành công ");
                        window.location.href = "login.html";
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            },
            error: function (err) {
                document.getElementById("code-err").innerHTML = "Mã không hợp lệ";
            }
        })
    }
}

function checkEmpty() {
    let email = document.getElementById("email").value;
    let token = document.getElementById("code").value;

    if (!email) {
        document.getElementById("email-err").innerHTML = "Vui lòng nhập email";
    }
    if (!token) {
        document.getElementById("code-err").innerHTML = "Hãy nhập mã xác thực";
    }
}

function getParamFromCurrentURL(paramName) {
    let url = new URL(window.location.href);
    return url.searchParams.get(paramName);
}