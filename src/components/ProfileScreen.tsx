import React, { useState, useEffect } from 'react';
import { User, Wallet, MessageSquare, History, LogOut, ChevronRight, Edit, Moon, Sun, Settings, Sparkles, Users, Clock, Menu, X, Grid, Heart, MessageCircle, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId } from '../utils/supabase/info';
import EditProfileModal from './EditProfileModal';
import PrayerTimesSettingsModal from './PrayerTimesSettingsModal';
import { IslamicPattern, MosqueIcon } from './IslamicPattern';

interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
  member_since: string;
  wallet_balance: number;
  mosque?: string;
  avatar_url?: string;
  bio?: string;
}

export default function ProfileScreen({ 
  session, 
  onNavigate,
  onLogout,
  darkMode,
  onToggleDarkMode 
}: { 
  session: any;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPrayerTimesSettingsModal, setShowPrayerTimesSettingsModal] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');

  useEffect(() => {
    if (session) {
      fetchProfile();
      fetchUserPosts();
      getBookmarkedPosts().then(setBookmarkedPosts);
    }
  }, [session, activeTab]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4319e602/api/profile`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      if (!session) return;
      
      // Fetch user posts from API
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4319e602/api/timeline/user/${session.user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setUserPosts(data);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const getBookmarkedPosts = async () => {
    try {
      if (!session) return [];
      
      // Fetch bookmarked posts from API
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4319e602/api/timeline/bookmarks/list`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching bookmarked posts:', error);
      return [];
    }
  };

  const [bookmarkedPosts, setBookmarkedPosts] = React.useState<any[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-pink-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-6">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <IslamicPattern className="text-purple-600 dark:text-purple-400 opacity-[0.02]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700/50 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Selamat Datang</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Daftar atau masuk untuk mengakses fitur lengkap jamaah.net
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('auth')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Daftar / Masuk
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Stats calculation
  const totalConnections = 0; // Would be from API
  const totalPosts = userPosts.length;
  const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <IslamicPattern className="text-purple-600 dark:text-purple-400 opacity-[0.015]" />
      </div>

      {/* Top Bar - Instagram Style */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold dark:text-white">{profile?.name || session.user.email}</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSettingsMenu(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6 dark:text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* Profile Section - Instagram Style */}
      <div className="relative z-10 px-6 pt-6">
        {/* Avatar and Stats */}
        <div className="flex items-center gap-6 mb-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gradient-to-br from-purple-500 to-pink-500 p-0.5 bg-gradient-to-br from-purple-500 to-pink-500">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center">
                    <User className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-3 gap-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-xl font-bold dark:text-white">{totalPosts}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Postingan</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-center cursor-pointer"
              onClick={() => onNavigate('connections')}
            >
              <div className="text-xl font-bold dark:text-white">{totalConnections}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Koneksi</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-xl font-bold dark:text-white">{totalLikes}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Likes</div>
            </motion.div>
          </div>
        </div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-4"
        >
          <h2 className="font-semibold dark:text-white mb-1">{profile?.name}</h2>
          {profile?.bio && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{profile.bio}</p>
          )}
          {profile?.mosque && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MosqueIcon className="w-4 h-4" />
              <span>{profile.mosque}</span>
            </div>
          )}
          {profile?.role && (
            <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-300">
              <Sparkles className="w-3 h-3" />
              {profile.role}
            </div>
          )}
        </motion.div>

        {/* Edit Profile Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowEditModal(true)}
          className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-2 rounded-xl font-semibold text-sm mb-6 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Edit Profil
        </motion.button>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="border-t border-gray-200 dark:border-gray-800 flex"
        >
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-t-2 transition-colors ${
              activeTab === 'posts'
                ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                : 'border-transparent text-gray-400 dark:text-gray-500'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-t-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                : 'border-transparent text-gray-400 dark:text-gray-500'
            }`}
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Posts Grid - Instagram Style */}
      <div className="relative z-10 px-6 pb-24">
        {activeTab === 'posts' && (
          <>
            {userPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Grid className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Belum ada postingan
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mulai berbagi kegiatan ibadah Anda
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-3 gap-1 mt-1">
                {userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    onClick={() => onNavigate('timeline-detail', post)}
                    className="aspect-square cursor-pointer group relative overflow-hidden bg-gray-100 dark:bg-gray-800"
                  >
                    {post.image ? (
                      <>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <div className="flex items-center gap-1 text-white">
                            <Heart className="w-5 h-5" fill="white" />
                            <span className="font-semibold">{post.likes?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-white">
                            <MessageCircle className="w-5 h-5" fill="white" />
                            <span className="font-semibold">{post.comments?.length || 0}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center p-3">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 line-clamp-4 text-center">
                          {post.title}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'saved' && (
          <>
            {bookmarkedPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Belum ada postingan tersimpan
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Simpan postingan favorit Anda di sini
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-3 gap-1 mt-1">
                {bookmarkedPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    onClick={() => onNavigate('timeline-detail', post)}
                    className="aspect-square cursor-pointer group relative overflow-hidden bg-gray-100 dark:bg-gray-800"
                  >
                    {post.image ? (
                      <>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <div className="flex items-center gap-1 text-white">
                            <Heart className="w-5 h-5" fill="white" />
                            <span className="font-semibold">{post.likes?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-white">
                            <MessageCircle className="w-5 h-5" fill="white" />
                            <span className="font-semibold">{post.comments?.length || 0}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center p-3">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 line-clamp-4 text-center">
                          {post.title}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Settings Menu - Hamburger Style */}
      <AnimatePresence>
        {showSettingsMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettingsMenu(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Pengaturan</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSettingsMenu(false)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-white/80 text-sm">Kelola akun dan preferensi Anda</p>
              </div>

              {/* Menu Items */}
              <div className="p-4 space-y-2">
                {/* Dark Mode Toggle */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4"
                >
                  <button
                    onClick={onToggleDarkMode}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                        {darkMode ? (
                          <Moon className="w-5 h-5 text-white" />
                        ) : (
                          <Sun className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Mode Gelap</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {darkMode ? 'Aktif' : 'Nonaktif'}
                        </p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      darkMode ? 'bg-purple-600' : 'bg-gray-300'
                    } relative`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        darkMode ? 'translate-x-6' : ''
                      }`} />
                    </div>
                  </button>
                </motion.div>

                {/* Prayer Times */}
                <SettingsMenuItem
                  icon={Clock}
                  title="Waktu Sholat"
                  subtitle="Atur jadwal sholat"
                  gradient="from-emerald-500 to-teal-500"
                  onClick={() => {
                    setShowSettingsMenu(false);
                    setShowPrayerTimesSettingsModal(true);
                  }}
                  delay={0.15}
                />

                {/* Connections */}
                <SettingsMenuItem
                  icon={Users}
                  title="Koneksi"
                  subtitle="Kelola koneksi Anda"
                  gradient="from-blue-500 to-indigo-500"
                  onClick={() => {
                    setShowSettingsMenu(false);
                    onNavigate('connections');
                  }}
                  delay={0.2}
                />

                {/* Wallet */}
                <SettingsMenuItem
                  icon={Wallet}
                  title="Dompet Digital"
                  subtitle={formatPrice(profile?.wallet_balance || 0)}
                  gradient="from-green-500 to-emerald-500"
                  onClick={() => {
                    setShowSettingsMenu(false);
                  }}
                  delay={0.25}
                />

                {/* Chat */}
                <SettingsMenuItem
                  icon={MessageSquare}
                  title="Kotak Masuk"
                  subtitle="Pesan dan chat"
                  gradient="from-cyan-500 to-blue-500"
                  onClick={() => {
                    setShowSettingsMenu(false);
                    onNavigate('chat-list');
                  }}
                  delay={0.3}
                />

                {/* History */}
                <SettingsMenuItem
                  icon={History}
                  title="Histori Transaksi"
                  subtitle="Riwayat transaksi"
                  gradient="from-orange-500 to-red-500"
                  onClick={() => {
                    setShowSettingsMenu(false);
                  }}
                  delay={0.35}
                />

                {/* Logout */}
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogout}
                  className="w-full bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 flex items-center gap-3 border-2 border-red-200 dark:border-red-800"
                >
                  <div className="bg-gradient-to-br from-red-500 to-pink-500 p-3 rounded-xl">
                    <LogOut className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-red-600 dark:text-red-400">Keluar</h3>
                    <p className="text-xs text-red-500 dark:text-red-400/80">Logout dari akun</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-red-400" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          session={session}
          currentProfile={profile}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchProfile();
          }}
        />
      )}

      {/* Prayer Times Settings Modal */}
      {showPrayerTimesSettingsModal && (
        <PrayerTimesSettingsModal
          isOpen={showPrayerTimesSettingsModal}
          onClose={() => setShowPrayerTimesSettingsModal(false)}
        />
      )}
    </div>
  );
}

function SettingsMenuItem({
  icon: Icon,
  title,
  subtitle,
  gradient,
  onClick,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  gradient: string;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <div className={`bg-gradient-to-br ${gradient} p-3 rounded-xl`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-left flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
    </motion.button>
  );
}