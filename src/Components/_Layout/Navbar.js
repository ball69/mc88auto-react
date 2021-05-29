import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {

    constructor(props) {
        super(props);
        this.brand = this.props.props.match.params.brand;
        this.handleLogout = this.handleLogout.bind(this);
        this.pathname = this.props.props.location.pathname;
    }

    handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.props.props.history.push(`/${this.brand}/login`);
    }

    render() {
        return (
            <div>
                <div className="main-menu menu-fixed menu-dark menu-accordion menu-shadow">

                    <ul className="nav navbar-nav flex-row">
                        <li className="nav-item img-center">
                            <a className="navbar-brand" href="starter-kit/ltr/vertical-menu-template-dark/">
                                <img src={`https://bot.mc88auto.com/storage/${this.props.brand.logo}`} className="img-fluid img-center rounded-circle" width="150" alt="" />
                            </a>
                        </li>
                    </ul>
                    <div className="main-menu menu-fixed menu-dark">
                        <div className="shadow-bottom" />
                        <div className="main-menu-content">
                            <ul className="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
                                <li className={`nav-item ${this.pathname === `/${this.brand}/member` ? "active" : ""}`}>
                                    <Link className="d-flex align-items-center" to={`/${this.brand}/member`}>
                                        <i className="fad fa-home"></i>
                                        <span className="menu-title text-truncate" data-i18n="Home">หน้าแรก</span>
                                    </Link>
                                </li>
                                <li className={`nav-item ${this.pathname === `/${this.brand}/member/deposit` ? "active" : ""}`}>
                                    <Link className="d-flex align-items-center" to={`/${this.brand}/member/deposit`}>
                                        <i className="fad fa-hand-holding-usd"></i>
                                        <span className="menu-title text-truncate" data-i18n="Home">เติมเงิน</span>
                                    </Link>
                                </li>
                                <li className={`nav-item ${this.pathname === `/${this.brand}/member/withdraw` ? "active" : ""}`}>
                                    <Link className="d-flex align-items-center" to={`/${this.brand}/member/withdraw`}>
                                        <i className="fad fa-credit-card"></i>
                                        <span className="menu-title text-truncate" data-i18n="Home">ถอนเงิน</span>
                                    </Link>
                                </li>
                                <li className={`nav-item ${this.pathname === `/${this.brand}/member/history` ? "active" : ""}`}>
                                    <Link className="d-flex align-items-center" to={`/${this.brand}/member/history`}>
                                        <i className="fad fa-list"></i>
                                        <span className="menu-title text-truncate" data-i18n="Home">ประวัติการทำธุรกรรม</span>
                                    </Link>

                                </li>
                                {/* <li className={`nav-item ${this.pathname === `/${this.brand}/member/promotion` ? "active" : ""}`}>
                                    <Link className="d-flex align-items-center" to={`/${this.brand}/member/promotion`}>

                                        <i className="fad fa-gift-card"></i>
                                        <span className="menu-title text-truncate" data-i18n="Home">โปรโมชั่น</span>
                                    </Link>
                                </li> */}
                                {/* <li className={`nav-item ${this.pathname === `/${this.brand}/member/invite` ? "active" : ""}`}>
                                    <Link className="d-flex align-items-center" to={`/${this.brand}/member/invite`}>
                                        <i className="fad fa-users-class"></i>
                                        <span className="menu-title text-truncate" data-i18n="Home">ลิงค์ชวนเพื่อน</span>
                                    </Link>
                                </li> */}
                                <li className={`nav-item ${this.pathname === `/${this.brand}/member/profile` ? "active" : ""}`}>
                                    <Link className="d-flex align-items-center" to={`/${this.brand}/member/profile`}>
                                        <i className="fad fa-id-card"></i>
                                        <span className="menu-title text-truncate" data-i18n="Home">โปรไฟล์ของฉัน</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <a className="d-flex align-items-center" onClick={this.handleLogout}>
                                        <i className="fad fa-power-off"></i>
                                        <span className="menu-title text-truncate" data-i18n="Home">ออกจากระบบ</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div >
        );
    }
}

export default Navbar;
