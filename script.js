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


function getSerializedCards() {
    return JSON.stringify(rootCardlist, (k, v) => {
        if (['cardTitle', 'icon'].includes(k))
            return undefined;

        return v;
    });
}
function constructNewCardsFrom(cards) {
    allCards.length = 0;
    rootCardlist.length = 0;

    const handleSingleCard = (c, array) => {
        const n = newCardFromType(c.cardType);

        for (const k in c) {
            if (!Object.hasOwn(c, k)) continue;
            const v = c[k];

            // We found a nested list
            if (k.endsWith('Cards') && Array.isArray(v)) {
                const nestArray = [];
                v.forEach(c => handleSingleCard(c, nestArray));
                n[k] = nestArray;
            }
            else
                n[k] = v;
        }

        array.push(n);
        allCards.push(n);
    }

    cards.forEach(c => handleSingleCard(c, rootCardlist));
    renderCards();
}

const TestCardJSON = [
    {
        "id": "27accdcb-3e0f-4fd1-9671-904398132ef1",
        "cardType": "HTMLDataCard",
        "webpageLanguage": "hu",
        "webpageTitle": "Mindent át írok én",
        "webpageAuthor": "Henerész Imréné"
    },
    {
        "id": "71557330-b0df-414b-b4fe-5327a50863e6",
        "cardType": "CSSDataCard",
        "backgroundColor": "#00ff2a",
        "primaryColor": "#75c284",
        "secondaryColor": "#2b4031",
        "fontFamily": "Times New Roman"
    },
    {
        "id": "9ba7f028-fc1a-4827-b642-e276fae06b3c",
        "cardType": "HTMLNavigationCard",
        "leftCards": [
            {
                "id": "85a4b04b-18b4-4534-a659-8f02f35fc832",
                "nesting": {
                    "id": "9ba7f028-fc1a-4827-b642-e276fae06b3c",
                    "list": "leftCards",
                    "level": 0
                },
                "cardType": "HTMLNavmenuCard",
                "type": "dropdown",
                "menuName": "Toplevel",
                "destination": "index.html",
                "subCards": [
                    {
                        "id": "7fe45460-b88d-43f8-995d-5c7aefc2203a",
                        "nesting": {
                            "id": "85a4b04b-18b4-4534-a659-8f02f35fc832",
                            "list": "subCards",
                            "level": 1
                        },
                        "cardType": "HTMLNavmenuCard",
                        "type": "dropdown",
                        "menuName": "sbu1",
                        "destination": "index.html",
                        "subCards": [
                            {
                                "id": "6bf25ab3-0b85-4efa-b95f-216dcea4f2b2",
                                "nesting": {
                                    "id": "7fe45460-b88d-43f8-995d-5c7aefc2203a",
                                    "list": "subCards",
                                    "level": 2
                                },
                                "cardType": "HTMLNavmenuCard",
                                "type": "simple",
                                "menuName": "haniháhá",
                                "destination": "index.html",
                                "subCards": []
                            }
                        ]
                    },
                    {
                        "id": "e48a861c-d0fe-4d81-ac74-42911dc7532d",
                        "nesting": {
                            "id": "85a4b04b-18b4-4534-a659-8f02f35fc832",
                            "list": "subCards",
                            "level": 1
                        },
                        "cardType": "HTMLNavmenuCard",
                        "type": "dropdown",
                        "menuName": "mijszarrrr",
                        "destination": "index.html",
                        "subCards": [
                            {
                                "id": "c6a638e7-4565-4d75-b03a-3f0f40a71a41",
                                "nesting": {
                                    "id": "e48a861c-d0fe-4d81-ac74-42911dc7532d",
                                    "list": "subCards",
                                    "level": 2
                                },
                                "cardType": "HTMLNavmenuCard",
                                "type": "simple",
                                "menuName": "bangladeshi púp",
                                "destination": "index.html",
                                "subCards": []
                            }
                        ]
                    }
                ]
            }
        ],
        "rightCards": [
            {
                "id": "6c0c21d4-4847-4c82-a0be-2dd5071f0736",
                "nesting": {
                    "id": "9ba7f028-fc1a-4827-b642-e276fae06b3c",
                    "list": "rightCards",
                    "level": 0
                },
                "cardType": "HTMLNavmenuCard",
                "type": "simple",
                "menuName": "vatt right",
                "destination": "index.html",
                "subCards": []
            }
        ]
    },
    {
        "id": "e420a426-1512-41b7-81a1-1a598c10db64",
        "cardType": "HeaderCard",
        "title": "My first thingy magasd",
        "description": "This is my very new webpage were i'll show you the cutest articles you'll ever see!\n\n\nTest to see if you are really looking, and if this thingy works or not.:!!",
        "backgroundImg": "https://ideas.darden.virginia.edu/sites/default/files/styles/full_width_1024px_5_3_/public/2024-09/AI%20ART%20ITA.jpg?itok=CIaF2iIX"
    },
    {
        "id": "bedf8689-b7dd-4d98-bf56-baf17172a80d",
        "cardType": "SectionCard",
        "heading": "Kreatív diódák",
        "imageType": "bottom",
        "imageSize": "large",
        "contentCards": [
            {
                "id": "4a3333de-d7f0-43d1-9c55-db0336929920",
                "nesting": {
                    "id": "bedf8689-b7dd-4d98-bf56-baf17172a80d",
                    "list": "contentCards"
                },
                "cardType": "ParagraphCard",
                "text": "adfdfb23qeafgb"
            },
            {
                "id": "b26fa28a-cf2f-4d34-ae07-11320007f146",
                "nesting": {
                    "id": "bedf8689-b7dd-4d98-bf56-baf17172a80d",
                    "list": "contentCards"
                },
                "cardType": "ParagraphCard",
                "text": "qh35rbh"
            },
            {
                "id": "b038b590-679a-431c-a906-d955dff53b0f",
                "nesting": {
                    "id": "bedf8689-b7dd-4d98-bf56-baf17172a80d",
                    "list": "contentCards"
                },
                "cardType": "ListCard",
                "type": "ol",
                "elements": "First item\nSecon45hgq33r5h4qd itemhb\nThird item..345hbgrt.thq"
            }
        ],
        "imageCards": [
            {
                "id": "87787b82-c16b-4d31-9b26-02f06d4cec10",
                "nesting": {
                    "id": "bedf8689-b7dd-4d98-bf56-baf17172a80d",
                    "list": "imageCards"
                },
                "cardType": "ImageCard",
                "image": "https://ideas.darden.virginia.edu/sites/default/files/styles/full_width_1024px_5_3_/public/2024-09/AI%20ART%20ITA.jpg?itok=CIaF2iIX"
            },
            {
                "id": "d8d2e6eb-eed7-433d-bb5d-42cb2a77795c",
                "nesting": {
                    "id": "bedf8689-b7dd-4d98-bf56-baf17172a80d",
                    "list": "imageCards"
                },
                "cardType": "ImageCard",
                "image": "https://ideas.darden.virginia.edu/sites/default/files/styles/full_width_1024px_5_3_/public/2024-09/AI%20ART%20ITA.jpg?itok=CIaF2iIX"
            }
        ]
    },
    {
        "id": "8e0f3c2f-0f12-4bcc-84ed-03b023d91d20",
        "cardType": "SectionCard",
        "heading": "asdadf",
        "imageType": "side",
        "imageSize": "small",
        "contentCards": [
            {
                "id": "cad2c89d-3ae2-4275-9a5c-0a8afa0a6ed8",
                "nesting": {
                    "id": "8e0f3c2f-0f12-4bcc-84ed-03b023d91d20",
                    "list": "contentCards"
                },
                "cardType": "ParagraphCard",
                "text": "Lorem ipsum dolor sit a13fet, went amen at one point :Peqwgwr\ngwEGV\nw\neg4vw"
            }
        ],
        "imageCards": [
            {
                "id": "2836276c-5a26-4eed-b4d7-c18800f63d7f",
                "nesting": {
                    "id": "8e0f3c2f-0f12-4bcc-84ed-03b023d91d20",
                    "list": "imageCards"
                },
                "cardType": "ImageCard",
                "image": "https://ideas.darden.virginia.edu/sites/default/files/styles/full_width_1024px_5_3_/public/2024-09/AI%20ART%20ITA.jpg?itok=CIaF2iIX"
            }
        ]
    },
    {
        "id": "cf5d0479-7906-4f86-86ff-5d90bfb4834a",
        "cardType": "ContactInfoCard",
        "googleMapsLink": "halihó",
        "contentCards": [
            {
                "id": "a490ae0a-784c-4a6e-9150-9fd3c26fcb18",
                "nesting": {
                    "id": "cf5d0479-7906-4f86-86ff-5d90bfb4834a",
                    "list": "contentCards"
                },
                "cardType": "ContactElementCard",
                "type": "telephone",
                "customIcon": "fa-dollar",
                "text": "yxdcf",
                "link": "sdf"
            },
            {
                "id": "3954b95f-5f04-407a-86df-9c3b11949d92",
                "nesting": {
                    "id": "cf5d0479-7906-4f86-86ff-5d90bfb4834a",
                    "list": "contentCards"
                },
                "cardType": "ContactElementCard",
                "type": "facebook",
                "customIcon": "fa-dollar",
                "text": "sdfs",
                "link": "fqwfqwf"
            }
        ]
    },
    {
        "id": "238ddcd4-c3e3-44be-b0ea-d156579f20c5",
        "cardType": "ContactFormCard",
        "text": "Get in contact with usqwfq",
        "name": "true",
        "email": "false",
        "telephone": "true",
        "organization": "false",
        "location": "true",
        "message": "false"
    }
];