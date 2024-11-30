import { useRef } from "react";
import { useIsOnCreen } from "../hooks/useIsOnScreen";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IMeal } from "../types/types";
import MealsItem from "./MealsItem";

const SectionMenu = ()=>{

    // в данном случае скопировали эти useRef из другого компонента,а html  элементу section дали такой же id и такие же классы(кроме одного класса нового sectionAboutCreate),так как анимация появления этой секции такая же,как и в другом компоненте,работает все нормально с одинаковыми id для IntersectionObserver(так как секции в разное время срабатывают,пока пользователь доскроллит(докрутит сайт) до определенной секции )
    const sectionImportantFoodRef = useRef(null); // создаем ссылку на html элемент и помещаем ее в переменную sectionTopRef, указываем в useRef null,так как используем typeScript

    const onScreen = useIsOnCreen(sectionImportantFoodRef); // вызываем наш хук useIsOnScreen(),куда передаем ссылку на html элемент(в данном случае на sectionTop),и этот хук возвращает объект состояний,который мы помещаем в переменную onScreen

    // делаем запрос на сервер с помощью react query при запуске страницы и описываем здесь функцию запроса на сервер
    const {data} = useQuery({
        queryKey:['getAllMealsLeft'], // указываем здесь такое же название,как и в файле SectionDeals для получения товаров,это чтобы при удалении товара обновлялись данные автоматически сразу в другой компоненте(в данном случае в SectionDeals),а не после обновления страницы
        queryFn:async () => {
            const response = await axios.get<IMeal[]>('http://localhost:5000/api/getMeals?limit=2&skip=0'); // делаем запрос на сервер для получения всех блюд,указываем в типе в generic наш тип на основе интерфейса IMeal,указываем,что это массив(то есть указываем тип данных,которые придут от сервера), указываем query параметры в url limit(максимальное количество объектов,которые придут из базы данных mongodb) и skip(сколько объектов пропустить,прежде чем начать брать из базы данных mongodb)

            console.log(response.data);

            return response; 
        }
    })

    // делаем второй запрос на сервер на получение блюд,но уже с другими значениями в query параметрах url,в данном случае это для правого блока отображения блюд 
    const {data:dataRight} = useQuery({
        queryKey:['getAllMealsRight'], // указываем здесь такое же название,как и в файле SectionDeals для получения товаров,это чтобы при удалении товара обновлялись данные автоматически сразу в другой компоненте(в данном случае в SectionDeals),а не после обновления страницы
        queryFn:async () => {
            const response = await axios.get<IMeal[]>('http://localhost:5000/api/getMeals?limit=2&skip=2'); // делаем запрос на сервер для получения всех блюд,указываем в типе в generic наш тип на основе интерфейса IMeal,указываем,что это массив(то есть указываем тип данных,которые придут от сервера), указываем query параметры в url limit(максимальное количество объектов,которые придут из базы данных mongodb) и skip(сколько объектов пропустить,прежде чем начать брать из базы данных mongodb)

            console.log(response.data);

            return response; 
        }
    })

    return(
        <section id="sectionImportantFood" className={onScreen.sectionImportantFoodIntersecting ? "sectionImportantFood sectionImportantFood__active sectionMenu" : "sectionImportantFood sectionMenu"} ref={sectionImportantFoodRef}>
            <div className="container">
                <div className="sectionMenu__inner">
                    <h2 className="sectionMenu__title">Our Popular Meals</h2>
                    <p className="sectionMenu__subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Varius sed pharetra dictum neque massa congue</p>
                    <div className="sectionMenu__meals">
                        <div className="sectionMenu__meals-leftBlock">
                            
                            {/* указываем в key у meal поле id с нижним подчеркиванием(_id),чтобы брать id у объекта из базы данных mongodb,так как там id указывается с нижним подчеркиванием  */}
                            {data?.data.map(meal => 
                                <MealsItem key={meal._id} meal={meal}/>
                            )}
                            
                        </div>
                        <div className="sectionMenu__meals-rightBlock">

                           {/* указываем в key у meal поле id с нижним подчеркиванием(_id),чтобы брать id у объекта из базы данных mongodb,так как там id указывается с нижним подчеркиванием  */}
                           {dataRight?.data.map(meal => 
                                <MealsItem key={meal._id} meal={meal}/>
                            )}

                        </div>  
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionMenu;