function showHeader() {
    let htmls = `
                        <nav class="navbar navbar-expand-lg navbar-light bg-white border">
                            <div class="container col-9 d-flex justify-content-between">
                                <div class="d-flex justify-content-between col-8">
                                    <a class="navbar-brand" href="http://localhost:63343/case_social_FE/home.html">
                                        <img src="./img/pictogram.png" alt="" height="28">
                                    </a>
                        
                                    <div class="d-flex align-items-center border border-dark-subtle search px-2">
                                        <span><i class="bi bi-search"></i></span>
                                        <input class="form-control me-2 shadow-none border-0" type="search" placeholder="Tìm kiếm người dùng...">
                                    </div>
                        
                                </div>
                        
                                <ul class="navbar-nav  mb-2 mb-lg-0">
                        
                                    <li class="nav-item">
                                        <a class="nav-link text-dark" href="http://localhost:63343/case_social_FE/home.html" title="Trang chủ"><i class="bi bi-house-door-fill"></i></a>
                                    </li>
                                    <li class="nav-item">
                                        <span class="nav-link text-dark pointer" onclick="showFormAdd()" title="Đăng bài"><i class="bi bi-plus-square-fill"></i></span>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link text-dark" href="#"><i class="bi bi-bell-fill" title="Thông báo"></i></a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link text-dark" href="#"><i class="bi bi-chat-right-dots-fill" title="Tin nhắn"></i></a>
                                    </li>
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                           data-bs-toggle="dropdown" aria-expanded="false">
                                            <img src="./img/profile.jpg" alt="" height="30" class="rounded-circle border">
                                        </a>
                                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><a class="dropdown-item" href="http://localhost:63343/case_social_FE/profile.html">Trang cá nhân</a></li>
                                            <li><a class="dropdown-item" href="#">Cài đặt tài khoản</a></li>
                                            <li>
                                                <hr class="dropdown-divider">
                                            </li>
                                            <li><a class="dropdown-item" href="#">Đăng xuất</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                        
                        `
    $('.header').html(htmls);
}

showHeader();