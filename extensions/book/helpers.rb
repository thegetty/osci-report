class Book < Middleman::Extension
  helpers do

    # Determine if current page is a chapter (i.e. a Sitemap::resource w/sort_order)
    # By default it checks the value of current_page; can accept any resource object as well
    # @return [Boolean]
    def page_is_chapter?
      return false unless current_page.data.sort_order
      true
    end

    # Determine if there is a chapter before the current page
    # @return Middleman::Sitemap::Resource of the previous page
    def prev_chapter_path
      return false unless page_is_chapter?
      min  = chapters.min_by { |p| p.data.sort_order }
      curr = current_page.data.sort_order
      return false unless curr > min.data.sort_order

      prev_chap = sitemap.resources.find { |p| p.data.sort_order == curr - 1 }
      prev_chap ? prev_chap : false
    end

    # Determine if there is a chapter after the current page
    # @return Middleman::Sitemap::Resource of the next page
    def next_chapter_path
      return false unless page_is_chapter?
      max  = chapters.max_by { |p| p.data.sort_order }
      curr = current_page.data.sort_order
      return false unless curr < max.data.sort_order

      next_chap = sitemap.resources.find { |p| p.data.sort_order == curr + 1 }
      next_chap ? next_chap : false
    end
  end
end
