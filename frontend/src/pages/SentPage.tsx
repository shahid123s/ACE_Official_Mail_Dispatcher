import { useState, useEffect } from "react";
import { Mail, Clock, Search, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getSentMailsRequest } from "../lib/api";

interface SentMail {
    id: string;
    to: string;
    subject: string;
    sentBy: string;
    sentAt: string;
    status?: string;
}

const SentPage = () => {
    const { token } = useAuth();
    const [mails, setMails] = useState<SentMail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const fetchMails = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getSentMailsRequest(token!);
            setMails(data.mails || data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load sent mails");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMails();
    }, []);

    const filtered = mails.filter(
        (m) =>
            m.to.toLowerCase().includes(search.toLowerCase()) ||
            m.subject.toLowerCase().includes(search.toLowerCase()) ||
            m.sentBy.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Sent Messages</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        All emails dispatched from this tool
                    </p>
                </div>
                <button
                    onClick={fetchMails}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    id="sent-search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by recipient, subject, or sender..."
                    className="w-full pl-9 pr-4 py-3 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
            </div>

            {/* State: Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading sent messages...
                </div>
            )}

            {/* State: Error */}
            {!loading && error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            {/* State: Empty */}
            {!loading && !error && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Mail className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm font-medium">No sent messages found</p>
                    {search && (
                        <p className="text-xs mt-1">Try a different search term</p>
                    )}
                </div>
            )}

            {/* Table */}
            {!loading && !error && filtered.length > 0 && (
                <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted/50 text-left">
                                <th className="px-5 py-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
                                    To
                                </th>
                                <th className="px-5 py-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
                                    Subject
                                </th>
                                <th className="px-5 py-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase hidden md:table-cell">
                                    Sent By
                                </th>
                                <th className="px-5 py-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase hidden lg:table-cell">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map((mail) => (
                                <tr key={mail.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-5 py-3.5 text-foreground font-medium max-w-[200px] truncate">
                                        {mail.to}
                                    </td>
                                    <td className="px-5 py-3.5 text-foreground max-w-[250px] truncate">
                                        {mail.subject}
                                    </td>
                                    <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">
                                        {mail.sentBy}
                                    </td>
                                    <td className="px-5 py-3.5 text-muted-foreground hidden lg:table-cell">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(mail.sentAt).toLocaleString()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SentPage;
