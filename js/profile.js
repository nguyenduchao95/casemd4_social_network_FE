async function showProfileById() {
    let userIdCurrent = getParamFromCurrentURL("id");
    if (userIdCurrent) {
        let checkBlock = await checkUserBlock(userIdCurrent, userLogin.id);
        if (!checkBlock) getProfile(userIdCurrent);
    }
    else getProfile(userLogin.id);
}

showProfileById().then();
function getParamFromCurrentURL(paramName) {
    let url = new URL(window.location.href);
    return url.searchParams.get(paramName);
}
async function showInfo(user) {
    let name = user.firstName + " " + user.lastName;
    let imageUser = "img/profile/" + user.image;
    let usersFollow = await getAllUserFollower(user.id);
    let usersFollowing = await getAllUserFollowing(user.id);
    let posts = await getAllPostsByUser(user.id);
    let checkFollow = await checkUserFollow(userLogin.id, user.id);
    let checkBlock = await checkUserBlock(userLogin.id, user.id);
    let htmls = `
                            <div class="col-4 d-flex justify-content-end align-items-start">
                                <img src="${imageUser}" class="img-thumbnail rounded-circle my-3" style="height:170px; width: 170px" alt="">
                            </div>
                            <div class="col-8">
                                <div class="d-flex flex-column">
                                    <div class="d-flex gap-5 align-items-center">
                                        <span style="font-size: xx-large;">${name}</span>
                                        <div class="dropdown">
                                                <span class="" style="font-size:xx-large" type="button" id="dropdownMenuButton1"
                                                      data-bs-toggle="dropdown" aria-expanded="false"><i
                                                        class="bi bi-three-dots"></i> </span>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                <li><a class="dropdown-item" href="#"><i class="bi bi-chat-fill me-2"></i>Tin nhắn</a></li>
                                                ${checkBlock && userLogin.id !== user.id ?
                                                    `<li><span class="dropdown-item pointer" onclick='handleBlockProfile(${JSON.stringify(user)})'><i class="bi bi-x-circle-fill me-2"></i>Bỏ chặn</span></li>` :
                                                    userLogin.id !== user.id ?
                                                    `<li><span class="dropdown-item pointer" onclick='handleBlockProfile(${JSON.stringify(user)})'><i class="bi bi-x-circle-fill me-2"></i>Chặn</span></li>` :
                                                    ""
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                    <span style="font-size: larger;" class="text-secondary">${user.username}</span>
                                    <div class="d-flex gap-2 align-items-center my-3">
                                        <button class="btn btn-sm btn-primary"><i class="bi bi-file-post-fill"></i><span class="quantity-post ms-2">${posts.length}</span> bài viết</button>
                                        <button class="btn btn-sm btn-primary"><i class="bi bi-people-fill"></i><span class="quantity-user-follower ms-2">${usersFollow.length}</span> người theo dõi</button>
                                        <button class="btn btn-sm btn-primary"><i class="bi bi-person-fill"></i><span class="quantity-user-following ms-2">${usersFollowing.length}</span> người đang theo dõi</button>
                                    </div>
                                    <div class="d-flex gap-2 align-items-center my-1">
                                        ${checkFollow && userLogin.id !== user.id ? 
                                            `<button class="btn btn-sm btn-danger" onclick='handleFollowProfile(${JSON.stringify(user)})'>Bỏ theo dõi</button>` :
                                            checkBlock && userLogin.id !== user.id ?
                                                `<button class="btn btn-sm btn-danger" onclick='handleBlockProfile(${JSON.stringify(user)})'>Bỏ chặn</button>` :
                                            userLogin.id !== user.id ?
                                            `<button class="btn btn-sm btn-primary" onclick='handleFollowProfile(${JSON.stringify(user)})'>Theo dõi</button>` :
                                            ""
                                        }
                                    </div>
                                </div>
                            </div>
                        `
    $('.profile-info').html(htmls);
}

function showAllPostsUser(posts) {
    let htmls = posts.map(post=>{
        let imagePost = "img/posts/" + post.img;
        return `
                    <img src="${imagePost}" width="300px" class="rounded" alt="" onclick='showPostById(${JSON.stringify(post)})'/>
        `
    })

    $('.gallery').html(htmls);
}

function getProfile(userId) {
    if (userId === userLogin.id){
        showInfo(userLogin).then();
    } else {
        $.ajax({
            url: "http://localhost:8080/users/" + userId,
            type: "GET",
            headers:{
                "Authorization": "Bearer " + userLogin.token
            },
            dataType: "json",
            success: function (user) {
                showInfo(user).then();
            }
        })
    }

    $.ajax({
        url: "http://localhost:8080/posts/users/" + userId,
        type: "GET",
        headers:{
            "Authorization": "Bearer " + userLogin.token
        },
        dataType: "json",
        success: function (posts) {
            showAllPostsUser(posts);
        }
    })
}

function getAllUserFollower(userId) {
    return $.ajax({
        url: "http://localhost:8080/follows/" + userId,
        type: "GET",
        headers:{
            "Authorization": "Bearer " + userLogin.token
        },
        dataType: "json"
    })
}

function getAllUserFollowing(userId) {
    return $.ajax({
        url: `http://localhost:8080/follows/${userId}/following`,
        type: "GET",
        headers:{
            "Authorization": "Bearer " + userLogin.token
        },
        dataType: "json"
    })
}

function getAllPostsByUser(userId) {
    return $.ajax({
        url: "http://localhost:8080/posts/users/" + userId,
        type: "GET",
        headers:{
            "Authorization": "Bearer " + userLogin.token
        },
        dataType: "json"
    })
}

function showPostById(post) {
    showPostProfileModal();
    $('.post-profile-comment').removeAttr('id');
    $('.post-profile-comment').attr("id", "card-comment-" + post.id);
    $('.input-post-profile').removeAttr('id');
    $('.input-post-profile').attr("id", "input-comment-" + post.id);
    $('.image-post-profile').attr("src", "img/posts/" + post.img);
    showComment(post.id).then();
    showProfilePostContent(post, post.user.id).then();
    showImageAndNameUserPost(post.user);
    $('.btn-post-profile').on('click', function (){
        postComment(post.id);
    })
}

async function showProfilePostContent(post, userId) {
    let likes = await countLikes(post.id);
    let comments = await getComments(post.id);
    let checkLiked = await checkLikedPost(post.id, userId);
    let htmls = `
                            <p class="px-2 m-0 fs-5">${post.content}</p>
                            <h4 class="p-2 m-0 border-bottom d-flex align-items-center">
                                <i class="${checkLiked ? 'bi bi-heart-fill pointer' : 'bi bi-heart pointer'}" onclick="handleAction(this, ${post.id}, ${userId})"></i>
                                <span class="ms-2 text-secondary fs-5 quantity-like-${post.id}">${likes}</span>
                                <i class="bi bi-chat-left ms-5 pointer"></i>
                                <span class="ms-2 text-secondary fs-5 quantity-comment-${post.id}">${comments.length}</span>
                            </h4>
                        `
    $('.profile-post-content').html(htmls);
}

function showImageAndNameUserPost(user) {
    let name = user.firstName + " " + user.lastName;
    let imageUser = "img/profile/" + user.image;
    let htmls = `
                            <div><img src="${imageUser}" alt="" height="60" class="rounded-circle border">
                            </div>
                            <div>&nbsp;&nbsp;&nbsp;</div>
                            <div class="d-flex flex-column justify-content-center">
                                <h6 style="margin: 0;">${name}</h6>
                                <p style="margin:0;" class="text-muted">${user.username}</p>
                            </div>
                        `
    $('.profile-user-post').html(htmls);
}

function handleFollowProfile(user) {
    $.ajax({
        url: `http://localhost:8080/follows/${userLogin.id}/${user.id}`,
        type: "POST",
        headers: {
            "Authorization": "Bearer " + userLogin.token
        },
        success: function (res) {
            showInfo(user).then();
        }
    })
}

function checkUserBlock(userId, userBlockId) {
    return $.ajax({
        url: `http://localhost:8080/blocks/${userId}/${userBlockId}`,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + userLogin.token
        },
        dataType: "json"
    })
}
function handleBlockProfile(user) {
    $.ajax({
        url: `http://localhost:8080/blocks/${userLogin.id}/${user.id}`,
        type: "POST",
        headers: {
            "Authorization": "Bearer " + userLogin.token
        },
        success: function (res) {
            showInfo(user).then();
        }
    })
}