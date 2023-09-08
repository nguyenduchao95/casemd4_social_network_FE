function init() {
    let userId = 3;
    $.ajax({
        url: "http://localhost:8080/posts/" + userId,
        type: "GET",
        dataType: "json",
        success: function (posts) {
            showPosts(posts, userId);
        }
    })
}

async function showPosts(posts, userIdLogin) {
    let htmls = "";
    for (const post of posts) {
        let name = post.user.firstName + " " + post.user.lastName;
        let likes = await countLikes(post.id);
        let comments = await getComments(post.id);
        let elapsedHTML = pastTime(post.created_at);
        let checkLiked = await checkLikedPost(post.id, 3);
        let image = "../img/posts/" + post.img;
        htmls += `
                   <div class="card mt-4">
                        <div class="card-title d-flex justify-content-between  align-items-center">
                            <div class="d-flex align-items-center p-2">
                                <img src="${post.user.image}" alt="" height="30" class="rounded-circle border">&nbsp;&nbsp;
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
            `<li class="dropdown-item pointer" onclick="handleHide(${post.id})"><i class="bi bi-file-earmark-excel me-2"></i>Ẩn bài viết</li><li class="dropdown-item pointer" onclick="handleUnF(${post.id})"><i class="bi bi-person-dash me-2"></i>Bỏ theo dõi</li>`
        }
                            </ul>
                        </div>
                        <img src="${image}" class="" alt="...">
                        <h4 class="p-2 border-bottom d-flex align-items-center">
                            <i class="${checkLiked ? 'bi bi-heart-fill pointer' : 'bi bi-heart pointer'}" onclick="handleAction(this, ${post.id}, ${userIdLogin})"></i>
                            <span class="ms-2 text-secondary fs-5 quantity-like-${post.id}">${likes}</span>
                            <i class="bi bi-chat-left ms-5 pointer" onclick="showComment(${post.id})"></i>
                            <span class="ms-2 text-secondary fs-5 quantity-comment-${post.id}">${comments.length}</span>
                        </h4>
                        <div class="card-body">
                            ${post.content}
                        </div>
                        
                        <div class="card-comment-${post.id}"></div>
            
                        <div class="input-group p-2 border-top">
                            <input type="text" class="form-control rounded-0 border-0 shadow-none input-comment-${post.id}" placeholder="Viết bình luận..." >
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
        dataType: "json",
        success: function (count) {

        }
    })
}

function checkLikedPost(postId, userId) {
    return $.ajax({
        url: `http://localhost:8080/likes/${postId}/${userId}`,
        type: "GET",
        dataType: "json"
    })
}

function getComments(postId) {
    return $.ajax({
        url: `http://localhost:8080/cmt/${postId}`,
        type: "GET",
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
    //call api
    let comments = await getComments(postId)
    if (comments.length) {
        let htmls = comments.map((comment, index) => {
            let elapsedHTML = pastTime(comment.created_at);
            let name = comment.user.firstName + " " + comment.user.lastName;
            return `
                    <div class="card-title d-flex justify-content-between align-items-center mb-0">
                        <div class="d-flex p-2">
                            <img src="${comment.user.image}" alt="" height="30" class="rounded-circle border">
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
        $('.card-comment-' + postId).html(htmls);
        $('.card-comment-' + postId).addClass("border-top");
    }
}

function postComment(postId) {
    let comment = $('.input-comment-' + postId).val().trim();
    if (comment) {
        let tzOffset = (new Date()).getTimezoneOffset() * 60000;
        let localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, -1);
        let data = {comment, user: {id: 3}, created_at: localISOTime}
        console.log(data)
        $.ajax({
            url: "http://localhost:8080/cmt/" + postId,
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: async function (res) {
                showComment(postId);
                let comments = await getComments(postId);
                $('.quantity-comment-' + postId).text(comments.length);
            }
        })
        $('.input-comment-' + postId).val("");
    }
}

function handleSavePost() {
    let form = new FormData();
    let file = document.getElementById("image-url").files[0];
    let content = $("#content").val().trim();
    if (!file) $('#image-url').focus();
    else if (!content) $('#content').focus();

    if (file && content) {
        if (jQuery.isEmptyObject(post)) {
            let tzOffset = (new Date()).getTimezoneOffset() * 60000;
            let localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, -1);

            form.append("file", file);
            form.append("content", content);
            form.append("created_at", localISOTime);

            $.ajax({
                type: "Post",
                url: "http://localhost:8080/posts/" + 3,
                data: form,
                contentType: false,
                processData: false,
                success: function (res) {
                    init();
                }
            })
        } else {
            let data = {id: post.id, content, user: {id: 3}, created_at: post.created_at};

            $.ajax({
                url: "http://localhost:8080/posts/" + post.id,
                type: "PUT",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (res) {
                    init();
                }
            })
        }
        hidePostModal();
    }
}

let post = {};

function showFormEdit(postEdit) {
    post = {...postEdit};
    showPostModal();
    $('.modal-title-post').text("Sửa bài viết");
    $('.btn-save').text("Lưu");
    $('#image-url').val(postEdit.img);
    $('#content').val(postEdit.content);
    $(".show-img").attr("src", postEdit.img);
}

function showFormAdd() {
    post = {};
    showPostModal();
    $('.modal-title-post').text("Bài viết mới");
    $('.btn-save').text("Đăng");
    $('#image-url').val("");
    $('#content').val("");
    $(".show-img").attr("src", "../img/icon-add-image.png");
}

function confirmDelete(postId) {
    showConfirmModal();
    $('.btn-delete').on('click', function () {
        $.ajax({
            url: "http://localhost:8080/posts/" + postId,
            type: "DELETE",
            success: function (res) {
                init();
            }
        })
        hideConfirmModal();
    })
}


function save(userId) {
    let form = new FormData();
    let file = $("#image-url").files[0];
    let content = $("#content").val().trim();
    form.append("file", file);
    form.append("content", content);
    $.ajax({
        type: "Post",
        url: "http://localhost:8080/posts/" + userId,
        data: form,
        contentType: false,
        processData: false,
        success: function (data) {
            alert("ok")
        },
        error: function (err) {
            console.log(err)
        }
    })
}
