function createUser() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let gender = document.querySelector('input[name="gender"]:checked').value;
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let image = document.getElementById("image").value;
    let user = { firstName , lastName ,  gender , email ,username , password , image};

    /*$.ajax({
        type : "POST",
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url : 'http://localhost:8080/registers',
        data: JSON.stringify(user),
        success : function (response) {
            console.log(response);
            window.location= "login.html";
        },
        error : function (err) {
            console.log(err);
        }
    });*/
    var settings = {
        "url": "http://localhost:8080/registers",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify(user),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        alert("Success")
        window.location.href = "login.html";

    }).fail(function (error) {
        alert("dang ki that bai");
    })
}