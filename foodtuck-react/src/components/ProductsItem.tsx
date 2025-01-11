import { useNavigate } from "react-router-dom";
import { IMeal, IMealCart } from "../types/types";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { Dispatch, SetStateAction } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import $api, { API_URL } from "../http/http";

interface IProductsItemProps {
    meal: IMeal,
    refetchMealsCatalog: ()=>{}, // указываем полю refetchMealsCatalog что это стрелочная функция 
    setPage:Dispatch<SetStateAction<number>> // указываем тип для функции setPage(она у нас меняет текущую страницу пагинации каталога),которая изменяет состояние useState и указываем,что параметр этой функции будет с типом nubmer
}

const ProductsItem = ({ meal, refetchMealsCatalog, setPage }: IProductsItemProps) => {

    const { user } = useTypedSelector(state => state.userSlice); // указываем наш слайс(редьюсер) под названием userSlice и деструктуризируем у него поле состояния user,используя наш типизированный хук для useSelector

    const router = useNavigate(); // useNavigate может перемещатьтся на другую страницу вместо ссылок

    const { data: dataMealsCart, refetch: refetchMealsCart } = useQuery({
        queryKey: ['mealsCart'],
        queryFn: async () => {

           // делаем запрос на сервер на получение всех товаров корзины,указываем тип данных,которые придут от сервера(тип данных на основе нашего интерфеса IMealCart,и указываем,что это массив IMealCart[]),указываем query параметр userId со значением id пользователя,чтобы получать товары корзины для конкретного авторизованного пользователя
            const response = await axios.get<IMealCart[]>(`${API_URL}/getAllMealsCart?userId=${user.id}`);

            return response;
        }
    })

    const { mutate:mutateDeleteMealCatalog } = useMutation({
        mutationKey: ['deleteMealCatalog'],
        mutationFn: async (mealCatalog: IMeal) => {

            // делаем в данном случае post запрос на сервер для удаление товара(блюда) каталога(так как нам надо передать тело запроса на сервер,чтобы брать определенные поля из объекта товара из тела запроса,но можно указать delete запрос,и передавать эти определенные поля как query параметры в url),также используем тут наш инстанс axios ($api,то есть наш axios с определенными настройками),чтобы правильно обрабатывался этот запрос для проверки на access токен с помощью нашего authMiddleware на нашем сервере,и указываем тип данных,которые вернет сервер(то есть в данном случае будем от сервера возвращать удаленный объект товара(блюда) в базе данных,то есть в данном случае тип IMeal),но здесь не обязательно указывать тип
            await $api.post<IMeal>(`${API_URL}/deleteMealCatalog`,mealCatalog);

        },

        // при успешной мутации обновляем весь массив товаров каталога с помощью функции refetchMealsCatalog,которую мы передали как пропс (параметр) этого компонента,если не обновить этот массив товаров каталога,то он будет обновлен только после перезагрузки страницы
        onSuccess() {
            refetchMealsCatalog();

            setPage(1); // изменяем состояние текущей страницы пагинации каталога на 1,чтобы при удалении товара текущая страница становилась 1

            refetchMealsCart(); // обновляем массив товаров корзины после удаления товара
        }

    })


    return (

        // делаем этот div отдельно от div с основными элементами товара,чтобы отделить кнопку админа для удаления товара и при нажатии на эту кнопку выполнялось удаления товара,а не переход на страницу товара
        <div className="products__itemMain">

            {/* если user.role равно 'ADMIN'(то есть пользователь авторизован как администратор),то показываем кнопку админа для удаления товара из базы данных */}
            {user.role === 'ADMIN' &&
                <button className="products__item-deleteBtn" onClick={()=> mutateDeleteMealCatalog(meal)}>
                    <img src="/images/sectionCatalog/Close.png" alt="" className="products__deleteBtn-img" />
                </button>
            }


            {/* этому диву в onClick указываем router() и указываем url,по которому нужно будет перекинуть пользователя,в данном случае указываем url для страницы блюда,через / после /catalog указываем id у блюда,чтобы перекинуть на страницу с его id(мы этот динамический параметр id указывали при создании Routes(маршрутов) в файле App.tsx,поэтому указываем тут id блюда,чтобы сработал маршрут показа страницы для отдельного блюда) */}
            <div className="products__item" onClick={() => router(`/catalog/${meal._id}`)}>

                {/* в пути для картинки(src) указываем url до картинки на сервере,так как сделали так,чтобы наш сервер раздавал статику(то есть можно было отображать картинки,которые загружены на сервер, в браузере),в данном случае указываем http://localhost:5000/ и значение поля image у meal(объекта товара(блюда)) */}
                <img src={`http://localhost:5000/${meal.image}`} alt="" className="products__item-img" />
                <div className="products__item-stars">
                    <img src={meal.rating === 0 ? "/images/sectionCatalog/StarGrey.png" : "/images/sectionCatalog/StarYellow.png"} alt="" className="products__stars-imgYellow" />
                    <img src={meal.rating >= 2 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="products__stars-imgYellow" />
                    <img src={meal.rating >= 3 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="products__stars-imgYellow" />
                    <img src={meal.rating >= 4 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="products__stars-imgYellow" />
                    <img src={meal.rating >= 5 ? "/images/sectionCatalog/StarYellow.png" : "/images/sectionCatalog/StarGrey.png"} alt="" className="products__stars-imgGrey" />
                </div>
                <p className="products__item-text">{meal.name}</p>
                <p className="products__item-price">${meal.price}.00</p>
            </div>

        </div>

    )
}

export default ProductsItem;