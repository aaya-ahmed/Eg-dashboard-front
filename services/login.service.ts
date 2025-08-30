import axios from 'axios';

export default class LoginService {
    login = async (data: any) => {
        const res = await axios.post("/api/login", data, {
            withCredentials: true,
        });
        return res.data;
    };
}
