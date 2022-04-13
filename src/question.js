export class Question {
    static create(question) {
        return fetch('https://podcast-app-1683a-default-rtdb.europe-west1.firebasedatabase.app/questions.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(response => {
            question.id = response.name
            return question
        })
        .then(addToLocalStorage)
        .then(Question.renderList)
    }

    static fetch(token) {
        if (!token) {
            return Promise.resolve('<p class="error">У вас нет доступа</p>')
        }
        return fetch(`https://podcast-app-1683a-default-rtdb.europe-west1.firebasedatabase.app/questions.json?auth=${token}`)
            .then(response => response.json())
            .then(response => {
                if (response && response.error) {
                    return `<p class="error">У вас нет доступа</p>`
                }

                return response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id: key
                })) : []
            })
    }

    static renderList() {
        const questions = getQuestionsFromLocalStorage()

        const html = questions.length
            ? questions.map(toCard).join('') 
            : `<div class="mui--text-headline">Вы еще ничего не спрашивали</div>`

        const list = document.getElementById('list')
        list.innerHTML = html

        if(questions.length) {
            const clearBtn = document.getElementById('clearBtn')
            clearBtn.innerHTML = generateClearBtn()
            const clickClearBtn = document.getElementById('clickClearBtn')
            clickClearBtn.addEventListener('click', clearLocalStorage)
        }

        // if(questions.length) {
        //     const clearBtn = document.getElementById('clearBtn')
        //     clearBtn.innerHTML = generateClearBtn()
        //     const clickClearBtn = document.getElementById('clickClearBtn')
        //     clickClearBtn.addEventListener('click', localStorage.clear)
        // }
    }

    static listToHTML(questions) {
        return questions.length
            ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
            : `<p>Вопросов пока нет</p>`
    }
}

function addToLocalStorage(question) {
    const all = getQuestionsFromLocalStorage()
    all.push(question)
    localStorage.setItem('question', JSON.stringify(all))
}

function getQuestionsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('question') || '[]')
}

function toCard(question) {
    return `
        <div class="mui--text-black-54">
            ${new Date(question.date).toLocaleDateString()}
        ${new Date(question.date).toLocaleTimeString()}
        </div>
        <div>${question.text}</div>
        <br>
    `
}

function generateClearBtn() {
    return `
    <button
        type="click"
        class="mui-btn mui-btn--raised mui-btn--primary"
        id="clickClearBtn"
    >
        Очистить список вопросов
    </button>
    `
}


function clearLocalStorage() {
    localStorage.clear()
    location.reload()
}