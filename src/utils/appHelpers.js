export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const getCategoryNameById = (categories, categoryId) =>
  categories.find((cat) => cat.id === categoryId)?.name || 'Uncategorized';

export const getSalesSummary = (orders = []) => {
  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const totals = {
    todaySales: 0,
    weekSales: 0,
    monthSales: 0,
    totalRevenue: 0,
  };

  const paidStatuses = new Set(['PAID', 'COMPLETED']);

  orders.forEach((order) => {
    if (!paidStatuses.has(order.orderStatus)) return;
    const orderDate = new Date(order.createdAt);
    const amount = Number(order.totalAmount || 0);

    totals.totalRevenue += amount;

    if (order.createdAt?.slice(0, 10) === todayKey) {
      totals.todaySales += amount;
    }

    if (orderDate >= weekAgo) {
      totals.weekSales += amount;
    }

    if (orderDate >= monthStart) {
      totals.monthSales += amount;
    }
  });

  return totals;
};

export const getTopCategory = (orders = [], products = [], categories = []) => {
  const categoryTotals = {};
  const paidStatuses = new Set(['PAID', 'COMPLETED']);

  orders.forEach((order) => {
    if (!paidStatuses.has(order.orderStatus)) return;
    order.items.forEach((item) => {
      const product = products.find((prd) => prd.id === item.productId);
      if (!product) return;

      categoryTotals[product.categoryId] = (categoryTotals[product.categoryId] || 0) + Number(item.lineTotal || 0);
    });
  });

  let topCategoryId = '';
  let topValue = 0;

  Object.entries(categoryTotals).forEach(([categoryId, value]) => {
    if (value > topValue) {
      topValue = value;
      topCategoryId = categoryId;
    }
  });

  if (!topCategoryId) {
    return { category: 'N/A', value: 0 };
  }

  return {
    category: categories.find((cat) => cat.id === topCategoryId)?.name || 'N/A',
    value: topValue,
  };
};

export const getDailyVisitors = (visitorLogs = [], days = 7) => {
  const map = {};
  const today = new Date();

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    map[key] = new Set();
  }

  visitorLogs.forEach((log) => {
    const key = log.createdAt?.slice(0, 10);
    if (map[key]) {
      map[key].add(log.visitorId);
    }
  });

  return Object.entries(map).map(([dateKey, visitors]) => ({
    dateKey,
    visitors: visitors.size,
  }));
};

export const getPopularProducts = (orders = [], products = []) => {
  const totals = {};
  const paidStatuses = new Set(['PAID', 'COMPLETED']);

  orders.forEach((order) => {
    if (!paidStatuses.has(order.orderStatus)) return;
    order.items.forEach((item) => {
      totals[item.productId] = (totals[item.productId] || 0) + Number(item.quantity || 0);
    });
  });

  return Object.entries(totals)
    .map(([productId, qty]) => ({
      productId,
      qty,
      name: products.find((prd) => prd.id === productId)?.name || 'Unknown Product',
    }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);
};

export const getPopularPages = (visitorLogs = []) => {
  const map = {};
  visitorLogs.forEach((log) => {
    const key = log.page || 'unknown';
    map[key] = (map[key] || 0) + 1;
  });

  return Object.entries(map)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
};

