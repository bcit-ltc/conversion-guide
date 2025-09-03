(function ($) {
	$(".preview").each(function () {
		var html = $(this).html();
		$(this).parent().find(".word").after("<section class='html'><pre><code class='language-markup'>" + html + "</code></pre></section>");
	});

	/**
	 * Script:
	 * Automatically formats HTML inside <code class="language-markup">
	 * so that it is ready for display by Prism.js syntax highlighting
	 */
	$("code.language-markup").each(function () {
		var $allTags = $(this).add($(this).find("*"));
		$allTags.removeAttr("data-brackets-id");

		var prismHTML = prismFormat($(this).html());
		$(this).html(prismHTML);
	});

	function prismFormat(html) {
		return beautify(html).split("<").join("&lt;");
	}

	function beautify(html) {
		return style_html(html, {
			'indent_size': 1,
			'indent_char': '	',
			'max_char': 0,
			'unformatted': ['a', 'sub', 'sup', 'strong', 'em']
		});
	}
}(jQuery));
