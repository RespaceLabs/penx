import axios from 'axios'
import qs from 'qs'
import { getToken } from './googleToken'
import { getCode, isSupported } from './languages'
import { getUserAgent } from './utils'

interface Options {
  from?: string
  to?: string
  tld?: string
  client?: string
  raw?: boolean
}
interface Result {
  text: string
  textArray: string[]
  pronunciation: string
  hasCorrectedLang: boolean // has correct source language?
  src: string // source language
  hasCorrectedText: boolean // has correct source text?
  correctedText: string // correct source text
  translations: [] // multiple translations
  raw: []
}

/**
 * Translation
 * @param text - The text to be translated.
 * @param options - The translation options. If the param is string, mean the language you want to translate into. If the param is object，can set more options.
 */
function googletrans(text: string | string[], options?: string | Options) {
  let a: any
  if (typeof options === 'string') {
    a = { to: options }
  } else {
    a = options
  }
  return translate(text, a)
}

/**
 *
 * @param text The text to be translated
 * @param opts Options
 * @returns
 */
async function translate(text: string | string[], opts?: Options) {
  let _opts = opts || {}
  let _text = text
  let e: Error
  const FROMTO = [_opts['from'], _opts['to']]

  FROMTO.forEach((lang) => {
    if (lang && !isSupported(lang)) {
      e = new Error(`The language 「${lang}」is not suppored!`)
      throw e
    }
  })

  if (Array.isArray(_text)) {
    let str = ''
    for (let i = 0; i < _text.length; i++) {
      const t = _text[i]
      if (t.length === 0 && i === 0) {
        const e = new Error(
          'The first element of the text array is an empty string.',
        )
        throw e
      } else {
        str += t + '\n'
      }
    }
    _text = str
  }

  if (_text.length === 0) {
    e = new Error(`The text to be translated is empty!`)
    throw e
  }
  if (_text.length > 15000) {
    e = new Error(`The text is over the maximum character limit ( 15k )!`)
    throw e
  }

  _opts.from = _opts.from || 'auto'
  _opts.to = _opts.to || 'en'
  _opts.tld = _opts.tld || 'com'
  _opts.client = _opts.client || 't'

  _opts.from = getCode(_opts.from)
  _opts.to = getCode(_opts.to)
  const URL = 'https://translate.google.' + _opts.tld + '/translate_a/single'
  const TOKEN = getToken(_text)

  const PARAMS = {
    client: _opts.client,
    sl: _opts.from,
    tl: _opts.to,
    hl: 'en',
    dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
    ie: 'UTF-8',
    oe: 'UTF-8',
    otf: 1,
    ssel: 0,
    tsel: 0,
    kc: 7,
    q: _text,
    tk: TOKEN,
  }

  const HEADERS = {
    'User-Agent': getUserAgent(),
    'Accept-Encoding': 'gzip',
  }

  const res = await axios({
    // adapter,
    url: URL,
    params: PARAMS,
    headers: HEADERS,
    timeout: 3 * 1000,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
  })

  const result = getResult(res)
  const { raw, ...rest } = result
  if (opts?.raw) return result
  return rest
}

function getResult(res: any): Result {
  let result: Result = {
    text: '',
    textArray: [],
    pronunciation: '',
    hasCorrectedLang: false,
    src: '',
    hasCorrectedText: false,
    correctedText: '',
    translations: [],
    raw: [],
  }

  if (res === null) return result
  if (res.status === 200) result.raw = res.data
  const body = res.data
  body[0].forEach((obj: string) => {
    if (obj[0]) {
      result.text += obj[0]
    }
    if (obj[2]) {
      result.pronunciation += obj[2]
    }
  })

  if (body[2] === body[8][0][0]) {
    result.src = body[2]
  } else {
    result.hasCorrectedLang = true
    result.src = body[8][0][0]
  }

  if (body[1] && body[1][0][2]) result.translations = body[1][0][2]

  if (body[7] && body[7][0]) {
    let str = body[7][0]
    str = str.replace(/<b><i>/g, '[')
    str = str.replace(/<\/i><\/b>/g, ']')
    result.correctedText = str

    if (body[7][5]) result.hasCorrectedText = true
  }

  if (result.text.indexOf('\n') !== -1) {
    result.textArray = result.text.split('\n')
  } else {
    result.textArray.push(result.text)
  }
  return result
}

export default googletrans
export { googletrans, translate, getResult }
