const allCards = [];
const rootCardlist = [];
const cardContainer = document.getElementById('editor-content');

let history = [];
let historyAt = 0;

let themeIsDark = false;
let sideMode = 0;

{
    let t = window.localStorage.getItem('theme');

    if (t != null)
        themeIsDark = t === 'true' || t === true;

    setTheme(themeIsDark);
}

addCardRoot(new HTMLDataCard(), false);
addCardRoot(new CSSDataCard(), false);
addCardRoot(new HTMLNavigationCard(), false);

saveToHistory(false); // Push default state, also don't save just yet

renderCards();

if (window.localStorage.getItem('currentSession')) {
    showModal();
}

function showModal() {
    document.getElementById('modal').classList.remove('hidden');
}
function hideModal() {
    document.getElementById('modal').classList.add('hidden');
}
function restoreSession() {
    try {
        const s = window.localStorage.getItem('currentSession');
        constructNewCardsFrom(JSON.parse(s));
    } catch (error) {
        alert('Failed to restore previous session!');
        console.error(error);
    }
    finally {
        hideModal();
    }
}
function createNew() {
    window.localStorage.removeItem('currentSession');
    hideModal();
}


function preview(prefix = '') {
    var iframe = document.getElementById("window-frame");
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(prefix + getSerializedCards(), "*");
    }
    else
        console.log('It failed....');
}
function downloadPage() {
    preview('PLZ-DONLOAD');
}
function previewNewPage() {
    const base = encodeURIComponent(getSerializedCards());
    const url = window.location.href.replace('index.html', '/src/inmicea-page/index.html?preview=' + base);

    window.open(url, '_blank');
}

function addCard(card, list, save = true) {
    list.push(card);
    allCards.push(card);

    if (save)
        saveToHistory();
}
function addCardRoot(card, save = true) { addCard(card, rootCardlist, save); }
function handleNesting(nesting) {
    if (nesting == null || nesting.id == null)
        return rootCardlist;

    const c = findNestedCard(nesting.id);

    if (c == null)
        return rootCardlist;

    const l = c[nesting.list];

    if (!Array.isArray(l))
        return rootCardlist;

    return l;
}
function getCard(id, arr) {
    return arr.find(c => c.id === id);
}
function findNestedCard(id) {
    return allCards.find(c => c.id === id);
}
function moveCard(id, dir) {
    const c = findNestedCard(id);

    if (c == null) return;

    const array = handleNesting(c.nesting);

    const idx = array.indexOf(getCard(id, array));
    const target = idx - dir;

    if (idx === -1)
        return;

    const min = array === rootCardlist ? 3 : 0;
    if (target < min || target >= array.length)
        return;

    moveTo(array, idx, target);
    saveToHistory();

    //https://stackoverflow.com/questions/34913953/move-an-element-one-place-up-or-down-in-the-dom-tree-with-javascript
    const dom = document.getElementById('card_' + c.id);
    if (dir === 1 && dom.previousElementSibling)
        dom.parentNode.insertBefore(dom, dom.previousElementSibling);
    else if (dir === -1 && dom.nextElementSibling)
        dom.parentNode.insertBefore(dom.nextElementSibling, dom);
}
function deleteCard(id) {
    const c = findNestedCard(id);
    if (c == null) return;

    const array = handleNesting(c.nesting);
    const idx = array.indexOf(c);
    const allIdx = allCards.indexOf(c);

    if (idx === -1 || allIdx === -1)
        return;

    deleteAt(array, idx);
    deleteAt(allCards, allIdx);
    saveToHistory();

    const dom = document.getElementById('card_' + c.id);
    dom.remove();
}
function addCardIntoList(nestId, nestList, card) {
    const array = handleNesting({ id: nestId, list: nestList });
    addCard(card, array);

    let htmlList = null;

    if (nestId == null)
        htmlList = document.getElementById('editor-content');
    else
        htmlList = document.getElementById('card_' + nestId).querySelector(`*[data-list="${nestList}"] .card-container`);

    if (htmlList == null)
        throw new Error("Failed to find nested list!!!");

    const cardHtml = document.createElement('div');
    htmlList.appendChild(cardHtml);
    cardHtml.outerHTML = card.render();
}
function dupeCard(id) {
    const c = findNestedCard(id);
    const array = handleNesting(c.nesting);
    const idx = array.indexOf(c);
    const targetIdx = idx + 1;

    if (c == null || c === -1)
        return;

    const o = JSON.parse(serializeCard(c));
    newIdsForCardObject([o]);
    constructNewCard(o, array);
    // Note: the constructNewCard will always push the card at the end of the array
    const newCard = array.at(-1);
    moveTo(array, array.length - 1, targetIdx);

    const htmlList = document.getElementById('card_' + id).parentElement;
    const cardHtml = document.createElement('div');

    htmlList.insertBefore(cardHtml, htmlList.children[targetIdx]);

    cardHtml.outerHTML = newCard.render();
    saveToHistory();
}
function autofillCard(id) {
    const c = findNestedCard(id);

    if (c == null)
        return;

    switch (c.cardType) {
        case 'ContactElementCard':
            if (c.type === 'telephone' && c.text.length > 6)
                c.link = 'tel:' + c.text.replaceAll(' ', '');
            else if (c.type === 'email')
                c.link = 'mailto:' + c.text.replaceAll(' ', '');
            break;
        default:
            break;
    }

    saveToHistory();
    renderCard(c);
}
function collapseCard(t, id) {
    const c = findNestedCard(id);

    if (!c)
        return;

    t.parentElement.classList.toggle('collapsed');
    c.collapsed = !c.collapsed;
}
function collapseNestedList(t, cardId, list) {
    const c = findNestedCard(cardId);

    if (c == null)
        return;

    const f = list + '_collapsed';
    c[f] = !c[f];
    t.parentElement.classList.toggle('collapsed', c[f]);
}
function updateProperty(t, id, hook) {
    const c = findNestedCard(id);

    if (c == null)
        throw new Error("Failed to get card from id", id, t, hook);

    c[hook] = t.value;
    c.onPropertyUpdate(hook, t.value);
}
function propertyChanged(t, id, hook) {
    saveToHistory();
}
function renderCard(c) {
    const dom = document.getElementById('card_' + c.id);
    dom.outerHTML = c.render();
}
function renderCards() {
    let ihtml = '';
    rootCardlist.forEach(c => ihtml += c.render());
    cardContainer.innerHTML = ihtml;
}

function newIdsForCardObject(c) {
    const handle = (o, nesting) => {
        const myID = generateUUIDv4();
        o.id = myID;

        if (nesting)
            o.nesting = { id: nesting.id, list: nesting.list };

        for (const k in o) {
            if (!Object.hasOwn(o, k)) continue;

            const v = o[k];
            const thisNesting = { id: myID, list: k };

            if (k.endsWith('Cards') && Array.isArray(v)) {
                const nestArray = [];
                v.forEach(x => {
                    handle(x, thisNesting);
                    nestArray.push(x);
                });
                o[k] = nestArray;
            }
        }
    };

    c.forEach(i => handle(i, i.nesting || null));
}
function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function deleteAt(arr, idx) {
    arr.splice(idx, 1);
}
// https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
function moveTo(arr, old_index, new_index) {
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};


function saveToHistory(autoSave = true) {
    console.log('New history pushed!');

    if (historyAt !== history.length - 1 && history.length > 1)
        history.length = historyAt + 1;

    const ser = getSerializedCards();
    history.push(ser);

    if (history.length > 50)
        history.shift();

    historyAt = history.length - 1;

    if (autoSave)
        window.localStorage.setItem('currentSession', ser);
}
function clearHistory() {
    historyAt = 0;
    history = [];
}
function renderCurrentHistory() {
    console.log('Rendered history at: ' + historyAt);
    constructNewCardsFrom(JSON.parse(history[historyAt]));
}
function historyUndo() {
    if (historyAt <= 0 || history.length <= 1)
        return;

    historyAt--;
    renderCurrentHistory();
}
function historyRedo() {
    if (historyAt >= history.length - 1 || history.length <= 1)
        return;

    historyAt++;
    renderCurrentHistory();
}
function serializeCard(c) {
    return JSON.stringify(c, (k, v) => {
        if (['cardTitle', 'icon', 'category'].includes(k) || k.startsWith('_'))
            return undefined;

        return v;
    });
}
function getSerializedCards() {
    return serializeCard(rootCardlist);
}
function constructNewCardsFrom(cards) {
    allCards.length = 0;
    rootCardlist.length = 0;

    cards.forEach(c => constructNewCard(c, rootCardlist));
    renderCards();
}
function constructNewCard(c, array) {
    const n = newCardFromType(c.cardType);

    for (const k in c) {
        if (!Object.hasOwn(c, k)) continue;
        const v = c[k];

        // We found a nested list
        if (k.endsWith('Cards') && Array.isArray(v)) {
            const nestArray = [];
            v.forEach(c => constructNewCard(c, nestArray));
            n[k] = nestArray;
        }
        else
            n[k] = v;
    }

    array.push(n);
    allCards.push(n);
}

window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toUpperCase() === 'Z')
        historyUndo();
    if (e.ctrlKey && e.key.toUpperCase() === 'Y')
        historyRedo();
});

function setTheme(val) {
    themeIsDark = val;

    document.documentElement.classList.toggle('dark-mode', themeIsDark);
    window.localStorage.setItem('theme', themeIsDark);
}
function toggleTheme() {
    setTheme(!themeIsDark);
}

function switchSide() {
    const editor = document.getElementById('editor');
    const viewer = document.getElementById('viewer');

    sideMode++;

    if (sideMode > 2)
        sideMode = 0;

    editor.classList.toggle('hidden', sideMode === 2);
    viewer.classList.toggle('hidden', sideMode === 1);
}