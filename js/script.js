document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const overlay = document.querySelector('.overlay');
    const quiz = document.querySelector('.quiz');
    const passTestButton = document.querySelector('.pass-test__button');
    const form = document.querySelector('.quiz-body__form');
    const formItems = form.querySelectorAll('fieldset');
    const btnsNext = form.querySelectorAll('.form-button__btn-next');
    const btnsPrev = form.querySelectorAll('.form-button__btn-prev');
    
    //переход к следующему или предыдущему слайдам
    btnsNext.forEach((btn, btnIndex) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();

            formItems[btnIndex].style.display = 'none';
            formItems[btnIndex + 1].style.display = 'block';
        });
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

        if(formItemIndex !== formItem.length - 1) {
            const inputs = formItem.querySelectorAll('input');

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

    overlay.style.display = "none";    
    quiz.style.display = "none"; 
    
    passTestButton.addEventListener('click', () => {
        overlay.style.display = "block";    
        quiz.style.display = "block"; 
    });
});

