require_relative "book/helpers.rb"
require_relative "book/book_chapter.rb"

module Book
  class BookExtension < Middleman::Extension
    self.defined_helpers = [Book::Helpers]
    option :pdf_output_path, "dist/book.pdf", "Where to write generated PDF"
    option :prince_cli_flags, "--no-artificial-fonts", "Command-line flags for Prince PDF utility"

    # @return [Array<Middleman::Sitemap::Resource>] an array of resource objects
    # which have been extended with the methods in the BookChapter module.
    attr_reader :chapters

    # @return [Middleman::Util::EnhancedHash] with the contents of the book.yml data file
    attr_reader :info

    def initialize(app, options_hash = {}, &block)
      super
      @info = @app.data.book

      # PDF Generation via Prince CLI
      app.after_build do |builder|
        book = app.extensions[:book]
        book.generate_pdf if environment? :pdf
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

    # Calls the Prince CLI utility with args based on extension options
    # @return +nil+
    def generate_pdf
      pagelist = generate_pagelist
      output   = options.pdf_output_path
      flags    = options.prince_cli_flags
      puts `prince #{pagelist} -o #{output} #{flags}`
    end

    # Generate a list of files to pass to the Prince CLI
    # @return [String]
    def generate_pagelist
      arg_string  = ""
      baseurl     = @app.config.build_dir + "/"
      chapters.each { |c| arg_string += baseurl + c.destination_path + " " }
      arg_string
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
  end

  ::Middleman::Extensions.register(:book, BookExtension)
end
