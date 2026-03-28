-- Fixes PGRST204 schema cache errors when columns are missing on `bulk_order_requests`.
-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Then: Settings → API → Restart PostgREST or wait for schema cache refresh.

ALTER TABLE public.bulk_order_requests
ADD COLUMN IF NOT EXISTS additional_notes text;

ALTER TABLE public.bulk_order_requests
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

COMMENT ON COLUMN public.bulk_order_requests.additional_notes IS 'Optional notes from the bulk order inquiry form';
COMMENT ON COLUMN public.bulk_order_requests.status IS 'Workflow status (e.g. pending); set by API on insert';
