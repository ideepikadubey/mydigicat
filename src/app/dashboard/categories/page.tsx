"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  FolderPlus,
} from "lucide-react";
import { store } from "@/lib/store";
import { Category, Product, Profile } from "@/lib/types";
import { getContrastTextColor } from "@/lib/utils";

export default function CategoriesPage() {
  const [profile, setProfile] = useState<Profile>(store.getProfile());
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync state on client mount and store updates
  useEffect(() => {
    const syncData = () => {
      setProfile(store.getProfile());
      setCategories(store.getCategories());
      setProducts(store.getProducts());
    };

    syncData();
    window.addEventListener("mydigicat_store_update", syncData);
    return () => window.removeEventListener("mydigicat_store_update", syncData);
  }, []);

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) {
      showFeedback("error", "Please enter a category name first.");
      return;
    }

    // Check for duplicate category name
    const exists = categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      showFeedback("error", `Category "${trimmed}" already exists.`);
      return;
    }

    const added = store.addCategory(trimmed);
    // Directly update local state for instantaneous UI response
    const updated = store.getCategories();
    setCategories(updated);
    setNewCatName("");
    showFeedback("success", `Category "${trimmed}" added successfully!`);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const saveEdit = (id: string) => {
    const trimmed = editingName.trim();
    if (trimmed) {
      store.updateCategory(id, trimmed);
      setCategories(store.getCategories());
      showFeedback("success", `Category renamed to "${trimmed}"`);
    }
    setEditingId(null);
  };

  const handleDelete = (id: string, name: string) => {
    const count = products.filter((p) => p.category_id === id).length;
    const msg =
      count > 0
        ? `Deleting "${name}" will unassign ${count} product(s). Do you wish to continue?`
        : `Are you sure you want to delete category "${name}"?`;

    if (confirm(msg)) {
      store.deleteCategory(id);
      setCategories(store.getCategories());
      setProducts(store.getProducts());
      showFeedback("success", `Category "${name}" deleted.`);
    }
  };

  const moveCategory = (index: number, direction: "up" | "down") => {
    const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < sorted.length) {
      const temp = sorted[index];
      sorted[index] = sorted[targetIndex];
      sorted[targetIndex] = temp;

      // Re-assign sort_orders
      const updated = sorted.map((cat, idx) => ({
        ...cat,
        sort_order: idx + 1,
      }));
      store.setCategories(updated);
      setCategories(updated);
    }
  };

  const sortedCategories = [...categories].sort((a, b) => a.sort_order - b.sort_order);
  const themeColor = profile.theme_color || "#854d0e";
  const contrastText = getContrastTextColor(themeColor);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Categories & Navigation
            </h1>
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: `${themeColor}15`,
                color: themeColor,
                borderColor: `${themeColor}40`,
              }}
            >
              {categories.length} Categories
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Organize products into sections. Sticky filter chips on your public store follow this exact order.
          </p>
        </div>

        {/* Brand Theme Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: themeColor }}
          />
          <span>Theme: {profile.firm_name}</span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add Category Form */}
      <form
        onSubmit={handleAdd}
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
      >
        <div className="flex-1 relative">
          <FolderPlus className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Type category name (e.g. Festive Collections, Leather Wallets, Accessories)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => handleAdd()}
          className="px-6 py-3 rounded-xl text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 hover:opacity-95 active:scale-95"
          style={{ backgroundColor: themeColor, color: contrastText }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </form>

      {/* Categories Reorder List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-3">
        {sortedCategories.map((cat, idx) => {
          const productCount = products.filter((p) => p.category_id === cat.id).length;
          const isEditing = editingId === cat.id;

          return (
            <div
              key={cat.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              {/* Order Number + Name */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(cat.id)}
                      autoFocus
                      className="px-3 py-1.5 rounded-lg border border-blue-500 text-xs font-bold text-slate-900 focus:outline-none flex-1 max-w-sm"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(cat.id)}
                      className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-extrabold text-sm text-slate-900 truncate">
                      {cat.name}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shrink-0">
                      {productCount} products
                    </span>
                  </div>
                )}
              </div>

              {/* Actions & Reordering buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => moveCategory(idx, "up")}
                  disabled={idx === 0}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
                  title="Move category up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveCategory(idx, "down")}
                  disabled={idx === sortedCategories.length - 1}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all"
                  title="Move category down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-5 bg-slate-300 mx-1" />

                <button
                  type="button"
                  onClick={() => startEdit(cat)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Rename"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {sortedCategories.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-semibold text-sm">No categories created yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Add your first category using the input above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
