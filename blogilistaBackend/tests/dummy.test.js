const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
    
  test('of empty list is zero', () => {
      expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog equals the like of that', () => {
      const test_oneBlog = [
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "kissat vieköön",
            author: "Antti-Jussi",
            url: "http://localhost:3001",
            likes: 3,
            __v: 0
        }
      ]

      expect(listHelper.totalLikes(test_oneBlog)).toBe(3)
  })

  test('of bigger list is calculated right', () => {
    const test_blogs = [
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "kissat vieköön",
            author: "Antti-Jussi",
            url: "http://localhost:3001",
            likes: 3,
            __v: 0
        },
        {
            _id: "5a422aa71b54a676234d17f9",
            title: "kissat vieköön 2",
            author: "Marja-Leena",
            url: "http://localhost:3001",
            likes: 5,
            __v: 0
        },
        { 
            _id: "5a422bc61b54a676234d17fc", 
            title: "Type wars", 
            author: "Robert C. Martin", 
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
            likes: 2, 
            __v: 0
        }
    ]

    expect(listHelper.totalLikes(test_blogs)).toBe(10)
  })
})

describe('favorite blog', () => {
  test('of empty list is there arent any blogs', () => {
    expect(listHelper.favoriteBlog([])).toEqual("there aren't any blogs")
})
  test('list of one blog equals that blog', () => {
    const test_oneBlog = [
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "kissat vieköön",
            author: "Antti-Jussi",
            url: "http://localhost:3001",
            likes: 3,
            __v: 0
        }
      ]

    expect(listHelper.favoriteBlog(test_oneBlog)).toEqual(test_oneBlog[0])
  })
    test('list with more than 1 blog returnes teh one with most likes', () => {
      const test_blogs = [
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "kissat vieköön",
            author: "Antti-Jussi",
            url: "http://localhost:3001",
            likes: 3,
            __v: 0
        },
        {
            _id: "5a422aa71b54a676234d17f9",
            title: "kissat vieköön 2",
            author: "Marja-Leena",
            url: "http://localhost:3001",
            likes: 5,
            __v: 0
        },
        { 
            _id: "5a422bc61b54a676234d17fc", 
            title: "Type wars", 
            author: "Robert C. Martin", 
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", 
            likes: 2, 
            __v: 0
        }
    ]

    expect(listHelper.favoriteBlog(test_blogs)).toEqual(test_blogs[1])
    })
})