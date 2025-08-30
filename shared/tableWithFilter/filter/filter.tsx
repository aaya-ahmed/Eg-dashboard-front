import { useRef } from 'react';
import './filter.scss';
import closeIcon from '@assets/icons/x.webp';
export const FiterComponent = ({ formNode, visiable, setVisiable, formId }: { formNode: () => React.ReactElement<'form'>, visiable: boolean, setVisiable: (value: boolean) => void, formId: string }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const closeFilter = () => {
        setVisiable(false)
    }
    const formElement = formNode()

    return visiable ?
        <>
            <div className="filter-header">
                <button onClick={closeFilter}>
                    <img src={closeIcon} />
                </button>

                <h3>Filters</h3>
                <input type="reset" hidden value="Reset" id='resetForm' form={formId} />
                <label htmlFor='resetForm' >
                    clear
                </label>

            </div>
            <div ref={containerRef}>

                {formElement}
            </div>
            <div className="filter-submit">
                <input type="submit" value='apply filter' form={formId} />
            </div>
        </>
        : null
}