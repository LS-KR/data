
type lang = 'zh-CN' | 'en' | 'zh-TW'

export function getTranslatedHtml(html: string, l: lang) {
    const u = translate(html, l);
    return u[0][0];
}

type transResponse = [[string],[string]]

function translate(html: string, l: lang): transResponse {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://translate-pa.googleapis.com/v1/translateHtml', false);
    xhr.setRequestHeader("Content-Type", "application/json+protobuf");
    xhr.setRequestHeader("x-goog-api-key", "AIzaSyATBXajvzQLTDHEQbcpq0Ihe0vWDHmO520");
    xhr.send(JSON.stringify([[html, "auto", l], "te_lib"]));
    return JSON.parse(xhr.responseText) as transResponse;
}