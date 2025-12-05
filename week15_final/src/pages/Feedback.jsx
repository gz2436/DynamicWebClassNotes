import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';

const Feedback = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('IDLE'); // IDLE, SUBMITTING, SUCCESS

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
            className="min-h-screen bg-[#080808] text-white font-mono p-6 md:p-12 pt-24"
        >
            <BackButton />

            <div className="max-w-2xl mx-auto space-y-12">
                {/* Header */}
                <header className="space-y-4 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white/90">
                        System Input
                    </h1>
                    <p className="text-white/40 max-w-lg leading-relaxed">
                        Contribute your observations to the Daily_Movie archive.
                        Your feedback improves the recommendation algorithm.
                    </p>
                </header>

                {/* Form */}
                <div className="relative">
                    {status === 'SUCCESS' ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-900/20 border border-green-500/30 p-8 text-center space-y-4"
                        >
                            <div className="text-green-500 font-bold uppercase tracking-widest text-sm">Transmission Received</div>
                            <p className="text-white/60 text-sm">Thank you for your input. Protocol updated.</p>
                            <button
                                onClick={() => setStatus('IDLE')}
                                className="text-[10px] uppercase underline text-white/40 hover:text-white mt-4"
                            >
                                Send Another
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div className="space-y-2">
                                <label className="block text-xs uppercase tracking-widest text-white/40">Identifier (Email)</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="OPTIONAL / ANONYMOUS"
                                    className="w-full bg-white/5 border border-white/10 p-4 text-white placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs uppercase tracking-widest text-white/40">Observation Data</label>
                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={5}
                                    placeholder="Report bugs, suggest features, or request specific movies..."
                                    className="w-full bg-white/5 border border-white/10 p-4 text-white placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors font-mono"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'SUBMITTING'}
                                className="bg-white text-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                            >
                                {status === 'SUBMITTING' ? 'Transmitting...' : 'Submit Feedback'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Metadata */}
                <div className="pt-12 border-t border-white/5 flex gap-8 text-[10px] text-white/20 uppercase tracking-widest">
                    <span>V. 2.0.5</span>
                    <span>SECURE CONNECTION</span>
                    <span>NEW YORK, NY</span>
                </div>
            </div>
        </motion.div>
    );
};

export default Feedback;
