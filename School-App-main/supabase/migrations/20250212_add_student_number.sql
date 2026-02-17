-- Add student_number column to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS student_number TEXT UNIQUE;

-- Function to generate student number
CREATE OR REPLACE FUNCTION generate_student_number()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix TEXT;
    sequence_val INTEGER;
    new_number TEXT;
BEGIN
    -- Get current year
    year_prefix := TO_CHAR(NOW(), 'YYYY');
    
    -- Get next sequence value (using a simple count for now or a sequence)
    -- Better practice: Use a dedicated sequence per year, but for simplicity:
    -- Format: YYYY-XXXX (e.g., 2025-0001)
    
    -- Create sequence if not exists for the year (dynamic SQL might be needed or just one big sequence)
    -- Let's use a global sequence for simplicity or select count
    
    -- Lock table to prevent race conditions roughly (or rely on unique constraint retries)
    -- Simple approach: Count existing students in current year + 1
    
    SELECT count(*) + 1 INTO sequence_val 
    FROM public.students 
    WHERE created_at >= date_trunc('year', now());
    
    new_number := year_prefix || '-' || LPAD(sequence_val::TEXT, 4, '0');
    
    -- Update the record
    NEW.student_number := new_number;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to assign student number before insert
DROP TRIGGER IF EXISTS tr_generate_student_number ON public.students;
CREATE TRIGGER tr_generate_student_number
    BEFORE INSERT ON public.students
    FOR EACH ROW
    WHEN (NEW.student_number IS NULL)
    EXECUTE FUNCTION generate_student_number();
