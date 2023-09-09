async function showInfo(user) {
    let name = user.firstName + " " + user.lastName;
    let imageUser = "../img/profile/" + user.image;
    let usersFollow = await getAllUserFollower(user.id);
    let usersFollowing = await getAllUserFollowing(user.id);
    let posts = await getAllPostsByUser(user.id);
    let htmls = `
                            <div class="col-4 d-flex justify-content-end align-items-start">
                                <img src="${imageUser}" class="img-thumbnail rounded-circle my-3" style="height:170px;" alt="">
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
                                                <li><a class="dropdown-item" href="#"><i class="bi bi-x-circle-fill me-2"></i>Chặn</a></li>
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
                                        <button class="btn btn-sm btn-danger">Bỏ theo dõi</button>
                                    </div>
                                </div>
                            </div>
                        `
    $('.profile-info').html(htmls);
}

function showAllPostsUser(posts) {
    let htmls = posts.map(post=>{
        let imagePost = "../img/posts/" + post.img;
        return `
                    <img src="${imagePost}" width="300px" class="rounded" alt="" onclick='showPostById(${JSON.stringify(post)})'/>
        `
    })

    $('.gallery').html(htmls);
}

function getProfile(userId) {
    let user = {
        id: 3,
        firstName: "Test",
        lastName: "Kumar",
        gender: true,
        username: "testman",
        email: "test@gmail.com",
        password: "e10adc3949ba59abbe56e057f20f883e",
        image: "girl-anime-wallaper-25.jpg",
        created_at: "2021-11-30T03:45:35",
        updated_at: "2021-11-30T03:50:33"
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

function getAllPostsByUser(userId) {
    return $.ajax({
        url: "http://localhost:8080/posts/users/" + userId,
        type: "GET",
        dataType: "json"
    })
}

function showPostById(post) {
    showPostProfileModal();
    $('.post-profile-comment').removeAttr('id');
    $('.post-profile-comment').attr("id", "card-comment-" + post.id);
    $('.input-post-profile').removeAttr('id');
    $('.input-post-profile').attr("id", "input-comment-" + post.id);
    $('.image-post-profile').attr("src", "../img/posts/" + post.img);
    showComment(post.id).then();
    showProfilePostContent(post.id, 3).then();
    $('.btn-post-profile').on('click', function (){
        postComment(post.id);
    })
}

async function showProfilePostContent(postId, userIdLogin) {
    let likes = await countLikes(postId);
    let comments = await getComments(postId);
    let checkLiked = await checkLikedPost(postId, userIdLogin);
    let htmls = `
                            <p class="px-2 m-0 fs-5">abccde</p>
                            <h4 class="p-2 m-0 border-bottom d-flex align-items-center">
                                <i class="${checkLiked ? 'bi bi-heart-fill pointer' : 'bi bi-heart pointer'}" onclick="handleAction(this, ${postId}, ${userIdLogin})"></i>
                                <span class="ms-2 text-secondary fs-5 quantity-like-${postId}">${likes}</span>
                                <i class="bi bi-chat-left ms-5 pointer"></i>
                                <span class="ms-2 text-secondary fs-5 quantity-comment-${postId}">${comments.length}</span>
                            </h4>
                        `
    $('.profile-post-content').html(htmls);
}