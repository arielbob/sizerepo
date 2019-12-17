export const handleNumberChange = (formik, name, limit) => {
  return (e) => {
    const { value } = e.target
    if (!value || (value.trim().length <= limit && !isNaN(value))) {
      formik.setFieldValue(name, value)
    }
  }
}

export const buildSizingString = (article_size, article_waist, article_inseam) => {
  if (article_size !== null) return article_size.toUpperCase()
  if (article_waist !== null && article_inseam !== null) return (article_waist + 'x' + article_inseam)
  if (article_waist !== null) return article_waist
  return 'No Size'
}

export const capFirst = (word) => {
  if (word && word[0]) {
    return word[0].toUpperCase() + word.substring(1)
  }
  return word
}
