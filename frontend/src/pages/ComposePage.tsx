import { useState, type FormEvent } from "react";
import { Send, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { sendMailRequest, type SendMailPayload } from "../lib/api";

const MAX_BCC_CC = 10;

const ComposePage = () => {
    const { token, user } = useAuth();

    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [html, setHtml] = useState("");
    const [cc, setCc] = useState("");
    const [bcc, setBcc] = useState("");
    const [showExtra, setShowExtra] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSend = async (e: FormEvent) => {
        e.preventDefault();
        if (!to.trim()) return showToast("error", "Recipient (To) is required.");
        if (!subject.trim()) return showToast("error", "Subject is required.");
        if (!html.trim()) return showToast("error", "Email body cannot be empty.");

        setIsSending(true);
        try {
            const payload: SendMailPayload = {
                to: to.trim(),
                subject: subject.trim(),
                html: html.trim(),
                ...(cc.trim() ? { cc: cc.trim() } : {}),
                ...(bcc.trim() ? { bcc: bcc.trim() } : {}),
            };
            await sendMailRequest(token!, payload);
            showToast("success", "Email sent successfully!");
            setTo("");
            setSubject("");
            setHtml("");
            setCc("");
            setBcc("");
        } catch (err) {
            showToast("error", err instanceof Error ? err.message : "Failed to send");
        } finally {
            setIsSending(false);
        }
    };

    const handleReset = () => {
        setTo("");
        setSubject("");
        setHtml("");
        setCc("");
        setBcc("");
        setToast(null);
    };

    return (
        <div className="max-w-3xl mx-auto p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">New Message</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sending from: <span className="font-medium text-foreground">company@ace.com</span>
                        {user && (
                            <span className="text-muted-foreground/70"> · dispatched by {user.name}</span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        id="send-mail-btn"
                        type="submit"
                        form="compose-form"
                        disabled={isSending}
                        className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                        {isSending ? "Sending..." : "Send Now"}
                    </button>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div
                    className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium border ${toast.type === "success"
                            ? "bg-accent/20 border-accent text-accent-foreground"
                            : "bg-destructive/10 border-destructive/30 text-destructive"
                        }`}
                >
                    {toast.msg}
                </div>
            )}

            {/* Form */}
            <form id="compose-form" onSubmit={handleSend} className="space-y-5">
                {/* To */}
                <div>
                    <label className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5 block">
                        To *
                    </label>
                    <input
                        id="compose-to"
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="recipient@example.com, another@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                    />
                </div>

                {/* Toggle CC/BCC */}
                <button
                    type="button"
                    onClick={() => setShowExtra((v) => !v)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                    {showExtra ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {showExtra ? "Hide CC / BCC" : "Add CC / BCC"}
                </button>

                {showExtra && (
                    <div className="space-y-5">
                        <div>
                            <label className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5 block">
                                CC (max {MAX_BCC_CC})
                            </label>
                            <input
                                id="compose-cc"
                                type="text"
                                value={cc}
                                onChange={(e) => setCc(e.target.value)}
                                placeholder="cc@example.com"
                                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5 block">
                                BCC (max {MAX_BCC_CC})
                            </label>
                            <input
                                id="compose-bcc"
                                type="text"
                                value={bcc}
                                onChange={(e) => setBcc(e.target.value)}
                                placeholder="bcc@example.com"
                                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                            />
                        </div>
                    </div>
                )}

                {/* Subject */}
                <div>
                    <label className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase mb-1.5 block">
                        Subject *
                    </label>
                    <input
                        id="compose-subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter email subject..."
                        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                    />
                </div>

                {/* Body */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
                            Body *
                        </label>
                        <span className="text-[10px] text-muted-foreground">HTML supported</span>
                    </div>
                    <div className="border border-border rounded-lg bg-card overflow-hidden">
                        <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/40">
                            {["B", "I", "U"].map((fmt) => (
                                <button
                                    key={fmt}
                                    type="button"
                                    title={fmt}
                                    className="w-7 h-7 rounded text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center justify-center"
                                >
                                    {fmt}
                                </button>
                            ))}
                        </div>
                        <textarea
                            id="compose-body"
                            value={html}
                            onChange={(e) => setHtml(e.target.value)}
                            placeholder="Write your email content here... (HTML is supported)"
                            rows={14}
                            className="w-full px-4 py-4 bg-transparent text-foreground text-sm resize-none focus:outline-none leading-relaxed placeholder:text-muted-foreground"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ComposePage;
