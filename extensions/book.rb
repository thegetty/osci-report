require_relative "book/helpers.rb"
require_relative "book/book_chapter.rb"

module Book
  class BookExtension < Middleman::Extension
    attr_reader :chapters
    attr_reader :info
    self.defined_helpers = [Book::Helpers]

    def initialize(app, options_hash = {}, &block)
      super
      @info = @app.data.book

      app.after_build do |builder|
        # TODO: PDF generation happens here
        generate_pagelist if environment? :pdf
      end
    end

    def after_configuration
      generate_chapters
    end

    # This method should read author info from the book.yml data file and
    # return a properly-formated FirstName Lastname author string.
    # @return [String]
    def author
      info.author_as_it_appears
    end

    # This method should read title info from the book.yml data file and
    # return a properly-formated string with the book's title
    # @return [String]
    def title
      info.title.main
    end

    private
    # Mixes in the BookChapter methods to all Resource objects which contain
    # sort_order in their frontmatter data, and returns them in this order.
    # @return [Array<Middleman::Sitemap::Resource>] an array of resource objects
    # which have been extended with the methods in the BookChapter module.
    def generate_chapters
      contents  = @app.sitemap.resources.find_all { |p| p.data.sort_order }
      @chapters = contents.sort_by { |p| p.data.sort_order }

      # Convert each resource with sort_order into a Book::Chapter and
      # pass a reference to the running BookExtension instance for future use
      chapters.each do |chapter|
        chapter.extend Book::Chapter
        chapter.book = self
      end
    end

    # Generate a list of files to pass to the Prince CLI
    # @return [String]
    def generate_pagelist
      arg_string  = ""
      baseurl     = @app.config.build_dir + "/"
      suffix      = "/index.html"

      chapters.each do |c|
        arg_string += baseurl + c.destination_path.gsub(".html", suffix) + " "
      end

      arg_string
    end
  end

  ::Middleman::Extensions.register(:book, BookExtension)
end
