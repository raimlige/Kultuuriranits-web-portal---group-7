"use client";
import { useState, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import {
    Loader2,
    Mail,
    MessageSquareText,
    Send,
    User,
} from "lucide-react";

export function ContactForm() {
    const [isSending, setIsSending] = useState(false);

    const sendMail = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSending(true);
        const form = event.currentTarget;

        const formData = new FormData(form);
        const name = formData.get("user_name") as string;
        const email = formData.get("user_email") as string;
        const subject = formData.get("user_subject") as string;
        const message = formData.get("user_message") as string;

        if (!name || !email || !message) {
            alert("Palun täida kõik kohustuslikud väljad!");
            setIsSending(false);
            return;
        }

        const parms = { name, email, subject, message };

        try {
            emailjs.init("KzJnSr3TY7Do9DEq8");
            const response = await emailjs.send("service_sjtt2xh", "template_u7ymz3a", parms);
            if (response.status === 200) {
                alert("Sõnum saadetud!");
                form.reset();
            } else {
                alert("Midagi läks valesti.");
            }
        } catch (error: unknown) {
            console.error("Viga saatmisel:", error);
            if (error && typeof error === "object" && "text" in error) {
                alert("Viga saatmisel: " + (error as { text: string }).text);
            } else if (error instanceof Error) {
                alert("Viga saatmisel: " + error.message);
            } else {
                alert("Viga saatmisel: Tundmatu viga");
            }
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="rounded-[2rem] bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-8 py-8 text-white">
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                    <MessageSquareText className="w-7 h-7" />
                </div>

                <h2 className="text-3xl font-black tracking-tight">
                    Saada meile sõnum
                </h2>

                <p className="mt-2 text-sm text-blue-100 leading-relaxed">
                    Täida vorm ja vastame sulle esimesel võimalusel.
                </p>
            </div>

            <div className="p-8">
                <form onSubmit={sendMail} className="space-y-5">

                    <div>
                        <label htmlFor="name" className="block text-sm font-extrabold text-gray-700 mb-2">
                            Nimi *
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="name"
                                name="user_name"
                                type="text"
                                placeholder="Sinu nimi"
                                required
                                className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 py-3.5 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-extrabold text-gray-700 mb-2">
                            E-post *
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                name="user_email"
                                type="email"
                                placeholder="sinu@email.ee"
                                required
                                className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 py-3.5 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-sm font-extrabold text-gray-700 mb-2">
                            Teema
                        </label>
                        <input
                            id="subject"
                            name="user_subject"
                            type="text"
                            placeholder="Millest soovid kirjutada?"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-extrabold text-gray-700 mb-2">
                            Sõnum *
                        </label>
                        <textarea
                            id="message"
                            name="user_message"
                            rows={5}
                            placeholder="Kirjuta oma sõnum siia..."
                            required
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-y"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSending}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-white font-extrabold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none active:scale-[0.99]"
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saadan...
                            </>
                        ) : (
                            <>
                                Saada
                                <Send className="w-5 h-5" />
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}