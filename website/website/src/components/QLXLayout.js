import React from "react"
import { Link } from "gatsby"
import imgLogo from "../../img/logo.png"
import { Helmet } from "react-helmet"

const ListLink = props => (
  <li style={{ display: `inline-block`, marginRight: `1rem`}}>
    <Link to={props.to}>{props.children}</Link>
  </li>
)

{/* <Link to="/" style={{ textShadow: `none`, backgroundImage: `none` }}>
        <h3 style={{ display: `inline` }}>MySweetSite</h3>
      </Link>
      <ul style={{ listStyle: `none`, float: `right` }}>
        <ListLink to="/">Home</ListLink>
        <ListLink to="/about/">About</ListLink>
        <ListLink to="/contact/">Contact</ListLink>
      </ul> */}
export default ({ children }) => (
  <div>
    <Helmet>
        <meta charSet="utf-8" />
        <title>Yama Stack</title>
        <link rel="canonical" href="https://yamastack.com/" />
    </Helmet>
    <header>
        <div class="header-area ">
            <div id="sticky-header" class="main-header-area">
                <div class="container-fluid">
                    <div class="row align-items-center">
                        <div class="col-xl-3 col-lg-2">
                            <div class="logo">
                                <ListLink to="/">
                                    {/* <img src={imgLogo} alt="" /> */}
                                    <h3 style={{color: "white"}}>YamaStack</h3>
                                </ListLink>
                            </div>
                        </div>
                        <div class="col-xl-6 col-lg-7">
                            
                        </div>
                        <div class="col-xl-3 col-lg-3 d-none d-lg-block">
                            <div class="main-menu  d-none d-lg-block">
                                <ul id="navigation">
                                        <ListLink to="/quanlyxe/PrivacyPolicy">Quyền Riêng Tư/Privacy Policy</ListLink>

                                        {/* <li><a href="#">blog <i class="ti-angle-down"></i></a>
                                            <ul class="submenu">
                                                <li><a href="blog.html">blog</a></li>
                                                <li><a href="single-blog.html">single-blog</a></li>
                                            </ul>
                                        </li> */}
                                    </ul>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="mobile_menu d-block d-lg-none"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </header>

    {children}

    <footer class="footer">
        <div class="footer_top">
            <div class="container">
                <div class="row">
                    <div class="col-xl-6 col-md-6 col-lg-6">
                        <div class="footer_widget">
                            <div class="footer_logo">
                                <a href="#">
                                    {/* <img src={imgLogo} alt=""/> */}
                                    <h4 style={{color: "white"}}>YamaStack</h4>
                                </a>
                            </div>
                            <p>
                                Ứng Dụng cho Cuộc Sống!
                            </p>
                            <div class="socail_links">
                                <ul>
                                    <li>
                                        <a href="#">
                                            <i class="ti-facebook"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i class="ti-twitter-alt"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                    {/* <div class="col-xl-2 offset-xl-1 col-md-6 col-lg-3">
                        <div class="footer_widget">
                            <h3 class="footer_title">
                                    Services
                            </h3>
                            <ul>
                                <li><a href="#">Team management</a></li>
                                <li><a href="#">Collaboration</a></li>
                                <li><a href="#">Todo</a></li>
                                <li><a href="#">Events</a></li>
                            </ul>

                        </div>
                    </div> */}
                    {/* <div class="col-xl-2 col-md-6 col-lg-2">
                        <div class="footer_widget">
                            <h3 class="footer_title">
                                    Useful Links
                            </h3>
                            <ul>
                                <li><a href="#">Pricing</a></li>
                                <li><a href="#">Features</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                    </div> */}
                    <div class="col-xl-6 col-md-6 col-lg-6">
                        <div class="footer_widget">
                            <h3 class="footer_title">
                                    Tải Về
                            </h3>
                            <ul>
                                <li>
                                    <a href="#">
                                    Tải Về từ Android Google Play

                                    </a>
                                </li>
                                <li><a href="#">
                                Tải Về từ Apple App Store
                                    </a>
                                </li>
                                </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="copy-right_text">
            <div class="container">
                <div class="footer_border"></div>
                <div class="row">
                    <div class="col-xl-12">
                        <p class="copy_right text-center">
                            Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made with <i class="fa fa-heart-o" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  </div>
)
