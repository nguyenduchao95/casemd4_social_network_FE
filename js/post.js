let userLogin = {};

function init() {
    userLogin = JSON.parse(localStorage.getItem("user"));
    $.ajax({
        url: "http://localhost:8080/posts/" + userLogin.id,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + userLogin.token
        },
        dataType: "json",
        success: function (posts) {
            showPosts(posts, userLogin.id).then();
        }
    })
    showImageAndNameUserLogin(userLogin);
}

async function showPosts(posts, userIdLogin) {
    let htmls = "";
    for (const post of posts) {
        let name = post.user.firstName + " " + post.user.lastName;
        let likes = await countLikes(post.id);
        let comments = await getComments(post.id);
        let elapsedHTML = pastTime(post.created_at);
        let checkLiked = await checkLikedPost(post.id, userIdLogin);
        let imagePost = "img/posts/" + post.img;
        let imageUser = "img/profile/" + post.user.image;
        htmls += `
                   <div class="card mt-4">
                        <div class="card-title d-flex justify-content-between  align-items-center">
                            <div class="d-flex align-items-center p-2">
                                <img src="${imageUser}" alt="" height="30" class="rounded-circle border">&nbsp;&nbsp;
                                <div class="d-flex flex-column">
                                    <span class="fw-bold">${name}</span>
                                    <span style="font-size: 13px">
                                        <span>${elapsedHTML}</span> 
                                        <i class="bi bi-dot"></i>
                                        <i class="bi bi-globe-asia-australia"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="p-2 dropdown-toggle pointer" id="dropdownPost" data-bs-toggle="dropdown">
                                <i class="bi bi-three-dots-vertical"></i>
                            </div>
                            <ul class="dropdown-menu" aria-labelledby="dropdownPost">
                                ${userIdLogin === post.user.id ?
            `<li class="dropdown-item pointer" onclick='showFormEdit(${JSON.stringify(post)})'><i class="bi bi-brush me-2"></i>Sửa bài viết</li><li class="dropdown-item pointer" onclick="confirmDelete(${post.id})"><i class="bi bi-trash me-2"></i>Xóa bài viết</li>`
            :
            `<li class="dropdown-item pointer" onclick="handleHide(${post.id})"><i class="bi bi-file-earmark-excel me-2"></i>Ẩn bài viết</li>
             <li class="dropdown-item pointer" onclick="handleFollow(${post.user.id})"><i class="bi bi-person-dash me-2"></i>Bỏ theo dõi</li>`
        }
                            </ul>
                        </div>
                        <img src="${imagePost}" class="" alt="...">
                        <h4 class="p-2 m-0 border-bottom d-flex align-items-center">
                            <i class="${checkLiked ? 'bi bi-heart-fill pointer' : 'bi bi-heart pointer'}" onclick="handleAction(this, ${post.id}, ${userIdLogin})"></i>
                            <span class="ms-2 text-secondary fs-5 quantity-like-${post.id}">${likes}</span>
                            <i class="bi bi-chat-left ms-5 pointer" onclick="showComment(${post.id})"></i>
                            <span class="ms-2 text-secondary fs-5 quantity-comment-${post.id}">${comments.length}</span>
                        </h4>
                        <div class="card-body card-body-${post.id}">
                            ${post.content}
                        </div>
                        
                        <div id="card-comment-${post.id}"></div>
            
                        <div class="input-group p-2 border-top">
                            <input type="text" class="form-control rounded-0 border-0 shadow-none" id="input-comment-${post.id}" placeholder="Viết bình luận..." >
                            <button class="btn btn-outline-primary rounded-0 border-0" onclick="postComment(${post.id})">Gửi</button>
                        </div>
                   </div>
        `
    }
    $('.posts').html(htmls);
}

init();

function pastTime(sqlDatetime) {
    let sqlTimestamp = new Date(sqlDatetime).getTime();
    let currentTime = new Date().getTime();
    let elapsedHTML;
    let elapsedMilliseconds = currentTime - sqlTimestamp;
    let years = Math.floor(elapsedMilliseconds / (86400000 * 365));
    let months = Math.floor(elapsedMilliseconds / (86400000 * 30));
    let weeks = Math.floor(elapsedMilliseconds / (86400000 * 7));
    let days = Math.floor(elapsedMilliseconds / (1000 * 60 * 60 * 24));
    let hours = Math.floor((elapsedMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((elapsedMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    if (years) elapsedHTML = years + " năm";
    else if (months) elapsedHTML = months + " tháng";
    else if (weeks) elapsedHTML = weeks + " tuần";
    else if (days) elapsedHTML = days + " ngày";
    else if (hours) elapsedHTML = hours + " giờ";
    else if (minutes) elapsedHTML = minutes + " phút";
    else elapsedHTML = " Vừa xong";
    return elapsedHTML;
}

function countLikes(postId) {
    return $.ajax({
        url: `http://localhost:8080/likes/${postId}/count`,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + userLogin.token
        },
        dataType: "json"
    })
}

function checkLikedPost(postId, userId) {
    return $.ajax({
        url: `http://localhost:8080/likes/${postId}/${userId}`,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + userLogin.token
        },
        dataType: "json"
    })
}

function getComments(postId) {
    return $.ajax({
        url: `http://localhost:8080/cmt/${postId}`,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + userLogin.token
        },
        dataType: "json"
    })
}

function handleAction(el, postId, userId) {
    if (el.className === "bi bi-heart pointer") {
        el.className = "bi bi-heart-fill pointer";
    } else {
        el.className = "bi bi-heart pointer";
    }

    $.ajax({
        url: `http://localhost:8080/likes/${postId}/${userId}`,
        type: "POST",
        headers: {
            "Authorization": "Bearer " + userLogin.token
        },
        success: async function (res) {
            let likes = await countLikes(postId);
            $('.quantity-like-' + postId).text(likes);
        },
        error: function (res) {
            console.log(res)
        }
    })
}

async function showComment(postId) {
    let comments = await getComments(postId);
    if (comments.length) {
        let htmls = comments.map(comment => {
            let elapsedHTML = pastTime(comment.created_at);
            let name = comment.user.firstName + " " + comment.user.lastName;
            let imageUser = "img/profile/" + comment.user.image;
            return `
                    <div class="card-title d-flex justify-content-between align-items-center mb-0">
                        <div class="d-flex p-2">
                            <img src="${imageUser}" alt="" height="30" class="rounded-circle border">
                            <div class="d-flex flex-column">
                                <div class="ms-2 p-2" style="background-color: #f1f1f1; border-radius: 6px">
                                    <h6 style="font-size: small;">${name}</h6>
                                    <span>
                                        ${comment.comment}
                                    </span>
                                </div>
                                <span class="ms-2 p-1" style="font-size: 13px">${elapsedHTML}</span> 
                            </div>
                        </div>
                        <div class="p-2">
                            <i class="bi bi-three-dots-vertical"></i>
                        </div>
                    </div>
            `
        })
        $('#card-comment-' + postId).html(htmls);
        $('.card-body-' + postId).addClass("border-bottom");
    } else {
        $('#card-comment-' + postId).html("");
    }
}

function postComment(postId) {
    let comment = $('#input-comment-' + postId).val();
    if (comment.trim()) {
        let tzOffset = (new Date()).getTimezoneOffset() * 60000;
        let localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, -1);
        let data = {comment, user: {id: userLogin.id}, created_at: localISOTime};
        $.ajax({
            url: "http://localhost:8080/cmt/" + postId,
            type: "POST",
            headers: {
                "Authorization": "Bearer " + userLogin.token
            },
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: async function (res) {
                showComment(postId).then();
                let comments = await getComments(postId);
                $('.quantity-comment-' + postId).text(comments.length);
            }
        })
        $('#input-comment-' + postId).val("");
    }
}

function handleSavePost() {
    let form = new FormData();
    let file = document.getElementById("image-url").files[0];
    let content = $("#content").val().trim();
    if (!content) $('#content').focus();


    if (jQuery.isEmptyObject(post)) {
        if (file && content) {
            let tzOffset = (new Date()).getTimezoneOffset() * 60000;
            let localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, -1);

            form.append("file", file);
            form.append("content", content);
            form.append("created_at", localISOTime);
            $.ajax({
                type: "POST",
                url: "http://localhost:8080/posts/" + userLogin.id,
                headers: {
                    "Authorization": "Bearer " + userLogin.token
                },
                data: form,
                contentType: false,
                processData: false,
                success: function (res) {
                    init();
                    hidePostModal();
                }
            })
        }
    } else {
        form.append("file", file);
        form.append("content", content);
        $.ajax({
            url: "http://localhost:8080/posts/" + post.id,
            type: "PUT",
            headers: {
                "Authorization": "Bearer " + userLogin.token
            },
            contentType: false,
            processData: false,
            data: form,
            success: function (res) {
                init();
                hidePostModal();
            }
        })
    }
}

let post = {};

function showFormEdit(postEdit) {
    post = {...postEdit};
    showPostModal();
    $('.modal-title-post').text("Sửa bài viết");
    $('.btn-save').text("Lưu");
    $('#content').val(postEdit.content);
    $(".show-img").attr("src", "img/posts/" + postEdit.img);
}

function showFormAdd() {
    post = {};
    showPostModal();
    $('.modal-title-post').text("Bài viết mới");
    $('.btn-save').text("Đăng");
    $('#image-url').val("");
    $('#content').val("");
    $(".show-img").attr("src", "img/icon-add-image.png");
}

function confirmDelete(postId) {
    showConfirmModal();
    $('.btn-delete').on('click', function () {
        $.ajax({
            url: "http://localhost:8080/posts/" + postId,
            type: "DELETE",
            headers: {
                "Authorization": "Bearer " + userLogin.token
            },
            success: function (res) {
                init();
            }
        })
        hideConfirmModal();
    })
}

function showImageAndNameUserLogin(user) {
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
    $('.profile-user').html(htmls);
}