const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");

(async () => {
  const hostname = "https://olhofotografico.com.br/";
  const sitemap = new SitemapStream({ hostname: hostname });
  const pipeline = sitemap.pipe(createGzip());

  // Define all your URLs with their properties
  const urls = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/home", changefreq: "daily", priority: 1.0 }, // Added: Assuming this is a primary page
    { url: "/about", changefreq: "monthly", priority: 0.8 },
    { url: "/latestphotos", changefreq: "weekly", priority: 0.7 }, // Adjusted: May change more often
    { url: "/photos", changefreq: "weekly", priority: 0.6 }, // Adjusted: May change more often
    { url: "/photoinfo", changefreq: "monthly", priority: 0.7 }, // Kept priority higher as it's likely important
    { url: "/GalleryDetail", changefreq: "monthly", priority: 0.5 }, // Added
    { url: "/EquipmentValueCalculator", changefreq: "monthly", priority: 0.4 }, // Added
    { url: "/privacidade", changefreq: "yearly", priority: 0.3 }, // Adjusted: Privacy policy rarely changes
    { url: "/transparencia", changefreq: "yearly", priority: 0.2 }, // Adjusted: Transparency info rarely changes
    { url: "/contactForm", changefreq: "monthly", priority: 0.5 }, // Added
  ];

  // Write each URL to the sitemap stream
  urls.forEach(link => {
    sitemap.write(link);
  });

  sitemap.end();

  try {
    const data = await streamToPromise(pipeline);
    fs.writeFileSync("./public/sitemap.xml.gz", data);
    console.log("Sitemap generated successfully at ./public/sitemap.xml.gz");
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
})();