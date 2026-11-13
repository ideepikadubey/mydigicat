"use client";

import { useState, useEffect, useRef } from "react";
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  X,
  Sparkles,
  Zap,
  FolderPlus,
  FileSpreadsheet,
  Download,
  SlidersHorizontal,
} from "lucide-react";
import { store } from "@/lib/store";
import { Product, Category, Profile } from "@/lib/types";
import { formatCurrency, compressImageToDataUrl, getContrastTextColor } from "@/lib/utils";

export default function ProductsManagementPage() {
  const [profile, setProfile] = useState<Profile>(store.getProfile());
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Selection for bulk delete
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // CSV Import Modal State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [csvError, setCsvError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Add Category Modal / Inline State
  const [showQuickAddCat, setShowQuickAddCat] = useState(false);
  const [quickCatName, setQuickCatName] = useState("");

  // Form Fields
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [variantsList, setVariantsList] = useState<string[]>([]);
  const [variantInput, setVariantInput] = useState("");
  const [inStock, setInStock] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const syncState = () => {
    setProfile(store.getProfile());
    setProducts(store.getProducts());
    setCategories(store.getCategories());
  };

  useEffect(() => {
    syncState();
    window.addEventListener("mydigicat_store_update", syncState);
    return () => window.removeEventListener("mydigicat_store_update", syncState);
  }, []);

  const themeColor = profile.theme_color || "#854d0e";
  const contrastText = getContrastTextColor(themeColor);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === "all" || p.category_id === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const maxLimit = store.getProductLimit();

  const openAddModal = () => {
    if (products.length >= maxLimit) {
      alert(`Product Limit Reached (${maxLimit} / ${maxLimit} max). Please upgrade your subscription plan or remove existing items.`);
      return;
    }
    setEditingProduct(null);
    setName("");
    setCategoryId(categories[0]?.id || "");
    setPrice("");
    setDescription("");
    setImageUrl("https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80");
    setVariantsList([]);
    setVariantInput("");
    setInStock(true);
    setIsActive(true);
    setErrorMessage("");
    setShowQuickAddCat(false);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategoryId(prod.category_id || categories[0]?.id || "");
    setPrice(prod.price.toString());
    setDescription(prod.description);
    setImageUrl(prod.image_url);
    setVariantsList(prod.variants || []);
    setVariantInput("");
    setInStock(prod.in_stock);
    setIsActive(prod.is_active);
    setErrorMessage("");
    setShowQuickAddCat(false);
    setIsModalOpen(true);
  };

  const handleAddVariant = () => {
    const val = variantInput.trim();
    if (val && !variantsList.includes(val)) {
      setVariantsList([...variantsList, val]);
      setVariantInput("");
    }
  };

  const handleRemoveVariant = (variantToRemove: string) => {
    setVariantsList(variantsList.filter((v) => v !== variantToRemove));
  };

  const handleQuickAddCategory = () => {
    const trimmed = quickCatName.trim();
    if (!trimmed) return;
    const newCat = store.addCategory(trimmed);
    const updatedCats = store.getCategories();
    setCategories(updatedCats);
    setCategoryId(newCat.id);
    setQuickCatName("");
    setShowQuickAddCat(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image exceeds 5MB limit. Please choose a smaller image.");
        return;
      }
      setIsCompressing(true);
      try {
        const compressed = await compressImageToDataUrl(file, 450 * 1024);
        setImageUrl(compressed);
        setErrorMessage("");
      } catch (err) {
        console.error("Compression failed:", err);
        setErrorMessage("Failed to compress image. Please try another file.");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Product name is required.");
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setErrorMessage("Please enter a valid price.");
      return;
    }

    try {
      if (editingProduct) {
        store.updateProduct(editingProduct.id, {
          name: name.trim(),
          category_id: categoryId || null,
          price: numPrice,
          description: description.trim(),
          image_url: imageUrl,
          variants: variantsList.length > 0 ? variantsList : undefined,
          in_stock: inStock,
          is_active: isActive,
        });
      } else {
        store.addProduct({
          category_id: categoryId || null,
          name: name.trim(),
          description: description.trim(),
          price: numPrice,
          image_url: imageUrl,
          variants: variantsList.length > 0 ? variantsList : undefined,
          in_stock: inStock,
          is_active: isActive,
          sort_order: products.length + 1,
        });
      }
      setProducts(store.getProducts());
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save product");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      store.deleteProduct(id);
      setProducts(store.getProducts());
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    }
  };

  const handleBulkDelete = () => {
    if (
      confirm(`Are you sure you want to delete ${selectedProductIds.length} selected products?`)
    ) {
      store.deleteBulkProducts(selectedProductIds);
      setProducts(store.getProducts());
      setSelectedProductIds([]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ["Name", "Category", "Price", "Description", "Variants", "In Stock", "Image URL"];
    const rows = products.map((p) => {
      const cat = categories.find((c) => c.id === p.category_id)?.name || "";
      const variants = (p.variants || []).join("; ");
      const escape = (val: any) => `"${String(val || "").replace(/"/g, '""')}"`;
      return [
        escape(p.name),
        escape(cat),
        escape(p.price),
        escape(p.description),
        escape(variants),
        escape(p.in_stock ? "Yes" : "No"),
        escape(p.image_url),
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${profile.slug || "products"}_catalogue.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Sample CSV Template
  const handleDownloadSampleCsv = () => {
    const sampleCsv = `Name,Category,Price,Description,Variants,In Stock,Image URL
"Handmade Leather Duffel Bag","Bags",3499,"Handcrafted full-grain leather travel duffel bag with brass hardware","Standard; With Monogram","Yes","https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
"Classic Oxford Shoes","Footwear",4999,"Premium formal handcrafted oxford shoes","UK 7; UK 8; UK 9; UK 10","Yes","https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
"Minimalist Card Holder","Wallets",899,"Slim leather card holder with 4 card slots and note compartment","Black; Tan Brown; Dark Chocolate","Yes","https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"`;

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + sampleCsv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mydigicat_sample_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV File Handler
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setCsvError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          setCsvError("CSV file is empty or missing headers.");
          return;
        }

        const parsedRows = lines.slice(1).map((line, idx) => {
          // Simple regex-based CSV splitter respecting quotes
          const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
          const matches = [];
          let match;
          while ((match = regex.exec(line)) !== null) {
            let val = match[1] || "";
            if (val.startsWith('"') && val.endsWith('"')) {
              val = val.substring(1, val.length - 1).replace(/""/g, '"');
            }
            matches.push(val.trim());
          }

          const [name, category, price, description, variants, inStock, imageUrl] = matches;
          return {
            id: idx,
            name: name || `Product #${idx + 1}`,
            category: category || "General",
            price: parseFloat(price) || 499,
            description: description || "",
            variants: variants ? variants.split(";").map((v) => v.trim()).filter(Boolean) : [],
            inStock: inStock?.toLowerCase() !== "no",
            imageUrl: imageUrl || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
          };
        });

        setCsvPreview(parsedRows);
      } catch (err) {
        setCsvError("Failed to parse CSV file. Please check format.");
      }
    };
    reader.readAsText(file);
  };

  // Execute CSV Batch Import
  const handleExecuteCsvImport = () => {
    if (csvPreview.length === 0) return;
    const availableSlots = maxLimit - products.length;
    if (csvPreview.length > availableSlots) {
      setCsvError(`Cannot import ${csvPreview.length} items. You only have ${availableSlots} slots remaining under your plan limit (${maxLimit}).`);
      return;
    }

    try {
      // Ensure categories exist
      const existingCats = store.getCategories();
      const catMap = new Map<string, string>();
      existingCats.forEach((c) => catMap.set(c.name.toLowerCase(), c.id));

      csvPreview.forEach((row) => {
        let catId = catMap.get(row.category.toLowerCase());
        if (!catId && row.category) {
          const newCat = store.addCategory(row.category);
          catMap.set(row.category.toLowerCase(), newCat.id);
          catId = newCat.id;
        }

        store.addProduct({
          name: row.name,
          category_id: catId || null,
          price: row.price,
          description: row.description,
          image_url: row.imageUrl,
          variants: row.variants.length > 0 ? row.variants : undefined,
          in_stock: row.inStock,
          is_active: true,
          sort_order: products.length + 1,
        });
      });

      setProducts(store.getProducts());
      setCategories(store.getCategories());
      setIsCsvModalOpen(false);
      setCsvPreview([]);
      setCsvFile(null);
    } catch (err: any) {
      setCsvError(err.message || "Failed to complete CSV import");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">Product Catalogue</h1>
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                products.length >= maxLimit
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              {products.length} / {maxLimit} Products
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your inventory, sizes/options, prices, categories, and bulk CSV uploads.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* CSV Import/Export Buttons */}
          <button
            onClick={() => {
              setCsvError("");
              setCsvPreview([]);
              setCsvFile(null);
              setIsCsvModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all"
            title="Bulk import products from CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={products.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all disabled:opacity-50"
            title="Export products to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export</span>
          </button>

          {/* Fill to Limit Test Simulator Button */}
          {products.length < maxLimit && (
            <button
              onClick={() => {
                store.fillToLimit(maxLimit);
                setProducts(store.getProducts());
              }}
              title={`Test the ${maxLimit}-product cap immediately`}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Fill To {maxLimit}</span>
            </button>
          )}

          <button
            onClick={openAddModal}
            disabled={products.length >= maxLimit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-extrabold shadow-md transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: themeColor, color: contrastText }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Product Limit Alert (if limit reached) */}
      {products.length >= maxLimit && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              {maxLimit}-Product Account Limit Reached. The database and UI protect your catalogue from exceeding {maxLimit} items.
            </span>
          </div>
          <span className="text-[11px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-mono">
            {maxLimit} / {maxLimit} Cap Active
          </span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or keywords..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({products.filter((p) => p.category_id === c.id).length})
              </option>
            ))}
          </select>

          {selectedProductIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-bold transition-colors whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedProductIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 &&
                      selectedProductIds.length === filteredProducts.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-slate-900"
                  />
                </th>
                <th className="py-4 px-2">Product</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Options / Variants</th>
                <th className="py-4 px-4 text-center">Stock</th>
                <th className="py-4 px-4 text-center">Visibility</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => {
                const category = categories.find((c) => c.id === prod.category_id);
                const isSelected = selectedProductIds.includes(prod.id);

                return (
                  <tr
                    key={prod.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? "bg-slate-50" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectProduct(prod.id)}
                        className="rounded border-slate-300 text-slate-900"
                      />
                    </td>

                    {/* Image & Name */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="max-w-xs">
                          <p className="font-extrabold text-slate-900 text-sm font-heading">{prod.name}</p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {prod.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {category?.name || "Uncategorized"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-black text-slate-900 text-sm font-heading">
                      {formatCurrency(prod.price)}
                    </td>

                    {/* Variants */}
                    <td className="py-3 px-4">
                      {prod.variants && prod.variants.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {prod.variants.map((v) => (
                            <span
                              key={v}
                              className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold border border-slate-200"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Standard item</span>
                      )}
                    </td>

                    {/* In Stock Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          store.updateProduct(prod.id, { in_stock: !prod.in_stock });
                          setProducts(store.getProducts());
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                          prod.in_stock
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {prod.in_stock ? "In Stock" : "Out of Stock"}
                      </button>
                    </td>

                    {/* Active/Hidden Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          store.updateProduct(prod.id, { is_active: !prod.is_active });
                          setProducts(store.getProducts());
                        }}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          prod.is_active
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "bg-slate-100 text-slate-400 border-slate-200"
                        }`}
                        title={prod.is_active ? "Visible to public" : "Hidden from public"}
                      >
                        {prod.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-sm">No products found matching your search</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Bulk Importer Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900">Bulk Product CSV Importer</h3>
                  <p className="text-xs text-slate-500">Upload multiple products in seconds via spreadsheet</p>
                </div>
              </div>
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {csvError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{csvError}</span>
                </div>
              )}

              {/* Template Download Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Need the CSV Template format?</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">Includes columns for Name, Category, Price, Description, Variants, Stock, Image.</p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-800 flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Sample Template</span>
                </button>
              </div>

              {/* File Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-slate-300 hover:border-slate-900 rounded-2xl text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50"
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-slate-700">{csvFile ? csvFile.name : "Click to select .CSV file"}</p>
                <p className="text-slate-400 text-[11px] mt-1">Upload standard CSV format file</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCsvFileChange}
                  className="hidden"
                />
              </div>

              {/* CSV Rows Preview */}
              {csvPreview.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">Preview ({csvPreview.length} products to import)</span>
                    <span className="text-slate-500 font-medium">{maxLimit - products.length} slots available</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                    {csvPreview.map((item, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                        <div className="truncate pr-2">
                          <span className="font-bold text-slate-900 font-heading">{item.name}</span>
                          <span className="text-slate-400 ml-2">({item.category})</span>
                        </div>
                        <span className="font-black text-slate-900 shrink-0 font-heading">{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCsvModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={csvPreview.length === 0}
                onClick={handleExecuteCsvImport}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-heading font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                Import {csvPreview.length} Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Slide-Over Sheet (Right Drawer) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/10 transition-opacity animate-fade-in"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-50">
            <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-slide-left">
              {/* Clean Modern Header */}
              <div className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-sm"
                    style={{
                      backgroundColor: `${themeColor}15`,
                      color: themeColor,
                    }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900 tracking-tight font-heading">
                      {editingProduct ? "Edit Product" : "Add New Product"}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {editingProduct
                        ? "Update product details, pricing, variants and stock"
                        : "Fill in details to list a new item in your catalogue"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveProduct} className="flex flex-col flex-1 min-h-0">
                <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
                  {errorMessage && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold flex items-center gap-2.5 animate-fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Product Name */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Classic Full-Grain Leather Satchel"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium placeholder:text-slate-400 bg-slate-50/50 hover:bg-white focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Category & Inline Creator */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                        Category
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowQuickAddCat(!showQuickAddCat)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                      >
                        <FolderPlus className="w-3.5 h-3.5" />
                        <span>{showQuickAddCat ? "Cancel New" : "+ Add New Category"}</span>
                      </button>
                    </div>

                    {showQuickAddCat && (
                      <div className="flex gap-2 p-3 bg-blue-50/70 rounded-2xl border border-blue-200 mb-2 animate-fade-in">
                        <input
                          type="text"
                          value={quickCatName}
                          onChange={(e) => setQuickCatName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleQuickAddCategory();
                            }
                          }}
                          placeholder="Type category name (e.g. Wallets)..."
                          className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <button
                          type="button"
                          onClick={handleQuickAddCategory}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-black shrink-0 shadow-sm"
                        >
                          Create
                        </button>
                      </div>
                    )}

                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                      {categories.length === 0 && (
                        <option value="">No categories created yet</option>
                      )}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Price in INR (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-500 text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="4999"
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold bg-slate-50/50 hover:bg-white focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Product Variants (Sizes, Colors, Weights) */}
                  <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center justify-between">
                      <span>Product Options / Variants</span>
                      <span className="text-[10px] text-slate-400 font-normal lowercase">(Optional: Sizes, Colors, Weights)</span>
                    </label>

                    {/* Variant Pills */}
                    {variantsList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {variantsList.map((v) => (
                          <span
                            key={v}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-sm"
                          >
                            <span>{v}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(v)}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Variant Input + Add Button */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={variantInput}
                        onChange={(e) => setVariantInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddVariant();
                          }
                        }}
                        placeholder="e.g. Size: Large or Color: Gold..."
                        className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                      <button
                        type="button"
                        onClick={handleAddVariant}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl"
                      >
                        + Add Variant
                      </button>
                    </div>

                    {/* Quick Preset Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-slate-400 font-medium">Quick presets:</span>
                      {["Small", "Medium", "Large", "Gold", "Silver", "250g", "500g", "1 Kg"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            if (!variantsList.includes(preset)) {
                              setVariantsList([...variantsList, preset]);
                            }
                          }}
                          className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-600 rounded-md text-[10px] border border-slate-200 font-medium"
                        >
                          +{preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Product Image (Auto-compressed &lt;500KB)
                    </label>
                    <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                        {imageUrl ? (
                          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-sm text-xs transition-colors">
                          <Upload className="w-3.5 h-3.5 text-slate-700" />
                          <span>{isCompressing ? "Compressing..." : "Choose Image (<5MB)"}</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                        <p className="text-[11px] text-slate-400 mt-1">JPEG, PNG, WebP format supported</p>
                      </div>
                    </div>
                  </div>

                  {/* Description & Specifications */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Description & Specifications
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Material specs, dimensions, warranty, care instructions..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50/50 hover:bg-white focus:bg-white transition-colors"
                    />
                  </div>

                  {/* In Stock & Catalogue Visibility */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <label className="flex items-center gap-3 p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                        className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                      />
                      <div>
                        <span className="font-extrabold text-xs text-slate-800 block">In Stock</span>
                        <span className="text-[10px] text-slate-500">Available to order</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                      />
                      <div>
                        <span className="font-extrabold text-xs text-slate-800 block">Visible</span>
                        <span className="text-[10px] text-slate-500">Listed on catalogue</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Fixed Footer Actions */}
                <div className="p-5 bg-white border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-xl font-black text-xs shadow-md transition-all hover:opacity-95 active:scale-95"
                    style={{ backgroundColor: themeColor || "#2563eb", color: contrastText }}
                  >
                    {editingProduct ? "Update Product" : "Save Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

