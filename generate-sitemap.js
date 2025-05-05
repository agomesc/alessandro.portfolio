const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");

(async () => {
  const sitemap = new SitemapStream({ hostname: "https://olhofotografico.com.br/" });
  const pipeline = sitemap.pipe(createGzip());

  sitemap.write({ url: "/", changefreq: "daily", priority: 1.0 });
  sitemap.write({ url: "/about", changefreq: "monthly", priority: 0.8 });
  sitemap.write({ url: "/photoinfo", changefreq: "monthly", priority: 0.7 });
  sitemap.write({ url: "/latestphotos", changefreq: "monthly", priority: 0.6 });
  sitemap.write({ url: "/photos", changefreq: "monthly", priority: 0.5 });
  sitemap.write({ url: "/photoinfo", changefreq: "monthly", priority: 0.4 });
  sitemap.write({ url: "/privacidade", changefreq: "monthly", priority: 0.3 });
  sitemap.write({ url: "/transparencia", changefreq: "monthly", priority: 0.2 });

  sitemap.end();

  const data = await streamToPromise(pipeline);
  fs.writeFileSync("./public/sitemap.xml.gz", data);
})();
