
-- Kids Corner dynamic content table
CREATE TABLE public.kids_corner (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_am TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  story_text_am TEXT NOT NULL DEFAULT '',
  story_text_en TEXT NOT NULL DEFAULT '',
  bible_reference TEXT,
  image_url TEXT,
  audio_url TEXT,
  emoji TEXT DEFAULT '📖',
  color_class TEXT DEFAULT 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.kids_corner ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view kids corner" ON public.kids_corner FOR SELECT USING (true);
CREATE POLICY "Admins can insert kids corner" ON public.kids_corner FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update kids corner" ON public.kids_corner FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete kids corner" ON public.kids_corner FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed with existing static data
INSERT INTO public.kids_corner (title_en, title_am, story_text_en, story_text_am, bible_reference, emoji, color_class, order_index) VALUES
('Noah''s Ark', 'የኖኅ መርከብ', 'God told Noah to build a big boat. He gathered two of every animal. When the flood came, everyone on the ark was safe!', 'እግዚአብሔር ኖኅን ትልቅ መርከብ እንዲሠራ ነገረው። ከእያንዳንዱ እንስሳ ሁለት ሁለት ሰበሰበ። ጎርፍ ሲመጣ በመርከቡ ላይ ያሉ ሁሉ ደህና ነበሩ!', '"By faith Noah built an ark to save his family." — Hebrews 11:7', '🚢', 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700', 1),
('David & Goliath', 'ዳዊትና ጎልያድ', 'Young David wasn''t afraid of the giant Goliath. With just a sling and a stone — and God''s help — he won!', 'ወጣቱ ዳዊት ግዙፉን ጎልያድ አልፈራም። በወንጭፍና በድንጋይ — በእግዚአብሔር እርዳታ — ድል አደረገ!', '"The Lord is my strength and my shield." — Psalm 28:7', '⚔️', 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700', 2),
('Daniel in the Lion''s Den', 'ዳንኤል በአንበሶች ጉድጓድ', 'Daniel kept praying to God even when it was against the king''s rules. God closed the lions'' mouths and kept Daniel safe!', 'ዳንኤል የንጉሡን ሕግ ቢጥስም ለእግዚአብሔር መጸለይ አላቆመም። እግዚአብሔር የአንበሶቹን አፍ ዘጋ!', '"My God sent his angel and shut the lions'' mouths." — Daniel 6:22', '🦁', 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700', 3),
('Jonah and the Whale', 'ዮናስና ዓሣ ነባሪ', 'God told Jonah to go to Nineveh, but Jonah ran away! A big fish swallowed him for 3 days. Jonah learned to obey God.', 'እግዚአብሔር ዮናስን ወደ ነነዌ እንዲሄድ ነገረው፣ ነገር ግን ዮናስ ሸሸ! ትልቅ ዓሣ ለ3 ቀናት ዋጠው። ዮናስ እግዚአብሔርን መታዘዝ ተማረ።', '"From inside the fish Jonah prayed to the Lord." — Jonah 2:1', '🐋', 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700', 4),
('Baby Moses', 'ሕፃን ሙሴ', 'Baby Moses was placed in a basket on the river to keep him safe. The princess found him and raised him as her own son!', 'ሕፃን ሙሴ ለደህንነቱ በወንዝ ላይ በቅርጫት ተቀመጠ። ልዕልቲቱ አገኘችው እና እንደ ራሷ ልጅ አሳደገችው!', '"She named him Moses saying, ''I drew him out of the water.''" — Exodus 2:10', '👶', 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700', 5),
('The Good Samaritan', 'ደግ ሳምራዊ', 'A kind man stopped to help a stranger who was hurt, even when others passed by. Jesus taught us to be kind to everyone!', 'ሌሎች ሲያልፉ ደግ ሰው ቆሞ የቆሰለን ሰው ረዳ። ኢየሱስ ለሁሉም ደግ እንድንሆን አስተማረን!', '"Love your neighbor as yourself." — Luke 10:27', '💝', 'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700', 6);

-- Storage buckets for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media-gallery', 'media-gallery', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('media-hymns', 'media-hymns', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('media-documents', 'media-documents', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('media-kids', 'media-kids', true);

-- Storage RLS: public read
CREATE POLICY "Public read media-gallery" ON storage.objects FOR SELECT USING (bucket_id = 'media-gallery');
CREATE POLICY "Public read media-hymns" ON storage.objects FOR SELECT USING (bucket_id = 'media-hymns');
CREATE POLICY "Public read media-documents" ON storage.objects FOR SELECT USING (bucket_id = 'media-documents');
CREATE POLICY "Public read media-kids" ON storage.objects FOR SELECT USING (bucket_id = 'media-kids');

-- Storage RLS: admin upload
CREATE POLICY "Admin upload media-gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media-gallery' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin upload media-hymns" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media-hymns' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin upload media-documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media-documents' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin upload media-kids" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media-kids' AND has_role(auth.uid(), 'admin'::app_role));

-- Storage RLS: admin delete
CREATE POLICY "Admin delete media-gallery" ON storage.objects FOR DELETE USING (bucket_id = 'media-gallery' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete media-hymns" ON storage.objects FOR DELETE USING (bucket_id = 'media-hymns' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete media-documents" ON storage.objects FOR DELETE USING (bucket_id = 'media-documents' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete media-kids" ON storage.objects FOR DELETE USING (bucket_id = 'media-kids' AND has_role(auth.uid(), 'admin'::app_role));
