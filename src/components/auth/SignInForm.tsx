import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import { Button, Input } from "antd";
import { useLogin } from "../../hooks/useAuth";

// Role'ga qarab redirect qilish uchun mapping
const ROLE_REDIRECTS: Record<string, string> = {
  ROLE_SUPER_ADMIN: "/dashboard/super_admin",
  ROLE_ADMIN: "/dashboard/admin",
  ROLE_TEACHER: "/dashboard/teacher",
  ROLE_STUDENT: "/dashboard/student",
  ROLE_PARENT: "/dashboard/parent",
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const loginMutation = useLogin();

  // ❌ useEffect ni olib tashladik - bu loop yaratgan edi

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!phone || !password) {
      toast.error("Telefon raqam va parolni kiriting!");
      return;
    }

    // Phone format validation
    if (!phone.startsWith("998") && !phone.startsWith("+998")) {
      toast.error("Telefon raqam 998 bilan boshlanishi kerak!");
      return;
    }

    // + belgisini olib tashlash
    const cleanPhone = phone.replace(/\+/g, "");

    try {
      // API ga login request
      const response = await loginMutation.mutateAsync({
        phone: cleanPhone,
        password: password,
      });

      console.log("Login response:", response);

      // Success - role'ga qarab redirect
      if (response.success && response.data) {
        const userRole = response.message as string;
        const redirectPath = ROLE_REDIRECTS[userRole] || "/dashboard/teacher";

        toast.success(`Xush kelibsiz!`);

        // Navigate qilish
        navigate(redirectPath, { replace: true });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.message || "Login xatolik!");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Kirish
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kirish uchun telefon raqamingiz va parolingizni kiriting!
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Phone Input */}
              <div>
                <Label>
                  Telefon <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="998900000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loginMutation.isPending}
                  size="large"
                />
              </div>

              {/* Password Input */}
              <div>
                <Label>
                  Parol <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Parolni kiriting"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loginMutation.isPending}
                    size="large"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !bg-[#032E15] hover:!bg-[#032E15] outline-none"
                  loading={loginMutation.isPending}
                  disabled={loginMutation.isPending}
                  size="large"
                >
                  {loginMutation.isPending ? "Kirish..." : "Kirish"}
                </Button>
              </div>

              {/* Error Message */}
              {loginMutation.isError && (
                <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {(loginMutation.error as any)?.message || "Xatolik yuz berdi. Qaytadan urinib ko'ring."}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}