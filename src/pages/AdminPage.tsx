import type { Session } from "@supabase/supabase-js";
import {
  ArrowLeft,
  BadgeIndianRupee,
  Box,
  CheckCircle2,
  LayoutDashboard,
  Loader2,
  LogOut,
  Package,
  Search,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BrandMark } from "../components/ui/BrandMark";
import { Button } from "../components/ui/Button";
import { currency, formatDateTime } from "../lib/format";
import { supabase } from "../lib/supabase";
import type { Order, OrderStatus, Product } from "../types";

type AdminPageProps = {
  path: string;
  navigate: (path: string) => void;
};

const statuses: OrderStatus[] = ["New", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export function AdminPage({ path, navigate }: AdminPageProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authLoading && !session && path !== "/admin/login") navigate("/admin/login");
    if (!authLoading && session && path === "/admin/login") navigate("/admin");
  }, [authLoading, navigate, path, session]);

  if (authLoading) {
    return <FullScreenLoader label="Checking admin session" />;
  }

  if (!session || path === "/admin/login") {
    return <AdminLogin navigate={navigate} />;
  }

  return <AdminShell navigate={navigate} path={path} />;
}

function AdminLogin({ navigate }: { navigate: (path: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    navigate("/admin");
  };

  return (
    <main className="min-h-screen bg-[#fff8ed] px-5 py-8 text-slate-950">
      <div className="mx-auto flex max-w-6xl justify-between gap-4">
        <BrandMark />
        <Button onClick={() => navigate("/")} type="button" variant="secondary">
          <ArrowLeft className="h-4 w-4" /> Storefront
        </Button>
      </div>
      <section className="mx-auto mt-16 grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-teal-700">Secure Admin</p>
          <h1 className="mt-3 text-5xl font-black tracking-[-0.07em] sm:text-7xl">FurEase India control room.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Login with Supabase Auth. There are no hardcoded passwords in the app.
          </p>
        </div>
        <form className="rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-950/[0.06] ring-1 ring-slate-100 sm:p-8" onSubmit={login}>
          <label className="text-sm font-black" htmlFor="email">Email</label>
          <input
            autoComplete="email"
            className="mt-2 h-12 w-full rounded-full border border-slate-200 bg-slate-50 px-4 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
          <label className="mt-5 block text-sm font-black" htmlFor="password">Password</label>
          <input
            autoComplete="current-password"
            className="mt-2 h-12 w-full rounded-full border border-slate-200 bg-slate-50 px-4 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
          {error ? <p className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</p> : null}
          <Button className="mt-6 w-full" disabled={loading} type="submit">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Login
          </Button>
        </form>
      </section>
    </main>
  );
}

function AdminShell({ path, navigate }: AdminPageProps) {
  const activeTab = path.includes("/admin/orders") ? "orders" : path.includes("/admin/products") ? "products" : "dashboard";

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 px-5 py-4 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BrandMark />
          <div className="flex flex-wrap gap-2">
            <AdminNavButton active={activeTab === "dashboard"} onClick={() => navigate("/admin")}>Dashboard</AdminNavButton>
            <AdminNavButton active={activeTab === "orders"} onClick={() => navigate("/admin/orders")}>Orders</AdminNavButton>
            <AdminNavButton active={activeTab === "products"} onClick={() => navigate("/admin/products")}>Products</AdminNavButton>
            <Button onClick={() => navigate("/")} type="button" variant="secondary">Storefront</Button>
            <Button onClick={logout} type="button" variant="ghost"><LogOut className="h-4 w-4" /> Logout</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">
        {activeTab === "dashboard" ? <Dashboard navigate={navigate} /> : null}
        {activeTab === "orders" ? <OrdersManagement /> : null}
        {activeTab === "products" ? <ProductManagement /> : null}
      </main>
    </div>
  );
}

function AdminNavButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-black transition ${active ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function Dashboard({ navigate }: { navigate: (path: string) => void }) {
  const { orders, products, loading, error, reload } = useAdminData();
  const analytics = getAnalytics(orders, products);

  if (loading) return <FullScreenLoader label="Loading analytics" inline />;

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-teal-700">Basic Analytics</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] sm:text-6xl">Admin Dashboard</h1>
        </div>
        <Button onClick={reload} type="button" variant="secondary">Refresh</Button>
      </div>
      {error ? <AdminError error={error} /> : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={ShoppingBag} label="Total Orders" value={analytics.totalOrders.toString()} />
        <Metric icon={BadgeIndianRupee} label="Total Revenue" value={currency.format(analytics.totalRevenue)} />
        <Metric icon={Package} label="Total Products" value={analytics.totalProducts.toString()} />
        <Metric icon={CheckCircle2} label="Active Products" value={analytics.activeProducts.toString()} />
        <Metric icon={LayoutDashboard} label="New Orders" value={analytics.newOrders.toString()} />
        <Metric icon={Box} label="Confirmed Orders" value={analytics.confirmedOrders.toString()} />
        <Metric icon={CheckCircle2} label="Delivered Orders" value={analytics.deliveredOrders.toString()} />
        <Metric icon={Trash2} label="Cancelled Orders" value={analytics.cancelledOrders.toString()} />
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => navigate("/admin/orders")} type="button">Manage Orders</Button>
        <Button onClick={() => navigate("/admin/products")} type="button" variant="secondary">Manage Products</Button>
      </div>
    </section>
  );
}

function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");

  const loadOrders = async () => {
    setLoading(true);
    const { data, error: ordersError } = await supabase.from("orders").select("*").order("order_date", { ascending: false });
    if (ordersError) setError(ordersError.message);
    else {
      setOrders((data ?? []) as Order[]);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const search = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      const matchesSearch = !search || [order.customer_name, order.mobile_number, order.city, order.status]
        .join(" ")
        .toLowerCase()
        .includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [orders, query, statusFilter]);

  const analytics = getAnalytics(orders, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const { error: updateError } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, status } : order)));
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm("Delete this test/fake order?")) return;
    const { error: deleteError } = await supabase.from("orders").delete().eq("id", orderId);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setOrders((current) => current.filter((order) => order.id !== orderId));
  };

  if (loading) return <FullScreenLoader label="Loading orders" inline />;

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.28em] text-teal-700">Orders Management</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] sm:text-6xl">COD Orders</h1>
        </div>
        <Button onClick={loadOrders} type="button" variant="secondary">Refresh</Button>
      </div>
      {error ? <AdminError error={error} /> : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={ShoppingBag} label="Total Orders" value={analytics.totalOrders.toString()} />
        <Metric icon={BadgeIndianRupee} label="Total Revenue" value={currency.format(analytics.totalRevenue)} />
        <Metric icon={LayoutDashboard} label="Pending Orders" value={(analytics.newOrders + analytics.confirmedOrders).toString()} />
        <Metric icon={CheckCircle2} label="Delivered Orders" value={analytics.deliveredOrders.toString()} />
      </div>
      <div className="mt-8 flex flex-col gap-3 rounded-[2rem] bg-white p-4 ring-1 ring-slate-200 md:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, mobile, city or status"
            value={query}
          />
        </label>
        <select
          className="h-12 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          onChange={(event) => setStatusFilter(event.target.value as "All" | OrderStatus)}
          value={statusFilter}
        >
          <option value="All">All Status</option>
          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>
      <div className="mt-6 overflow-hidden rounded-[2rem] bg-white ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] text-left text-sm">
            <thead className="bg-slate-950 text-white">
              <tr>
                {["Customer Name", "Mobile Number", "Address", "City", "State", "Pincode", "Product Name", "Quantity", "Payment Method", "Total Amount", "Status", "Order Date", "Action"].map((head) => (
                  <th className="px-4 py-4 font-black" key={head}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr className="align-top" key={order.id}>
                  <td className="px-4 py-4 font-bold">{order.customer_name}</td>
                  <td className="px-4 py-4">{order.mobile_number}</td>
                  <td className="max-w-xs px-4 py-4">{order.address}</td>
                  <td className="px-4 py-4">{order.city}</td>
                  <td className="px-4 py-4">{order.state}</td>
                  <td className="px-4 py-4">{order.pincode}</td>
                  <td className="px-4 py-4 font-semibold">{order.product_name}</td>
                  <td className="px-4 py-4">{order.quantity}</td>
                  <td className="px-4 py-4">{order.payment_method}</td>
                  <td className="px-4 py-4 font-black">{currency.format(Number(order.total_amount))}</td>
                  <td className="px-4 py-4">
                    <select
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black"
                      onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)}
                      value={order.status}
                    >
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-4">{formatDateTime(order.order_date)}</td>
                  <td className="px-4 py-4">
                    <button className="rounded-full p-2 text-rose-600 hover:bg-rose-50" onClick={() => deleteOrder(order.id)} type="button">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filteredOrders.length ? <p className="p-6 text-sm font-semibold text-slate-500">No orders match your filters.</p> : null}
      </div>
    </section>
  );
}

type ProductForm = {
  product_name: string;
  description: string;
  price: string;
  original_price: string;
  image_url: string;
  category: string;
  stock: string;
  is_active: boolean;
};

const emptyProductForm: ProductForm = {
  product_name: "",
  description: "",
  price: "",
  original_price: "",
  image_url: "",
  category: "Pet Grooming",
  stock: "0",
  is_active: true,
};

function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyProductForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error: productsError } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (productsError) setError(productsError.message);
    else {
      setProducts((data ?? []) as Product[]);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const saveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.product_name.trim() || Number(form.price) < 0 || !form.price) {
      setError("Product name and a valid price are required.");
      return;
    }

    const payload = {
      product_name: form.product_name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      image_url: form.image_url.trim() || null,
      category: form.category.trim() || null,
      stock: Number(form.stock || 0),
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    setSaving(true);
    const result = editingId
      ? await supabase.from("products").update(payload).eq("id", editingId)
      : await supabase.from("products").insert(payload);
    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setForm(emptyProductForm);
    setEditingId(null);
    setSuccess(editingId ? "Product updated successfully." : "Product added successfully.");
    loadProducts();
  };

  const editProduct = (product: Product) => {
    setEditingId(product.id);
    setForm({
      product_name: product.product_name,
      description: product.description ?? "",
      price: String(product.price),
      original_price: product.original_price ? String(product.original_price) : "",
      image_url: product.image_url ?? "",
      category: product.category ?? "Pet Grooming",
      stock: String(product.stock ?? 0),
      is_active: product.is_active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (productId: string) => {
    if (!window.confirm("Delete this product?")) return;
    const { error: deleteError } = await supabase.from("products").delete().eq("id", productId);
    if (deleteError) setError(deleteError.message);
    else setProducts((current) => current.filter((product) => product.id !== productId));
  };

  const toggleProduct = async (product: Product) => {
    const { error: updateError } = await supabase
      .from("products")
      .update({ is_active: !product.is_active, updated_at: new Date().toISOString() })
      .eq("id", product.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setProducts((current) => current.map((item) => (item.id === product.id ? { ...item, is_active: !item.is_active } : item)));
  };

  if (loading) return <FullScreenLoader label="Loading products" inline />;

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-teal-700">Product Management</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] sm:text-6xl">Products Table</h1>
      </div>
      {error ? <AdminError error={error} /> : null}
      {success ? <p className="mb-5 rounded-2xl bg-teal-50 p-4 text-sm font-semibold text-teal-700">{success}</p> : null}

      <form className="grid gap-4 rounded-[2rem] bg-white p-5 ring-1 ring-slate-200 md:grid-cols-2" onSubmit={saveProduct}>
        <ProductInput label="Product Name" onChange={(value) => setForm({ ...form, product_name: value })} value={form.product_name} />
        <ProductInput label="Category" onChange={(value) => setForm({ ...form, category: value })} value={form.category} />
        <ProductInput label="Selling Price" onChange={(value) => setForm({ ...form, price: value })} type="number" value={form.price} />
        <ProductInput label="Original Price" onChange={(value) => setForm({ ...form, original_price: value })} type="number" value={form.original_price} />
        <ProductInput label="Stock" onChange={(value) => setForm({ ...form, stock: value })} type="number" value={form.stock} />
        <ProductInput label="Image URL" onChange={(value) => setForm({ ...form, image_url: value })} value={form.image_url} />
        <div className="md:col-span-2">
          <label className="text-sm font-black">Description</label>
          <textarea
            className="mt-2 min-h-24 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            value={form.description}
          />
        </div>
        <label className="flex items-center gap-3 text-sm font-black">
          <input checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} type="checkbox" />
          Active product
        </label>
        <div className="flex gap-3 md:justify-end">
          {editingId ? <Button onClick={() => { setEditingId(null); setForm(emptyProductForm); }} type="button" variant="secondary">Cancel Edit</Button> : null}
          <Button disabled={saving} type="submit">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {editingId ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {products.map((product) => (
          <article className="flex flex-col gap-4 rounded-[2rem] bg-white p-5 ring-1 ring-slate-200 sm:flex-row" key={product.id}>
            <img alt={product.product_name} className="h-32 w-32 rounded-3xl bg-slate-100 object-contain" src={product.image_url || "/images/furease-brush.png"} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black">{product.product_name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{product.category || "No category"}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${product.is_active ? "bg-teal-100 text-teal-800" : "bg-slate-100 text-slate-600"}`}>
                  {product.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
              <p className="mt-3 font-black">{currency.format(Number(product.price))} <span className="text-sm text-slate-400 line-through">{product.original_price ? currency.format(Number(product.original_price)) : ""}</span></p>
              <p className="text-sm font-semibold text-slate-500">Stock: {product.stock ?? 0}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => editProduct(product)} type="button" variant="secondary">Edit</Button>
                <Button onClick={() => toggleProduct(product)} type="button" variant="secondary">{product.is_active ? "Deactivate" : "Activate"}</Button>
                <Button onClick={() => deleteProduct(product.id)} type="button" variant="danger"><Trash2 className="h-4 w-4" /> Delete</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!products.length ? <p className="mt-6 rounded-2xl bg-white p-5 text-sm font-semibold text-slate-500 ring-1 ring-slate-200">No products yet. Add the first active product to show it on the public website.</p> : null}
    </section>
  );
}

function ProductInput({ label, onChange, type = "text", value }: { label: string; onChange: (value: string) => void; type?: string; value: string }) {
  return (
    <label className="text-sm font-black">
      {label}
      <input
        className="mt-2 h-12 w-full rounded-full border border-slate-200 bg-slate-50 px-4 font-medium outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof ShoppingBag; label: string; value: string }) {
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-5 text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black tracking-[-0.04em]">{value}</p>
    </div>
  );
}

function AdminError({ error }: { error: string }) {
  return (
    <p className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
      {error.includes("relation") ? "Supabase table is missing. Run supabase/setup.sql first." : error}
    </p>
  );
}

function FullScreenLoader({ inline = false, label }: { inline?: boolean; label: string }) {
  return (
    <div className={`${inline ? "min-h-96" : "min-h-screen"} flex items-center justify-center bg-slate-50 text-slate-700`}>
      <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-black shadow-sm ring-1 ring-slate-200">
        <Loader2 className="h-4 w-4 animate-spin" /> {label}
      </div>
    </div>
  );
}

function useAdminData() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    const [ordersResult, productsResult] = await Promise.all([
      supabase.from("orders").select("*").order("order_date", { ascending: false }),
      supabase.from("products").select("*").order("created_at", { ascending: false }),
    ]);

    if (ordersResult.error || productsResult.error) {
      setError(ordersResult.error?.message ?? productsResult.error?.message ?? "Unable to load analytics.");
    } else {
      setOrders((ordersResult.data ?? []) as Order[]);
      setProducts((productsResult.data ?? []) as Product[]);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  return { error, loading, orders, products, reload };
}

function getAnalytics(orders: Order[], products: Product[]) {
  return {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
    newOrders: orders.filter((order) => order.status === "New").length,
    confirmedOrders: orders.filter((order) => order.status === "Confirmed").length,
    deliveredOrders: orders.filter((order) => order.status === "Delivered").length,
    cancelledOrders: orders.filter((order) => order.status === "Cancelled").length,
    totalProducts: products.length,
    activeProducts: products.filter((product) => product.is_active).length,
  };
}