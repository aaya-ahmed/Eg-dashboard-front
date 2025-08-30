export type filter={
            filtring: {
                type: string,
                Name: string,
                Value: string|number,
                Op: string,
            }[],
            page: number,
            itemPerPage: number
        }
