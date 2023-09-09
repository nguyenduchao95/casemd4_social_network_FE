function getModal() {
    let htmls = `
                        <div class="modal fade" id="modal-post">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h4 class="modal-title modal-title-post">Bài viết mới</h4>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <label class="w-100" style="height: 250px; overflow: hidden" for="image-url">
                                            <img src="../img/icon-add-image.png" class="h-100 w-100 rounded border show-img" style="object-fit: contain" alt="">
                                        </label>
                                        <div>
                                            <input type="file" id="image-url" onchange="showImage()" hidden="hidden">
                                            <div class="mb-2 mt-2">
                                                <textarea class="form-control" id="content" rows="3" placeholder="Nhập suy nghĩ của bạn"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                        <button type="button" class="btn btn-primary btn-save" onclick="handleSavePost()">Lưu</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="modal" id="modal-confirm">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Xác nhận xóa</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <p>Bạn chắc chắn chứ ?</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-primary btn-delete">Xác nhận</button>
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="modal fade" id="modal-post-profile">
                            <div class="modal-dialog modal-xl modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-body d-flex p-0">
                                        <div class="col-8" style="height: 550px; overflow: hidden">
                                            <img src="../img/posts/54_Cute-Girl-Pic.jpg" class="w-100 rounded-start image-post-profile" alt="">
                                        </div>
                                        <div class="col-4 d-flex flex-column">
                                            <div class="d-flex align-items-center p-2 border-bottom profile-user"></div>
                                            <div class="profile-post-content"></div>
                                            <div class="flex-fill align-self-stretch overflow-auto" style="height: 100px;">
                                                <div class="post-profile-comment"></div>
                                            </div>
                                            <div class="input-group p-2 border-top">
                                                <input type="text" class="form-control rounded-0 border-0 input-post-profile shadow-none" placeholder="Viết bình luận...">
                                                <button class="btn btn-outline-primary rounded-0 border-0 btn-post-profile" type="button">Gửi</button>
                                            </div>
                                        </div>
                                    </div>
                        
                                </div>
                            </div>
                        </div>
                       `
    $('#modal').html(htmls);
}

getModal();

function showImage() {
    let [file] = document.getElementById('image-url').files;
    if (file) {
        $(".show-img").attr("src", URL.createObjectURL(file));
    }
}

function showPostModal() {
    let modal = $("#modal-post");
    bootstrap.Modal.getOrCreateInstance(modal).show();
}

function hidePostModal() {
    let modal = $("#modal-post");
    bootstrap.Modal.getOrCreateInstance(modal).hide();
}

function showConfirmModal() {
    let modal = $("#modal-confirm");
    bootstrap.Modal.getOrCreateInstance(modal).show();
}

function hideConfirmModal() {
    let modal = $("#modal-confirm");
    bootstrap.Modal.getOrCreateInstance(modal).hide();
}

function showPostProfileModal() {
    let modal = $("#modal-post-profile");
    bootstrap.Modal.getOrCreateInstance(modal).show();
}

function hidePostProfileModal() {
    let modal = $("#modal-post-profile");
    bootstrap.Modal.getOrCreateInstance(modal).hide();
}