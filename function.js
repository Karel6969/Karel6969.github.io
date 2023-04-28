function displayColorPalette(sortedColors) {
  let dominantColors = getDominantColors(sortedColors, 8);
  let colorPaletteDiv = document.getElementById("colorPalette");
  
   colorPaletteDiv.innerHTML = "";

  dominantColors.forEach(function(color) {
    let colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = color;
    colorDiv.textContent = rgbToHex(color);
    colorDiv.style.position = "relative"; // add this line to set position property
    colorDiv.innerHTML = `<div style="position: relative; top: 45px;">${rgbToHex(color)}</div>`; // add this line to set text content's position
    colorPaletteDiv.appendChild(colorDiv);
  });
}

let fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", function(event) {
  let file = event.target.files[0];
  let image = new Image();
  image.src = URL.createObjectURL(file);

  image.onload = function() {
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;

    let colors = {};

    for (let i = 0; i < pixels.length; i += 4) {
      let r = pixels[i];
      let g = pixels[i + 1];
      let b = pixels[i + 2];
      let a = pixels[i + 3];
      if (a === 255) {
        let color = `rgb(${r}, ${g}, ${b})`;
        if (color in colors) {
          colors[color]++;
        } else {
          colors[color] = 1;
        }
      }
    }

    let sortedColors = Object.keys(colors).sort(function(a, b) {
      return colors[b] - colors[a];
    });

    displayColorPalette(sortedColors);
  };
});

function getDominantColors(sortedColors, numColors) {
  let points = sortedColors.map(function(color) {
    let match = color.match(/rgb\((\d+), (\d+), (\d+)\)/);
    return [+match[1], +match[2], +match[3]];
  });

  let centroids = [];

  // Initialize the centroids with the first numColors points
  for (let i = 0; i < numColors; i++) {
    centroids.push(points[i]);
  }

  let iterations = 10;

  while (iterations--) {
    // Assign each point to the closest centroid
    let clusters = centroids.map(function() {
      return [];
    });

    points.forEach(function(point) {
      let distances = centroids.map(function(centroid) {
        let dr = point[0] - centroid[0];
        let dg = point[1] - centroid[1];
        let db = point[2] - centroid[2];
        return Math.sqrt(dr * dr + dg * dg + db * db);
      });

      let closestCentroid = distances.indexOf(Math.min.apply(null, distances));
      clusters[closestCentroid].push(point);
    });

    // Update the centroids to be the average of the points in each cluster
    centroids = clusters.map(function(cluster) {
      let numPoints = cluster.length;
      let r = 0;
      let g = 0;
      let b = 0;
      cluster.forEach(function(point) {
        r += point[0];
        g += point[1];
        b += point[2];
      });
      return [r / numPoints, g / numPoints, b / numPoints];
    });
  }

  let dominantColors = centroids.map(function(centroid) {
    return `rgb(${Math.round(centroid[0])}, ${Math.round(centroid[1])}, ${Math.round(centroid[2])})`;
  });

  return dominantColors;
}

            let LoadedImg = document.getElementById("UploadedImg");
            let InputFile = document.getElementById("fileInput");

            InputFile.onchange = function(){

              LoadedImg.src = URL.createObjectURL(InputFile.files[0]);
              
            }


function rgbToHex(rgb) {
  let r = parseInt(rgb.substring(4, rgb.indexOf(",")));
  let g = parseInt(rgb.substring(rgb.indexOf(",") + 2, rgb.lastIndexOf(",")));
  let b = parseInt(rgb.substring(rgb.lastIndexOf(",") + 2, rgb.length - 1));
  let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex;
}


const DisBox = document.querySelector(".dotted")
const ImgIcon = document.querySelector("#UploadedImg")

fileInput.addEventListener("input", e => { DisBox.style.display = "none"})
fileInput.addEventListener("input", e => { ImgIcon.style.display = "block"})

