
"define webpack";

function init() {
    return {
        download: function (url, fileName) {
            var downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        },
        downloadSVG: function (element, fileName) {
            let svg;
            if (element.tagName == "SVG") {
                svg = element;
            } else {
                svg = element.querySelector("svg");
            }


            var serializer = new XMLSerializer();
            var svgData = serializer.serializeToString(svg);

            var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            var svgUrl = URL.createObjectURL(svgBlob);
            if (fileName.toLowerCase().indexOf(".svg") < 0) {
                fileName += ".svg";
            }
            console.log(svgUrl);
            this.download(svgUrl, fileName);

        },
        downloadPNG: function (element, fileName) {
            let img;
            if (element.tagName == "IMG") {
                img = element;
            } else {
                img = element.querySelector("img");
            }

            if (img) {
                if (fileName.toLowerCase().indexOf(".png") < 0) {
                    fileName += ".png";
                }
                var url = img.getAttribute("src");
                this.download(url, fileName);
            } else {
                console.error("No image found to download");
            }

        }

    };
}
exports["default"] = init();



