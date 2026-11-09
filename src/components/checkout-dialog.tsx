"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { placeOrder } from "@/app/actions/order";
import { cart, useCart } from "@/lib/cart";
import { districts, paymentMethods, type OrderState } from "@/lib/order";
import { formatPrice } from "@/lib/products";

/** Сагсны "Захиалга өгөх" товчоор нээгдэх захиалгын dialog. Native <dialog> — focus trap, Escape. */
export function CheckoutDialog() {
  const { isCheckoutOpen } = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  // Нээх бүрт маягтыг шинээр mount хийнэ (өмнөх амжилт/алдааны төлөв үлдэхгүй)
  const [session, setSession] = useState(0);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (isCheckoutOpen && !d.open) {
      setSession((n) => n + 1);
      d.showModal();
    }
    if (!isCheckoutOpen && d.open) d.close();
  }, [isCheckoutOpen]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="checkout-title"
      onClose={cart.closeCheckout}
      onClick={(e) => {
        if (e.target === e.currentTarget) cart.closeCheckout();
      }}
      className="m-auto w-full max-w-xl overflow-y-auto overscroll-contain bg-[#f7f8fa] p-0 text-ink shadow-[0_24px_64px_rgba(41,50,58,0.25)] backdrop:bg-ink/45 max-sm:h-full max-sm:max-h-none max-sm:max-w-none sm:max-h-[calc(100dvh-3rem)] sm:rounded-3xl"
    >
      <CheckoutForm key={session} />
    </dialog>
  );
}

const field =
  "mt-2 w-full rounded-xl border border-[#dde1e6] bg-[#eef0f3] px-4 py-3.5 text-[15px] text-ink placeholder:text-[#8a929a] transition-colors focus:border-ink/40 focus:bg-white focus:outline-none aria-invalid:border-brand-red";
const label = "block text-[13px] font-semibold text-ink";

function CheckoutForm() {
  const { items, total, count } = useCart();
  const [state, formAction, pending] = useActionState<OrderState, FormData>(placeOrder, { status: "idle" });

  useEffect(() => {
    if (state.status === "success") cart.clear();
  }, [state]);

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};

  return (
    <div className="px-6 pb-8 pt-7 sm:px-10 sm:pb-10 sm:pt-9">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">Babytol / Захиалга</p>
        <button
          type="button"
          onClick={cart.closeCheckout}
          aria-label="Хаах"
          className="-mr-2 -mt-2 grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
            <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {state.status === "success" ? (
        <Success orderNo={state.orderNo} total={state.total} phone={state.phone} />
      ) : (
        <>
          <h2 id="checkout-title" className="mt-6 text-[2.25rem] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[2.75rem]">
            Бяцхан өсөлтөд
            <span className="block text-brand-red">том хайр.</span>
          </h2>

          {items.length === 0 ? (
            <div className="mt-8 border-t border-[#dde1e6] pt-8 text-center">
              <p className="text-[15px] text-ink-muted">Сагс хоосон байна.</p>
              <button
                type="button"
                onClick={cart.backToCart}
                className="mt-4 rounded-full bg-brand-red px-5 py-3 text-[15px] font-semibold text-white hover:bg-[#B01F28]"
              >
                Сагс руу буцах
              </button>
            </div>
          ) : (
            <form action={formAction} className="mt-8">
              {/* Захиалсан бүтээгдэхүүн */}
              <div className="border-y border-[#dde1e6] py-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-ink-muted">{count} бүтээгдэхүүн</p>
                  <button
                    type="button"
                    onClick={cart.backToCart}
                    className="border-b border-ink pb-0.5 text-xs font-semibold text-ink hover:text-brand-red"
                  >
                    Өөрчлөх
                  </button>
                </div>
                <ul className="mt-3 space-y-4">
                  {items.map(({ product: p, qty, lineTotal }) => (
                    <li key={p.slug} className="flex items-center gap-4">
                      <span
                        className="relative h-[68px] w-20 shrink-0 rounded-xl bg-white"
                        style={{ boxShadow: `inset 0 -3px 0 ${p.accent}` }}
                      >
                        <Image src={p.packshot} alt="" fill sizes="80px" className="object-contain p-1.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-tight">{p.name}</p>
                        <p className="mt-1 text-xs tabular-nums text-ink-muted">
                          {formatPrice(p.price)} × {qty} ширхэг
                        </p>
                      </div>
                      <p className="text-[15px] font-semibold tabular-nums">{formatPrice(lineTotal)}</p>
                    </li>
                  ))}
                </ul>
                <input
                  type="hidden"
                  name="lines"
                  value={JSON.stringify(items.map(({ slug, qty }) => ({ slug, qty })))}
                />
                {errors.lines && <p className="mt-3 text-sm text-brand-red">{errors.lines}</p>}
              </div>

              {/* Холбоо барих, хүргэлт */}
              <div className="grid gap-5 pt-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="co-name" className={label}>Таны нэр</label>
                  <input
                    id="co-name"
                    name="name"
                    required
                    minLength={2}
                    autoComplete="name"
                    placeholder="Нэрээ оруулна уу"
                    defaultValue={values.name}
                    aria-invalid={!!errors.name || undefined}
                    aria-describedby={errors.name ? "co-name-err" : undefined}
                    className={field}
                  />
                  <FieldError id="co-name-err" msg={errors.name} />
                </div>
                <div>
                  <label htmlFor="co-phone" className={label}>Утасны дугаар</label>
                  <input
                    id="co-phone"
                    name="phone"
                    type="tel"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{8}"
                    maxLength={8}
                    autoComplete="tel-national"
                    placeholder="8 оронтой дугаар"
                    defaultValue={values.phone}
                    aria-invalid={!!errors.phone || undefined}
                    aria-describedby={errors.phone ? "co-phone-err" : undefined}
                    className={field}
                  />
                  <FieldError id="co-phone-err" msg={errors.phone} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="co-district" className={label}>Дүүрэг / байршил</label>
                  <select
                    id="co-district"
                    name="district"
                    required
                    defaultValue={values.district ?? ""}
                    aria-invalid={!!errors.district || undefined}
                    className={field}
                  >
                    <option value="" disabled>Сонгоно уу</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <FieldError msg={errors.district} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="co-address" className={label}>Хүргэлтийн дэлгэрэнгүй хаяг</label>
                  <textarea
                    id="co-address"
                    name="address"
                    required
                    minLength={5}
                    rows={3}
                    autoComplete="street-address"
                    placeholder="Хороо, байр, орц, тоот"
                    defaultValue={values.address}
                    aria-invalid={!!errors.address || undefined}
                    className={`${field} resize-y`}
                  />
                  <FieldError msg={errors.address} />
                </div>
              </div>

              {/* Дүн, төлбөр */}
              <div className="mt-6 border-t border-[#dde1e6] pt-6">
                <dl className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm">Бүтээгдэхүүний дүн</dt>
                  <dd className="text-[1.75rem] font-medium tabular-nums tracking-tight">{formatPrice(total)}</dd>
                </dl>

                <fieldset className="mt-5">
                  <legend className={label}>Төлбөрийн хэлбэр</legend>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    {paymentMethods.map((m, i) => (
                      <label
                        key={m.value}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#dde1e6] bg-[#eef0f3] px-4 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink/30 has-[:checked]:border-brand-red has-[:checked]:bg-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-red"
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={m.value}
                          required
                          defaultChecked={values.payment ? values.payment === m.value : i === 0}
                          className="h-4 w-4 shrink-0 accent-brand-red"
                        />
                        {m.label}
                      </label>
                    ))}
                  </div>
                  <FieldError msg={errors.payment} />
                </fieldset>
              </div>

              {state.status === "error" && (
                <p role="alert" className="mt-5 rounded-xl bg-brand-red/8 px-4 py-3 text-sm font-medium text-brand-red">
                  {state.message}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-red px-6 py-4 text-base font-semibold text-white shadow-[0_10px_24px_-10px_rgba(204,36,46,0.6)] transition-colors hover:bg-[#B01F28] disabled:cursor-wait disabled:opacity-70"
              >
                {pending ? "Илгээж байна…" : (
                  <>
                    Захиалга илгээх
                    <span className="font-medium opacity-80">· {formatPrice(total)}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

function FieldError({ id, msg }: { id?: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-brand-red">
      {msg}
    </p>
  );
}

function Success({ orderNo, total, phone }: { orderNo: string; total: number; phone: string }) {
  return (
    <div className="py-6 text-center" role="status">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-green/12 text-brand-green">
        <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
          <path d="M7 15.5l5.5 5.5L23 9.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 id="checkout-title" className="mt-5 text-2xl font-bold">Захиалга хүлээн авлаа</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
        Бид <strong className="font-semibold text-ink">{phone}</strong> дугаарт удахгүй холбогдож, хүргэлтийн цагийг тохирно.
      </p>
      <dl className="mx-auto mt-6 max-w-xs space-y-2 rounded-2xl bg-white p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-muted">Захиалгын дугаар</dt>
          <dd className="font-semibold tabular-nums">{orderNo}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-muted">Нийт дүн</dt>
          <dd className="font-semibold tabular-nums">{formatPrice(total)}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={cart.closeCheckout}
        className="mt-8 rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-white hover:bg-ink/90"
      >
        Хаах
      </button>
    </div>
  );
}
