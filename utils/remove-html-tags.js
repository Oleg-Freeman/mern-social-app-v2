function removeHtmlTags(html) {
    if (!html || typeof html !== 'string') {
        return '';
    }

    return html.replace(/<\/?[^>]+(>|$)/g, '');
}

module.exports = removeHtmlTags;
