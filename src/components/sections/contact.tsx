'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { contactSchema } from '@/lib/validations';

export function Contact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || 'Invalid input');
      return;
    }
    setLoading(true);
    // In production, this would send to Supabase or an email service
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  };

  return (
    <section className="section-padding">
      <div className="container-max">
        <SectionHeading
          eyebrow="Contact"
          title="Get in Touch"
          subtitle="Have a question or want to collaborate? We'd love to hear from you."
          center
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <Reveal>
            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email', value: 'hello@lumina.media', href: 'mailto:hello@lumina.media' },
                { icon: MapPin, label: 'Location', value: 'Available Worldwide', href: null },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-brand-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="font-medium text-gray-900 dark:text-white hover:text-brand-500 transition-colors">{item.value}</a>
                    ) : (
                      <div className="font-medium text-gray-900 dark:text-white">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
              <Input label="Name" name="name" placeholder="Your name" required />
              <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
              <Textarea label="Message" name="message" rows={5} placeholder="Tell us what you're thinking..." required />
              <Button type="submit" disabled={loading} className="w-full group">
                {loading ? 'Sending...' : 'Send Message'}
                {!loading && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
