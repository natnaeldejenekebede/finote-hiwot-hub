
-- Gallery photos table
CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_am TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery" ON public.gallery FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete gallery" ON public.gallery FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Hymns table
CREATE TABLE public.hymns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL DEFAULT 'Sunday School Choir',
  audio_url TEXT,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.hymns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view hymns" ON public.hymns FOR SELECT USING (true);
CREATE POLICY "Admins can insert hymns" ON public.hymns FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete hymns" ON public.hymns FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_am TEXT,
  description TEXT,
  description_am TEXT,
  event_date DATE,
  event_time TEXT,
  location TEXT,
  location_am TEXT,
  event_type TEXT NOT NULL DEFAULT 'feast',
  recurring BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can insert events" ON public.events FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Projects (donations) table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_am TEXT,
  goal_amount INTEGER NOT NULL DEFAULT 0,
  raised_amount INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_am TEXT,
  category TEXT NOT NULL DEFAULT 'lesson',
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Admins can insert documents" ON public.documents FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete documents" ON public.documents FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Daily wisdom table (single row, updated by admin)
CREATE TABLE public.daily_wisdom (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  verse_en TEXT NOT NULL DEFAULT '',
  reference_en TEXT NOT NULL DEFAULT '',
  verse_am TEXT NOT NULL DEFAULT '',
  reference_am TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.daily_wisdom ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view daily wisdom" ON public.daily_wisdom FOR SELECT USING (true);
CREATE POLICY "Admins can insert daily wisdom" ON public.daily_wisdom FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update daily wisdom" ON public.daily_wisdom FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default daily wisdom row
INSERT INTO public.daily_wisdom (verse_en, reference_en, verse_am, reference_am)
VALUES ('The Lord is my shepherd, I lack nothing.', 'Psalm 23:1', 'እግዚአብሔር እረኛዬ ነው፤ የሚያሳጣኝ የለም።', 'መዝ 23:1');

-- Live stream settings table
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert settings" ON public.site_settings FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.site_settings (key, value) VALUES ('live_stream_url', '');
INSERT INTO public.site_settings (key, value) VALUES ('live_stream_active', 'false');
