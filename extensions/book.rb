require_relative "book/helpers.rb"

class Book < Middleman::Extension
  expose_to_template :chapters
  # Expose to template is preferred, but as an alternative
  # it is possible to call extensions[:book].chapters for example,
  # in any place where the implied 'self' is the running MM app

  def initialize(app, options_hash = {}, &block)
    super
  end

  # Retrieve a list of chapters (pages with sort_order metadata defined).
  # @return [Array<Middleman::Sitemap::Resource] an array of resource objects
  def chapters
    contents = @app.sitemap.resources.find_all { |p| p.data.sort_order }
    contents.sort_by { |p| p.data.sort_order }
  end
end

::Middleman::Extensions.register(:book, Book)
