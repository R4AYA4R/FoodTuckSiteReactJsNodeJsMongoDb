import { useRef, useState } from "react";
import SectionSignUpTop from "../components/SectionSignUpTop";
import { useIsOnCreen } from "../hooks/useIsOnScreen";
import UserFormComponent from "../components/UserFormComponent";

const UserPage = () => {

    return (
        <main className="main">
            <SectionSignUpTop />
            
            <UserFormComponent/>
        </main>
    )
}

export default UserPage;