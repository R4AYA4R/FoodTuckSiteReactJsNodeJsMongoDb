import { RefObject, useEffect, useState } from "react";

// указываем тип параметру ref(в эту функцию useIsOnScreen будем передавать ссылку на html элемент) как RefObject(тип для ссылок на html элемент) и указываем ему в generic HTMLElement(какой-либо html элемент)
export const useIsOnCreen = (ref:RefObject<HTMLElement>)=>{

    // создаем состояние для разных состояний для того,чтобы знать,попадает ли html элемент в область observer 
    const [isIntersectingNow,setIsIntersectingNow] = useState({
        sectionTopIntersecting:false,
        sectionImportantFoodIntersecting:false,
        sectionPartnersIntersecting:false,
    })


    // создаем функцию для intersectionObserver,принимает в параметре все элементы,за которыми следит(entries),и сам observer,указываем тип параметру entries как IntersectionObserverEntry и указываем ему,что это массив,указываем параметру observer тип как IntersectionObserver,так как это и есть сам IntersectionObserver
    const callback = (entries:IntersectionObserverEntry[],observer:IntersectionObserver)=>{

        // проходимся по всему массиву отслеживаемых элементов(entries)
        entries.forEach(entry=>{
            // если элемент из всех отслеживаемых элементов сейчас наблюдается(то есть попал в зону видимости observer(в данном случае в зону видимости окна браузера))
            if(entry.isIntersecting){

                // если id html элемента,который сейчас наблюдается,равняется sectionTop
                if(entry.target.id === 'sectionTop'){

                    setIsIntersectingNow((prev)=>({...prev,sectionTopIntersecting:true})); // изменяем состояние текущего наблюдения,возвращая новый объект,куда разворачиваем все предыдущие состония как они и были,только меняем одно состояние для конкретного html элемента(в данном случае sectionTopIntersecting) на true, чтобы не обарачивать все в квадратные скобки и потом не писать return,просто можно обернуть объект в круглые скобки(это тоже самое)

                    observer.unobserve(entry.target); // убираем отслеживание текущего элемента,чтобы больше observer не следил за этим элементом
                }

                if(entry.target.id === 'sectionImportantFood'){

                    setIsIntersectingNow((prev)=>({...prev,sectionImportantFoodIntersecting:true})); // изменяем состояние текущего наблюдения,возвращая новый объект,куда разворачиваем все предыдущие состония как они и были,только меняем одно состояние для конкретного html элемента(в данном случае sectionTopIntersecting) на true, чтобы не обарачивать все в квадратные скобки и потом не писать return,просто можно обернуть объект в круглые скобки(это тоже самое)

                    observer.unobserve(entry.target); // убираем отслеживание текущего элемента,чтобы больше observer не следил за этим элементом
                }

                if(entry.target.id === 'sectionPartners'){

                    setIsIntersectingNow((prev)=>({...prev,sectionPartnersIntersecting:true})); // изменяем состояние текущего наблюдения,возвращая новый объект,куда разворачиваем все предыдущие состония как они и были,только меняем одно состояние для конкретного html элемента(в данном случае sectionTopIntersecting) на true, чтобы не обарачивать все в квадратные скобки и потом не писать return,просто можно обернуть объект в круглые скобки(это тоже самое)

                    observer.unobserve(entry.target); // убираем отслеживание текущего элемента,чтобы больше observer не следил за этим элементом
                }


            }

        })

    }

    const observer = new IntersectionObserver(callback); // создаем intersectionObserver и передаем в параметре нашу функцию callback,которая будет обрабатывать этот observer

    // создаем useEffect,чтобы запуск observer сработал при запуске сайта
    useEffect(()=>{

        
        observer.observe(ref.current as HTMLElement); // запускаем слежку нашего observer,и в observe() передаем ref.current,ссылку на html элемент(за которым нужно следить),который будем передавать потом при вызове этого всего хука,указываем тип этому параметру ref.current как HTMLElement,чтобы не было ошибки,то есть указываем,что параметр ref.current будет типа HTMLElement,иначе показывает ошибку,что ref.current не Element

        

    },[])

    return isIntersectingNow;  // возвращаем весь объект состояний,чтобы потом делать проверки,наблюдается ли сейчас элемент обзервером или нет

}