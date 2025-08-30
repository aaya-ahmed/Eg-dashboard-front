import { TableWithFilterComponent } from "@shared/tableWithFilter/tablewithfilter";
import { useGetPagedData } from "../../../../hooks/getpageddata";
import SolutionService from "../../../../services/solution.service";
import { solution } from "./solution.type";
import { useLocale, useTranslations } from "next-intl";
const Service = new SolutionService();

type SolutionListListProp = {
    selectedData: solution | null;
    setSelectedData: (data: solution) => void;
    refetch: boolean,
    setRefresh:(value:boolean)=>void
};
const SolutionList = ({ selectedData, setSelectedData, refetch,setRefresh }: SolutionListListProp) => {
    const t = useTranslations('solution');
    const locale = useLocale()
    const { listData, isLoading, setFilter, filter } =
        useGetPagedData(Service, refetch,undefined,setRefresh);

    return (
        <>
            
            <TableWithFilterComponent
                selectedRow={selectedData}
                setSelectedRow={setSelectedData}
                isLoading={isLoading}
                Data={listData}
                columns={[
                    { id: 'photo', name: t('image'), type: 'image' },
                    { id: 'subTitle', name: t('title'), type: 'string' },
                    { id: 'subTitleEn', name: t('titleEn'), type: 'string' },
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
export default SolutionList;