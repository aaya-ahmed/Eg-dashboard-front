import { LucideIcon } from "lucide-react"

export type IRouter =
    {
        path: string,
        name: string,
        nameAr: string,
        protected?: boolean,
        icon?:LucideIcon,
        nestedPath?: nestedPath[]
    }
type nestedPath = {
    path: string,
    name: string,
        nameAr: string,
    icon?:LucideIcon,
    protected?: boolean,
}