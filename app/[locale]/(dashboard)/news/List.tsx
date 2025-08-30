import NewService from "../../../../services/news.service";
import { useGetPagedData } from "../../../../hooks/getpageddata";
import { TableWithFilterComponent } from "@shared/tableWithFilter/tablewithfilter";
import { useLocale, useTranslations } from "next-intl";
const Service = new NewService();
type NewsListListProp = {
    selectedData: any
    setSelectedData: (data: any) => void;
    refetch: boolean;
    setRefetch:(value:boolean)=>void
};
const NewsListComponent = ({ selectedData, setSelectedData, refetch,setRefetch }: NewsListListProp) => {
    const t = useTranslations('news');
    const { listData, isLoading, setFilter, filter } =
        useGetPagedData(Service, refetch,undefined,setRefetch);
    const locale = useLocale()

    return (
        <>
            <TableWithFilterComponent
                selectedRow={selectedData}
                setSelectedRow={setSelectedData}
                isLoading={isLoading}
                Data={listData}
                columns={[
                    { id: 'attachment', name: t('image'), type: 'image' },
                    { id: 'title', name: t('title'), type: 'string' },
                    { id: 'titleEn', name: t('titleEn'), type: 'string' },
                    { id: 'createdDate', name: t('createdDate'), type: 'date' }

                ]}
                setFilter={setFilter}
                filter={filter}
                showFilter={true}
                searchKey={locale === 'en' ? 'titleEn' : 'title'}
            />
        </>
    );
};
export default NewsListComponent;