import {createComparison, defaultRules} from "../lib/compare.js";

const compare = createComparison(defaultRules);

function prepareFilterState(state) {
    const filterState = {...state};
    const {totalFrom, totalTo} = filterState;

    if (totalFrom || totalTo) {
        filterState.total = [totalFrom, totalTo];
    }

    delete filterState.totalFrom;
    delete filterState.totalTo;

    return filterState;
}
export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                                    // Получаем ключи из объекта
      .forEach((elementName) => {                        // Перебираем по именам
        if (!elements[elementName]) {
            return;
        }
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                      .map(name => {                        // используйте name как значение и текстовое содержимое
                        const option = document.createElement('option');
                            
                        option.value = name;
                        option.textContent = name;
                        
                        return option;              // @todo: создать и вернуть тег опции
                      })
        )
     })
    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
        
            const inputFilter = action.parentElement.querySelector('input, select');
        
            if (inputFilter) {
                inputFilter.value = '';
            }
        
            state[field] = '';
        }

        return data.filter(row => compare(row, prepareFilterState(state)));
    }
}