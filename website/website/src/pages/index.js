import React from "react"
import QLXLayout from "../components/QLXLayout"
import imgLogo from "../../img/logo.png"
import imgPhone from "../../img/qlx/phone.png"
import img1 from "../../img/qlx/1.svg"
import img2 from "../../img/qlx/2.svg"
import img3 from "../../img/qlx/3.svg"
import imgManWalk from "../../img/qlx/man_walk.png"
import imgMobileScr from "../../img/qlx/mobile_screen.png"
import imgDraw from "../../img/qlx/draw.png"
import imgPhone2 from "../../img/qlx/phone2.png"

export default () => (
<QLXLayout>
    {/* <!-- slider_area_start --> */}
    <div class="slider_area">
        <div class="single_slider  d-flex align-items-center slider_bg_1">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-xl-7 col-md-6">
                        <div class="slider_text ">
                            <h3 class="wow fadeInDown" data-wow-duration="1s" data-wow-delay=".1s" >Quản Lý Ôtô Xe Máy</h3>
                            <p class="wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".1s">
                                Quản Lý Theo Cá Nhân hoặc Theo Đội Nhóm</p>
                            <div class="video_service_btn wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".1s">
                                <a href="#" class="boxed-btn3">Tải Về cho Android</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-5 col-md-6">
                        <div class="phone_thumb wow fadeInDown" data-wow-duration="1.1s" data-wow-delay=".2s">
                            <img src={imgPhone} alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/* <!-- slider_area_end -->
    <!-- service_area  --> */}
    <div class="service_area">
        <div class="container">
            <div class="row">
                <div class="col-xl-12">
                    <div class="section_title text-center  wow fadeInUp" data-wow-duration=".5s" data-wow-delay=".3s">
                        <h3>Quản Lý Xe Hiệu Qủa</h3>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-4">
                    <div class="single_service text-center wow fadeInUp" data-wow-duration=".6s" data-wow-delay=".4s">
                        <div class="thumb">
                                <img src={img2} alt=""/>
                        </div>
                        <h3>Quản Lý Tất Cả Xe Trong Nhóm</h3>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4">
                        <div class="single_service text-center wow fadeInUp" data-wow-duration=".7s" data-wow-delay=".5s">
                                <div class="thumb">
                                        <img src={img1} alt=""/>
                                </div>
                                <h3>Báo Cáo Sử Dụng Chi Tiết</h3>
                            </div>
                </div>
                <div class="col-lg-4 col-md-4">

                            <div class="single_service text-center wow fadeInUp " data-wow-duration=".8s" data-wow-delay=".6s">
                                <div class="thumb">
                                        <img src={img3} alt="" />
                                </div>
                                <h3>Đồng Bộ Với Server</h3>
                            </div>
                </div>
            </div>
        </div>
    </div>

    {/* <!-- service_area_2  --> */}
    <div class="service_area_2">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-xl-4 col-lg-4 col-md-6 wow fadeInLeft" data-wow-duration=".4s" data-wow-delay=".5s">
                    <div class="man_thumb">
                        <img src={imgManWalk} alt="" />
                    </div>
                </div>
                <div class="col-xl-5 offset-xl-1 col-lg-6 col-md-6 ">
                    <div class="mobile_screen wow fadeInRight" data-wow-duration=".8s" data-wow-delay=".5s">
                        <img src={imgMobileScr} alt="" />
                    </div>
                </div>
            </div>
            <div class="service_content_wrap">
                <div class="row">
                    <div class="col-lg-4 col-md-4">
                        <div class="single_service  wow fadeInUp" data-wow-duration=".5s" data-wow-delay=".3s">
                            <span>01</span>
                            <h3>Hoàn Toàn Miễn Phí</h3>
                            <p>Sử Dụng Thoải Mái, Miễn Phí Mãi Mãi.</p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4">
                        <div class="single_service  wow fadeInUp" data-wow-duration=".6s" data-wow-delay=".4s">
                            <span>02</span>
                            <h3>Đăng Nhập Để Lưu Trữ Dữ Liệu</h3>
                            <p>Sử Dụng Email để Đồng Bộ dữ liệu với Server.</p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4  wow fadeInUp" data-wow-duration=".7s" data-wow-delay=".5s">
                        <div class="single_service">
                            <span>03</span>
                            <h3>Ghi Chép Dữ Liệu Sử Dụng</h3>
                            <p>Lưu Dữ Liệu Xăng, Bảo Trì, Phụ Chi, Đăng Kiểm... và Xem Báo Cáo bằng Đồ Thị.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/* <!--/ service_area_2  --> */}

    {/* <!-- about  --> */}
    <div class="features_area ">
        <div class="container">
            <div class="features_main_wrap">
                    <div class="row  align-items-center">
                            <div class="col-xl-5 col-lg-5 col-md-6">
                                <div class="features_info2">
                                    <h3>Thích Hợp Cho Người Việt</h3>
                                    <p>Chức năng thích hợp cho Việt Nam.</p>
                                </div>
                            </div>
                            <div class="col-xl-5 col-lg-5 offset-xl-1 offset-lg-1 col-md-6 ">
                                <div class="about_draw wow fadeInUp" data-wow-duration=".7s" data-wow-delay=".5s">
                                    <img src={imgDraw} alt=""/>
                                </div>
                            </div>
                    </div>
            </div>
            <div class="features_main_wrap">
                    <div class="row  align-items-center">
                            <div class="col-xl-5 col-lg-5 offset-xl-1 offset-lg-1 col-md-6">
                                <div class="about_image wow fadeInLeft" data-wow-duration=".4s" data-wow-delay=".3s">
                                    <img src={imgPhone2} alt=""/>
                                </div>
                            </div>
                            <div class="col-xl-6 col-lg-6 col-md-6">
                                <div class="features_info">
                                    <h3 class="wow fadeInUp" data-wow-duration=".5s" data-wow-delay=".3s" >Dễ Dàng Nhập Liều <br/>
                                            và Xem Báo Cáo</h3>
                                    <p class="wow fadeInUp" data-wow-duration=".6s" data-wow-delay=".4s"  >Nhập Thông Tin và Xem Báo Cáo.</p>
                                    <ul>
                                        <li class="wow fadeInUp" data-wow-duration=".7s" data-wow-delay=".5s" > Nhắc Nhở Lịch Đăng Kiểm/Bảo Dưỡng sắp đến. </li>
                                        <li class="wow fadeInUp" data-wow-duration=".8s" data-wow-delay=".6s" > Xem Đồ Thị Chi Tiêu theo Thời Gian. </li>
                                        <li class="wow fadeInUp" data-wow-duration=".9s" data-wow-delay=".7s" > Xem và So Sánh Dữ Liệu Tất Cả Xe trong Nhóm.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
            </div>
        </div>
    </div>
    {/* <!--/ about  --> */}

</QLXLayout>
)
