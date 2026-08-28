import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  PhoneCall,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Radio,
  FileQuestion,
  ExternalLink,
  Send,
  Sparkles
} from 'lucide-react';

const faqs = [
  {
    id: 'faq-1',
    question: 'How does Green Corridor Emergency Signal Preemption work?',
    answer:
      'When an EMS 108 ambulance is dispatched with ALS status, the UrbanEye AI network calculates its exact arrival vector and forces all traffic signal nodes along the corridor into FORCED GREEN, clearing ahead of the vehicle automatically.',
  },
  {
    id: 'faq-2',
    question: 'How accurate is the Live Bus Tracking and Seat Occupancy telemetry?',
    answer:
      'Bus telemetry is synchronized every 2 to 5 seconds with GPS on-board units and edge IoT cameras installed at doors to count passenger boardings in real-time.',
  },
  {
    id: 'faq-3',
    question: 'How do I report a road hazard, pothole, or severe waterlogging?',
    answer:
      'Navigate to the Road Hazards tab or use the Quick Actions widget on your dashboard to submit an instant geo-tagged report with optional photo upload.',
  },
  {
    id: 'faq-4',
    question: 'Are my location queries and identity kept private?',
    answer:
      'Yes. Citizen routing queries and telemetry are processed through anonymized zero-knowledge tokens. GPS data is only broadcast to dispatchers if you trigger an active Emergency SOS call.',
  },
  {
    id: 'faq-5',
    question: 'What is the difference between ALS and BLS triage for ambulances?',
    answer:
      'ALS (Advanced Life Support) ambulances carry emergency cardiologists/trauma physicians, defibrillators, and ventilator equipment, triggering top-tier Green Corridor priority. BLS (Basic Life Support) handles stable non-acute transfers.',
  },
];

export const HelpView = ({ onOpenEmergencyModal }) => {
  const [openFaq, setOpenFaq] = useState('faq-1');
  const [supportMessage, setSupportMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setMessageSent(true);
    setSupportMessage('');
    setTimeout(() => setMessageSent(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Citizen Help & Support Center</h2>
            <p className="text-xs text-slate-400">Frequently Asked Questions, Control Room Helpline & Live Assistance</p>
          </div>
        </div>

        {/* Contact Support Hotline Button */}
        <button
          type="button"
          onClick={onOpenEmergencyModal}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition shadow-lg shadow-rose-600/30 cursor-pointer flex items-center gap-2"
        >
          <PhoneCall className="w-4 h-4 animate-pulse" />
          <span>Call 24/7 Control Room</span>
        </button>
      </div>

      {/* Emergency Quick Hotlines Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-black font-mono text-sm">
            108
          </div>
          <div>
            <div className="text-xs font-bold text-white">Ambulance & Medical</div>
            <div className="text-[10px] text-rose-300 font-mono">Toll-Free Emergency</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black font-mono text-sm">
            112
          </div>
          <div>
            <div className="text-xs font-bold text-white">Unified Police Dispatch</div>
            <div className="text-[10px] text-blue-300 font-mono">AP Police Command</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black font-mono text-sm">
            1033
          </div>
          <div>
            <div className="text-xs font-bold text-white">National Highway Helpline</div>
            <div className="text-[10px] text-amber-300 font-mono">Road Safety & Towing</div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
          <FileQuestion className="w-4 h-4 text-blue-400" />
          <span>Frequently Asked Questions (FAQ)</span>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-400 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
                  )}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-900 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Direct Query Form */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Submit a Support Ticket / Citizen Query</span>
        </div>

        {messageSent ? (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Ticket #GNT-SUPP-9021 logged. Control Room officer will respond within 15 minutes.</span>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="space-y-3">
            <textarea
              required
              rows={3}
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="Describe your issue with bus route, emergency preemption, or app navigation..."
              className="w-full p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HelpView;
