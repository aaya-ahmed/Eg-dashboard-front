"use client"
import style from '@styles/dashboard/dashboard-layout.module.scss';
import SideBarComponent from './Components/sidebar';
import {useState } from 'react';
import '../../../styles/_global.scss'
import { AlignRight } from 'lucide-react';
import '@styles/form.scss'
import { LanguageComponent } from '@shared/language/language';
import { useTranslations } from 'next-intl';
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const [active, setActive] = useState<string>();
    const [open, setOpen] = useState(true);
    const t = useTranslations("common");
    return (
        <>
            <div className={style['dashboard-layout']} style={{ display: open ? 'grid' : 'block' }} id="dashboard-layout">
                {open && <aside>
                    <SideBarComponent setActive={setActive} setOpen={setOpen} />
                </aside>}
                <main>
                    <div className={style['header']}>

                    <div className={style['page-heading']}>
                        <div className={style['heading-left-side']}>

                            <button onClick={() => setOpen(!open)} className={`btn ${style['navbar-toggler']}`} aria-label="Toggle navigation" >
                                <i>
                                    <AlignRight stroke={'white'} size={25} />
                                </i>
                            </button>
                            <h2>{active||""}</h2>
                        </div>
                        <div className={style['heading-right-side']}>
                        <LanguageComponent />
                        </div>
                    </div>
                    </div>
                    <div className={style['page-container']}>
                        {children}
                    </div>
                </main >
                <footer className="dashboard-footer">
                    <div style={{textAlign:'center'}}>
                        <p>2025  EGCC </p>
                    </div>
                </footer>
            </div>
        </>
    )
}
