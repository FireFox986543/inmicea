class Card {
    constructor(nesting) {
        this.id = generateUUIDv4();
        this.nesting = nesting;
        this.collapsed = false;
        this.category = 'content';
    }
    onPropertyUpdate(hook, value) { }

    static renderCardToolbar(t, hasTools) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-toolbar" onclick="collapseCard(this, '${t.id}')">
                    <div class="title-wrapper">
                        <h4><i class="fas ${t.icon}"></i> &nbsp;&nbsp; ${t.cardTitle}</h4>
                    </div>
                    <div class="card-right">
                        ${hasTools ? `<button type="button" class="control-btn tooltip" tooltip-text="Move down" onclick="event.stopPropagation(); moveCard('${t.id}', -1, '${nesting.id}', '${nesting.list}')"><i class="fas fa-angle-down"></i></button>
                        <button type="button" class="control-btn tooltip" tooltip-text="Move up" onclick="event.stopPropagation(); moveCard('${t.id}', 1, '${nesting.id}', '${nesting.list}')"><i class="fas fa-angle-up"></i></button>
                        <button type="button" class="control-btn tooltip" tooltip-text="Duplicate card" onclick="event.stopPropagation(); dupeCard('${t.id}', '${nesting.id}', '${nesting.list}')"><i class="fas fa-copy"></i></button>
                        <button type="button" class="control-btn danger-btn tooltip" tooltip-text="Delete card" onclick="event.stopPropagation(); deleteCard('${t.id}', '${nesting.id}', '${nesting.list}')"><i class="fas fa-trash-can"></i></button>` : ''}
                    </div>
                </div>`
    }
    static renderHr(text) {
        return `<div class="card-field card-hr">
                    <span>${text}</span>
                </div>`;
    }
    static renderTextField(t, label, dataHook) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-field">
                <label>${label}:</label>
                <input type="text" oninput="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')" value="${t[dataHook]}" onchange="propertyChanged(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')">
            </div>`;
    }
    static renderCheckBox(t, label, dataHook) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-field">
                <button type="button" class="checkbox-btn" value="${t[dataHook]}" onclick="Card.checkboxHelper(this); updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}'); propertyChanged(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')"><i class='far fa-square${t[dataHook] === 'true' ? '-check' : ''}'></i> &nbsp;${label}</button>
            </div>`;
    }
    static renderTextareaField(t, label, dataHook, height = 100) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-field expandable">
                <label style="align-self: flex-start;">${label}:</label>
                <textarea class="vertical-resize" style="height: ${height}px" oninput="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')" onchange="propertyChanged(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')">${t[dataHook]}</textarea>
            </div>`;
    }
    static renderColorField(t, label, dataHook) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-field">
                <label>${label}:</label>
                <input type="color" oninput="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')" onchange="propertyChanged(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')" value="${t[dataHook]}">
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
                <select onchange="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}'); propertyChanged(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')">
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
                    <input type="text" oninput="updateProperty(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')" value="${t[dataHook]}" onchange="propertyChanged(this, '${t.id}', '${nesting.id}', '${nesting.list}', '${dataHook}')">
                </div>`;
    }

    static renderNestedCards(t, label, list, buttonStr) {
        let inner = '';
        t[list].forEach(c => inner += c.render());

        return `<div class="card-field card-field-nested">
                    <div class="nested-card-container ${t[list + '_collapsed'] ? 'collapsed' : ''}">
                        <div class="nested-top" onclick="collapseNestedList(this, '${t.id}', '${list}')">
                            <h4>${label}</h4>
                            ${buttonStr}
                        </div>
                        <div class="card-container">
                            ${inner}
                        </div>
                    </div>
                </div>`;
    }
    static renderAddButtonSingle(t, list, cardType) {
        return `<button type="button" class="control-btn tooltip" tooltip-text="Add new card" onclick="event.stopPropagation(); addCardIntoList('${t.id}', '${list}', new ${cardType}({ id: '${t.id}', list: '${list}' }))"><i class="fas fa-plus"></i></button>`;
    }
    static renderAddButtonMultiple(t, list, options) {
        let inner = '';
        options.forEach(([name, icon, type]) => inner += `<div class="selector-option" onclick="event.stopPropagation(); addCardIntoList('${t.id}', '${list}', new ${type}({ id: '${t.id}', list: '${list}' })); renderCards();"><i class="fas ${icon}"></i> ${name}</div>`)

        return `<button type="button" class="control-btn selector-btn">
                    <i class="fas fa-plus"></i>
                    <div class="card-selector-wrapper">
                        <div class="card-selector">
                            ${inner}
                        </div>
                    </div>
                </button>`
    }

    static beginCard(t) {
        return `<div class="card cat-${t.category} ${t.collapsed ? 'collapsed' : ''}" data-id="${t.id}">`;
    }

    static getNestingFromCard(card) {
        return card.nesting || { id: null, list: null };
    }
    static renderInfoTo(str, info, right = false) {
        return str.substring(0, str.length - 6) + `<div class="tooltip tooltip-${right ? 'right' : 'left'} info" tooltip-text="${info}">
                    <i class="far fa-circle-info"></i>
            </div>
            </div>`;
    }
    static renderExtraTo(str, info) {
        return str.substring(0, str.length - 6) + `${info}</div>`;
    }
    static checkboxHelper(t) {
        t.value = t.value === 'true' ? 'false' : 'true';
        t.parentElement.querySelector('i').classList.toggle('fa-square', t.value === 'false');
        t.parentElement.querySelector('i').classList.toggle('fa-square-check', t.value === 'true');
    }
}

class HTMLDataCard extends Card {
    constructor() {
        super();
        this.cardType = 'HTMLDataCard';
        this.cardTitle = 'HTML Data Card';
        this.icon = 'fa-gear';
        this.category = 'markup';

        this.webpageLanguage = 'en';
        this.webpageTitle = 'My first webpage';
        this.webpageAuthor = "It's me";
    }

    render() {
        return `${Card.beginCard(this)}
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
        this.cardType = 'CSSDataCard';
        this.cardTitle = 'CSS Data Card';
        this.icon = 'fa-paint-brush';
        this.category = 'markup';

        this._themeDONTUSE = 'hello';

        this.backgroundColor = '#202020';
        this.backgroundLighterColor = '#2c2c2c';
        this.backgroundLightestColor = '#3a3a3a';
        this.textColor = '#efefef';
        this.mutedColor = '#b0b0b0';
        this.formText = '#ffffff';
        this.primaryColor = '#0048ff';
        this.secondaryColor = '#00bbff';
        this.darkColor = '#1b1b1b';
        this.darkerColor = '#111111';
        this.navBar = '#1b1b1b';
        this.navBarHover = '#262626';
        this.navText = '#0048ff';
        this.navTextHover = '#00bbff';
        this.navActive = '#ffffff';
        this.navActiveText = '#0048ff';
        this.headingAlign = 'center';
        this.headingText = '#0048ff';
        this.headingVariant = 'small-caps';
        this.fontFamily = 'Inter';
    }
    onPropertyUpdate(hook, value) {
        if (hook === '_themeDONTUSE') {
            // Reset to default value
            this._themeDONTUSE = 'hello';
            const theme = getCSSThemes(value);

            for (const k in theme) {
                if (!Object.hasOwn(theme, k)) continue;

                this[k] = theme[k];
            }

            renderCards();
        }
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, false)}
                    <div class="card-content">
                    ${Card.renderDropdown(this, 'Select theme', '_themeDONTUSE', [['hello', ''], ['dark', 'Dark (Default)'], ['light', 'Light'], ['coffee', 'Coffee'], ['sea', 'Sea'], ['cherry', 'Cherry'], ['mesa', 'Mesa']])}
                    ${Card.renderHr('General colors')}
                    ${Card.renderColorField(this, 'Background', 'backgroundColor')}
                    ${Card.renderColorField(this, 'Background lighter', 'backgroundLighterColor')}
                    ${Card.renderColorField(this, 'Background lightest', 'backgroundLightestColor')}
                    ${Card.renderColorField(this, 'Dark', 'darkColor')}
                    ${Card.renderColorField(this, 'Darker', 'darkerColor')}
                    ${Card.renderColorField(this, 'Primary', 'primaryColor')}
                    ${Card.renderColorField(this, 'Secondary', 'secondaryColor')}
                    ${Card.renderHr('Text')}
                    ${Card.renderColorField(this, 'Text', 'textColor')}
                    ${Card.renderColorField(this, 'Muted text', 'mutedColor')}
                    ${Card.renderColorField(this, 'Form text', 'formText')}
                    ${Card.renderDropdown(this, 'Font family', 'fontFamily', [['Inter', 'Inter'], ['Arial', 'Arial'], ['Times New Roman', 'Times New Roman']])}
                    ${Card.renderHr('Navmenu')}
                    ${Card.renderColorField(this, 'Navmenu background', 'navBar')}
                    ${Card.renderColorField(this, 'Navmenu hover background', 'navBarHover')}
                    ${Card.renderColorField(this, 'Navmenu text', 'navText')}
                    ${Card.renderColorField(this, 'Navmenu hover text', 'navTextHover')}
                    ${Card.renderColorField(this, 'Navmenu active', 'navActive')}
                    ${Card.renderColorField(this, 'Navmenu active text', 'navActiveText')}
                    ${Card.renderHr('Heading')}
                    ${Card.renderColorField(this, 'Heading text', 'headingText')}
                    ${Card.renderDropdown(this, 'Heading align', 'headingAlign', [['left', 'Left'], ['center', 'Center'], ['right', 'Right']])}
                    ${Card.renderDropdown(this, 'Heading variant', 'headingVariant', [['normal', 'Normal'], ['small-caps', 'Smallcaps']])}
                </div>
            </div>`;
    }
}
class HTMLNavigationCard extends Card {
    constructor() {
        super();
        this.cardType = 'HTMLNavigationCard';
        this.cardTitle = 'HTML Navigation Card';
        this.icon = 'fa-transmission';
        this.category = 'markup';

        this.leftCards = [];
        this.leftCards_collapsed = false;
        this.rightCards = [];
        this.rightCards_collapsed = false;
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, false)}
                <div class="card-content">
                    ${Card.renderNestedCards(this, 'Left side', 'leftCards', Card.renderAddButtonSingle(this, 'leftCards', 'HTMLNavmenuCard'))}
                    ${Card.renderNestedCards(this, 'Right side', 'rightCards', Card.renderAddButtonSingle(this, 'rightCards', 'HTMLNavmenuCard'))}
                </div>
            </div>`;
    }
}
class HTMLNavmenuCard extends Card {
    constructor(nesting) {
        super(nesting);
        this.cardType = 'HTMLNavmenuCard';
        this.cardTitle = 'Navigation item';

        this.type = 'simple';
        this.menuName = 'Menu1';
        this.destination = 'index.html';

        this.subCards = [];
        this.subCards_collapsed = false;
    }
    get icon() { return this.type === 'dropdown' ? 'fa-list-dropdown' : 'fa-diagram-cells'; }

    onPropertyUpdate(hook, value) {
        if (hook === 'type')
            renderCards();
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderDropdown(this, 'Menu type', 'type', [['simple', 'Simple'], ['dropdown', 'Dropdown']])}
                    ${Card.renderTextField(this, 'Menu name', 'menuName')}
                    ${this.type === 'simple' ? Card.renderTextField(this, 'Destination', 'destination') : Card.renderNestedCards(this, 'Submenus', 'subCards', Card.renderAddButtonSingle(this, 'subCards', 'HTMLNavmenuCard'))}
                </div>
            </div>`;
    }
}

class HeaderCard extends Card {
    constructor() {
        super();
        this.cardType = 'HeaderCard';
        this.cardTitle = 'Header Card';
        this.icon = 'fa-heading';

        this.title = 'First Webpage';
        this.description = "This is my very new webpage were i'll show you the cutest articles you'll ever see!";
        this.backgroundImg = '';
    }

    onPropertyUpdate(hook, value) {
        if (hook === 'backgroundImg') {
            const imgElement = document.querySelector(`.card[data-id="${this.id}"] img[data-hook="${hook}"]`);
            imgElement.src = value;
        }
    }

    render() {
        return `${Card.beginCard(this)}
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
        this.cardType = 'SectionCard';
        this.cardTitle = 'Section Card';
        this.icon = 'fa-section';

        this.heading = 'Creative chickens';
        this.headingIsTop = 'false';
        this.sectionId = '';
        this.imageType = 'none';
        this.imageSize = 'normal';

        this.contentCards = [];
        this.contentCards_collapsed = false;
        this.imageCards = [];
        this.imageCards_collapsed = false;
    }

    onPropertyUpdate(hook, value) {
        if (hook === 'imageType' || hook === 'imageSize')
            renderCards();
    }
    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderTextField(this, 'Heading', 'heading')}
                    ${Card.renderInfoTo(Card.renderCheckBox(this, 'Display heading at top', 'headingIsTop'), 'Should the header be placed as the first element?', true)}
                    ${Card.renderInfoTo(Card.renderTextField(this, 'Section id', 'sectionId'), 'A unique identifier that can be used for linking navigation links to this section')}
                    ${Card.renderNestedCards(this, 'Section content', 'contentCards', Card.renderAddButtonMultiple(this, 'contentCards', [['Paragraph', 'fa-section', 'ParagraphCard'], ['List', 'fa-list-ul', 'ListCard'], ['Raw HTML', 'fa-file-html', 'RawHTMLCard']]))}
                    ${Card.renderDropdown(this, 'Image type', 'imageType', [['none', 'None'], ['bottom', 'Bottom'], ['top', 'Top'], ['left', 'Left'], ['right', 'Right']])}
                    ${this.imageType === 'none' ? ''
                : (
                    `${['left', 'right'].includes(this.imageType) ? Card.renderDropdown(this, 'Image size', 'imageSize', [['small', 'Small'], ['normal', 'Normal'], ['large', 'Large']]) : ''}
                    ${Card.renderNestedCards(this, 'Image list', 'imageCards', Card.renderAddButtonSingle(this, 'imageCards', 'ImageCard'))}`
                )}
                </div>
            </div>`;
    }
}
class ParagraphCard extends Card {
    constructor(nesting) {
        super(nesting);
        this.cardType = 'ParagraphCard';
        this.cardTitle = 'Paragraph Card';
        this.icon = 'fa-paragraph';

        this.text = 'Lorem ipsum dolor sit amet, went amen at one point :P';
    }

    render() {
        return `${Card.beginCard(this)}
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
        this.cardType = 'ListCard';
        this.cardTitle = 'List Card';
        this.icon = 'fa-list-ul';

        this.type = 'ul';
        this.elements = 'First item\nSecond item\nThird item...';
    }

    render() {
        return `${Card.beginCard(this)}
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
        this.cardType = 'ImageCard';
        this.cardTitle = 'Image Card';
        this.icon = 'fa-image';

        this.alt = '';
        this.image = '';
        this.canBeZoomed = 'true';
    }

    onPropertyUpdate(hook, value) {
        if (hook === 'image') {
            const imgElement = document.querySelector(`.card[data-id="${this.id}"] img[data-hook="${hook}"]`);
            imgElement.src = value;
        }
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderImageField(this, 'Image', 'image')}
                    ${Card.renderTextField(this, 'Alt', 'alt')}
                    ${Card.renderInfoTo(Card.renderCheckBox(this, 'Enable zooming', 'canBeZoomed'), 'Can the user click on it to show a scaled version on screen?', true)}
                </div>
            </div>`;
    }
}

class ContactInfoCard extends Card {
    constructor() {
        super();
        this.cardType = 'ContactInfoCard';
        this.cardTitle = 'Contact Info Card';
        this.icon = 'fa-id-card';

        this.googleMapsLink = '';
        this.sectionId = '';
        this.heading = 'Contact information';
        this.displayDirection = 'horizontal';

        this.contentCards = [];
        this.contentCards_collapsed = false;
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderInfoTo(Card.renderTextField(this, 'Google maps link', 'googleMapsLink'), 'Link used for displaying google maps if required, unless leave empty')}
                    ${Card.renderInfoTo(Card.renderTextField(this, 'Section id', 'sectionId'), 'A unique identifier that can be used for linking navigation links to this section')}
                    ${Card.renderTextField(this, 'Heading', 'heading')}
                    ${Card.renderDropdown(this, 'Display direction', 'displayDirection', [['horizontal', 'Horizontal'], ['vertical', 'Vertical']])}
                    ${Card.renderNestedCards(this, 'Contact infos', 'contentCards', Card.renderAddButtonSingle(this, 'contentCards', 'ContactElementCard'))}
                </div>
            </div>`;
    }
}
class ContactElementCard extends Card {
    constructor(nesting) {
        super(nesting);
        this.cardType = 'ContactElementCard';
        this.cardTitle = 'Contact Element Card';
        this.icon = 'fa-at';

        this.type = 'email';
        this.customIcon = 'fas fa-dollar';
        this.text = '';
        this.name = '';
        this.link = '';
    }

    onPropertyUpdate(hook, value) {
        if (hook === 'type')
            renderCards();
        else if (hook === 'customIcon') {
            const iconEl = document.querySelector(`.card[data-id="${this.id}"] i[data-hook="customIcon"]`);
            iconEl.className = `${value}`;
        }
    }

    render() {
        return `${Card.beginCard(this)}
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
            ['custom', 'Custom']
        ])}
                    ${this.type === 'custom' ? Card.renderInfoTo(Card.renderExtraTo(Card.renderTextField(this, 'Custom icon', 'customIcon'), `<i class="${this.customIcon}" style="margin-left: 8px" data-hook="customIcon"></i>`), 'A font awesome icon key.') : ''}
                    ${Card.renderTextField(this, 'Name', 'name')}
                    ${Card.renderTextField(this, 'Value', 'text')}
                    ${Card.renderInfoTo(Card.renderTextField(this, 'Link', 'link'), "The link used for anchor tags, unless leave empty.")}
                </div>
            </div>`;
    }
}
class ContactFormCard extends Card {
    constructor() {
        super();
        this.cardType = 'ContactFormCard';
        this.cardTitle = 'Contact Form Card';
        this.icon = 'fa-inbox-in';

        this.sectionId = '';
        this.text = 'Get in contact with us!';
        this.name = 'true';
        this.email = 'true';
        this.telephone = 'false';
        this.organization = 'false';
        this.location = 'false';
        this.message = 'true';
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderInfoTo(Card.renderTextField(this, 'Section id', 'sectionId'), 'A unique identifier that can be used for linking navigation links to this section')}
                    ${Card.renderTextField(this, 'Top text', 'text')}
                    ${Card.renderCheckBox(this, 'Has name field', 'name')}
                    ${Card.renderCheckBox(this, 'Has email field', 'email')}
                    ${Card.renderCheckBox(this, 'Has telephone field', 'telephone')}
                    ${Card.renderCheckBox(this, 'Has organization field', 'organization')}
                    ${Card.renderCheckBox(this, 'Has location field', 'location')}
                    ${Card.renderCheckBox(this, 'Has message field', 'message')}
                </div>
            </div>`;
    }
}

class RawHTMLCard extends Card {
    constructor(nesting) {
        super(nesting);
        this.cardType = 'RawHTMLCard';
        this.cardTitle = 'Raw HTML Card';
        this.icon = 'fa-file-html';

        this.html = '<p>Hello World!</p>';
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderTextareaField(this, 'HTML', 'html', 320)}
                </div>
            </div>`;
    }
}

function newCardFromType(type) {
    switch (type) {
        case 'HTMLDataCard': return new HTMLDataCard();
        case 'CSSDataCard': return new CSSDataCard();
        case 'HTMLNavigationCard': return new HTMLNavigationCard();
        case 'HTMLNavmenuCard': return new HTMLNavmenuCard();
        case 'HeaderCard': return new HeaderCard();
        case 'SectionCard': return new SectionCard();
        case 'ParagraphCard': return new ParagraphCard();
        case 'ListCard': return new ListCard();
        case 'ImageCard': return new ImageCard();
        case 'ContactInfoCard': return new ContactInfoCard();
        case 'ContactElementCard': return new ContactElementCard();
        case 'ContactFormCard': return new ContactFormCard();
        case 'RawHTMLCard': return new RawHTMLCard();
        default:
            throw new Error("Failed to construct card from given type: " + type);
    }
}

function getCSSThemes(theme) {
    switch (theme) {
        case 'light':
            return {
                "backgroundColor": "#ffffff",
                "backgroundLighterColor": "#fafafa",
                "backgroundLightestColor": "#f2f2f2",
                "textColor": "#0a0a0a",
                "mutedColor": "#4f4f4f",
                "primaryColor": "#0048ff",
                "secondaryColor": "#00bbff",
                "darkColor": "#0048ff",
                "darkerColor": "#595959",
                "navBar": "#0048ff",
                "navBarHover": "#00bbff",
                "navText": "#ffffff",
                "navTextHover": "#ffffff",
                "navActive": "#ffffff",
                "navActiveText": "#0048ff",
                "headingAlign": "center",
                "headingText": "#0048ff",
                "headingVariant": "small-caps",
                "formText": "#0048ff",
                "fontFamily": "Inter"
            };
        case 'coffee':
            return {
                "backgroundColor": "#d3a26f",
                "backgroundLighterColor": "#ab7e54",
                "backgroundLightestColor": "#b9824b",
                "textColor": "#383029",
                "mutedColor": "#68635e",
                "primaryColor": "#572f0a",
                "secondaryColor": "#522405",
                "darkColor": "#b9824b",
                "darkerColor": "#111111",
                "navBar": "#383029",
                "navBarHover": "#4b3d2a",
                "navText": "#e8dbc9",
                "navTextHover": "#ffffff",
                "navActive": "#ffffff",
                "navActiveText": "#543f2b",
                "headingAlign": "center",
                "headingText": "#594118",
                "headingVariant": "small-caps",
                "formText": "#ffffff",
                "fontFamily": "Inter"
            };
        case 'sea':
            return {
                "backgroundColor": "#001f21",
                "backgroundLighterColor": "#055050",
                "backgroundLightestColor": "#10afaf",
                "textColor": "#d4f2f7",
                "mutedColor": "#afdde5",
                "primaryColor": "#964734",
                "secondaryColor": "#b34719",
                "darkColor": "#055050",
                "darkerColor": "#001f21",
                "navBar": "#055050",
                "navBarHover": "#964734",
                "navText": "#afdde5",
                "navTextHover": "#ffffff",
                "navActive": "#ffffff",
                "navActiveText": "#055050",
                "headingAlign": "center",
                "headingText": "#964734",
                "headingVariant": "small-caps",
                "formText": "#ffffff",
                "fontFamily": "Inter"
            };
        case 'cherry':
            return {
                "backgroundColor": "#ebe9e1",
                "backgroundLighterColor": "#ffa2b6",
                "backgroundLightestColor": "#ffc2ce",
                "textColor": "#e43d12",
                "mutedColor": "#cc3359",
                "primaryColor": "#e43d12",
                "secondaryColor": "#efb11d",
                "darkColor": "#d6536d",
                "darkerColor": "#d6536d",
                "navBar": "#e43d12",
                "navBarHover": "#efb11d",
                "navText": "#ffa2b6",
                "navTextHover": "#ffffff",
                "navActive": "#ffffff",
                "navActiveText": "#e43d12",
                "headingAlign": "center",
                "headingText": "#efb11d",
                "headingVariant": "small-caps",
                "formText": "#ffffff",
                "fontFamily": "Inter"
            };
        case 'mesa':
            return {
                "backgroundColor": "#bc4639",
                "backgroundLighterColor": "#5c2019",
                "backgroundLightestColor": "#5c2019",
                "textColor": "#f2e1db",
                "mutedColor": "#d4a59c",
                "formText": "#ffae00",
                "primaryColor": "#ffae00",
                "secondaryColor": "#ffae00",
                "darkColor": "#5c2019",
                "darkerColor": "#d4a59c",
                "navBar": "#5c2019",
                "navBarHover": "#ffae00",
                "navText": "#f2e1db",
                "navTextHover": "#bc4639",
                "navActive": "#ffae00",
                "navActiveText": "#ffffff",
                "headingAlign": "center",
                "headingText": "#5c2019",
                "headingVariant": "small-caps",
                "fontFamily": "Inter"
            };
        default: // Dark
            return {
                "backgroundColor": "#202020",
                "backgroundLighterColor": "#2c2c2c",
                "backgroundLightestColor": "#3a3a3a",
                "textColor": "#efefef",
                "mutedColor": "#b0b0b0",
                "primaryColor": "#0048ff",
                "secondaryColor": "#00bbff",
                "darkColor": "#1b1b1b",
                "darkerColor": "#111111",
                "navBar": "#1b1b1b",
                "navBarHover": "#262626",
                "navText": "#0048ff",
                "navTextHover": "#00bbff",
                "navActive": "#ffffff",
                "navActiveText": "#0048ff",
                "headingAlign": "center",
                "headingText": "#0048ff",
                "headingVariant": "small-caps",
                "formText": "#0048ff",
                "fontFamily": "Inter"
            };
    }
}