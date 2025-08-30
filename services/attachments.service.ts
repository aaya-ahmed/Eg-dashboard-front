import api from './api';
import BaseService from './base.service';

export default class AttachmentService extends BaseService{
    constructor(){
        super('Attachment')
    }
    Get=async (filters:any[]=[])=>{
        const responce=await api.post(this.baseUrl+`/GetAll`,filters);
        return responce.data;
    }
}