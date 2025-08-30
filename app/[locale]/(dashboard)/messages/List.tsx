"use client"
import { useGetPagedData } from '../../../../hooks/getpageddata';
import { TableWithFilterComponent } from '@shared/tableWithFilter/tablewithfilter';
import { Message } from './Messages.types';
import ContactUsService from '../../../../services/contact.service';
import { useTranslations } from 'next-intl';
const Service = new ContactUsService();

type ContactsReasonListProp = {
  selectedData: Message | null;
  setSelectedData: (data: any) => void;
  refetch: boolean
};
const MessagesListComponent = ({ selectedData, setSelectedData, refetch }: ContactsReasonListProp) => {
  const t = useTranslations('messages');
  const { listData, isLoading, setFilter, filter } =
    useGetPagedData(Service, refetch);

  return (
    <>
      <TableWithFilterComponent
        selectedRow={selectedData}
        setSelectedRow={setSelectedData}
        isLoading={isLoading}
        Data={listData}
        columns={[
          { id: 'name', name: t('name'), type: 'string' },
          { id: 'phoneNumber', name: t('phoneNumber'), type: 'string' },
          { id: 'email', name: t('email'), type: 'string' },

        ]}
        setFilter={setFilter}
        filter={filter}
        showFilter={true}
        searchKey={'phoneNumber'}
      />
    </>
  );
};
export default MessagesListComponent;
