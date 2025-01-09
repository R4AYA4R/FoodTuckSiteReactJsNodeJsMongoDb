import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import SectionSignUpTop from "../components/SectionSignUpTop";
import { useIsOnCreen } from "../hooks/useIsOnScreen";
import UserFormComponent from "../components/UserFormComponent";
import { useTypedSelector } from "../hooks/useTypedSelector";
import SectionUserPageTop from "../components/SectionUserPageTop";
import { useActions } from "../hooks/useActions";
import axios from "axios";
import { AuthResponse } from "../types/types";
import $api, { API_URL } from "../http/http";
import AuthService from "../service/AuthService";
import { useLocation } from "react-router-dom";

const UserPage = () => {

    const [tab, setTab] = useState('Dashboard');

    const { isAuth, user, isLoading } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния isAuth,используя наш типизированный хук для useSelector

    const { setLoadingUser, checkAuthUser, logoutUser, setUser } = useActions(); // берем actions для изменения состояния пользователя у слайса(редьюсера) userSlice у нашего хука useActions уже обернутые в диспатч,так как мы оборачивали это в самом хуке useActions


    const [inputNameAccSettings, setInputNameAccSettings] = useState('');

    const [inputEmailAccSettings, setInputEmailAccSettings] = useState('');

    const [errorAccSettings, setErrorAccSettings] = useState('');


    const [inputPassCurrent, setInputPassCurrent] = useState('');

    const [inputPassNew, setInputPassNew] = useState('');

    const [inputPassConfirm, setInputPassConfirm] = useState('');

    const [passHideCurrent, setPassHideCurrent] = useState(true);

    const [passHideNew, setPassHideNew] = useState(true);

    const [passHideConfirm, setPassHideConfirm] = useState(true);

    const [errorPassSettings, setErrorPassSettings] = useState('');


    const [inputNameMealProduct, setInputNameMealProduct] = useState('');

    const [selectBlockAdminFormActive, setSelectBlockAdminFormActive] = useState(false);

    const [selectBlockAdminFormValue, setSelectBlockAdminFormValue] = useState(''); // состояние для значения селекта категорий

    const [inputAmountValue, setInputAmountValue] = useState(1); // состояние для инпута цены в форме создания нового товара


    const [imgPath, setImgPath] = useState(''); // состояние для пути картинки,который мы получим от сервера,когда туда загрузим картинку(чтобы отобразить выбранную пользователем(админом) картинку уже полученную от сервера, когда туда ее загрузим)

    const [inputFile, setInputFile] = useState<File>(); // состояние для файла картинки продукта,которые пользователь выберет в инпуте для файлов,указываем тут тип any,чтобы не было ошибки,в данном случае указываем тип как File

    const newProductImage = useRef<HTMLImageElement>(null); // используем useRef для подключения к html тегу картинки нового товара,чтобы взять у него ширину и проверить ее,в generic типе этого useRef указываем,что в этом useRef будет HTMLImageElement(то есть картинка)


    const [errorAdminForm, setErrorAdminForm] = useState('');



    // фукнция для запроса на сервер на изменение информации пользователя в базе данных,лучше описать эту функцию в сервисе(отдельном файле для запросов типа AuthService),например, но в данном случае уже описали здесь,также можно это сделать было через useMutation с помощью react query,но так как мы в данном случае обрабатываем ошибки от сервера вручную,то сделали так
    const changeAccInfoInDb = async (userId: number, name: string, email: string) => {

        return $api.put('/changeAccInfo', { userId, name, email }); // возвращаем put запрос на сервер на эндпоинт /changeAccInfo для изменения данных пользователя и передаем вторым параметром объект с полями,используем здесь наш axios с определенными настройками,которые мы задали ему в файле http,чтобы правильно работали запросы на authMiddleware на проверку на access токен на бэкэнде,чтобы когда будет ошибка от бэкэнда от authMiddleware,то будет сразу идти повторный запрос на /refresh на бэкэнде для переобновления access токена и refresh токена(refresh и access токен будут обновляться только если текущий refresh токен еще годен по сроку годности,мы это прописали в функции у эндпоинта /refresh на бэкэнде) и опять будет идти запрос на изменение данных пользователя в базе данных(на /changeAccInfo в данном случае) но уже с переобновленным access токеном,который теперь действителен(это чтобы предотвратить доступ к аккаунту мошенникам,если они украли аккаунт,то есть если access токен будет не действителен уже,то будет запрос на /refresh для переобновления refresh и access токенов, и тогда у мошенников уже будут не действительные токены и они не смогут пользоваться аккаунтом,но если текущий refresh токен тоже будет не действителен,то будет ошибка,и пользователь не сможет получить доступ к этой функции(изменения данных пользователя в данном случае),пока заново не войдет в аккаунт)

    }

    // фукнция для запроса на сервер на изменение пароля пользователя в базе данных
    const changePassInDb = async (userId: number, currentPass: string, newPass: string) => {

        return $api.put('/changeAccPass', { userId, currentPass, newPass }); // возвращаем put запрос на сервер на эндпоинт /changeAccPass для изменения данных пользователя и передаем вторым параметром объект с полями,используем здесь наш axios с определенными настройками,которые мы задали ему в файле http,чтобы правильно работали запросы на authMiddleware на проверку на access токен на бэкэнде,чтобы когда будет ошибка от бэкэнда от authMiddleware,то будет сразу идти повторный запрос на /refresh на бэкэнде для переобновления access токена и refresh токена(refresh и access токен будут обновляться только если текущий refresh токен еще годен по сроку годности,мы это прописали в функции у эндпоинта /refresh на бэкэнде) и опять будет идти запрос на изменение пароля пользователя в базе данных(на /changePass в данном случае) но уже с переобновленным access токеном,который теперь действителен(это чтобы предотвратить доступ к аккаунту мошенникам,если они украли аккаунт,то есть если access токен будет не действителен уже,то будет запрос на /refresh для переобновления refresh и access токенов, и тогда у мошенников уже будут не действительные токены и они не смогут пользоваться аккаунтом,но если текущий refresh токен тоже будет не действителен,то будет ошибка,и пользователь не сможет получить доступ к этой функции(изменения данных пользователя в данном случае),пока заново не войдет в аккаунт)

    }


    // функция для проверки авторизован ли пользователь(валиден ли его refresh токен)
    const checkAuth = async () => {

        setLoadingUser(true); // изменяем поле isLoading состояния пользователя в userSlice на true(то есть пошла загрузка)

        // оборачиваем в try catch,чтобы отлавливать ошибки
        try {

            // здесь используем уже обычный axios,указываем тип в generic,что в ответе от сервера ожидаем наш тип данных AuthResponse,указываем наш url до нашего роутера(/api) на бэкэнде(API_URL мы импортировали из другого нашего файла) и через / указываем refresh(это тот url,где мы выдаем access и refresh токены на бэкэнде),и вторым параметром указываем объект опций,указываем поле withCredentials true(чтобы автоматически с запросом отправлялись cookies)
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });

            console.log(response);

            checkAuthUser(response.data); // вызываем нашу функцию(action) для изменения состояния пользователя и передаем туда response.data(в данном случае это объект с полями accessToken,refreshToken и user,которые пришли от сервера)

        } catch (e: any) {

            console.log(e.reponse?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e

        } finally {

            // в блоке finally будет выполнен код в независимости от try catch(то есть в любом случае,даже если будет ошибка)
            setLoadingUser(false); // изменяем поле isLoading состояния пользователя в userSlice на false(то есть загрузка закончена)

        }

    }


    // при запуске сайта(в данном случае при запуске этого компонента,то есть этой страницы) будет отработан код в этом useEffect
    useEffect(() => {

        // если localStorage.getItem('token') true,то есть по ключу token в localStorage что-то есть
        if (localStorage.getItem('token')) {

            checkAuth(); // вызываем нашу функцию checkAuth(),которую описали выше для проверки авторизован ли пользователь

        }

        console.log(isAuth);
        console.log(user.userName);

    }, [])


    // функция для выхода из аккаунта
    const logout = async () => {

        // оборачиваем в try catch,чтобы отлавливать ошибки 
        try {

            const response = await AuthService.logout(); // вызываем нашу функцию logout() у AuthService

            logoutUser(); // вызываем нашу функцию(action) для изменения состояния пользователя для выхода из аккаунта и в данном случае не передаем туда ничего

            setTab('Dashboard'); // изменяем состояние таба на dashboard то есть показываем секцию dashboard(в данном случае главный отдел пользователя),чтобы при выходе из аккаунта и входе обратно у пользователя был открыт главный отдел аккаунта,а не настройки или последний отдел,который пользователь открыл до выхода из аккаунта

            setInputEmailAccSettings(''); // изменяем состояние инпута почты на пустую строку,чтобы когда пользователь выходил из аккаунта очищался инпут почты,иначе,когда пользователь выйдет из аккаунта и войдет обратно,то в инпуте почты может быть текст,который он до этого там вводил

            setInputNameAccSettings(''); // изменяем состояние инпута имени на пустую строку,чтобы когда пользователь выходил из аккаунта очищался инпут имени,иначе,когда пользователь выйдет из аккаунта и войдет обратно,то в инпуте имени может быть текст,который он до этого там вводил

            setErrorAccSettings(''); // изменяем состояние ошибки формы изменения данных пользователя на пустую строку,чтобы когда пользователь выходил из аккаунта убиралась ошибка,даже если она там была,иначе,когда пользователь выйдет из аккаунта и войдет обратно,то может показываться ошибка,которую пользователь до этого получил


            // изменяем состояния инпутов у формы для изменения пароля пользователя на пустую строку,чтобы когда пользователь выходил из аккаунта очищались эти поля,иначе,когда пользователь выйдет из аккаунта и войдет обратно,то могут остаться те значения в этих инпутах,которые пользователь вводил до этого
            setInputPassConfirm('');
            setInputPassCurrent('');
            setInputPassNew('');

            // изменяем значения состояний для типов инпутов(чтобы менять инпутам тип на password или text при нажатии на кнопку скрытия или показа пароля) у формы для изменения пароля пользователя,чтобы когда пользователь выходил из аккаунта эти состояния опять принимали дефолтное значение(то есть скрывали текст пароля изначально),иначе,когда пользователь выйдет из аккаунта и войдет обратно,то могут по-разному отображаться инпуты для паролей,какие-то скрыты,какие-то открыты,в зависимости от того,что пользователь до этого нажимал
            setPassHideConfirm(true);
            setPassHideCurrent(true);
            setPassHideNew(true);

            setErrorPassSettings(''); // изменяем состояние ошибки формы изменения пароля пользователя на пустую строку,чтобы когда пользователь выходил из аккаунта убиралась ошибка,даже если она там была,иначе,когда пользователь выйдет из аккаунта и войдет обратно,то может показываться ошибка,которую пользователь до этого получил

        } catch (e: any) {

            console.log(e.reponse?.data?.message); // если была ошибка,то выводим ее в логи,берем ее из ответа от сервера из поля message из поля data у response у e 

        }

    }


    // функция для формы изменения имени и почты пользователя,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const onSubmitAccSettingsForm = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если inputEmailAccSettings true(то есть в inputEmailAccSettings есть какое-то значение) или inputNameAccSettings true(то есть в inputNameAccSettings есть какое-то значение), то делаем запрос на сервер для изменения данные пользователя,если же в поля инпутов имени или почты пользователь ничего не ввел,то не будет отправлен запрос
        if (inputEmailAccSettings || inputNameAccSettings) {

            try {

                let name = inputNameAccSettings.trim();  // помещаем в переменную значение инпута имени и убираем у него пробелы с помощю trim() (указываем ей именно let,чтобы можно было изменять)

                // если name true(то есть в name есть какое-то значение),то изменяем первую букву этой строки инпута имени на первую букву этой строки инпута имени только в верхнем регистре,делаем эту проверку,иначе ошибка,так как пользователь может не ввести значение в инпут имени и тогда будет ошибка при изменении первой буквы инпута имени
                if (name) {

                    name = name.replace(name[0], name[0].toUpperCase()); // заменяем первую букву этой строки инпута имени на первую букву этой строки инпута имени только в верхнем регистре,чтобы имя начиналось с большой буквы,даже если написали с маленькой

                }

                const response = await changeAccInfoInDb(user.id, name, inputEmailAccSettings); // вызываем нашу функцию запроса на сервер для изменения данных пользователя,передаем туда user.id(id пользователя) и инпуты имени и почты

                console.log(response.data);

                setUser(response.data); // изменяем сразу объект пользователя на данные,которые пришли от сервера,чтобы не надо было обновлять страницу для обновления данных


                setErrorAccSettings(''); // изменяем состояние ошибки на пустую строку,то есть убираем ошибку

                setInputEmailAccSettings(''); // изменяем состояние инпута почты на пустую строку,чтобы убирался текст в инпуте почты после успешного запроса

                setInputNameAccSettings(''); // изменяем состояние инпута имени на пустую строку,чтобы убирался текст в инпуте имени после успешного запроса

            } catch (e: any) {

                console.log(e.response?.data?.message); // выводим ошибку в логи

                return setErrorAccSettings(e.response?.data?.message);  // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию,чтобы не очищались поля инпутов,если есть ошибка

            }

        }



    }


    // функция для формы изменения пароля пользователя,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const onSubmitPassSettingsForm = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если инпут текущего пароля равен пустой строке,то показываем ошибку
        if (inputPassCurrent === '') {

            setErrorPassSettings('Enter current password');

        } else if (inputPassNew.length < 3 || inputPassNew.length > 32) {
            // если инпут нового пароля по длине(по количеству символов) меньше 3 или больше 32,то показываем ошибку
            setErrorPassSettings('New password must be 3 - 32 characters');
        } else if (inputPassNew !== inputPassConfirm) {
            // если значение инпута нового пароля не равно значению инпута подтвержденного пароля,то показываем ошибку
            setErrorPassSettings('Passwords don`t match ');
        } else {

            // здесь обрабатываем запрос на сервер для изменения пароля пользователя с помощью try catch(чтобы отлавливать ошибки,можно было сделать это с помощью react query,но в данном случае уже сделали так)

            try {

                const response = await changePassInDb(user.id, inputPassCurrent, inputPassNew); // вызываем нашу функцию запроса на сервер для изменения пароля пользователя,передаем туда user.id(id пользователя) и значения инпутов текущего пароля и нового пароля

                console.log(response.data);

            } catch (e: any) {

                console.log(e.response?.data?.message); // выводим ошибку в логи

                return setErrorPassSettings(e.response?.data?.message); // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию,чтобы не очищались поля инпутов,если есть ошибка

            }


            setErrorPassSettings(''); // изменяем состояние ошибки в форме для изменения пароля пользователя на пустую строку,то есть убираем ошибку 

            // изменяем состояния инпутов на пустые строки(то есть убираем у них значения)
            setInputPassCurrent('');
            setInputPassNew('');
            setInputPassConfirm('');

        }

    }


    // функция для выбора картинки с помощью инпута для файлов
    const inputLoadImageHandler = async (e: ChangeEvent<HTMLInputElement>) => {

        // e.target.files - массив файлов,которые пользователь выбрал при клике на инпут для файлов, если e.target.files true,то есть пользователь выбрал файл
        if (e.target.files) {

            setInputFile(e.target.files[0]); // помещаем в состояние файл,который выбрал пользователь,у files указываем тут [0],то есть берем первый элемент массива(по индексу 0) этих файлов инпута

            const formData = new FormData(); // создаем объект на основе FormData(нужно,чтобы передавать файлы на сервер)

            formData.append('image', e.target.files[0]); // добавляем в этот объект formData по ключу(названию) 'image' сам файл в e.target.files[0] по индексу 0 (первым параметром тут передаем название файла,вторым сам файл)

            console.log(e.target.files[0]);


            // оборачиваем в try catch,чтобы отлавливать ошибки и делаем пока такой запрос на сервер для загрузки файла на сервер,загружаем объект formData(лучше вынести это в отдельную функцию запроса на сервер но и так можно),указываем здесь наш инстанс axios ($api в данном случае),чтобы обрабатывать правильно запросы с access токеном и refresh токеном,в данном случае делаем запрос на бэкэнд для загрузки файла и там сразу будет проверка нашего authMiddleware на нашем node js сервере для проверки на access токен
            try {

                const response = await $api.post(`${API_URL}/uploadFile`, formData); // делаем запрос на сервер для сохранения файла на сервере и как тело запроса тут передаем formData

                console.log(response);

                setImgPath(`http://localhost:5000/${response.data.name}`); // помещаем в состояние imgPath путь до файла,то есть пишем путь до нашего сервера (http://localhost:5000/) в данном случае и добавляем название файла,который нужно показать,который есть в папке (в данном случае static) на нашем сервере,это название пришло от сервера

                setErrorAdminForm(''); // убираем ошибку формы создания нового товара(чтобы если до этого пользователь выбрал неправильный файл и получил ошибку,то при повторном выборе файла эта ошибка убиралась)

            } catch (e:any) {

                return setErrorAdminForm(e.response?.data?.message); // возвращаем и показываем ошибку,используем тут return чтобы если будет ошибка,чтобы код ниже не работал дальше,то есть на этой строчке завершим функцию,чтобы не очищались поля инпутов,если есть ошибка

            }


        }

    }

    // функция для удаления файла на сервере,указываем тип fileName как string | undefined,так как иначе показывает ошибку,что нельзя передать параметр этой функции,если значение этого параметра undefined
    const deleteFileRequest = async (fileName:string | undefined) => {

        try{

            const response = await axios.delete(`${API_URL}/deleteFile/${fileName}`); // делаем запрос на сервер для удаления файла на сервере и указываем в ссылке на эндпоинт параметр fileName,чтобы на бэкэнде его достать,здесь уже используем обычный axios вместо нашего axios с определенными настройками ($api в данном случае),так как на бэкэнде у этого запроса на удаление файла с сервера уже не проверяем пользователя на access токен,так как проверяем это у запроса на загрузку файла на сервер(поэтому будет и так понятно,валидный(годен ли по сроку годности еще) ли access токен у пользователя или нет)

            console.log(response.data); // выводим в логи ответ от сервера

            setImgPath(''); // изменяем состояние imgPath(пути картинки) на пустую строку,чтобы картинка не показывалась,если она не правильная по размеру и была удалена с сервера(иначе картинка показывается,даже если она удалена с сервера)


        }catch(e:any){

            setErrorAdminForm(e.response?.data?.message); // показываем ошибку в форме создания нового товара для админа

        }

    }

    // при изменении imgPath проверяем ширину и высоту картинки,которую выбрал пользователь(мы помещаем путь до картинки на нашем сервере node js в тег img и к этому тегу img привязали useRef с помощью которого берем ширину и высоту картинки)
    useEffect(()=>{

        // используем тут setTimeout(код в этом callback будет выполнен через время,которое указали вторым параметром в setTimeout после запятой,это время указывается в миллисекундах,в данном случае этот код будет выполнен через 0.1 секунду(через 100 миллисекунд)),в данном случае это делаем для того,чтобы успела появится новая картинка,после того,как пользователь ее выбрал в ипнуте файлов,иначе не успевает появиться и показывает ширину картинки как 0
        setTimeout(()=>{

            console.log(newProductImage.current?.width);
            console.log(newProductImage.current?.height);

            // если newProductImage.current true,то есть в этом useRef что-то есть(эта проверка просто потому что этот useRef может быть undefined и выдает ошибку об этом)
            if(newProductImage.current){

                if(newProductImage.current.width < 312 || newProductImage.current.height < 267){
                    // если newProductImage.current.width меньше 312(то есть если ширина картинки меньше 312),или если высота картинки меньше 267,то показываем ошибку

                    setErrorAdminForm('Width of image must be more than 311px and height must be more than 266px');

                    // делаем удаление файла(картинки) на сервере,который не правильного размера ширины и высоты,так как если не удалять,а нужна конкретная ширина и высота картинки,то файлы будут просто скачиваться на наш node js сервер и не удаляться,поэтому отдельно делаем запрос на сервер на удаление файла
                    deleteFileRequest(inputFile?.name); // передаем в нашу функцию название файла,который пользователь выбрал в инпуте файлов(мы поместили его в состояние inputFile),наша функция deleteFileRequest делает запрос на сервер на удаление файла и возвращает ответ от сервера(в данном случае при успешном запросе ответ от сервера будет объект с полями)

                }

            }


        },100)

    },[imgPath])


    // функция для формы создания нового товара для админа,указываем тип событию e как тип FormEvent и в generic указываем,что это HTMLFormElement(html элемент формы)
    const onSubmitNewMealAdminForm = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault(); // убираем дефолтное поведение браузера при отправке формы(перезагрузка страницы),то есть убираем перезагрузку страницы в данном случае

        // если значение инпута названия продукта,из которого убрали пробелы с помощью trim() равно пустой строке,то выводим ошибку(то есть если без пробелов это значение равно пустой строке,то показываем ошибку) или если это значение меньше 3
        if (inputNameMealProduct.trim() === '' || inputNameMealProduct.length < 3) {

            setErrorAdminForm('Product name must be more than 2 characters');

        } else if (selectBlockAdminFormValue === '') {
            // если состояние значения селекта категорий равно пустой строке,то показываем ошибку
            setErrorAdminForm('Choose category');

        } else if (!inputFile) {
            // если состояние файла false(или null),то есть его(файла) нет,то показываем ошибку
            setErrorAdminForm('Choose product image');
        } else {

            // здесь будем уже делать запрос на сервер для создания нового товара

        }


    }


    const selectItemHandlerBurgers = () => {

        setSelectBlockAdminFormValue('Burgers'); // изменяем состояние selectBlockValue на значение Rating

        setSelectBlockAdminFormActive(false); // изменяем состояние selectBlockActive на значение false,то есть убираем появившийся селект блок
    }

    const selectItemHandlerDrinks = () => {

        setSelectBlockAdminFormValue('Drinks'); // изменяем состояние selectBlockValue на значение Rating

        setSelectBlockAdminFormActive(false); // изменяем состояние selectBlockActive на значение false,то есть убираем появившийся селект блок
    }

    const selectItemHandlerPizza = () => {

        setSelectBlockAdminFormValue('Pizza'); // изменяем состояние selectBlockValue на значение Rating

        setSelectBlockAdminFormActive(false); // изменяем состояние selectBlockActive на значение false,то есть убираем появившийся селект блок
    }

    const selectItemHandlerSandwiches = () => {

        setSelectBlockAdminFormValue('Sandwiches'); // изменяем состояние selectBlockValue на значение Rating

        setSelectBlockAdminFormActive(false); // изменяем состояние selectBlockActive на значение false,то есть убираем появившийся селект блок
    }


    const changeInputAmountValue = (e: ChangeEvent<HTMLInputElement>) => {

        // если текущее значение инпута > 99,то изменяем состояние инпута цены на 99,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число
        if (+e.target.value > 99) {

            setInputAmountValue(99);

        } else if (+e.target.value <= 0) {

            // если текущее значение инпута < или равно 0,то ставим значение инпуту 0,чтобы меньше 0 не уменьшалось
            setInputAmountValue(0);

        } else {

            setInputAmountValue(+e.target.value);  // изменяем состояние инпута цены на текущее значение инпута,указываем + перед e.target.value,чтобы перевести текущее значение инпута из строки в число

        }

    }

    const handlerMinusAmountBtn = () => {

        // если значение инпута количества товара больше 1,то изменяем это значение на - 1,в другом случае указываем ему значение 1,чтобы после нуля не отнимало - 1
        if (inputAmountValue > 1) {

            setInputAmountValue((prev) => prev - 1);

        } else {

            setInputAmountValue(1);

        }

    }

    const handlerPlusAmountBtn = () => {

        // если значение инпута количества товара меньше 99 и больше или равно 0,то изменяем это значение на + 1,в другом случае указываем ему значение 99,чтобы больше 99 не увеличивалось
        if (inputAmountValue < 99 && inputAmountValue >= 0) {

            setInputAmountValue((prev) => prev + 1);

        } else {

            setInputAmountValue(99);

        }

    }


    // если состояние загрузки true,то есть идет загрузка запроса на сервер,то показываем лоадер(загрузку),если не отслеживать загрузку при функции checkAuth(для проверки на refresh токен при запуске страницы),то будет не правильно работать(только через некоторое время,когда запрос на /refresh будет отработан,поэтому нужно отслеживать загрузку и ее возвращать как разметку страницы,пока грузится запрос на /refresh)
    if (isLoading) {

        // возвращаем тег main с классом main,так как указали этому классу стили,чтобы был прижат header и footer
        return (
            <main className="main">
                <div className="container">
                    <div className="innerForLoader">
                        <div className="loader"></div>
                    </div>
                </div>
            </main>
        )

    }


    // если isAuth false,то есть пользователь не авторизован(когда возвращается ошибка от сервера от эндпоинта /refresh в функции checkAuth,то isAuth становится типа false,и тогда пользователя типа выкидывает из аккаунта,то есть в данном случае возвращаем компонент формы регистрации и авторизации),то возвращаем компонент формы,вместо страницы пользователя,когда пользотватель логинится и вводит правильно данные,то эта проверка на isAuth тоже работает правильно и если данные при логине были введены верно,то сразу показывается страница пользователя(даже без использования отдельного useEffect)
    if (!isAuth) {

        return (
            <main className="main">
                <SectionSignUpTop />

                <UserFormComponent />
            </main>
        )

    }


    return (
        <main className="main">

            <SectionUserPageTop />

            <section className="sectionUserPage">
                <div className="container">
                    <div className="sectionUserPage__inner">
                        <div className="sectionUserPage__leftBar">
                            <ul className="sectionUserPage__leftBar-menu">
                                <li className={tab === 'Dashboard' ? "leftBar__menu-item leftBar__menu-item--active" : "leftBar__menu-item"} onClick={() => setTab('Dashboard')}>
                                    <img src="/images/sectionUserPage/dashboard 2.png" alt="" className="leftBar__item-img" />
                                    <button className="leftBar__menu-btn" >Dashboard</button>
                                </li>


                                {/* если user.role === 'USER'(то есть если роль пользователя равна "USER"),то показываем таб с настройками профиля пользователя */}
                                {user.role === 'USER' &&

                                    <li className={tab === 'Account Settings' ? "leftBar__menu-item leftBar__menu-item--active" : "leftBar__menu-item"} onClick={() => setTab('Account Settings')}>
                                        <img src="/images/sectionUserPage/dashboard 2 (1).png" alt="" className="leftBar__item-img" />
                                        <button className={tab === 'Account Settings' ? "leftBar__menu-btn leftBar__menu-btn--active" : "leftBar__menu-btn"} >Account Settings</button>
                                    </li>

                                }

                                {/* если user.role === "ADMIN"(то есть если роль пользователя равна "ADMIN"),то показываем таб с панелью администратора */}
                                {user.role === 'ADMIN' &&

                                    <li className={tab === 'Admin Panel' ? "leftBar__menu-item leftBar__menu-item--active" : "leftBar__menu-item"} onClick={() => setTab('Admin Panel')}>
                                        <img src="/images/sectionUserPage/dashboard 2 (1).png" alt="" className="leftBar__item-img" />
                                        <button className={tab === 'Account Settings' ? "leftBar__menu-btn leftBar__menu-btn--active" : "leftBar__menu-btn"} >Admin Panel</button>
                                    </li>

                                }

                            </ul>

                            <div className="leftBar__menu-item" onClick={logout}>
                                <img src="/images/sectionUserPage/dashboard 2 (2).png" alt="" className="leftBar__item-img" />
                                <button className="leftBar__menu-btn leftBar__menu-btnLogout">Logout</button>
                            </div>
                        </div>
                        <div className="sectionUserPage__mainBlock">

                            {tab === 'Dashboard' &&
                                <div className="sectionUserPage__mainBlock-inner">
                                    <div className="sectionUserPage__dashboard">
                                        <img src="/images/sectionUserPage/Ellipse 5.png" alt="" className="dashboard__img" />
                                        <h3 className="dashboard__name">{user.userName}</h3>
                                        <p className="dashboard__email">{user.email}</p>

                                        {/* если user.role === 'USER'(то есть если роль пользователя равна "USER"),то показываем кнопку, по которой можно перейти в настройки аккаунта пользователя*/}
                                        {user.role === 'USER' &&
                                            <button className="dashboard__btn" onClick={() => setTab('Account Settings')}>Edit Profile</button>
                                        }

                                        {/* если user.role === "ADMIN"(то есть если роль пользователя равна "ADMIN"),то показываем кнопку,по которой можно перейти в админ панель */}
                                        {user.role === 'ADMIN' &&
                                            <button className="dashboard__btn" onClick={() => setTab('Admin Panel')}>Go to Admin Panel</button>
                                        }

                                    </div>
                                </div>
                            }

                            {/* если user.role === 'USER'(то есть если роль пользователя равна "USER") и tab === 'Account Settings',то показываем таб с настройками профиля пользователя */}
                            {user.role === 'USER' && tab === 'Account Settings' &&
                                <div className="sectionUserPage__mainBlock-inner sectionUserPage__mainBlock-accountSettings">

                                    <form action="" className="settings__accountSettings-form" onSubmit={onSubmitAccSettingsForm}>
                                        <h2 className="accountSettings__form-title">Account Settings</h2>
                                        <div className="accountSettings__form-main">
                                            <div className="accountSettings__form-item">
                                                <p className="accountSettings__form-text">Name</p>
                                                <input type="text" className="signInMain__inputEmailBlock-input accountSettings__input" placeholder={`${user.userName}`} value={inputNameAccSettings} onChange={(e) => setInputNameAccSettings(e.target.value)} />
                                            </div>
                                            <div className="accountSettings__form-item">
                                                <p className="accountSettings__form-text">Email</p>
                                                <input type="text" className="signInMain__inputEmailBlock-input accountSettings__input" placeholder={`${user.email}`} value={inputEmailAccSettings} onChange={(e) => setInputEmailAccSettings(e.target.value)} />
                                            </div>

                                            {/* если errorAccSettings true(то есть в состоянии errorAccSettings что-то есть),то показываем текст ошибки */}
                                            {errorAccSettings &&
                                                <p className="formErrorText">{errorAccSettings}</p>
                                            }

                                            {/* указываем тип submit кнопке,чтобы она по клику активировала форму,то есть выполняла функцию,которая выполняется в onSubmit в форме */}
                                            <button className="accountSettings__form-btn" type="submit">Save Changes</button>

                                        </div>
                                    </form>

                                    <form action="" className="settings__accountSettings-form settings__passSettings-form" onSubmit={onSubmitPassSettingsForm}>
                                        <h2 className="accountSettings__form-title">Change Password</h2>
                                        <div className="accountSettings__form-main">
                                            <div className="accountSettings__form-item passwordSettings__item">
                                                <p className="accountSettings__form-text">Current Password</p>

                                                {/* если passHideCurrent true(то есть состояние для кнопки скрытия пароля инпута true), то указываем тип инпуту как password(чтобы были точки вместо символов), в другом случае тип как text */}
                                                <input type={passHideCurrent ? "password" : "text"} className="signInMain__inputEmailBlock-input accountSettings__input" placeholder="Current Password" value={inputPassCurrent} onChange={(e) => setInputPassCurrent(e.target.value)} />
                                                <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="passwordSettings__item-img" onClick={() => setPassHideCurrent((prev) => !prev)} />
                                            </div>
                                            <div className="accountSettings__form-item passwordSettings__item">
                                                <p className="accountSettings__form-text">New Password</p>
                                                <input type={passHideNew ? "password" : "text"} className="signInMain__inputEmailBlock-input accountSettings__input" placeholder="New Password" value={inputPassNew} onChange={(e) => setInputPassNew(e.target.value)} />
                                                <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="passwordSettings__item-img" onClick={() => setPassHideNew((prev) => !prev)} />
                                            </div>
                                            <div className="accountSettings__form-item passwordSettings__item">
                                                <p className="accountSettings__form-text">Confirm Password</p>
                                                <input type={passHideConfirm ? "password" : "text"} className="signInMain__inputEmailBlock-input accountSettings__input" placeholder="Confirm Password" value={inputPassConfirm} onChange={(e) => setInputPassConfirm(e.target.value)} />
                                                <img src="/images/sectionSignUp/eye-open 1.png" alt="" className="passwordSettings__item-img" onClick={() => setPassHideConfirm((prev) => !prev)} />
                                            </div>

                                            {/* если errorPassSettings true(то есть в состоянии errorPassSettings что-то есть),то показываем текст ошибки */}
                                            {errorPassSettings &&
                                                <p className="formErrorText">{errorPassSettings}</p>
                                            }

                                            {/* указываем тип submit кнопке,чтобы она по клику активировала форму,то есть выполняла функцию,которая выполняется в onSubmit в форме */}
                                            <button className="accountSettings__form-btn" type="submit">Change Password</button>

                                        </div>
                                    </form>

                                </div>
                            }

                            {/* если user.role === "ADMIN"(то есть если роль пользователя равна "ADMIN") и tab === 'Admin Panel',то показываем таб с панелью администратора */}
                            {user.role === 'ADMIN' && tab === 'Admin Panel' &&
                                <div className="sectionUserPage__mainBlock-inner sectionUserPage__mainBlock-adminPanel">
                                    <form action="" className="settings__accountSettings-form" onSubmit={onSubmitNewMealAdminForm}>
                                        <h2 className="accountSettings__form-title">New Meal</h2>
                                        <div className="accountSettings__form-main">
                                            <div className="accountSettings__form-item">
                                                <p className="accountSettings__form-text">Name</p>
                                                <input type="text" className="signInMain__inputEmailBlock-input accountSettings__input" placeholder="Name" value={inputNameMealProduct} onChange={(e) => setInputNameMealProduct(e.target.value)} />
                                            </div>

                                            <div className="sectionCatalog__main-topSelect adminForm__select">
                                                <p className="topSelect__text adminForm__topSelect-text">Category</p>
                                                <div className="topSelect__inner">
                                                    <div className="topSelect__selectTop adminForm__topSelect-selectTop" onClick={() => setSelectBlockAdminFormActive((prev) => !prev)}>
                                                        <p className="topSelect__selectTop-text adminForm__topSelect-selectTopText">{selectBlockAdminFormValue}</p>
                                                        <img src="/images/sectionCatalog/CaretDown.png" alt="" className={selectBlockAdminFormActive ? "topSelect__selectTop-img topSelect__selectTop-imgActive" : "topSelect__selectTop-img"} />
                                                    </div>
                                                    <div className={selectBlockAdminFormActive ? "topSelect__optionsBlock topSelect__optionsBlock--active adminForm__topSelect-optionsBlockActive" : "topSelect__optionsBlock"}>
                                                        <div className="topSelect__optionsBlock-item" onClick={selectItemHandlerBurgers}>
                                                            <p className="optionsBlock__item-text">Burgers</p>
                                                        </div>
                                                        <div className="topSelect__optionsBlock-item" onClick={selectItemHandlerDrinks}>
                                                            <p className="optionsBlock__item-text">Drinks</p>
                                                        </div>
                                                        <div className="topSelect__optionsBlock-item" onClick={selectItemHandlerPizza}>
                                                            <p className="optionsBlock__item-text">Pizza</p>
                                                        </div>
                                                        <div className="topSelect__optionsBlock-item" onClick={selectItemHandlerSandwiches}>
                                                            <p className="optionsBlock__item-text">Sandwiches</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="accountSettings__form-item">
                                                <p className="accountSettings__form-text">Price</p>
                                                <div className="sectionProductItemPage__bottomBlock-inputBlock adminForm__inputBlock">
                                                    <button className="sectionProductItemPage__inputBlock-minusBtn" onClick={handlerMinusAmountBtn}>
                                                        <img src="/images/sectionProductItemPage/Minus (1).png" alt="" className="sectionProductItemPage__inputBlock-minusImg" />
                                                    </button>
                                                    <input type="number" className="sectionProductItemPage__inputBlock-input" value={inputAmountValue} onChange={changeInputAmountValue} />
                                                    <button className="sectionProductItemPage__inputBlock-plustBtn" onClick={handlerPlusAmountBtn}>
                                                        <img src="/images/sectionProductItemPage/Plus.png" alt="" className="sectionProductItemPage__inputBlock-plusImg" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="adminForm__loadImageBlock">
                                                <label htmlFor="inputFileImage" className="adminForm__loadImageBlock-label">
                                                    Load Image
                                                    {/* указываем multiple этому инпуту для файлов,чтобы можно было выбирать несколько файлов одновременно для загрузки(в данном случае убрали multiple,чтобы был только 1 файл),указываем accept = "image/*",чтобы можно было выбирать только изображения любого типа */}
                                                    <input type="file" className="adminForm__loadImageBlock-input" id="inputFileImage" accept="image/*" onChange={inputLoadImageHandler} />
                                                </label>
                                            </div>

                                            {/* если imgPath не равно пустой строке,то показываем картинку  */}
                                            {imgPath !== '' &&
                                                <div className="adminForm__imageBlock">
                                                    <img src={imgPath} alt="" className="adminForm__previewImg" ref={newProductImage} />
                                                    <p className="adminForm__imageBlock-text">{inputFile?.name}</p> {/* указываем название файла у состояния inputFile у поля name,указываем здесь ? перед name,так как иначе ошибка,что состояние inputFile может быть undefined */}
                                                </div>
                                            }

                                            {/* если errorAdminForm true(то есть в состоянии errorAdminForm что-то есть),то показываем текст ошибки */}
                                            {errorAdminForm &&
                                                <p className="formErrorText">{errorAdminForm}</p>
                                            }

                                            {/* указываем тип submit кнопке,чтобы она по клику активировала форму,то есть выполняла функцию,которая выполняется в onSubmit в форме */}
                                            <button className="accountSettings__form-btn" type="submit">Save Meal</button>

                                        </div>
                                    </form>
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