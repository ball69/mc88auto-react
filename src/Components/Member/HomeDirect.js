import React, { Component } from 'react';
import brandService from '../../_services/brand.service';
import Loading from '../Loading';
import { Modal } from 'react-bootstrap';

class HomeDirect extends Component {

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
    }

    async componentDidMount() {
        console.log('home direct');
        await brandService.getUrl(this.state.user.id)
            .then((response) => {
                this.setState({
                    url: response.data
                });
                window.location.href = response.data;
            }, (error) => {
                console.log(error);
            }).catch((error) => {
                console.log(error);
            })
    }

    render() {
        return (
            <div>
                {
                    (this.state.loading)
                        ?
                        <Loading />
                        :
                        <div></div>
                }
            </div>
        );
    }
}

export default HomeDirect;
