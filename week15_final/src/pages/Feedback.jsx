import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Terminal } from 'lucide-react';

const Feedback = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('IDLE'); // IDLE, SUBMITTING, SUCCESS

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('SUBMITTING');
        // Fake API delay
        setTimeout(() => {
            setStatus('SUCCESS');
            setEmail('');
            setMessage('');
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#080808] text-white font-mono selection:bg-white selection:text-black p-6 md:p-12"
        >
            <div className="max-w-4xl mx-auto pt-32 space-y-24">

                {/* Intro Section */}
                <section className="space-y-8">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                        System<br />Input
                    </h1>
                    <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
                        Contribute your observations to the DAILY_FILM archive. Your feedback helps fine-tune the recommendation algorithm.
                    </p>
                </section>

                {/* Form Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">

                    {/* Instructions / Label */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-xs font-bold">
                            <Terminal className="h-4 w-4" /> Protocol
                        </div>
                        <h2 className="text-2xl font-bold uppercase">Transmission Interface</h2>
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                            Please provide detailed reports on bugs, feature requests, or curatorial suggestions.
                            <br /><br />
                            Anonymous submissions are accepted, but providing an identifier allows for follow-up.
                        </p>
                    </div>

                    {/* The Form */}
                    <div className="relative">
                        {status === 'SUCCESS' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-full flex flex-col justify-center items-center text-center space-y-4 bg-white/5 border border-white/10 p-12"
                            >
                                <div className="text-green-500 font-bold uppercase tracking-widest text-sm">Transmission Received</div>
                                <p className="text-white/60 text-sm">Thank you for your input. Protocol updated.</p>
                                <button
                                    onClick={() => setStatus('IDLE')}
                                    className="text-[10px] uppercase underline text-white/40 hover:text-white mt-4"
                                >
                                    New Transmission
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Identifier (Optional)</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="user@example.com"
                                        className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors font-mono rounded-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Observation Data (Required)</label>
                                    <textarea
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={4}
                                        placeholder="Enter your message..."
                                        className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white transition-colors font-mono resize-none rounded-none"
                                    />
                                </div>

                                <div className="pt-4 flex justify-center md:justify-start">
                                    <button
                                        type="submit"
                                        disabled={status === 'SUBMITTING'}
                                        className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest hover:text-white/60 transition-colors disabled:opacity-50"
                                    >
                                        <span>{status === 'SUBMITTING' ? 'Transmitting...' : 'Execute Transmission'}</span>
                                        <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                </section>

                {/* Footer Metadata */}
                <section className="border-t border-white/10 pt-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[10px] text-white/40 uppercase tracking-widest">
                        <div>
                            <span className="block text-white/20 mb-1">Status</span>
                            <span>Online</span>
                        </div>
                        <div>
                            <span className="block text-white/20 mb-1">Version</span>
                            <span>2.0.5</span>
                        </div>
                        <div>
                            <span className="block text-white/20 mb-1">Security</span>
                            <span>Encrypted</span>
                        </div>
                        <div>
                            <span className="block text-white/20 mb-1">Ref</span>
                            <span>SYS_IN_01</span>
                        </div>
                    </div>
                </section>

            </div>
        </motion.div>
    );
};

export default Feedback;
