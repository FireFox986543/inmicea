class Card {
    constructor() {
        this.id = generateUUIDv4();
    }
    clone() {
        return new HTMLDataCard();
    }

    static renderCardToolbar(t, hasTools, nesting = { id: null, list: null }) {
        return `<div class="card-toolbar">
                <div class="title-wrapper">
                    <h4><i class="fas ${t.icon}"></i> &nbsp;&nbsp; ${t.cardTitle}</h4>
                </div>
                <div class="card-right">
                    ${hasTools ? `<button type="button" class="control-btn tooltip" tooltip-text="Move down" onclick="moveCard('${t.id}', -1, '${nesting.id}', '${nesting.list}')"><i class="fas fa-angle-down"></i></button>
                    <button type="button" class="control-btn tooltip" tooltip-text="Move up" onclick="moveCard('${t.id}', 1, '${nesting.id}', '${nesting.list}')"><i class="fas fa-angle-up"></i></button>
                    <button type="button" class="control-btn tooltip" tooltip-text="Duplicate card" onclick="dupeCard('${t.id}', '${nesting.id}', '${nesting.list}')"><i class="fas fa-copy"></i></button>
                    <button type="button" class="control-btn danger-btn tooltip" tooltip-text="Delete card" onclick="deleteCard('${t.id}', '${nesting.id}', '${nesting.list}')"><i class="fas fa-trash-can"></i></button>` : ''}
                </div>
            </div>`
    }
    static renderTextField(t, label, dataHook, nesting = { id: null, list: null }) {
        return `<div class="card-field">
                <label>${label}:</label>
                <input type="text" oninput="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')" value="${t[dataHook]}">
            </div>`;
    }
    static renderColorField(t, label, dataHook, nesting = { id: null, list: null }) {
        return `<div class="card-field">
                <label>${label}:</label>
                <input type="color" oninput="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')" value="${t[dataHook]}">
            </div>`;
    }
    static renderDropdown(t, label, dataHook, options, nesting = { id: null, list: null }) {
        let optHTML = '';
        options.forEach(([v, t]) => {
            optHTML += `<option value="${v}">${t}</option>`;
        });

        return `<div class="card-field">
                <label>${label}:</label>
                <select onchange="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')">
                    ${optHTML}
                </select>
            </div>`;
    }

    static renderInfoTo(str, info) {
        return str.substring(0, str.length - 6) + `<div class="tooltip tooltip-left info" tooltip-text="${info}">
                    <i class="far fa-circle-info"></i>
            </div>
            </div>`;
    }
}

class HTMLDataCard extends Card {
    constructor() {
        super();
        this.cardTitle = 'HTML Data Card';
        this.icon = 'fa-gear';

        this.webpageLanguage = 'en';
        this.webpageTitle = 'My first webpage';
        this.webpageAuthor = "It's me";
    }
    clone() {
        const n = new HTMLDataCard();
        n.webpageLanguage = this.webpageLanguage;
        n.webpageTitle = this.webpageTitle;
        n.webpageAuthor = this.webpageAuthor;

        return n;
    }

    render() {
        return `<div class="card">
                ${Card.renderCardToolbar(this, false)}
                <div class="card-content">
                    ${Card.renderInfoTo(Card.renderDropdown(this, 'Webpage language', 'webpageLanguage', [['en', 'English'], ['hu', 'Hungarian']]), 'This is the language of your webpage, this will influence built-in cards like the contact form')}
                    ${Card.renderTextField(this, 'Webpage title', 'webpageTitle')}
                    ${Card.renderTextField(this, 'Webpage author', 'webpageAuthor')}
                </div>
            </div>`;
    }
}
class CSSDataCard extends Card {
    constructor() {
        super();
        this.cardTitle = 'CSS Data Card';
        this.icon = 'fa-paint-brush';

        this.backgroundColor = '#2c2c2c';
        this.primaryColor = '#e31515';
        this.secondaryColor = '#16a8a6';
        this.fontFamily = 'Inter';
    }
    clone() {
        const n = new CSSDataCard();
        n.backgroundColor = this.backgroundColor;
        n.primaryColor = this.primaryColor;
        n.secondaryColor = this.secondaryColor;
        n.fontFamily = this.fontFamily;

        return n;
    }

    render() {
        return `<div class="card">
                ${Card.renderCardToolbar(this, false)}
                <div class="card-content">
                    ${Card.renderColorField(this, 'Background', 'backgroundColor')}
                    ${Card.renderColorField(this, 'Primary', 'primaryColor')}
                    ${Card.renderColorField(this, 'Secondary', 'secondaryColor')}
                    ${Card.renderDropdown(this, 'Font family', 'fontFamily', [['Inter', 'Inter'], ['Arial', 'Arial'], ['Times New Roman', 'Times New Roman']])}
                </div>
            </div>`;
    }
}
class HTMLNavigationCard extends Card {
    constructor() {
        super();
        this.cardTitle = 'HTML Naviagation Card';
        this.icon = 'fa-transmission';
        this.leftNesting = { id: this.id, list: 'leftCards' };
        this.rightNesting = { id: this.id, list: 'rightCards' };

        this.leftCards = [];
        this.rightCards = [];
    }
    clone() {
        const n = new HTMLNavigationCard();

        return n;
    }

    render() {
        let leftInner = '';
        this.leftCards.forEach(c => leftInner += c.render());
        let rightInner = '';
        this.rightCards.forEach(c => rightInner += c.render());

        return `<div class="card">
                ${Card.renderCardToolbar(this, false)}
                <div class="card-content">
                    <div class="card-field card-field-nested">
                        <div class="nested-card-container">
                            <div class="nested-top">
                                <h4>Left side</h4>
                                <button type="button" class="control-btn tooltip" tooltip-text="Add new card" onclick="addCardTo('${this.id}', 'leftCards', new HTMLNavmenuCard({ id: '${this.id}', list: 'leftCards'}))"><i class="fas fa-plus"></i></button>
                            </div>
                            <div class="left-cards card-container">
                                ${leftInner}
                            </div>
                        </div>
                        <div class="nested-card-container">
                            <div class="nested-top">
                                <h4>Right side</h4>
                                <button type="button" class="control-btn tooltip" tooltip-text="Add new card" onclick="addCardTo('${this.id}', 'rightCards', new HTMLNavmenuCard({ id: '${this.id}', list: 'rightCards'}))"><i class="fas fa-plus"></i></button>
                            </div>
                            <div class="right-cards card-container">
                                ${rightInner}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
}
class HTMLNavmenuCard extends Card {
    constructor(nesting) {
        super();
        this.cardTitle = 'Navigation item';
        this.icon = 'fa-caret-down';

        this.menuName = 'Menu1';

        this.nesting = nesting;
    }
    clone() {
        const n = new HTMLNavmenuCard();
        n.menuName = this.menuName;
        n.nesting = this.nesting;
        return n;
    }

    render() {
        return `<div class="card">
                ${Card.renderCardToolbar(this, true, this.nesting)}
                <div class="card-content">
                    <div class="card-field card-field-nested">
                        ${Card.renderTextField(this, 'Menu name', 'menuName', this.nesting)}
                    </div>
                </div>
            </div>`;
    }
}