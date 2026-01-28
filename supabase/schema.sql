-- ============================================================
-- Supabase SQL Editor에서 이 스크립트를 실행하세요.
-- 자녀 관리, 미션 관리, 가족 동기화, 스티커 히스토리용 스키마
-- ============================================================

-- 1. families: 가족 그룹 (6자리 Family ID로 참여/공유)
CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. family_settings: 앱 제목, 목표 스티커 수 (10~50)
--    가족별 1:1. families만으로도 되지만 설정 전용으로 분리.
CREATE TABLE IF NOT EXISTS family_settings (
  family_id UUID PRIMARY KEY REFERENCES families(id) ON DELETE CASCADE,
  app_title TEXT NOT NULL DEFAULT '우리집 칭찬스티커',
  target_count INT NOT NULL DEFAULT 10 CHECK (target_count >= 10 AND target_count <= 50),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. children: 자녀 (가족당 최대 5명, 앱에서 제한)
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

-- 4. missions: 자녀별 미션 (slot 0,1,2=추천, 3=직접입력)
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  mission_text TEXT NOT NULL,
  slot_index INT NOT NULL CHECK (slot_index >= 0 AND slot_index <= 3),
  is_custom BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(child_id, slot_index)
);

-- 5. sticker_history: 스티커 붙일 때마다 {일시(분 단위), 미션 내용} 기록
CREATE TABLE IF NOT EXISTS sticker_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  mission_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. child_resets: 초기화 시점 (이 시점 이후 sticker_history만 현재 보드에 반영)
CREATE TABLE IF NOT EXISTS child_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  reset_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- RLS: anon 읽기/쓰기 허용 (6자리 Family 코드가 보안 역할)
-- ------------------------------------------------------------
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sticker_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_resets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon all families" ON families;
CREATE POLICY "anon all families" ON families FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon all family_settings" ON family_settings;
CREATE POLICY "anon all family_settings" ON family_settings FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon all children" ON children;
CREATE POLICY "anon all children" ON children FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon all missions" ON missions;
CREATE POLICY "anon all missions" ON missions FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon all sticker_history" ON sticker_history;
CREATE POLICY "anon all sticker_history" ON sticker_history FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon all child_resets" ON child_resets;
CREATE POLICY "anon all child_resets" ON child_resets FOR ALL TO anon USING (true) WITH CHECK (true);

-- ------------------------------------------------------------
-- (선택) 실시간 동기화: Database > Replication 에서
-- families, family_settings, children, missions, sticker_history, child_resets 추가
-- ------------------------------------------------------------
