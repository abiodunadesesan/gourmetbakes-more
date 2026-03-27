'use client';

import React, { useState, useEffect } from 'react';
import FilterBar, { RecipeFilters } from './FilterBar';
import RecipeCard from './RecipeCard';

export default function RecipeGrid() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<RecipeFilters>({
        difficulty: '',
        category: '',
        prepTime: ''
    });

    // We can debounce the fetch so we don't spam the API on every keystroke
    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                if (searchQuery) queryParams.append('q', searchQuery);
                if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
                if (filters.category) queryParams.append('category', filters.category);
                if (filters.prepTime) queryParams.append('prepTime', filters.prepTime);

                const response = await fetch(`/api/recipes?${queryParams.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch recipes');
                
                const data = await response.json();
                setRecipes(Array.isArray(data) ? data : []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchRecipes();
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery, filters]);

    return (
        <div className="w-full">
            <FilterBar 
                filters={filters} 
                setFilters={setFilters} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
            />

            {error ? (
                <div className="text-center py-12 text-red-500">
                    <p>Failed to load recipes: {error}</p>
                </div>
            ) : loading && recipes.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-slate-100 rounded-2xl h-80 w-full" />
                    ))}
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center py-24 bg-orange-50/50 rounded-2xl border border-orange-100">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">No recipes found</h3>
                    <p className="text-slate-600">Try adjusting your filters or search query.</p>
                    <button 
                        onClick={() => {
                            setSearchQuery('');
                            setFilters({ difficulty: '', category: '', prepTime: '' });
                        }}
                        className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map(recipe => (
                        <RecipeCard key={recipe.recipe_id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
}
