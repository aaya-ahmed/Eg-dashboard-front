import { Notification } from '@shared/notification';
import React, { useState, useEffect } from 'react';
import { responce } from '@shared/tableWithFilter/responce';
import { filter } from '@shared/model/filter';
import BaseService from '@/services/base.service';

export const useGetPagedData = (
  service: BaseService,
  refetch = true,
  initialFilter?:filter,
  setRefresh?:(refresh:boolean)=>void,
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listData, setListData] = useState<responce | null>(null);
  const [filter, setFilter] = useState<filter>
    (initialFilter??{ filtring: [],page:0,itemPerPage:10 })

  useEffect(() => {
    if (refetch == true){
      getData();
      setRefresh&&setRefresh(false)
    }
    return;
  }, [ filter, refetch]);

  const getData = async () => {
    try {
      setIsLoading(true);
      const result = await service.GetPaged(filter.page, filter.itemPerPage, filter.filtring);
      setListData({...result});
      setIsLoading(false)
    } catch (error) {
      // Handle error
      setIsLoading(false)
      Notification({ title: 'حدث خطا', type: 'error' });
    }
  }
  return {
    listData,
    isLoading,
    setFilter,
    filter
  };
};