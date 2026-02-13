
-- Create community_questions table
CREATE TABLE public.community_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT DEFAULT 'Anonymous',
  question TEXT NOT NULL,
  answer TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.community_questions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a question
CREATE POLICY "Anyone can submit question"
  ON public.community_questions FOR INSERT
  WITH CHECK (true);

-- Anyone can view published (answered) questions
CREATE POLICY "Anyone can view answered questions"
  ON public.community_questions FOR SELECT
  USING (status = 'answered' OR has_role(auth.uid(), 'admin'::app_role));

-- Admins can update questions (write answers)
CREATE POLICY "Admins can update questions"
  ON public.community_questions FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete questions
CREATE POLICY "Admins can delete questions"
  ON public.community_questions FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_community_questions_updated_at
  BEFORE UPDATE ON public.community_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
