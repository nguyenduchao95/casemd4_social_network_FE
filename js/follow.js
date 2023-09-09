function getUnfollowedUsers() {
    let userId = 3;
    $.ajax({
        url: `http://localhost:8080/follows/${userId}/unfollow`,
        type: "GET",
        dataType: "json",
        success: function (users) {
            showUnFollowedUsers(users);
        }
    })
}

getUnfollowedUsers();

async function showUnFollowedUsers(users) {
    let htmls = '<h6 class="text-muted p-2">Bạn có thể biết họ</h6>';
    for (const user of users) {
        let name = user.firstName + " " + user.lastName;
        let imageUser = "../img/profile/" + user.image;
        htmls += `
                        <div class="d-flex justify-content-between">
                            <div class="d-flex align-items-center p-2">
                                <div><img src="${imageUser}" alt="" height="40" class="rounded-circle border"></div>
                                <div>&nbsp;&nbsp;</div>
                                <div class="d-flex flex-column justify-content-center">
                                    <h6 style="margin: 0;font-size: small;">${name}</h6>
                                    <p style="margin:0;font-size:small" class="text-muted">${user.username}</p>
                                </div>
                            </div>
                            <div class="d-flex align-items-center">
                                <button class="btn btn-sm btn-primary btn-follow" onclick="handleFollow(${user.id})">Theo dõi</button>
                            </div>
                        </div>                 
                `
    }
    $('.unfollowed-users').html(htmls);
}

function checkUserFollow(userId, userFlId) {
    return $.ajax({
        url: `http://localhost:8080/follows/${userId}/${userFlId}`,
        type: "GET",
        dataType: "json"
    })
}

function handleFollow(userFlId) {
    let userId = 3;
    $.ajax({
        url: `http://localhost:8080/follows/${userId}/${userFlId}`,
        type: "POST",
        success: function (res) {
            getUnfollowedUsers();
        }
    })
}