"use client"
import { useEffect, useRef, useState } from 'react';
import './language.scss'
import Image from 'next/image';
import lang from '@public/lang.webp'
import {useRouter, usePathname} from '@/app/i18n/navigation';
import {useLocale} from 'next-intl';
const languages: { id: number,value:string, lang: string }[] = [
    {
        id: 0,
        lang: 'English',
        value:'en',
    },
    {
        id: 1,
        lang: 'العربيه',
        value:'ar',
    }
]
export const LanguageComponent = () => {
    const [language, setLanguage] = useState(languages[0]);
    const [showLiist, setShowList] = useState(false);
    const languageRef = useRef<HTMLDivElement>(null);
      const pathname = usePathname();
     const locale = useLocale();


    const router = useRouter();
    useEffect(() => {
        setLanguage(languages[locale== 'en' ? 0 : 1])
        const handleClickOutside = (event: any) => {
            if (languageRef.current && !languageRef?.current?.contains(event.target)) {
                setShowList(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const changeLanguage = (index: number) => {
        router.push(pathname, { locale: languages[index].value }); 
    }
    const toggleLangList = () => {
        setShowList(p => !p)
    }
    return <>
        <div className="language" ref={languageRef}>
            <button onClick={toggleLangList} className='btn'>
                <Image src={lang} alt='langugae' />
                <span>{language.lang}</span>
            </button>
            {showLiist && <ul>
                {languages.map((lang, index) => <li
                    key={'language' + index}
                    onClick={() => changeLanguage(index)}
                    className={lang.id == language.id ? 'active' : ''}
                >

                    <p>{lang.lang}</p>
                </li>)}
            </ul>}
        </div>
    </>
}