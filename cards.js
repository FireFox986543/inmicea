class Card {
    constructor() {
        this.id = generateUUIDv4();
    }
    clone() {
        return new HTMLDataCard();
    }
    onPropertyUpdate(hook, value) { }

    static renderCardToolbar(t, hasTools) {
        const nesting = Card.getNestingFromCard(t);
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
    static renderTextField(t, label, dataHook) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-field">
                <label>${label}:</label>
                <input type="text" oninput="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')" value="${t[dataHook]}">
            </div>`;
    }
    static renderTextareaField(t, label, dataHook) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-field expandable">
                <label>${label}:</label>
                <textarea class="vertical-resize" oninput="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')">${t[dataHook]}</textarea>
            </div>`;
    }
    static renderColorField(t, label, dataHook) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-field">
                <label>${label}:</label>
                <input type="color" oninput="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')" value="${t[dataHook]}">
            </div>`;
    }
    static renderDropdown(t, label, dataHook, options) {
        const nesting = Card.getNestingFromCard(t);
        const selected = t[dataHook];
        let optHTML = '';
        options.forEach(([v, t]) => {
            optHTML += `<option value="${v}" ${v === selected ? 'selected' : ''}>${t}</option>`;
        });

        return `<div class="card-field">
                <label>${label}:</label>
                <select onchange="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')">
                    ${optHTML}
                </select>
            </div>`;
    }
    static renderImageField(t, label, dataHook) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-field expandable">
    <label>${label}:</label>
    <div class="image-box">
        <img src="" alt="Image" data-hook="${dataHook}">
    </div>
    <input type="text" oninput="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')" value="${t[dataHook]}">
</div>`;
    }

    static getNestingFromCard(card) {
        return card.nesting || { id: null, list: null };
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
        return `<div class="card" data-id="${this.id}">
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
        return `<div class="card" data-id="${this.id}">
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
        this.cardTitle = 'HTML Navigation Card';
        this.icon = 'fa-transmission';

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

        return `<div class="card" data-id="${this.id}">
                ${Card.renderCardToolbar(this, false)}
                <div class="card-content">
                    <div class="card-field card-field-nested">
                        <div class="nested-card-container">
                            <div class="nested-top">
                                <h4>Left side</h4>
                                <button type="button" class="control-btn tooltip" tooltip-text="Add new card" onclick="addCardIntoList('${this.id}', 'leftCards', new HTMLNavmenuCard({ id: '${this.id}', list: 'leftCards', level: 0}))"><i class="fas fa-plus"></i></button>
                            </div>
                            <div class="left-cards card-container">
                                ${leftInner}
                            </div>
                        </div>
                    </div>
                    <div class="card-field card-field-nested">
                        <div class="nested-card-container">
                            <div class="nested-top">
                                <h4>Right side</h4>
                                <button type="button" class="control-btn tooltip" tooltip-text="Add new card" onclick="addCardIntoList('${this.id}', 'rightCards', new HTMLNavmenuCard({ id: '${this.id}', list: 'rightCards', level: 0}))"><i class="fas fa-plus"></i></button>
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

        this.type = 'simple';
        this.menuName = 'Menu1';
        this.destination = 'index.html';

        this.nesting = nesting;
        this.subCards = [];
    }
    get icon() { return this.type === 'dropdown' ? 'fa-list-dropdown' : 'fa-diagram-cells'; }
    clone() {
        const n = new HTMLNavmenuCard();
        n.menuName = this.menuName;
        n.nesting = this.nesting;
        return n;
    }
    onPropertyUpdate(hook, value) {
        if (hook === 'type')
            renderCards();
    }

    get nestingLastLevel() { return this.nesting.level && this.nesting.level >= 2; }

    render() {
        let subInner = '';
        this.subCards.forEach(c => subInner += c.render());

        return `<div class="card" data-id="${this.id}">
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${this.nestingLastLevel ? '' : Card.renderDropdown(this, 'Menu type', 'type', [['simple', 'Simple'], ['dropdown', 'Dropdown']])}
                    ${Card.renderTextField(this, 'Menu name', 'menuName')}
                    ${this.type === 'simple' ?
                (Card.renderTextField(this, 'Destination', 'destination'))
                : (
                    `<div class="card-field card-field-nested">
                        <div class="nested-card-container">
                                <div class="nested-top">
                                    <h4>Submenus</h4>
                                    <button type="button" class="control-btn tooltip" tooltip-text="Add new card" onclick="addCardIntoList('${this.id}', 'subCards', new HTMLNavmenuCard({ id: '${this.id}', list: 'subCards', level: ${this.nesting.level + 1}}))"><i class="fas fa-plus"></i></button>
                                </div>
                                <div class="sub-cards card-container">
                                    ${subInner}
                                </div>
                            </div>
                        </div>`
                )}
                </div>
            </div>`;
    }
}

class HeaderCard extends Card {
    constructor() {
        super();
        this.cardTitle = 'Header Card';
        this.icon = 'fa-heading';

        this.title = 'First Webpage';
        this.description = "This is my very new webpage were i'll show you the cutest articles you'll ever see!";
        this.backgroundImg = '';
    }
    clone() {
        const n = new HeaderCard();
        n.title = this.title;
        n.description = this.description;
        n.backgroundImg = this.backgroundImg;

        return n;
    }

    onPropertyUpdate(hook, value) {
        if (hook === 'backgroundImg') {
            const imgElement = document.querySelector(`.card[data-id="${this.id}"] img[data-hook="${hook}"]`);
            console.log(imgElement);
            imgElement.src = value;
        }
    }

    render() {
        return `<div class="card" data-id="${this.id}">
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderTextField(this, 'Title', 'title')}
                    ${Card.renderTextField(this, 'Description', 'description')}
                    ${Card.renderImageField(this, 'Background', 'backgroundImg')}
                </div>
            </div>`;
    }
}
class SectionCard extends Card {
    constructor() {
        super();
        this.cardTitle = 'Section Card';
        this.icon = 'fa-section';

        this.heading = 'Creative chickens';
        this.imageType = 'none';

        this.paragraphCards = [];
        this.imageCards = [];
    }
    clone() {
        const n = new SectionCard();
        n.heading = this.heading;
        n.imageType = this.imageType;

        return n;
    }
    onPropertyUpdate(hook, value) {
        if(hook === 'imageType')
            renderCards();
    }

    render() {
        let paraInner = '';
        this.paragraphCards.forEach(c => paraInner += c.render());

        let imageInner = '';
        this.imageCards.forEach(c => imageInner += c.render());

        return `<div class="card" data-id="${this.id}">
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderTextField(this, 'Heading', 'heading')}
                    <div class="card-field card-field-nested">
                        <div class="nested-card-container">
                            <div class="nested-top">
                                <h4>Paragraphs</h4>
                                <button type="button" class="control-btn tooltip" tooltip-text="Add new card" onclick="addCardIntoList('${this.id}', 'paragraphCards', new ParagraphCard({ id: '${this.id}', list: 'paragraphCards' }))"><i class="fas fa-plus"></i></button>
                            </div>
                            <div class="paragraph-cards card-container">
                                ${paraInner}
                            </div>
                        </div>
                    </div>
                    ${Card.renderDropdown(this, 'Image type', 'imageType', [['none', 'None'], ['bottom', 'Bottom'], ['side', 'Side']])}
                    ${
                        this.imageType === 'none' ? ''
                        : (
                    `<div class="card-field card-field-nested">
                        <div class="nested-card-container">
                            <div class="nested-top">
                                <h4>Image list</h4>
                                <button type="button" class="control-btn tooltip" tooltip-text="Add new card" onclick="addCardIntoList('${this.id}', 'imageCards', new ImageCard({ id: '${this.id}', list: 'imageCards' }))"><i class="fas fa-plus"></i></button>
                            </div>
                            <div class="image-cards card-container">
                                ${imageInner}
                            </div>
                        </div>
                    </div>`
                        )}
                </div>
            </div>`;
    }
}
class ParagraphCard extends Card {
    constructor(nesting) {
        super();
        this.cardTitle = 'Paragraph Card';
        this.icon = 'fa-paragraph';

        this.text = 'Lorem ipsum dolor sit amet, went amen at one point :P';
        this.nesting = nesting;
    }
    clone() {
        const n = new ParagraphCard();
        n.text = this.text;
        n.nesting = this.nesting;

        return n;
    }

    render() {
        return `<div class="card" data-id="${this.id}">
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderTextareaField(this, 'Text', 'text')}
                </div>
            </div>`;
    }
}
class ImageCard extends Card {
    constructor(nesting) {
        super();
        this.cardTitle = 'Image Card';
        this.icon = 'fa-image';

        this.image = '';
        this.nesting = nesting;
    }
    clone() {
        const n = new ImageCard();
        n.image = this.image;

        return n;
    }
    onPropertyUpdate(hook, value) {
        if (hook === 'image') {
            const imgElement = document.querySelector(`.card[data-id="${this.id}"] img[data-hook="${hook}"]`);
            imgElement.src = value;
        }
    }

    render() {
        return `<div class="card" data-id="${this.id}">
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderImageField(this, 'Image', 'image')}
                </div>
            </div>`;
    }
}