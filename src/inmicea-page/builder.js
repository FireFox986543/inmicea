let webpageLang = 'en';

window.addEventListener(
    "message",
    (e) => {
        console.log('Received message');

        const content = document.getElementById('body-content');
        content.innerHTML = '';

        const cards = JSON.parse(event.data);
        cards.forEach(c => {
            content.innerHTML += handleCard(c);
        });

        hookAllImages();
    },
    false
);

function handleCard(card) {

    switch (card.cardType) {
        case 'HTMLDataCard':
            document.title = card.webpageTitle;
            webpageLang = card.webpageLanguage;
            return '';
        case 'CSSDataCard':
            const s = document.documentElement.style;
            s.setProperty('--background', card.backgroundColor);
            s.setProperty('--background-lighter', card.backgroundLighterColor);
            s.setProperty('--background-lightest', card.backgroundLightestColor);
            s.setProperty('--text', card.textColor);
            s.setProperty('--muted', card.mutedColor);
            s.setProperty('--primary', card.primaryColor);
            s.setProperty('--secondary', card.secondaryColor);
            s.setProperty('--dark', card.darkColor);
            s.setProperty('--dark2', card.darkerColor);
            s.setProperty('--font-family', `'${card.fontFamily}', Arial, Helvetica, sans-serif`);
            return '';
        case 'HTMLNavigationCard':
            return handleNavCard(card);
        case 'HeaderCard':
            return `<header style="background-image: url('${card.backgroundImg}')">
                        <div>
                            <h1>${card.title}</h1>
                            <p>${card.description}</p>
                        </div>
                    </header>`;
        case 'SectionCard':
            return handleSection(card);
        case 'ContactInfoCard':
            return handleContactInfo(card);
        case 'ContactFormCard':
            return handleContactForm(card);
        case 'RawHTMLCard':
            return card.html;
        default:
            throw new Error("Failed to construct card from given type: " + type);
    }
}

function handleNavCard(c) {
    let content = '';
    content += handleNavSubCards(c.leftCards);
    content += '<div style="flex-grow: 1;"></div>' + handleNavSubCards(c.rightCards);

    return `<nav>${content}</nav>`;
}
function handleNavSubCards(arr) {
    const handleInner = (c) => {
        let inner = '';

        c.subCards.forEach(c => {
            inner += handleInner(c);
        });

        if (c.type === 'simple') {
            return `<a href="${c.destination}">${c.menuName}</a>`;
        }
        else { // dropdown
            return `<div class="subbed">
                ${c.menuName}
                <div class="nav-sub">
                    ${inner}
                </div>
            </div>`;
        }
    };

    let inner = '';
    arr.forEach(c => {
        inner += handleInner(c);
    });

    return inner;
}

function handleSection(c) {
    const heading = `<h2>${c.heading}</h2>`
    let content = c.headingIsTop === 'true' ? '' : heading;
    let images = '';

    c.contentCards.forEach(cc => {
        content += handleSectionContent(cc);
    });
    c.imageCards.forEach(i => {
        images += `<img src="${i.image}" alt="${i.alt}" title="${i.alt}" ${i.canBeZoomed === 'true' ? 'class="clickable"' : ''}>`;
    });

    let inner = '';

    switch (c.imageType) {
        case 'bottom':
            inner = `${content}<div class="img-cont">${images}</div>`;
            break;
        case 'top':
            inner = `<div class="img-cont">${images}</div>${content}`;
            break;
        case 'right':
            inner = `<div class="img-cont">
                        <div style="flex-grow: 1">${content}</div>
                        <div class="multi-cont ${c.imageSize === 'small' ? 'smaller' : (c.imageSize === 'normal' ? '' : 'bigger')}">${images}</div>
                    </div>`;
            break;
        case 'left':
            inner = `<div class="img-cont">
                        <div class="multi-cont ${c.imageSize === 'small' ? 'smaller' : (c.imageSize === 'normal' ? '' : 'bigger')}">${images}</div>
                        <div style="flex-grow: 1">${content}</div>
                    </div>`;
            break;
        default:
            inner = content;
            break;
    }

    return `<section class="main"><section id="${c.sectionId}">${c.headingIsTop === 'true' ? heading : ''}${inner}</section></section>`;
}
function handleSectionContent(cc) {
    switch (cc.cardType) {
        case 'ParagraphCard':
            return `<p>${cc.text.replace(/(\n)+/g, '<br>')}</p>`;
        case 'ListCard':
            const li = cc.elements.split('\n');
            let liContent = '';
            li.forEach(l => {
                liContent += `<li>${l}</li>`;
            });

            return `<${cc.type}>${liContent}</${cc.type}>`;
        case 'RawHTMLCard':
            return cc.html;
        default:
            return '!Error! Missing card handle for ' + cc.cardType;
    }
}

function handleContactInfo(c) {
    let content = '';

    c.contentCards.forEach(cc => {
        const icon = getIcon(cc.type, cc.customIcon);
        const link = cc.link.trim();

        if (link.startsWith('http'))
            content += `<div class="crow">
                        <strong><i class="${icon}"></i> ${cc.name}</strong>
                        <span><a href="${cc.link}" target="_blank" rel="noreferrer noopener">${cc.text}</a></span>
                    </div>`;
        else
            content += `<div class="crow">
                        <strong><i class="${icon}"></i> ${cc.name}</strong>
                        <span>${cc.text}</span>
                    </div>`;
    });

    let googleMaps = '';

    if (c.googleMapsLink.startsWith('https://www.google.com/maps/embed'))
        googleMaps = `<div style="flex-grow: 1; display: flex;">
                        <iframe src="${c.googleMapsLink}" width="100000" height="100000" style="border:0; border-radius: 20px; width: 100%; height: 100%;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>`;

    return `<section class="main">
                <section id="${c.sectionId}" style="width: 100%;">
                    <h2>${c.heading}</h2>
                    <div class="contact" ${googleMaps === '' ? '' : 'style="min-height: 512px;"'}>
                        <div style="display: flex; flex-direction: column; gap: 20px; flex: 1 1 400px; max-width: 600px">
                            ${content}
                        </div>
                        ${googleMaps}
                    </div>
                </section>
            </section>`;
}
function getIcon(type, custom) {
    switch (type) {
        case 'email': return 'fas fa-envelope';
        case 'location': return 'fas fa-location-dot';
        case 'telephone': return 'fas fa-phone';
        case 'facebook': return 'fab fa-facebook';
        case 'youtube': return 'fab fa-youtube';
        case 'twitter': return 'fab fa-x-twitter';
        case 'instagram': return 'fab fa-instagram';
        default: return custom;
    }
}

function handleContactForm(card) {
    let content = '';
    const fields = ['name', 'email', 'telephone', 'organization', 'location', 'message'];

    fields.forEach(f => {
        if (card[f] === 'true') {
            if (f === 'message')
                content += `<div class="frow">
                                <label for="name">${translate('message')}</label>
                                <textarea style="resize: vertical;" rows="7" name="message" id="message" placeholder="${translate('def-message')}"></textarea>
                            </div>`;
            else
                content += `<div class="frow">
                                <label for="name">${translate(f)}</label>
                                <input type="${f === 'email' ? 'email' : (f === 'telephone' ? 'tel' : 'text')}" name="${f}" id="${f}" autocomplete="${f === 'telephone' ? 'tel' : (f === 'address' ? 'address-level4' : f)}" placeholder="${translate('def-' + f)}">
                            </div>`;
        }
    });

    return `<section class="main">
                <section id="${card.sectionId}" style="width: 100%;">
                    <form action="#" style="margin-top: 40px; margin: 80px auto;">
                        <span class="title">${card.text}</span>
                        ${content}
                        <input type="submit" value="${translate('send')}" class="button" style="margin-top: 32px;">
                    </form>
                </section>
            </section>`;
}

function translate(f) {
    switch (f) {
        case 'name': return webpageLang === 'hu' ? 'Név' : 'Name'
        case 'email': return webpageLang === 'hu' ? 'Email cím' : 'Email'
        case 'telephone': return webpageLang === 'hu' ? 'Telefonszám' : 'Telephone'
        case 'organization': return webpageLang === 'hu' ? 'Cég, vállalat' : 'Organization'
        case 'location': return webpageLang === 'hu' ? 'Lakcím' : 'Location'
        case 'message': return webpageLang === 'hu' ? 'Üzenet' : 'Message'

        case 'def-name': return webpageLang === 'hu' ? 'Példa Imre' : 'John Doe'
        case 'def-email': return webpageLang === 'hu' ? 'pelda@gmail.com' : 'example@gmail.com'
        case 'def-telephone': return webpageLang === 'hu' ? '+36 20 123 4567' : '+1 212 555 1234'
        case 'def-organization': return webpageLang === 'hu' ? 'A Legjobb KFT' : 'The Best LTD'
        case 'def-location': return webpageLang === 'hu' ? '1234 Kukutyin Zab utca 71' : 'Imagine St. 71 California'
        case 'def-message': return webpageLang === 'hu' ? 'Írja ide üzenetét...' : 'Enter message here...'

        case 'send': return webpageLang === 'hu' ? 'Küldés' : 'Send'
        default: return '';
    }
} 