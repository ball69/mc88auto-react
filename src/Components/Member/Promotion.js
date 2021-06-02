import React, { Component } from 'react';
import brandService from '../../_services/brand.service';
import Loading from '../Loading';
import Navbar from '../_Layout/Navbar';
import Footer from '../_Layout/Footer';
import { Modal } from 'react-bootstrap';
import NotificationManager from 'react-notifications/lib/NotificationManager';

class Promotion extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.match.params.brand;
        this.state = {
            loading: true,
            brand: '',
            user: JSON.parse(localStorage.getItem('user')),
            modal: false,
            promotions: '',
        }
        this.hideModal = this.hideModal.bind(this);
    }

    componentDidMount() {
        brandService.checkBrand(this.brand)
            .then((response) => {
                if (response.data.id !== this.state.user.brand_id) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    this.props.history.push(`/${this.brand}/login`);
                    return;
                } else {
                    this.setState({
                        brand: response.data,
                        promotions: response.data.promotions,
                    })
                    this.setState({
                        loading: false
                    })
                    brandService.profile(this.state.user.id)
                        .then((response) => {
                            if (response.data.line_user_id == null && this.state.brand.line_liff_connect != null) {
                                this.setState({
                                    modal: true
                                });
                            }
                        }, (err) => {
                            console.log(err);
                        })
                }
            }, (error) => {
                // console.log(error);
                this.setState({
                    loading: false
                })
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
                                                {
                                                    (this.state.promotions.length > 0)
                                                        ?
                                                        <div className="">
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

                                    </div>
                                </div>
                            </div>
                            <Footer props={this.props} brand={this.state.brand}></Footer>
                        </div >
                }
            </div>
        );
    }
}

export default Promotion;
