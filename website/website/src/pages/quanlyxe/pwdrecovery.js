import React from 'react'
import QLXLayout from "../../components/QLXLayout"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import queryString from 'query-string';

var headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials':true,
    'APIKEY': 'WEB-S1E9C9R0E0T5K0E7Y-QLXGW',
};

axios.defaults.baseURL = "https://yamastack.com/api";
//axios.defaults.baseURL = "http://localhost:3000/api";

export default class pwdrecovery extends React.Component {
    constructor(props) {
        super (props);
        this.state = {
            password1: "",
            password2: "",
            msg1:"",
            msg2:"",
            userId:"",
            token:"",
            changedPwdOk: null,
            invalidParams: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.onPwd1Change = this.onPwd1Change.bind(this)
        this.onPwd2Change = this.onPwd2Change.bind(this)
    }
    componentDidMount() {
        // this.setState({
        //     password1: "11",
        //     password2: "22"
        // })
        console.log(this.props.location.search)
        let params = queryString.parse(this.props.location.search)
        console.log(params)
        // care about id and token
        if (!params.id || !params.token) {
            // Error params
            this.setState(
                {
                    invalidParams: true
                }
            )
        } else {
            this.setState(
                {
                    userId: params.id,
                    token: params.token
                }
            )
        }
    }
    onPwd1Change(e) {
        this.setState({
            password1: (""+e.target.value).trim(),
        })
    }
    onPwd2Change(e) {
        this.setState({
            password2: (""+e.target.value).trim(),
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log(this.state)
        if (!this.state.password1 || this.state.password1.length < 6) {
            this.setState({
                msg1: "Mật khẩu cần ít nhất 6 kí tự.",
                msg2:"",
            })
        } else 
        if (!this.state.password2 || this.state.password2.length < 6) {
            this.setState({
                msg1:"",
                msg2: "Mật khẩu cần ít nhất 6 kí tự."
            })
        } else 
        if (this.state.password1 != this.state.password2) {
            this.setState({
                msg1:"",
                msg2: "Mật khẩu nhập lại không khớp."
            })
        } else {
            this.setState({
                msg1:"",
                msg2:""
            })
            console.log("OK, will Submit")
            axios.post("/resetpwd",
                JSON.stringify({
                    password: this.state.password1,
                    token: this.state.token,
                    userId: this.state.userId
                }),
                { headers: headers})
            .then((response) => {
                console.log("Response.Data")
                console.log(response.data)
                this.setState({
                    changedPwdOk: true
                })
            })
            .catch((error) => {
                console.log("Errorooooooooo")
                console.log(error)
                this.setState({
                    changedPwdOk: false
                })
            });
        }
       
    }
    render() {
        return (
            <QLXLayout>
                <div style={{marginLeft: "10%", marginRight: "10%", 
                    textAlign: "justify", marginTop: "80px", marginBottom: "80px"}}>
                    
                { this.state.invalidParams == true ? (
                    <span style={{textAlign: "justify", fontSize: "16px", marginBottom: "30px", color: "red"}}>Thông tin đổi mật khẩu không chính xác.</span>
                ) : null}
                {this.state.changedPwdOk == true ? 
                <span style={{textAlign: "justify", fontSize: "18px", marginBottom: "30px"}}>Đổi mật khẩu thành công, xin hãy vào ứng dụng và đăng nhập lại.</span>
                : null}

                {this.state.changedPwdOk == false ? 
                <span style={{textAlign: "justify", fontSize: "16px", marginBottom: "30px", color: "red"}}>Đổi mật khẩu không thành công, hãy thử lại lần sau.</span>
                : null}

                {this.state.invalidParams == false && this.state.changedPwdOk == null ? 
                <div>
                <span style={{textAlign: "justify", fontSize: "22px", marginBottom: "30px"}}>Ứng Dụng Quản Lý Xe</span>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicPassword1">
                        <Form.Label>Mật Khẩu Mới</Form.Label>
                        <Form.Control type="password" placeholder=""  onChange={this.onPwd1Change}/>
                        <Form.Text style={{color:"red"}}>
                            {this.state.msg1.length > 0 ? this.state.msg1 : ""}
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword2">
                        <Form.Label>Nhập Lại Mật Khẩu Mới</Form.Label>
                        <Form.Control type="password" placeholder="" onChange={this.onPwd2Change}/>
                        <Form.Text style={{color:"red"}}>
                            {this.state.msg2.length > 0 ? this.state.msg2 : ""}
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Xác Nhận
                    </Button>
                    </Form>
                </div>: null}

                </div>
                
            </QLXLayout>
        )
    }
}
