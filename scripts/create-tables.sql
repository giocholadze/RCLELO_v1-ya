-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
INSERT INTO users (email, password, name, role) 
VALUES ('officelelo1@gmail.com', 'Saracens.lelo1', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  number INTEGER NOT NULL,
  league TEXT NOT NULL CHECK (league IN ('mens', 'youth', 'womens')),
  stats JSONB DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author TEXT DEFAULT 'LELO Admin',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  league TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for matches
INSERT INTO matches (home_team, away_team, match_date, location, league, status)
VALUES 
  ('LELO', 'City Rivals', NOW() + INTERVAL '7 days', 'LELO Arena', 'უმაღლესი ლიგა', 'scheduled'),
  ('Regional Champions', 'LELO', NOW() + INTERVAL '14 days', 'Away Ground', 'ქალთა ლიგა', 'scheduled')
ON CONFLICT DO NOTHING;

-- Insert sample data for news
INSERT INTO news (title, content, excerpt, image_url)
VALUES 
  ('გუნდმა მოიგო ბოლო მატჩი', 'ლელომ დიდი გამარჯვება აღნიშნა ბოლო მატჩში...', 'ლელომ მოიგო 45-20 ანგარიშით', '/placeholder.svg?height=400&width=600'),
  ('ახალი მოთამაშეების ჩართვა', 'გუნდს ახალი ნიჭიერი მოთამაშეები შეუერთდნენ...', '5 ახალი მოთამაშე შემოვიდა', '/placeholder.svg?height=400&width=600')
ON CONFLICT DO NOTHING;

-- Insert sample data for players  
INSERT INTO players (name, position, number, league, image_url)
VALUES 
  ('გიორგი კვარაცხელია', 'Fly-half', 10, 'mens', '/placeholder.svg?height=400&width=300'),
  ('დავით ნინიძე', 'Hooker', 2, 'mens', '/placeholder.svg?height=400&width=300'),
  ('ნიკა მაჭავარიანი', 'Wing', 11, 'youth', '/placeholder.svg?height=400&width=300'),
  ('ლუკა ბერიძე', 'Center', 12, 'youth', '/placeholder.svg?height=400&width=300')
ON CONFLICT DO NOTHING;
