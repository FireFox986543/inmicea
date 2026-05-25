let language = 0; // By default it's english

const _translateTable = {
    "_empty_": [' ', ' '],

    "lang": ['English', 'Hungarian'],
    "english": ['English', 'Angol'],
    "hungarian": ['Hungarian', 'Magyar'],
    "tit1": ['INMICEA – Master webpage generator', 'INMICEA – Professzionális weboldal generátor'],
    "tit2": ['The new generation webpage generator', 'Az új generációs weboldal generátor'],
    "save": ['Save', 'Mentés'],
    "download": ['Download', 'Letöltés'],
    "open_newtab": ['Open in newtab', 'Új lapon való megnyitás'],
    "preview": ['Preview', 'Előnézet'],
    "undo": ['Undo changes', 'Visszavonás'],
    "redo": ['Redo changes', 'Újra'],
    "collapse_expand": ['Collapse/expand all', 'Kártyák kinyitása/becsukása'],

    "restore_tit": ['Continue previous session?', 'Folytatja az előző projektet?'],
    "restore_desc": [`There's saved data from last time. Would you like to continue, or start a new one?`, 'Szeretné folytatni az előző szerkesztést vagy újat kezdeni?'],
    "restore_cont": ['Continue editing', 'Szerkesztés folytatása'],
    "restore_new": ['Start new', 'Új kezdése'],

    "autofill": ['Autofill', 'Gyors kitöltés'],
    "move_down": ['Move down', 'Lefelé mozdítás'],
    "move_up": ['Move up', 'Felfelé mozdítás'],
    "duplicate": ['Duplicate', 'Másolat'],
    "delete": ['Delete', 'Törlés'],
    "rename": ['Rename', 'Átnevezés'],
    "add_card": ['Add new card', 'Kárty hozzáadása'],
    "create_project": ['Create new project', 'Új projekt létrehozása'],

    "html_data_card": ['HTML Data Card', 'HTML Adat Kártya'],
    "css_data_card": ['CSS Data Card', 'CSS Adat Kártya'],
    "html_nav_card": ['HTML Navigation Card', 'HTML Navigációs Kártya'],
    "nav_item_card": ['Navigation Item', 'Navigációs Elem'],
    "header_card": ['Header Card', 'Fejléc Kártya'],
    "section_card": ['Section Card', 'Rész Kártya'],
    "paragraph_card": ['Paragraph Card', 'Bekezdés Kártya'],
    "list_card": ['List Card', 'Lista Kártya'],
    "image_card": ['Image Card', 'Kép Kártya'],
    "html_heading_card": ['HTML Heading Card', 'HTML Címsor Kártya'],
    "contact_info_card": ['Contact Info Card', 'Kapcsolat Kártya'],
    "contact_element_card": ['Contact Element Card', 'Kapcsolat Elem Kártya'],
    "contact_form_card": ['Contact Form Card', 'Kapcsolati Űrlap Kártya'],
    "raw_html_card": ['Raw HTML Card', 'RAW HTML Kártya'],

    "fa_key_info": ['A fontawesome icon key', 'Egy fontawesome ikon azonosító'],
    "advanced": ['Advanced', 'Haladó'],

    "webpage_language": ['Webpage language', 'Weboldal nyelv'],
    "webpage_title": ['Webpage title', 'Weboldal cím'],
    "webpage_author": ['Webpage author', 'Weboldal szerző'],
    "webpage_icon": ['Webpage logo', 'Weboldal logó'],
    "lang_tt": ['This is the language of your webpage, this will influence built-in cards like the contact form.', 'Ez a nyelve a weboldaladnak, ami még más kártyákat is befolyásol, pl: kapcsolati űrlap kártya.'],

    "general_colors": ['General colors', 'Általános színek'],
    "select_theme": ['Select theme', 'Téma kiválasztása'],
    "bg": ['Background', 'Háttér'],
    "bg_l": ['Background lighter', 'Háttér világos'],
    "bg_ll": ['Background lightest', 'Háttér legvilágosabb'],
    "dark": ['Dark', 'Sötét'],
    "darker": ['Darker', 'Sötétebb'],
    "primary": ['Primary', 'Elsődleges szín'],
    "secondary": ['Secondary', 'Másodlagos szín'],
    "text": ['Text', 'Szöveg'],
    "muted_text": ['Muted text', 'Halvány szöveg'],
    "form_text": ['From text', 'Űrlap szöveg'],
    "font_family": ['Font family', 'Betűtípus'],
    "navmenu": ['Navmenu', 'Navigációs menü'],
    "nm_bg": ['Navmenu background', 'Navmenü háttér'],
    "nm_h_bg": ['Navmenu hover background', 'Navmenü hover háttér'],
    "nm_text": ['Navmenu text', 'Navmenü szöveg'],
    "nm_h_text": ['Navmenu hover text', 'Navmenü hover szöveg'],
    "nm_active": ['Navmenu active', 'Navmenü aktív'],
    "nm_active_text": ['Navmenu active text', 'Navmenü aktív szöveg'],
    "heading": ['Heading', 'Címsor'],
    "heading_text": ['Heading text', 'Címsor szine'],
    "heading_align": ['Heading align', 'Címsor elhelyezése'],
    "heading_variant": ['Heading variant', 'Címsor típusa'],
    "th_dark": ['Dark (Default)', 'Sötét (Alapértelmezett)'],
    "th_light": ['Light', 'Világos'],
    "th_coffee": ['Coffee', 'Kávé'],
    "th_sea": ['Sea', 'Tenger'],
    "th_cherry": ['Cherry', 'Cseresznye'],
    "th_mesa": ['Mesa', 'Tégla'],
    "inter": ['Inter', 'Inter'],
    "arial": ['Arial', 'Arial'],
    "times_new_roman": ['Times New Roman', 'Times New Roman'],
    "align_left": ['Left aligned', 'Balra igazított'],
    "align_center": ['Center aligned', 'Középre igazított'],
    "align_right": ['Right aligned', 'Jobbra igazított'],
    "normal": ['Normal', 'Normális'],
    "small_caps": ['Smallcaps', 'Kiskapitális'],

    "left_side": ['Left side', 'Bal oldal'],
    "right_side": ['Right side', 'Jobb oldal'],
    "nm_mt": ['Menu type', 'Menü típus'],
    "nm_mn": ['Menu name', 'Menü név'],
    "nm_dst": ['Destination', 'Cél'],
    "simple": ['Simple', 'Egyszerű'],
    "dropdown": ['Dropdown', 'Legördülő menü'],
    "submenus": ['Submenus', 'Almenük'],
    "icon_type": ['Icon type', 'Ikon típus'],
    "none": ['None', 'Egyik sem'],
    "image": ['Image', 'Kép'],
    "fa": ['Font awesome', 'Font awesome'],
    "icon": ['Icon', 'Ikon'],

    "title": ['Title', 'Cím'],
    "description": ['Description', 'Leírás'],
    "style": ['Style', 'Stílus'],
    "style_1": ['Style 1', 'Stílus 1.'],
    "style_2": ['Style 2', 'Stílus 2.'],

    "heading_top_tt": ['Should the header be placed as the first element?', 'A címsort a legelső elemként helyezzük el?'],
    "heading_top": ['Display heading at top', 'Címsor fenti elhelyezése'],
    "section_id_tt": ['A unique identifier that can be used for linking navigation links to this section', 'Egy egyedi azonosító, navigációs linkként ehhez a részhez hivatkozik.'],
    "section_id": ['Section id', 'Rész azonosítója'],
    "section_content": ['Section content', 'Rész tartalma'],
    "image_type": ['Image type', 'Kép típusa'],
    "bottom": ['Bottom', 'Alul'],
    "top": ['Top', 'Felül'],
    "left": ['Left', 'Bal'],
    "right": ['Right', 'Jobb'],
    "image_size": ['Image size', 'Kép méret'],
    "small": ['Small', 'Kicsi'],
    "large": ['Large', 'Nagy'],
    "image_list": ['Image list', 'Kép lista'],
    "type": ['type', 'Típus'],
    "list_ul": ['Unordered list', 'Pontozott lista'],
    "list_ol": ['Ordered list', 'Számozott lista'],
    "elements": ['Elements', 'Elemek'],
    "alt": ['Alt', 'Alt szöveg'],
    "ena_zoom": ['Enable zooming', 'Zoomolás engedélyezése'],
    "ena_zoom_tt": ['Can the user click on it to show a scaled version on screen?', 'Rá tud-e kattintani a felhasználó, hogy egy nagyobb képet megjeleníthessen?'],
    "level": ['Level', 'Szint'],
    "h2": ['H2', 'H2'],
    "h3": ['H3', 'H3'],
    "h4": ['H4', 'H4'],
    "h5": ['H5', 'H5'],
    "h6": ['H6', 'H6'],
    "google_maps_link": ['Google Maps link', 'Google Maps link'],
    "google_maps_link_tt": ['Link used for displaying google maps if required, unless leave empty.', 'Egy Google maps link, amivel megjeleníthető a térkép, amennyiben szükséges.'],
    "display_dir": ['Display direction', 'Megjelenítés iránya'],
    "contact_infos": ['Contact infos', 'Kapcsolati inforációk'],
    "horizontal": ['Horizontal', 'Vízszintes'],
    "vertical": ['Vertical', 'Függöleges'],
    "email": ['Email', 'Email'],
    "location": ['Location', 'Helyszín'],
    "telephone": ['Telephone', 'Telefon'],
    "facebook": ['Facebook', 'Facebook'],
    "youtube": ['YouTube', 'YouTuve'],
    "twitter": ['Twitter', 'Twitter'],
    "instagram": ['Instagram', 'Instagram'],
    "custom": ['Custom', 'Egyedi'],
    "custom_icon": ['Custom icon', 'Egyedi ikon'],
    "name": ['Name', 'Név'],
    "value": ['Value', 'Érték'],
    "link": ['Link', 'Link'],
    "link_tt": ['The link used for anchor tags, unless leave empty.', 'Egy link a hiperhivatkozásokhoz. Hagyja üresen, ha nem szándékoz rá hivatkozni.'],
    "top_text": ['Top text', 'Felső szöveg'],
    "has_name": ['Has name field', 'Van név mező'],
    "has_email": ['Has email field', 'Van email mező'],
    "has_tel": ['Has telephone field', 'Van telefon mező'],
    "has_org": ['Has organization field', 'Van vállalat mező'],
    "has_loc": ['Has location field', 'Van lakcím mező'],
    "has_msg": ['Has message field', 'Van üzenet mező'],
    "html": ['HTML', 'HTML'],

    "def_wbpt": ['My first webpage', 'Az én első weboldalam'],
    "def_wbpa": ["It's me", 'Én vagyok'],
    "def_menu": ['Menu1', 'Menü1'],
    "def_hc_title": ['First Webpage', 'Első weboldalam'],
    "def_hc_desc": ["This is my very new webpage were i'll show you the cutest articles you'll ever see!", 'Ez az én legelső weboldalam, ahol megmutatom nektek a egcukibb cikkeket amit valaha láthattok.'],
    "def_sct_h": ['Creative Chickens', 'Kreatív csirkék'],
    "def_pc_txt": ['Lorem ipsum dolor sit amet, went amen at one point :P', 'Lorem ipsum dolor sit amet...'],
    "def_lc_el": ['First item\nSecond item\nThird item...', 'Első\nMásodik\nHarmadik...\nDikk?'],
    "def_htmlc_h": ['Interesting cats', 'Érdekes cicusok'],
    "def_contact_ifon": ['Contact information', 'Kapcsolat'],
    "def_cf_txt": ['Get in contact with us!', 'Lépj velünk kapcsolatba!'],
    "def_hello_world": ['<p>Hello World!</p>', '<p>Heló Világ</p>'],
}

language = window.localStorage.getItem('lang') || 0;
window.localStorage.setItem('lang', language);

translateWholePage();

function translate(key, fallback = 'Error') {
    const arr = _translateTable[key];

    if (arr == null)
        return fallback;

    return arr[language] || fallback;
}

function translateWholePage() {
    const toTranslate = document.querySelectorAll('*[data-trkey]');

    toTranslate.forEach(e => {
        let key = e.dataset.trkey.split('|')[0];
        let target = e.dataset.trkey.split('|')[1] || 'tc'; // tc -> TextContent    tt -> ToolTip
        const translated = translate(key, 'Translation Error');

        if (translated === 'Translation Error')
            console.error(`Failed to translate '${key}' on `, e);

        switch (target) {
            case 'tt':
                e.setAttribute('tooltip-text', translated);
                break;
            default:
                e.textContent = translated;
                break;
        }
    });

    document.title = translate('tit1');
}

function setLanguage(l) {
    language = (l < 0 && l >= 1) ? 0 : l;
    window.localStorage.setItem('lang', language);
    translateWholePage();
}