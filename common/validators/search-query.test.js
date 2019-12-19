const schema = require('./search-query')

describe('object', () => {
  it('succeeds when object is empty', () => {
    const result = schema.isValidSync({})
    expect(result).toBe(true)
  })

  it('succeeds with invalid parameter', () => {
    const result = schema.isValidSync({
      random_param: 'hello'
    })
    expect(result).toBe(true)
  })
})

describe('page', () => {
  it('fails when page number is less than or equal to zero or a non-number', () => {
    let result = schema.isValidSync({
      page: '-1'
    })
    expect(result).toBe(false)
    result = schema.isValidSync({
      page: '0'
    })
    expect(result).toBe(false)
    result = schema.isValidSync({
      page: 'random_page'
    })
    expect(result).toBe(false)
  })

  it('fails when page number is not an integer', () => {
    const result = schema.isValidSync({
      page: '0.5'
    })
    expect(result).toBe(false)
  })

  it('succeeds when page number is valid', () => {
    const result = schema.isValidSync({
      page: '1'
    })
    expect(result).toBe(true)
  })

  it('fails when article gender is invalid', () => {
    const result = schema.isValidSync({
      article_gender: 'whatever',
    })
    expect(result).toBe(false)
  })
})

describe('article gender', () => {
  it('succeeds when article gender is valid', () => {
    let result = schema.isValidSync({
      article_gender: 'm',
    })
    expect(result).toBe(true)
    
    result = schema.isValidSync({
      article_gender: 'w',
    })
    expect(result).toBe(true)

    result = schema.isValidSync({
      article_gender: 'u',
    })
    expect(result).toBe(true)
  })
})

describe('type', () => {
  it('fails when article type is invalid', () => {
    const result = schema.isValidSync({
      type: 'invalid_type'
    })
    expect(result).toBe(false)
  })

  it('succeeds when article type is valid', () => {
    const result = schema.isValidSync({
      type: 'shirt'
    })
    expect(result).toBe(true)
  })
})

describe('size', () => {
  it('fails when article size is invalid', () => {
    const result = schema.isValidSync({
      size: 'random_size'
    })
    expect(result).toBe(false)
  })

  it('succeeds when article size exists', () => {
    const result = schema.isValidSync({
      size: 's'
    })
    expect(result).toBe(true)
  })
})

describe('waist', () => {
  it('succeeds with positive numbers less than 100', () => {
    let result = schema.isValidSync({
      waist: '30',
    })
    expect(result).toBe(true)

    result = schema.isValidSync({
      waist: '99',
    })
    expect(result).toBe(true)
  })

  it('fails with positive numbers greater than 99', () => {
    const result = schema.isValidSync({
      waist: '100'
    })
    expect(result).toBe(false)
  })

  it('fails with negative numbers', () => {
    const result = schema.isValidSync({
      waist: '-1'
    })
    expect(result).toBe(false)
  })

  it('fails with decimal numbers', () => {
    const result = schema.isValidSync({
      waist: '25.5'
    })
    expect(result).toBe(false)
  })

  it('succeeds with zero', () => {
    const result = schema.isValidSync({
      waist: '0'
    })
    expect(result).toBe(true)
  })
})

describe('inseam', () => {
  it('succeeds with positive numbers less than 100', () => {
    let result = schema.isValidSync({
      inseam: '30',
    })
    expect(result).toBe(true)
    result = schema.isValidSync({
      inseam: '99',
    })
    expect(result).toBe(true)
  })

  it('fails with positive numbers greater than 99', () => {
    const result = schema.isValidSync({
      inseam: '100'
    })
    expect(result).toBe(false)
  })

  it('fails with negative numbers', () => {
    const result = schema.isValidSync({
      inseam: '-1'
    })
    expect(result).toBe(false)
  })

  it('fails with decimal numbers', () => {
    const result = schema.isValidSync({
      inseam: '25.5'
    })
    expect(result).toBe(false)
  })

  it('succeeds with zero', () => {
    const result = schema.isValidSync({
      inseam: '0'
    })
    expect(result).toBe(true)
  })
})

describe('height', () => {
  it('fails when height inches is greater than 99', () => {
    const result = schema.isValidSync({
      height_in: '100'
    })
    expect(result).toBe(false)
  })
})