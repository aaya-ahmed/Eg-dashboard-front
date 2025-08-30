import api from './api';
import BaseService from './base.service';

export default class OrdersService extends BaseService{
    constructor(){
        super('Order');
    }
        GetByCartId=async (id:string)=>{
        const responce=await api.get(this.baseUrl+`/OrderId?id=${id}`);
        return responce.data;
    }
}