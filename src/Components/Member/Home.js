import React, { Component } from 'react';
import brandService from '../../_services/brand.service';
import Loading from '../Loading';
import Navbar from '../_Layout/Navbar';
import Footer from '../_Layout/Footer';
import clipboard from '../../_helpers/clipboard';
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import { Modal } from 'react-bootstrap';
import CurrencyFormat from 'react-currency-format';

import logo from '../../_assets/images/logo.png';

class Home extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.match.params.brand;
        this.state = {
            loading: true,
            loadingCredit: true,
            brand: '',
            user: JSON.parse(localStorage.getItem('user')),
            credit: '',
            creditLastUpdate: '',
            promotionLast: '',
            promotionInvite: '',
            promotions: '',
            modal: false,
            url: '',
        }
        this.handleRefreshCredit = this.handleRefreshCredit.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    async componentDidMount() {
        console.log('home');
        await brandService.checkBrand(this.brand)
            .then((response) => {
                if (response.data.id !== this.state.user.brand_id) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    this.props.history.push(`/${this.brand}/login`);
                } else {
                    const promotionInvite = response.data.promotions.filter(promotion => promotion.type_promotion == 5)[0];
                    this.setState({
                        brand: response.data,
                        promotionInvite: promotionInvite,
                        promotions: response.data.promotions
                    });
                    this.setState({
                        loading: false
                    });

                }

            }, (error) => {
                // console.log(error);
                this.setState({
                    loading: false
                })
            });

        await brandService.getUrl(this.state.user.id)
            .then((response) => {
                this.setState({
                    url: response.data
                })
            }, (error) => {
                console.log(error);
            }).catch((error) => {
                console.log(error);
            })

        await brandService.profile(this.state.user.id)
            .then((response) => {
                if (response.data) {
                    if (response.data.line_user_id == null && this.state.brand.line_liff_connect != null) {
                        this.setState({
                            modal: true
                        });
                    }
                } else {
                    this.setState({
                        loadingCredit: false,
                    });
                }
            }, (err) => {
                console.log(err);
            })
        await this.handleRefreshCredit();
    }

    handleRefreshCredit() {
        this.setState({
            loadingCredit: true
        });
        brandService.credit(this.state.user.id)
            .then((response) => {
                if (response.data) {
                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    const credit = (response.data.credit) ? parseFloat(response.data.credit).toFixed(2) : 0.00;
                    this.setState({
                        credit: credit,
                        creditLastUpdate: date + ' ' + time,
                        promotionLast: response.data.promotion_last,
                    })
                    this.setState({
                        loadingCredit: false
                    });
                }
            }, (error) => {
                // console.log(error);
                this.setState({
                    loadingCredit: false
                });
            })
    }

    updatePromotion(promotion_id) {
        brandService.updatePromotion(this.state.user.id, promotion_id)
            .then((response) => {
                const promotion_name = (promotion_id !== 0) ? response.data.name : 'ไม่รับโปรโมชั่น';
                NotificationManager.success(promotion_name, 'เลือกโปรโมชั่นสำเร็จ')
            }, (error) => {
                console.log(error);
            });
    }

    calBonusTurnOver(userPromotion) {
        let result = 0;
        if (userPromotion.promotion) {
            result = (parseFloat(userPromotion.amount) + parseFloat(userPromotion.bonus)) * parseFloat(userPromotion.promotion.turn_over);
        }
        return result.toFixed(2);
    }

    showModal = () => {
        this.setState({ modal: true });
    };

    hideModal = () => {
        this.setState({ modal: false });
    };

    render() {
        return (
            <div>
                <Modal show={this.state.modal} onHide={this.hideModal}>
                    <Modal.Header closeButton className="btn-auto-line">
                        <Modal.Title className="text-white"> <i className="fab fa-line "></i> เชื่อมต่อไอดีไลน์</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-white">
                        <a href={`https://line.mc88auto.com/connect/${this.brand}`} variant="secondary" className="btn btn-auto-line btn-block btn-lg">

                            <span className="text-center d-block">เพื่อรับการแจ้งเตือน และ สิทธิ์ประโยชน์มากมาย แบบ VIP</span>
                            <i className="fad fa-bell-on fa-5x mr-1 mb-5 mt-5" ></i>
                            <span className="text-center d-block mb-3">ไอดีเข้าเกมส์: {this.state.user.username}</span>
                            <span className="mb-5">
                                คลิกเพื่อเชื่อมต่อ</span>
                        </a>
                    </Modal.Body>
                </Modal>
                {
                    (this.state.loading)
                        ?
                        <Loading />
                        :
                        <div className="row">
                            <div className="col-lg-2 col-md-10">
                                <Navbar props={this.props} brand={this.state.brand}></Navbar>
                            </div>
                            <div className="col-lg-10 col-md-12">
                                <div className="app-content content">
                                    <div className="content-wrapper">
                                        <div className="clearfix" />
                                        <div className="content-body">
                                            <div className="d-xs-none">
                                                <a href={this.state.url} className="btn btn-auto btn-lg pull-right">
                                                    <i className="fad fa-fad fa-ball-pile mr-3"></i>
                                                    ซื้อหวย
                                                </a>
                                                <h1 className="">ยินดีต้อนรับ คุณ {this.state.user.name}</h1>
                                            </div>
                                            <div className="pb-4">
                                                <img src={logo} className="img-fluid rounded-circle d-lg-none" width={100} alt="" />
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="row">
                                                <div className="col-lg-8 col-md-8">
                                                    <div className="card card-auto-2">
                                                        <div className="card-body p-5">
                                                            <h2>เครดิตของคุณ
                                                                {(this.state.loadingCredit) ?
                                                                    <span className="ml-2" >
                                                                        <div className="spinner-border" role="status">
                                                                            <span className="sr-only">Loading...</span>
                                                                        </div>
                                                                    </span>
                                                                    :

                                                                    <span className="ml-2" onClick={this.handleRefreshCredit}><i className="fad fa-sync"></i></span>

                                                                }
                                                            </h2>
                                                            <h1 className="mb-75 mt-2 pt-50"> $ <CurrencyFormat value={this.state.credit} displayType={'text'} thousandSeparator={true} /> credit
                                                            </h1>
                                                            <p>อัพเดทล่าสุดเมื่อ: {this.state.creditLastUpdate}</p>
                                                        </div>
                                                        {
                                                            (this.state.promotionLast)
                                                                ?
                                                                <div>
                                                                    <div className="promotion">
                                                                        <h5 className="name mb-1 text-overflow">
                                                                            {this.state.promotionLast.promotion.name}
                                                                        </h5>
                                                                        {(this.state.promotionLast.turn_over > 0) ?
                                                                            <h5 className="detail text-center mb-0">เทิร์นที่ต้องทำ: {this.calBonusTurnOver(this.state.promotionLast)}</h5>
                                                                            :
                                                                            <h5 className="detail text-center mb-0">เทิร์นที่ต้องทำ: {this.state.credit} / {this.calBonusTurnOver(this.state.promotionLast)}</h5>
                                                                        }
                                                                    </div>

                                                                </div>
                                                                :
                                                                ''
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-4">
                                                    <div className="card card-auto-3">
                                                        <div className="card-header">
                                                            <h2 className="card-title text-white">ไอดีเข้าซื้อหวย</h2>
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="card-text text-white">
                                                                <p><b> <i className="fad fa-user" /> {this.state.user.username}</b>
                                                                    <button type="button" onClick={() => clipboard(this.state.user.username)} className="btn btn-auto btn-sm pull-right"> <i className="fa fa-copy" /> คัดลอก </button></p>
                                                                <p><b> <i className="fad fa-key" /> {this.state.user.password_generate}</b>
                                                                    <button type="button" onClick={() => clipboard(this.state.user.password_generate)} className="btn btn-auto btn-sm pull-right"> <i className="fa fa-copy" /> คัดลอก </button></p>
                                                            </div>
                                                            {/* <div className="row d-xs-none mt-5">
                                                                <div className="col-lg-12">
                                                                    <a href={`https://line.mc88auto.com/connect/${this.brand}`}
                                                                        className="btn btn-auto-line btn-block">
                                                                        <i className="fab fa-line" /> เชื่อมต่อไอดีไลน์ VIP
                                                                    </a>
                                                                </div>
                                                            </div> */}
                                                            <div className="row d-lg-none mt-5">
                                                                <div className="col-lg-12">
                                                                    <a href={this.state.url} className="btn btn-auto btn-block btn-lg"> <i className="fad fa-ball-pile" /> ซื้อหวย</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 d-lg-none">
                                                    <div className="row ml-0 mr-0">
                                                        <div className="col-3">
                                                            <Link to={`/${this.brand}/member/deposit`} className="btn btn-auto-icon img-center">
                                                                <i className="fad fa-hand-holding-usd" />
                                                            </Link>
                                                            <p className="text-center">เติมเงิน</p>
                                                        </div>
                                                        <div className="col-3">
                                                            <Link to={`/${this.brand}/member/withdraw`} className="btn btn-auto-icon img-center">
                                                                <i className="fad fa-credit-card" />
                                                            </Link>
                                                            <p className="text-center">ถอนเงิน</p>
                                                        </div>
                                                        <div className="col-3">
                                                            <Link to={`/${this.brand}/member/history`} className="btn btn-auto-icon img-center">
                                                                <i className="fad fa-list" />
                                                            </Link>
                                                            <p className="text-center">ประวัติ</p>
                                                        </div>
                                                        {/* <div className="col-3">
                                                            <Link to={`/${this.brand}/member/promotion`} className="btn btn-auto-icon img-center">
                                                                <i className="fad fa-gift" />
                                                            </Link>
                                                            <p className="text-center">โปรโมชั่น</p>
                                                        </div> */}
                                                        {/* <div className="col-3">
                                                            <Link to={`/${this.brand}/member/invite`} className="btn btn-auto-icon img-center">
                                                                <i className="fad fa-users-class" />
                                                            </Link>
                                                            <p className="text-center">ชวนเพื่อน</p>
                                                        </div> */}
                                                        <div className="col-3">
                                                            <Link to={`/${this.brand}/member/profile`} className="btn btn-auto-icon waves-effect img-center">
                                                                <i className="fad fa-id-card" />
                                                            </Link>
                                                            <p className="text-center">โปรไฟล์</p>
                                                        </div>
                                                        {/* <div className="col-3">
                                                            <a href={`https://line.mc88auto.com/connect/${this.brand}`} className="btn btn-auto-icon waves-effect img-center">
                                                                <i className="fad fa-bell-on" />
                                                            </a>
                                                            <p className="text-center">แจ้งเตือน VIP</p>
                                                        </div> */}
                                                        <div className="col-3">
                                                            <a href={`https://line.me/R/ti/p/~@${this.state.brand.line_id}`} className="btn btn-auto-icon waves-effect img-center">
                                                                <i className="fab fa-line" />
                                                            </a>
                                                            <p className="text-center">แจ้งปัญหา</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="row">
                                                <div className="col-lg-12  d-xs-none">
                                                    <h2> <i className="fad fa-people-arrows"></i> ลิงค์แนะนำเพื่อน </h2>
                                                    <hr /> */}
                                            {
                                                (this.state.promotionInvite)
                                                    ?
                                                    <div>
                                                        <p className="text-center">{this.state.promotionInvite.name}</p>
                                                        <div className="row">
                                                            <div className="col-lg-6 mx-auto">
                                                                <div className="input-group">
                                                                    {/* <div className="input-group-prepend">
                                                                    <button className="btn btn-auto waves-effect" type="button">
                                                                        ลิงค์ของคุณ
                                                                    </button>
                                                                </div> */}
                                                                    <input type="text" className="form-control form-control form-auto" defaultValue={this.state.user.invite_url} readOnly />
                                                                    <div className="input-group-append">
                                                                        <button className="btn btn-auto waves-effect" type="button" onClick={() => clipboard(this.state.user.invite_url)}>
                                                                            <i className="fa fa-clipboard"></i> คัดลอก
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row mt-2">
                                                            <div className="col-lg-6 mx-auto">
                                                                <Link to={`/${this.brand}/member/invite`} className="btn btn-auto btn-block btn-lg btn-wave-effects">
                                                                    <i className="fad fa-envelope-open-dollar mr-1"></i>
                                                                    รับโบนัส
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    ''

                                            }
                                            {/* </div>
                                            </div> */}
                                            {
                                                (this.state.promotions.length > 0)
                                                    ?
                                                    <div className="d-xs-none">
                                                        <div className="pull-right">
                                                            <button type="button" onClick={() => this.updatePromotion(0)} className="btn btn-auto pull-right btn-3">
                                                                <i className="fad fa-ban mr-1"></i>
                                                                ไม่รับโบนัส </button>
                                                        </div>
                                                        <h2> <i className="fad fa-gift-card"></i> โปรโมชั่น</h2>
                                                        <hr />
                                                        <div className="row">
                                                            {this.state.promotions.filter(promotion => promotion.status != 0).map((promotion, key) => {
                                                                return (
                                                                    <div className="col-lg-3" key={key}>
                                                                        <div className="box-promotion">
                                                                            <img src={`https://agent.mc88auto.com/storage/${promotion.img}`}
                                                                                className="img-fluid img-center" alt="" />
                                                                            <p className="pt-2 text-center text-overflow">{promotion.name}</p>
                                                                            {
                                                                                ([1, 2, 3].includes(promotion.type_promotion))
                                                                                    ?
                                                                                    <button type="button" onClick={() => this.updatePromotion(promotion.id)} className="btn btn-auto pull-right btn-3">
                                                                                        <i className="fa fa-hand-pointer" />&nbsp;
                                                                                        เลือกโปรโมชั่นนี้
                                                                                    </button>
                                                                                    :
                                                                                    ''
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                    :
                                                    ''
                                            }
                                        </div>
                                    </div>
                                    <Footer props={this.props} brand={this.state.brand}></Footer>
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default Home;
