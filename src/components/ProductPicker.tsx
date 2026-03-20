'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus, X, Search, Loader2 } from 'lucide-react';
import { Product } from '@/types';

interface SelectedProduct {
    product_id: string;
    name: string;
    quantity: number;
}

interface ProductPickerProps {
    onProductsChange: (products: SelectedProduct[]) => void;
}

export default function ProductPicker({ onProductsChange }: ProductPickerProps) {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products?limit=100');
                const data = await res.json();
                setAllProducts(data.products || []);
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const addProduct = (product: Product) => {
        if (selectedProducts.find(p => p.product_id === product.product_id)) {
            setShowDropdown(false);
            setSearchTerm('');
            return;
        }

        const updated = [...selectedProducts, { product_id: product.product_id, name: product.name, quantity: 50 }];
        setSelectedProducts(updated);
        onProductsChange(updated);
        setShowDropdown(false);
        setSearchTerm('');
    };

    const updateQuantity = (productId: string, delta: number) => {
        const updated = selectedProducts.map(p => {
            if (p.product_id === productId) {
                return { ...p, quantity: Math.max(1, p.quantity + delta) };
            }
            return p;
        });
        setSelectedProducts(updated);
        onProductsChange(updated);
    };

    const removeProduct = (productId: string) => {
        const updated = selectedProducts.filter(p => p.product_id !== productId);
        setSelectedProducts(updated);
        onProductsChange(updated);
    };

    const filteredProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedProducts.find(sp => sp.product_id === p.product_id)
    );

    return (
        <div className="space-y-4">
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products to add..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:border-orange-500 outline-none font-bold text-sm transition-all"
                    />
                    {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-slate-300" size={18} />}
                </div>

                {showDropdown && searchTerm && (
                    <div className="absolute z-20 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-60 overflow-y-auto overflow-x-hidden">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <button
                                    key={product.product_id}
                                    type="button"
                                    onClick={() => addProduct(product)}
                                    className="w-full px-6 py-4 text-left hover:bg-orange-50 transition-colors flex items-center justify-between group"
                                >
                                    <div>
                                        <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{product.name}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{product.category}</p>
                                    </div>
                                    <Plus size={18} className="text-slate-300 group-hover:text-orange-500" />
                                </button>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-slate-400">
                                <p className="font-bold">No products found</p>
                                <p className="text-xs">Try a different search term</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedProducts.length > 0 && (
                <div className="space-y-3">
                    {selectedProducts.map(p => (
                        <div key={p.product_id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="flex-1">
                                <p className="font-bold text-slate-900">{p.name}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(p.product_id, -10)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-12 text-center font-black text-slate-900 tabular-nums">
                                        {p.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(p.product_id, 10)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeProduct(p.product_id)}
                                    className="text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
