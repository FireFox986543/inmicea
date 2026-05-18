let webpageLang = 'en';
let webpageAuthor = 'John Doe';
let webpageTitle = 'My webpage';
let webpageStyle = [];

const s = new URLSearchParams(window.location.search);

if (s.get('preview'))
    renderPage(s.get('preview'));

window.addEventListener(
    "message",
    (e) => {
        console.log('Received message');
        let m = event.data;

        if (m.startsWith('PLZ-DONLOAD')) {
            m = event.data.substring('PLZ-DONLOAD'.length, event.data.length);
            renderPage(m);
            constructWholeHTML(m);
            return;
        }

        renderPage(m);
    },
    false
);

function renderPage(raw) {
    const content = document.getElementById('body-content');

    try {
        content.innerHTML = '';

        const cards = JSON.parse(raw);
        cards.forEach(c => {
            content.innerHTML += handleCard(c);
        });

        content.innerHTML += `<footer><p>&copy; 2026 ${webpageAuthor} &nbsp;&nbsp;&nbsp;&nbsp; ${translate('footer-rights')}</p></footer>`

        hookAllImages();
    } catch (error) {
        content.innerHTML = '<p style="color: red; font-size: 2rem"> Failed to render page!</p>';
    }
}

function handleCard(card) {

    switch (card.cardType) {
        case 'HTMLDataCard':
            document.title = webpageTitle = card.webpageTitle;
            webpageLang = card.webpageLanguage;
            webpageAuthor = card.webpageAuthor;
            return '';
        case 'CSSDataCard':
            const s = document.documentElement.style;
            webpageStyle = [
                ['--background', card.backgroundColor],
                ['--background-lighter', card.backgroundLighterColor],
                ['--background-lightest', card.backgroundLightestColor],
                ['--text', card.textColor],
                ['--muted', card.mutedColor],
                ['--primary', card.primaryColor],
                ['--secondary', card.secondaryColor],
                ['--dark', card.darkColor],
                ['--dark2', card.darkerColor],
                ['--nav-bar', card.navBar],
                ['--nav-bar-hover', card.navBarHover],
                ['--nav-text', card.navText],
                ['--nav-text-hover', card.navTextHover],
                ['--nav-active', card.navActive],
                ['--nav-active-text', card.navActiveText],
                ['--heading-align', card.headingAlign],
                ['--heading-text', card.headingText],
                ['--heading-variant', card.headingVariant],
                ['--form-text', card.formText],
                ['--font-family', `'${card.fontFamily}', Arial, Helvetica, sans-serif`],
            ];
            
            webpageStyle.forEach(([prop, val]) => s.setProperty(prop, val));
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
        googleMaps = `<div style="width: 50%; display: flex; min-height: 512px;">
                        <iframe src="${c.googleMapsLink}" width="100000" height="100000" style="border:0; border-radius: 20px; width: 100%; height: 100%; height: stretch;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>`;

    return `<section class="main">
                <section id="${c.sectionId}" style="width: 100%;">
                    <h2>${c.heading}</h2>
                    <div class="contact" ${googleMaps === '' ? '' : `style="align-items: center; min-height: 512px; flex-direction: ${c.displayDirection === 'vertical' ? 'column' : 'row'}"`}>
                        <div style="display: flex; flex-direction: column; gap: 20px; width: 50%;">
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
        case 'footer-rights': return webpageLang === 'hu' ? 'Minden jog fenntartva.' : 'All rights reserved.';
        default: return '';
    }
}

// CREDIT: https://coreui.io/answers/how-to-download-a-file-in-javascript/
function downloadFile(data, filename, type = 'text/plain') {
    const blob = new Blob([data], { type })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

function constructWholeHTML() {
    const content = document.getElementById('body-content').innerHTML;

    let cssStyle = '';
    webpageStyle.forEach(([p, s]) => {
        cssStyle += `${p}: ${s};\n`;
    });

    const html = `<!DOCTYPE html>
<html lang="${webpageLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${webpageTitle}</title>
    <meta name="author" content="${webpageAuthor}">
    <link rel="stylesheet" href="fontawesome/css/fontawesome.css">
    <link rel="stylesheet" href="fontawesome/css/regular.css">
    <link rel="stylesheet" href="fontawesome/css/solid.css">
    <link rel="stylesheet" href="fontawesome/css/brands.css">
    <link rel="stylesheet" href="inmicea.css">
    <link rel="shortcut icon" href="img/logo.png" type="image/x-icon">
    <style>
        :root {
            ${cssStyle}
        }
    </style>
</head>
<body>
    <div id="body-content">
        ${content}
    </div>
    <div id="modal" class="hidden">
        <img src="" id="modal-img">
        <button type="button"><i class="fas fa-x"></i></button>
    </div>
    <script>
        const modal = document.getElementById('modal');
        const modalImg = document.getElementById('modal-img');

        hookAllImages();

        modal.querySelector('button').addEventListener('click', () => {
            closeModal();
        });

        function showModal(src) {
            modal.classList.remove('hidden');
            modalImg.src = src;
        }
        function closeModal() {
            modal.classList.add('hidden');
        }

        function hookAllImages() {
            document.querySelectorAll('img.clickable').forEach(e => {
                e.addEventListener('click', () => {
                    showModal(e.src);
                });
            });
        }
    </script>
</body>
</html>`;

    downloadFile(html, 'index.html', 'text/html; charset=utf-8');
}