const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
  })
  

  blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    //const token = getTokenFrom(request)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    //const user = await User.findById(body.userId)

    const blog = new Blog({
      url: body.url,
      title: body.title,
      author: body.author,
      user: user._id,
      likes: body.likes  === undefined ? 0 : body.likes
    })

    const savedBlog = await blog.save()
    user.blogs =user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  })

  blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const userId = decodedToken.id
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === userId.toString())
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
  })

  blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
  
    const blog = {
      likes: body.likes,
    }
  
    const updatedLikes =  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedLikes.toJSON())
  })
  
  module.exports = blogsRouter