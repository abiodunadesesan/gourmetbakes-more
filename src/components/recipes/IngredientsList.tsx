'use client';

import React, { useState, useEffect } from 'react';
import { Minus, Plus, Check } from 'lucide-react';

interface Ingredient {
    ingredient_id: string;
    section: string | null;
    ingredient_name: string;
    quantity: number;
    unit: string;
}

interface IngredientsListProps {
    recipeId: string;
    baseServings: number;
    ingredients: Ingredient[];
}

export default function IngredientsList({ recipeId, baseServings, ingredients }: IngredientsListProps) {
    const [servings, setServings] = useState(baseServings);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    // Formatting utility for nicer fractions instead of long decimals (e.g., 1.5 -> 1 ½)
    const formatQuantity = (qty: number) => {
        if (qty === 0) return '';
        const whole = Math.floor(qty);
        const fraction = qty - whole;
        let fractionStr = '';
        if (fraction > 0.1 && fraction < 0.3) fractionStr = '¼';
        else if (fraction >= 0.3 && fraction < 0.4) fractionStr = '⅓';
        else if (fraction >= 0.4 && fraction < 0.6) fractionStr = '½';
        else if (fraction >= 0.6 && fraction < 0.7) fractionStr = '⅔';
        else if (fraction >= 0.7 && fraction < 0.9) fractionStr = '¾';
        else if (fraction !== 0) fractionStr = fraction.toFixed(2).replace(/\.?0+$/, ''); // Fallback

        if (whole === 0) return fractionStr;
        return `${whole} ${fractionStr}`.trim();
    };

    // Load checked items from local storage
    useEffect(() => {
        const stored = localStorage.getItem(`recipe_checked_${recipeId}`);
        if (stored) {
            try {
                setCheckedItems(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse checked items", e);
            }
        }
    }, [recipeId]);

    const toggleCheck = (id: string) => {
        const newChecked = { ...checkedItems, [id]: !checkedItems[id] };
        setCheckedItems(newChecked);
        localStorage.setItem(`recipe_checked_${recipeId}`, JSON.stringify(newChecked));
    };

    const multiplier = servings / baseServings;

    // Group ingredients by section
    const grouped = ingredients.reduce((acc, curr) => {
        const section = curr.section || 'Main';
        if (!acc[section]) acc[section] = [];
        acc[section].push(curr);
        return acc;
    }, {} as Record<string, Ingredient[]>);

    return (
        <div className="bg-orange-50/50 p-6 sm:p-8 rounded-3xl border border-orange-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h3 className="text-2xl font-bold text-slate-800">Ingredients</h3>
                
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100">
                    <span className="text-sm font-medium text-slate-600">Yield:</span>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setServings(Math.max(1, servings - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-4 text-center text-slate-800">{servings}</span>
                        <button 
                            onClick={() => setServings(servings + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-8 text-slate-700">
                {Object.entries(grouped).map(([section, items]) => (
                    <div key={section}>
                        {section !== 'Main' && (
                            <h4 className="font-bold text-lg mb-4 text-slate-800">{section}</h4>
                        )}
                        <ul className="space-y-3">
                            {items.map(req => {
                                const id = req.ingredient_id;
                                const isChecked = checkedItems[id];
                                const adjustedQty = req.quantity * multiplier;

                                return (
                                    <li 
                                        key={id}
                                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                                            isChecked ? 'opacity-50 line-through bg-slate-100 hover:opacity-75' : 'hover:bg-white'
                                        }`}
                                        onClick={() => toggleCheck(id)}
                                    >
                                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                                            isChecked ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'
                                        }`}>
                                            {isChecked && <Check className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className="leading-relaxed select-none">
                                            {req.quantity > 0 && (
                                                <strong className="mr-1 inline-block min-w-[2.5rem]">
                                                    {formatQuantity(adjustedQty)} {req.unit}
                                                </strong>
                                            )}
                                            {req.ingredient_name}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
