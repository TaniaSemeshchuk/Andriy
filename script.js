let signs = ['+', '-', '*'];
let container_main = document.querySelector('.main');
let container_start = document.querySelector('.start');
let container_start_h3 = container_start.querySelector('h3');
let question_field = document.querySelector('.question');
let answer_buttons = document.querySelectorAll('.answer');
let start_button = document.querySelector('.start-btn');
let next_button = document.querySelector('.next-btn');
let feedback = document.querySelector('.feedback');
let current_question_number = 0;


let cookie = false;
let cookies = document.cookie.split('; ');

for (let i = 0; i < cookies.length; i += 1) {
    if (cookies[i].split('=')[0] == 'numbers_high_score') {
        cookie = cookies[i].split('=')[1];
        break;
    }
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

if (cookie) {
    let data = cookie.split('/');
    container_start_h3.innerHTML = `<h3>Минулого разу ви дали ${data[1]} правильних відповідей із ${data[0]}. Точність - ${Math.round(data[1] * 100 / data[0])}%.</h3>`;
}

function randint(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function getRandomSign() {
    return signs[randint(0, 2)];
}

class Question {
    constructor() {
        let a = randint(1, 30);
        let b = randint(1, 30);
        let sign = getRandomSign();
        this.question = `${a} ${sign} ${b}`;
        if (sign == '+') {
            this.correct = a + b;
        } else if (sign == '-') {
            this.correct = a - b;
        } else if (sign == '*') {
            this.correct = a * b;
        }
        this.answers = new Set();
        this.answers.add(this.correct);
        while (this.answers.size < 5) {
            let wrongAnswer = randint(this.correct - 20, this.correct + 20);
            if (wrongAnswer !== this.correct) {
                this.answers.add(wrongAnswer);
            }
        }
        this.answers = Array.from(this.answers);
        shuffle(this.answers);
    }

    display() {
        question_field.innerHTML = this.question;
        for (let i = 0; i < this.answers.length; i += 1) {
            answer_buttons[i].innerHTML = this.answers[i];
        }
        feedback.style.display = 'none'; // Hide feedback initially
    }
}

let current_question;
let correct_answers_given;
let total_answers_given;
const total_questions = 10; // Total number of questions to be asked

start_button.addEventListener('click', function () {
    container_main.style.display = 'flex';
    container_start.style.display = 'none';
    current_question = new Question();
    current_question.display();

    // Скидання лічильника запитань
    current_question_number = 1; // Починаємо з 1
    document.getElementById('current-question-number').innerText = current_question_number;

    correct_answers_given = 0;
    total_answers_given = 0;

    // Показати кнопку "Наступне питання"
    next_button.style.display = 'none'; // Сховати спочатку
});


for (let i = 0; i < answer_buttons.length; i += 1) {
    answer_buttons[i].addEventListener('click', function () {
        // Reset colors for all buttons before the new answer
        answer_buttons.forEach(button => button.style.background = '#E1F5FE');

        if (parseInt(answer_buttons[i].innerHTML) === current_question.correct) {
            correct_answers_given += 1;
            answer_buttons[i].style.background = '#00FF00'; // Green for correct
        } else {
            answer_buttons[i].style.background = '#FF0000'; // Red for incorrect
            feedback.innerHTML = `Правильна відповідь: ${current_question.correct}`; // Show correct answer
            feedback.style.display = 'block'; // Show feedback
        }

        // Add animation color
        anime({
            targets: answer_buttons[i],
            background: '#E1F5FE',
            duration: 500,
            delay: 100,
            easing: 'linear'
        });

        total_answers_given += 1;
        next_button.style.display = 'block'; // Show the Next Question button

        // Check if the total questions reached
        if (total_answers_given >= total_questions) {
            endGame();
        }
    });
}

next_button.addEventListener('click', function () {
    next_button.style.display = 'none'; // Сховати кнопку "Наступне"
    feedback.style.display = 'none'; // Сховати фідбек для нового запитання
    
    // Генерувати і відображати нове запитання
    current_question = new Question();
    current_question.display();

    // Оновити номер запитання
    current_question_number++;
    document.getElementById('current-question-number').innerText = current_question_number;
});

function endGame() {
    container_main.style.display = 'none';
    container_start.style.display = 'flex';

    // Calculate accuracy
    let accuracy = total_answers_given > 0 ? Math.round((correct_answers_given * 100) / total_answers_given) : 0;
    let new_cookie = `numbers_high_score=${correct_answers_given}/${total_answers_given}; max-age=10000000000`;
    document.cookie = new_cookie;

    container_start_h3.innerHTML = `<h3>Гра закінчена! Ви дали ${correct_answers_given} правильних відповідей із ${total_answers_given}. Точність - ${accuracy}%.</h3>`;
}
