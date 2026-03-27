-- Supabase Schema for Recipe & Cooking Guide Section

-- 1. Create Recipes Table
CREATE TABLE IF NOT EXISTS public.recipes (
    recipe_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    cultural_context TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    prep_time_minutes INTEGER NOT NULL,
    cook_time_minutes INTEGER NOT NULL,
    servings INTEGER NOT NULL DEFAULT 4,
    yield TEXT NOT NULL,
    featured_image_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Cakes', 'Pies', 'Bread', 'Snacks', 'Sauces')),
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Recipe Ingredients Table
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
    ingredient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(recipe_id) ON DELETE CASCADE,
    section TEXT,
    ingredient_name TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    product_id UUID, -- Optional link to products table
    order_idx INTEGER NOT NULL
);

-- 3. Create Recipe Instructions Table
CREATE TABLE IF NOT EXISTS public.recipe_instructions (
    instruction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(recipe_id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    video_url TEXT,
    tip TEXT,
    UNIQUE(recipe_id, step_number)
);

-- 4. Create Recipe Tips Table
CREATE TABLE IF NOT EXISTS public.recipe_tips (
    tip_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(recipe_id) ON DELETE CASCADE,
    tip_text TEXT NOT NULL,
    order_idx INTEGER NOT NULL
);

-- 5. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_recipes_updated_at ON public.recipes;
CREATE TRIGGER trigger_recipes_updated_at
BEFORE UPDATE ON public.recipes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 6. Row Level Security Policies
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_tips ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published recipes
CREATE POLICY "Enable read access for all users on published recipes" ON public.recipes FOR SELECT USING (is_published = true);
CREATE POLICY "Enable read access for all users on ingredients" ON public.recipe_ingredients FOR SELECT USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.recipe_id = recipe_ingredients.recipe_id AND r.is_published = true));
CREATE POLICY "Enable read access for all users on instructions" ON public.recipe_instructions FOR SELECT USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.recipe_id = recipe_instructions.recipe_id AND r.is_published = true));
CREATE POLICY "Enable read access for all users on tips" ON public.recipe_tips FOR SELECT USING (EXISTS (SELECT 1 FROM public.recipes r WHERE r.recipe_id = recipe_tips.recipe_id AND r.is_published = true));

-- Admins full access (Requires an 'admin' role or suitable RLS logic, here allowing all authenticated users for ease if admin control is implemented in app level)
-- For a basic setup, you might adjust this logic depending on your auth pattern.
-- CREATE POLICY "Enable all access for authenticated admins" ON public.recipes FOR ALL USING (auth.role() = 'authenticated');
-- (Leaving it simple for now; public read is most important.)

-- 7. Insert Initial Seed Data
DO $$ 
DECLARE
    pie_id UUID := gen_random_uuid();
    cake_id UUID := gen_random_uuid();
    puff_id UUID := gen_random_uuid();
    bread_id UUID := gen_random_uuid();
    chin_id UUID := gen_random_uuid();
    jollof_id UUID := gen_random_uuid();
    fish_id UUID := gen_random_uuid();
    pepper_id UUID := gen_random_uuid();
BEGIN
    -- 1. Homemade Meat Pie
    INSERT INTO public.recipes (recipe_id, title, description, cultural_context, difficulty, prep_time_minutes, cook_time_minutes, servings, yield, featured_image_url, category)
    VALUES (pie_id, 'Homemade Meat Pie', 'Savory meat filling in golden pastry crust, perfect for lunch or snacks', 'Nigerian meat pies are a staple at parties, celebrations, and as a quick street food. Characterized by their rich, flaky crust and heavily spiced minced meat filling, they represent the comfort of Nigerian baking.', 'Easy', 30, 25, 4, '12 meat pies', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800', 'Pies');
    
    INSERT INTO public.recipe_ingredients (recipe_id, section, ingredient_name, quantity, unit, order_idx) VALUES
    (pie_id, 'For the Pastry', 'All-purpose flour', 2, 'cups', 1),
    (pie_id, 'For the Pastry', 'Butter, cold and cubed', 1, 'cup', 2),
    (pie_id, 'For the Pastry', 'Salt', 1, 'tsp', 3),
    (pie_id, 'For the Pastry', 'Ice water', 5, 'tbsp', 4),
    (pie_id, 'For the Filling', 'Ground beef', 500, 'g', 5),
    (pie_id, 'For the Filling', 'Medium onion, finely chopped', 1, 'whole', 6),
    (pie_id, 'For the Filling', 'Tomato paste', 2, 'tbsp', 7),
    (pie_id, 'For the Filling', 'Curry powder', 1, 'tsp', 8),
    (pie_id, 'For the Filling', 'Egg (for egg wash)', 1, 'whole', 9);

    INSERT INTO public.recipe_instructions (recipe_id, step_number, description, tip) VALUES
    (pie_id, 1, 'Make the pastry: Mix flour and salt. Cut in cold butter until mixture resembles breadcrumbs. Add ice water gradually until dough forms.', 'Keep everything cold for flaky pastry. Do not overwork the dough!'),
    (pie_id, 2, 'Wrap dough in plastic and refrigerate for 30 minutes while you prepare the filling.', NULL),
    (pie_id, 3, 'Brown the ground beef in a pan over medium heat. Add chopped onions and cook until softened (about 5 minutes).', NULL),
    (pie_id, 4, 'Stir in tomato paste and curry powder. Simmer for 5 minutes until flavors combine. Season with salt and pepper to taste. Let cool.', NULL),
    (pie_id, 5, 'Preheat oven to 375°F (190°C). Roll out dough and cut into circles. Fill each with 2 tbsp of meat mixture.', NULL),
    (pie_id, 6, 'Fold pastry over filling and seal edges with a fork. Brush with beaten egg for golden finish.', NULL),
    (pie_id, 7, 'Bake for 20-25 minutes until golden brown. Cool for 5 minutes before serving.', NULL);

    INSERT INTO public.recipe_tips (recipe_id, tip_text, order_idx) VALUES
    (pie_id, 'Make the pastry dough a day ahead and refrigerate overnight for best results', 1),
    (pie_id, 'Don''t skip the egg wash—it gives the pies that beautiful golden color', 2),
    (pie_id, 'You can freeze unbaked pies for up to 3 months. Bake directly from frozen, adding 5-10 minutes to baking time', 3),
    (pie_id, 'For extra flavor, add 1 tbsp of Maggi or seasoning cube to the filling', 4),
    (pie_id, 'Serve warm with spicy sauce or ketchup for authentic Nigerian style', 5);

    -- 2. Vanilla Sponge Cake
    INSERT INTO public.recipes (recipe_id, title, description, cultural_context, difficulty, prep_time_minutes, cook_time_minutes, servings, yield, featured_image_url, category)
    VALUES (cake_id, 'Vanilla Sponge Cake', 'Light, fluffy cake with vanilla flavor, great for celebrations', 'Often used as the base for Nigerian birthday and wedding cakes. Known for being sturdy yet moist.', 'Medium', 20, 45, 8, '1 large cake', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800', 'Cakes');

    -- 3. Puff Puff
    INSERT INTO public.recipes (recipe_id, title, description, cultural_context, difficulty, prep_time_minutes, cook_time_minutes, servings, yield, featured_image_url, category)
    VALUES (puff_id, 'Puff Puff (Fried Dough)', 'Soft, fluffy fried dough balls, perfect with spicy sauce', 'A beloved Nigerian street food and "small chop" at events.', 'Easy', 15, 40, 6, '24 dough balls', 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=800', 'Snacks');

    -- 4. Agege Bread
    INSERT INTO public.recipes (recipe_id, title, description, cultural_context, difficulty, prep_time_minutes, cook_time_minutes, servings, yield, featured_image_url, category)
    VALUES (bread_id, 'Agege Bread', 'Traditional soft bread, perfect for breakfast with butter and jam', 'Named after a neighborhood in Lagos, Agege bread is famously dense, slightly sweet, and very satisfying.', 'Easy', 30, 60, 10, '2 loaves', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800', 'Bread');

    -- 5. Chin Chin
    INSERT INTO public.recipes (recipe_id, title, description, cultural_context, difficulty, prep_time_minutes, cook_time_minutes, servings, yield, featured_image_url, category)
    VALUES (chin_id, 'Chin Chin (Fried Snack)', 'Crispy, crunchy fried snack with perfect seasoning and texture', 'A crunchy fried dough snack that is popular throughout West Africa.', 'Hard', 30, 90, 12, '1 large bowl', 'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?auto=format&fit=crop&q=80&w=800', 'Snacks');

    -- 6. Jollof Rice (Bonus!)
    INSERT INTO public.recipes (recipe_id, title, description, cultural_context, difficulty, prep_time_minutes, cook_time_minutes, servings, yield, featured_image_url, category)
    VALUES (jollof_id, 'Classic Party Jollof Rice', 'The iconic West African rice dish with smoky flavor and perfect spice', 'No Nigerian party is complete without Jollof Rice. The smoky "party" flavor is what makes it truly authentic.', 'Medium', 20, 60, 6, '6 servings', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800', 'Sauces');

    -- 7. Fish Pie
    INSERT INTO public.recipes (recipe_id, title, description, cultural_context, difficulty, prep_time_minutes, cook_time_minutes, servings, yield, featured_image_url, category)
    VALUES (fish_id, 'Fish Pie with Flaky Crust', 'Delicate fish filling wrapped in buttery pastry, a coastal favorite', 'A fast food favorite commonly found in Nigerian eateries, using spiced mackerel or sardine filling.', 'Medium', 30, 50, 4, '8 pies', 'https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=800', 'Pies');

    -- 8. Pepper Soup
    INSERT INTO public.recipes (recipe_id, title, description, cultural_context, difficulty, prep_time_minutes, cook_time_minutes, servings, yield, featured_image_url, category)
    VALUES (pepper_id, 'Assorted Meat Pepper Soup', 'Spicy, aromatic broth with tender mixed meats', 'Often served at bars or as an appetizer at parties. It is known to cure a cold (and a hangover!).', 'Medium', 15, 120, 6, '6 bowls', 'https://images.unsplash.com/photo-1548943487-a2e4f43fb1b5?auto=format&fit=crop&q=80&w=800', 'Sauces');
END $$;
