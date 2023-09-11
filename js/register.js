function createUser() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let gender = document.querySelector('input[name="gender"]:checked').value;
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let form = new FormData();
    let file = document.getElementById("image").files[0];

    form.append("file", file);
    form.append("firstName", firstName);
    form.append("lastName", lastName);
    form.append("gender", gender);
    form.append("email", email);
    form.append("username", username);
    form.append("password", password);

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/registers",
        data: form,
        contentType: false,
        processData: false,
        success: function (res) {
            window.location.href = "login.html";
        }
    })
}

function showImageRegister() {
    let [file] = document.getElementById('image').files;
    if (file) {
        $("#fileImg").attr("src", URL.createObjectURL(file));
    }
}