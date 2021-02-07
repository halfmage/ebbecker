const htmlmin = require("html-minifier");
const Image = require("@11ty/eleventy-img");
const sharp = require("sharp");

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("fonts");

  // Custom files
  eleventyConfig.addPassthroughCopy("./JobFoodZertifikat.pdf");
  eleventyConfig.addPassthroughCopy("./site.webmanifest");
  eleventyConfig.addPassthroughCopy("./social.png");

  eleventyConfig.addWatchTarget("./_tmp/style.css");

  eleventyConfig.addPassthroughCopy({ "./_tmp/style.css": "./style.css" });

  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/alpine.js": "./js/alpine.js",
  });

  eleventyConfig.addShortcode("version", function () {
    return String(Date.now());
  });

  eleventyConfig.addNunjucksAsyncShortcode(
    "Image",
    async (src, alt, classImage, classContainer) => {
      if (!alt) {
        throw new Error(`Missing \`alt\` on myImage from: ${src}`);
      }

      let stats = await Image(src, {
        widths: [25, 300, 600, 900, 1200, 2400],
        formats: ["jpg", "webp"],
        urlPath: "/images/",
        outputDir: "./_site/images/",
      });

      let lowestSrc = stats["jpg"][0];

      const placeholder = await sharp(lowestSrc.outputPath)
        .resize({ fit: sharp.fit.inside })
        .blur()
        .toBuffer();

      const base64Placeholder = `data:image/png;base64,${placeholder.toString(
        "base64"
      )}`;

      const srcset = Object.keys(stats).reduce(
        (acc, format) => ({
          ...acc,
          [format]: stats[format].reduce(
            (_acc, curr) => `${_acc} ${curr.srcset} ,`,
            ""
          ),
        }),
        {}
      );

      const source = `<source type="image/webp" data-srcset="${srcset["webp"]}" >`;

      const img = `<img
      class="lazy ${classImage}"
      alt="${alt}"
      src="${base64Placeholder}"
      data-src="${lowestSrc.url}"
      data-sizes='(min-width: 1024px) 1024px, 100vw'
      data-srcset="${srcset["jpeg"]}"
      width="${lowestSrc.width}"
      height="${lowestSrc.height}">`;

      return `<picture class="${classContainer}">${source} ${img}</picture>`;
    }
  );

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });
};
