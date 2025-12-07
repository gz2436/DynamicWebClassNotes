import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Terminal, AlertCircle, CheckCircle2 } from 'lucide-react';

const Feedback: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('IDLE'); // IDLE, SUBMITTING, SUCCESS

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('SUBMITTING');

        try {
            const response = await fetch('https://formspree.io/f/xyzrdglk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    message: message
                })
            });

            if (response.ok) {
                setStatus('SUCCESS');
                setEmail('');
                setMessage('');
            } else {
                console.error('Submission failed');
                // Optional: setStatus('ERROR') or alert user
                alert('Transmission failed. Please try again.');
                setStatus('IDLE');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Transmission error. Please check your connection.');
            setStatus('IDLE');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-[#080808] text-white font-mono selection:bg-white selection:text-black px-8 py-4 md:p-12 relative overflow-hidden">

            {/* Giant Watermark */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.03] select-none whitespace-nowrap">
                <h1 className="text-[20vw] font-black leading-none tracking-tighter text-white">INPUT</h1>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-4xl mx-auto pt-10 md:pt-24 space-y-8 md:space-y-24 relative z-10"
            >

                {/* Header Section */}
                <motion.section variants={itemVariants} className="space-y-4 md:space-y-8">
                    <div className="relative">
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none relative z-10 mix-blend-difference">
                            System<br />Input
                        </h1>
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none absolute top-1 left-1 text-white/10 z-0 pointer-events-none select-none">
                            System<br />Input
                        </h1>
                    </div>
                    <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed border-l-2 border-white/20 pl-6">
                        Contribute your observations. Your feedback helps fine-tune the recommendation algorithm.
                    </p>
                </motion.section>

                {/* Terminal Form */}
                <motion.section variants={itemVariants} className="border-t border-white/10 pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                        {/* Protocol Panel */}
                        <div className="md:col-span-4 space-y-8">
                            <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-[10px] font-bold">
                                <Terminal className="h-4 w-4" /> Protocol_v3
                            </div>
                            <div className="space-y-4 text-xs text-white/60 leading-relaxed font-mono">
                                <p>Please provide detailed reports on bugs, feature requests, or curatorial suggestions.</p>
                                <p>Anonymous submissions accepted.</p>
                            </div>
                        </div>

                        {/* Interactive Input Area */}
                        <div className="md:col-span-8 relative">
                            {status === 'SUCCESS' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-96 flex flex-col justify-center items-center text-center space-y-6 bg-white/5 border border-white/10 p-12"
                                >
                                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                                    <div className="text-2xl font-bold uppercase tracking-widest">Transmission Received</div>
                                    <p className="text-white/60 text-sm">Protocol updated. Thank you.</p>
                                    <button
                                        onClick={() => setStatus('IDLE')}
                                        className="text-xs uppercase border-b border-white/40 hover:text-white hover:border-white transition-colors pb-1 mt-8"
                                    >
                                        Initiate New Transmission
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-12">

                                    {/* Email Input */}
                                    <div className="group relative">
                                        <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-white transition-colors">Identifier (EMAIL // REQUIRED)</label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="NAME@EXAMPLE.COM"
                                                className="w-full bg-white/5 border border-white/10 focus:border-white px-6 py-3 md:py-4 text-sm md:text-base font-bold tracking-wider text-white placeholder-white/20 focus:outline-none focus:bg-white/10 transition-all rounded-none"
                                            />
                                            {/* Blinking Cursor Decoration */}
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-white/50 animate-pulse pointer-events-none hidden group-focus-within:block" />
                                        </div>
                                    </div>

                                    {/* Message Input */}
                                    <div className="group relative">
                                        <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-white transition-colors">Observation Data (Required)</label>
                                        <div className="relative">
                                            <textarea
                                                required
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                rows={5}
                                                placeholder="ENTER_DATA..."
                                                className="w-full bg-white/5 border border-white/10 focus:border-white px-6 py-3 md:py-4 text-sm md:text-base font-bold tracking-wider text-white placeholder-white/20 focus:outline-none focus:bg-white/10 transition-all resize-none rounded-none leading-relaxed"
                                            />
                                            {/* Blinking Cursor Decoration */}
                                            <div className="absolute right-4 bottom-4 w-1.5 h-4 bg-white/50 animate-pulse pointer-events-none hidden group-focus-within:block" />
                                        </div>
                                    </div>

                                    {/* Submit Action */}
                                    <div className="pt-8 flex justify-center md:justify-end">
                                        <button
                                            type="submit"
                                            disabled={status === 'SUBMITTING'}
                                            className="group relative inline-flex items-center justify-center gap-4 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden w-auto"
                                        >
                                            <span className="relative z-10">{status === 'SUBMITTING' ? 'Transmitting...' : 'Execute Transmission'}</span>
                                            {status === 'SUBMITTING' ? (
                                                <div className="h-3 w-3 border-2 border-black/30 border-t-black rounded-full animate-spin relative z-10" />
                                            ) : (
                                                <Send className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </motion.section>

                {/* Footer Metadata (Version Fixed) */}
                <motion.section variants={itemVariants} className="border-t border-white/10 pt-12 pb-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[10px] text-white/40 uppercase tracking-widest">
                        <div className="group cursor-help">
                            <span className="block text-white/20 mb-1 group-hover:text-white transition-colors">Status</span>
                            <span>Online</span>
                        </div>
                        <div className="group cursor-help">
                            <span className="block text-white/20 mb-1 group-hover:text-white transition-colors">Version</span>
                            <span className="text-white">v3.0.0 (STABLE)</span>
                        </div>
                        <div className="group cursor-help">
                            <span className="block text-white/20 mb-1 group-hover:text-white transition-colors">Security</span>
                            <span>Encrypted</span>
                        </div>
                        <div className="group cursor-help">
                            <span className="block text-white/20 mb-1 group-hover:text-white transition-colors">Ref</span>
                            <span>SYS_IN_01</span>
                        </div>
                    </div>
                </motion.section>

            </motion.div>
        </div>
    );
};

export default Feedback;
