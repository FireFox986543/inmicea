const allCards = [];
const rootCardlist = [];
const cardContainer = document.getElementById('editor-content');

addCardRoot(new HTMLDataCard());
addCardRoot(new CSSDataCard());
addCardRoot(new HTMLNavigationCard());

renderCards();

function appendMsg() {
    console.log('It ran...');

    var iframe = document.getElementById("window-frame");
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(Math.random().toString() + ' Hi!!!', "*");
    }
    else
        console.log('It failed....');
}

function addCard(card, list) {
    list.push(card);
    allCards.push(card);
}
function addCardRoot(card) { addCard(card, rootCardlist); }
function handleNesting(nestId, nestList) {
    const c = findNestedCard(nestId);

    if (nestId === 'null' || c == null)
        return rootCardlist;

    const l = c[nestList];

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
function moveCard(id, dir, nestId, nestList) {
    const array = handleNesting(nestId, nestList);

    const idx = array.indexOf(getCard(id, array));
    const target = idx - dir;

    if (idx === -1)
        return;

    const min = array === rootCardlist ? 3 : 0;
    if (target < min || target >= array.length)
        return;

    moveTo(array, idx, target);
    renderCards();
}
function deleteCard(id, nestId, nestList) {
    const array = handleNesting(nestId, nestList);
    const c = getCard(id, array);
    const idx = array.indexOf(c);
    const allIdx = allCards.indexOf(c);

    if (idx === -1 || allIdx === -1)
        return;

    deleteAt(array, idx);
    deleteAt(allCards, allIdx);
    renderCards();
}
function addCardIntoList(nestId, nestList, card) {
    const array = handleNesting(nestId, nestList);
    addCard(card, array);

    renderCards();
}
function dupeCard(id, nestId, nestList) {
    const array = handleNesting(nestId, nestList);

    const c = getCard(id, array);
    const idx = array.indexOf(c);

    if (c == null || c === -1)
        return;

    const newCard = c.clone();
    newCard.id = generateUUIDv4();
    array.splice(idx + 1, 0, newCard);
    allCards.push(newCard);
    renderCards();
}
function updateProperty(t, id, nestId, nestList, hook) {
    const array = handleNesting(nestId, nestList);
    const c = this.getCard(id, array);

    if (c == null)
        throw new Error("Failed to get card from id", id, t, hook);

    c[hook] = t.value;
    c.onPropertyUpdate(hook, t.value);
}
function renderCards() {
    cardContainer.innerHTML = '';
    rootCardlist.forEach(c => cardContainer.innerHTML += c.render());
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