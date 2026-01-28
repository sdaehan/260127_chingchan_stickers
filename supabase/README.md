# Supabase 설정

1. [Supabase](https://supabase.com) 프로젝트에서 **SQL Editor**를 연다.
2. `schema.sql` 파일 전체 내용을 복사해 붙여 넣고 **Run**으로 실행한다.
3. **(선택) 실시간 동기화**: **Database** → **Replication**에서  
   `families`, `family_settings`, `children`, `child_missions`, `sticker_events`, `child_resets` 테이블을 추가한다.
4. `.env.local`에 아래 변수가 있는지 확인한다:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
