import settings from '@/settings'
import marked from 'marked'

export function stringToExamples(value) {
  if (!value) return []
  const reg = '<input>([\\s\\S]+?)</input><output>([\\s\\S]+?)</output>'
  const re = RegExp(reg, 'g')
  const objList = []
  let tmp
  // eslint-disable-next-line no-cond-assign
  while (tmp = re.exec(value)) {
    objList.push({ input: tmp[1], output: tmp[2] })
  }
  return objList
}

export function examplesToString(objList) {
  if (!objList) return ''
  let result = ''
  for (const obj of objList) {
    result += '<input>' + obj.input + '</input><output>' + obj.output + '</output>'
  }
  return result
}

export function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${settings.title}`
  }
  return settings.title
}

export function markdownToHtml(markdown) {
  if (!markdown) return ''
  return marked(markdown)
}

// 去掉值为空的项，返回object
export function filterEmptyValue(object) {
  const query = {}
  Object.keys(object).forEach(key => {
    if (object[key] || object[key] === 0 || object[key] === false) {
      query[key] = object[key]
    }
  })
  return query
}
