import algoliasearch from 'algoliasearch';
import chalk from 'chalk';

export let client = null;
export let index = null;

let initialized = false;

const getAlgoliaConfig = () => ({
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_API_KEY,
  indexName: process.env.ALGOLIA_INDEX_NAME || 'rohanrice_products',
});

const ensureClient = () => {
  if (client && index) return { client, index };

  const { appId, apiKey, indexName } = getAlgoliaConfig();
  if (!appId || !apiKey) {
    return null;
  }

  client = algoliasearch(appId, apiKey);
  index = client.initIndex(indexName);
  return { client, index };
};

export const initializeAlgolia = async () => {
  if (initialized) {
    return client && index ? { client, index } : null;
  }

  const ctx = ensureClient();
  if (!ctx) {
    initialized = true;
    console.log(chalk.yellow('Algolia is not configured. Skipping initialization.'));
    return null;
  }

  try {
    await ctx.client.getApiKeys();
    initialized = true;
    console.log(chalk.green('Algolia connected'));
    return ctx;
  } catch (error) {
    console.error(chalk.red(`Algolia connection error: ${error.message}`));
    return null;
  }
};

export const indexProduct = async (product) => {
  const ctx = ensureClient();
  if (!ctx || !product) return;

  try {
    const record = {
      objectID: product._id.toString(),
      name: product.name,
      variety: product.variety,
      description: product.description,
      price: product.price,
      stock: product.stock,
      rating: product.rating,
      certifications: product.certifications,
      origin: product.origin,
      image: product.images?.[0] || '',
    };

    await ctx.index.saveObject(record);
    console.log(chalk.green(`Product indexed: ${product.name}`));
  } catch (error) {
    console.error(chalk.red(`Algolia indexing error: ${error.message}`));
  }
};

export const deleteProductFromIndex = async (productId) => {
  const ctx = ensureClient();
  if (!ctx || !productId) return;

  try {
    await ctx.index.deleteObject(productId.toString());
    console.log(chalk.green(`Product removed from index: ${productId}`));
  } catch (error) {
    console.error(chalk.red(`Algolia deletion error: ${error.message}`));
  }
};

export const searchProducts = async (query) => {
  const ctx = ensureClient();
  if (!ctx || !query) return [];

  try {
    const results = await ctx.index.search(query);
    return results.hits || [];
  } catch (error) {
    console.error(chalk.red(`Algolia search error: ${error.message}`));
    return [];
  }
};

export const bulkIndexProducts = async (products) => {
  const ctx = ensureClient();
  if (!ctx || !Array.isArray(products) || products.length === 0) return;

  try {
    const objects = products.map((product) => ({
      objectID: product._id.toString(),
      name: product.name,
      variety: product.variety,
      description: product.description,
      price: product.price,
      stock: product.stock,
      rating: product.rating,
      certifications: product.certifications,
      origin: product.origin,
      image: product.images?.[0] || '',
    }));

    await ctx.index.saveObjects(objects);
    console.log(chalk.green(`Bulk indexed ${objects.length} products`));
  } catch (error) {
    console.error(chalk.red(`Bulk indexing error: ${error.message}`));
  }
};
