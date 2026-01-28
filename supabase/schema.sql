-- Supabase SQL Editor에서 이 파일 내용을 실행해 주세요.
-- (Table Editor에서 테이블 생성 후, RLS 정책 추가)

-- 가족 (6자리 코드)
CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 가족 설정 (앱 제목, 목표 스티커 수)
CREATE TABLE IF NOT EXISTS family_settings (
  family_id UUID PRIMARY KEY REFERENCES families(id) ON DELETE CASCADE,
  app_title TEXT NOT NULL DEFAULT '우리집 칭찬스티커',
  target_count INT NOT NULL DEFAULT 10 CHECK (target_count >= 10 AND target_count <= 50),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 자녀 (최대 5명)
CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INT NOT NULL CHECK (age >= 1 AND age <= 20),
  gender TEXT NOT NULL CHECK (gender IN ('male','female','other')),
  icon TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 자녀별 미션 (slot 0,1,2: 추천, 3: 수기)
CREATE TABLE IF NOT EXISTS child_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  mission_text TEXT NOT NULL,
  slot_index INT NOT NULL CHECK (slot_index >= 0 AND slot_index <= 3),
  is_custom BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(child_id, slot_index)
);

-- 스티커 붙인 기록 (히스토리)
CREATE TABLE IF NOT EXISTS sticker_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  mission_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 초기화 시점 (이 시점 이후 이벤트만 현재 보드에 반영)
CREATE TABLE IF NOT EXISTS child_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  reset_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: anon 읽기/쓰기 허용 (6자리 코드가 보안 역할)
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sticker_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_resets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon all families" ON families;
CREATE POLICY "anon all families" ON families FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon all family_settings" ON family_settings;
CREATE POLICY "anon all family_settings" ON family_settings FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon all children" ON children;
CREATE POLICY "anon all children" ON children FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon all child_missions" ON child_missions;
CREATE POLICY "anon all child_missions" ON child_missions FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon all sticker_events" ON sticker_events;
CREATE POLICY "anon all sticker_events" ON sticker_events FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon all child_resets" ON child_resets;
CREATE POLICY "anon all child_resets" ON child_resets FOR ALL TO anon USING (true) WITH CHECK (true);

-- 실시간: Supabase 대시보드 > Database > Replication 에서
-- families, family_settings, children, child_missions, sticker_events, child_resets 테이블 추가
