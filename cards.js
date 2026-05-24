class Card {
    constructor(nesting) {
        this.id = generateUUIDv4();
        this.nesting = nesting;
        this.collapsed = false;
        this.category = 'content';
    }
    onPropertyUpdate(hook, value) { }

    static renderCardToolbar(t, hasTools, hasAutofill = false) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-toolbar" onclick="collapseCard(this, '${t.id}')">
                    <div class="title-wrapper">
                        <h4><i class="fas ${t.icon}"></i> &nbsp;&nbsp; <span data-trkey="${t.cardTitle}">${translate(t.cardTitle)}</span></h4>
                    </div>
                    <div class="card-right">
                        ${hasTools ? `${hasAutofill ? `<button type="button" class="control-btn tooltip" tooltip-text="${translate('autofill')}" data-trkey="autofill|tt" onclick="event.stopPropagation(); autofillCard('${t.id}')"><i class="fas fa-bolt-auto"></i></button>` : ''}
                        <button type="button" class="control-btn tooltip" tooltip-text="${translate('move_down')}" data-trkey="move_down|tt" onclick="event.stopPropagation(); moveCard('${t.id}', -1)"><i class="fas fa-angle-down"></i></button>
                        <button type="button" class="control-btn tooltip" tooltip-text="${translate('move_up')}" data-trkey="move_up|tt" onclick="event.stopPropagation(); moveCard('${t.id}', 1)"><i class="fas fa-angle-up"></i></button>
                        <button type="button" class="control-btn tooltip" tooltip-text="${translate('duplicate')}" data-trkey="duplicate|tt" onclick="event.stopPropagation(); dupeCard('${t.id}')"><i class="fas fa-copy"></i></button>
                        <button type="button" class="control-btn danger-btn tooltip" tooltip-text="${translate('delete')}" data-trkey="delete|tt" onclick="event.stopPropagation(); deleteCard('${t.id}')"><i class="fas fa-trash-can"></i></button>` : ''}
                    </div>
                </div>`
    }
    static renderHr(trkey) {
        return `<div class="card-field card-hr">
                    <span data-trkey="${trkey}">${translate(trkey)}</span>
                </div>`;
    }
    static renderTextField(t, trkey, dataHook) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-field">
                <label data-trkey="${trkey}">${translate(trkey)}</label>
                <input type="text" oninput="updateProperty(this, '${t.id}', '${dataHook}')" value="${t[dataHook]}" onchange="propertyChanged(this, '${t.id}', '${dataHook}')">
            </div>`;
    }
    static renderCheckBox(t, trkey, dataHook) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-field">
                <button type="button" class="checkbox-btn" value="${t[dataHook]}" onclick="Card.checkboxHelper(this); updateProperty(this, '${t.id}', '${dataHook}'); propertyChanged(this, '${t.id}', '${dataHook}')"><i class='far fa-square${t[dataHook] === 'true' ? '-check' : ''}'></i> &nbsp; <span data-trkey="${trkey}">${translate(trkey)}</span></button><div style="flex-grow: 1"></div>
            </div>`;
    }
    static renderTextareaField(t, trkey, dataHook, height = 100) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-field expandable">
                <label style="align-self: flex-start;" data-trkey="${trkey}">${translate(trkey)}</label>
                <textarea class="vertical-resize" style="height: ${height}px" oninput="updateProperty(this, '${t.id}', '${dataHook}')" onchange="propertyChanged(this, '${t.id}', '${dataHook}')">${t[dataHook]}</textarea>
            </div>`;
    }
    static renderColorField(t, trkey, dataHook) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-field">
                <label data-trkey="${trkey}">${translate(trkey)}</label>
                <input type="color" oninput="updateProperty(this, '${t.id}', '${dataHook}')" onchange="propertyChanged(this, '${t.id}', '${dataHook}')" value="${t[dataHook]}">
            </div>`;
    }
    static renderDropdown(t, trkey, dataHook, options) {
        const nesting = Card.getNestingFromCard(t);
        const selected = t[dataHook];
        let optHTML = '';
        options.forEach(([v, tr]) => {
            optHTML += `<option value="${v}" ${v === selected ? 'selected' : ''} data-trkey="${tr}">${translate(tr)}</option>`;
        });

        return `<div class="card-field">
                <label data-trkey="${trkey}">${translate(trkey)}</label>
                <select onchange="updateProperty(this, '${t.id}', '${dataHook}'); propertyChanged(this, '${t.id}', '${dataHook}')">
                    ${optHTML}
                </select>
            </div>`;
    }
    static renderImageField(t, trkey, dataHook) {
        const nesting = Card.getNestingFromCard(t);
        return `<div class="card-field expandable">
                    <label style="align-self: flex-start;" data-trkey="${trkey}">${translate(trkey)}</label>
                    <div class="image-box">
                        <img src="${t[dataHook]}" alt="Image" data-hook="${dataHook}">
                    </div>
                    <input type="text" oninput="updateProperty(this, '${t.id}', '${dataHook}')" value="${t[dataHook]}" onchange="propertyChanged(this, '${t.id}', '${dataHook}')">
                </div>`;
    }
    static renderFaField(t, trkey, dataHook) {
        return Card.renderInfoTo(Card.renderExtraTo(Card.renderTextField(t, trkey, dataHook), `<i class="${t[dataHook]}" style="margin-left: 8px" data-hook="${dataHook}"></i>`), 'fa_key_info');
    }

    static renderAdvancedSection(t, content) {
        return `<div class="advanced-section collapsed"><span class="advanced-title" onclick="this.parentElement.classList.toggle('collapsed')"><i class="fas fa-caret-down"></i> &nbsp; <span data-trkey="advanced">${translate('advanced')}</span></span><div class="advanced-content">${content}</div></div>`;
    }

    static renderNestedCards(t, trkey, list, buttonStr) {
        let inner = '';
        t[list].forEach(c => inner += c.render());

        return `<div class="card-field card-field-nested" data-list="${list}">
                    <div class="nested-card-container ${t[list + '_collapsed'] ? 'collapsed' : ''}">
                        <div class="nested-top" onclick="collapseNestedList(this, '${t.id}', '${list}')">
                            <h4 data-trkey="${trkey}">${translate(trkey)}</h4>
                            ${buttonStr}
                        </div>
                        <div class="card-container">
                            ${inner}
                        </div>
                    </div>
                </div>`;
    }
    static renderAddButtonSingle(t, list, cardType) {
        return `<button type="button" class="control-btn tooltip" tooltip-text="${translate('add_card')}"  data-trkey="add_card|tt" onclick="event.stopPropagation(); addCardIntoList('${t.id}', '${list}', new ${cardType}({ id: '${t.id}', list: '${list}' }))"><i class="fas fa-plus"></i></button>`;
    }
    static renderAddButtonMultiple(t, list, options) {
        let inner = '';
        options.forEach(([trkey, icon, type]) => inner += `<div class="selector-option" onclick="event.stopPropagation(); addCardIntoList('${t.id}', '${list}', new ${type}({ id: '${t.id}', list: '${list}' }));"><i class="fas ${icon}"></i> <span data-trkey="${trkey}">${translate(trkey)}</span></div>`)

        return `<button type="button" class="control-btn selector-btn">
                    <i class="fas fa-plus"></i>
                    <div class="dropover-selector-wrapper">
                        <div class="dropover-selector">
                            ${inner}
                        </div>
                    </div>
                </button>`
    }

    static beginCard(t) {
        return `<div class="card cat-${t.category} ${t.collapsed ? 'collapsed' : ''}" id="card_${t.id}">`;
    }

    static updateImageField(t, hook, value, targetHook) {
        if (hook === targetHook) {
            const imgElement = document.querySelector(`#card_${t.id} img[data-hook="${hook}"]`);
            imgElement.src = value;
        }
    }
    static updateFaField(t, hook, value, targetHook) {
        if (hook === targetHook) {
            const iconEl = document.querySelector(`#card_${t.id} i[data-hook="${hook}"]`);
            iconEl.className = `${value}`;
        }
    }

    static getNestingFromCard(card) {
        return card.nesting || { id: null, list: null };
    }
    static renderInfoTo(str, trkey, right = false) {
        return str.substring(0, str.length - 6) + `<div class="tooltip tooltip-${right ? 'right' : 'left'} info" tooltip-text="${translate(trkey)}" data-trkey="${trkey}|tt">
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
        this.cardTitle = 'html_data_card';
        this.icon = 'fa-gear';
        this.category = 'markup';

        this.webpageLanguage = 'en';
        this.webpageTitle = translate('def_wbpt');
        this.webpageAuthor = translate('def_wbpa');
        this.webpageIcon = '';
    }
    onPropertyUpdate(hook, value) {
        Card.updateImageField(this, hook, value, 'webpageIcon');
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, false)}
                <div class="card-content">
                    ${Card.renderInfoTo(Card.renderDropdown(this, 'webpage_language', 'webpageLanguage', [['en', 'english'], ['hu', 'hungarian']]), 'lang_tt')}
                    ${Card.renderTextField(this, 'webpage_title', 'webpageTitle')}
                    ${Card.renderTextField(this, 'webpage_author', 'webpageAuthor')}
                    ${Card.renderImageField(this, 'webpage_icon', 'webpageIcon')}
                </div>
            </div>`;
    }
}
class CSSDataCard extends Card {
    constructor() {
        super();
        this.cardType = 'CSSDataCard';
        this.cardTitle = 'css_data_card';
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

            renderCard(this);
        }
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, false)}
                    <div class="card-content">
                    ${Card.renderDropdown(this, 'select_theme', '_themeDONTUSE', [['hello', '_empty_'], ['dark', 'th_dark'], ['light', 'th_light'], ['coffee', 'th_coffee'], ['sea', 'th_sea'], ['cherry', 'th_cherry'], ['mesa', 'th_mesa']])}
                    ${Card.renderHr('general_colors')}
                    ${Card.renderColorField(this, 'bg', 'backgroundColor')}
                    ${Card.renderColorField(this, 'bg_l', 'backgroundLighterColor')}
                    ${Card.renderColorField(this, 'bg_ll', 'backgroundLightestColor')}
                    ${Card.renderColorField(this, 'dark', 'darkColor')}
                    ${Card.renderColorField(this, 'darker', 'darkerColor')}
                    ${Card.renderColorField(this, 'primary', 'primaryColor')}
                    ${Card.renderColorField(this, 'secondary', 'secondaryColor')}
                    ${Card.renderHr('text')}
                    ${Card.renderColorField(this, 'text', 'textColor')}
                    ${Card.renderColorField(this, 'muted_text', 'mutedColor')}
                    ${Card.renderColorField(this, 'form_text', 'formText')}
                    ${Card.renderDropdown(this, 'font_family', 'fontFamily', [['Inter', 'inter'], ['Arial', 'arial'], ['Times New Roman', 'times_new_roman']])}
                    ${Card.renderHr('navmenu')}
                    ${Card.renderColorField(this, 'nm_bg', 'navBar')}
                    ${Card.renderColorField(this, 'nm_h_bg', 'navBarHover')}
                    ${Card.renderColorField(this, 'nm_text', 'navText')}
                    ${Card.renderColorField(this, 'nm_h_text', 'navTextHover')}
                    ${Card.renderColorField(this, 'nm_active', 'navActive')}
                    ${Card.renderColorField(this, 'nm_active_text', 'navActiveText')}
                    ${Card.renderHr('heading')}
                    ${Card.renderColorField(this, 'heading_text', 'headingText')}
                    ${Card.renderDropdown(this, 'heading_align', 'headingAlign', [['left', 'align_left'], ['center', 'align_center'], ['right', 'align_right']])}
                    ${Card.renderDropdown(this, 'heading_variant', 'headingVariant', [['normal', 'normal'], ['small-caps', 'small_caps']])}
                </div>
            </div>`;
    }
}
class HTMLNavigationCard extends Card {
    constructor() {
        super();
        this.cardType = 'HTMLNavigationCard';
        this.cardTitle = 'html_nav_card';
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
                    ${Card.renderNestedCards(this, 'left_side', 'leftCards', Card.renderAddButtonSingle(this, 'leftCards', 'HTMLNavmenuCard'))}
                    ${Card.renderNestedCards(this, 'right_side', 'rightCards', Card.renderAddButtonSingle(this, 'rightCards', 'HTMLNavmenuCard'))}
                </div>
            </div>`;
    }
}
class HTMLNavmenuCard extends Card {
    constructor(nesting) {
        super(nesting);
        this.cardType = 'HTMLNavmenuCard';
        this.cardTitle = 'nav_item_card';

        this.type = 'simple';
        this.menuName = translate('def_menu');
        this.destination = 'index.html';
        this.iconType = 'none';
        this.iconHref = '';
        this.iconFa = 'fas fa-font-awesome'

        this.subCards = [];
        this.subCards_collapsed = false;
    }
    get icon() { return this.type === 'dropdown' ? 'fa-list-dropdown' : 'fa-diagram-cells'; }

    onPropertyUpdate(hook, value) {
        if (hook === 'type' || hook === 'iconType')
            renderCard(this);
        
        Card.updateFaField(this, hook, value, 'iconFa');
        Card.updateImageField(this, hook, value, 'iconHref');
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderDropdown(this, 'nm_mt', 'type', [['simple', 'simple'], ['dropdown', 'dropdown']])}
                    ${Card.renderTextField(this, 'nm_mn', 'menuName')}
                    ${this.type === 'simple' ? Card.renderTextField(this, 'nm_dst', 'destination') : Card.renderNestedCards(this, 'submenus', 'subCards', Card.renderAddButtonSingle(this, 'subCards', 'HTMLNavmenuCard'))}
                    ${Card.renderDropdown(this, 'icon_type', 'iconType', [['none', 'none'], ['image', 'image'], ['fa', 'fa']])}
                    ${this.iconType === 'image' ? Card.renderImageField(this, 'icon', 'iconHref') : (this.iconType === 'fa' ? Card.renderFaField(this, 'icon', 'iconFa') : '')}
                </div>
            </div>`;
    }
}

class HeaderCard extends Card {
    constructor() {
        super();
        this.cardType = 'HeaderCard';
        this.cardTitle = 'header_card';
        this.icon = 'fa-heading';

        this.title = translate('def_hc_title');
        this.description = translate('def_hc_desc');
        this.backgroundImg = '';
        this.style = 'style1';
        this.headingIcon = '';
    }

    onPropertyUpdate(hook, value) {
        Card.updateImageField(this, hook, value, 'backgroundImg');
        Card.updateImageField(this, hook, value, 'headingIcon');

        if(hook === 'style')
            renderCard(this);
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderTextField(this, 'title', 'title')}
                    ${Card.renderTextareaField(this, 'description', 'description')}
                    ${Card.renderImageField(this, 'bg', 'backgroundImg')}
                    ${Card.renderDropdown(this, 'style', 'style', [['style1', 'style_1'], ['style2', 'style_2']])}
                    ${this.style !== 'style2' ? '' : Card.renderImageField(this, 'icon', 'headingIcon')}
                </div>
            </div>`;
    }
}
class SectionCard extends Card {
    constructor() {
        super();
        this.cardType = 'SectionCard';
        this.cardTitle = 'section_card';
        this.icon = 'fa-section';

        this.heading = translate('def_sct_h');
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
            renderCard(this);
    }
    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderTextField(this, 'heading', 'heading')}
                    ${Card.renderAdvancedSection(this, Card.renderInfoTo(Card.renderCheckBox(this, 'heading_top', 'headingIsTop'), 'heading_top_tt') + Card.renderInfoTo(Card.renderTextField(this, 'section_id', 'sectionId'), 'section_id_tt'))}
                    ${Card.renderNestedCards(this, 'section_content', 'contentCards', Card.renderAddButtonMultiple(this, 'contentCards', [['paragraph_card', 'fa-paragraph', 'ParagraphCard'], ['list_card', 'fa-list-ul', 'ListCard'], ['html_heading_card', 'fa-h2', 'HTMLHeadingCard'], ['raw_html_card', 'fa-file-html', 'RawHTMLCard']]))}
                    ${Card.renderDropdown(this, 'image_type', 'imageType', [['none', 'none'], ['bottom', 'bottom'], ['top', 'top'], ['left', 'left'], ['right', 'right']])}
                    ${this.imageType === 'none' ? ''
                : (
                    `${['left', 'right'].includes(this.imageType) ? Card.renderDropdown(this, 'image_size', 'imageSize', [['small', 'small'], ['normal', 'normal'], ['large', 'large']]) : ''}
                    ${Card.renderNestedCards(this, 'image_list', 'imageCards', Card.renderAddButtonSingle(this, 'imageCards', 'ImageCard'))}`
                )}
                </div>
            </div>`;
    }
}
class ParagraphCard extends Card {
    constructor(nesting) {
        super(nesting);
        this.cardType = 'ParagraphCard';
        this.cardTitle = 'paragraph_card';
        this.icon = 'fa-paragraph';

        this.text = translate('def_pc_txt');
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderTextareaField(this, 'text', 'text')}
                </div>
            </div>`;
    }
}
class ListCard extends Card {
    constructor(nesting) {
        super(nesting);
        this.cardType = 'ListCard';
        this.cardTitle = 'list_card';
        this.icon = 'fa-list-ul';

        this.type = 'ul';
        this.elements = translate('def_lc_el');
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderDropdown(this, 'type', 'type', [['ul', 'list_ul'], ['ol', 'list_ol']])}
                    ${Card.renderTextareaField(this, 'elements', 'elements')}
                </div>
            </div>`;
    }
}
class ImageCard extends Card {
    constructor(nesting) {
        super(nesting);
        this.cardType = 'ImageCard';
        this.cardTitle = 'image_card';
        this.icon = 'fa-image';

        this.alt = '';
        this.image = '';
        this.canBeZoomed = 'true';
    }

    onPropertyUpdate(hook, value) {
        Card.updateImageField(this, hook, value, 'image');
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderImageField(this, 'image', 'image')}
                    ${Card.renderTextField(this, 'alt', 'alt')}
                    ${Card.renderAdvancedSection(this, Card.renderInfoTo(Card.renderCheckBox(this, 'ena_zoom', 'canBeZoomed'), 'ena_zoom_tt'))}
                </div>
            </div>`;
    }
}
class HTMLHeadingCard extends Card {
    constructor(nesting) {
        super(nesting);
        this.cardType = 'HTMLHeadingCard';
        this.cardTitle = 'html_heading_card';
        this.icon = 'fa-h2';

        this.level = 'h2';
        this.heading = translate('def_htmlc_h');
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderDropdown(this, 'level', 'level', [['h2', 'h2'], ['h3', 'h3'], ['h4', 'h4'], ['h5', 'h5'], ['h6', 'h6']])}
                    ${Card.renderTextField(this, 'heading', 'heading')}
                </div>
            </div>`;
    }
}

class ContactInfoCard extends Card {
    constructor() {
        super();
        this.cardType = 'ContactInfoCard';
        this.cardTitle = 'contact_info_card';
        this.icon = 'fa-id-card';

        this.googleMapsLink = '';
        this.sectionId = '';
        this.heading = translate('def_contact_info');
        this.displayDirection = 'horizontal';

        this.contentCards = [];
        this.contentCards_collapsed = false;
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderInfoTo(Card.renderTextField(this, 'google_maps_link', 'googleMapsLink'), 'google_maps_link_tt')}
                    ${Card.renderTextField(this, 'heading', 'heading')}
                    ${Card.renderDropdown(this, 'display_dir', 'displayDirection', [['horizontal', 'horizontal'], ['vertical', 'vertical']])}
                    ${Card.renderNestedCards(this, 'contact_infos', 'contentCards', Card.renderAddButtonSingle(this, 'contentCards', 'ContactElementCard'))}
                    ${Card.renderAdvancedSection(this, Card.renderInfoTo(Card.renderTextField(this, 'section_id', 'sectionId'), 'section_id_tt'))}
                    </div>
            </div>`;
    }
}
class ContactElementCard extends Card {
    constructor(nesting) {
        super(nesting);
        this.cardType = 'ContactElementCard';
        this.cardTitle = 'contact_element_card';
        this.icon = 'fa-at';

        this.type = 'email';
        this.customIcon = 'fas fa-dollar';
        this.text = '';
        this.name = '';
        this.link = '';
    }

    onPropertyUpdate(hook, value) {
        if (hook === 'type')
            renderCard(this);
        
        Card.updateFaField(this, hook, value, 'customIcon');
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true, true)}
                <div class="card-content">
                    ${Card.renderDropdown(this, 'type', 'type', [
            ['email', 'email'],
            ['location', 'location'],
            ['telephone', 'telephone'],
            ['facebook', 'facebook'],
            ['youtube', 'youtube'],
            ['twitter', 'twitter'],
            ['instagram', 'instagram'],
            ['custom', 'custom']
        ])}
                    ${this.type === 'custom' ? Card.renderFaField(this, 'custom_icon', 'customIcon') : ''}
                    ${Card.renderTextField(this, 'name', 'name')}
                    ${Card.renderTextField(this, 'value', 'text')}
                    ${Card.renderInfoTo(Card.renderTextField(this, 'link', 'link'), "link_tt")}
                </div>
            </div>`;
    }
}
class ContactFormCard extends Card {
    constructor() {
        super();
        this.cardType = 'ContactFormCard';
        this.cardTitle = 'contact_form_card';
        this.icon = 'fa-inbox-in';

        this.sectionId = '';
        this.text = translate('def_cf_txt');
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
                ${Card.renderTextField(this, 'top_text', 'text')}
                ${Card.renderCheckBox(this, 'has_name', 'name')}
                ${Card.renderCheckBox(this, 'has_email', 'email')}
                ${Card.renderCheckBox(this, 'has_tel', 'telephone')}
                ${Card.renderCheckBox(this, 'has_org', 'organization')}
                ${Card.renderCheckBox(this, 'has_loc', 'location')}
                ${Card.renderCheckBox(this, 'has_msg', 'message')}
                ${Card.renderAdvancedSection(this, Card.renderInfoTo(Card.renderTextField(this, 'section_id', 'sectionId'), 'section_id_tt'))}
                </div>
            </div>`;
    }
}

class RawHTMLCard extends Card {
    constructor(nesting) {
        super(nesting);
        this.cardType = 'RawHTMLCard';
        this.cardTitle = 'raw_html_card';
        this.icon = 'fa-file-html';

        this.html = translate('def_hello_world');
    }

    render() {
        return `${Card.beginCard(this)}
                ${Card.renderCardToolbar(this, true)}
                <div class="card-content">
                    ${Card.renderTextareaField(this, 'html', 'html', 320)}
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
        case 'HTMLHeadingCard': return new HTMLHeadingCard();
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