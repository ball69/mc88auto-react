import React, { Component } from 'react';
import Loading from './Loading';

class NotFound extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
    }

    componentDidMount() {
        this.setState({ loading: false });
    }

    render() {
        return (
            <div>
                {(this.state.loading) ?
                    <Loading></Loading> :
                    <div className="app-content content ">
                        <div className="content-wrapper">
                            <div className="content-body">
                                <div className="auth-wrapper auth-v1 px-2">
                                    <div className="auth-inner py-2">
                                        <p className="text-center text-dark pb-5">
                                            <i className="fas fa-tools fa-6x"></i>
                                        </p>
                                        <h4 className="text-center text-dark">เซิฟเวอร์ปิดปรับปรุงชั่วคราว</h4>
                                        <p className="text-center text-dark">กรุณาติดต่อผู้ให้บริการของท่าน</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default NotFound;
