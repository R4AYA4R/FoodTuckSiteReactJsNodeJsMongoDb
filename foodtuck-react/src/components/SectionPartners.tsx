import { useRef } from "react";
import { useIsOnCreen } from "../hooks/useIsOnScreen";

const SectionPartners = () => {

    const sectionPartersRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnCreen(sectionPartersRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    return(
        <section id="sectionPartners" className={onScreen.sectionPartnersIntersecting ? "sectionPartners__active sectionPartners" : "sectionPartners"} ref={sectionPartersRef}>
            <div className="container">
                <div className="sectionPartners__inner">
                    <h4 className="sectionImportantFood__rightBlock-subtitle sectionPartners__subtitle">Partners & Clients</h4>
                    <h2 className="sectionImportantFood__rightBlock-title sectionPartners__title">We work with the best pepole</h2>
                    <div className="sectionPartners__images">
                        <img src="/images/sectionPartners/image 2.png" alt="" className="sectionPartners__images-img" />
                        <img src="/images/sectionPartners/image 60.png" alt="" className="sectionPartners__images-img" />
                        <img src="/images/sectionPartners/image 56.png" alt="" className="sectionPartners__images-img" />
                        <img src="/images/sectionPartners/image 58.png" alt="" className="sectionPartners__images-img" />
                        <img src="/images/sectionPartners/image 57.png" alt="" className="sectionPartners__images-img" />
                        <img src="/images/sectionPartners/image 59.png" alt="" className="sectionPartners__images-img" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionPartners;