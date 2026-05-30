import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);
    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы

    if(Array.isArray(before)){
        [...before].reverse().forEach(templateId => {
            root[templateId] = cloneTemplate(templateId);
            root.container.prepend(root[templateId].container);
        })
    }
    if(Array.isArray(after)){
        after.forEach(templateId => {

            root[templateId] = cloneTemplate(templateId);
            root.container.append(root[templateId].container);
        })
    }
    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', (event) => {
        onAction();
    })
    root.container.addEventListener('reset', (event) => {
        setTimeout(onAction);
    })
    root.container.addEventListener('submit', (event) => {
        event.preventDefault();
        onAction(event.submitter)
    })

    
    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate)
            Object.keys(item).forEach(key => {
                if(row.elements.hasOwnProperty(key)){
                    row.elements[key].textContent = item[key];
                }
            })
            return row.container;
     })
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}