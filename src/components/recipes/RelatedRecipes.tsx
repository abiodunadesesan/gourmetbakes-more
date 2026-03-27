'use client';

import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';

export default function RelatedRecipes({ recipeId }: { recipeId: string }) {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
             try {
                const res = await fetch(`/api/recipes/${recipeId}/related`);
                if (res.ok) {
                    const data = await res.json();
                    setRecipes(data);
                }
             } catch (e) {
                console.error("Failed to load related recipes", e);
             } finally {
                setLoading(false);
             }
        };

        fetchRelated();
    }, [recipeId]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="animate-pulse h-64 bg-slate-100 rounded-2xl w-full"></div>
                <div className="animate-pulse h-64 bg-slate-100 rounded-2xl w-full hidden md:block"></div>
                <div className="animate-pulse h-64 bg-slate-100 rounded-2xl w-full hidden md:block"></div>
            </div>
        );
    }

    if (recipes.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(recipe => (
                <RecipeCard key={recipe.recipe_id} recipe={recipe} />
            ))}
        </div>
    );
}
