"use client";

import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_BACK_URL;

interface EmailFormProps {
    backendUrl?: string;
}

export default function EmailForm() {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const response = await fetch(`${API_URL}/sendEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: "include"
                },
                body: JSON.stringify({ subject, body }),
            });

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: 'E-mailide masssaatmine käivitati edukalt! Taustaprotsess tegeleb kirjade väljasaatmisega.'
                });
                setSubject('');
                setBody('');
            } else {
                const errorText = await response.text();
                throw new Error(errorText || 'Midagi läks valesti e-kirjade saatmisel.');
            }
        } catch (error: unknown) {
            setStatus({
                type: 'error',
                message: error instanceof Error ? error.message : 'Serveriga ei saadud ühendust.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Staatus */}
            {status && (
                <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-sm font-medium transition-all ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {status.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <span>{status.message}</span>
                </div>
            )}

            {/* Vorm */}
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Teema väli */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                        E-maili teema (Subject) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="nt. Kultuuriranitsa platvormi hooldustööd 20. juunil"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-800 shadow-xs"
                    />
                </div>

                {/* Sisu väli */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                        Kirja sisu (Body) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        required
                        rows={10}
                        placeholder="Tere, head Kultuuriranitsa kasutajad!&#10;&#10;Teavitame teid, et..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800 shadow-xs resize-y min-h-[200px]"
                    />
                </div>

                {/* Alumine nupurida */}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 rounded-xl text-base font-bold text-white transition-all shadow-md flex items-center gap-2 transform active:scale-98 ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg cursor-pointer'
                            }`}
                    >
                        {loading ? 'Käivitatakse saatmist...' : 'Saada kõigile kasutajatele'}
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}