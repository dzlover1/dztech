-- =============================================
-- PROMPT GALLERY - SAMPLE DATA SEED
-- Insert sample prompts for a registered user
-- Replace YOUR_USER_ID with an actual user id
-- =============================================

insert into public.prompts (
  user_id, title, description, prompt, category, ai_model, language, tags, image_url, usage_count, created_at
) values
(
  'YOUR_USER_ID',
  'Physics Lesson Infographic',
  'Create a beautiful, educational infographic explaining Newton''s laws of motion with clear diagrams and Arabic labels.',
  'Create a professional educational infographic about Newton''s Laws of Motion. Include: 1) Three law definitions in simple language, 2) Colorful diagrams for each law, 3) Real-world examples, 4) A summary formula box. Use an Arabic-first layout with clear visual hierarchy. Style: modern flat design, vibrant colors on white background, clean typography.',
  'education',
  'Gemini Image',
  'ar',
  array['Education','Infographic','Arabic','Physics'],
  null,
  42,
  now() - interval '5 days'
),
(
  'YOUR_USER_ID',
  'Luxury Product Advertisement',
  'Generate a premium product advertising poster for a luxury watch brand with elegant lighting and gold accents.',
  'Generate a luxury product advertisement poster. Subject: a premium wristwatch. Scene: dramatic studio lighting, dark background with golden light rays, water droplets, and reflective surfaces. Composition: product in center-left, negative space on the right for text. Color palette: black, gold, deep amber. Ultra realistic, 8K, commercial photography style, suitable for print advertising.',
  'marketing',
  'Midjourney',
  'en',
  array['Marketing','Advertising','Luxury','Product'],
  null,
  78,
  now() - interval '4 days'
),
(
  'YOUR_USER_ID',
  'Cinematic Desert Battle',
  'Epic cinematic video prompt for a desert battle scene with dramatic lighting, sand particles, and intense action.',
  'Cinematic video sequence: An epic desert battle at golden hour. A lone warrior stands against an advancing army. Slow-motion sand particles swirl as the camera orbits dramatically. Dust, embers, and dramatic contrast lighting. Lens flares, shallow depth of field, epic orchestral feel. Shot on 35mm anamorphic, 2.39:1 aspect ratio, color graded in teal and orange. High production value, blockbuster quality.',
  'video-generation',
  'Veo',
  'en',
  array['Video','Cinematic','Action','Epic'],
  null,
  120,
  now() - interval '3 days'
),
(
  'YOUR_USER_ID',
  'Arabic Editorial Magazine',
  'Design a sophisticated Arabic editorial magazine layout with elegant Arabic typography and magazine-style grid.',
  'Design an elegant Arabic editorial magazine layout. Two-page spread featuring: 1) Large elegant Arabic headline using a modern Kufi typeface, 2) Beautiful pull quote, 3) Multi-column article grid, 4) High-end fashion photography, 5) Clean whitespace and refined color scheme of cream, charcoal and gold. Typographic hierarchy emphasizing Arabic script beauty. Professional publication quality.',
  'posters',
  'Canva',
  'ar',
  array['Design','Arabic','Editorial','Typography'],
  null,
  35,
  now() - interval '2 days'
),
(
  'YOUR_USER_ID',
  'AI Exercise Solver',
  'Educational assistant prompt that solves math exercises step-by-step with clear Arabic explanations.',
  'You are a patient math tutor. Given an exercise, solve it step by step: 1) Restate the problem clearly, 2) List the given information, 3) Solve with each step explained, 4) Show the final answer boxed, 5) Provide a similar practice problem with the answer. Respond in clear, encouraging Arabic. Use appropriate mathematical notation. Verify your solution before presenting it.',
  'education',
  'ChatGPT',
  'ar',
  array['Education','Math','Tutor','Arabic'],
  null,
  95,
  now() - interval '1 day'
),
(
  'YOUR_USER_ID',
  'Sora Text-to-Video Cinematic',
  'Advanced Sora prompt for generating a cinematic, emotionally resonant character scene.',
  'Sora prompt: A close-up cinematic shot of an elderly fisherman on a wooden boat at sunrise. The camera slowly pushes in as gentle ocean waves rock the boat. Soft golden light, light sea mist, weathered lines on his face, a faint smile. Emotional, contemplative mood. Natural sound of water suggested. Photorealistic, film grain, high dynamic range, 24fps.',
  'video-generation',
  'Sora',
  'en',
  array['Video','Sora','Cinematic','Emotional'],
  null,
  61,
  now() - interval '12 hours'
);

-- =============================================
-- SAMPLE COLLECTIONS
-- =============================================
insert into public.collections (user_id, name, description, icon) values
('YOUR_USER_ID', 'My Best Gemini Prompts', 'Curated prompts optimized for Gemini models', '🧠'),
('YOUR_USER_ID', 'VEO3 Prompts', 'Video generation prompts for Veo', '🎬'),
('YOUR_USER_ID', 'Educational Prompts', 'Teaching and learning focused prompts', '📚'),
('YOUR_USER_ID', 'Amway Marketing Prompts', 'Business and marketing prompts', '📢'),
('YOUR_USER_ID', 'AI Image Prompts', 'Image generation master prompts', '🎨'),
('YOUR_USER_ID', 'AI Video Prompts', 'Video generation master prompts', '🎞️');
