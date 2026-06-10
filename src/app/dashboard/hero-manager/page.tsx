"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Plus, Trash2, Image as ImageIcon, Video, UploadCloud } from "lucide-react";

export default function HeroManagerPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_banners")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, media_url: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    
    try {
      // If it's a Supabase storage URL, we should ideally delete the file too,
      // but for simplicity we just delete the database record.
      const { error } = await supabase
        .from("hero_banners")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner.");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image or video file.");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `hero-banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public_media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public_media')
        .getPublicUrl(filePath);

      // 3. Determine Type
      const isVideo = file.type.startsWith("video/");
      const type = isVideo ? "video" : "image";

      // 4. Insert into Database
      const { error: dbError } = await supabase
        .from('hero_banners')
        .insert([
          {
            title,
            subtitle,
            media_url: publicUrl,
            type,
            order_index: banners.length + 1
          }
        ]);

      if (dbError) throw dbError;

      // Reset form & refresh
      setTitle("");
      setSubtitle("");
      setFile(null);
      alert("Banner uploaded successfully!");
      fetchBanners();
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("Error uploading banner: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Hero Banner Manager</h1>
        <p className="text-white/60">Upload and manage videos/images for the homepage carousel.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UploadCloud className="text-[#eab308]" /> Add New Banner
            </h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Title <span className="text-white/30 text-xs font-normal">(optional)</span></label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#eab308] transition-colors"
                  placeholder="e.g. Next-Gen Research — leave blank for image-only"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Subtitle <span className="text-white/30 text-xs font-normal">(optional)</span></label>
                <input 
                  type="text" 
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#eab308] transition-colors"
                  placeholder="e.g. Empowering the future..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Media File (Image or Video)</label>
                <input 
                  type="file" 
                  accept="image/*,video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#eab308]/20 file:text-[#eab308] hover:file:bg-[#eab308]/30 transition-colors"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={uploading}
                className="w-full mt-4 bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                {uploading ? "Uploading..." : "Upload Banner"}
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Existing Banners List */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6 h-full">
            <h2 className="text-xl font-bold mb-6">Active Banners</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-[#eab308]" />
              </div>
            ) : banners.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-white/40">
                <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                <p>No banners found. Upload one to get started.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {banners.map((banner) => (
                  <motion.div 
                    key={banner.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-xl hover:bg-black/60 transition-colors"
                  >
                    <div className="w-24 h-16 shrink-0 rounded-md overflow-hidden bg-black/50 flex items-center justify-center border border-white/10 relative">
                      {banner.type === 'video' ? (
                        <>
                          <Video className="w-6 h-6 text-white/50 absolute z-10" />
                          <video src={banner.media_url} className="w-full h-full object-cover opacity-50" />
                        </>
                      ) : (
                        <img src={banner.media_url} alt={banner.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate">{banner.title}</h3>
                      <p className="text-sm text-white/50 truncate">{banner.subtitle}</p>
                    </div>

                    <button 
                      onClick={() => handleDelete(banner.id, banner.media_url)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
