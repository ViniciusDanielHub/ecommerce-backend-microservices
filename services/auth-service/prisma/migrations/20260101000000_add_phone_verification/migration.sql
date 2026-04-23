-- Migration: add_phone_verification
-- Adiciona campos de verificação de telefone ao modelo User
 
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "phoneVerifiedAt"           TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "phoneVerificationCode"     TEXT,
  ADD COLUMN IF NOT EXISTS "phoneVerificationExpires"  TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "phoneVerificationChannel"  TEXT; -- 'sms' | 'whatsapp'
 