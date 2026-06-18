import EmailForm from "@/components/EmailForm";

export default function AdminEmailPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-8">
                <div className="border-b border-gray-150 pb-5 mb-6">
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Süsteemiteavituste masspostitus
                    </h1>
                </div>
                <EmailForm />
            </div>
        </div>
    );
}