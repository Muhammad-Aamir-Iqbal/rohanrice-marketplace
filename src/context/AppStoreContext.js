import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORE_KEY = 'rohan-rice-store-v1';
const SESSION_KEY = 'rohan-rice-session-v1';
const VISITOR_KEY = 'rohan-rice-visitor-v1';

const PHONE_REGEX = /^\+92\d{10}$/;

const uid = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const otpCode = () => String(Math.floor(100000 + Math.random() * 900000));

const normalizePhone = (phone = '') => phone.replace(/[\s-]/g, '');

const getNowIso = () => new Date().toISOString();

const defaultCategories = [
  {
    id: 'cat_basmati',
    name: 'Basmati Rice',
    description: 'Premium long grain aromatic rice famous worldwide',
  },
  {
    id: 'cat_super_kernel',
    name: 'Super Kernel Basmati',
    description: 'Export quality long grain rice',
  },
  {
    id: 'cat_irri',
    name: 'IRRI Rice',
    description: 'Affordable everyday cooking rice',
  },
  {
    id: 'cat_sella',
    name: 'Sella Rice',
    description: 'Parboiled rice with firm grains',
  },
  {
    id: 'cat_brown',
    name: 'Brown Rice',
    description: 'Healthy unpolished rice',
  },
  {
    id: 'cat_organic',
    name: 'Organic Rice',
    description: 'Chemical-free natural rice',
  },
  {
    id: 'cat_export',
    name: 'Premium Export Rice',
    description: 'High-grade rice for international buyers',
  },
];

const pickCategoryId = (name) => defaultCategories.find((cat) => cat.name === name)?.id || defaultCategories[0].id;

const defaultProducts = [
  {
    id: 'prd_premium_basmati',
    name: 'Premium Basmati Rice',
    categoryId: pickCategoryId('Basmati Rice'),
    pricePerKg: 520,
    stockQuantity: 800,
    description:
      'Premium Basmati Rice is known for its long grains, natural aroma, and soft texture after cooking. Carefully selected and processed to maintain purity and quality. Perfect for biryani, pulao, and traditional dishes.',
    image: '',
    isFeatured: true,
    rating: 0,
    reviewCount: 0,
    createdAt: getNowIso(),
  },
  {
    id: 'prd_super_kernel_basmati',
    name: 'Super Kernel Basmati Rice',
    categoryId: pickCategoryId('Super Kernel Basmati'),
    pricePerKg: 560,
    stockQuantity: 600,
    description:
      'Super Kernel Basmati Rice is one of the finest varieties of basmati rice. Its extra-long grains and rich fragrance make it ideal for premium cooking. Widely appreciated for its excellent cooking results and consistent quality.',
    image: '',
    isFeatured: true,
    rating: 0,
    reviewCount: 0,
    createdAt: getNowIso(),
  },
  {
    id: 'prd_irri',
    name: 'IRRI Rice',
    categoryId: pickCategoryId('IRRI Rice'),
    pricePerKg: 290,
    stockQuantity: 1200,
    description:
      'IRRI Rice is a popular everyday rice variety known for its affordability and versatility. It cooks evenly and is suitable for daily meals. Ideal for households and restaurants.',
    image: '',
    isFeatured: true,
    rating: 0,
    reviewCount: 0,
    createdAt: getNowIso(),
  },
  {
    id: 'prd_sella',
    name: 'Sella Rice',
    categoryId: pickCategoryId('Sella Rice'),
    pricePerKg: 350,
    stockQuantity: 900,
    description:
      'Sella Rice is parboiled rice processed to retain nutrients and improve grain strength. It cooks into firm, separate grains. Often used in commercial kitchens and large-scale cooking.',
    image: '',
    isFeatured: false,
    rating: 0,
    reviewCount: 0,
    createdAt: getNowIso(),
  },
  {
    id: 'prd_brown',
    name: 'Brown Rice',
    categoryId: pickCategoryId('Brown Rice'),
    pricePerKg: 470,
    stockQuantity: 500,
    description:
      'Brown Rice is a healthy whole grain rice with natural fiber and nutrients preserved. It is minimally processed and ideal for health-conscious customers.',
    image: '',
    isFeatured: false,
    rating: 0,
    reviewCount: 0,
    createdAt: getNowIso(),
  },
  {
    id: 'prd_organic',
    name: 'Organic Rice',
    categoryId: pickCategoryId('Organic Rice'),
    pricePerKg: 620,
    stockQuantity: 350,
    description:
      'Organic Rice is cultivated using natural farming methods without harmful chemicals. It provides a pure and healthy rice option for families who prioritize organic food.',
    image: '',
    isFeatured: false,
    rating: 0,
    reviewCount: 0,
    createdAt: getNowIso(),
  },
  {
    id: 'prd_golden_sella_basmati',
    name: 'Golden Sella Basmati',
    categoryId: pickCategoryId('Sella Rice'),
    pricePerKg: 540,
    stockQuantity: 450,
    description:
      'Golden Sella Basmati rice is a premium parboiled basmati variety known for its golden color, long grains, and excellent cooking quality.',
    image: '',
    isFeatured: false,
    rating: 0,
    reviewCount: 0,
    createdAt: getNowIso(),
  },
  {
    id: 'prd_white_sella',
    name: 'White Sella Rice',
    categoryId: pickCategoryId('Sella Rice'),
    pricePerKg: 400,
    stockQuantity: 700,
    description:
      'White Sella Rice is processed for durability and consistency. It is widely used in large kitchens and commercial cooking.',
    image: '',
    isFeatured: false,
    rating: 0,
    reviewCount: 0,
    createdAt: getNowIso(),
  },
  {
    id: 'prd_steam_basmati',
    name: 'Steam Basmati Rice',
    categoryId: pickCategoryId('Basmati Rice'),
    pricePerKg: 510,
    stockQuantity: 650,
    description:
      'Steam Basmati Rice is processed using modern steaming techniques that maintain grain length and cooking quality. It produces fluffy and separate grains when cooked.',
    image: '',
    isFeatured: false,
    rating: 0,
    reviewCount: 0,
    createdAt: getNowIso(),
  },
  {
    id: 'prd_export_quality_basmati',
    name: 'Export Quality Basmati Rice',
    categoryId: pickCategoryId('Premium Export Rice'),
    pricePerKg: 720,
    stockQuantity: 250,
    description:
      'Export Quality Basmati Rice is carefully selected to meet international standards. Its long grains, fragrance, and premium texture make it suitable for high-end buyers.',
    image: '',
    isFeatured: true,
    rating: 0,
    reviewCount: 0,
    createdAt: getNowIso(),
  },
];

const defaultBlogPosts = [
  {
    id: 'blog_best_rice_varieties',
    title: 'Best rice varieties in Pakistan',
    slug: 'best-rice-varieties-in-pakistan',
    excerpt: 'Understand the most popular rice categories and their ideal uses in homes and businesses.',
    content:
      'Pakistan offers several rice varieties for different cooking needs. Basmati is ideal for biryani and pulao due to aroma and grain length, while IRRI offers affordability for daily meals. Sella varieties are preferred where firm grains are needed. Choosing based on dish type improves taste and consistency.',
    image: '',
    status: 'published',
    createdAt: getNowIso(),
  },
  {
    id: 'blog_perfect_basmati',
    title: 'How to cook perfect basmati rice',
    slug: 'how-to-cook-perfect-basmati-rice',
    excerpt: 'Simple, practical steps to get fluffy basmati rice every time.',
    content:
      'Rinse basmati gently until water runs clear. Soak for 20 to 30 minutes, then drain. Use controlled water ratio and medium heat. Rest the rice for a few minutes after cooking before fluffing. These steps preserve aroma and improve grain separation.',
    image: '',
    status: 'published',
    createdAt: getNowIso(),
  },
  {
    id: 'blog_basmati_vs_irri',
    title: 'Difference between basmati and IRRI rice',
    slug: 'difference-between-basmati-and-irri-rice',
    excerpt: 'A practical comparison of aroma, texture, price, and everyday use cases.',
    content:
      'Basmati rice is aromatic and long-grain, commonly used in premium dishes. IRRI rice is economical and versatile for daily cooking. Both are useful, but selection should depend on budget, dish type, and desired texture.',
    image: '',
    status: 'published',
    createdAt: getNowIso(),
  },
  {
    id: 'blog_brown_rice_benefits',
    title: 'Health benefits of brown rice',
    slug: 'health-benefits-of-brown-rice',
    excerpt: 'Brown rice supports balanced nutrition with natural fiber and essential nutrients.',
    content:
      'Brown rice keeps the bran layer intact, which makes it richer in fiber than polished white rice. It supports better digestion, helps maintain fullness for longer periods, and fits well in balanced meal plans for health-conscious families.',
    image: '',
    status: 'published',
    createdAt: getNowIso(),
  },
  {
    id: 'blog_store_rice',
    title: 'How to store rice properly',
    slug: 'how-to-store-rice-properly',
    excerpt: 'Simple storage practices to preserve aroma, freshness, and grain quality.',
    content:
      'Store rice in dry, airtight containers away from direct sunlight and humidity. Clean storage areas regularly and avoid mixing old and new stock. Proper storage maintains flavor and protects rice quality over longer periods.',
    image: '',
    status: 'published',
    createdAt: getNowIso(),
  },
  {
    id: 'blog_rice_farming_punjab',
    title: 'Rice farming in Punjab',
    slug: 'rice-farming-in-punjab',
    excerpt: 'Punjab remains a key agricultural region for quality rice cultivation and supply.',
    content:
      'Punjab has fertile soil, experienced growers, and long-standing rice cultivation practices. Consistent farming methods, careful harvesting, and quality-focused processing contribute to reliable rice supply for domestic and export markets.',
    image: '',
    status: 'published',
    createdAt: getNowIso(),
  },
  {
    id: 'blog_choose_high_quality',
    title: 'Choosing high quality rice',
    slug: 'choosing-high-quality-rice',
    excerpt: 'A practical guide to checking grain size, aroma, cleanliness, and consistency.',
    content:
      'To choose high quality rice, inspect grain uniformity, cleanliness, moisture level, and natural aroma. Trusted packaging, clear labeling, and reliable supplier standards help buyers make better purchasing decisions for home or commercial use.',
    image: '',
    status: 'published',
    createdAt: getNowIso(),
  },
];

const defaultSettings = {
  businessName: 'Rohan Rice',
  ownerName: 'Zeeshan Ali',
  email: 'info@rohanrice.com',
  phone: '+92 XXX XXX XXXX',
  location: 'Narowal, Punjab, Pakistan',
  heroTagline: 'Premium Rice From the Heart of Punjab.',
  footerTagline: 'Premium Rice. Trusted Quality.',
  founderCredit: 'This platform was founded and built by the founder.',
  techRights: 'All technical architecture, source code, and platform rights are reserved by the founder.',
};

const createInitialData = () => ({
  admins: [],
  customers: [],
  otpSessions: [],
  categories: defaultCategories,
  products: defaultProducts,
  orders: [],
  reviews: [],
  blogPosts: defaultBlogPosts,
  visitorLogs: [],
  contactMessages: [],
  carts: {},
  settings: defaultSettings,
});

const safeParse = (raw, fallback) => {
  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
};

const AppStoreContext = createContext(null);

const ensureVisitorId = () => {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const newId = uid('visitor');
  localStorage.setItem(VISITOR_KEY, newId);
  return newId;
};

const hashPassword = async (password) => {
  if (!password) return '';

  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const data = new TextEncoder().encode(`rohan-rice-${password}`);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  return btoa(`rohan-rice-${password}`);
};

const getDisplayName = (user) => user?.name || 'User';

const attachReviewAggregates = (state) => {
  const approved = state.reviews.filter((review) => review.isApproved);
  const grouped = approved.reduce((acc, review) => {
    if (!acc[review.productId]) {
      acc[review.productId] = { total: 0, count: 0 };
    }
    acc[review.productId].total += review.rating;
    acc[review.productId].count += 1;
    return acc;
  }, {});

  return {
    ...state,
    products: state.products.map((product) => {
      const group = grouped[product.id];
      if (!group) {
        return {
          ...product,
          rating: 0,
          reviewCount: 0,
        };
      }

      return {
        ...product,
        rating: Number((group.total / group.count).toFixed(1)),
        reviewCount: group.count,
      };
    }),
  };
};

export function AppStoreProvider({ children }) {
  const [data, setData] = useState(createInitialData);
  const [session, setSession] = useState({
    token: '',
    role: '',
    userId: '',
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedData = localStorage.getItem(STORE_KEY);
    const storedSession = localStorage.getItem(SESSION_KEY);

    if (storedData) {
      const parsed = safeParse(storedData, createInitialData());
      setData((prev) => ({ ...prev, ...parsed }));
    }

    if (storedSession) {
      const parsedSession = safeParse(storedSession, { token: '', role: '', userId: '' });
      setSession(parsedSession);
    }

    ensureVisitorId();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [session, hydrated]);

  const currentUser = useMemo(() => {
    if (!session.userId || !session.role) return null;
    const source = session.role === 'admin' ? data.admins : data.customers;
    return source.find((item) => item.id === session.userId) || null;
  }, [data.admins, data.customers, session.role, session.userId]);

  const isAuthenticated = Boolean(session.token && currentUser);
  const isAdmin = isAuthenticated && session.role === 'admin';
  const isCustomer = isAuthenticated && session.role === 'customer';

  const activeCartItems = useMemo(() => {
    if (!isCustomer || !currentUser) return [];

    const rawItems = data.carts[currentUser.id] || [];

    return rawItems
      .map((item) => {
        const product = data.products.find((prd) => prd.id === item.productId);
        if (!product) return null;

        return {
          ...item,
          product,
          lineTotal: Number((product.pricePerKg * item.quantity).toFixed(2)),
        };
      })
      .filter(Boolean);
  }, [currentUser, data.carts, data.products, isCustomer]);

  const cartCount = useMemo(
    () => activeCartItems.reduce((sum, item) => sum + item.quantity, 0),
    [activeCartItems]
  );

  const cartSubtotal = useMemo(
    () => activeCartItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [activeCartItems]
  );

  const logVisitorEvent = useCallback(({ page, action, details = {} }) => {
    const visitorId = ensureVisitorId();

    setData((prev) => ({
      ...prev,
      visitorLogs: [
        {
          id: uid('visit'),
          visitorId,
          userId: currentUser?.id || '',
          userRole: session.role || 'guest',
          page,
          action,
          details,
          createdAt: getNowIso(),
        },
        ...prev.visitorLogs,
      ].slice(0, 5000),
    }));
  }, [currentUser?.id, session.role]);

  const registerAccount = async ({ role, name, email, phone, password, profileImage = '' }) => {
    const trimmedName = (name || '').trim();
    const loweredEmail = (email || '').trim().toLowerCase();
    const formattedPhone = normalizePhone(phone);

    if (!trimmedName || !loweredEmail || !formattedPhone || !password) {
      return { success: false, message: 'All fields are required.' };
    }

    if (!PHONE_REGEX.test(formattedPhone)) {
      return { success: false, message: 'Phone must be in +92XXXXXXXXXX format.' };
    }

    const existsInAdmins = data.admins.some((admin) => admin.email === loweredEmail || admin.phone === formattedPhone);
    const existsInCustomers = data.customers.some(
      (customer) => customer.email === loweredEmail || customer.phone === formattedPhone
    );

    if (existsInAdmins || existsInCustomers) {
      return { success: false, message: 'An account with this email or phone already exists.' };
    }

    const passwordHash = await hashPassword(password);
    const sessionId = uid('otp');
    const emailOtp = otpCode();
    const phoneOtp = otpCode();

    setData((prev) => ({
      ...prev,
      otpSessions: [
        {
          id: sessionId,
          role,
          payload: {
            name: trimmedName,
            email: loweredEmail,
            phone: formattedPhone,
            passwordHash,
            profileImage,
          },
          emailOtp,
          phoneOtp,
          createdAt: getNowIso(),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        },
        ...prev.otpSessions,
      ],
    }));

    return {
      success: true,
      message: 'OTP sent to email and phone.',
      otpSessionId: sessionId,
      debugEmailOtp: emailOtp,
      debugPhoneOtp: phoneOtp,
    };
  };

  const verifyAccountOtp = async ({ otpSessionId, emailOtp, phoneOtp }) => {
    const sessionRow = data.otpSessions.find((item) => item.id === otpSessionId);

    if (!sessionRow) {
      return { success: false, message: 'OTP session not found. Please sign up again.' };
    }

    if (new Date(sessionRow.expiresAt).getTime() < Date.now()) {
      return { success: false, message: 'OTP expired. Please request a new OTP.' };
    }

    if (String(emailOtp) !== sessionRow.emailOtp || String(phoneOtp) !== sessionRow.phoneOtp) {
      return { success: false, message: 'Invalid OTP codes.' };
    }

    const newUser = {
      id: uid(sessionRow.role === 'admin' ? 'adm' : 'cus'),
      name: sessionRow.payload.name,
      email: sessionRow.payload.email,
      phone: sessionRow.payload.phone,
      passwordHash: sessionRow.payload.passwordHash,
      profileImage: sessionRow.payload.profileImage || '',
      createdAt: getNowIso(),
      verifiedAt: getNowIso(),
      isActive: true,
    };

    setData((prev) => {
      const nextOtpSessions = prev.otpSessions.filter((item) => item.id !== otpSessionId);
      const nextAdmins = sessionRow.role === 'admin' ? [newUser, ...prev.admins] : prev.admins;
      const nextCustomers = sessionRow.role === 'customer' ? [newUser, ...prev.customers] : prev.customers;

      return {
        ...prev,
        otpSessions: nextOtpSessions,
        admins: nextAdmins,
        customers: nextCustomers,
      };
    });

    const token = uid('token');
    setSession({
      token,
      role: sessionRow.role,
      userId: newUser.id,
    });

    logVisitorEvent({
      page: '/signup',
      action: `${sessionRow.role}_signup_verified`,
      details: { email: newUser.email },
    });

    return {
      success: true,
      message: 'Account verified and activated.',
      user: newUser,
    };
  };

  const login = async ({ role, email, password }) => {
    const loweredEmail = (email || '').trim().toLowerCase();
    const source = role === 'admin' ? data.admins : data.customers;
    const user = source.find((item) => item.email === loweredEmail);

    if (!user) {
      return { success: false, message: 'Account not found.' };
    }

    const passwordHash = await hashPassword(password);
    if (passwordHash !== user.passwordHash) {
      return { success: false, message: 'Invalid password.' };
    }

    if (!user.isActive) {
      return { success: false, message: 'Account is inactive.' };
    }

    const token = uid('token');
    setSession({ token, role, userId: user.id });

    logVisitorEvent({
      page: '/login',
      action: `${role}_login_success`,
      details: { email: user.email },
    });

    return { success: true, user };
  };

  const logout = () => {
    setSession({ token: '', role: '', userId: '' });
  };

  const updateCurrentProfile = (updates) => {
    if (!currentUser || !session.role) {
      return { success: false, message: 'No active user session.' };
    }

    if (updates.phone) {
      const normalized = normalizePhone(updates.phone);
      if (!PHONE_REGEX.test(normalized)) {
        return { success: false, message: 'Phone must be in +92XXXXXXXXXX format.' };
      }
      updates.phone = normalized;
    }

    setData((prev) => {
      if (session.role === 'admin') {
        return {
          ...prev,
          admins: prev.admins.map((admin) =>
            admin.id === currentUser.id ? { ...admin, ...updates, updatedAt: getNowIso() } : admin
          ),
        };
      }

      return {
        ...prev,
        customers: prev.customers.map((customer) =>
          customer.id === currentUser.id ? { ...customer, ...updates, updatedAt: getNowIso() } : customer
        ),
      };
    });

    return { success: true, message: 'Profile updated.' };
  };

  const addToCart = (productId, quantity = 1) => {
    if (!isCustomer || !currentUser) {
      return { success: false, message: 'Please login as customer to add items to cart.' };
    }

    const product = data.products.find((item) => item.id === productId);
    if (!product) return { success: false, message: 'Product not found.' };

    if (product.stockQuantity <= 0) {
      return { success: false, message: 'Product is out of stock.' };
    }

    setData((prev) => {
      const existingItems = prev.carts[currentUser.id] || [];
      const existingIndex = existingItems.findIndex((item) => item.productId === productId);

      let nextItems = [...existingItems];

      if (existingIndex >= 0) {
        const nextQuantity = Math.min(
          nextItems[existingIndex].quantity + quantity,
          product.stockQuantity
        );
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          quantity: nextQuantity,
        };
      } else {
        nextItems.push({
          id: uid('cartItem'),
          productId,
          quantity: Math.min(quantity, product.stockQuantity),
          createdAt: getNowIso(),
        });
      }

      return {
        ...prev,
        carts: {
          ...prev.carts,
          [currentUser.id]: nextItems,
        },
      };
    });

    logVisitorEvent({
      page: '/shop',
      action: 'add_to_cart',
      details: { productId, quantity },
    });

    return { success: true, message: 'Product added to cart.' };
  };

  const updateCartQuantity = (productId, quantity) => {
    if (!isCustomer || !currentUser) return;

    setData((prev) => {
      const existingItems = prev.carts[currentUser.id] || [];
      const nextItems = existingItems
        .map((item) => (item.productId === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);

      return {
        ...prev,
        carts: {
          ...prev.carts,
          [currentUser.id]: nextItems,
        },
      };
    });
  };

  const removeFromCart = (productId) => {
    if (!isCustomer || !currentUser) return;

    setData((prev) => {
      const existingItems = prev.carts[currentUser.id] || [];
      const nextItems = existingItems.filter((item) => item.productId !== productId);

      return {
        ...prev,
        carts: {
          ...prev.carts,
          [currentUser.id]: nextItems,
        },
      };
    });
  };

  const clearCart = () => {
    if (!isCustomer || !currentUser) return;

    setData((prev) => ({
      ...prev,
      carts: {
        ...prev.carts,
        [currentUser.id]: [],
      },
    }));
  };

  const placeOrder = ({ address, notes = '', paymentMethod = 'cash_on_delivery' }) => {
    if (!isCustomer || !currentUser) {
      return { success: false, message: 'Please login as customer to place an order.' };
    }

    const rawItems = data.carts[currentUser.id] || [];
    if (!rawItems.length) {
      return { success: false, message: 'Cart is empty.' };
    }

    const orderItems = [];
    for (const item of rawItems) {
      const product = data.products.find((prd) => prd.id === item.productId);
      if (!product) continue;
      if (item.quantity > product.stockQuantity) {
        return {
          success: false,
          message: `Insufficient stock for ${product.name}.`,
        };
      }

      orderItems.push({
        id: uid('orderItem'),
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        pricePerKg: product.pricePerKg,
        lineTotal: Number((item.quantity * product.pricePerKg).toFixed(2)),
      });
    }

    if (!orderItems.length) {
      return { success: false, message: 'Cart items are invalid.' };
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const deliveryCharge = subtotal > 5000 ? 0 : 250;
    const totalAmount = Number((subtotal + deliveryCharge).toFixed(2));

    const newOrder = {
      id: uid('ord'),
      orderNumber: `RR-${Date.now().toString().slice(-6)}`,
      customerId: currentUser.id,
      customerName: getDisplayName(currentUser),
      customerEmail: currentUser.email,
      items: orderItems,
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentMethod,
      orderStatus: 'pending',
      address,
      notes,
      createdAt: getNowIso(),
      updatedAt: getNowIso(),
    };

    setData((prev) => {
      const nextProducts = prev.products.map((product) => {
        const ordered = orderItems.find((item) => item.productId === product.id);
        if (!ordered) return product;
        return {
          ...product,
          stockQuantity: Math.max(0, product.stockQuantity - ordered.quantity),
        };
      });

      return {
        ...prev,
        products: nextProducts,
        orders: [newOrder, ...prev.orders],
        carts: {
          ...prev.carts,
          [currentUser.id]: [],
        },
      };
    });

    logVisitorEvent({
      page: '/checkout',
      action: 'order_completed',
      details: { orderId: newOrder.id, totalAmount },
    });

    return {
      success: true,
      message: 'Order placed successfully.',
      order: newOrder,
    };
  };

  const addReview = ({ productId, rating, comment }) => {
    if (!isCustomer || !currentUser) {
      return { success: false, message: 'Please login to submit a review.' };
    }

    const product = data.products.find((item) => item.id === productId);
    if (!product) {
      return { success: false, message: 'Product not found.' };
    }

    const alreadyReviewed = data.reviews.some(
      (review) => review.productId === productId && review.customerId === currentUser.id
    );

    if (alreadyReviewed) {
      return { success: false, message: 'You have already reviewed this product.' };
    }

    const newReview = {
      id: uid('rev'),
      productId,
      customerId: currentUser.id,
      customerName: getDisplayName(currentUser),
      rating,
      comment,
      isApproved: false,
      createdAt: getNowIso(),
    };

    setData((prev) => ({
      ...prev,
      reviews: [newReview, ...prev.reviews],
    }));

    logVisitorEvent({
      page: `/product/${productId}`,
      action: 'review_submitted',
      details: { productId, rating },
    });

    return {
      success: true,
      message: 'Review submitted and awaiting admin approval.',
    };
  };

  const approveReview = (reviewId, approve = true) => {
    setData((prev) => {
      const nextReviews = prev.reviews.map((review) =>
        review.id === reviewId ? { ...review, isApproved: approve } : review
      );
      return attachReviewAggregates({ ...prev, reviews: nextReviews });
    });
  };

  const deleteReview = (reviewId) => {
    setData((prev) => {
      const nextState = {
        ...prev,
        reviews: prev.reviews.filter((review) => review.id !== reviewId),
      };
      return attachReviewAggregates(nextState);
    });
  };

  const submitContactMessage = ({ name, email, phone, message }) => {
    if (!name || !email || !message) {
      return { success: false, message: 'Name, email, and message are required.' };
    }

    const newMessage = {
      id: uid('msg'),
      name,
      email: email.toLowerCase(),
      phone: phone ? normalizePhone(phone) : '',
      message,
      status: 'new',
      createdAt: getNowIso(),
    };

    setData((prev) => ({
      ...prev,
      contactMessages: [newMessage, ...prev.contactMessages],
    }));

    return {
      success: true,
      message: 'Message sent successfully.',
    };
  };

  const markMessageStatus = (messageId, status) => {
    setData((prev) => ({
      ...prev,
      contactMessages: prev.contactMessages.map((message) =>
        message.id === messageId ? { ...message, status, updatedAt: getNowIso() } : message
      ),
    }));
  };

  const addCategory = ({ name, description }) => {
    if (!name) return { success: false, message: 'Category name is required.' };

    const exists = data.categories.some((cat) => cat.name.toLowerCase() === name.toLowerCase());
    if (exists) return { success: false, message: 'Category already exists.' };

    const newCategory = {
      id: uid('cat'),
      name,
      description,
      createdAt: getNowIso(),
    };

    setData((prev) => ({
      ...prev,
      categories: [newCategory, ...prev.categories],
    }));

    return { success: true, message: 'Category created.' };
  };

  const updateCategory = (id, updates) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates, updatedAt: getNowIso() } : cat
      ),
    }));
  };

  const deleteCategory = (id) => {
    const inUse = data.products.some((prd) => prd.categoryId === id);
    if (inUse) {
      return {
        success: false,
        message: 'Cannot delete category while products are assigned to it.',
      };
    }

    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat.id !== id),
    }));

    return { success: true, message: 'Category deleted.' };
  };

  const addProduct = (productInput) => {
    const { name, categoryId, pricePerKg, stockQuantity, description, image = '', isFeatured = false } = productInput;

    if (!name || !categoryId || !pricePerKg || stockQuantity === undefined || !description) {
      return { success: false, message: 'Please fill all required product fields.' };
    }

    const newProduct = {
      id: uid('prd'),
      name,
      categoryId,
      pricePerKg: Number(pricePerKg),
      stockQuantity: Number(stockQuantity),
      description,
      image,
      isFeatured,
      rating: 0,
      reviewCount: 0,
      createdAt: getNowIso(),
    };

    setData((prev) => ({
      ...prev,
      products: [newProduct, ...prev.products],
    }));

    return { success: true, message: 'Product added successfully.' };
  };

  const updateProduct = (productId, updates) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === productId
          ? {
              ...product,
              ...updates,
              pricePerKg:
                updates.pricePerKg !== undefined ? Number(updates.pricePerKg) : product.pricePerKg,
              stockQuantity:
                updates.stockQuantity !== undefined ? Number(updates.stockQuantity) : product.stockQuantity,
              updatedAt: getNowIso(),
            }
          : product
      ),
    }));
  };

  const deleteProduct = (productId) => {
    setData((prev) => {
      const nextState = {
        ...prev,
        products: prev.products.filter((product) => product.id !== productId),
        reviews: prev.reviews.filter((review) => review.productId !== productId),
      };
      return attachReviewAggregates(nextState);
    });
  };

  const updateOrderStatus = (orderId, orderStatus) => {
    setData((prev) => ({
      ...prev,
      orders: prev.orders.map((order) =>
        order.id === orderId ? { ...order, orderStatus, updatedAt: getNowIso() } : order
      ),
    }));
  };

  const addBlogPost = ({ title, excerpt, content, image = '', status = 'published' }) => {
    if (!title || !excerpt || !content) {
      return { success: false, message: 'Title, excerpt, and content are required.' };
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const exists = data.blogPosts.some((post) => post.slug === slug);
    const uniqueSlug = exists ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const newPost = {
      id: uid('blog'),
      title,
      slug: uniqueSlug,
      excerpt,
      content,
      image,
      status,
      createdAt: getNowIso(),
    };

    setData((prev) => ({
      ...prev,
      blogPosts: [newPost, ...prev.blogPosts],
    }));

    return { success: true, message: 'Blog post created.', post: newPost };
  };

  const updateBlogPost = (id, updates) => {
    setData((prev) => ({
      ...prev,
      blogPosts: prev.blogPosts.map((post) =>
        post.id === id ? { ...post, ...updates, updatedAt: getNowIso() } : post
      ),
    }));
  };

  const deleteBlogPost = (id) => {
    setData((prev) => ({
      ...prev,
      blogPosts: prev.blogPosts.filter((post) => post.id !== id),
    }));
  };

  const updateSettings = (updates) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates,
        updatedAt: getNowIso(),
      },
    }));
  };

  const resetDemoData = () => {
    setData(createInitialData());
    setSession({ token: '', role: '', userId: '' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORE_KEY);
      localStorage.removeItem(SESSION_KEY);
    }
  };

  const contextValue = {
    hydrated,
    data,
    session,
    currentUser,
    isAuthenticated,
    isAdmin,
    isCustomer,
    cartItems: activeCartItems,
    cartCount,
    cartSubtotal,
    logVisitorEvent,
    registerAccount,
    verifyAccountOtp,
    login,
    logout,
    updateCurrentProfile,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    addReview,
    approveReview,
    deleteReview,
    submitContactMessage,
    markMessageStatus,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    updateSettings,
    resetDemoData,
  };

  return <AppStoreContext.Provider value={contextValue}>{children}</AppStoreContext.Provider>;
}

export const useAppStore = () => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used inside AppStoreProvider');
  }
  return context;
};

