import { createClient } from '@supabase/supabase-js';

// 빌드 시점에 환경변수가 없어도 멈추지 않도록 '가짜 주소'라는 간식을 던져줍니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// 이제 Vercel 빌드 엔진이 이 파일을 읽어도 에러를 내지 않고 통과합니다!
export const supabase = createClient(supabaseUrl, supabaseAnonKey);