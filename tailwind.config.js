module.exports = {
  theme: {
    extend: {
      maxHeight: {
        '100': '100px',
        '200': '200px',
        '300': '300px'
      },
      maxWidth: {
        '100': '100px'
      }
    }
  },
  variants: {
    borderWidth: ['responsive', 'last', 'hover', 'focus'],
  }
}
