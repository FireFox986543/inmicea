function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function arrayDeleteAt(arr, idx) {
    arr.splice(idx, 1);
}
// https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
function arrayMoveTo(arr, old_index, new_index) {
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};

function cardButtonEligibleForClick(btn) { return btn && btn.computedStyleMap().get('opacity').value > .8; }