import React, { useState, useRef } from 'react';
import { Send, Phone, AtSign, Mail as MailIcon, MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import WindowShell from './WindowShell';

const MailWindow = ({ id, isMinimized, onClose, onMinimize, zIndex = 40, offsetX = 180, offsetY = 90, onFocus }) => {
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const formRef = useRef();

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', subject: '', message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSendStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSendStatus(null);

    try {
      await emailjs.sendForm('service_4s958kx', 'template_t2u186s', formRef.current, 'i8Qii14k7ZspSdVPa');
      setSendStatus('success');
      setTimeout(() => {
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
        setSendStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setSendStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <WindowShell
      id={id}
      title="New Message - Contact"
      icon={MailIcon}
      isMinimized={isMinimized}
      zIndex={zIndex}
      defaultSize={{ width: 850, height: 700 }}
      defaultPosition={{ x: offsetX, y: offsetY }}
      minWidth={700}
      minHeight={600}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      className="!bg-gradient-to-br !from-gray-900 !via-gray-800 !to-gray-900"
    >
      <div className="flex-1 overflow-auto h-full">
        <div className="h-full flex">
          {/* Left Sidebar */}
          <div className="w-64 bg-gray-800/50 border-r border-gray-700 p-6 hidden md:block">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <MailIcon size={16} className="text-blue-400" />
                    <span className="text-sm">imranpasha.ahmed@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone size={16} className="text-green-400" />
                    <span className="text-sm">+91 9844548537</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MessageSquare size={16} className="text-purple-400" />
                    <span className="text-sm">+91 9844548537</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Response Time</h3>
                <p className="text-xs text-gray-400">
                  I typically respond within 24 hours. For urgent matters, please include "URGENT" in the subject line.
                </p>
              </div>

              <div className="pt-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <strong>Pro Tip:</strong> The more details you provide about your project, the better I can help you!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="flex-1 p-6 overflow-auto">
            <form ref={formRef} onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
              <div className="mb-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50"
                >
                  <Send className="text-white" size={32} />
                </motion.div>
                <h1 className="text-3xl font-bold text-white mb-2">Get In Touch</h1>
                <p className="text-gray-400">Let's discuss your next project!</p>
              </div>

              {sendStatus === 'success' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-green-300 text-center flex items-center justify-center gap-2">
                  <span>Message sent successfully! I'll get back to you soon.</span>
                </motion.div>
              )}

              {sendStatus === 'error' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-300 text-center flex items-center justify-center gap-2">
                  <span>Failed to send message. Please try again.</span>
                </motion.div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <User size={16} className="text-blue-400" /> Full Name *
                </label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <AtSign size={16} className="text-green-400" /> Email Address *
                  </label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="[email protected]" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Phone size={16} className="text-purple-400" /> Phone Number *
                  </label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <MessageSquare size={16} className="text-yellow-400" /> Subject *
                </label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  placeholder="Project Inquiry / Collaboration / General Question" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <MailIcon size={16} className="text-pink-400" /> Message *
                </label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows="6"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell me about your project, ideas, or just say hello! I'm excited to hear from you..." />
                <p className="text-xs text-gray-500">{formData.message.length} / 1000 characters</p>
              </div>

              <motion.button type="submit" disabled={isSending}
                whileHover={{ scale: isSending ? 1 : 1.02 }} whileTap={{ scale: isSending ? 1 : 0.98 }}
                className={`w-full py-4 rounded-lg font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-3 text-lg ${
                  isSending ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-blue-500/50'
                }`}>
                {isSending ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-5 h-5 border-3 border-white border-t-transparent rounded-full" />
                    Sending Message...
                  </>
                ) : (
                  <><Send size={22} /> Send Message</>
                )}
              </motion.button>

              <p className="text-xs text-center text-gray-500 pt-2">
                Your information is secure and will only be used to respond to your inquiry.
              </p>
            </form>
          </div>
        </div>
      </div>
    </WindowShell>
  );
};

export default MailWindow;
