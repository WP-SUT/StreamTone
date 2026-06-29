'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Music, X } from 'lucide-react';

const schema = z
  .object({
    displayName: z.string().min(2, 'نام نمایشی حداقل ۲ کاراکتر باشد'),
    email: z.string().email('ایمیل معتبر وارد کنید'),
    password: z.string().min(8, 'رمز عبور حداقل ۸ کاراکتر باشد'),
    confirmPassword: z.string(),
    dob: z.string().min(1, 'تاریخ تولد الزامی است'),
    gender: z.enum(['male', 'female', 'other'], { required_error: 'جنسیت را انتخاب کنید' }),
    privacy: z.boolean().refine((v) => v === true, 'پذیرش قوانین الزامی است'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'رمز عبور و تکرار آن یکسان نیستند',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-white font-semibold">سیاست حریم خصوصی</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 text-sm text-gray-300 leading-7 space-y-4 custom-scrollbar">
          <p>
            این سرویس متعهد به حفظ حریم خصوصی کاربران خود است. اطلاعات شخصی شما تنها برای
            ارائه خدمات بهتر استفاده می‌شود و هرگز بدون رضایت شما به اشخاص ثالث منتقل
            نخواهد شد.
          </p>
          <p>
            با ثبت‌نام در این سرویس، شما با جمع‌آوری و پردازش اطلاعات ضروری مانند آدرس
            ایمیل، تاریخ تولد و جنسیت موافقت می‌کنید. این اطلاعات به‌منظور شخصی‌سازی
            تجربه کاربری و ارائه محتوای مرتبط مورد استفاده قرار می‌گیرد.
          </p>
          <p>
            ما از روش‌های رمزگذاری استاندارد صنعتی برای محافظت از اطلاعات شما استفاده
            می‌کنیم. در صورت هرگونه نگرانی درباره حریم خصوصی، می‌توانید با تیم پشتیبانی
            ما تماس بگیرید.
          </p>
        </div>
        <div className="p-5 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-2.5 text-sm font-medium transition"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // TODO: call register API
      console.log(data);
      toast.success('ثبت‌نام با موفقیت انجام شد');
      router.push('/home');
    } catch {
      toast.error('خطا در ثبت‌نام، دوباره تلاش کنید');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}

      <main
        dir="rtl"
        className="min-h-screen bg-[#0d0d1a] flex items-center justify-center px-4 py-12 font-['Vazirmatn']"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-800/15 rounded-full blur-[140px]" />
        </div>

        <div className="relative w-full max-w-lg">
          {/* Logo */}
          <div className="flex flex-col items-center mb-7 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center shadow-lg shadow-purple-900/50">
              <Music className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">ایجاد حساب کاربری</h1>
            <p className="text-sm text-gray-400">به جمع ما بپیوندید</p>
          </div>

          {/* Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Display Name */}
              <Field label="نام نمایشی" error={errors.displayName?.message}>
                <input
                  {...register('displayName')}
                  placeholder="نام نمایشی شما"
                  className={inputCls}
                />
              </Field>

              {/* Email */}
              <Field label="ایمیل" error={errors.email?.message}>
                <input
                  {...register('email')}
                  type="email"
                  dir="ltr"
                  placeholder="example@email.com"
                  className={inputCls}
                />
              </Field>

              {/* Password row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="رمز عبور" error={errors.password?.message}>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`${inputCls} pl-10`}
                    />
                    <TogglePass show={showPass} onClick={() => setShowPass((v) => !v)} />
                  </div>
                </Field>
                <Field label="تکرار رمز عبور" error={errors.confirmPassword?.message}>
                  <div className="relative">
                    <input
                      {...register('confirmPassword')}
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`${inputCls} pl-10`}
                    />
                    <TogglePass show={showConfirm} onClick={() => setShowConfirm((v) => !v)} />
                  </div>
                </Field>
              </div>

              {/* DOB + Gender row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="تاریخ تولد" error={errors.dob?.message}>
                  <input
                    {...register('dob')}
                    type="date"
                    dir="ltr"
                    className={inputCls}
                  />
                </Field>
                <Field label="جنسیت" error={errors.gender?.message}>
                  <select {...register('gender')} className={`${inputCls} cursor-pointer`}>
                    <option value="" disabled selected>انتخاب کنید</option>
                    <option value="male">مرد</option>
                    <option value="female">زن</option>
                    <option value="other">سایر</option>
                  </select>
                </Field>
              </div>

              {/* Privacy */}
              <div className="space-y-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    {...register('privacy')}
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 accent-purple-500 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-sm text-gray-300 leading-6">
                    <button
                      type="button"
                      onClick={() => setShowPrivacy(true)}
                      className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition"
                    >
                      سیاست حریم خصوصی
                    </button>
                    {' '}را خوانده‌ام و می‌پذیرم
                  </span>
                </label>
                {errors.privacy && (
                  <p className="text-red-400 text-xs pr-7">{errors.privacy.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition shadow-lg shadow-purple-900/40 mt-2"
              >
                {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 transition font-medium">
                وارد شوید
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

// ── small shared helpers ────────────────────────────────────────────────────

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition';

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-gray-300">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

function TogglePass({ show, onClick }: { show: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}
