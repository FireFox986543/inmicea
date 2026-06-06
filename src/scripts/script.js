const allCards = [];
const rootCardlist = [];
const cardContainer = document.getElementById('editor-content');

let history = [];
let historyAt = 0;

function preview(prefix = '') {
    var iframe = document.getElementById("window-frame");
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(prefix + serializeAllCards(), "*");
    }
    else
        console.log('It failed....');
}
function downloadPage() {
    preview('PLZ-DONLOAD');
}
function previewNewPage() {
    const data = encodeURIComponent(serializeAllCards());
    let url = window.location.href;

    if (url.endsWith('.html'))
        url = url.replace('index.html', '');

    if (url.endsWith('/'))
        url = url.substring(0, url.length - 1);

    url += '/src/inmicea-page/index.html?preview=' + data;
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
function moveCard(el, id, dir) {
    if (!cardButtonEligibleForClick(el))
        return;

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

    arrayMoveTo(array, idx, target);
    saveToHistory();

    //https://stackoverflow.com/questions/34913953/move-an-element-one-place-up-or-down-in-the-dom-tree-with-javascript
    const dom = document.getElementById('card_' + c.id);
    if (dir === 1 && dom.previousElementSibling)
        dom.parentNode.insertBefore(dom, dom.previousElementSibling);
    else if (dir === -1 && dom.nextElementSibling)
        dom.parentNode.insertBefore(dom.nextElementSibling, dom);
}
function deleteCard(el, id) {
    if (!cardButtonEligibleForClick(el))
        return;

    const c = findNestedCard(id);
    if (c == null) return;

    const array = handleNesting(c.nesting);
    const idx = array.indexOf(c);
    const allIdx = allCards.indexOf(c);

    if (idx === -1 || allIdx === -1)
        return;

    arrayDeleteAt(array, idx);
    arrayDeleteAt(allCards, allIdx);
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
function dupeCard(el, id) {
    if (!cardButtonEligibleForClick(el))
        return;

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
    arrayMoveTo(array, array.length - 1, targetIdx);

    const htmlList = document.getElementById('card_' + id).parentElement;
    const cardHtml = document.createElement('div');

    htmlList.insertBefore(cardHtml, htmlList.children[targetIdx]);

    cardHtml.outerHTML = newCard.render();
    saveToHistory();
}
function copyCard(id) {
    const c = findNestedCard(id);

    if (!c)
        return;

    window.localStorage.setItem('clipboard', serializeCard(c));
    console.log('Copied card ', c, serializeCard(c));
}
function pasteCard(id) {
    const targetCard = findNestedCard(id);
    const cb = window.localStorage.getItem('clipboard');

    if (!cb || !targetCard)
        return;

    const o = JSON.parse(cb);

    if (o.cardType !== targetCard.cardType) {
        /* hdqadgf  invalid_paste*/
        return;
    }

    o.id = targetCard.id;
    newIdsForCardObject([o], false);

    for (const k in o) {
        if (!Object.hasOwn(o, k)) continue;
        const v = o[k];

        // We found a nested list
        if (k.endsWith('Cards') && Array.isArray(v)) {
            const nestArray = [];
            v.forEach(c => constructNewCard(c, nestArray));
            targetCard[k] = nestArray;
        }
        else if (k !== 'id')
            targetCard[k] = v;
    }

    renderCard(targetCard);
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
function collapseExpandAll() {
    let allCollapsed = rootCardlist.every(c => c.collapsed);
    rootCardlist.forEach(c => {
        if (c.collapsed === allCollapsed) {
            c.collapsed = !allCollapsed
            document.getElementById('card_' + c.id).classList.toggle('collapsed', c.collapsed);
        }
    });
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
function renderAllCards() {
    let ihtml = '';
    rootCardlist.forEach(c => ihtml += c.render());
    cardContainer.innerHTML = ihtml;
}

function newIdsForCardObject(c, topLevelNewId = true) {
    const handle = (o, nesting, tlni = true) => {
        const myID = tlni ? generateUUIDv4() : o.id;
        o.id = myID;

        if (nesting)
            o.nesting = { id: nesting.id, list: nesting.list };

        for (const k in o) {
            if (!Object.hasOwn(o, k)) continue;

            const v = o[k];

            if (k.endsWith('Cards') && Array.isArray(v)) {
                const thisNesting = { id: myID, list: k };
                const nestArray = [];
                v.forEach(x => {
                    handle(x, thisNesting, true);
                    nestArray.push(x);
                });
                o[k] = nestArray;
            }
        }
    };

    // The top level new id determines whether the first level of cards should get new ids
    // This is used for card pasting
    c.forEach(i => handle(i, i.nesting || null, topLevelNewId));
}

function saveToHistory(autoSave = true) {
    console.log('New history pushed!');

    if (historyAt !== history.length - 1 && history.length > 1)
        history.length = historyAt + 1;

    const ser = serializeAllCards();
    history.push(ser);

    if (history.length > 50)
        history.shift();

    historyAt = history.length - 1;

    if (autoSave) {
        if (currentProject == null) {
            window.localStorage.setItem('draftProject', ser);
            currentDirty = true;
        }
        else
            saveCurrentProject();
    }
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
function serializeAllCards() {
    return serializeCard(rootCardlist);
}
function constructNewCardsFrom(cards) {
    allCards.length = 0;
    rootCardlist.length = 0;

    cards.forEach(c => constructNewCard(c, rootCardlist));
    renderAllCards();
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
