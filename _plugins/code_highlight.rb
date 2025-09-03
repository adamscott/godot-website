# frozen_string_literal: true

require 'English'

module Jekyll
  # Definition of the filters.
  module CodeHighlightFilters
    def highlight_code(input)
      new_input = input
      last_code_block_end = 0
      until (code_block = find_next_code_block(new_input, last_code_block_end)).nil?
        unless code_block.valid?
          last_code_block_end = code_block.end
          next
        end

        new_input = (new_input[0..code_block.begin - 1] || '') \
                    + replace_highlights(code_block.contents, block: code_block.block?) \
                    + (new_input[code_block.end..] || '')
        last_code_block_end = 0
      end
      new_input
    end

    private

    CodeBlock = Struct.new(:begin, :end, :delimiter, :data, :type) do
      def valid?
        !((delimiter == '`' && !block?) || (delimiter == '```' && block?))
      end

      def block?
        data.start_with?('\n')
      end

      def contents
        return unindent(data) if block?

        data
      end

      private

      def unindent(str)
        str.gsub(/^#{str.scan(/^\s+/).min}/, '')
      end
    end

    def find_next_code_block(input, from, delimiter = '`')
      code_block_start_regex = Regexp.new("(?:#{delimiter})+")
      from_substr_start = input[from..]
      code_block_start_match = code_block_start_regex.match(from_substr_start)
      return nil if code_block_start_match.nil?

      code_block_start_begin = from + code_block_start_match.begin(0)
      code_block_start_end = from + code_block_start_match.end(0)
      code_block_delimiter = code_block_start_match[0]

      code_block_end_regex = Regexp.new("(?<!`)#{code_block_delimiter}(?!`)")
      from_substr_end = input[code_block_start_end..]
      code_block_end_match = code_block_end_regex.match(from_substr_end)
      return nil if code_block_end_match.nil?

      code_block_end_begin = code_block_start_end + code_block_end_match.begin(0)
      code_block_end_end = code_block_start_end + code_block_end_match.end(0)

      code_block_data = input[code_block_start_end..code_block_end_begin - 1]

      CodeBlock.new(begin: code_block_start_begin, end: code_block_end_end, delimiter: code_block_delimiter,
                    data: code_block_data)
    end

    def replace_highlights(input, block: false)
      return input if input.empty?

      highlights_regex = /@\[(?<content>.+?)\]\((?<type>.+?)\)/
      num_highlights = input.scan(highlights_regex).length

      highlight_only = input.gsub(highlights_regex, '') == ''

      highlights_result = input.gsub(highlights_regex) do |_match|
        classes = []
        classes.push('code-highlight') if num_highlights == 1 && !block
        classes.push($LAST_MATCH_INFO[:type])

        "<span class=\"#{classes.join(' ')}\">#{$LAST_MATCH_INFO[:content]}</span>"
      end

      return "<code class=\"highlight\">#{highlights_result.gsub('\n', '<br>')}</code>" if block

      return "<span class=\"code-highlight\">#{highlights_result}</span>" unless highlight_only && num_highlights == 1

      highlights_result
    end
  end
end

Liquid::Template.register_filter(Jekyll::CodeHighlightFilters)
