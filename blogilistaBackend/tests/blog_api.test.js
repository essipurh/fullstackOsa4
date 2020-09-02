const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')


describe("when some blog posts are saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salainen', 10)
    const user = new User({ username: 'testaaja', passwordHash })

    await user.save()
  })
  /** await Blog.deleteMany({})
  console.log('cleared')

  let blogOb = new Blog(helper.initBlogs[0])
  await blogOb.save()

  blogOb = new Blog(helper.initBlogs[1])
  await blogOb.save()
  })
  */

  //helper functio for user login
 const userLogin = async () => {
  const userLogin = {
    username: 'testaaja',
    password: 'salainen'
  }

  const responseLogin = await api
    .post('/api/login')
    .send(userLogin)

  return responseLogin.body.token
 }


 test('blogs are returned as JSON', async () => {
     await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
 })

 test('the field that identifies a blog is named: id', async () => {
     const response = await api.get('/api/blogs')
     const ids = response.body.map(r => Object.keys(r).filter(k => k === 'id'))
     response.body.map(b => expect(b.id).toBeDefined())
     expect(ids).toHaveLength(helper.initBlogs.length)
 })

 
 test('one post method increases ther bloglist length by 1', async () => {
     const token = await userLogin()

     const newBlog = {
      url: "www.blogit.fi/testaaja",
      title: "testaajan alkeet 101",
      author: "tester"
     }

     await api
       .post('/api/blogs')
       .set('Authorization', `bearer ${token}`)
       .send(newBlog)
       .expect(200)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initBlogs.length + 1)
 })

 test('post method test -> blog list includes posted blog', async () => {
   const token = await userLogin()
    const newBlog = {
       title: "JPost test blog",
       author: "Testaaja",
       url: "www.testit2.fi",
       likes: 0
    }

    await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(200)

   const responseTitles = await (await api.get('/api/blogs')).body.map(b => b.title)
   expect(responseTitles).toContain("JPost test blog")
  })

  test('if field "likes" isn not given any value, it gets value 0', async () => {
    const token = await userLogin()
    const newBlog = {
       title: "JPost test blog",
       author: "Testaaja",
       url: "www.testit2.fi",
    }

    await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(200)

    const response = await api.get('/api/blogs')
    const likes = response.body[helper.initBlogs.length].likes
    expect(likes).toBe(0)

  })

  test('blog post without title --> response 400 bad requets', async () => {
    const token = await userLogin()
    const newBlog = {
        author: "Testaaja",
        url: "www.testit2.fi",
        likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)

  })

  test('blog post without a token --> response 401 Unauthorized ', async () => {
    const newBlog = {
        author: "Testaaja",
        url: "www.testit2.fi",
        likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('a blog post can be deleted', async () => {
    const token = await userLogin()
    const newBlog = {
       title: "JPost test blog",
       author: "Testaaja",
       url: "www.testit2.fi",
    }

    await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(200)

    const response = await api.get('/api/blogs')
    delId = response.body[helper.initBlogs.length].id
    await api
      .delete(`/api/blogs/${delId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)
  
    const blogsLeft= await helper.blogs_in_db()
  
    expect(blogsLeft.length).toBe(
      helper.initBlogs.length
    )
  
    const blogs = blogsLeft.map(b => b.title)
  
    expect(blogs).not.toContain(newBlog.title)
  })

  test('likes are updated for a blog post', async () => {
    const blogs= await helper.blogs_in_db()
    const blog = blogs[0]

    const updated = { ...blog, likes:20 }

    await api
      .put(`/api/blogs/${blog.id}`)
      .send(updated)
      .expect(200)
    
    blogsUpdated = await helper.blogs_in_db()
    //console.log(blogsUpdated)

    expect(blogsUpdated[0].likes).toBe(20)
  })
})

describe('when users at the database', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.users_in_db()

    const newUser = {
      username: 'eLaamanen',
      name: 'Emma Laamanen',
      password: 'emma1234',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.users_in_db()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation of a user with faulty username not allowed', async ()  => {
    const usersAtStart = await helper.users_in_db()

    const newUser = {
      name: 'Emma Laamanen',
      password: 'emma1234',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    const userShort = {
      username: 'e',
        name: 'Emma Laamanen',
        password: 'emma1234',
    }
  
    await api
      .post('/api/users')
      .send(userShort)
      .expect(400)
    
      const userSame = {
        username: usersAtStart[0].username,
        name: 'Emma Laamanen',
        password: 'emma1234',
      }
    
      await api
        .post('/api/users')
        .send(userSame)
        .expect(400)
  })

  test('creation of a password less than 3 characters not allowed', async ()  => {

    const newUser = {
      username: 'eLaamanen',
      name: 'Emma Laamanen',
      password: '',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

})

 afterAll(() => {
     mongoose.connection.close()
 })