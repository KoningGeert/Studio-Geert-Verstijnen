module.exports = function(eleventyConfig) {
  // Kopieer statische bestanden 1-op-1 naar _site
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/_includes");

  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/styles");
  
  // Configuratie voor directories
  return {
  dir: {
  input: "src",        // waar je .njk, .html, .md bestanden staan
  includes: "_includes", // Nunjucks partials
  output: "_site"       // Eleventy outputmap
  },
  templateFormats: ["html",  "md"]
  };
  };
  