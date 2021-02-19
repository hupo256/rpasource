const { extname } = require('path')
const CSS_EXTNAMES = ['.css', '.scss', '.sass', '.less']
module.exports = () => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const {
          specifiers,
          source,
          source: { value },
        } = path.node
        if (specifiers.length && CSS_EXTNAMES.includes(extname(value))) {
          /**
           * 在路径末尾加上 css_modules 用于 webpack 匹配该文件，
           * 如 import Test from './test.less'; 变成 import Test from './test.less?css_modules';
           */
          source.value = `${value}?css_modules`
        }
      },
    },
  }
}
