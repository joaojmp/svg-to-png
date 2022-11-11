var svgText = document.getElementById("svg");
svgText.wrap = "off";
var svg = null;
var width = document.getElementById("width");
var height = document.getElementById("height");
var canvas = document.getElementById("canvas");
canvas.width = 0;
canvas.height = 0;

document.getElementById("load-svg").addEventListener("click", function () {
  var div = document.getElementById("preview-svg");
  div.innerHTML = svgText.value;
  svg = div.querySelector("svg");

  width.value = svg.getBoundingClientRect().width;
  height.value = svg.getBoundingClientRect().height;
});

document.querySelectorAll(".make-canvas").forEach((element) => {
  element.addEventListener("click", function () {
    this.select();
  });

  element.addEventListener("input", function () {
    if (this.value >= 9999) {
      this.value = 9999;
    } else if (this.value <= 0) {
      this.value = 0;
    }

    svg.setAttribute("width", width.value);
    svg.setAttribute("height", height.value);

    canvas.width = width.value;
    canvas.height = height.value;

    var data = new XMLSerializer().serializeToString(svg);
    var win = window.URL || window.webkitURL || window;
    var img = new Image();
    var blob = new Blob([data], { type: "image/svg+xml" });
    var url = win.createObjectURL(blob);

    img.onload = function () {
      canvas.getContext("2d").drawImage(img, 0, 0);
      win.revokeObjectURL(url);
      var uri = canvas
        .toDataURL("image/png")
        .replace("image/png", "octet/stream");
      window.URL.revokeObjectURL(uri);
    };

    img.src = url;
  });
});

document.getElementById("save-png").addEventListener("click", function () {
  var link = document.createElement("a");
  link.download = "Icon.png";
  link.href = canvas.toDataURL();
  link.click();
  document.body.removeChild(a);
});
