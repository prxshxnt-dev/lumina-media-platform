'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';
import { newsletterSchema } from '@/lib/validations';
import { useSupabase } from '@/hooks/use-supabase';

export function Newsletter() {
  const supabase = useSupabase();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const parsed = newsletterSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || 'Invalid email');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('newsletter').insert({ email: parsed.data.email });
    if (error) {
      if (error.code === '23505') toast.error("You're already subscribed!");
      else toast.error('Something went wrong. Please try again.');
    } else {
      toast.success("Subscribed! Welcome aboard.");
      setDone(true);
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <section className="section-padding">
      <div className="container-max">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden p-8 md:p-16 text-center">
            <div className="absolute inset-0 gradient-bg opacity-90" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative z-10">
              <div className="inline-flex w-16 h-16 rounded-2xl glass-strong items-center justify-center mb-6">
                {done ? <CheckCircle className="w-8 h-8 text-white" /> : <Mail className="w-8 h-8 text-white" />}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {done ? "You're In!" : 'Stay in the Loop'}
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                {done ? "You'll be the first to know about new content and exclusive features." : 'Subscribe to get the latest uploads, exclusive content, and updates delivered to your inbox.'}
              </p>
              {!done && (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="flex-1 h-12 px-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <Button type="submit" disabled={loading} className="bg-white text-brand-600 hover:bg-white/90 h-12 px-6">
                    {loading ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
