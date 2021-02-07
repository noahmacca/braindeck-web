// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
var ogs = require('open-graph-scraper');

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query['url']) {

    var siteUrl = req.query['url'];
    var options = {
      'url': siteUrl,
      'headers': {
        'accept-language': 'en'
      },
      'timeout': 4000
    };

    await ogs(options, (err, results, response) => {
      if (results.err) {
        res.json(results.err);
      } else {
        res.json(results);
      }
      res.end();
    });
  } else {
    res.json({
      'error': 'no "url" query',
      'query': req.query
    });
  }
}
