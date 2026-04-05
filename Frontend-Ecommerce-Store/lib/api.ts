const API = process.env.NEXT_PUBLIC_API_URL;

// ==================== AUTH ====================
export const loginUser = async (data: any) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const registerUser = async (data: any) => {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ==================== PRODUCTS ====================
export const getProducts = async () => {
  const res = await fetch(`${API}/api/products`);
  return res.json();
};

export const getProductById = async (id: string) => {
  const res = await fetch(`${API}/api/products/${id}`);
  return res.json();
};

// ==================== ADMIN ====================
export const getUsers = async (token: string) => {
  const res = await fetch(`${API}/api/auth/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const toggleAdmin = async (id: string, token: string) => {
  const res = await fetch(`${API}/api/auth/users/${id}/toggle-admin`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const deleteUser = async (id: string, token: string) => {
  const res = await fetch(`${API}/api/auth/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getAnalytics = async (token: string) => {
  const res = await fetch(`${API}/api/auth/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const adminCreateProduct = async (data: any, token: string) => {
  const res = await fetch(`${API}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const adminUpdateProduct = async (id: string, data: any, token: string) => {
  const res = await fetch(`${API}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const adminDeleteProduct = async (id: string, token: string) => {
  const res = await fetch(`${API}/api/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// ==================== SELLER APPLICATIONS (admin) ====================
export const getSellerApplications = async (token: string) => {
  const res = await fetch(`${API}/api/auth/seller-applications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const updateSellerStatus = async (id: string, status: string, token: string) => {
  const res = await fetch(`${API}/api/auth/seller-applications/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

export const getPendingProducts = async (token: string) => {
  const res = await fetch(`${API}/api/products/admin/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const approveProduct = async (id: string, isApproved: boolean, token: string) => {
  const res = await fetch(`${API}/api/products/admin/${id}/approve`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ isApproved }),
  });
  return res.json();
};

// ==================== SELLER ====================
export const applyForSeller = async (data: any, token: string) => {
  const res = await fetch(`${API}/api/auth/apply-seller`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getSellerAnalytics = async (token: string) => {
  const res = await fetch(`${API}/api/auth/seller-analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const sellerCreateProduct = async (data: any, token: string) => {
  const res = await fetch(`${API}/api/products/seller/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getSellerProducts = async (token: string) => {
  const res = await fetch(`${API}/api/products/seller/my-products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const sellerUpdateProduct = async (id: string, data: any, token: string) => {
  const res = await fetch(`${API}/api/products/seller/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const sellerDeleteProduct = async (id: string, token: string) => {
  const res = await fetch(`${API}/api/products/seller/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};