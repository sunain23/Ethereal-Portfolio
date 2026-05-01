
import React, { useState, useEffect, useRef } from 'react';

interface ContactProps {
  isDarkMode: boolean;
}

const Contact: React.FC<ContactProps> = ({ isDarkMode }) => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<typeof formState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const validateField = (field: keyof typeof formState, value: string) => {
    let error: string | undefined;
    if (field === 'name' && !value.trim()) error = 'IDENTIFICATION_REQUIRED';
    if (field === 'email' && (!value.trim() || !/^\S+@\S+\.\S+$/.test(value))) error = 'VALID_CONTACT_STUB_REQUIRED';
    if (field === 'subject' && !value.trim()) error = 'PARAMETER_MISSING';
    if (field === 'message' && !value.trim()) error = 'PAYLOAD_CANNOT_BE_EMPTY';
    return error;
  };

  const validateForm = () => {
    const newErrors: Partial<typeof formState> = {};
    const nameError = validateField('name', formState.name);
    if (nameError) newErrors.name = nameError;
    const emailError = validateField('email', formState.email);
    if (emailError) newErrors.email = emailError;
    const subjectError = validateField('subject', formState.subject);
    if (subjectError) newErrors.subject = subjectError;
    const messageError = validateField('message', formState.message);
    if (messageError) newErrors.message = messageError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formState, value: string) => {
    setFormState({ ...formState, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleBlur = (field: keyof typeof formState) => {
    const error = validateField(field, formState[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    }, 1500);
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className={`py-32 px-6 transition-colors duration-700 relative overflow-hidden ${isDarkMode ? 'bg-black' : 'bg-white'}`}
    >
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className={`space-y-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div>
              <h2 className="text-4xl md:text-7xl serif font-bold mb-8 leading-tight">
                Let's <span className="italic">Collaborate</span>.
              </h2>
              <p className={`text-lg font-light leading-relaxed max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                I am currently open to high-impact projects and creative consultations. Reach out to initiate a dialogue about your vision.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <span className="block text-xs uppercase tracking-[0.3em] text-gray-600 mb-2 font-mono">// DIRECT INQUIRY</span>
                <a href="mailto:contact.sunain23@gmail.com" className={`text-2xl transition-colors duration-500 serif italic ${isDarkMode ? 'hover:text-gray-400' : 'hover:text-gray-500'}`}>
                  contact.sunain23@gmail.com
                </a>
              </div>
              
              <div>
                <span className="block text-xs uppercase tracking-[0.3em] text-gray-600 mb-2 font-mono">// STUDIO LOCATION</span>
                <p className={`font-light transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Remote / Global Uplink</p>
              </div>
            </div>
          </div>

          <div className={`p-10 md:p-16 rounded-[2rem] border transition-all duration-[1200ms] delay-200 relative overflow-hidden ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'} ${isDarkMode ? 'glass border-white/5' : 'bg-white shadow-2xl border-black/5'}`}>
            {submitted ? (
              <div className="text-center py-20 animate-enter">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl serif mb-4 italic">Message Received</h3>
                <p className="text-gray-500 text-[10px] tracking-widest uppercase font-mono">Transmission Successful. Initializing response.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className={`mt-12 text-[10px] uppercase tracking-widest border-b pb-1 transition-all duration-500 hover:tracking-[0.2em] ${isDarkMode ? 'border-white/20 hover:text-white' : 'border-black/20 hover:text-black'}`}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-mono">// NAME</label>
                    <input
                      required
                      type="text"
                      value={formState.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      className={`w-full bg-transparent border-b py-3 focus:outline-none transition-all duration-500 font-light text-sm ${errors.name ? 'border-red-500/50 text-red-500 focus:border-red-500' : isDarkMode ? 'border-white/10 focus:border-white' : 'border-black/10 focus:border-black'}`}
                      placeholder="IDENTIFY"
                    />
                    {errors.name && <p className="absolute -bottom-6 left-0 text-[8px] font-mono tracking-widest text-red-500">{errors.name}</p>}
                  </div>
                  <div className="relative group">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-mono">// EMAIL</label>
                    <input
                      required
                      type="email"
                      value={formState.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={`w-full bg-transparent border-b py-3 focus:outline-none transition-all duration-500 font-light text-sm ${errors.email ? 'border-red-500/50 text-red-500 focus:border-red-500' : isDarkMode ? 'border-white/10 focus:border-white' : 'border-black/10 focus:border-black'}`}
                      placeholder="CONTACT_STUB"
                    />
                    {errors.email && <p className="absolute -bottom-6 right-0 text-[8px] font-mono tracking-widest text-red-500 text-right">{errors.email}</p>}
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-mono">// PARAMETER</label>
                  <input
                    required
                    type="text"
                    value={formState.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    onBlur={() => handleBlur('subject')}
                    className={`w-full bg-transparent border-b py-3 focus:outline-none transition-all duration-500 font-light text-sm ${errors.subject ? 'border-red-500/50 text-red-500 focus:border-red-500' : isDarkMode ? 'border-white/10 focus:border-white' : 'border-black/10 focus:border-black'}`}
                    placeholder="SUBJECT_SCOPE"
                  />
                  {errors.subject && <p className="absolute -bottom-6 left-0 text-[8px] font-mono tracking-widest text-red-500">{errors.subject}</p>}
                </div>

                <div className="relative group">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-mono">// PAYLOAD</label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    onBlur={() => handleBlur('message')}
                    className={`w-full bg-transparent border-b py-3 focus:outline-none transition-all duration-500 font-light text-sm resize-none ${errors.message ? 'border-red-500/50 text-red-500 focus:border-red-500' : isDarkMode ? 'border-white/10 focus:border-white' : 'border-black/10 focus:border-black'}`}
                    placeholder="DESCRIBE_VISION"
                  />
                  {errors.message && <p className="absolute -bottom-6 right-0 text-[8px] font-mono tracking-widest text-red-500 text-right">{errors.message}</p>}
                </div>

                <button
                  disabled={isSubmitting}
                  className={`w-full py-6 rounded-xl font-bold text-[10px] tracking-[0.5em] uppercase transition-all duration-500 flex items-center justify-center space-x-4 ${
                    isSubmitting ? 'bg-zinc-900 text-zinc-600' : isDarkMode ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'
                  }`}
                >
                  <span className="relative z-10">{isSubmitting ? 'UPLOADING...' : 'INITIATE_CONTACT'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
