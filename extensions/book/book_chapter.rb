# A module that adds chapter-specific methods to Resources.
# This is heavily inspired by the BlogArticle module in
# the official Middleman-Blog extension:
# https://github.com/middleman/middleman-blog/blob/master/lib/middleman-blog/blog_article.rb
module Book
  module Chapter
    # Chapters have a @book instance variable that points back to the active BookExtension
    # instance which created them. This is necesary so the chapters can compare themselves
    # to one another in order for the next and previous methods to work, etc.
    # Since Chapter is a Module and not a class (the underlying class is a standard
    # Middleman::Sitemap::Resource object), there is no initialize method to run on instantiation.

    # TODO: Implement some kind of accesss control for book=, this should prob not be public
    attr_accessor :book

    # self.extended callback
    # This code runs every time the module is extended into an object instance
    # def self.extended(base)
    #   puts "Module #{self} is being used by #{base}"
    #   puts base.metadata
    # end

    # The title of the chapter, set in frontmatter
    # @return [String]
    def title
      data.title
    end

    # The author of the chapter, set in frontmatter
    # If no author is set, the value set globally in the book.yml file is used instead
    # @return [String]
    def author
      data.author || @book.author
    end

    def rank
      data.sort_order
    end

    # The body of the chapter, in HTML (no layout). This is for
    # alternate presentation formats like RSS, may also be useful
    # in EPUB generation.
    # @return [String]
    def body
      render layout: false
    end

    # Returns the next chapter object, or false if this is the last chapter
    # @return [Middleman::Sitemap::Resource]
    def next_chapter
      @book.chapters.find { |p| p.rank > self.rank }
    end

    # Returns the previous chapter object, or false if this is the first chapter
    # @return [Middleman::Sitemap::Resource]
    def prev_chapter
      @book.chapters.find { |p| p.rank < self.rank }
    end
  end
end

