import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import SectionCatalogTop from "../components/SectionCatalogTop";
import { useIsOnCreen } from "../hooks/useIsOnScreen";
import ProductsItem from "../components/ProductsItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IMeal, IResponseCatalog } from "../types/types";
import { getPagesArray } from "../utils/getPagesArray";

const Catalog = () => {

    const [numberMass, setNumberMass] = useState<number[]>([]); // состояние для массива чисел цен всех товаров,чтобы потом посчитать максимальное значение

    const [maxPriceMeal, setMaxPriceMeal] = useState(0); // состояние для максимального значения цены блюда из всех

    const [onChangingInputLeftRange, setOnChangingInputLeftRange] = useState(false); // состояние для отслеживания изменения значения левого инпута с типом range у ползунка для фильтра цены,будем его изменять, когда будет меняться значение у левого инпута с типом range у ползунка для фильтра цены

    const [onChangingInputRightRange, setOnChangingInputRightRange] = useState(false); // состояние для отслеживания изменения значения правого инпута с типом range у ползунка для фильтра цены,будем его изменять, когда будет меняться значение у правого инпута с типом range у ползунка для фильтра цены



    const [inputRightRangeValue, setInputRightRangeValue] = useState(0); // состояние для значения правого инпута с типом range,указываем начальное значение 124 в данном случае,чтобы изначально была заполнена вся полоска до ползунка у инпута с типом range

    const [inputRightRangeTrackWidth, setInputRightRangeTrackWidth] = useState(0); // состояние для ширины полоски до ползунка у инпута с типом range,указываем начальное значение 124 в данном случае,чтобы изначально была заполнена вся полоска до ползунка у инпута с типом range

    const inputRightRangeRef = useRef<HTMLDivElement>(null); // переменная для ссылки на html элемент полоски до ползунка у инпута с типом range

    const [inputRightRangePrice, setInputRightRangePrice] = useState(maxPriceMeal); // состояние для значение цены,которое будет у правого инпута с типом range,будем его показывать как цену,а записывать в него будем значение с немного увеличенным значением как у самого инпута с типом range,чтобы это подходило под нашу цену(так как значение у самого инпута с типом range будет изменяться на минимальное расстояние как 1,а нам нужно,чтобы было меньше,чем 1 минимальное расстояние),ставим изначальное значение maxPriceMeal(максимальная цена блюда из всех),чтобы сразу показывалось,что это максимальное значение цены


    const [inputLeftRangeValue, setInputLeftRangeValue] = useState(0); // состояние для значения левого инпута с типом range,указываем начальное значение 124 в данном случае,чтобы изначально была заполнена вся полоска до ползунка у инпута с типом range

    const inputLeftRangeRef = useRef<HTMLDivElement>(null); // переменная для ссылки на html элемент полоски до ползунка у левого инпута с типом range

    const [inputLeftRangeTrackWidth, setInputLeftRangeTrackWidth] = useState(0); // состояние для ширины полоски до ползунка у левого инпута с типом range,указываем начальное значение 124 в данном случае,чтобы изначально была заполнена вся полоска до ползунка у инпута с типом range

    const [inputLeftRangePrice, setInputLeftRangePrice] = useState(0);  // состояние для значение цены,которое будет у левого инпута с типом range,будем его показывать как цену,а записывать в него будем значение с немного увеличенным значением как у самого инпута с типом range,чтобы это подходило под нашу цену(так как значение у самого инпута с типом range будет изменяться на минимальное расстояние как 1,а нам нужно,чтобы минимальное расстояние было больше чем 1)


    const [inputSearchValue, setInputSearchValue] = useState('');

    const [selectBlockActive, setSelectBlockActive] = useState(false);

    const [selectBlockValue, setSelectBlockValue] = useState('');

    const [filterCategories, setFilterCategories] = useState('');


    const [page, setPage] = useState(1); // указываем состояние текущей страницы

    const [totalPages, setTotalPages] = useState(0); // указываем состояние totalPages в данном случае для общего количества страниц

    const [limit, setLimit] = useState(1); // указываем лимит для максимального количества объектов,которые будут на одной странице(для пагинации)


    // в данном случае скопировали эти useRef из другого компонента,а html  элементу section дали такой же id и такие же классы(кроме одного класса нового sectionAboutCreate),так как анимация появления этой секции такая же,как и в другом компоненте,работает все нормально с одинаковыми id для IntersectionObserver(так как секции в разное время срабатывают,пока пользователь доскроллит(докрутит сайт) до определенной секции )
    const sectionImportantFoodRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnCreen(sectionImportantFoodRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen


    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер,берем isFetching у useQuery,чтобы отслеживать,загружается ли сейчас запрос на сервер,разница isFetching и isLoading в том,что isFetching всегда будет проверять загрузку запроса на сервер при каждом запросе,а isLoading будет проверять только первый запрос на сервер,в данном случае нужен isFetching,так как идут повторные запросы на сервер
    const { data, refetch, isFetching } = useQuery({
        queryKey: ['getMealsCatalog'],
        queryFn: async () => {

            // выносим url на получение товаров в отдельную переменную,чтобы ее потом изменять
            let url = `http://localhost:5000/api/getMealsCatalog?name=${inputSearchValue}`;

            // если filterCategories не равно пустой строке(то есть пользователь выбрал категорию),то добавляем к url для получения товаров еще query параметр category и значением как filterCategories, указываем знак амперсанта & для перечисления query параметров в url
            if (filterCategories !== '') {

                url += `&category=${filterCategories}`;

            }

            // если состояние цены левого инпута с типом range у ползунка для фильтра цены больше 0,то добавляем этот query параметр к url со значением этого состояния левого инпута цены 
            if (inputLeftRangePrice > 0) {

                url += `&inputLeftRangePrice=${inputLeftRangePrice}`;

            }

            // если состояние цены правого инпута с типом range у ползунка для фильтра цены меньше maxPriceMeal(максимальная цена блюда из всех),то добавляем этот query параметр к url со значением этого состояния правого инпута цены 
            if (inputRightRangePrice < maxPriceMeal) {

                url += `&inputRightRangePrice=${inputRightRangePrice}`;

            }


            // указываем тип данных,который придет от сервера как тип на основе нашего интерфейса IResponseCatalog,у этого объекта будут поля meals(объекты блюд из базы данных для отдельной страници пагинации) и allMeals(все объекты блюд из базы данных без лимитов и состояния текущей страницы,то есть без пагинации,чтобы взять потом количество этих всех объектов блюд и использовать для пагинации),вместо url будет подставлено значение,которое есть у нашей переменной url
            const response = await axios.get<IResponseCatalog>(url, {
                params: {
                    limit: limit, // указываем параметр limit для максимального количества объектов,которые будут на одной странице(для пагинации),можно было указать эти параметры limit и page просто через знак вопроса в url,но можно и тут в отдельном объекте params

                    page: page // указываем параметр page(параметр текущей страницы,для пагинации)
                }
            }); // делаем запрос на сервер для получения всех блюд,указываем в типе в generic наш тип на основе интерфейса IMeal,указываем,что это массив(то есть указываем тип данных,которые придут от сервера)



            console.log(response);


            const totalCount = response?.data.allMeals.length; // записываем общее количество объктов товаров блюд с помощью .length,которые пришли от сервера в переменную totalCount(берем это у поля length у поля allMeals(массив всех объектов блюд без лимитов и состояния текущей страницы,то есть без пагинации) у поля data у response(общий объект ответа от сервера))

            // если totalCount true,то есть в totalCount есть какое-то значение,то изменяем общее количество страниц,делаем эту проверку, потому что totalCount может быть undefined(выдает ошибку такую)
            if (totalCount) {
                setTotalPages(Math.ceil(totalCount / limit)); // изменяем состояние totalPages на значение деления totalCount на limit,используем Math.ceil() - она округляет получившееся значение в большую сторону к целому числу(например,5.3 округлит к 6),чтобы правильно посчитать общее количество страниц
            }

            console.log(totalPages)

            return response.data; // возвращаем response.data,то есть объект data,который получили от сервера,в котором есть поля meals и allMeals
        }
    })


    const filteredCategoryBurgers = data?.allMeals.filter(m => m.category === 'Burgers'); // помещаем в переменную filteredCategoryBurgers массив allMeals(массив всех блюд без пагинации,который пришел от сервера),отфильтрованный с помощью filter(),фильтруем его по полю category со значением,в данном случае 'Burgers',то есть получаем массив блюд с категорией Burgers,чтобы отобразить количество блюд в этой категории

    const filteredCategoryDrinks = data?.allMeals.filter(m => m.category === 'Drinks');

    const filteredCategoryPizza = data?.allMeals.filter(m => m.category === 'Pizza');

    const filteredCategorySandwiches = data?.allMeals.filter(m => m.category === 'Sandwiches');


    const OnChangeRangeLeft = (e: ChangeEvent<HTMLInputElement>) => {

        // если текущее значение ипнута с типом range больше,чем состояние для этого инпута с типом range(inputRightRangeValue),то есть больше,чем предыдущее состояние этого инпута(так как в inputRightRangeValue еще не записали значение e.target.value,поэтому inputRightRangeValue еще предыдущее),то изменяем размер(ширину) полоски до ползунка(кружочка у инпута с типом range),указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных
        if (+e.target.value > inputLeftRangeValue) {


            const widthOffset = +e.target.value - inputLeftRangeValue; // считаем,на какое расстояние увеличить ширину полоски до ползунка у инпута с типом range,текущее значение инпута с типом range(e.target.value) - состояние для этого инпута с типом range(то есть предыдущее значение состояния для этого инпута с типом range (inputRightRangeValue))

            console.log(inputLeftRangeRef.current?.offsetWidth);

            // если inputRightRangeRef.current true,то есть ссылка на всю полоску до ползунка у инпута с типом range true(то есть этот элемент есть),делаем эту проверку,иначе выдает ошибку,что inputRightRangeRef может быть undefined
            if (inputLeftRangeRef.current) {
                // изменяем состояние InputRangeTrackWidth(состояние ширины полоски до ползунка у инпута с типом range) на значение inputRightRangeRef.current?.offsetWidth(ширину полоски до ползунка у инпута с типом range) + widthOffset(разницу,на которую увеличилось значение в инпуте с типом range,то есть на сколько пользователь потянул ползунок)
                setInputLeftRangeTrackWidth(inputLeftRangeRef.current?.offsetWidth + widthOffset);

            }

            // e.target.style.width = `${inputRightRangeRef.current && inputRightRangeRef.current?.offsetWidth + widthOffset}px`;


            setInputLeftRangeValue(+e.target.value); // изменяем состояние inputRightRangeValue(значение состояния инпута с типом range) на e.target.value, указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных

        }


        // если текущее значение ипнута с типом range меньше,чем состояние для этого инпута с типом range(inputRightRangeValue),то есть меньше,чем предыдущее состояние этого инпута(так как в inputRightRangeValue еще не записали значение e.target.value, то изменяем размер(ширину) полоски до ползунка(кружочка у инпута с типом range),указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных
        if (+e.target.value < inputLeftRangeValue) {


            const widthOffset = inputLeftRangeValue - +e.target.value; // считаем,на какое расстояние уменьшить ширину полоски до ползунка у инпута с типом range,состояние для этого инпута с типом range(то есть предыдущее значение состояния для этого инпута с типом range (inputRightRangeValue)) - текущее значение инпута с типом range (e.target.value)


            // если inputRightRangeRef.current true,то есть ссылка на всю полоску до ползунка у инпута с типом range true(то есть этот элемент есть),делаем эту проверку,иначе выдает ошибку,что inputRightRangeRef может быть undefined
            if (inputLeftRangeRef.current) {
                // изменяем состояние InputRangeTrackWidth(состояние ширины полоски до ползунка у инпута с типом range) на значение inputRightRangeRef.current?.offsetWidth(ширину полоски до ползунка у инпута с типом range) - widthOffset(разницу,на которую увеличилось значение в инпуте с типом range,то есть на сколько пользователь потянул ползунок)
                setInputLeftRangeTrackWidth(inputLeftRangeRef.current?.offsetWidth - widthOffset);
            }

            // e.target.style.width = `${inputRightRangeRef.current && inputRightRangeRef.current?.offsetWidth - widthOffset}px`;


            setInputLeftRangeValue(+e.target.value); // изменяем состояние inputRightRangeValue(значение состояния инпута с типом range) на e.target.value, указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных
        }



        setInputLeftRangePrice(+e.target.value / (124 / maxPriceMeal) / 2); // указываем значение состоянию цены для левого инпута с типом range(inputLeftRangePrice) как текущее значение этого инпута с типом range(e.target.value),деленное на (124 (максимальная ширина полоски до ползунка этого левого инпута с типом range) / (делить на) maxPriceMeal(максимальная цена блюда из всех), в данном случае число получилось примерно 4.42, то есть во сколько раз максимальная ширина инпута больше максимальной цены блюда ), делаем так,потому что максимальная ширина этого инпута 124 и минимальное изменение в значении этого левого инпута с типом range при смещении кружочка ползунка по дефолту равно 1(типа 1 пикселю),поэтому делим это на 4.42 (результат деления того,что в скобках),чтобы уменьшить минимальное изменение значения при смещении ползунка этого инпута в 4.42 раза(в данном случае), так,чтобы в итоге максимальным было 14, то есть в данном случае минимальное изменение значения при смещении ползунка у этого инпута было бы примерно 0.5 или меньше, вместо 1 по дефолту,также делим получившееся значение на 2,чтобы получить максимальную цену этого левого инпута,которую нам надо,так как если не делить это на 2,то получается максимальная цена этого левого инпута в 2 раза больше,чем нам надо 



        setOnChangingInputLeftRange(true); // изменяем значение состояния onChangingInputLeftRange на true,то есть отслеживаем,изменяет ли сейчас пользователь значение левого инпута с типом range у ползунка для фильтра цены


        console.log(inputLeftRangePrice);


    }


    const OnChangeRangeRight = (e: ChangeEvent<HTMLInputElement>) => {

        // если текущее значение ипнута с типом range больше,чем состояние для этого инпута с типом range(inputRightRangeValue),то есть больше,чем предыдущее состояние этого инпута(так как в inputRightRangeValue еще не записали значение e.target.value,поэтому inputRightRangeValue еще предыдущее),то изменяем размер(ширину) полоски до ползунка(кружочка у инпута с типом range),указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных
        if (+e.target.value > inputRightRangeValue) {


            const widthOffset = +e.target.value - inputRightRangeValue; // считаем,на какое расстояние увеличить ширину полоски до ползунка у инпута с типом range,текущее значение инпута с типом range(e.target.value) - состояние для этого инпута с типом range(то есть предыдущее значение состояния для этого инпута с типом range (inputRightRangeValue))

            console.log(inputRightRangeRef.current?.offsetWidth);

            // если inputRightRangeRef.current true,то есть ссылка на всю полоску до ползунка у инпута с типом range true(то есть этот элемент есть),делаем эту проверку,иначе выдает ошибку,что inputRightRangeRef может быть undefined
            if (inputRightRangeRef.current) {
                // изменяем состояние InputRangeTrackWidth(состояние ширины полоски до ползунка у инпута с типом range) на значение inputRightRangeRef.current?.offsetWidth(ширину полоски до ползунка у инпута с типом range) + widthOffset(разницу,на которую увеличилось значение в инпуте с типом range,то есть на сколько пользователь потянул ползунок)
                setInputRightRangeTrackWidth(inputRightRangeRef.current?.offsetWidth + widthOffset);

            }

            // e.target.style.width = `${inputRightRangeRef.current && inputRightRangeRef.current?.offsetWidth + widthOffset}px`;


            setInputRightRangeValue(+e.target.value); // изменяем состояние inputRightRangeValue(значение состояния инпута с типом range) на e.target.value, указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных

        }


        // если текущее значение ипнута с типом range меньше,чем состояние для этого инпута с типом range(inputRightRangeValue),то есть меньше,чем предыдущее состояние этого инпута(так как в inputRightRangeValue еще не записали значение e.target.value, то изменяем размер(ширину) полоски до ползунка(кружочка у инпута с типом range),указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных
        if (+e.target.value < inputRightRangeValue) {


            const widthOffset = inputRightRangeValue - +e.target.value; // считаем,на какое расстояние уменьшить ширину полоски до ползунка у инпута с типом range,состояние для этого инпута с типом range(то есть предыдущее значение состояния для этого инпута с типом range (inputRightRangeValue)) - текущее значение инпута с типом range (e.target.value)


            // если inputRightRangeRef.current true,то есть ссылка на всю полоску до ползунка у инпута с типом range true(то есть этот элемент есть),делаем эту проверку,иначе выдает ошибку,что inputRightRangeRef может быть undefined
            if (inputRightRangeRef.current) {
                // изменяем состояние InputRangeTrackWidth(состояние ширины полоски до ползунка у инпута с типом range) на значение inputRightRangeRef.current?.offsetWidth(ширину полоски до ползунка у инпута с типом range) - widthOffset(разницу,на которую увеличилось значение в инпуте с типом range,то есть на сколько пользователь потянул ползунок)
                setInputRightRangeTrackWidth(inputRightRangeRef.current?.offsetWidth - widthOffset);
            }

            // e.target.style.width = `${inputRightRangeRef.current && inputRightRangeRef.current?.offsetWidth - widthOffset}px`;


            setInputRightRangeValue(+e.target.value); // изменяем состояние inputRightRangeValue(значение состояния инпута с типом range) на e.target.value, указываем + перед e.target.value,чтобы перевести значение этого инпута с типом range из строки(оно по дефолту идет строкой) в числовой тип данных
        }



        // использовали это,когда не считали максимальную цену блюда из всех,но делаем сейчас уже с подсчетом максимальной цены блюда из всех (чуть ниже в коде),чтобы правильно считалась максимальная цена фильтра,когда потом админ будет добавлять новые товары(блюда),так как новый товар(блюдо) может быть по цене больше,чем если мы просто укажем какое-то статичное число для максимальной цены фильтра товаров

        // setInputRightRangePrice((248 - +e.target.value) * 0.404); // указываем значение состоянию цены для левого инпута с типом range(inputLeftRangePrice) как 248(максимальное значение цены,которое должно быть в тексте на сайте, (в данном случае оно просто в два раза больше ширины инпута с типом range) ) - текущее значение этого инпута с типом range(e.target.value),чтобы от 248(в данном случае оно просто в два раза больше ширины инпута с типом range) отнималось текущее значение инпута с типом range при изменении текущего значения инпута с типом range,чтобы правильно показывалась цена, также умножаем получившееся значение на 0.404,чтобы получить у этого правого инпута с типом range максимальное значение цены 50,делаем так,потому что ширина этого инпута 124 и минимальное изменение при смещении кружочка ползунка равно 1(типа 1 пикселю и в итоге получилось бы максимальное значение у инпута 124,а нам нужно 50),поэтому умножаем на 0.404(в данном случае просто подобрали примерно это число),чтобы уменьшить минимальное смещение этого инпута так,чтобы в итоге максимальным было 100, то есть в данном случае минимальное смещение у этого инпута было бы примерно 0.5 вместо 1

        //  делаем сейчас уже с подсчетом максимальной цены блюда из всех,чтобы правильно считалась максимальная цена фильтра,когда потом админ будет добавлять новые товары(блюда),так как новый товар(блюдо) может быть по цене больше,чем если мы просто укажем какое-то статичное число для максимальной цены фильтра товаров
        setInputRightRangePrice((((248 - +e.target.value) / ((124 / maxPriceMeal)) / 2))); // 248 здесь - число в 2 раза больше,чем максимальная ширина полоски в пикселях до ползунка у правого инпута с типом range(делаем так,чтобы правильно считалась цена,например,в конце,когда полоска дойдет до максимального значения правого инпута,то это число будет равно 248 - 124 = 124),по дефолту у инпута с типом range минимальное смещение ползунка на 1 пиксель равно 1(единице) значения этого инпута с типом range,потом делим 124(максимальная ширина полоски до ползунка этого правого инпута) на maxPriceMeal(максимальная цена блюда из всех,которые есть),чтобы посчитать,во сколько раз максимальная ширина полоски до ползунка (124 пикселя(или просто 124) в данном случае) больше,чем максимальная цена блюда,в данном случае это значение примерно 4.42 (это чтобы получить значение,на которое нужно делить текущее значение правого инпута с типом range,чтобы при минимальном смещении ползунка значение этого инпута менялось в несколько раз меньше,чем было,типа на 0.5 и тд,вместо 1 по дефолту, если нужно,чтобы при минимальном смещении ползунка значение этого инпута менялось в несколько раз больше,чем 1 по дефолту,то нужно это умножать,а не делить), потом делим на 2 полученный результат деления того,что в левых скобках на то,что в правый скобках,чтобы цена показалась,как надо,потому что если не делить на 2 в данном случае,то максимальная и минимальная цена этого правого инпута будет в 2 раза больше,чем нам надо

        console.log(+e.target.value)


        setOnChangingInputRightRange(true); // изменяем значение состояния onChangingInputLeftRange на true,то есть отслеживаем,изменяет ли сейчас пользователь значение левого инпута с типом range у ползунка для фильтра цены


        console.log(inputRightRangePrice);
    }



    // функция при изменении значения инпута поиска
    const inputSearchChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {

        setInputSearchValue(e.target.value);

        setPage(1); // изменяем состояние текущей страницы на 1,чтобы при поиске страница ставилась на первую
    }


    const selectItemHandler = () => {

        setSelectBlockValue('Rating'); // изменяем состояние selectBlockValue на значение Rating

        setSelectBlockActive(false); // изменяем состояние selectBlockActive на значение false,то есть убираем появившийся селект блок
    }


    // указываем в массиве зависимостей этого useEffect data?.meals(массив объектов блюд для отдельной страницы пагинации),чтобы делать повторный запрос на получения объектов товаров при изменении data?.meals,в данном случае это для пагинации,если не указать data?.meals,то пагинация при запуске страницы не будет работать
    useEffect(() => {

        refetch();  // делаем повторный запрос на получение товаров при изменении data?.meals, inputSearchValue(значение инпута поиска),filterCategories и других фильтров,а также при изменении состояния текущей страницы пагинации 

    }, [data?.meals, page, inputSearchValue, filterCategories]);


    // при изменении состояния onChangingInputLeftRange,то есть когда пользователь начал изменять значение левого инпута с типом range у ползунка для фильтра цены(то есть начал крутить левый ползунок для изменения фильтра цены),то делаем запрос на сервер на получение объектов блюд уже с новым фильтром цены,отслеживаем это,чтобы делать запрос на сервер только после того,как пользователь отпустил кнопку мыши при изменении значения инпута с типом range(то есть перестал тянуть ползунок для фильтра цены),если это не отслеживать,то будут лететь кучи запросов на сервер при изменении значения инпута с типом range для фильтра цены
    useEffect(() => {

        // если onChangingInputLeftRange false,то есть пользователь перестал крутить левый ползунок для изменения фильтра цены(в данном случае отслеживаем,когда пользователь отпустил кнопку мыши с этого ползунка) и isFetching false,то есть запрос на сервер для получения объектов блюд сейчас не грузится(делаем эту проверку,чтобы не было много запросов и долго не грузились данные после того,как пользователь зашел на страницу товара и вернулся в каталог)
        if (!onChangingInputLeftRange && !isFetching) {

            refetch();  // делаем повторный запрос на получение блюд

        }

    }, [onChangingInputLeftRange])


    // при изменении состояния onChangingInputRightRange,то есть когда пользователь начал изменять значение правого инпута с типом range у ползунка для фильтра цены(то есть начал крутить правый ползунок для изменения фильтра цены),то делаем запрос на сервер на получение объектов блюд уже с новым фильтром цены,отслеживаем это,чтобы делать запрос на сервер только после того,как пользователь отпустил кнопку мыши при изменении значения инпута с типом range(то есть перестал тянуть ползунок для фильтра цены),если это не отслеживать,то будут лететь кучи запросов на сервер при изменении значения инпута с типом range для фильтра цены
    useEffect(() => {

        // если onChangingInputRightRange false,то есть пользователь перестал крутить правый ползунок для изменения фильтра цены(в данном случае отслеживаем,когда пользователь отпустил кнопку мыши с этого ползунка) и isFetching false,то есть запрос на сервер для получения объектов блюд сейчас не грузится(делаем эту проверку,чтобы не было много запросов и долго не грузились данные после того,как пользователь зашел на страницу товара и вернулся в каталог)
        if (!onChangingInputRightRange && !isFetching) {

            refetch();  // делаем повторный запрос на получение блюд

        }

    }, [onChangingInputRightRange])


    // при изменении searchValue,то есть когда пользователь что-то вводит в инпут поиска,то изменяем filterCategory на пустую строку и остальные фильтры тоже,соответственно будет сразу идти поиск по всем товарам,а не в конкретной категории или определенных фильтрах,но после поиска можно будет результат товаров по поиску уже отфильтровать по категориям и делаем повторный запрос на сервер уже с измененным значение searchValue(чтобы поисковое число(число товаров,которое изменяется при поиске) показвалось правильно,когда вводят что-то в поиск)
    useEffect(() => {

        setFilterCategories('');


        setInputLeftRangePrice(0); // изменяем значение состояния цены левого инпута у ползунка для фильтра цены на 0,то есть первоначальное значение,то есть убираем фильтр цены

        setInputLeftRangeTrackWidth(0); // изменяем состояние ширины левой полоски до ползунка(кружочка у инпута с типом range для фильтра цены) на 0,то есть возвращаем его в первоначальное значение когда убираем фильтр цены,чтобы эта полоска не показывалась

        setInputLeftRangeValue(0); // изменяем состояние значения левого инпута с типом range в ползунке для фильтра цены,то есть возвращаем кружочек у левого инпута с типом range в ползунке для фильтра цены в первоначальное значение,чтобы этот кружочек не показывался,как будто есть фильтр цены


        setInputRightRangePrice(maxPriceMeal);  // изменяем значение состояния цены правого инпута у ползунка для фильтра цены на maxPriceMeal(максимальная цена блюда из всех),то есть первоначальное значение,то есть убираем фильтр цены

        setInputRightRangeTrackWidth(0); // изменяем состояние ширины правой полоски до ползунка(кружочка у инпута с типом range для фильтра цены) на 0,то есть возвращаем его в первоначальное значение когда убираем фильтр цены,чтобы эта полоска не показывалась

        setInputRightRangeValue(0); // изменяем состояние значения правого инпута с типом range в ползунке для фильтра цены,то есть возвращаем кружочек у правого инпута с типом range в ползунке для фильтра цены в первоначальное значение,чтобы этот кружочек не показывался,как будто есть фильтр цены

    }, [inputSearchValue])

    // при изменении фильтров и состояния сортировки(selectValue в данном случае) изменяем состояние текущей страницы пагинации на первую
    useEffect(() => {

        setPage(1);

    }, [filterCategories, inputLeftRangePrice, inputRightRangePrice])


    let pagesArray = getPagesArray(totalPages, page); // помещаем в переменную pagesArray массив страниц пагинации,указываем переменную pagesArray как let,так как она будет меняться в зависимости от проверок в функции getPagesArray

    const prevPage = () => {
        // если текущая страница больше или равна 2
        if (page >= 2) {
            setPage((prev) => prev - 1); // изменяем состояние текущей страницы на - 1(то есть в setPage берем prev(предыдущее значение,то есть текущее) и отнимаем 1)
        }
    }

    const nextPage = () => {
        // если текущая страница меньше или равна общему количеству страниц - 1(чтобы после последней страницы не переключалось дальше)
        if (page <= totalPages - 1) {
            setPage((prev) => prev + 1); // изменяем состояние текущей страницы на + 1(то есть в setPage берем prev(предыдущее значение,то есть текущее) и прибавляем 1)
        }
    }


    // функция для кнопки удаления фильтра цены
    const removePriceFilterBtn = () => {

        setInputLeftRangePrice(0); // изменяем значение состояния цены левого инпута у ползунка для фильтра цены на 0,то есть первоначальное значение,то есть убираем фильтр цены

        setInputLeftRangeTrackWidth(0); // изменяем состояние ширины левой полоски до ползунка(кружочка у инпута с типом range для фильтра цены) на 0,то есть возвращаем его в первоначальное значение когда убираем фильтр цены,чтобы эта полоска не показывалась

        setInputLeftRangeValue(0); // изменяем состояние значения левого инпута с типом range в ползунке для фильтра цены,то есть возвращаем кружочек у левого инпута с типом range в ползунке для фильтра цены в первоначальное значение,чтобы этот кружочек не показывался,как будто есть фильтр цены


        setInputRightRangePrice(maxPriceMeal);  // изменяем значение состояния цены правого инпута у ползунка для фильтра цены на maxPriceMeal(максимальная цена блюда из всех),то есть первоначальное значение,то есть убираем фильтр цены

        setInputRightRangeTrackWidth(0); // изменяем состояние ширины правой полоски до ползунка(кружочка у инпута с типом range для фильтра цены) на 0,то есть возвращаем его в первоначальное значение когда убираем фильтр цены,чтобы эта полоска не показывалась

        setInputRightRangeValue(0); // изменяем состояние значения правого инпута с типом range в ползунке для фильтра цены,то есть возвращаем кружочек у правого инпута с типом range в ползунке для фильтра цены в первоначальное значение,чтобы этот кружочек не показывался,как будто есть фильтр цены


        // через 200 миллисекунд(0.2 секунды) делаем повторный запрос на сервер для получения блюд уже без фильтра цены,используем здесь setTimeout и указываем время,через которое выполнится функция,как 200 миллисекунд,чтобы успело обновиться состояние фильтра цены в коде выше,а только потом пошел повторный запрос на сервер,если не сделать эту задержку в виде 200 миллисекунд,то сделается повторный запрос на сервер с предыдущем значением состояния фильтра цены,так как состояние фильтра цены не успеет переобновиться
        window.setTimeout(() => {

            refetch(); // делаем повторный запрос на сервер для получения блюд 

        }, 200)

    }

    // при изменении data?.allMeals(массив всех блюд, который может быть отфильтрован по фильтру цены,если этот фильтр выбран)
    useEffect(() => {

        // пробегаемся по массиву всех блюд(который может быть отфильтрован по фильтру цены,если этот фильтр выбран) и на каждой итерации(на каждом элементе массива) записываем в состояние numberMass(массив чисел всех цен блюд) meal.price(цену каждого объекта блюда)
        data?.allMeals.forEach(meal => {

            numberMass.push(meal.price);

        });

        console.log(numberMass)

        setMaxPriceMeal(Math.max(...numberMass)); // изменяем значение состояния maxPriceMeal на максимальное значение из всех цен блюд,Math.max() - выбирает максимальное значение из чисел,в данном случае в Math.max() разворачиваем массив numberMass,то есть вместо него будут подставлены все значения(элементы),которые есть в этом массиве

        console.log(inputRightRangePrice)


    }, [data?.allMeals])


    // при изменении maxPriceMeal изменяем inputRightRangePrice(цену для правого инпута для фильтра цены)
    useEffect(() => {

        setInputRightRangePrice(maxPriceMeal)

    }, [maxPriceMeal])


    return (
        <main className="main" >
            <SectionCatalogTop />
            <section id="sectionImportantFood" className={onScreen.sectionImportantFoodIntersecting ? "sectionImportantFood sectionImportantFood__active sectionCatalog" : "sectionImportantFood sectionCatalog"} ref={sectionImportantFoodRef}>
                <div className="container">
                    <div className="sectionCatalog__inner">
                        <div className="sectionCatalog__filterBar">
                            <div className="sectionCatalog__filterBar-filterBlock">
                                <h3 className="filterBar__filterBlock-title">Category</h3>
                                <label className="filterBar__filterBlock-label" onClick={() => setFilterCategories('Burgers')}>
                                    <input type="radio" name="radio" className="filterBlock__label-input" />
                                    <span className={filterCategories === 'Burgers' ? "filterBlock__label-radioStyle filterBlock__label-radioStyle--active" : "filterBlock__label-radioStyle"}>
                                        <span className={filterCategories === 'Burgers' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                    </span>
                                    <p className="filterBlock__label-text">Burgers</p>

                                    {/* если filterCategories !== '',то есть какая либо категория выбрана,то не показываем число товаров в этой категории(в данном случае сделали так,чтобы число товаров в определнной категории показывалось только если никакие фильтры не выбраны,кроме поиска),также если выбраны любые другие фильтры,тоже не показываем число товаров этой категории, или также если inputRightRangePrice меньше 100(то есть состояние цены правого инпута в ползунке для цены меньше 100,то есть пользователь указал фильтр цены) или inputLeftRangePrice > 0 то есть состояние цены левого инпута в ползунке для цены больше 0,то есть пользователь указал фильтр цены), то также не показываем число блюд в категориях,указываем значение этому тексту для количества товаров категории, в данном случае как filteredCategoryBurgers?.length(массив блюд,отфильтрованный по полю category и значению 'Burgers',то есть категория бургеров) */}
                                    <p className={filterCategories !== '' || inputRightRangePrice < 100 || inputLeftRangePrice > 0 ? "filterBlock__label-amount filterBlock__label-amountDisable" : "filterBlock__label-amount"}>({filteredCategoryBurgers?.length})</p>
                                </label>
                                <label className="filterBar__filterBlock-label" onClick={() => setFilterCategories('Drinks')}>
                                    <input type="radio" name="radio" className="filterBlock__label-input" />
                                    <span className={filterCategories === 'Drinks' ? "filterBlock__label-radioStyle filterBlock__label-radioStyle--active" : "filterBlock__label-radioStyle"}>
                                        <span className={filterCategories === 'Drinks' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                    </span>
                                    <p className="filterBlock__label-text">Drinks</p>
                                    <p className={filterCategories !== '' || inputRightRangePrice < 100 || inputLeftRangePrice > 0 ? "filterBlock__label-amount filterBlock__label-amountDisable" : "filterBlock__label-amount"}>({filteredCategoryDrinks?.length})</p>
                                </label>
                                <label className="filterBar__filterBlock-label" onClick={() => setFilterCategories('Pizza')}>
                                    <input type="radio" name="radio" className="filterBlock__label-input" />
                                    <span className={filterCategories === 'Pizza' ? "filterBlock__label-radioStyle filterBlock__label-radioStyle--active" : "filterBlock__label-radioStyle"}>
                                        <span className={filterCategories === 'Pizza' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                    </span>
                                    <p className="filterBlock__label-text">Pizza</p>
                                    <p className={filterCategories !== '' || inputRightRangePrice < 100 || inputLeftRangePrice > 0 ? "filterBlock__label-amount filterBlock__label-amountDisable" : "filterBlock__label-amount"}>({filteredCategoryPizza?.length})</p>
                                </label>
                                <label className="filterBar__filterBlock-label" onClick={() => setFilterCategories('Sandwiches')}>
                                    <input type="radio" name="radio" className="filterBlock__label-input" />
                                    <span className={filterCategories === 'Sandwiches' ? "filterBlock__label-radioStyle filterBlock__label-radioStyle--active" : "filterBlock__label-radioStyle"}>
                                        <span className={filterCategories === 'Sandwiches' ? "label__radioStyle-before label__radioStyle-before--active" : "label__radioStyle-before"}></span>
                                    </span>
                                    <p className="filterBlock__label-text">Sandwiches</p>
                                    <p className={filterCategories !== '' || inputRightRangePrice < 100 || inputLeftRangePrice > 0 ? "filterBlock__label-amount filterBlock__label-amountDisable" : "filterBlock__label-amount"}>({filteredCategorySandwiches?.length})</p>
                                </label>
                            </div>

                            <div className="sectionCatalog__filterBar-filterBlockPrice">
                                <h3 className="filterBar__filterBlock-title">Price Filter</h3>

                                <div className="filterBlock__priceInputs">

                                    {/* этому label в onMouseUp(когда кнопку мыши отпустили) изменяем состояние onChangingInputLeftRange(состояние изменения левого ползунка у инпута с типом range для фильтра цены) на false,то есть когда пользователь перестал крутить ползунок и отпустил с него кнопку мыши,то изменяем это состояние на false */}
                                    <label className="filterBlock__priceInputs-blockInput" htmlFor="rangeLeft" onMouseUp={() => setOnChangingInputLeftRange(false)}>
                                        <input id="rangeLeft" type="range" className="filterBlock__priceInputs-priceInput filterBlock__priceInputs-priceInputLeft" min="0" max="124" value={inputLeftRangeValue} onChange={OnChangeRangeLeft} />

                                        {/* указываем этому диву в style в width значение как у состояния inputRangeTrackWidth(то есть состояние для полоски до ползунка у инпута с типом range),потом в коде выше изменяем это значение,соответственно и изменяем ширину этого div элемента(полоски до ползунка у инпута с типом range) */}
                                        <div className="priceInputs__blockInput-trackInput priceInputs__blockInput-trackInputLeft" style={{ "width": `${inputLeftRangeTrackWidth}px` }} ref={inputLeftRangeRef} ></div>
                                    </label>

                                    {/* этому label в onMouseUp(когда кнопку мыши отпустили) изменяем состояние OnChangingInputRightRange(состояние изменения правого ползунка у инпута с типом range для фильтра цены) на false,то есть когда пользователь перестал крутить ползунок и отпустил с него кнопку мыши,то изменяем это состояние на false */}
                                    <label htmlFor="rangeRight" className="filterBlock__priceInputs-blockInput filterBlock__priceInputs-blockInputRight" onMouseUp={() => setOnChangingInputRightRange(false)}>
                                        <input id="rangeRight" type="range" className="filterBlock__priceInputs-priceInput filterBlock__priceInputs-priceInputRight" min="0" max="124" value={inputRightRangeValue} onChange={OnChangeRangeRight} />

                                        {/* указываем этому диву в style в width значение как у состояния inputLeftRangeTrackWidth(то есть состояние для полоски до ползунка у левого инпута с типом range),потом в коде выше изменяем это значение,соответственно и изменяем ширину этого div элемента(полоски до ползунка у инпута с типом range) */}
                                        <div className="priceInputs__blockInput-trackInput priceInputs__blockInput-trackInputRight" style={{ "width": `${inputRightRangeTrackWidth}px` }} ref={inputRightRangeRef} ></div>
                                    </label>


                                </div>

                                {/* используем здесь для текста цены метод toFixed(0),он указывает,сколько чисел может быть после запятой у числа,в данном случае указали 0 (чтобы было 0 чисел после запятой,также этот метод округляет автоматически число в большую сторону,когда это нужно,типа 1.6 округлит до 2,поэтому и указали более точное число(0.404),на которое умножали текущее значение инпута с типом range,чтобы этот метод toFixed в итоге правильно округлял числа),так как состояния inputLeftRangePrice(состояние цены для левого инпута с типом range) и inputRightRangePrice(состояние цены для правого инпута с типом range) могут получаться не целые при изменении ипнута с типом range */}
                                <p className="filterBlockPrice__priceText">From ${inputLeftRangePrice.toFixed(0)} to ${inputRightRangePrice.toFixed(0)}</p>
                            </div>
                        </div>
                        <div className="sectionCatalog__main">
                            <div className="sectionCatalog__main-top">
                                <div className="sectionCatalog__main-topInputBlock">
                                    <input type="text" className="sectionCatalog__main-topInput" placeholder="Search Product" value={inputSearchValue} onChange={inputSearchChangeHandler} />
                                    <img src="/images/sectionCatalog/MagnifyingGlass.png" alt="" className="sectionCatalog__topInputBlock-img" />
                                </div>

                                <div className="sectionCatalog__main-topSelect">
                                    <p className="topSelect__text">Sort By:</p>
                                    <div className="topSelect__inner">
                                        <div className="topSelect__selectTop" onClick={() => setSelectBlockActive((prev) => !prev)}>
                                            <p className="topSelect__selectTop-text">{selectBlockValue}</p>
                                            <img src="/images/sectionCatalog/CaretDown.png" alt="" className="topSelect__selectTop-img" />
                                        </div>
                                        <div className={selectBlockActive ? "topSelect__optionsBlock topSelect__optionsBlock--active" : "topSelect__optionsBlock"}>
                                            <div className="topSelect__optionsBlock-item" onClick={selectItemHandler}>
                                                <p className="optionsBlock__item-text">Rating</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sectionCatalog__main-filterBlock">
                                <div className="filterBlock__leftBlock">
                                    <p className="filterBlock__text">Active Filters:</p>


                                    {/* если filterCategories не равно пустой строке,то показываем фильтр с текстом filterCategories,то есть выбран фильтр сортировки по категориям */}
                                    {filterCategories !== '' &&

                                        <div className="filterBlock__item">

                                            {/* если filterCaregories равно Burgers, то показывать текст Burgers */}
                                            {filterCategories === 'Burgers' &&

                                                <p className="filterBlock__item-text">Burgers</p>

                                            }

                                            {filterCategories === 'Drinks' &&

                                                <p className="filterBlock__item-text">Drinks</p>

                                            }

                                            {filterCategories === 'Pizza' &&

                                                <p className="filterBlock__item-text">Pizza</p>

                                            }

                                            {filterCategories === 'Sandwiches' &&

                                                <p className="filterBlock__item-text">Sandwiches</p>

                                            }

                                            {/* в onClick изменяем значение состояния filterCategories на пустую строку,то есть убираем фильтр по категориям */}
                                            <button className="filterBlock__item-btn" onClick={() => setFilterCategories('')}>
                                                <img src="/images/sectionCatalog/X.png" alt="" className="filterBlock__item-img" />
                                            </button>


                                        </div>

                                    }


                                    {/* если состояние цены правого ипнута у ползунка для фильтра цены не равно 100,то есть не равно первоначальному значению, или если состояние цены левого ипнута у ползунка для фильтра цены не равно 0,то есть не равно первоначальному значению, то есть пользователь выбрал фильтр цены,то показываем его,в данном случае делаем условие именно таким образом(после условия ставим знак вопроса ? (то есть если условие выполняется), а потом ниже в коде ставим двоеточие : (то есть в противоположном случае,если это условие не выполняется) и пустую строку '' (то есть не показываем ничего) ),иначе не работает правильно условие */}
                                    {inputRightRangePrice < maxPriceMeal || inputLeftRangePrice > 0 ?

                                        <div className="filterBlock__item">

                                            {/* указываем значение этому тексту для фильтра цены, от значения состояния цены левого инпута у ползунка для фильтра цены(inputLeftRangePrice) до значения состояния цены правого инпута у ползунка для фильтра цены(inputRightRangePrice),указываем toFixed(0),чтобы значения чисел были с 0 знаков после запятой,то есть без знаков после запятой */}
                                            <p className="filterBlock__item-text">Price: {`$${inputLeftRangePrice.toFixed(0)} - $${inputRightRangePrice.toFixed(0)}`}</p>


                                            {/* в onClick указываем нашу функцию для удаления фильтра цены */}
                                            <button className="filterBlock__item-btn" onClick={removePriceFilterBtn}>
                                                <img src="/images/sectionCatalog/X.png" alt="" className="filterBlock__item-img" />
                                            </button>
                                        </div>
                                        : ''

                                    }

                                </div>

                                <div className="filterBlock__amountItems">
                                    {/* указываем значение этому тексту как data?.allMeals.length,то есть длину массива allMeals(массив всех блюд без пагинации),который приходит от сервера */}
                                    <p className="filterBlock__amountItems-amount">{data?.allMeals.length}</p>

                                    <p className="filterBlock__amountItems-text">Results found.</p>
                                </div>


                            </div>

                            {/* указываем если data?.allMeals.length true(то есть количество всех объектов блюд true,то есть они есть) и isFetching false(то есть загрузка запроса на сервер закончена,делаем эту проверку,чтобы когда грузится запрос на сервер показывать лоадер(загрузку) или текст типа Loading... ), то показываем объекты блюд,в другом случае если isFetching true,то показываем лоадер,или текст типа Loading..., и уже в другом случае,если эти условия не верны,то показываем текст,что не найдены объекты, проходимся по массиву объектов блюд meals,указываем data?.meals,так как от сервера в поле data приходит объект с полями meals(объекты блюд из базы данных для отдельной страници пагинации) и allMeals(все объекты блюд из базы данных без лимитов и состояния текущей страницы,то есть без пагинации,чтобы взять потом количество этих всех объектов блюд и использовать для пагинации) */}
                            {!isFetching && data?.allMeals.length ?

                                <div className="sectionCatalog__main-products">


                                    {data?.meals.map(meal =>

                                        <ProductsItem key={meal._id} meal={meal} />)

                                    }

                                </div> 
                                : isFetching ? <div className="innerForLoader">
                                    <div className="loader"></div>
                                </div> 
                                : <h4 className="products__notFoundText">Not found</h4>
                            }

                            {/* до этого использовали это, пока не сделали лоадер */}
                            {/* <div className="sectionCatalog__main-products">

                                {/* указываем если data?.allMeals.length true(то есть количество всех объектов блюд true,то есть они есть) и isFetching false(то есть загрузка запроса на сервер закончена,делаем эту проверку,чтобы когда грузится запрос на сервер показывать лоадер(загрузку) или текст типа Loading... ), то показываем объекты блюд,в другом случае если isFetching true,то показываем лоадер,или текст типа Loading..., и уже в другом случае,если эти условия не верны,то показываем текст,что не найдены объекты, проходимся по массиву объектов блюд meals,указываем data?.meals,так как от сервера в поле data приходит объект с полями meals(объекты блюд из базы данных для отдельной страници пагинации) и allMeals(все объекты блюд из базы данных без лимитов и состояния текущей страницы,то есть без пагинации,чтобы взять потом количество этих всех объектов блюд и использовать для пагинации) */}
                            {/* {!isFetching && data?.allMeals.length ? data?.meals.map(meal =>
                                    <ProductsItem key={meal._id} meal={meal} />)
                                    : isFetching ? <div className="innerForLoader">
                                        <div className="loader"></div>
                                    </div> :
                                        <h4 className="products__notFoundText">Not found</h4>
                                }

                            </div> */}


                            {/* если длина массива всех объектов товаров блюд(allMeals) true(то есть товары есть) и isFetching false(то есть запрос на сервер сейчас не грузится),то показывать пагинацию,в другом случае пустая строка(то есть ничего не показывать) */}
                            {!isFetching && data?.allMeals.length ?
                                <div className="sectionCatalog__main-pagination">
                                    <button className="pagination__btnLeft" onClick={prevPage}>
                                        <img src="/images/sectionCatalog/LeftArrow.png" alt="" className="pagination__btnLeft-img" />
                                    </button>

                                    {pagesArray.map(p =>
                                        <button
                                            key={p}

                                            className={page === p ? "pagination__item pagination__item--active" : "pagination__item"}  //если состояние номера текущей страницы page равно значению элементу массива pagesArray,то отображаем такие классы(то есть делаем эту кнопку страницы активной),в другом случае другие

                                            onClick={() => setPage(p)} // отслеживаем на какую кнопку нажал пользователь и делаем ее активной,изменяем состояние текущей страницы page на значение элемента массива pagesArray(то есть страницу,на которую нажал пользователь)

                                        >
                                            {p}
                                        </button>
                                    )}


                                    {/* если общее количество страниц больше 4 и текущая страница меньше общего количества страниц - 2,то отображаем три точки */}
                                    {totalPages > 4 && page < totalPages - 2 && <div className="pagination__dots">...</div>}


                                    {/* если общее количество страниц больше 3 и текущая страница меньше общего количества страниц - 1,то отображаем кнопку последней страницы,при клике на кнопку изменяем состояние текущей страницы на totalPages(общее количество страниц,то есть на последнюю страницу)  */}
                                    {totalPages > 3 && page < totalPages - 1 && <button className="pagination__item" onClick={() => setPage(totalPages)}>{totalPages}</button>}


                                    <button className="pagination__btnRight" onClick={nextPage}>
                                        <img src="/images/sectionCatalog/RightArrow.png" alt="" className="pagination__btnRight-img" />
                                    </button>
                                </div> : ''
                            }

                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Catalog;