import { useState } from "react";
import SectionSignUpTop from "../components/SectionSignUpTop";

const UserPage = () => {

    const [tabForm, setTabForm] = useState('Sign In');

    const [inputTypePasswordHide, setInputTypePasswordHide] = useState(false);

    const [inputTypeSignUpPasswordHide, setInputTypeSignUpPasswordHide] = useState(false);

    const [inputTypeSignUpConfirmPasswordHide, setInputTypeSignUpConfirmPasswordHide] = useState(false);


    const [errorSignInForm, setErrorSignInForm] = useState('');

    const [errorSignUpForm, setErrorSignUpForm] = useState('');

    return (
        <main className="main">
            <SectionSignUpTop />
            <section className="sectionSignUp">
                <div className="container">
                    <div className="sectionSignUp__inner">
                        <div className="sectionSignUp__signUpBlock">
                            <div className="signUpBlock__tabs">
                                <button className={tabForm === 'Sign In' ? "signUpBlock__tabs-btn signUpBlock__tabs-btn--active" : "signUpBlock__tabs-btn"} onClick={() => setTabForm('Sign In')}>Sign In</button>
                                <button className={tabForm === 'Sign Up' ? "signUpBlock__tabs-btn signUpBlock__tabs-btn--active" : "signUpBlock__tabs-btn"} onClick={() => setTabForm('Sign Up')}>Sign Up</button>
                            </div>

                            {tabForm === 'Sign In' &&
                                <div className="signUpBlock__signInMain">
                                    <div className="signInMain__inputEmailBlock">
                                        <img src="/images/sectionSignUp/EnvelopeSimple.png" alt="" className="signInMain__inputEmailBlock-img" />
                                        <input type="text" className="signInMain__inputEmailBlock-input" placeholder="Email" />
                                    </div>
                                    <div className="signInMain__inputPassBlock">
                                        <img src="/images/sectionSignUp/Lock.png" alt="" className="signInMain__inputPassBlock-img" />

                                        {/* если состояние inputTypePasswordHide true,то делаем этому инпуту тип как password,в другом случае делаем тип как text,и потом по кнопке показать или скрыть пароль в инпуте для пароля таким образом его скрываем или показываем */}
                                        <input type={inputTypePasswordHide ? "password" : "text"} className="signInMain__inputPassBlock-input" placeholder="Password" />
                                        <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="signInMain__inputPassBlock-HideImg" onClick={() => setInputTypePasswordHide((prev) => (!prev))} />
                                    </div>

                                    {/* если errorSignInForm не равно пустой строке,то есть есть ошибка формы,то показываем ее */}
                                    {errorSignInForm !== '' && <p className="formErrorText">{errorSignInForm}</p>}

                                    <button className="signInMain__btn">Sign In</button>
                                </div>
                            }


                            {tabForm === 'Sign Up' &&
                                <div className="signUpBlock__signInMain">
                                    <div className="signInMain__inputEmailBlock">
                                        <img src="/images/sectionSignUp/User.png" alt="" className="signInMain__inputEmailBlock-img" />
                                        <input type="text" className="signInMain__inputEmailBlock-input" placeholder="Name" />
                                    </div>
                                    <div className="signInMain__inputEmailBlock">
                                        <img src="/images/sectionSignUp/EnvelopeSimple.png" alt="" className="signInMain__inputEmailBlock-img" />
                                        <input type="text" className="signInMain__inputEmailBlock-input" placeholder="Email" />
                                    </div>
                                    <div className="signInMain__inputPassBlock">
                                        <img src="/images/sectionSignUp/Lock.png" alt="" className="signInMain__inputPassBlock-img" />

                                        {/* если состояние inputTypePasswordHide true,то делаем этому инпуту тип как password,в другом случае делаем тип как text,и потом по кнопке показать или скрыть пароль в инпуте для пароля таким образом его скрываем или показываем */}
                                        <input type={inputTypeSignUpPasswordHide ? "password" : "text"} className="signInMain__inputPassBlock-input" placeholder="Password" />
                                        <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="signInMain__inputPassBlock-HideImg" onClick={() => setInputTypeSignUpPasswordHide((prev) => (!prev))} />
                                    </div>
                                    <div className="signInMain__inputPassBlock">
                                        <img src="/images/sectionSignUp/Lock.png" alt="" className="signInMain__inputPassBlock-img" />

                                        {/* если состояние inputTypePasswordHide true,то делаем этому инпуту тип как password,в другом случае делаем тип как text,и потом по кнопке показать или скрыть пароль в инпуте для пароля таким образом его скрываем или показываем */}
                                        <input type={inputTypeSignUpConfirmPasswordHide ? "password" : "text"} className="signInMain__inputPassBlock-input" placeholder="Confirm Password" />
                                        <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="signInMain__inputPassBlock-HideImg" onClick={() => setInputTypeSignUpConfirmPasswordHide((prev) => (!prev))} />
                                    </div>

                                    {/* если errorSignInForm не равно пустой строке,то есть есть ошибка формы,то показываем ее */}
                                    {errorSignUpForm !== '' && <p className="formErrorText">{errorSignUpForm}</p>}

                                    <button className="signInMain__btn">Sign Up</button>

                                </div>
                            }


                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default UserPage;