import React from "react"
import { Link } from "gatsby"
import imgLogo from "../../img/logo.png"
import { Helmet } from "react-helmet"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

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
        <Navbar bg="primary" variant="dark" expand="md">
        <Navbar.Brand>
            <ListLink to="/">
                <h3 style={{color: "white"}}>YamaStack</h3>
            </ListLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            <Nav.Link><ListLink to="/"><span style={{color:"rgba(255, 255, 255, .9)"}}>Home</span></ListLink></Nav.Link>
            <Nav.Link>
                <ListLink to="/quanlyxe/PrivacyPolicy"><span style={{color:"rgba(255, 255, 255, .9)"}}>QuảnLýXe</span></ListLink>
            </Nav.Link>
            <NavDropdown title="CoronaVirus" id="basic-nav-dropdown">
                <NavDropdown.Item><ListLink to="/coronavirus">Live Stats</ListLink></NavDropdown.Item>
                <NavDropdown.Item><ListLink to="/coronavirus/PrivacyPolicy">Privacy Policy</ListLink></NavDropdown.Item>
            </NavDropdown>
            </Nav>
        </Navbar.Collapse>
        </Navbar>

        {/* <div class="header-area ">
            <div id="sticky-header" class="main-header-area">
                <div class="container-fluid">
                    <Row className={"align-items-center"}>
                        <Col xs={0} md={3} style={{textAlign: "center"}}>
                            <div class="logo">
                                <ListLink to="/">
                                    <h3 style={{color: "white"}}>YamaStack</h3>
                                </ListLink>
                            </div>
                        </Col>

                        <Col xs={0} md={6} style={{textAlign: "center"}}>
                            <div class="main-menu  d-none d-lg-block">
                                <ul id="navigation">
                                    <li><ListLink to="/quanlyxe/PrivacyPolicy">QuảnLýXe</ListLink></li>
                                    <li><ListLink to="/coronavirus">CoronaVirus</ListLink>
                                        <ul class="submenu">
                                            <li><ListLink to="/coronavirus">Live Stats</ListLink></li>
                                            <li><ListLink to="/coronavirus/PrivacyPolicy">Privacy Policy</ListLink></li>
                                        </ul>
                                    </li>
                                    </ul>
                            </div>
                        </Col>
                        <Col xs={12} md={0} style={{textAlign: "center"}}>
                            <div class="mobile_menu d-block d-lg-none"></div>
                        </Col>
                    </Row>

                </div>
            </div>
        </div>*/}
    </header>

    <div style={{paddingBottom:"50px"}}>
    {children}
    </div>

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
    </footer>
  </div>
)
