-- Fix the remaining function search path security issue
CREATE OR REPLACE FUNCTION public.create_user_profile_and_score(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Check if profile exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = user_uuid) THEN
        INSERT INTO public.profiles (id, name, email)
        SELECT 
            id,
            COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
            email
        FROM auth.users WHERE id = user_uuid;
    END IF;
    
    -- Check if score exists
    IF NOT EXISTS (SELECT 1 FROM public.scores WHERE user_id = user_uuid) THEN
        INSERT INTO public.scores (user_id, score, level, master_key, order_history, platforms)
        VALUES (
            user_uuid,
            0,
            'Beginner',
            encode(gen_random_bytes(32), 'hex'),
            '[]'::jsonb,
            '{}'::jsonb
        );
    END IF;
END;
$function$;