"use client"
import { useCallback, useState } from "react";
import './tablewithfilter.scss'
import { FiterComponent } from "./filter/filter";
import { Filter } from "lucide-react";
import { responce } from "./responce";
import { generatePaginationRange } from "../../utils/utils";
import { Loader } from "@shared/loader/loader";
import { filter } from "@shared/model/filter";
import Image from "next/image";
import { useTranslations } from "next-intl";


export const TableWithFilterComponent = ({
    selectedRow,
    setSelectedRow,
    Data,
    columns,
    filter,
    setFilter,
    isLoading,
    showFilter = false,
    searchKey = ''
}: {
    selectedRow: any,
    setSelectedRow: (data: any) => void
    Data: responce | null,
    columns: { id: string, name: string, type: string, value?: any[] }[],
    filter: filter,
    setFilter: (item: filter) => void,
    isLoading: boolean,
    showFilter?: boolean,
    searchKey?: string
}) => {
    const t = useTranslations("table");
    const getNestedValue = useCallback((obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }, []);
    const onChange = (e: any) => {
        console.log(1)
        if (e.key == '13' || e.key === "Enter") {
            e.preventDefault();
            console.log(2)
            const filter = {
                filtring: [{
                    type: 'String',
                    Name: searchKey,
                    Value: e.target.value,
                    Op: 'Contains',
                }], itemPerPage: 10, page: 0
            }
            setFilter(filter)
        }

    }

    return (
        <>
            <section >
                <div className="table-fluid-container">
                    {showFilter && <div className='search-table'>
                        <input
                            type="text"
                            defaultValue={filter.filtring.filter(p => p.Name == searchKey)[0]?.Value ?? ""}
                            onKeyDown={onChange}
                            placeholder="Search..."
                            name="searchTableValue"
                            id="searchTableValue"
                        />
                    </div>}
                    {isLoading ?
                        <Loader />
                        : Data ? <>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr >
                                            {columns.map((col, index) => (
                                                <th
                                                    key={col.id}
                                                    className={`table-header-cell`}
                                                >
                                                    <div>

                                                        <span>
                                                            {col.name}
                                                        </span>
                                                    </div>


                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {Data?.data?.data?.map((row, index) => (
                                            <tr key={`row-${index}`}
                                                onClick={() => setSelectedRow(row)}

                                            >
                                                {columns.map((col, index) => <td
                                                    style={{
                                                        width: col.type == 'image' ? '50px' : ''
                                                    }}
                                                    key={`${row?.id ?? ''}-${index}`}
                                                    className={`${selectedRow?.id == row.id ? 'selected' : ''}`}
                                                >
                                                    {
                                                        col.type == 'image' ?
                                                            getNestedValue(row, col.id)?.attachmentUrl ? <Image src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${getNestedValue(row, col.id)?.attachmentUrl}`} alt='' width={'100'} height={'100'} style={{ height: '50px', width: '50px' }} /> : <>{t("noImage")}</>

                                                            :
                                                            col.type == 'boolean' ?
                                                                getNestedValue(row, col.id) ? '✔' : '✘'
                                                                :
                                                                col.type == 'number' && col.value ?
                                                                    col.value[getNestedValue(row, col.id)]
                                                                    :

                                                                    typeof getNestedValue(row, col.id) === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(getNestedValue(row, col.id)) ?
                                                                        getNestedValue(row, col.id).replace('T', '').slice(0, 10)
                                                                        : getNestedValue(row, col.id)}
                                                </td>

                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                            <div className="table-footer">
                                {/* Pagination Controls */}
                                <div className="table-control">
                                    {/* Page Size Selector */}
                                    <div className="flex items-center gap-2">
                                        <label>{t("rowsPerPage")}</label>
                                        <select
                                            value={Data.data.numberOfItems}
                                            onChange={(e) => setFilter({ ...filter, itemPerPage: +e.target.value, page: 0 })}
                                            className="p-1 border rounded"
                                        >
                                            {[5, 10, 20, 50].map((size) => (
                                                <option key={size} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="table-pagination">
                                    {/* Page Info */}
                                    <div className="page-info">
                                        {t("page")} <strong>{Data.data.page + 1}</strong> {t("of")}{" "}
                                        <strong>{Data.data.numberOfPages + 1}</strong>
                                    </div>

                                    {/* Pagination Buttons */}
                                    <div className="pagination-buttons">
                                        <button
                                            onClick={(e) => setFilter({ ...filter, page: 0 })}

                                            disabled={Data.data.page == 0
                                            }
                                            className="page-btn"
                                        >
                                            {t("first")}
                                        </button>

                                        {generatePaginationRange(
                                            Data.data.page,
                                            Data.data.numberOfPages + 1
                                        ).map((page, idx: number) =>
                                            typeof page === "number" ? (
                                                <button
                                                    key={idx}
                                                    onClick={(e) => setFilter({ ...filter, page: page })}
                                                    className={`page-btn ${Data.data.page === page ? "active" : ""
                                                        }`}
                                                >
                                                    {page + 1}
                                                </button>
                                            ) : (
                                                <span key={idx} className="page-ellipsis">…</span>
                                            )
                                        )}

                                        <button
                                            onClick={(e) => setFilter({ ...filter, page: Data.data.numberOfPages + 1 - 1 })}

                                            disabled={Data.data.numberOfPages == 0 || Data.data.page == Data.data.numberOfPages - 1}
                                            className="page-btn"
                                        >
                                            {t("last")}
                                        </button>
                                    </div>
                                </div>

                            </div></> : <></>

                    }
                </div>
            </section >

        </>
    );
}

