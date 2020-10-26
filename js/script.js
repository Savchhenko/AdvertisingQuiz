document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const overlay = document.querySelector('.overlay');
    const quiz = document.querySelector('.quiz');
    const passTestButton = document.querySelector('.pass-test__button');
    const form = document.querySelector('.quiz-body__form');
    const formItems = form.querySelectorAll('fieldset');
    const btnsNext = form.querySelectorAll('.form-button__btn-next');
    const btnsPrev = form.querySelectorAll('.form-button__btn-prev');
    const answersObj = {
        step0: {
            question: '',
            answers: [],
        },
        step1: {
            question: '',
            answers: [],
        },
        step2: {
            question: '',
            answers: [],
        },
        step3: {
            question: '',
            answers: [],
        },
        step4: {
            name: '',
            phone: '',
            email: '',
            call: '',
        }
    };


    //переход к следующему или предыдущему слайдам
    btnsNext.forEach((btn, btnIndex) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();

            formItems[btnIndex].style.display = 'none';
            formItems[btnIndex + 1].style.display = 'block';
        });

        btn.disabled = true;

    });
    btnsPrev.forEach((btn, btnIndex) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();

            formItems[btnIndex + 1].style.display = 'none';
            formItems[btnIndex].style.display = 'block';
        })
    })
    

    formItems.forEach((formItem, formItemIndex) => {

        if (formItemIndex === 0) {
            formItem.style.display = "block";
        } else {
            formItem.style.display = "none";
        }

        if (formItemIndex !== formItems.length - 1) {
            const inputs = formItem.querySelectorAll('input');
            const itemTitle = formItem.querySelector('.form__title');

            answersObj[`step${formItemIndex}`].question = itemTitle.textContent;
            
            //удалили подцветку по умолчанию у варианта ответа
            inputs.forEach((input) => {
                const parent = input.parentNode;
                input.checked = false;
                parent.classList.remove('active-radio');
                parent.classList.remove('active-checkbox');
            });
        }
        
        //выбор radio и checkbox
        formItem.addEventListener('change', (event) => {
            const target = event.target;
            const inputsChecked = formItem.querySelectorAll('input:checked');

            //сохранили ответы в объект
            answersObj[`step${formItemIndex}`].answers.length = 0; //обнуление 
            inputsChecked.forEach((inputChecked) => {
                answersObj[`step${formItemIndex}`].answers.push(inputChecked.value);

            } );
            //снимаем блокировку кнопки Далее
            if(inputsChecked.length > 0) {
                btnsNext[formItemIndex].disabled = false;
            } else {
                btnsNext[formItemIndex].disabled = true;

            }
            //делегирование: внутри одного события работаем с разными элементами
            if(target.classList.contains('form__radio')) {
                const radios = formItem.querySelectorAll('.form__radio');

                //включили подцветку выбранного ответа
                radios.forEach((input) => {
                    if(input === target) {
                        input.parentNode.classList.add('active-radio')
                    } else {
                        input.parentNode.classList.remove('active-radio')
                    }
                });
            } else if(target.classList.contains('form__input')) {
                target.parentNode.classList.toggle('active-checkbox');
            } else {
                return;
            }
        });

    });

    const sendForm = () => {
        const lastFieldset = formItems[formItems.length - 1];  //получили последний слайд
        form.addEventListener('submit', (event) => {
            event.preventDefault(); //предотвратили перезагрузку страницы
            answersObj.step4.name = document.getElementById('quiz-name').value; //записали имя из формы в оъект
            answersObj.step4.phone = document.getElementById('quiz-phone').value; 
            answersObj.step4.email = document.getElementById('quiz-email').value; 
            answersObj.step4.call = document.getElementById('quiz-call').value; 

            if(document.getElementById('quiz-policy').checked === true) {
                //обработка результатов, прибывших из сервера
                postData(answersObj).then((res) => {
                    if(res['status'] === 'ok') {
                        overlay.style.display = "none";    
                        quiz.style.display = "none"; 
                        alert(res['message']);
                    } else if(res['status'] === 'error') {
                        alert(res['message']);
                    }
                });
                
            } else {
                alert('Дайте согласие на обработку персональных данных');
            }
        });
    };

    const postData = (body) => {  //body - тело запроса
        return fetch('./server.php', {  // отправляется результат и возвращаются данные
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }); 
    };

    overlay.style.display = "none";    
    quiz.style.display = "none"; 
    
    passTestButton.addEventListener('click', () => {
        overlay.style.display = "block";    
        quiz.style.display = "block"; 
    });

    sendForm();
});

