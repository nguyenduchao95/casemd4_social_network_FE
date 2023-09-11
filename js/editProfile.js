function showImg() {
    let imgUp = document.getElementById("imageE").value;
    if (imgUp) {
        document.getElementById('imageNow').src = "img/profile/" + imgUp;
    }
}

let user = JSON.parse(localStorage.getItem("user"));

function showUserEdit() {
    $("#firstNameE").val(user.firstName);
    $("#lastNameE").val(user.lastName);
    $("#emailE").val(user.email);
    $("#usernameE").val(user.username);
    $("#imageNow").src = "/img/profile/" + user.image;
    if (user.gender === 'true') $('#maleGender').attr('checked', true);
    else $('#femaleGender').attr('checked', true);
}

showUserEdit();

function editProfile() {
    let firstName = document.getElementById("firstNameE").value;
    let lastName = document.getElementById("lastNameE").value;
    let gender = document.querySelector('input[name="genderE"]:checked').value;
    let email = document.getElementById("emailE").value;
    let username = document.getElementById("usernameE").value;

    let form = new FormData();
    let file = document.getElementById("imageE").files[0];

    form.append("file", file);
    form.append("firstName", firstName);
    form.append("lastName", lastName);
    form.append("gender", gender);
    form.append("email", email);
    form.append("username", username);
    console.log(file)
    $.ajax({
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + user.token
        },
        url: 'http://localhost:8080/users/edit/' + user.id,
        data: form,
        contentType: false,
        processData: false,
        success: function (res) {
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.gender = gender;
            if (file) user.image =file.name;
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "home.html";
        }
    })
}

function showImageEditProfile() {
    let [file] = document.getElementById('imageE').files;
    if (file) {
        $("#imageNow").attr("src", URL.createObjectURL(file));
    }
}