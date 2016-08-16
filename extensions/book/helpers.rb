module Book
  module Helpers

    # Determine if current page is a chapter (i.e. a Sitemap::resource w/sort_order)
    # By default it checks the value of current_page; can accept any resource object as well
    # @return [Boolean]
    # def page_is_chapter?
    #   return false unless current_page.data.sort_order
    #   true
    # end

    # Determine if there is a chapter before the current page
    # @return Middleman::Sitemap::Resource of the previous page
    def prev_chapter_path
      return false unless current_page.is_a? Book::Chapter
      current_page.prev_chapter
    end

    # Determine if there is a chapter after the current page
    # @return Middleman::Sitemap::Resource of the next page
    def next_chapter_path
      return false unless current_page.is_a? Book::Chapter
      current_page.next_chapter
    end

    def define_term(word)
      term = data.definitions.find { |entry| entry.id == word }
      if term
        # term is singular
        definition = term.definition_short || term.definition
      else
        term = data.definitions.find { |entry| entry.plural == word }
        unless term.nil?
          definition = "Plural of the word <em>#{term.id}</em>: "
          definition += term.definition_short || term.definition
        end
      end

      definition unless definition.nil?
    end

  end
end
