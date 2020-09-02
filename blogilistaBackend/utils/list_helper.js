const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const sumLikes = (sum, blog) => {
        return blog.likes + sum
    }
    return blogs.length === 0
      ? 0
      : blogs.reduce(sumLikes,0)
}

const favoriteBlog = (blogs) => {
    const moreLikes = (blog_curr, blog_next) => {
        return blog_curr.likes > blog_next.likes
          ? blog_curr
          : blog_next
    }
    return blogs.length === 0
      ? "there aren't any blogs"
      : blogs.reduce(moreLikes)

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}