import autocorrect from 'autocorrect-node';
import url from "url";
import path from "path";
import fs from "fs-extra";
import Parse from 'args-parser'
import metadataParser from 'markdown-yaml-metadata-parser';
import { marked } from 'marked';
import {getTranslatedHtml} from './google-trans.js'
import { NodeHtmlMarkdown } from 'node-html-markdown';

const PEOPLE_DIR = 'people'

const projectRoot = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)));
const peopleDir = path.join(projectRoot, PEOPLE_DIR);

type lang = 'zh-CN' | 'en' | 'zh-TW'

const m = {
    'zh-CN': '',
    'en': '.en',
    'zh-TW': '.zh_hant'
}

const args = Parse(process.argv)

console.log(args)

function translateFile(id: string, from: lang, to: lang) {
    const raw = fs.readFileSync(path.join(peopleDir, id, `page${m[from]}.md`)).toString()
    let md = metadataParser(raw).content
    const metadata = metadataParser(raw).metadata
    md = autocorrect.formatFor(md, 'markdown')
    let html = marked.parse(md) as string
    html = getTranslatedHtml(html, to)
    const td = NodeHtmlMarkdown.translate(html)
    fs.writeFileSync(path.join(peopleDir, id, `page${m[to]}.md`), td)
}

if (!(args['from'] && args['to'] && args['id'])) {
    throw new Error('args should be --from=from --to=to --id=id')
}

translateFile(args['id'], args['from'], args['to'])