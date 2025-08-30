
import api from './api';
export default class BaseService{
    baseUrl  =`${process.env.NEXT_PUBLIC_BASE_URL}`;
    constructor(url:string){
        this.baseUrl=`${this.baseUrl}${url}`;
    }
    GetPaged=async (page:number,itemPerPage:number,filters:any[]=[])=>{
        const responce=await api.post(this.baseUrl+`/GetPaged?page=${page}&itemPerPage=${itemPerPage}`,filters);
        return responce.data;
    }
    Get=async (filters:any[]=[])=>{
        const responce=await api.post(this.baseUrl+`/GetAll`,filters);
        return responce.data;
    }
    GetNames=async ()=>{
        const responce=await api.post(this.baseUrl+`/GetNames`);
        return responce.data;
    }
    Post=async (data:any)=>{
        const responce=await api.post(this.baseUrl,data);
        return responce.data;
    }
    Put=async (data:any)=>{
        const responce=await api.put(this.baseUrl,data);
        return responce.data;
    }
    PostWithFile=async (data:any)=>{
        const responce=await api.post(this.baseUrl,data, {
            headers: {
                'Content-Type': 'multipart/form-data', 
            }});
        return responce.data;
    }
    PutWithFile=async (data:any)=>{
        const responce=await api.put(this.baseUrl,data, {
            headers: {
                'Content-Type': 'multipart/form-data', 
            }});
        return responce.data;
    }
    Delete=async (id:number)=>{
        const responce=await api.delete(this.baseUrl+`?id=${id}`);
        return responce.data;
    }
    GetById=async (id:number)=>{
        const responce=await api.get(this.baseUrl+`?id=${id}`);
        return responce.data;
    }
}