export function getTranslate(result, cur_lang) {
    if (result) {
        for (let item of result) {
            if (item.language === cur_lang) {
                return item;
            }
        }
    }
    return "";
}
