import { useLocation, useNavigate, useParams } from "react-router-dom";
import SectionProductItemTop from "../components/SectionProductItemTop";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IComment, IMeal, IMealCart } from "../types/types";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useIsOnCreen } from "../hooks/useIsOnScreen";
import SectionMenu from "../components/SectionMenu";
import { API_URL } from "../http/http";
import { useTypedSelector } from "../hooks/useTypedSelector";

const ProductItemPage = () => {

    const router = useNavigate(); // используем useNavigate чтобы перекидывать пользователя на определенную страницу

    // в данном случае скопировали эти useRef из другого компонента,а html  элементу section дали такой же id и такие же классы(кроме одного класса нового sectionProductItemPage),так как анимация появления этой секции такая же,как и в другом компоненте,работает все нормально с одинаковыми id для IntersectionObserver(так как секции в разное время срабатывают,пока пользователь доскроллит(докрутит сайт) до определенной секции,а также эти секции на разных страницах )
    const sectionImportantFoodRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnCreen(sectionImportantFoodRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen


    const [activeForm, setActiveForm] = useState(false);

    const [activeStarsForm, setActiveStarsForm] = useState(0);

    const [errorForm, setErrorForm] = useState('');

    const [textFormArea, setTextFormArea] = useState('');


    const [tab, setTab] = useState('Desc');

    const [inputAmountValue, setInputAmountValue] = useState(1);

    const { pathname } = useLocation(); // берем pathname(url страницы) из useLocation()

    const params = useParams(); // с помощью useParams получаем параметры из url (в данном случае id товара)

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния user,используя наш типизированный хук для useSelector

    const { data, refetch } = useQuery({
        queryKey: ['getMealById'],
        queryFn: async () => {

            // делаем запрос на сервер по конкретному id(в данном случае указываем params.id, то есть id,который взяли из url),который достали из url,указываем тип данных,которые вернет сервер(в данном случае наш IMeal для товара(блюда))
            const response = await axios.get<IMeal>(`http://localhost:5000/api/getMealsCatalog/${params.id}`);

            return response;
        }
    })

    const { data: dataComments, refetch: refetchComments } = useQuery({
        queryKey: ['commentsForProduct'],
        queryFn: async () => {

            // делаем запрос на сервер на получение комментариев для определенного товара,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IComment,и указываем,что это массив IComment[]),указываем query параметр productIdFor со значением id товара на этой странице
            const response = await axios.get<IComment[]>(`${API_URL}/getCommentsForProduct?productNameFor=${data?.data.name}`);

            return response;
        }
    })

    // функция для post запроса на сервер с помощью useMutation(react query),создаем комментарий на сервере,берем mutate у useMutation,чтобы потом вызвать эту функцию запроса на сервер в нужный момент
    const { mutate } = useMutation({
        mutationKey: ['create comment'],
        mutationFn: async (comment: IComment) => {

            // делаем запрос на сервер и добавляем данные на сервер,указываем тип данных,которые нужно добавить на сервер(в данном случае IComment),но здесь не обязательно указывать тип
            await axios.post<IComment>(`${API_URL}/createComment`, comment);

        },

        // при успешной мутации переобновляем массив комментариев
        onSuccess() {
            refetchComments();
        }

    })

    const { mutate: mutateRating } = useMutation({
        mutationKey: ['updateRatingProduct'],
        mutationFn: async (meal: IMeal) => {

            // делаем put запрос на сервер для обновления данных на сервере,указываем тип данных,которые нужно добавить(обновить) на сервер(в данном случае IMeal),но здесь не обязательно указывать тип
            await axios.put<IMeal>(`${API_URL}/updateProductRating`, meal);

        },

        // при успешной мутации(изменения) рейтинга,переобновляем данные товара
        onSuccess() {

            refetch();

        }

    })


    const { data: dataMealsCart, refetch: refetchMealsCart } = useQuery({
        queryKey: ['mealsCart'],
        queryFn: async () => {

            // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IMealCart,и указываем,что это массив IMealCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары(блюда) корзины для конкретного авторизованного пользователя
            const response = await axios.get<IMealCart[]>(`${API_URL}/getAllMealsCart?userId=${user.id}`);

            return response;
        }
    })

    const { mutate: mutateAddMealCart } = useMutation({
        mutationKey: ['add mealCart'],
        mutationFn: async (mealCart: IMealCart) => {

            // делаем запрос на сервер и добавляем данные на сервер,указываем тип данных,которые нужно добавить на сервер(в данном случае IMealCart),но здесь не обязательно указывать тип
            await axios.post<IMealCart>(`${API_URL}/createMealCart`, mealCart);

        },

        // при успешной мутации,то есть в данном случае при успешном добавлении товара в корзину обновляем dataMealsCart(массив объектов товаров(блюд) корзины),чтобы сразу показывалось изменение в корзине товаров,если так не сделать,то текст Already in Cart(что товар уже в корзине) будет показан только после обновления страницы,а не сразу,так как массив объектов корзины еще не переобновился
        onSuccess() {

            refetchMealsCart();

        }

    })

    const [totalPriceProduct, setTotalPriceProduct] = useState(data?.data.price);


    const isExistsCart = dataMealsCart?.data.some(m => m.name === data?.data.name); // делаем проверку методом some и результат записываем в переменную isExistsCart,если в dataMealsCart(в массиве объектов товаров(блюд) корзины для определенного авторизованного пользователя) есть элемент(объект) name которого равен data?.data name(то есть name этого товара(блюда) на этой странице),в итоге в isExistsCart будет помещено true или false в зависимости от проверки методом some

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

    // при изменении inputAmountValue и data?.data(в данном случае данные товара на этой странице,полученные с сервера,чтобы при запуске страницы сайта уже было значение в totalPriceProduct,без этого стартовое значение totalPriceProduct не становится на data?.data.price) изменяем состояние totalPriceProduct
    useEffect(() => {

        // если data?.data.price true(то есть она есть),то меняем значение totalPriceProduct,в данном случае делаем эту проверку,так как выдает ошибку,что data?.data.price может быть undefined(то есть ее может не быть)
        if (data?.data) {

            setTotalPriceProduct(data?.data.price * inputAmountValue);

        }

    }, [inputAmountValue, data?.data])


    // при изменении pathname(url страницы),делаем запрос на обновление данных о товаре(иначе не меняются данные) и изменяем таб на desc(описание товара),если вдруг был включен другой таб,то при изменении url страницы будет включен опять дефолтный таб,также изменяем значение количества товара,если было выбрано уже какое-то,чтобы поставить первоначальное, и убираем форму добавления комментария,если она была открыта,и изменяем значение состоянию activeStarsForm на 0,то есть убираем звезды в форме для коментария,если они были выбраны
    useEffect(() => {

        setActiveStarsForm(0);

        setActiveForm(false);

        setTab('Desc');

        setInputAmountValue(1);

        refetch();

    }, [pathname])

    // при изменении массива комментариев и данных товара(data?.data) на этой странице,переобновляем массив комментариев для этого товара
    useEffect(() => {

        refetchComments();

    }, [data?.data, dataComments?.data])


    // при запуске этого компонента(при загрузке этой страницы),а также при изменении массива комментариев,будем обновлять рейтинг товара(блюда в данном случае)
    useEffect(() => {

        const commentsRating = dataComments?.data.reduce((prev, curr) => prev + curr.rating, 0); // проходимся по массиву объектов комментариев для товара на этой странице и на каждой итерации увеличиваем переменную prev(это число,и мы указали,что в начале оно равно 0 и оно будет увеличиваться на каждой итерации массива объектов,запоминая старое состояние числа и увеличивая его на новое значение) на curr(текущий итерируемый объект).rating ,это чтобы посчитать общую сумму всего рейтинга от каждого комментария и потом вывести среднее значение

        // если commentsRating true(эта переменная есть и равна чему-то) и dataComments?.data.length true(этот массив отфильтрованных комментариев для товара на этой странице есть),то считаем средний рейтинг всех комментариев и записываем его в переменную,а потом делаем запрос на сервер для обновления рейтинга у объекта товара в базе данных
        if (commentsRating && dataComments?.data.length) {

            const commentsRatingMiddle = commentsRating / dataComments?.data.length; // считаем средний рейтинг всех комментариев,делим commentsRating(общая сумма рейтинга от каждого комментария) на dataComments?.data.length(длину массива комментариев)

            mutateRating({ ...data?.data, rating: commentsRatingMiddle } as IMeal); // делаем запрос на изменение рейтинга у товара(в данном случае блюда),разворачиваем все поля товара текущей страницы(data?.data) и поле rating изменяем на commentsRatingMiddle,указываем тип этому объекту как тип на основе нашего интерфейса IMeal(в данном случае делаем это,так как выдает ошибку,что id может быть undefined)

        }

    }, [dataComments?.data])


    const addCommentsBtn = () => {

        // если имя пользователя равно true,то есть оно есть и пользователь авторизован,то показываем форму,в другом случае перекидываем пользователя на страницу авторизации 
        if (user.userName) {

            setActiveForm(true); // изменяем состояние активной формы,то есть показываем форму для создания комментария

        } else {
            router('/userPage');  // перекидываем пользователя на страницу авторизации (/userPage в данном случае)
        }

    }

    const submitFormHandler = () => {

        // если значение textarea (.trim()-убирает из строки пробелы,чтобы нельзя было ввести только пробел) в форме комментария будет по количеству символов меньше или равно 10,то будем изменять состояние ErrorCommentsForm(то есть показывать ошибку и не отправлять комментарий),в другом случае очищаем поля textarea,activeStars(рейтинг,который пользователь указал в форме) и убираем форму
        if (textFormArea.trim().length <= 10) {

            setErrorForm('Comment must be more than 10 characters');

        } else if (activeStarsForm === 0) {
            // если состояние рейтинга в форме равно 0,то есть пользователь не указал рейтинг,то показываем ошибку
            setErrorForm('Enter rating');
        } else {

            const date = new Date(); // создаем объект на основе класса Date(класс в javaScript для работы с датой и временем)

            // помещаем в переменную showTime значение времени,когда создаем комментарий, date.getDate() - показывает текущее число календаря, getMonth() - считает месяцы с нуля(январь нулевой,февраль первый и тд),поэтому указываем date.getMonth() + 1(увеличиваем на 1 и получаем текущий месяц) и потом приводим получившееся значение к формату строки с помощью toString(), getFullYear() - показывает текущий год,потом эту переменную showTime будем сохранять в объект для создания комментария на сервере и потом показывать дату создания комментария уже на клиенте(в данном случае на этой странице у комментария) 
            const showTime = date.getDate() + '.' + (date.getMonth() + 1).toString() + '.' + date.getFullYear();

            // если data?.data true,то есть данные блюда(товара) есть,в данном случае делаем эту проверку,так как выдает ошибку,что data?.data._id может быть undefined
            if (data?.data) {

                mutate({ name: user.userName, text: textFormArea, rating: activeStarsForm, productNameFor: data?.data.name, createdTime: showTime } as IComment);  // вызываем функцию post запроса на сервер,создавая комментарий,разворачивая в объект нужные поля для комментария и давая этому объекту тип as IComment(вручную не указываем id,чтобы он автоматически создавался на сервере), указываем поле productIdFor со значением как у id товара на этой странице,чтобы в базе данных связать этот товар с комментарием

            }


            setTextFormArea('');
            setActiveStarsForm(0);
            setActiveForm(false);
            setErrorForm('');
        }


    }

    const addMealToCartBtn = () => {

        console.log(user.userName);

        // если имя пользователя равно true,то есть оно есть и пользователь авторизован,то помещаем товар в корзину,в другом случае перекидываем пользователя на страницу авторизации
        if (user.userName) {

            if (data?.data) {

                mutateAddMealCart({ name: data?.data.name, category: data?.data.category, amount: inputAmountValue, image: data?.data.image, price: data?.data.price, priceFilter: data?.data.priceFilter, rating: data?.data.rating, totalPrice: totalPriceProduct, usualProductId: data?.data._id, forUser: user.id } as IMealCart); // передаем в mutateAddMealCart объект типа IMealCart только таким образом,разворачивая в объект все необходимые поля(то есть наш product(объект блюда в данном случае),в котором полe name,делаем поле name со значением,как и у этого товара(блюда) name(data?.data.name) и остальные поля также,кроме поля amount и totalPrice,их мы изменяем и указываем как значения inputAmountValue(инпут с количеством) и totalPriceProduct(состояние цены,которое изменяется при изменении inputAmountValue)),указываем тип этого объекта как созданный нами тип as IMealCart(в данном случае делаем так,потому что показывает ошибку,что totalPriceProduct может быть undefined),при создании на сервере не указываем конкретное значение id,чтобы он сам автоматически генерировался на сервере и потом можно было удалить этот объект, добавляем поле forUser со значением user.id(то есть со значением id пользователя,чтобы потом показывать товары в корзине для каждого конкретного пользователя,у которого id будет равен полю forUser у этого товара),указываем usualProductId со значением data?.data.id,чтобы потом в корзине можно было перейти на страницу товара в магазине по этому usualProductId,а сам id корзины товара не указываем,чтобы он автоматически правильно генерировался,так как делаем показ товаров по-разному для конкретных пользователей(то есть как и должно быть),иначе ошибка

            }


        } else {

            router('/userPage'); // перекидываем пользователя на страницу авторизации (/userPage в данном случае)

        }

    }

    return (
        <main className="main">
            <SectionProductItemTop meal={data?.data} />
            <section id="sectionImportantFood" className={onScreen.sectionImportantFoodIntersecting ? "sectionImportantFood sectionImportantFood__active sectionProductItemPage" : "sectionImportantFood sectionProductItemPage"} ref={sectionImportantFoodRef}>
                <div className="container">
                    <div className="sectionProductItemPage__inner">
                        <div className="sectionProductItemPage__top">
                            <div className="sectionProductItemPage__top-leftBlock">
                                <img src={`/images/sectionMenu/${data?.data.image}`} alt="" className="sectionProductItemPage__leftBlock-img" />
                            </div>
                            <div className="sectionProductItemPage__top-rightBlock">
                                <h2 className="sectionProductItemPage__rightBlock-title">{data?.data.name}</h2>
                                <p className="sectionProductItemPage__rightBlock__text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat fringilla bibendum. Urna, urna, vitae feugiat pretium donec id elementum. Ultrices mattis sed vitae mus risus. Lacus nisi, et ac dapibus sit eu velit in consequat.</p>
                                <p className="sectionProductItemPage__rightBlock-price">{totalPriceProduct}$</p>
                                <div className="sectionProductItemPage__rightBlock__stars">

                                    {/* если data?.data true,то есть данные о товаре на текущей странице есть(делаем эту проверку,потому что без нее ошибка,типа data?.data может быть undefined),и в src у элементов img(картинок) указываем условие,какую звезду рейтинга отображать в зависимости от значения рейтинга товара */}
                                    {data?.data &&
                                        <>
                                            <img src={data?.data.rating === 0 ? "/images/sectionCatalog/StarGrey.png" : "/images/sectionCatalog/StarYellow.png"} alt="" className="sectionProductItemPage__stars-img" />
                                            <img src={data?.data.rating >= 2 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="sectionProductItemPage__stars-img" />
                                            <img src={data?.data.rating >= 3 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="sectionProductItemPage__stars-img" />
                                            <img src={data?.data.rating >= 4 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="sectionProductItemPage__stars-img" />
                                            <img src={data?.data.rating >= 5 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="sectionProductItemPage__stars-GreyImg" />
                                        </>
                                    }

                                </div>
                                <div className="sectionProductItemPage__rightBlock-bottomBlock">

                                    {/* если isExistsBasket true(то есть этот товар(блюдо) на этой странице уже находится в корзине) и если user.userName true(то есть пользователь авторизован,если не сделать эту проверку на авторизован ли пользователь,то после выхода из аккаунта и возвращении на страницу корзины товары будут показываться до тех пор,пока не обновится страница,поэтому делаем эту проверку),то показываем текст,в другом случае показываем кнопку добавления товара в корзину и инпут с количеством этого товара */}
                                    {user.userName && isExistsCart ?
                                        <h3 className="textAlreadyInCart">Already in Cart</h3>
                                        :
                                        <>
                                            <div className="sectionProductItemPage__bottomBlock-inputBlock">
                                                <button className="sectionProductItemPage__inputBlock-minusBtn" onClick={handlerMinusAmountBtn}>
                                                    <img src="/images/sectionProductItemPage/Minus (1).png" alt="" className="sectionProductItemPage__inputBlock-minusImg" />
                                                </button>
                                                <input type="number" className="sectionProductItemPage__inputBlock-input" value={inputAmountValue} onChange={changeInputAmountValue} />
                                                <button className="sectionProductItemPage__inputBlock-plustBtn" onClick={handlerPlusAmountBtn}>
                                                    <img src="/images/sectionProductItemPage/Plus.png" alt="" className="sectionProductItemPage__inputBlock-plusImg" />
                                                </button>
                                            </div>
                                            <button className="sectionProductItemPage__bottomBlock-btn" onClick={addMealToCartBtn}>
                                                <img src="/images/sectionProductItemPage/Bag.png" alt="" className="sectionProductItemPage__btn-img" />
                                                <p className="sectionProductItemPage__btn-text">Add to cart</p>
                                            </button>
                                        </>
                                    }

                                </div>
                            </div>
                        </div>

                        <div className="sectionProductItemPage__descBlock">
                            <div className="descBlock__tabs">
                                <button className={tab === 'Desc' ? "descBlock__tabs-btn descBlock__tabs-btn--active" : "descBlock__tabs-btn"} onClick={() => setTab('Desc')}>Description</button>
                                <button className={tab === 'Reviews' ? "descBlock__tabs-btn descBlock__tabs-btn--active" : "descBlock__tabs-btn"} onClick={() => setTab('Reviews')}>Reviews ({dataComments?.data.length})</button>
                            </div>
                            <div className="descBlock__desc">

                                {tab === 'Desc' &&
                                    <div className="descBlock__descInner">
                                        <p className="descBlock__desc-text">Nam tristique porta ligula, vel viverra sem eleifend nec. Nulla sed purus augue, eu euismod tellus. Nam mattis eros nec mi sagittis sagittis. Vestibulum suscipit cursus bibendum. Integer at justo eget sem auctor auctor eget vitae arcu. Nam tempor malesuada porttitor. Nulla quis dignissim ipsum. Aliquam pulvinar iaculis justo, sit amet interdum sem hendrerit vitae. Vivamus vel erat tortor. Nulla facilisi. In nulla quam, lacinia eu aliquam ac, aliquam in nisl.</p>
                                        <p className="descBlock__desc-text">Suspendisse cursus sodales placerat. Morbi eu lacinia ex. Curabitur blandit justo urna, id porttitor est dignissim nec. Pellentesque scelerisque hendrerit posuere. Sed at dolor quis nisi rutrum accumsan et sagittis massa. Aliquam aliquam accumsan lectus quis auctor. Curabitur rutrum massa at volutpat placerat. Duis sagittis vehicula fermentum. Integer eu vulputate justo. Aenean pretium odio vel tempor sodales. Suspendisse eu fringilla leo, non aliquet sem.</p>
                                        <div className="descBlock__desc-benefitsBlock">
                                            <p className="benefitsBlock__title">Key Benefits</p>
                                            <ul className="benefitsBlock__list">
                                                <li className="benefitsBlock__list-item">
                                                    <img src="/images/sectionAboutCreate/Check (1).png" alt="" className="benefitsBlock__item-img" />
                                                    <p className="benefitsBlock__item-text">Sit amet, consectetur adipiscing elit.
                                                    </p>
                                                </li>
                                                <li className="benefitsBlock__list-item">
                                                    <img src="/images/sectionAboutCreate/Check (1).png" alt="" className="benefitsBlock__item-img" />
                                                    <p className="benefitsBlock__item-text">Maecenas ullamcorper est et massa mattis condimentum.
                                                    </p>
                                                </li>
                                                <li className="benefitsBlock__list-item">
                                                    <img src="/images/sectionAboutCreate/Check (1).png" alt="" className="benefitsBlock__item-img" />
                                                    <p className="benefitsBlock__item-text">Vestibulum sed massa vel ipsum imperdiet malesuada id tempus nisl.
                                                    </p>
                                                </li>
                                                <li className="benefitsBlock__list-item">
                                                    <img src="/images/sectionAboutCreate/Check (1).png" alt="" className="benefitsBlock__item-img" />
                                                    <p className="benefitsBlock__item-text">Etiam nec massa et lectus faucibus ornare congue in nunc.
                                                    </p>
                                                </li>
                                                <li className="benefitsBlock__list-item">
                                                    <img src="/images/sectionAboutCreate/Check (1).png" alt="" className="benefitsBlock__item-img" />
                                                    <p className="benefitsBlock__item-text">Mauris eget diam magna, in blandit turpis.
                                                    </p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                }

                                {tab === 'Reviews' &&

                                    <div className="descBlock__reviews">
                                        <div className="descBlock__reviews-leftBlock">

                                            {/* если dataComments?.data.length true(то есть длина массива комментариев true,то есть комментарии есть),то показываем комментарии,в другом случае показываем текст,что комментариев нет */}
                                            {dataComments?.data.length ? dataComments?.data.map(comment =>

                                                <div className="reviews__leftBlock-item" key={comment._id}>
                                                    <div className="reviews__item-topBlock">
                                                        <div className="reviews__item-topBlock--leftInfo">
                                                            <img src="/images/sectionProductItemPage/Profile.png" alt="" className="reviews__item-img" />
                                                            <div className="reviews__item-topBlock--info">
                                                                <p className="reviews__item-name">{comment.name}</p>
                                                                <div className="sectionProductItemPage__rightBlock__stars">
                                                                    <img src={comment.rating === 0 ? "/images/sectionCatalog/StarGrey.png" : "/images/sectionCatalog/StarYellow.png"} alt="" className="sectionProductItemPage__stars-img reviews__item-star" />
                                                                    <img src={comment.rating >= 2 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="sectionProductItemPage__stars-img reviews__item-star" />
                                                                    <img src={comment.rating >= 3 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="sectionProductItemPage__stars-img reviews__item-star" />
                                                                    <img src={comment.rating >= 4 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="sectionProductItemPage__stars-img reviews__item-star" />
                                                                    <img src={comment.rating >= 5 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="sectionProductItemPage__stars-GreyImg reviews__item-star" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="reviews__item-createdTimeText">{comment.createdTime}</p>
                                                    </div>
                                                    <p className="reviews__item-text">{comment.text}</p>
                                                </div>
                                            ) :
                                                <div className="reviews__leftBlock-top">
                                                    <h4 className="reviews__top-text">No reviews yet.</h4>
                                                </div>

                                            }

                                        </div>
                                        <div className="descBlock__reviews-rightBlock">

                                            <div className={activeForm ? "reviews__rightBlock-btnBlock reviews__btnBlock-none" : "reviews__rightBlock-btnBlock"}>
                                                <button className="reviews__btnBlock-btn" onClick={addCommentsBtn}>Add Review</button>
                                            </div>

                                            <div className={activeForm ? "reviews__rightBlock-form reviews__rightBlock-form--active" : "reviews__rightBlock-form"}>
                                                <div className="reviews__form-topBlock">
                                                    <div className="form__topBlock-userBlock">
                                                        <img src="/images/sectionProductItemPage/Profile.png" alt="" className="form__userBlock-img" />
                                                        <p className="reviews__item-name reviews__form-name">{user.userName}</p>
                                                    </div>
                                                    <div className="form__topBlock-starsBlock">
                                                        {/* если activeStarsForm равно 0,то показываем серую картинку звездочки,в другом случае оранжевую,также по клику на эту картинку изменяем состояние activeStarsForm на 1,то есть на 1 звезду */}
                                                        <img src={activeStarsForm === 0 ? "/images/sectionCatalog/StarGrey.png" : "/images/sectionCatalog/StarYellow.png"} alt="" className="sectionProductItemPage__stars-img reviews__form-star" onClick={() => setActiveStarsForm(1)} />

                                                        {/* если activeStarsForm больше или равно 2,то показывать оранжевую звезду,в другом случае серую */}
                                                        <img src={activeStarsForm >= 2 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="sectionProductItemPage__stars-img reviews__form-star" onClick={() => setActiveStarsForm(2)} />
                                                        <img src={activeStarsForm >= 3 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="sectionProductItemPage__stars-img reviews__form-star" onClick={() => setActiveStarsForm(3)} />
                                                        <img src={activeStarsForm >= 4 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="sectionProductItemPage__stars-img reviews__form-star" onClick={() => setActiveStarsForm(4)} />
                                                        <img src={activeStarsForm >= 5 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="sectionProductItemPage__stars-GreyImg reviews__form-star" onClick={() => setActiveStarsForm(5)} />
                                                    </div>
                                                </div>

                                                <div className="reviews__form-mainBlock">
                                                    <textarea className="form__mainBlock-textarea" placeholder="Enter your comment" value={textFormArea} onChange={(e) => setTextFormArea(e.target.value)}></textarea>

                                                    {/* если errorForm не равно пустой строке,то есть есть ошибка формы,то показываем ее */}
                                                    {errorForm !== '' && <p className="formErrorText">{errorForm}</p>}


                                                    <button className="reviews__form-btn" onClick={submitFormHandler}>Save Review</button>
                                                </div>

                                            </div>

                                        </div>
                                    </div>


                                }

                            </div>

                            <SectionMenu />

                        </div>
                    </div>
                </div>
            </section>
        </main>
    )

}

export default ProductItemPage;