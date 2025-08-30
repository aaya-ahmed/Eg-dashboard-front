"use client"
import style from '@styles/dashboard/dashboard-layout.module.scss';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { dashboardRouter } from '../../../../router/routers';
import Image from 'next/image';
import { LogOut, SidebarClose } from 'lucide-react';
import logo from '@public/logo.png';
import { useEffect, useState } from 'react';

export default function SideBarComponent({ setActive, setOpen }: { setActive: (value: string) => void ,setOpen:(value:boolean)=>void}) {
    const routerList = dashboardRouter || [];
    const [isMobileView, setIsMobileView] = useState(false);
    const params = useParams<{ locale: string }>();
    const router = useRouter();
    const pathname = usePathname();
    const logOut = async() => {
        await fetch("/api/logout", {
            method: "POST",
        });
        router.push(`/${params.locale}/login`);
    };
    useEffect(() => {
        setActive(routerList.filter(p=>`/${params.locale}/${p.path}`==pathname)[0]?.[params.locale=='ar'?'nameAr':'name']);
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 400);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    return (
        <>
            <div className={style["sidebar-header"]}>
                {isMobileView && <div className={style["sidebar-toggler"]}>
                    <i onClick={()=>setOpen(false)}>
                        <SidebarClose stroke={"#870903"} size={25} />
                    </i>
                </div>}
                <div className={style["logo"]}>
                    <Link href={`/${params.locale}`}>
                        <Image src={logo} alt="logo" />
                    </Link>
                </div>
            </div>
            <div className={style["sidebar-menu"]}>
                <ul className={style["menu"]}>
                    {
                        routerList.map((item, i) => {
                            return <li className={style["sidebar-item"]} key={i}>
                                <Link
                                    href={`/${params.locale}/${item.path}`}
                                    className={style["sidebar-link"]}
                                    onClick={() => setActive(params.locale=='ar'?item.nameAr:item.name)}
                                >
                                    {item.icon && <item.icon size={20} stroke='white' />}
                                    <span>{params.locale=='ar'?item.nameAr:item.name}</span>
                                </Link>
                            </li>
                        })
                    }
                    <li className={style["sidebar-item"]}>
                        <Link
                            href={`#`}
                            className={style["sidebar-link"]}
                            onClick={() => logOut()}
                        >
                            <LogOut size={20} stroke='white' />
                            <span> {params.locale=='ar'?'خروج':'logout'}</span>
                        </Link>
                    </li>

                </ul>
            </div>
        </>
    )
}
