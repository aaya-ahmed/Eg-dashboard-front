import { TableWithFilterComponent } from "@shared/tableWithFilter/tablewithfilter";
import { useGetPagedData } from "../../../../hooks/getpageddata";
import CategoryService from "../../../../services/category.service";
import { useLocale, useTranslations } from "next-intl";

type ListProp = {
    selectedData: any
    setSelectedData: (data: any) => void;
    refetch: boolean,
    setRefetch:(value:boolean)=>void
};
const Service = new CategoryService();

const ListComponent = ({ selectedData, setSelectedData, refetch,setRefetch }: ListProp) => {
    const t = useTranslations('category')
    const locale = useLocale()

    const { listData, isLoading, setFilter, filter } =
        useGetPagedData(Service, refetch,undefined,setRefetch);

    return (
        <>
            <TableWithFilterComponent
                selectedRow={selectedData}
                setSelectedRow={setSelectedData}
                isLoading={isLoading}
                Data={listData}
                columns={[
                    { id: 'name', name: t('name'), type: 'string' },
                    { id: 'nameEn', name: t('nameEn'), type: 'string' },
                    { id: 'createdDate', name: t('createdDate'), type: 'date' }

                ]}
                setFilter={setFilter}
                filter={filter}
                showFilter={true}
                searchKey={locale === 'en' ? 'subTitleEn' : 'subTitle'}
            />
        </>
    );
};
export default ListComponent;