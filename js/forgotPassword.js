function checkEmail() {

    let email = document.getElementById("email").value;
    if (email === ""){
        document.getElementById("email-err").style.color = "red";
        document.getElementById("email-err").innerHTML = "Vui lòng nhập email";
    }else {
        document.getElementById("email-err").style.color = "#fc9003";
        document.getElementById("email-err").innerHTML = "Vào email của bạn để lấy mã xác thực";
        let emailCheck = {email};
        $.ajax({
            type : "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            url : "http://localhost:8080/forgot-password/check-email",
            data: JSON.stringify(emailCheck),
            success : function (response) {
                let tokenPassword = response.token;
                console.log(tokenPassword);
                document.getElementById("passwordToken").value = tokenPassword;
            },
            error : function (err) {
                console.log(err);
                alert("email id wrong");
            }
        })
    }

}


function checkCode() {

   let token  = document.getElementById("code").value;
   if (token === ""){
       document.getElementById("code-err").style.color = "red";
       document.getElementById("code-err").innerHTML = "Hãy nhập mã xác thực";
   }else {
       let codeToken = {token};

       $.ajax({
           type : "POST",
           headers: {
               'Accept': 'application/json',
               "Content-Type": "application/json"
           },
           url : "http://localhost:8080/forgot-password/check-code",
           data: JSON.stringify(codeToken),
           success : function (response) {
               document.getElementById("code-err").style.color = "#fc9003";
               document.getElementById("code-err").innerHTML = "Mã xác thực hợp lệ , hãy nhập mật khẩu mới";
           },
           error : function (err) {
               console.log(err);
               document.getElementById("code-err").style.color = "red";
               document.getElementById("code-err").innerHTML = "Mã hợp không hợp lệ";
           }
       })
   }

}


function resetPassword() {
    checkEmpty()
    let email = document.getElementById("email").value;
    let token = document.getElementById("reset-password").value;
        if (token === ""){
            document.getElementById("password-err").style.color = "red";
            document.getElementById("password-err").innerHTML = "Mật khẩu không được để trống";
        }else {
            let newPassword = { email:email , token};
            $.ajax({
                type : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                url : "http://localhost:8080/forgot-password/reset",
                data: JSON.stringify(newPassword),
                success : function (data) {
                    console.log(data);
                    alert("Thay đổi mật khẩu thành công ");
                    window.location.href = "login.html";
                },
                error : function (err) {
                    console.log(err);
                }
            })
        }



}

function checkEmpty() {
    let email = document.getElementById("email").value;
    let token  = document.getElementById("code").value;

    if (email === ""){
        document.getElementById("email-err").style.color = "red";
        document.getElementById("email-err").innerHTML = "Vui lòng nhập email";
    }
    if (token === ""){
        document.getElementById("code-err").style.color = "red";
        document.getElementById("code-err").innerHTML = "Hãy nhập mã xác thực";
    }
}