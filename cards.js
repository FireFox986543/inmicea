class Card {
    constructor(nesting) {
        this.id = generateUUIDv4();
        this.nesting = nesting;
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
                <label style="align-self: flex-start;">${label}:</label>
                <textarea class="vertical-resize" style="height: 100px" oninput="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')">${t[dataHook]}</textarea>
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
                    <label style="align-self: flex-start;">${label}:</label>
                    <div class="image-box">
                        <img src="${t[dataHook]}" alt="Image" data-hook="${dataHook}">
                    </div>
                    <input type="text" oninput="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')" value="${t[dataHook]}">
                </div>`;
    }

    static renderAddButton(t, options) {
        let inner = '';
        options.forEach(([name, icon, code]) => inner += `<div class="selector-option" onclick="${code}; renderCards();"><i class="fas ${icon}"></i> ${name}</div>`)

        return `<button type="button" class="control-btn selector-btn">
                    <i class="fas fa-plus"></i>
                    <div class="card-selector-wrapper">
                        <div class="card-selector">
                            ${inner}
                        </div>
                    </div>
                </button>`
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
                            <div class="card-container">
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
                            <div class="card-container">
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
        super(nesting);
        this.cardTitle = 'Navigation item';

        this.type = 'simple';
        this.menuName = 'Menu1';
        this.destination = 'index.html';

        this.subCards = [];
    }
    get icon() { return this.type === 'dropdown' ? 'fa-list-dropdown' : 'fa-diagram-cells'; }
    clone() {
        const n = new HTMLNavmenuCard(this.nesting);
        n.menuName = this.menuName;

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
                                <div class="card-container">
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
                    ${Card.renderTextareaField(this, 'Description', 'description')}
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
        this.imageSize = 'normal';

        this.contentCards = [];
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
        let contentInner = '';
        this.contentCards.forEach(c => contentInner += c.render());

        let imageInner = '';
        this.imageCards.forEach(c => imageInner += c.render());

        return `<div class="card" data-id="${this.id}">
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderTextField(this, 'Heading', 'heading')}
                    <div class="card-field card-field-nested">
                        <div class="nested-card-container">
                            <div class="nested-top">
                                <h4>Section content</h4>
                                <button type="button" class="control-btn tooltip" tooltip-text="Add new card">
                                ${Card.renderAddButton(this, [
                                    ['Paragraph', 'fa-section', `addCardIntoList('${this.id}', 'contentCards', new ParagraphCard({ id: '${this.id}', list: 'contentCards' }));`],
                                    ['List', 'fa-list-ul', `addCardIntoList('${this.id}', 'contentCards', new ListCard({ id: '${this.id}', list: 'contentCards' }));`]
                            ])}
                            </div>
                            <div class="card-container">
                                ${contentInner}
                            </div>
                        </div>
                    </div>
                    ${Card.renderDropdown(this, 'Image type', 'imageType', [['none', 'None'], ['bottom', 'Bottom'], ['side', 'Side']])}
                    ${
                        this.imageType === 'none' ? ''
                        : (
                    `${Card.renderDropdown(this, 'Image size', 'imageSize', [['small', 'Small'], ['normal', 'Normal'], ['large', 'Large']])}
                    <div class="card-field card-field-nested">
                        <div class="nested-card-container">
                            <div class="nested-top">
                                <h4>Image list</h4>
                                <button type="button" class="control-btn tooltip" tooltip-text="Add new card" onclick="addCardIntoList('${this.id}', 'imageCards', new ImageCard({ id: '${this.id}', list: 'imageCards' }))"><i class="fas fa-plus"></i></button>
                            </div>
                            <div class="card-container">
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
        super(nesting);
        this.cardTitle = 'Paragraph Card';
        this.icon = 'fa-paragraph';

        this.text = 'Lorem ipsum dolor sit amet, went amen at one point :P';
    }
    clone() {
        const n = new ParagraphCard(this.nesting);
        n.text = this.text;

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
class ListCard extends Card {
    constructor(nesting) {
        super(nesting);
        this.cardTitle = 'List Card';
        this.icon = 'fa-list-ul';

        this.type = 'ul';
        this.elements = 'First item\nSecond item\nThird item...';
    }
    clone() {
        const n = new ListCard(this.nesting);
        n.elements = this.elements;

        return n;
    }

    render() {
        return `<div class="card" data-id="${this.id}">
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderDropdown(this, 'Type', 'type', [['ul', 'Unordered'], ['ol', 'Ordered']])}
                    ${Card.renderTextareaField(this, 'Elements', 'elements')}
                </div>
            </div>`;
    }
}
class ImageCard extends Card {
    constructor(nesting) {
        super(nesting);
        this.cardTitle = 'Image Card';
        this.icon = 'fa-image';

        this.image = '';
    }
    clone() {
        const n = new ImageCard(this.nesting);
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

class ContactInfoCard extends Card {
    constructor() {
        super();
        this.cardTitle = 'Contact Info Card';
        this.icon = 'fa-id-card';

        this.googleMapsLink = '';

        this.contentCards = [];
    }
    clone() {
        const n = new ContactInfoCard();
        n.googleMapsLink = this.googleMapsLink;

        return n;
    }

    render() {
        let contentInner = '';
        this.contentCards.forEach(c => contentInner += c.render());

        return `<div class="card" data-id="${this.id}">
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderTextField(this, 'Google maps', 'googleMapsLink')}
                    <div class="card-field card-field-nested">
                        <div class="nested-card-container">
                            <div class="nested-top">
                                <h4>Contact infos</h4>
                                <button type="button" class="control-btn tooltip" tooltip-text="Add new card">
                                <button type="button" class="control-btn tooltip" tooltip-text="Add new card" onclick="addCardIntoList('${this.id}', 'contentCards', new ContactElementCard({ id: '${this.id}', list: 'contentCards'}))"><i class="fas fa-plus"></i></button>
                            </div>
                            <div class="card-container">
                                ${contentInner}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
}
class ContactElementCard extends Card {
    constructor(nesting) {
        super(nesting);
        this.cardTitle = 'Contact Element Card';
        this.icon = 'fa-at';

        this.type = 'email';
        this.text = '';
    }
    clone() {
        const n = new ContactElementCard(this.nesting);
        n.type = this.type;
        n.text = this.text;

        return n;
    }

    render() {
        return `<div class="card" data-id="${this.id}">
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderDropdown(this, 'Type', 'type', [
                        ['email', 'Email'],
                        ['location', 'Location'],
                        ['telephone', 'Telephone'],
                        ['facebook', 'Facebook'],
                        ['youtube', 'YouTube'],
                        ['twitter', 'Twitter'],
                        ['instagram', 'Instagram'],
                    ])}
                    ${Card.renderTextField(this, 'Text', 'text')}
                </div>
            </div>`;
    }
}