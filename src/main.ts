import Apify from 'apify';

Apify.main(
  async (): Promise<void> => {
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: 'https://www.example.com/' });

    const crawler = new Apify.PuppeteerCrawler({
      requestQueue,
      handlePageFunction: async ({ request, page }): Promise<void> => {
        const title = await page.title();
        console.log(`Title of ${request.url}: ${title}`);
      },
      handleFailedRequestFunction: async ({ request }): Promise<void> => {
        console.log(`Request ${request.url} failed too many times`);
        await Apify.pushData({
          '#debug': Apify.utils.createRequestDebugInfo(request)
        });
      },
      maxRequestsPerCrawl: 100,
      maxConcurrency: 1
    });

    await crawler.run();
  }
);
