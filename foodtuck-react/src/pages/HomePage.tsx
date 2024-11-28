import SectionAboutCreate from "../components/SectionAboutCreate";
import SectionImportantFood from "../components/SectionImportantFood";
import SectionMenu from "../components/SectionMenu";
import SectionPartners from "../components/SectionPartners";
import SectionTop from "../components/SectionTop";

const HomePage = ()=>{
    return(
        <main className="main">
            <SectionTop/>
            <SectionImportantFood/>
            <SectionAboutCreate/>
            <SectionPartners/>
            <SectionMenu/>
        </main>
    )
}

export default HomePage;