require_relative "book/helpers.rb"
require_relative "book/book_chapter.rb"

module Book
  class BookExtension < Middleman::Extension
    attr_reader :chapters
    self.defined_helpers = [ Book::Helpers ]
    # expose_to_template :chapters
    # Expose to template is preferred, but as an alternative
    # it is possible to call extensions[:book].chapters for example,
    # in any place where the implied 'self' is the running MM app

    def initialize(app, options_hash = {}, &block)
      super
    end

    def after_configuration
      generate_chapters
    end

    # This method should read author info from the book.yml data file and
    # return a properly-formated FirstName Lastname author string.
    # @return [String]
    def author
      # TODO: add method body
    end

    # This method should read title info from the book.yml data file and
    # return a properly-formated string with the book's title
    # @return [String]
    def title
      # TODO: add method body
    end

    private
    # Mixes in the BookChapter methods to all Resource objects which contain
    # sort_order in their frontmatter data, and returns them in this order.
    # @return [Array<Middleman::Sitemap::Resource>] an array of resource objects
    # which have been extended with the methods in the BookChapter module.
    def generate_chapters
      contents       = @app.sitemap.resources.find_all { |p| p.data.sort_order }
      @chapters      = contents.sort_by { |p| p.data.sort_order }
      @chapters.each { |p| p.extend Book::Chapter }
      @chapters.each { |p| p.book = self }
    end
  end

  ::Middleman::Extensions.register(:book, BookExtension)
end
