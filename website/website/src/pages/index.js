import React from "react"
import QLXLayout from "../components/QLXLayout"
import imgLogo from "../../img/logo.png"
import imgPhone from "../../img/qlx/phone.png"
import img1 from "../../img/qlx/1.svg"
import img2 from "../../img/qlx/2.svg"
import img3 from "../../img/qlx/3.svg"
import imgPhone11 from "../../img/qlx/phone1.png"
import imgPhone21 from "../../img/qlx/phone2.png"
import imgPhone31 from "../../img/qlx/phone3.png"
import imgDraw from "../../img/qlx/charts.png"
import imgPhone2 from "../../img/qlx/phone4.png"

export default () => (
<QLXLayout>
    {/* <!-- slider_area_start --> */}
    <div class="slider_area">
        <div class="single_slider  d-flex align-items-center slider_bg_1">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-xl-7 col-md-6">
                        <div class="slider_text ">
                            <h3 class="wow fadeInDown" data-wow-duration="1s" data-wow-delay=".1s" >Quản Lý Ôtô, Xe Máy</h3>
                            <p class="wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".1s">
                                Theo Dõi Chi Tiêu Theo Cá Nhân/Đội Nhóm</p>
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
            {/* <div class="row">
                <div class="col-xl-12">
                    <div class="section_title text-center  wow fadeInUp" data-wow-duration=".5s" data-wow-delay=".3s">
                        <h3>Quản Lý Xe Hiệu Qủa</h3>
                    </div>
                </div>
            </div> */}
            <div class="row">
                <div class="col-lg-4 col-md-4">
                    <div class="single_service text-center wow fadeInUp" data-wow-duration=".6s" data-wow-delay=".4s">
                        <div class="thumb">
                                <img src={img2} alt=""/>
                        </div>
                        <h3>Quản lí theo Cá Nhân hoặc Nhóm/Gia Đình</h3>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4">
                        <div class="single_service text-center wow fadeInUp" data-wow-duration=".7s" data-wow-delay=".5s">
                                <div class="thumb">
                                        <img src={img1} alt=""/>
                                </div>
                                <h3>Đồng Bộ với Máy Chủ</h3>
                            </div>
                </div>
                <div class="col-lg-4 col-md-4">

                            <div class="single_service text-center wow fadeInUp " data-wow-duration=".8s" data-wow-delay=".6s">
                                <div class="thumb">
                                        <img src={img3} alt="" />
                                </div>
                                <h3>Hoàn Toàn Miễn Phí</h3>
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
                        <img src={imgPhone11} alt="" />
                    </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 wow fadeInLeft" data-wow-duration=".4s" data-wow-delay=".5s">
                    <div class="man_thumb">
                        <img src={imgPhone21} alt="" />
                    </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-6 wow fadeInLeft" data-wow-duration=".4s" data-wow-delay=".5s">
                    <div class="man_thumb">
                        <img src={imgPhone31} alt="" />
                    </div>
                </div>
            </div>
            <div class="service_content_wrap">
                <div class="row">
                    <div class="col-lg-4 col-md-4">
                        <div class="single_service  wow fadeInUp" data-wow-duration=".5s" data-wow-delay=".3s">
                            <span>01</span>
                            <h3>Quản Lý Dữ Liệu Thiết Yếu</h3>
                            <p>Hiệu suất Xăng/Quãng đường di chuyển, Phụ chi (tiền phạt, cầu đường, gửi xe, rửa xe), 
                                Sổ bảo dưỡng định kì, Pháp lý (Đăng Kiểm, Bảo Hiểm, Bảo Trì Đường Bộ).</p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4">
                        <div class="single_service  wow fadeInUp" data-wow-duration=".6s" data-wow-delay=".4s">
                            <span>02</span>
                            <h3>Quản Lý Theo Cá Nhân</h3>
                            <p>Chi tiêu theo thời gian, phân bố các khoảng chi tiêu, nhắc nhở lịch đăng kiểm.</p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-4  wow fadeInUp" data-wow-duration=".7s" data-wow-delay=".5s">
                        <div class="single_service">
                            <span>03</span>
                            <h3>Quản Lý Theo Nhóm</h3>
                            <p>So sánh chi tiêu/hiệu suất các xe, tổng chi tiêu của nhóm, nhắc nhở lịch đăng kiểm cho toàn Nhóm.</p>
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
                            <div class="col-xl-4 col-lg-4 col-md-4">
                                <div class="features_info2">
                                    <h3>Báo Cáo/Đồ Thị đa dạng</h3>
                                    <p>Giao diện thân thiện, đăng nhập với Google/Facebook, đồng bộ với máy chủ</p>
                                </div>
                            </div>
                            <div class="col-xl-7 col-lg-7 offset-xl-1 offset-lg-1 col-md-7 ">
                                <div class="about_draw wow fadeInUp" data-wow-duration=".7s" data-wow-delay=".5s">
                                    <img src={imgDraw} alt=""/>
                                </div>
                            </div>
                    </div>
            </div>
            <div class="features_main_wrap">
                    <div class="row  align-items-center">
                            <div class="col-xl-7 col-lg-7 col-md-7">
                                <div class="about_image wow fadeInLeft" data-wow-duration=".4s" data-wow-delay=".3s">
                                    <img src={imgPhone2} alt=""/>
                                </div>
                            </div>
                            <div class="col-xl-5 col-lg-5 col-md-5">
                                <div class="features_info">
                                    <h3 class="wow fadeInUp" data-wow-duration=".5s" data-wow-delay=".3s" >Theo dõi lich bảo dưỡng</h3>
                                    <ul>
                                        <li class="wow fadeInUp" data-wow-duration=".7s" data-wow-delay=".5s" > Thiết lập bộ phận bảo dưỡng. </li>
                                        <li class="wow fadeInUp" data-wow-duration=".8s" data-wow-delay=".6s" > Xem thời điểm, quãng đường tại mỗi lần bảo dưỡng. </li>
                                        <li class="wow fadeInUp" data-wow-duration=".9s" data-wow-delay=".7s" > Tuỳ chọn, sử dụng cho cả Ôtô, Xe máy.</li>
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
