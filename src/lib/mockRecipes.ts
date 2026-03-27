export const fallbackRecipes = [
    {
        recipe_id: '1',
        title: 'Homemade Meat Pie',
        description: 'Savory meat filling in golden pastry crust, perfect for lunch or snacks',
        cultural_context: 'Nigerian meat pies are a staple at parties...',
        difficulty: 'Easy',
        prep_time_minutes: 30,
        cook_time_minutes: 25,
        servings: 4,
        yield: '12 meat pies',
        featured_image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800',
        category: 'Pies',
        is_published: true
    },
    {
        recipe_id: '2',
        title: 'Vanilla Sponge Cake',
        description: 'Light, fluffy cake with vanilla flavor, great for celebrations',
        cultural_context: 'Often used as the base for Nigerian birthday and wedding cakes.',
        difficulty: 'Medium',
        prep_time_minutes: 20,
        cook_time_minutes: 45,
        servings: 8,
        yield: '1 large cake',
        featured_image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
        category: 'Cakes',
        is_published: true
    },
    {
        recipe_id: '3',
        title: 'Puff Puff (Fried Dough)',
        description: 'Soft, fluffy fried dough balls, perfect with spicy sauce',
        cultural_context: 'A beloved Nigerian street food and "small chop" at events.',
        difficulty: 'Easy',
        prep_time_minutes: 15,
        cook_time_minutes: 40,
        servings: 6,
        yield: '24 dough balls',
        featured_image_url: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=800',
        category: 'Snacks',
        is_published: true
    },
    {
        recipe_id: '4',
        title: 'Agege Bread',
        description: 'Traditional soft bread, perfect for breakfast with butter and jam',
        cultural_context: 'Named after a neighborhood in Lagos...',
        difficulty: 'Easy',
        prep_time_minutes: 30,
        cook_time_minutes: 60,
        servings: 10,
        yield: '2 loaves',
        featured_image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
        category: 'Bread',
        is_published: true
    },
    {
        recipe_id: '5',
        title: 'Chin Chin (Fried Snack)',
        description: 'Crispy, crunchy fried snack with perfect seasoning and texture',
        cultural_context: 'A crunchy fried dough snack that is popular throughout West Africa.',
        difficulty: 'Hard',
        prep_time_minutes: 30,
        cook_time_minutes: 90,
        servings: 12,
        yield: '1 large bowl',
        featured_image_url: 'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?auto=format&fit=crop&q=80&w=800',
        category: 'Snacks',
        is_published: true
    },
    {
        recipe_id: '6',
        title: 'Classic Party Jollof Rice',
        description: 'The iconic West African rice dish with smoky flavor and perfect spice',
        cultural_context: 'No Nigerian party is complete without Jollof Rice.',
        difficulty: 'Medium',
        prep_time_minutes: 20,
        cook_time_minutes: 60,
        servings: 6,
        yield: '6 servings',
        featured_image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800',
        category: 'Sauces',
        is_published: true
    },
    {
        recipe_id: '7',
        title: 'Fish Pie with Flaky Crust',
        description: 'Delicate fish filling wrapped in buttery pastry, a coastal favorite',
        cultural_context: 'A fast food favorite commonly found in Nigerian eateries.',
        difficulty: 'Medium',
        prep_time_minutes: 30,
        cook_time_minutes: 50,
        servings: 4,
        yield: '8 pies',
        featured_image_url: 'https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=800',
        category: 'Pies',
        is_published: true
    },
    {
        recipe_id: '8',
        title: 'Assorted Meat Pepper Soup',
        description: 'Spicy, aromatic broth with tender mixed meats',
        cultural_context: 'Often served at bars or as an appetizer at parties.',
        difficulty: 'Medium',
        prep_time_minutes: 15,
        cook_time_minutes: 120,
        servings: 6,
        yield: '6 bowls',
        featured_image_url: 'https://images.unsplash.com/photo-1548943487-a2e4f43fb1b5?auto=format&fit=crop&q=80&w=800',
        category: 'Sauces',
        is_published: true
    }
];

export const fallbackRecipeDetails: Record<string, any> = {
    '1': {
        ...fallbackRecipes[0],
        recipe_ingredients: [
            { id: '1', section: 'For the Pastry', ingredient_name: 'All-purpose flour', quantity: 2, unit: 'cups' },
            { id: '2', section: 'For the Pastry', ingredient_name: 'Butter', quantity: 1, unit: 'cup' },
            { id: '3', section: 'For the Filling', ingredient_name: 'Ground beef', quantity: 500, unit: 'g' }
        ],
        recipe_instructions: [
            { id: '1', step_number: 1, description: 'Mix flour and salt.', tip: 'Keep everything cold' },
            { id: '2', step_number: 2, description: 'Bake for 20-25 mins.' }
        ],
        recipe_tips: [
            { id: '1', tip_text: 'Make dough a day ahead' }
        ]
    }
};
