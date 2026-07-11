import React, { useEffect, useState } from "react";
import { TrendingUp, Clock, User, ArrowRight, Heart, Share2, Bookmark, ChevronDown, Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/logo.svg';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const data = [
      {
        id: 1,
        title: "Elon Musk's Journey to Mars",
        author: "Tech Guru",
        category: "Technology",
        date: "2025-01-10",
        image: "https://images.pexels.com/photos/586056/pexels-photo-586056.jpeg?auto=compress&cs=tinysrgb&w=800",
        content: "Elon Musk revolutionized the electric car and space industries, founding Tesla and SpaceX to make humanity a multi-planetary species.",
        readTime: "5 min read",
        likes: 234,
      },
      {
        id: 2,
        title: "The Revolutionary Life of Marie Curie",
        author: "Science Enthusiast",
        category: "Science",
        date: "2025-02-15",
        image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800",
        content: "Marie Curie was the first woman to win a Nobel Prize, pioneering radioactivity research that changed science forever.",
        readTime: "7 min read",
        likes: 189,
      },
      {
        id: 3,
        title: "Steve Jobs: The Design Revolutionary",
        author: "Tech Historian",
        category: "Technology",
        date: "2025-03-05",
        image: "https://www.investopedia.com/thmb/hOCO5HspX1CE6TKQYRRgh0eooC8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-690815-59e6564f685fbe0011fc0e0f.jpg",
        content: "Steve Jobs co-founded Apple and transformed how we interact with technology through revolutionary design thinking.",
        readTime: "6 min read",
        likes: 321,
      },
    ];

    setTimeout(() => {
      setBlogs(data);
      setLoading(false);
    }, 800);
  }, []);

  const categories = ["All", "Technology", "Science", "Entertainment", "Art", "Health", "Lifestyle"];

  const filteredBlogs = activeCategory === 'All'
    ? blogs
    : blogs.filter(blog => blog.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1F2937] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-[#6B7280] tracking-wide">Loading stories…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1F2937]">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#FAFAF9]/95 backdrop-blur-sm border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={logo}
              alt="BlogNow"
              className="h-8 w-8 object-cover rounded-full border border-[#E5E7EB]"
            />
            <span className="text-lg font-semibold tracking-tight text-[#111827]">
              BlogNow
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-8 text-sm font-medium items-center">
            <Link to="/" className="text-[#374151] hover:text-[#111827] transition-colors">Home</Link>

            {isAuthenticated ? (
              <>
                <Link to="/myblogs" className="text-[#374151] hover:text-[#111827] transition-colors">
                  My Blogs
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 border border-[#E5E7EB] px-3 py-1.5 rounded-full hover:border-[#D1D5DB] hover:bg-[#F9FAFB] transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-semibold">
                      {(user?.name || "U").charAt(0).toUpperCase()}
                    </span>
                    <span className="text-[#374151]">{user?.name || "User"}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#9CA3AF] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 overflow-hidden">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[#374151] hover:text-[#111827] transition-colors">Login</Link>
                <Link
                  to="/signup"
                  className="bg-[#111827] text-white px-4 py-2 rounded-full hover:bg-[#1F2937] transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-[#374151]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5E7EB] px-6 py-4 flex flex-col gap-3 text-sm font-medium">
            <Link to="/" className="text-[#374151]" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/myblogs" className="text-[#374151]" onClick={() => setMobileMenuOpen(false)}>My Blogs</Link>
                <Link to="/profile" className="text-[#374151]" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left text-[#DC2626]">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[#374151]" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="text-[#374151]" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#6366F1] uppercase mb-4">
          Stories worth your time
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#111827] mb-6 leading-[1.1]">
          Ideas from people who
          <br className="hidden md:block" /> changed the world
        </h1>
        <p className="text-base md:text-lg text-[#6B7280] max-w-2xl mx-auto mb-8 leading-relaxed">
          Long-form profiles and essays on the visionaries, scientists, and builders
          who shaped how we live today.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {!isAuthenticated && (
            <Link to="/signup">
              <button className="group bg-[#111827] text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-[#1F2937] transition-colors flex items-center gap-2">
                Start reading
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          )}
          <button className="border border-[#E5E7EB] px-6 py-3 rounded-full font-medium text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2 justify-center">
            <TrendingUp className="w-4 h-4" /> Trending now
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex justify-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === cat
                  ? "bg-[#111827] text-white border-[#111827]"
                  : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Blog Row */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-[#111827]">
            Featured
          </h2>
          <span className="text-sm text-[#9CA3AF]">{filteredBlogs.length} stories</span>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-4 -mx-6 px-6 scrollbar-hide">
          {filteredBlogs.slice(0, 3).map((blog) => (
            <article
              key={blog.id}
              className="group min-w-[320px] max-w-[320px] bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-md transition-all duration-200"
            >
              <div className="relative overflow-hidden h-44">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
                    <Heart className="w-3.5 h-3.5 text-[#374151]" />
                  </button>
                  <button className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
                    <Bookmark className="w-3.5 h-3.5 text-[#374151]" />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3 text-xs text-[#6B7280]">
                  <span className="font-medium text-[#4F46E5]">{blog.category}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {blog.readTime}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[#111827] mb-2 leading-snug group-hover:text-[#4F46E5] transition-colors">
                  {blog.title}
                </h3>

                <p className="text-sm text-[#6B7280] mb-4 leading-relaxed line-clamp-2">
                  {blog.content}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-[#6B7280]">
                    <User className="w-3.5 h-3.5" /> {blog.author}
                  </span>
                  <span className="flex items-center gap-1 text-[#9CA3AF]">
                    <Heart className="w-3.5 h-3.5" /> {blog.likes}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Latest Stories Grid */}
      <div className="max-w-6xl mx-auto px-6 py-10 pb-20">
        <h2 className="text-2xl font-semibold tracking-tight text-[#111827] mb-6">
          Latest
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="relative overflow-hidden h-40">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-[#374151] shadow-sm">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-semibold text-[#111827] mb-2 leading-snug group-hover:text-[#4F46E5] transition-colors">
                  {blog.title}
                </h3>
                <p className="text-sm text-[#6B7280] mb-4 leading-relaxed line-clamp-2">
                  {blog.content}
                </p>

                <div className="mt-auto">
                  <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-4">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {blog.author}
                    </span>
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 text-[#6B7280] hover:text-[#DC2626] transition-colors text-sm">
                        <Heart className="w-3.5 h-3.5" /> {blog.likes}
                      </button>
                      <button className="text-[#6B7280] hover:text-[#111827] transition-colors">
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors flex items-center gap-1">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h3 className="text-lg font-semibold text-[#111827] mb-2">
            Stay in the loop
          </h3>
          <p className="text-sm text-[#6B7280] mb-6">
            Get new stories in your inbox. No noise, unsubscribe anytime.
          </p>

          <div className="flex justify-center gap-4 mb-8 text-sm text-[#6B7280]">
            <a href="#" className="hover:text-[#111827] transition-colors">Twitter</a>
            <a href="#" className="hover:text-[#111827] transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-[#111827] transition-colors">GitHub</a>
          </div>

          <p className="text-xs text-[#9CA3AF]">
            © 2025 BlogNow. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}