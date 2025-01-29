function disableDragAndDrop() {
    const objects = document.querySelectorAll('.object');
    objects.forEach((object) => {
        object.classList.remove('mouse-event-allowed');
    })

    const draggableElements = document.querySelectorAll('.object img');
    draggableElements.forEach((element) => {
        element.classList.remove('mouse-event-allowed');
    });
}

function createPlaceholderForMovedElement(movedObject) {
    // Создаем новый пустой div
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder';

    // Копируем размеры и отступы перемещенного элемента
    const movedObjectStyles = getComputedStyle(movedObject);
    placeholder.style.width = movedObjectStyles.width;
    placeholder.style.marginLeft = movedObjectStyles.marginLeft;
    placeholder.style.marginTop = movedObjectStyles.marginTop;

    // return movedObjectParentNode.insertBefore(placeholder, movedObject.nextSibling);
    return placeholder;
}

function createDynamicHtml() {
    const objectsGroups = [
        [
            { imgSrc: 'assets/images/wine.png', imgClass: 'wine', imgAlt: 'wine',  marginLeft: '20px'},
            { imgSrc: 'assets/images/milk.png', imgClass: 'milk', imgAlt: 'milk',  marginLeft: '7px'},
            { imgSrc: 'assets/images/jam.png', imgClass: 'jam', imgAlt: 'jam', marginLeft: '7px'},
            { imgSrc: 'assets/images/cheese.png', imgClass: 'cheese', imgAlt: 'cheese', marginLeft: '7px' }
        ],

        [
            { imgSrc: 'assets/images/meat.png', imgClass: 'meat', imgAlt: 'meat',  marginLeft: '10px'},
            { imgSrc: 'assets/images/chicken.png', imgClass: 'chicken', imgAlt: 'chicken',  marginLeft: '3px'},
            { imgSrc: 'assets/images/chips.png', imgClass: 'chips', imgAlt: 'chips', marginLeft: '3px'},
        ],

        [
            { imgSrc: 'assets/images/pineapple.png', imgClass: 'pineapple', imgAlt: 'pineapple',  marginLeft: '15px'},
            { imgSrc: 'assets/images/bananas.png', imgClass: 'bananas', imgAlt: 'bananas',  marginLeft: '7px'},
            { imgSrc: 'assets/images/apple.png', imgClass: 'apple', imgAlt: 'apple', marginLeft: '9px'},
            { imgSrc: 'assets/images/salad.png', imgClass: 'salad', imgAlt: 'salad', marginLeft: '8px' }
        ]
    ]

    const productContainer = document.querySelector('.product-container')
    objectsGroups.forEach((objects, index) => {
        // Создаем контейнер для объектов
        const container = document.createElement('div');
        // Задаем css правила для разных полок
        container.className = 'container';
        if (index === 0) {
            container.style.alignItems = 'flex-end';
            container.style.top = '0';
        }
        if (index === 1) {
            container.style.alignItems = 'flex-start';
            container.style.top = '10px';
        }
        if (index === 2) {
            container.style.alignItems = 'flex-end';
            container.style.top = '25px';
        }
        const sectionDivider = document.createElement('img');
        sectionDivider.className = index < 2 ? 'section-divider' : 'footer-image';
        sectionDivider.alt = 'footer-image';
        sectionDivider.src = index < 2 ? 'assets/images/section-divider.svg' : 'assets/images/footer-image.svg';

        const highlightBar = document.createElement('div');
        highlightBar.className = index < 2 ? 'highlight-bar' : 'gray-separator';

        const section = document.createElement('div');
        section.className = 'section'

        section.appendChild(container)
        section.appendChild(sectionDivider)
        section.appendChild(highlightBar)
        if (index < 2) {
            const darkBar = document.createElement('div');
            darkBar.className = 'dark-bar';
            section.appendChild(darkBar)
        }
        // Позиционируем полку
        if (index === 0) {
            section.style.top = '0';
        }
        if (index === 1) {
            section.style.top = '150px';
        }
        if (index === 2) {
            section.style.top = '225px';
        }

        let maxHeight = 0; // Переменная для хранения максимальной высоты элемента
        let imagesLoadedCount = 0; // Счетчик загруженных изображений

        // Проходимся по массиву объектов и создаем соответствующий HTML
        objects.forEach((object) => {
            const objectDiv = document.createElement('div');
            objectDiv.className = 'object';
            const img = document.createElement('img');
            img.setAttribute('loading', 'lazy');
            img.src = object.imgSrc;
            img.alt = object.imgAlt;
            img.classList.add(object.imgClass);
            img.classList.add('mouse-event-allowed')

            // Устанавливаем стили для каждого объекта
            objectDiv.style.marginLeft = object.marginLeft;
            objectDiv.style.padding = 0;
            objectDiv.classList.add('mouse-event-allowed')

            objectDiv.appendChild(img);
            container.appendChild(objectDiv);
            let parentNode = null;

            // Добавляем функциональность Drag & Drop
            img.addEventListener('dragstart', (event) => {
                parentNode = event.target.parentNode
                parentNode.insertBefore(createPlaceholderForMovedElement(event.target), event.target)
                parentNode.style.opacity = 0
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', object.imgClass);
            });

            img.addEventListener('dragend', (event) => {
                parentNode.style.opacity = 1
            })

            // Ждем загрузки изображения
            img.onload = () => {
                imagesLoadedCount++;
                // Определяем максимальную высоту элемента
                const computedStyle = window.getComputedStyle(img);
                const heightString = computedStyle.height.replace('px', '');
                const height = parseInt(heightString);
                if (height > maxHeight) {
                    maxHeight = height;
                }
                // Если все изображения загружены, устанавливаем высоту контейнера
                if (imagesLoadedCount === objects.length) {
                    container.style.height = `${maxHeight}px`;
                }
            };
        });
        // Вставляем созданный контейнер в тело документа
        productContainer.appendChild(section);
    })

    // Получаем ссылку на корзину
    const basketGroup = document.querySelector('.basket-group');

    // Создаем контейнер для перетаскиваемых элементов
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'basket-items';
    basketGroup.appendChild(itemsContainer);
    basketGroup.classList.add('mouse-event-allowed')

    // Обработчик события для корзины
    basketGroup.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    basketGroup.addEventListener('drop', (event) => {
        event.preventDefault();
        const className = event.dataTransfer.getData('text/plain'); // Получаем переданный класс

        // Находим элемент с соответствующим классом и перемещаем его в корзину
        const elementToMove = document.querySelector(`.${className}`);
        if (elementToMove) {
            itemsContainer.appendChild(elementToMove);
            elementToMove.classList.remove('mouse-event-allowed');

            // Проверяем количество дочерних элементов в itemsContainer
            if (itemsContainer.childElementCount === 3) {
                // Делаем кнопку visible и заставляем мерцать
                const purchaseButton = document.querySelector('.purchased-button');
                purchaseButton.style.opacity = '1';
                purchaseButton.classList.add('blink-button')

                disableDragAndDrop();
            }
        }
    });

    // Вешаем на кнопку функционал
    document.querySelector('.purchased-button').addEventListener('click', (event) => {
        if (itemsContainer.childElementCount < 3) return
        console.log('Кнопка была нажата. ');
        window.location.href = 'https://lavka.yandex.ru';
    });

    document.onselectstart = function() { return false; };
}

document.addEventListener('DOMContentLoaded', createDynamicHtml);