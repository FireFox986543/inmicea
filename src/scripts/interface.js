let modalActions = [];

const theme = {
    themeIsDark: false,
    sideMode: 0,

    initializeSettings: () => {
        let t = window.localStorage.getItem('theme');

        if (t != null)
            theme.themeIsDark = t === 'true' || t === true;

        theme.setTheme(theme.themeIsDark);
    },
    setTheme: (val) => {
        theme.themeIsDark = val;

        document.documentElement.classList.toggle('dark-mode', theme.themeIsDark);
        window.localStorage.setItem('theme', theme.themeIsDark);
    },
    toggleTheme: () => {
        theme.setTheme(!theme.themeIsDark);
    },
};
theme.initializeSettings();

const interface = {
    switchSide: () => {
        const editor = document.getElementById('editor');
        const viewer = document.getElementById('viewer');

        theme.sideMode++;

        if (theme.sideMode > 2)
            theme.sideMode = 0;

        editor.classList.toggle('hidden', theme.sideMode === 2);
        viewer.classList.toggle('hidden', theme.sideMode === 1);
    },
    toggleSidebar: (t) => {
        t.parentElement.classList.toggle('collapsed');
    },
};

const modals = {
    showModal: (title, desc, buttons) => {
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');

        modal.querySelector('h1').textContent = translate(title);
        modal.querySelector('p').textContent = translate(desc);

        buttons = buttons && Array.isArray(buttons) && buttons.length > 0 ? buttons : [['ok', () => { }]];

        let b = document.getElementById('modal-button-0');
        b.textContent = translate(buttons[0][0])
        modalActions[0] = buttons[0][1];

        b = document.getElementById('modal-button-1');

        if (buttons.length === 2) {
            b.classList.remove('hidden');
            b.textContent = translate(buttons[1][0])
            modalActions[1] = buttons[1][1];
        }
        else
            b.classList.add('hidden');
    },
    hideModal: () => {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
    },
    modalButtonClicked: (btn) => {
        const act = modalActions[btn];
        if (act && typeof act === 'function') {
            const r = act();

            if (r !== 1123)
                modals.hideModal();
        }
    }
};


window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toUpperCase() === 'Z')
        historyUndo();
    else if (e.ctrlKey && e.key.toUpperCase() === 'Y')
        historyRedo();
    else if (e.ctrlKey && e.key.toUpperCase() === 'S') {
        saveBtnClick();
        e.preventDefault();
    }
});