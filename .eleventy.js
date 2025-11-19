module.exports = function(eleventyConfig) {
  // 1. PASSTHROUGH COPY
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/pages");
  // 3. RETURN OBJECT (AFSLUITING VAN DE FUNCTIE)
  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    },
    templateFormats: ["html", "md"]
  };
};