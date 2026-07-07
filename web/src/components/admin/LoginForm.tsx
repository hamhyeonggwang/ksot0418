"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithPassword } from "@/lib/supabase/auth";

export function LoginForm() {
  const searchParams = useSearchParams();
  const forbidden = searchParams.get("error") === "forbidden";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const { error } = await signInWithPassword(email, password);
    if (error) {
      setPending(false);
      setError(error);
      return;
    }
    // 로그인 폼이 잠깐 남아 보이는 것을 막기 위해 전체 새로고침으로 전환
    // (pending 상태는 페이지가 실제로 바뀔 때까지 유지)
    window.location.href = "/admin";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-3xl border border-[#1A2B4C]/8 bg-white p-8 shadow-sm"
    >
      <h1 className="text-xl font-bold text-[#1A2B4C]">관리자 로그인</h1>
      <p className="mt-1 text-sm text-muted">KSOT 관리자 계정으로 로그인하세요.</p>

      {forbidden && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          관리자 권한이 없는 계정입니다.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-[#1A2B4C]">
            이메일
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-[#1A2B4C]">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#1A2B4C]/12 px-4 py-2.5 text-sm text-[#1A2B4C] outline-none focus:border-[#2DD4BF]/60"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-xl bg-[#1A2B4C] py-3 text-sm font-semibold text-white transition hover:bg-[#243B66] disabled:opacity-50"
      >
        {pending ? "로그인 중…" : "로그인"}
      </button>
    </form>
  );
}
