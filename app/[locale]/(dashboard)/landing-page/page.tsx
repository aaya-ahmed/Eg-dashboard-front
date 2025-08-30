"use client"
import { useEffect, useState } from "react";
import AboutUsFormComponent from "./components/aboutUs";
import LinkFormComponent from "./components/links";
import ContactUsFormComponent from "./components/contactUs";
import LogoFormComponent from "./components/logo";
import SliderFormComponent from "./components/sliders";
import SocialFormComponent from "./components/socialMedia";
import style from '@styles/dashboard/landingPage.module.scss';
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import AchivementFormComponent from "./components/achivement";

const sections = [
    'logo', 'socialMedia', 'sliders', 'aboutUs','achievements', 'contactUs', 'serverLinks'
];

export default function DashBoardComponent() {
    const t = useTranslations("common");
    const [openSections, setOpenSections] = useState<boolean[]>(new Array(sections.length).fill(false));
    useEffect(() => {
        toggleSection(0);
    }
    , []);

    const toggleSection = (index: number) => {
        const newOpenSections = [...openSections];
        newOpenSections[index] = !newOpenSections[index];
        setOpenSections(newOpenSections);
    };

    const renderSectionIcon = (index: number) => {
        return openSections[index] ? 
            <ChevronDown size={20} /> : 
            <ChevronRight size={20} />;
    };

    const sectionComponents = [
        <LogoFormComponent key="logo"  />,
        <SocialFormComponent key="social" />,
        <SliderFormComponent key="slider" />,
        <AboutUsFormComponent key="about" />,
        <AchivementFormComponent key="achievements" />,
        <ContactUsFormComponent key="contact"  />,
        <LinkFormComponent key="links" />
    ];

    return (
        <div className={style["landing"]}>
            <div className={style["accordion-container"]}>
                {sections.map((section, index) => (
                    <div 
                        key={section} 
                        className={`${style["accordion-item"]} ${openSections[index] ? style["open"] : ""}`}
                    >
                        <button
                            className={style["accordion-header"]}
                            onClick={() => toggleSection(index)}
                            type="button"
                        >
                            <span className={style["section-title"]}>
                                {t(section)}
                            </span>
                            <span className={style["section-icon"]}>
                                {renderSectionIcon(index)}
                            </span>
                        </button>
                        
                        <div className={`${style["accordion-content"]} ${openSections[index] ? style["expanded"] : ""}`}>
                            <div className={style["content-wrapper"]}>
                                {openSections[index]&&sectionComponents[index]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}