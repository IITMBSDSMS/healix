"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { 
  Stethoscope, FlaskConical, Pill, Calendar, CheckCircle, Heart, 
  Search, Shield, Activity, TrendingUp, ChevronRight, X, User, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { bookAppointment } from "./actions";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { id: "doctor", name: "Consult Doctor", icon: Stethoscope, color: "text-[#eab308]", bg: "bg-[#eab308]/15" },
  { id: "lab", name: "Lab Tests", icon: FlaskConical, color: "text-[#ca8a04]", bg: "bg-[#ca8a04]/15" },
  { id: "medicine", name: "Medicines", icon: Pill, color: "text-[#eab308]", bg: "bg-[#eab308]/15" },
  { id: "ayurveda", name: "Ayurveda", icon: Shield, color: "text-[#ca8a04]", bg: "bg-[#ca8a04]/15" },
  { id: "devices", name: "Health Devices", icon: Activity, color: "text-[#eab308]", bg: "bg-[#eab308]/15" },
];

const trendingMedicines = [
  { name: "Shelcal 500 Tablet", price: "₹119", desc: "Calcium Supplement", img: "💊" },
  { name: "Dolo 650 Tablet", price: "₹30", desc: "Pain Relief", img: "💊" },
  { name: "Supradyn Daily", price: "₹55", desc: "Multivitamins", img: "💊" },
  { name: "Pan 40 Tablet", price: "₹150", desc: "Acidity & Ulcer", img: "💊" },
  { name: "Evion 400mg Capsule", price: "₹35", desc: "Vitamin E", img: "💊" },
];

const popularChecks = [
  { name: "Comprehensive Full Body Checkup", price: "₹1,499", oldPrice: "₹2,999", parameters: 85, img: "🧪" },
  { name: "Advanced Heart Care Profile", price: "₹999", oldPrice: "₹1,500", parameters: 20, img: "❤️" },
  { name: "Women's Wellness Package", price: "₹1,299", oldPrice: "₹2,500", parameters: 60, img: "🧬" },
  { name: "Diabetes Screening Panel", price: "₹499", oldPrice: "₹800", parameters: 12, img: "🩸" },
];

export default function CarePage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("doctor");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openBooking = (serviceId: string) => {
    setSelectedService(serviceId);
    setSuccess(false);
    setError(null);
    setIsBookingModalOpen(true);
  };

  async function handleBooking(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    formData.append("type", selectedService);
    const result = await bookAppointment(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Header / Hero Section */}
      <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-gradient-to-b from-[#111] to-[#050505] overflow-hidden">
        
        {/* Animated Background Waves */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[600px] h-[600px] rounded-full border border-primary/30"
          />
          <motion.div
            animate={{ scale: [1.2, 1.5, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute w-[800px] h-[800px] rounded-full border border-primary/20"
          />
          <motion.div
            animate={{ scale: [1.5, 1.8, 1.5], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute w-[1000px] h-[1000px] rounded-full border border-primary/10"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 shadow-lg shadow-white/5">
              <Image src="/care-logo-new.png" alt="Healix Care" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold">Healix Care Portal</h1>
          </div>
          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mb-12">
            Your one-stop destination for medicines, lab tests, and expert doctor consultations.
          </p>

          {/* Search Bar */}
          <div className="w-full relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-white/40 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-full pl-14 pr-32 py-5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xl placeholder:text-white/30 text-lg sm:text-xl"
              placeholder="Search for Medicines, Lab Tests, Doctors..."
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <Button className="rounded-full px-8 py-3 h-auto font-semibold">Search</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        
        {/* Quick Categories */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <GlassCard 
                  key={cat.id} 
                  className="cursor-pointer hover:bg-white/10 transition-all flex flex-col items-center justify-center text-center py-8 group"
                  onClick={() => openBooking(cat.id === 'doctor' || cat.id === 'lab' || cat.id === 'medicine' ? cat.id : 'doctor')}
                >
                  <div className={`${cat.bg} p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-8 w-8 ${cat.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm">{cat.name}</h3>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* Promotional Banner */}
        <section>
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-[#eab308]/20 shadow-[0_0_40px_rgba(234,179,8,0.1)] bg-gradient-to-r from-[#ca8a04]/20 via-[#eab308]/10 to-[#050505]">
            <div className="relative z-10 max-w-xl">
              <span className="inline-block py-1 px-3 rounded-full bg-[#eab308]/20 text-[#eab308] text-xs font-bold tracking-wider mb-4 border border-[#eab308]/30 uppercase">
                Limited Time Offer
              </span>
              <h2 className="text-3xl font-bold mb-4 leading-tight">Get 20% Off on Full Body Checkups</h2>
              <p className="text-white/70 mb-8">
                Early detection saves lives. Book a comprehensive health screen today with free home sample collection.
              </p>
              <Button onClick={() => openBooking('lab')} className="rounded-xl flex items-center gap-2">
                Book Now <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="absolute right-10 bottom-0 opacity-10 md:opacity-30 transform translate-y-10 md:translate-y-0">
              <Activity className="w-64 h-64 text-[#eab308]" strokeWidth={1} />
            </div>
          </div>
        </section>

        {/* Featured Popular Checks */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-[#eab308]" />
              Popular Health Checks
            </h2>
            <span className="text-white/50 text-sm font-medium flex items-center cursor-not-allowed" title="More packages coming soon">
              View All <ChevronRight className="h-4 w-4" />
            </span>
          </div>
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x hide-scrollbar">
            {popularChecks.map((check, i) => (
              <GlassCard key={i} className="min-w-[280px] max-w-[320px] flex-shrink-0 snap-start flex flex-col justify-between p-6">
                <div>
                  <div className="text-5xl mb-6">{check.img}</div>
                  <h3 className="font-semibold text-lg mb-2 leading-tight min-h-[3.5rem]">{check.name}</h3>
                  <p className="text-xs text-white/50 mb-6 bg-white/5 py-1.5 px-3 rounded-full w-fit border border-white/5">
                    Includes {check.parameters} parameters
                  </p>
                </div>
                <div className="mt-auto">
                  <div className="flex items-end gap-3 mb-5">
                    <span className="text-2xl font-bold text-white leading-none">{check.price}</span>
                    <span className="text-sm text-white/40 line-through mb-0.5">{check.oldPrice}</span>
                  </div>
                  <Button onClick={() => openBooking('lab')} variant="outline" className="w-full rounded-xl">Add to Cart</Button>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Trending Medicines */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-[#eab308]" />
              Trending Medicines
            </h2>
            <span className="text-white/50 text-sm font-medium flex items-center cursor-not-allowed" title="More medicines coming soon">
              View All <ChevronRight className="h-4 w-4" />
            </span>
          </div>
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x hide-scrollbar">
            {trendingMedicines.map((med, i) => (
              <GlassCard key={i} className="min-w-[220px] flex-shrink-0 snap-start flex flex-col justify-between p-5">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center text-4xl mb-5 shadow-inner">
                    {med.img}
                  </div>
                  <h3 className="font-semibold mb-1 truncate text-base">{med.name}</h3>
                  <p className="text-xs text-white/50 mb-5">{med.desc}</p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-xl font-bold">{med.price}</span>
                  <button onClick={() => openBooking('medicine')} className="text-primary hover:text-white bg-primary/10 hover:bg-primary rounded-xl p-2.5 transition-colors shadow-sm">
                    <CheckCircle className="h-5 w-5" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] p-4"
            >
              <GlassCard className="relative overflow-hidden border border-white/20 shadow-2xl">
                <button 
                  onClick={() => setIsBookingModalOpen(false)}
                  className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Request Booking
                </h2>

                {success ? (
                  <div className="text-center py-8">
                    <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
                    <p className="text-white/60 mb-6">Your request has been successfully submitted. We will contact you shortly.</p>
                    <Button onClick={() => setIsBookingModalOpen(false)} className="w-full">Done</Button>
                  </div>
                ) : (
                  <form action={handleBooking} className="space-y-4">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl mb-6">
                      <p className="text-xs text-white/50 mb-1">Selected Service</p>
                      <p className="font-medium flex items-center gap-2">
                        {selectedService === "doctor" && <Stethoscope className="h-4 w-4 text-[#eab308]" />}
                        {selectedService === "lab" && <FlaskConical className="h-4 w-4 text-[#ca8a04]" />}
                        {selectedService === "medicine" && <Pill className="h-4 w-4 text-[#eab308]" />}
                        {categories.find(c => c.id === selectedService)?.name || "Doctor Consultation"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1" htmlFor="date">
                        Preferred Date & Time
                      </label>
                      <input
                        id="date"
                        name="date"
                        type="datetime-local"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors [color-scheme:dark]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1" htmlFor="notes">
                        Additional Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                        placeholder="Any specific requirements or prescriptions?"
                      />
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <div className="pt-4">
                      <Button type="submit" className="w-full" isLoading={loading}>
                        Confirm Request
                      </Button>
                    </div>
                  </form>
                )}
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
