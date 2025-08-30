import api from './api';
export default class LandingService {
    baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}DashboardData/`;
    Post = async (key: string, data: any) => {
        const responce = await api.post(this.baseUrl + key, data);
        return responce.data;
    }
    Put = async (key: string, data: any) => {
        const responce = await api.put(this.baseUrl + key, data);
        return responce.data;
    }
    Get = async (key: string) => {
        const responce = await api.get(this.baseUrl + key);
        return responce.data;
    }
    GetAll = async () => {
        const responce = await api.get(this.baseUrl);
        return responce.data;
    }
}