import { useGetPagedData } from "../../../../hooks/getpageddata";
import { TableWithFilterComponent } from "@shared/tableWithFilter/tablewithfilter";
import ProductService from "../../../../services/products.service";
import { product } from "./model";
import { filter } from "@shared/model/filter";
import { useLocale, useTranslations } from "next-intl";
const Service = new ProductService();
type NewsListListProp = {
    selectedData: product|null
    setSelectedData: (data: product) => void;
    refetch: boolean,
    setRefetch:(value:boolean)=>void
};
const initialFilter:filter = {
    filtring: [{
        Name: "Name",
        Op:'Contains',
        type: 'String',
        Value: ''
    }],
    page: 0,
    itemPerPage: 10
}
const ProductListComponent = ({ selectedData, setSelectedData, refetch,setRefetch }: NewsListListProp) => {
    const t = useTranslations("product");
    const { listData, isLoading, setFilter, filter } =
        useGetPagedData(Service, refetch, initialFilter,setRefetch);
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
                    { id: 'name', name: t('name'), type: 'string' },
                    { id: 'nameEn', name: t('nameEn'), type: 'string' },
                    { id: 'categoryName', name: t('categoryName'), type: 'string' },
                    { id: 'unitPrice', name: t('oldPrice'), type: 'number' },
                    { id: 'discount', name: t('discount'), type: 'number' },
                    { id: 'priceAfterDiscount', name: t('price'), type: 'number' },
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
export default ProductListComponent;