'use client';

import { apiRequest } from '@/lib/api';
import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Package, TrendingUp, ShoppingCart } from 'lucide-react';

import { useInventory } from '@/components/pos/context/InventoryContext';

interface SaleItem {
  inventory?: {
    _id: string;
    name: string;
    buyingPrice: number;
    sellingPrice: number;
  };

  quantity: number;

  sellingPrice: number;

  total: number;
}

interface Sale {
  _id: string;

  status: string;

  subtotal: number;

  total: number;

  discount: number;

  items: SaleItem[];
}

export default function AdminDashboard() {
  const { inventory } = useInventory();

  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    try {
      const response = await apiRequest('/sales');

      const completedSales = response.data.filter((sale: Sale) => sale.status === 'Paid');

      setSales(completedSales);
    } catch (error) {
      console.error('Failed loading sales:', error);
    } finally {
      setLoading(false);
    }
  }

  const analytics = useMemo(() => {
    const products = inventory.items;

    // =========================
    // REVENUE
    // =========================

    const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);

    const totalOrders = sales.length;

    // =========================
    // COGS
    // =========================

    let cogs = 0;

    sales.forEach((sale) => {
      sale.items?.forEach((item) => {
        const buyingPrice = item.inventory?.buyingPrice ?? 0;

        cogs += buyingPrice * item.quantity;
      });
    });

    // =========================
    // PROFIT
    // =========================

    const profit = revenue - cogs;

    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

    // =========================
    // AVERAGE ORDER
    // =========================

    const avgOrder = totalOrders > 0 ? revenue / totalOrders : 0;

    // =========================
    // STOCK VALUE
    // =========================

    const stockCostValue = products.reduce((sum, item) => sum + item.buyingPrice * item.stock, 0);

    const stockRetailValue = products.reduce(
      (sum, item) => sum + item.sellingPrice * item.stock,
      0
    );

    const potentialStockProfit = stockRetailValue - stockCostValue;

    // =========================
    // TOP PRODUCTS
    // =========================

    const productMap: Record<
      string,
      {
        qty: number;
        revenue: number;
      }
    > = {};

    sales.forEach((sale) => {
      sale.items?.forEach((item) => {
        const name = item.inventory?.name ?? 'Unknown';

        if (!productMap[name]) {
          productMap[name] = {
            qty: 0,
            revenue: 0,
          };
        }

        productMap[name].qty += item.quantity;

        productMap[name].revenue += item.total;
      });
    });

    const topProducts = Object.entries(productMap)
      .map(([name, data]) => ({
        name,
        ...data,
      }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // =========================
    // LOW STOCK
    // =========================

    const lowStock = products.filter((item) => item.stock <= 5).sort((a, b) => a.stock - b.stock);

    return {
      revenue,
      cogs,
      profit,
      profitMargin,
      totalOrders,
      avgOrder,
      stockCostValue,
      stockRetailValue,
      potentialStockProfit,
      topProducts,
      lowStock,
    };
  }, [sales, inventory]);

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-neutral-500">Loading analytics...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      {/* =========================
          HEADER
      ========================= */}

      <div>
        <h1 className="text-3xl font-extrabold text-[#111111]">Admin Analytics</h1>

        <p className="mt-1 text-sm text-neutral-500">Business overview for Steward POS system</p>
      </div>

      {/* =========================
          KPI CARDS
      ========================= */}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPI
          label="Revenue"
          value={`M${analytics.revenue.toFixed(2)}`}
          icon={<TrendingUp size={18} />}
          highlight
        />

        <KPI label="COGS" value={`M${analytics.cogs.toFixed(2)}`} icon={<Package size={18} />} />

        <KPI
          label="Profit"
          value={`M${analytics.profit.toFixed(2)}`}
          icon={<TrendingUp size={18} />}
          highlight
        />

        <KPI label="Orders" value={analytics.totalOrders} icon={<ShoppingCart size={18} />} />

        <KPI
          label="Average Order"
          value={`M${analytics.avgOrder.toFixed(2)}`}
          icon={<ShoppingCart size={18} />}
        />

        <KPI
          label="Profit Margin"
          value={`${analytics.profitMargin.toFixed(1)}%`}
          icon={<TrendingUp size={18} />}
          highlight
        />
      </section>

      {/* =========================
          TOP SELLING PRODUCTS
      ========================= */}

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">Top Selling Items</h2>

            <p className="mt-1 text-sm text-neutral-500">
              Your best performing products by quantity sold
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {analytics.topProducts.length === 0 ? (
            <div className="rounded-2xl border bg-white p-6 text-sm text-neutral-500 sm:col-span-2 lg:col-span-3 xl:col-span-5">
              No sales yet.
            </div>
          ) : (
            analytics.topProducts.map((product, index) => (
              <TopProductCard
                key={product.name}
                rank={index + 1}
                name={product.name}
                quantity={product.qty}
                revenue={product.revenue}
              />
            ))
          )}
        </div>
      </section>

      {/* =========================
          INVENTORY OVERVIEW
      ========================= */}

      <section className="mt-10">
        <div>
          <h2 className="text-xl font-bold text-[#111111]">Inventory Overview</h2>

          <p className="mt-1 text-sm text-neutral-500">Current value of your available stock</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <InventoryValueCard
            label="Stock Cost Value"
            description="What your current stock cost"
            value={analytics.stockCostValue}
          />

          <InventoryValueCard
            label="Stock Retail Value"
            description="Potential revenue from current stock"
            value={analytics.stockRetailValue}
            highlight
          />

          <InventoryValueCard
            label="Potential Stock Profit"
            description="Potential profit if all stock sells"
            value={analytics.potentialStockProfit}
            highlight
          />
        </div>
      </section>

      {/* =========================
          LOW STOCK
      ========================= */}

      <section className="mt-10 pb-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">Low Stock Alerts</h2>

            <p className="mt-1 text-sm text-neutral-500">Products that may need restocking</p>
          </div>

          {analytics.lowStock.length > 0 && (
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
              {analytics.lowStock.length} {analytics.lowStock.length === 1 ? 'item' : 'items'} need
              attention
            </span>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {analytics.lowStock.length === 0 ? (
            <div className="rounded-2xl border border-[#25D366]/20 bg-[#25D366]/5 p-6 sm:col-span-2 lg:col-span-3 xl:col-span-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366]/15">
                  <Package size={20} className="text-[#25D366]" />
                </div>

                <div>
                  <p className="font-bold text-[#111111]">Stock levels look healthy</p>

                  <p className="text-sm text-neutral-500">
                    No products are currently below the low-stock threshold.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            analytics.lowStock.map((item) => (
              <LowStockCard key={item.id} name={item.name} stock={item.stock} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}

/* =====================================================
   KPI
===================================================== */

function KPI({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{label}</p>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            highlight ? 'bg-[#25D366]/15 text-[#25D366]' : 'bg-neutral-100 text-neutral-500'
          }`}
        >
          {icon}
        </div>
      </div>

      <h3
        className={`mt-4 text-2xl font-extrabold ${
          highlight ? 'text-[#25D366]' : 'text-[#111111]'
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

/* =====================================================
   TOP PRODUCT CARD
===================================================== */

function TopProductCard({
  rank,
  name,
  quantity,
  revenue,
}: {
  rank: number;
  name: string;
  quantity: number;
  revenue: number;
}) {
  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366]/15 font-extrabold text-[#111111]">
          #{rank}
        </div>

        {rank === 1 && (
          <span className="rounded-full bg-[#25D366]/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#25D366]">
            Best Seller
          </span>
        )}
      </div>

      <h3 className="mt-5 truncate font-bold text-[#111111]">{name}</h3>

      <p className="mt-2 text-2xl font-extrabold text-[#25D366]">{quantity}</p>

      <p className="text-xs text-neutral-500">units sold</p>

      <div className="mt-4 border-t pt-3">
        <p className="text-xs text-neutral-500">Revenue</p>

        <p className="font-bold text-[#111111]">M{revenue.toFixed(2)}</p>
      </div>
    </div>
  );
}

/* =====================================================
   INVENTORY VALUE CARD
===================================================== */

function InventoryValueCard({
  label,
  description,
  value,
  highlight,
}: {
  label: string;
  description: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-neutral-500">{label}</p>

      <p
        className={`mt-3 text-3xl font-extrabold ${
          highlight ? 'text-[#25D366]' : 'text-[#111111]'
        }`}
      >
        M{value.toFixed(2)}
      </p>

      <p className="mt-2 text-xs text-neutral-500">{description}</p>
    </div>
  );
}

/* =====================================================
   LOW STOCK CARD
===================================================== */

function LowStockCard({ name, stock }: { name: string; stock: number }) {
  const critical = stock <= 2;

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        critical ? 'border-red-200' : 'border-orange-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            critical ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'
          }`}
        >
          <AlertTriangle size={19} />
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${
            critical ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
          }`}
        >
          {critical ? 'Critical' : 'Low'}
        </span>
      </div>

      <h3 className="mt-5 truncate font-bold text-[#111111]">{name}</h3>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className={`text-2xl font-extrabold ${critical ? 'text-red-500' : 'text-orange-500'}`}>
            {stock}
          </p>

          <p className="text-xs text-neutral-500">units remaining</p>
        </div>

        <p className="text-xs font-semibold text-neutral-400">Restock needed</p>
      </div>
    </div>
  );
}
