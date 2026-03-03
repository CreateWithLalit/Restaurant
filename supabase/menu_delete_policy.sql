-- Allow authenticated users to delete from menu_items
CREATE POLICY "Allow authenticated delete access" ON public.menu_items
    FOR DELETE USING (auth.role() = 'authenticated');
