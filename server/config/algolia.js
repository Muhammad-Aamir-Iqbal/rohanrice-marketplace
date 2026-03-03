import algoliasearch from 'algoliasearch';
import chalk from 'chalk';

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);

const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME || 'rohanrice_products');

/**
 * Initialize Algolia
 * Test connection and create index if needed
 */
export const initializeAlgolia = async () => {
  try {
    // Test connection
    await client.getApiKeys();
    console.log(chalk.green('✓ Algolia connected'));
    return { client, index };
  } catch (error) {
    console.error(chalk.red(`✗ Algolia connection error: ${error.message}`));
    // Don't exit - Algolia is optional
    return null;
  }
};

/**
 * Index products in Algolia
 */
export const indexProduct = async (product) => {
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
      image: product.images[0] || '',
    };

    await index.saveObject(record);
    console.log(chalk.green(`✓ Product indexed: ${product.name}`));
  } catch (error) {
    console.error(chalk.red(`✗ Algolia indexing error: ${error.message}`));
  }
};

/**
 * Delete product from Algolia
 */
export const deleteProductFromIndex = async (productId) => {
  try {
    await index.deleteObject(productId.toString());
    console.log(chalk.green(`✓ Product removed from index: ${productId}`));
  } catch (error) {
    console.error(chalk.red(`✗ Algolia deletion error: ${error.message}`));
  }
};

/**
 * Search with Algolia
 */
export const searchProducts = async (query) => {
  try {
    const results = await index.search(query);
    return results.hits;
  } catch (error) {
    console.error(chalk.red(`✗ Algolia search error: ${error.message}`));
    return [];
  }
};

/**
 * Bulk index products
 */
export const bulkIndexProducts = async (products) => {
  try {
    const objects = products.map(product => ({
      objectID: product._id.toString(),
      name: product.name,
      variety: product.variety,
      description: product.description,
      price: product.price,
      stock: product.stock,
      rating: product.rating,
      certifications: product.certifications,
      origin: product.origin,
      image: product.images[0] || '',
    }));

    await index.saveObjects(objects);
    console.log(chalk.green(`✓ Bulk indexed ${objects.length} products`));
  } catch (error) {
    console.error(chalk.red(`✗ Bulk indexing error: ${error.message}`));
  }
};

export { index, client };
