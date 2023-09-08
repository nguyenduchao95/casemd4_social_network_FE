async function showInfo(user) {
    let usersFollow = await getAllUserFollower(user.id);
    let usersFollowing = await getAllUserFollowing(user.id);
    let posts = await getAllPostByUser(user.id);
    let htmls = `
                            <div class="col-4 d-flex justify-content-end align-items-start">
                                <img src="img/profile.jpg" class="img-thumbnail rounded-circle my-3" style="height:170px;" alt="">
                            </div>
                            <div class="col-8">
                                <div class="d-flex flex-column">
                                    <div class="d-flex gap-5 align-items-center">
                                        <span style="font-size: xx-large;">Monu Giri</span>
                                        <div class="dropdown">
                                                <span class="" style="font-size:xx-large" type="button" id="dropdownMenuButton1"
                                                      data-bs-toggle="dropdown" aria-expanded="false"><i
                                                        class="bi bi-three-dots"></i> </span>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                <li><a class="dropdown-item" href="#"><i class="bi bi-chat-fill me-2"></i>Tin nhắn</a></li>
                                                <li><a class="dropdown-item" href="#"><i class="bi bi-x-circle-fill me-2"></i>Chặn</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <span style="font-size: larger;" class="text-secondary">@oyeitsmg</span>
                                    <div class="d-flex gap-2 align-items-center my-3">
                                        <a class="btn btn-sm btn-primary"><i class="bi bi-file-post-fill"></i><span class="quantity-post ms-2">${posts.length}</span> bài viết</a>
                                        <a class="btn btn-sm btn-primary"><i class="bi bi-people-fill"></i><span class="quantity-user-follower ms-2">${usersFollow.length}</span> người theo dõi</a>
                                        <a class="btn btn-sm btn-primary"><i class="bi bi-person-fill"></i><span class="quantity-user-following ms-2">${usersFollowing.length}</span> người đang theo dõi</a>
                                    </div>
                                    <div class="d-flex gap-2 align-items-center my-1">
                                        <a class="btn btn-sm btn-danger">Bỏ theo dõi</a>
                                    </div>
                                </div>
                            </div>
                        `
    $('.profile-info').html(htmls);
}

function showAllPostsUser(posts) {
    let htmls = posts.map(post=>{
        return `
                    <img src="${post.img}" width="300px" class="rounded" alt=""/>
        `
    })

    $('.gallery').html(htmls);
}

function getProfile(userId) {
    let user = {
        "id": 3,
        "firstName": "Test",
        "lastName": "Kumar",
        "gender": true,
        "username": "testman",
        "email": "test@gmail.com",
        "password": "e10adc3949ba59abbe56e057f20f883e",
        "image": "https://i0.wp.com/smsforwishes.com/wp-content/uploads/2022/10/295796118_183131174113327_4425310181760767822_n.jpeg",
        "created_at": "2021-11-30T03:45:35",
        "updated_at": "2021-11-30T03:50:33"
    }
    showInfo(user);
    $.ajax({
        url: "http://localhost:8080/posts/users/" + userId,
        type: "GET",
        dataType: "json",
        success: function (posts) {
            showAllPostsUser(posts);
        }
    })
}

getProfile(3);

function getAllUserFollower(userId) {
    return $.ajax({
        url: "http://localhost:8080/follows/" + userId,
        type: "GET",
        dataType: "json"
    })
}

function getAllUserFollowing(userId) {
    return $.ajax({
        url: `http://localhost:8080/follows/${userId}/following`,
        type: "GET",
        dataType: "json"
    })
}

function getAllPostByUser(userId) {
    return $.ajax({
        url: "http://localhost:8080/posts/users/" + userId,
        type: "GET",
        dataType: "json"
    })
}