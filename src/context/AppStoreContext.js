import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const API_BASE = '/api/backend/store';
const SESSION_KEY = 'rohan-rice-session-v2';
const VISITOR_KEY = 'rohan-rice-visitor-v1';

const defaultSession = {
  token: '',
  role: '',
  userId: '',
};

const emptyData = {
  admins: [],
  customers: [],
  workers: [],
  categories: [],
  products: [],
  orders: [],
  payments: [],
  ledger: [],
  fraudAlerts: [],
  reviews: [],
  blogPosts: [],
  visitorLogs: [],
  contactMessages: [],
  carts: {},
  settings: {},
};

// Session can be missing or corrupted in localStorage; normalize it before render.
const normalizeSession = (value) => {
  if (!value || typeof value !== 'object') {
    return { ...defaultSession };
  }

  return {
    token: typeof value.token === 'string' ? value.token : '',
    role: typeof value.role === 'string' ? value.role : '',
    userId: typeof value.userId === 'string' ? value.userId : '',
  };
};

const safeParse = (raw, fallback) => {
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== 'object') {
      return fallback;
    }
    return parsed;
  } catch (error) {
    return fallback;
  }
};

const ensureVisitorId = () => {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const generated = `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem(VISITOR_KEY, generated);
  return generated;
};

const apiCall = async (path, { method = 'GET', body, token = '' } = {}) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: 'Unexpected server response.',
  }));

  if (!response.ok || payload?.success === false) {
    const error = new Error(payload?.message || `Request failed (${response.status})`);
    error.payload = payload;
    throw error;
  }

  return payload;
};

const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const [data, setData] = useState(emptyData);
  const [sessionState, setSession] = useState(defaultSession);
  const [currentUser, setCurrentUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const didHydrateRef = useRef(false);

  const session = normalizeSession(sessionState);
  const currentSession = session;

  const refreshData = useCallback(async (tokenOverride = currentSession.token) => {
    try {
      const payload = await apiCall('/bootstrap', {
        token: tokenOverride || '',
      });

      setData({
        ...emptyData,
        ...(payload.data || {}),
      });

      if (payload.session?.user && payload.session?.role) {
        setCurrentUser(payload.session.user);
        setSession((prev) => ({
          token: tokenOverride || prev.token || '',
          role: payload.session.role,
          userId: payload.session.user.id,
        }));
      } else {
        setCurrentUser(null);
        if (tokenOverride) {
          setSession(defaultSession);
        }
      }

      return payload;
    } catch (error) {
      if (tokenOverride) {
        setCurrentUser(null);
        setSession(defaultSession);
        try {
          const guestPayload = await apiCall('/bootstrap');
          setData({
            ...emptyData,
            ...(guestPayload.data || {}),
          });
        } catch (fallbackError) {
          setData(emptyData);
        }
      }
      return {
        success: false,
        message: error.message,
      };
    }
  }, [currentSession.token]);

  useEffect(() => {
    if (didHydrateRef.current) return;
    didHydrateRef.current = true;

    let mounted = true;

    const hydrate = async () => {
      if (typeof window === 'undefined') return;

      ensureVisitorId();
      const storedSession = normalizeSession(
        safeParse(localStorage.getItem(SESSION_KEY), defaultSession)
      );

      if (!mounted) return;
      setSession(storedSession);

      await refreshData(storedSession?.token || '');

      if (mounted) {
        setHydrated(true);
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, [refreshData]);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [hydrated, session]);

  const isAuthenticated = Boolean(currentSession.token && currentUser);
  const isAdmin = isAuthenticated && currentSession.role === 'admin';
  const isCustomer = isAuthenticated && currentSession.role === 'customer';
  const isWorker = isAuthenticated && currentSession.role === 'worker';

  const cartItems = useMemo(() => {
    if (!isCustomer || !currentUser?.id) return [];
    const source = data.carts?.[currentUser.id] || [];
    return source
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
  }, [currentUser?.id, data.carts, data.products, isCustomer]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [cartItems]
  );

  const withResult = async (action) => {
    try {
      return await action();
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Request failed.',
      };
    }
  };

  const registerAccount = useCallback(
    async ({ role, name, email, phone, password, profileImage = '' }) =>
      withResult(async () =>
        apiCall('/auth/signup/request', {
          method: 'POST',
          body: { role, name, email, phone, password, profileImage },
        })
      ),
    []
  );

  const verifyAccountOtp = useCallback(
    async ({ otpSessionId, emailOtp, phoneOtp }) =>
      withResult(async () => {
        const payload = await apiCall('/auth/signup/verify', {
          method: 'POST',
          body: { otpSessionId, emailOtp, phoneOtp },
        });

        const nextSession = {
          token: payload.token,
          role: payload.role,
          userId: payload.user?.id || '',
        };
        setSession(nextSession);
        setCurrentUser(payload.user || null);
        await refreshData(payload.token);
        return payload;
      }),
    [refreshData]
  );

  const login = useCallback(
    async ({ role, email, password }) =>
      withResult(async () => {
        const payload = await apiCall('/auth/login', {
          method: 'POST',
          body: { role, email, password },
        });

        const nextSession = {
          token: payload.token,
          role: payload.role,
          userId: payload.user?.id || '',
        };
        setSession(nextSession);
        setCurrentUser(payload.user || null);
        await refreshData(payload.token);
        return payload;
      }),
    [refreshData]
  );

  const loginWorker = useCallback(
    async ({ phone, password }) =>
      withResult(async () => {
        const payload = await apiCall('/auth/worker/login', {
          method: 'POST',
          body: { phone, password },
        });

        const nextSession = {
          token: payload.token,
          role: payload.role,
          userId: payload.user?.id || '',
        };
        setSession(nextSession);
        setCurrentUser(payload.user || null);
        await refreshData(payload.token);
        return payload;
      }),
    [refreshData]
  );

  const logout = useCallback(
    async () => {
      if (currentSession.token) {
        await withResult(async () =>
          apiCall('/auth/logout', {
            method: 'POST',
            token: currentSession.token,
          })
        );
      }

      setSession(defaultSession);
      setCurrentUser(null);
      await refreshData('');

      return { success: true, message: 'Logged out.' };
    },
    [currentSession.token, refreshData]
  );

  const logVisitorEvent = useCallback(
    async ({ page, action, details = {} }) => {
      const visitorId = ensureVisitorId();
      await withResult(async () =>
        apiCall('/visitor-log', {
          method: 'POST',
          token: currentSession.token,
          body: {
            page,
            action,
            details,
            visitorId,
          },
        })
      );
    },
    [currentSession.token]
  );

  const updateCurrentProfile = useCallback(
    async (updates) =>
      withResult(async () => {
        const payload = await apiCall('/profile', {
          method: 'PUT',
          token: currentSession.token,
          body: updates,
        });
        setCurrentUser(payload.user || null);
        await refreshData(currentSession.token);
        return payload;
      }),
    [currentSession.token, refreshData]
  );

  const addToCart = useCallback(
    async (productId, quantity = 1) =>
      withResult(async () => {
        const payload = await apiCall('/cart/add', {
          method: 'POST',
          token: session.token,
          body: { productId, quantity },
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const updateCartQuantity = useCallback(
    async (productId, quantity) =>
      withResult(async () => {
        const payload = await apiCall('/cart/item', {
          method: 'PUT',
          token: session.token,
          body: { productId, quantity },
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const removeFromCart = useCallback(
    async (productId) =>
      withResult(async () => {
        const payload = await apiCall(`/cart/item/${productId}`, {
          method: 'DELETE',
          token: session.token,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const clearCart = useCallback(
    async () =>
      withResult(async () => {
        const payload = await apiCall('/cart/clear', {
          method: 'DELETE',
          token: session.token,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const placeOrder = useCallback(
    async ({
      address,
      notes = '',
      paymentMethod = 'cash_on_delivery',
      transactionId = '',
      senderPhone = '',
      paymentProofImage = '',
    }) =>
      withResult(async () => {
        const payload = await apiCall('/orders/create', {
          method: 'POST',
          token: session.token,
          body: { address, notes, paymentMethod, transactionId, senderPhone, paymentProofImage },
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const addReview = useCallback(
    async ({ productId, rating, comment }) =>
      withResult(async () => {
        const payload = await apiCall('/reviews', {
          method: 'POST',
          token: session.token,
          body: { productId, rating, comment },
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const approveReview = useCallback(
    async (reviewId, approve = true) =>
      withResult(async () => {
        const payload = await apiCall(`/reviews/${reviewId}/approve`, {
          method: 'PATCH',
          token: session.token,
          body: { approve },
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const deleteReview = useCallback(
    async (reviewId) =>
      withResult(async () => {
        const payload = await apiCall(`/reviews/${reviewId}`, {
          method: 'DELETE',
          token: session.token,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const submitContactMessage = useCallback(
    async ({ name, email, phone, message }) =>
      withResult(async () =>
        apiCall('/contact', {
          method: 'POST',
          body: { name, email, phone, message },
        })
      ),
    []
  );

  const markMessageStatus = useCallback(
    async (messageId, status) =>
      withResult(async () => {
        const payload = await apiCall(`/messages/${messageId}/status`, {
          method: 'PATCH',
          token: session.token,
          body: { status },
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const addCategory = useCallback(
    async ({ name, description }) =>
      withResult(async () => {
        const payload = await apiCall('/categories', {
          method: 'POST',
          token: session.token,
          body: { name, description },
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const updateCategory = useCallback(
    async (id, updates) =>
      withResult(async () => {
        const payload = await apiCall(`/categories/${id}`, {
          method: 'PUT',
          token: session.token,
          body: updates,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const deleteCategory = useCallback(
    async (id) =>
      withResult(async () => {
        const payload = await apiCall(`/categories/${id}`, {
          method: 'DELETE',
          token: session.token,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const addProduct = useCallback(
    async (productInput) =>
      withResult(async () => {
        const payload = await apiCall('/products', {
          method: 'POST',
          token: session.token,
          body: productInput,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const updateProduct = useCallback(
    async (productId, updates) =>
      withResult(async () => {
        const payload = await apiCall(`/products/${productId}`, {
          method: 'PUT',
          token: session.token,
          body: updates,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const deleteProduct = useCallback(
    async (productId) =>
      withResult(async () => {
        const payload = await apiCall(`/products/${productId}`, {
          method: 'DELETE',
          token: session.token,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const updateOrderStatus = useCallback(
    async (orderId, orderStatus) =>
      withResult(async () => {
        const payload = await apiCall(`/orders/${orderId}/status`, {
          method: 'PUT',
          token: session.token,
          body: { orderStatus },
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const assignWorkerToOrder = useCallback(
    async (orderId, workerId) =>
      withResult(async () => {
        const payload = await apiCall(`/admin/orders/${orderId}/assign-worker`, {
          method: 'POST',
          token: session.token,
          body: { workerId },
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const uploadPaymentProof = useCallback(
    async ({ orderId, paymentMethod, transactionId, senderPhone, paymentProofImage }) =>
      withResult(async () => {
        const payload = await apiCall('/payments/upload', {
          method: 'POST',
          token: session.token,
          body: { orderId, paymentMethod, transactionId, senderPhone, paymentProofImage },
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const verifyPayment = useCallback(
    async (paymentId, approve = true, rejectionReason = '') =>
      withResult(async () => {
        const payload = await apiCall(`/admin/payments/${paymentId}/verify`, {
          method: 'PATCH',
          token: session.token,
          body: { approve, rejectionReason },
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const markOrderPaid = useCallback(
    async ({ orderId, paymentProofImage = '', transactionId = '', senderPhone = '', complete = true }) =>
      withResult(async () => {
        const payload = await apiCall('/orders/mark-paid', {
          method: 'POST',
          token: session.token,
          body: { orderId, paymentProofImage, transactionId, senderPhone, complete },
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const markOrderDelivered = useCallback(
    async (orderId) =>
      withResult(async () => {
        const payload = await apiCall(`/worker/orders/${orderId}/delivered`, {
          method: 'POST',
          token: session.token,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const addWorker = useCallback(
    async (workerInput) =>
      withResult(async () => {
        const payload = await apiCall('/admin/workers', {
          method: 'POST',
          token: session.token,
          body: workerInput,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const updateWorker = useCallback(
    async (workerId, updates) =>
      withResult(async () => {
        const payload = await apiCall(`/admin/workers/${workerId}`, {
          method: 'PUT',
          token: session.token,
          body: updates,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const updateFraudAlertStatus = useCallback(
    async (alertId, status) =>
      withResult(async () => {
        const payload = await apiCall(`/admin/fraud-alerts/${alertId}/status`, {
          method: 'PATCH',
          token: session.token,
          body: { status },
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const addBlogPost = useCallback(
    async ({ title, excerpt, content, image = '', status = 'published' }) =>
      withResult(async () => {
        const payload = await apiCall('/blog', {
          method: 'POST',
          token: session.token,
          body: { title, excerpt, content, image, status },
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const updateBlogPost = useCallback(
    async (id, updates) =>
      withResult(async () => {
        const payload = await apiCall(`/blog/${id}`, {
          method: 'PUT',
          token: session.token,
          body: updates,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const deleteBlogPost = useCallback(
    async (id) =>
      withResult(async () => {
        const payload = await apiCall(`/blog/${id}`, {
          method: 'DELETE',
          token: session.token,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const updateSettings = useCallback(
    async (updates) =>
      withResult(async () => {
        const payload = await apiCall('/settings', {
          method: 'PUT',
          token: session.token,
          body: updates,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const resetDemoData = useCallback(
    async () =>
      withResult(async () => {
        const payload = await apiCall('/reset-demo', {
          method: 'POST',
          token: session.token,
        });
        await refreshData(session.token);
        return payload;
      }),
    [refreshData, session.token]
  );

  const contextValue = {
    hydrated,
    data,
    session,
    currentUser,
    isAuthenticated,
    isAdmin,
    isCustomer,
    isWorker,
    cartItems,
    cartCount,
    cartSubtotal,
    refreshData,
    logVisitorEvent,
    registerAccount,
    verifyAccountOtp,
    login,
    loginWorker,
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
    assignWorkerToOrder,
    uploadPaymentProof,
    verifyPayment,
    markOrderPaid,
    markOrderDelivered,
    addWorker,
    updateWorker,
    updateFraudAlertStatus,
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
