import { useState } from "react";
import { Mail, Send } from "lucide-react";

export default function Contact() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent: " + message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] px-6 py-12">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-[#111827] flex items-center justify-center mx-auto mb-5">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#111827] mb-1">
            Contact us
          </h1>
          <p className="text-sm text-[#6B7280]">
            Have a question or feedback? Send us a message.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message…"
                rows={6}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-colors resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-[#111827] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#1F2937] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}