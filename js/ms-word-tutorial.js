(function ($) {
	convertHotspots();
	attachListeners();

	function convertHotspots() {
		$(".word-tools").each(function () {
			var $display = $("<div>");
			var $img = $(this).children("img");
			var $table = $(this).find("table");
			var $rows = $table.children("tbody").find("tr");

			$display.addClass("word-tool-display");
			$(this).prepend($display);
			$img.appendTo($display);

			// Scan rows
			$rows.each(function () {
				var $hotspot = createHotspot($(this));
				$display.append($hotspot);
			});
			$table.hide();
		});

		function createHotspot($row) {
			var $hotspot = $("<div>");
			var $cells = $row.children("td");


			var data = scrapeData($cells);

			$hotspot.data("data", data);
			$hotspot.addClass("status-" + data.available);
			$hotspot.addClass("INFO");
			$hotspot.attr("title", data.name);

			if (data.note.length) {
				$hotspot.data("info", data.name + ": " + data.note);
			} else {
				$hotspot.data("info", data.name);
			}
			$hotspot.css({
				"z-index": 2,
				position: "absolute",
				top: data.top + "%",
				left: data.left + "%",
				height: data.height + "%",
				width: data.width + "%"
			});

			return $hotspot;
		}

		function scrapeData($cells) {
			var data = {
				name: $cells.eq(0).text(),
				available: $cells.eq(1).text().toLowerCase(),
				note: $cells.eq(2).text(),
				x1: $cells.eq(3).text(),
				x2: $cells.eq(4).text(),
				y1: $cells.eq(5).text(),
				y2: $cells.eq(6).text(),
				top: null,
				left: null,
				height: null,
				width: null
			};

			data.top = data.y1;
			data.left = data.x1;
			data.height = data.y2 - data.y1;
			data.width = data.x2 - data.x1;
			return data;
		}
	}

	function attachListeners() {
		// Populate the text box
		$(".word-tool-display [class^='status-']").on("click", function () {
			var $container = $(this).closest(".word-tools");
			var $toolInfo = $("<div>");
			$container.find(".tool-info").remove();
			$toolInfo.addClass("tool-info");
			var data = $(this).data("data");

			$toolInfo.html("<dl><dt>" + data.name + "</dt>" + "<dd>" + data.note + "</dd></dl>");
			$toolInfo.hide();
			$container.append($toolInfo);
			$toolInfo.fadeIn();
		});

		/*
		 * Adding class="development" to the body will allow you to click on the hotspot image to gain x/y coordinates to help with development of new hotspots
		 */
		$(".development .word-tool-display img").on("click", function (e) {
			var offsets = calculateClickOffsets($(this), e);
			var $container = $(this).closest(".word-tools");
			var $toolInfo = $("<div>");
			var data = $(this).data("data");
			var $displayInfo = getDisplayInfo(offsets);

			e.preventDefault();

			$container.find(".tool-info").remove();
			$toolInfo.addClass("tool-info");
			$toolInfo.append($displayInfo);

			$toolInfo.hide();
			$container.append($toolInfo);
			$toolInfo.fadeIn();
		});

		function getDisplayInfo(offsets) {
			var $dl = $("<dl>");
			var $dtx = $("<dt>");
			var $ddx = $("<dd>");
			var $dty = $("<dt>");
			var $ddy = $("<dd>");

			$dtx.text("X");
			$ddx.text(offsets.left.toFixed(1));
			$dty.text("Y");
			$ddy.text(offsets.top.toFixed(1));

			$dl.append($dtx, $ddx, $dty, $ddy);
			return $dl;
		}

		function calculateClickOffsets($img, e) {
			var imgOffset = $img.offset();

			var clickLeft = e.pageX - imgOffset.left;
			var clickTop = e.pageY - imgOffset.top;
			var percentLeft = clickLeft / $img.width() * 100;
			var percentTop = clickTop / $img.height() * 100;

			return {
				left: percentLeft,
				top: percentTop
			};

		}

	}
}(jQuery));
