/**
 * Market News Controller — QuantVault
 * Fetches and parses general market news headlines from Yahoo Finance RSS.
 */

const getMarketNews = async (req, res, next) => {
  try {
    const rssUrl = 'https://finance.yahoo.com/news/rssindex';
    let rssText = '';

    try {
      const response = await fetch(rssUrl);
      if (response.ok) {
        rssText = await response.text();
      } else {
        throw new Error('Failed to fetch Yahoo RSS');
      }
    } catch (err) {
      console.warn('[NewsController] Fetch failed, using fallback news items:', err.message);
      // Fallback static mock articles if offline or network fails
      return res.json({
        success: true,
        data: [
          {
            title: "Market Rally Continues Amid Rate Cut Expectations",
            link: "https://finance.yahoo.com",
            pubDate: new Date().toUTCString(),
            description: "Stocks ticked higher today as investors continue to anticipate interest rate cuts from the Federal Reserve later this year."
          },
          {
            title: "Tech Giants Lead Nasdaq to New Record Highs",
            link: "https://finance.yahoo.com",
            pubDate: new Date().toUTCString(),
            description: "Major technology companies advanced, boosting the tech-heavy Nasdaq index to all-time highs amid strong AI enthusiasm."
          },
          {
            title: "Crypto Markets Consolidate Near Crucial Support Levels",
            link: "https://finance.yahoo.com",
            pubDate: new Date().toUTCString(),
            description: "Bitcoin and major altcoins traded in a narrow range as traders await macro data releases scheduled for later this week."
          }
        ]
      });
    }

    // Parse RSS items using RegExp (robust, requires no extra dependencies)
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const titleRegex = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/;
    const linkRegex = /<link>([\s\S]*?)<\/link>/;
    const pubDateRegex = /<pubDate>([\s\S]*?)<\/pubDate>/;
    const descriptionRegex = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/;

    let match;
    // Limit to top 8 news items
    let count = 0;
    while ((match = itemRegex.exec(rssText)) !== null && count < 8) {
      const itemContent = match[1];
      let title = itemContent.match(titleRegex)?.[1] || '';
      let link = itemContent.match(linkRegex)?.[1] || '';
      let pubDate = itemContent.match(pubDateRegex)?.[1] || '';
      let description = itemContent.match(descriptionRegex)?.[1] || '';

      // Clean CDATA and HTML tags
      title = title.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      description = description.replace(/<[^>]*>/g, '').replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      link = link.trim();
      pubDate = pubDate.trim();

      if (title) {
        items.push({ title, link, pubDate, description });
        count++;
      }
    }

    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMarketNews };
