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
      },
      height: {
        '580': '580px'
      },
      padding: {
        '1/2': '0.125rem'
      }
    }
  },
  variants: {
    borderWidth: ['responsive', 'last', 'hover', 'focus'],
    opacity: ['disabled'],
    cursor: ['disabled']
  }
}
