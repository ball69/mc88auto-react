import axios from 'axios';

const API_URL = 'https://bot.mc88auto.com/api/auth/';

class authService {
    async register(data) {
        const result = await axios
            .post(API_URL + 'register', data)
            .then((response) => {
                return response;
            }, (error) => {
                return error;
            })
        return result;
    }

    async login(username, password, telephone, brand_id, typeLogin) {
        var result = await axios
            .post(API_URL + "login", {
                username: username,
                password: password,
                telephone: telephone,
                brand_id: brand_id,
                type_login: typeLogin
            })
            .then((response) => {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                return response;
            })
            .catch((err) => {
                return err;
            });
        return result;
    }
}

export default new authService();