import { useRef, useState } from "react";
import { useIsOnCreen } from "../hooks/useIsOnScreen";
import SectionSignUpTop from "./SectionSignUpTop";

const UserFormComponent = () => {
    // в данном случае скопировали эти useRef из другого компонента,а html  элементу section дали такой же id и такие же классы(кроме одного класса нового sectionAboutCreate),так как анимация появления этой секции такая же,как и в другом компоненте,работает все нормально с одинаковыми id для IntersectionObserver(так как секции в разное время срабатывают,пока пользователь доскроллит(докрутит сайт) до определенной секции )
    const sectionImportantFoodRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnCreen(sectionImportantFoodRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen


    const [tabForm, setTabForm] = useState('Sign In');

    const [inputTypePasswordHide, setInputTypePasswordHide] = useState(false);

    const [inputEmailSignIn, setInputEmailSignIn] = useState('');

    const [inputPasswordSignIn, setInputPasswordSignIn] = useState('');


    const [inputNameSignUp, setInputNameSignUp] = useState('');

    const [inputEmailSignUp, setInputEmailSignUp] = useState('');

    const [inputPasswordSignUp, setInputPasswordSignUp] = useState('');

    const [inputConfirmPasswordSignUp, setInputConfirmPasswordSignUp] = useState('');

    const [inputTypeSignUpPasswordHide, setInputTypeSignUpPasswordHide] = useState(false);

    const [inputTypeSignUpConfirmPasswordHide, setInputTypeSignUpConfirmPasswordHide] = useState(false);


    const [errorSignInForm, setErrorSignInForm] = useState('');

    const [errorSignUpForm, setErrorSignUpForm] = useState('');


    const onSubmitSignInForm = () => {

        // если инпут почты includes('.') false(то есть инпут почты не включает в себя .(точку)) или значение инпута почты по количеству символов меньше 5,то показываем ошибку
        if (!inputEmailSignIn.includes('.') || inputEmailSignIn.length < 5) {

            setErrorSignInForm('Enter email correctly'); // показываем ошибку 

        } else {

            setErrorSignInForm(''); // указываем значение состоянию ошибки пустую строку,то есть убираем ошибку,если она была

            // здесь делаем запрос на сервер для логина

        }

    }

    const onSubmitSignUpForm = () => {

        // если состояние инпута пароля не равно состоянию инпута подтверждения пароля,то показываем ошибку,что пароли не совпадают
        if (inputPasswordSignUp !== inputConfirmPasswordSignUp) {

            setErrorSignUpForm('Passwords don`t match'); // показываем ошибку

        } else if (inputEmailSignUp.trim() === '' || inputNameSignUp.trim() === '' || inputPasswordSignUp.trim() === '') {
            // если состояние инпута почты,отфильтрованое без пробелов(с помощью trim(),то есть из этой строки убираются пробелы) равно пустой строке или инпут пароля равен пустой строке,или инпут имени равен пустой строке (все эти инпуты проверяем уже отфильтрованные по пробелу с помощью trim() ),то показываем ошибку

            setErrorSignUpForm('Fill in all fields');

        } else if (inputPasswordSignUp.length < 3 || inputPasswordSignUp.length > 32) {
            // если значение инпута пароля по длине символов меньше 3 или больше 32,то показываем ошибку

            setErrorSignUpForm('Password must be 3 - 32 characters'); // показываем ошибку

        } else if (!inputEmailSignUp.includes('.') || inputEmailSignUp.length < 5) {
            // если инпут почты includes('.') false(то есть инпут почты не включает в себя точку) или значение инпута почты по количеству символов меньше 5,то показываем ошибку

            setErrorSignUpForm('Enter email correctly');

        } else if (inputNameSignUp.length < 3) {
            // если инпут имени по количеству символов меньше 3

            setErrorSignUpForm('Name must be more than 2 characters'); // показываем ошибку

        } else {

            setErrorSignUpForm(''); // указываем значение состоянию ошибки пустую строку,то есть убираем ошибку,если она была

            // здесь делаем запрос на сервер для регистрации

        }

    }

    return (
        <section id="sectionImportantFood" className={onScreen.sectionImportantFoodIntersecting ? "sectionImportantFood sectionImportantFood__active sectionSignUp" : "sectionImportantFood sectionSignUp"} ref={sectionImportantFoodRef}>
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
                                    <input type="text" className="signInMain__inputEmailBlock-input" placeholder="Email" value={inputEmailSignIn} onChange={(e) => setInputEmailSignIn(e.target.value)} />
                                </div>
                                <div className="signInMain__inputPassBlock">
                                    <img src="/images/sectionSignUp/Lock.png" alt="" className="signInMain__inputPassBlock-img" />

                                    {/* если состояние inputTypePasswordHide true,то делаем этому инпуту тип как password,в другом случае делаем тип как text,и потом по кнопке показать или скрыть пароль в инпуте для пароля таким образом его скрываем или показываем */}
                                    <input type={inputTypePasswordHide ? "password" : "text"} className="signInMain__inputPassBlock-input" placeholder="Password" value={inputPasswordSignIn} onChange={(e) => setInputPasswordSignIn(e.target.value)} />
                                    <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="signInMain__inputPassBlock-HideImg" onClick={() => setInputTypePasswordHide((prev) => (!prev))} />
                                </div>

                                {/* если errorSignInForm не равно пустой строке,то есть есть ошибка формы,то показываем ее */}
                                {errorSignInForm !== '' && <p className="formErrorText">{errorSignInForm}</p>}

                                <button className="signInMain__btn" onClick={onSubmitSignInForm}>Sign In</button>
                            </div>
                        }


                        {tabForm === 'Sign Up' &&
                            <div className="signUpBlock__signInMain">
                                <div className="signInMain__inputEmailBlock">
                                    <img src="/images/sectionSignUp/User.png" alt="" className="signInMain__inputEmailBlock-img" />
                                    <input type="text" className="signInMain__inputEmailBlock-input" placeholder="Name" value={inputNameSignUp} onChange={(e) => setInputNameSignUp(e.target.value)} />
                                </div>
                                <div className="signInMain__inputEmailBlock">
                                    <img src="/images/sectionSignUp/EnvelopeSimple.png" alt="" className="signInMain__inputEmailBlock-img" />
                                    <input type="text" className="signInMain__inputEmailBlock-input" placeholder="Email" value={inputEmailSignUp} onChange={(e) => setInputEmailSignUp(e.target.value)} />
                                </div>
                                <div className="signInMain__inputPassBlock">
                                    <img src="/images/sectionSignUp/Lock.png" alt="" className="signInMain__inputPassBlock-img" />

                                    {/* если состояние inputTypePasswordHide true,то делаем этому инпуту тип как password,в другом случае делаем тип как text,и потом по кнопке показать или скрыть пароль в инпуте для пароля таким образом его скрываем или показываем */}
                                    <input type={inputTypeSignUpPasswordHide ? "password" : "text"} className="signInMain__inputPassBlock-input" placeholder="Password" value={inputPasswordSignUp} onChange={(e) => setInputPasswordSignUp(e.target.value)} />
                                    <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="signInMain__inputPassBlock-HideImg" onClick={() => setInputTypeSignUpPasswordHide((prev) => (!prev))} />
                                </div>
                                <div className="signInMain__inputPassBlock">
                                    <img src="/images/sectionSignUp/Lock.png" alt="" className="signInMain__inputPassBlock-img" />

                                    {/* если состояние inputTypePasswordHide true,то делаем этому инпуту тип как password,в другом случае делаем тип как text,и потом по кнопке показать или скрыть пароль в инпуте для пароля таким образом его скрываем или показываем */}
                                    <input type={inputTypeSignUpConfirmPasswordHide ? "password" : "text"} className="signInMain__inputPassBlock-input" placeholder="Confirm Password" value={inputConfirmPasswordSignUp} onChange={(e) => setInputConfirmPasswordSignUp(e.target.value)} />
                                    <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="signInMain__inputPassBlock-HideImg" onClick={() => setInputTypeSignUpConfirmPasswordHide((prev) => (!prev))} />
                                </div>

                                {/* если errorSignInForm не равно пустой строке,то есть есть ошибка формы,то показываем ее */}
                                {errorSignUpForm !== '' && <p className="formErrorText">{errorSignUpForm}</p>}

                                <button className="signInMain__btn" onClick={onSubmitSignUpForm}>Sign Up</button>

                            </div>
                        }


                    </div>
                </div>
            </div>
        </section>
    )
}

export default UserFormComponent;