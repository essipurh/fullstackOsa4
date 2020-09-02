const Blog = require('../models/blog')
const User = require('../models/user')

const initBlogs = [
    {
        title: "Testi title",
        author: "Mr test",
        url: "www.testit.fi",
        likes: 2
    },
    {
        title: "Jee testaaminen on kivaa",
        author: "Testi Tauno",
        url: "www.testit2.fi",
        likes: 15
    }
]

const blogs_in_db = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}


const users_in_db = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}


module.exports = {
    initBlogs,
    blogs_in_db,
    users_in_db,
  }