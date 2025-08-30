import { Loader } from "@shared/loader/loader"

type PageContainerProp = {
    isLoading: boolean,
    lengthData: number,
    goToNextPage: () => void,
    goToPrevPage: () => void,
    currentPage: number,
    itemPerPage: number,
    Children: React.ReactNode,
}
const PageContainerComponent = ({ isLoading, lengthData, goToNextPage, goToPrevPage, currentPage, itemPerPage, Children }: PageContainerProp) => {
    return <>
        {!isLoading && <>
            {lengthData > 0 && <>
                <div className="my-2" style={{ display: 'flex', gridGap: '10px',flexWrap:'wrap' , justifyContent:'center' }}>
                    {Children}
                </div>
                <div className={`pagination-btns`}>
                    <button id={"next"} className={`btn next-btn`} onClick={goToNextPage} disabled={lengthData < itemPerPage}>التالي</button>
                    <button id={"prev"} className={`btn prev-btn`} onClick={goToPrevPage} disabled={currentPage == 0}>السابق</button>
                </div>
            </>
            }
            {
                lengthData == 0 &&
                <>
                    <div className='no-items'> no there items</div>
                </>
            }
        </>}
        {isLoading && <>
            <Loader/>
        </>}
    </>
}
export default PageContainerComponent;