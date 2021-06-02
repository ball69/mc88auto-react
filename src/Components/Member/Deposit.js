import React, { Component } from 'react';
import brandService from '../../_services/brand.service';
import Loading from '../Loading';
import Navbar from '../_Layout/Navbar';
import Footer from '../_Layout/Footer';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import clipboard from '../../_helpers/clipboard';

class Deposit extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.match.params.brand;
        this.state = {
            loading: true,
            brand: '',
            user: JSON.parse(localStorage.getItem('user')),
            modal: false,
            profile: '',
            promotionNow: '',
            promotions: '',
            radio: 2,
        }
        this.hideModal = this.hideModal.bind(this);
        this.handlePromotionChange = this.handlePromotionChange.bind(this)
    }

    handlePromotionChange(e) {
        const { target: { value } } = e;
        console.log(value);
        brandService.updatePromotion(this.state.user.id, value)
            .then((response) => {
                const promotion_name = (response.data) ? response.data.name : 'ไม่รับโบนัส';
                NotificationManager.success(promotion_name, 'เลือกโปรโมชั่นสำเร็จ')
            }, (error) => {
                console.log(error);
            });
    }

    async componentDidMount() {
        await brandService.checkBrand(this.brand)
            .then((response) => {
                if (response.data.id !== this.state.user.brand_id) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    this.props.history.push(`/${this.brand}/login`);
                    return;
                } else {
                    const promotions = (response.data) ? response.data.promotions : "";
                    this.setState({
                        brand: response.data,
                        promotions: response.data.promotions
                    })
                    this.setState({
                        loading: false
                    });
                }
            }, (error) => {
                console.log(error);
                this.setState({
                    loading: false
                });
            })
        await brandService.profile(this.state.user.id)
            .then((response) => {
                this.setState({
                    profile: response.data,
                    promotionNow: response.data.promotion_id,
                });
                if (response.data.line_user_id == null && this.state.brand.line_liff_connect != null) {
                    this.setState({
                        modal: true
                    });
                }
            }, (err) => {
                console.log(err);
                this.setState({
                    loading: false
                });
            });
    }

    hideModal = () => {
        this.setState({ modal: false });
    };

    render() {

        const { profile } = this.state;
        return (
            <div>
                <Modal show={this.state.modal} onHide={this.hideModal}>
                    <Modal.Header closeButton className="btn-auto-line">
                        <Modal.Title className="text-white"> <i className="fab fa-line "></i> เชื่อมต่อไอดีไลน์</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-white">
                        <Link href={`https://line.mc88auto.com/connect/${this.brand}`} variant="secondary" className="btn btn-auto-line btn-block btn-lg">

                            <span className="text-center d-block">เพื่อรับการแจ้งเตือน และ สิทธิ์ประโยชน์มากมาย แบบ VIP</span>
                            <i className="fad fa-bell-on fa-5x mr-1 mb-5 mt-5" ></i>
                            <span className="text-center d-block mb-3">ไอดีเข้าเกมส์: {this.state.user.username}</span>
                            <span className="mb-5">
                                คลิกเพื่อเชื่อมต่อ</span>
                        </Link>
                    </Modal.Body>
                </Modal>
                {
                    (this.state.loading)
                        ?
                        <Loading></Loading>
                        :
                        <div>
                            <div className="row">
                                <div className="col-lg-2 col-md-10">
                                    <Navbar props={this.props} brand={this.state.brand}></Navbar>
                                </div>
                                <div className="col-lg-10 col-md-10">
                                    <div className="app-content content">
                                        <div className="content-wrapper">
                                            <div className="clearfix" />
                                            <div className="content-body">
                                                <h2> <i className="fad fa-hand-holding-usd"></i> เติมเงิน</h2>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="card bg-warning">
                                                            <div className="card-body">
                                                                <h5 className="text-dark">
                                                                    <i className="fa fa-file-alt pr-1"></i>
                                                                    <b>คำเตือน โปรดอ่านก่อนเริ่มใช้งาน!!</b>
                                                                </h5>
                                                                <hr className="hr-red" />
                                                                <p className="text-dark">
                                                                    1. ระบบของเราเป็นระบบอัตโนมัติ
                                                                    โปรดตรวจสอบข้อมูลให้ถี่ถ้วนก่อนเริ่มใช้งาน
                                                                </p>
                                                                <p className="text-dark">
                                                                    2. หากชื่อของบัญชีธนาคารที่ท่านสมัครไม่ตรงกับชื่อบัญชีที่ใช้
                                                                    เงินของท่านอาจจะไม่เข้่าสู่ระบบ
                                                                </p>
                                                                <p className="text-dark">
                                                                    3. หากตรวจสอบแล้วข้อมูลของท่านไม่ถูกต้อง
                                                                    โปรดแจ้งทีมงานให้ทราบก่อนเริ่มทำรายการ
                                                                </p>
                                                                <p className="text-dark mt-2">
                                                                    <b>บัญชีธนาคารของคุณ</b>
                                                                </p>
                                                                <p className="text-dark">
                                                                    {
                                                                        (profile)
                                                                            ?
                                                                            <div>

                                                                                <img
                                                                                    src={
                                                                                        profile.bank.logo === undefined
                                                                                            ? ""
                                                                                            : "https://agent.mc88auto.com/" + profile.bank.logo
                                                                                    }
                                                                                    alt=""
                                                                                    width="30"
                                                                                />{" "}
                                                                                <b>
                                                                                    {profile.bank.name} ชื่อ: {profile.name} เลขที่บัญชี:{" "}
                                                                                    {profile.bank_account}
                                                                                </b>
                                                                            </div>
                                                                            :
                                                                            ''
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">

                                                        <div className="card bg-danger card-normal">
                                                            <div className="card-body">
                                                                <h5 className="text-white">
                                                                    <i className="fa fa-exclamation-triangle pr-1"></i>
                                                                    <b>คำเตือน กรณีรับโปรโมชั่น!!</b>
                                                                </h5>
                                                                <hr className="hr-white" />
                                                                <p className="text-white font-bold"><b>กรณที่ลูกค้ารับโปรโมชั่นอยู่ แล้วลูกค้าโอนเงินมาเพิ่ม ทางเราจะดึงโบนัสที่ลูกค้าได้คืนทันที</b></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <h4>1. เลือกโปรโมชั่นก่อนโอนเงิน</h4>
                                                        <hr />
                                                        <div className="form-group">
                                                            <select className="form-control form-control-lg form-auto" id="basicSelect" onChange={this.handlePromotionChange}>
                                                                <option value="0">ไม่รับโบนัส</option>
                                                                {this.state.promotions.map((promotion) =>
                                                                (
                                                                    [1, 2, 3].includes(promotion.type_promotion)
                                                                        ?
                                                                        <option value={promotion.id} selected={promotion.id === this.state.promotionNow}>{promotion.name}</option>
                                                                        :
                                                                        ''
                                                                )
                                                                )}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">

                                                    </div>
                                                    <div className="col-lg-12">
                                                        <h4>2. โอนเงินเข้าบัญชีธนาคาร</h4>
                                                        <hr />
                                                        <div className="row">
                                                            {this.state.brand.bank_accounts.filter(bank_account => bank_account.status_bot == 1).map((bank, index) => (
                                                                (
                                                                    [0, 1, 6, 8].includes(bank.type)
                                                                        ?
                                                                        <div key={index} className="col-lg-2 col-6">
                                                                            <div
                                                                                className="card"
                                                                                style={{
                                                                                    background: bank.bank.bg_color,
                                                                                    color: bank.bank.font_color,
                                                                                    borderRadius: "5",
                                                                                }}
                                                                            >
                                                                                <div className="card-body">
                                                                                    <img
                                                                                        src={"https://agent.mc88auto.com/" + bank.bank.logo}
                                                                                        className="img-fluid img-center mb-5"
                                                                                        width="60"
                                                                                        alt=""
                                                                                    />
                                                                                    <h6
                                                                                        className="mt-1"
                                                                                        style={{
                                                                                            color: bank.bank.font_color,
                                                                                        }}
                                                                                    >
                                                                                        {bank.bank.name}
                                                                                    </h6>
                                                                                    <h4
                                                                                        className="mt-1"
                                                                                        style={{
                                                                                            color: bank.bank.font_color,
                                                                                        }}
                                                                                    >
                                                                                        {bank.account}
                                                                                    </h4>
                                                                                    <p className="mb-5">{bank.name}</p>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-auto btn-sm mt-2 btn-block mx-auto rounded text-dark"
                                                                                        value={bank.account}
                                                                                        onClick={(e) => clipboard(e.target.value)}
                                                                                    >
                                                                                        <i className="fa fa-copy"></i> คัดลอก
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        ''
                                                                )
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <h4>3. เครดิตจะเข้าอัตโนมัติภายใน 30 วินาที</h4>
                                                        <hr />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Footer props={this.props} brand={this.state.brand}></Footer>
                        </div>
                }
            </div>
        );
    }
}



export default Deposit;
