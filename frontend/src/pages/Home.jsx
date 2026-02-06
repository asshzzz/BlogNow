import React, { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Clock, User, Tag, ArrowRight, Heart, Share2, Bookmark, ChevronDown } from 'lucide-react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/logo.png';


export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
        gradient: "from-purple-500 via-pink-500 to-red-500"
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
        gradient: "from-cyan-500 via-blue-500 to-purple-500"
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
        gradient: "from-green-500 via-teal-500 to-cyan-500"
      },
    ];

    setTimeout(() => {
      setBlogs(data);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl font-bold text-white animate-pulse">Loading Amazing Content...</p>
        </div>
      </div>
    );
  }

  const categories = ["All", "Technology", "Science", "Entertainment", "Art", "Health", "Lifestyle"];

  const filteredBlogs = activeCategory === 'All' 
    ? blogs 
    : blogs.filter(blog => blog.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
   
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
         <Link to="/" className="flex items-center gap-3">
  <span className="inline-flex items-center justify-center rounded-full 
    border-2 border-gradient-to-r from-pink-400 via-purple-400 to-cyan-400
    bg-white/10 shadow-lg hover:scale-105 transition-transform duration-200
    p-1"
    style={{
      borderImage: 'linear-gradient(90deg,#ec4899,#a78bfa,#22d3ee) 1',
      boxShadow: '0 0 15px 3px rgba(236,72,153,.15)'
    }}
  >
    <img
      src={logo}
      alt="Logo"
      style={{
        height: '32px',
        width: '32px',
        objectFit: 'cover',
        borderRadius: '9999px',
      }}
    />
  </span>
  <span className="text-2xl font-black bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
    BlogNow
  </span>
</Link>



          {/* Menu Items */}
          {/* Menu Items */}
<div className="flex gap-6 text-white font-medium items-center">
  <Link to="/" className="hover:text-pink-400 transition">Home</Link>

  {isAuthenticated ? (
    <>
      {/* 👇 My Blogs link sirf login hone ke baad dikhega */}
      <Link to="/myblogs" className="hover:text-pink-400 transition">
        My Blogs
      </Link>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full hover:bg-white/20 transition"
        >
          <User className="w-5 h-5" />
          <span>{user?.name || "User"}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20">
            <Link 
              to="/profile" 
              className="block px-4 py-2 hover:bg-white/20 transition text-white"
              onClick={() => setDropdownOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                logout();
                setDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-white/20 transition text-red-400"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  ) : (
    <>
      <Link to="/login" className="hover:text-pink-400 transition">Login</Link>
      <Link to="/signup" className="hover:text-pink-400 transition">Signup</Link>
    </>
  )}
</div>

        </div>
      </nav>

   <div className="absolute inset-0 overflow-hidden">
  <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
  <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
  <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
</div>

{/* Hero Section */}
<div className="relative min-h-screen flex flex-col justify-center items-center text-white px-4">
  <div className="text-center z-10 max-w-4xl">
    <div className="flex justify-center mb-6">
      <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
    </div>

    <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-fade-in">
      BlogNow
    </h1>

    <p className="text-xl md:text-3xl mb-8 font-medium opacity-90 leading-relaxed">
      Discover extraordinary journeys of{" "}
      <span className="text-yellow-400 font-bold">visionaries</span>,{" "}
      <span className="text-pink-400 font-bold">innovators</span>, and{" "}
      <span className="text-cyan-400 font-bold">game-changers</span>
    </p>

<div className="flex flex-col sm:flex-row gap-4 justify-center">
  {!isAuthenticated && (   // 👈 yeh condition add kar
    <Link to="/signup">
      <button className="group bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-8 py-4 rounded-full font-bold text-lg hover:scale-110 transform transition-all duration-300 shadow-2xl hover:shadow-pink-500/50 relative overflow-hidden">
        <span className="relative z-10 flex items-center gap-2">
          Start Exploring{" "}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
    </Link>
  )}

  <button className="group border-2 border-white/30 backdrop-blur-sm px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 hover:scale-105 transform transition-all duration-300">
    <span className="flex items-center gap-2">
      <TrendingUp className="w-5 h-5" /> Trending Now
    </span>
  </button>
</div>

  </div>

  {/* Scroll Indicator */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
      <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
    </div>
  </div>
</div>

{/* Categories */}
<div className="relative z-10 flex justify-center gap-3 px-4 py-8 flex-wrap">
  {categories.map((cat, index) => (
    <button
      key={cat}
      onClick={() => setActiveCategory(cat)}
      className={`group relative px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
        activeCategory === cat
          ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-2xl shadow-pink-500/50"
          : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <span className="relative z-10">{cat}</span>
      {activeCategory === cat && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
      )}
    </button>
  ))}
</div>

{/* Featured Blog Carousel */}
<div className="relative z-10 px-4 py-12">
  <h2 className="text-4xl md:text-5xl font-black text-center mb-12 bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
    ✨ Featured Stories
  </h2>

  <div className="flex overflow-x-auto gap-8 pb-6 scrollbar-hide px-4">
    {filteredBlogs.slice(0, 3).map((blog, index) => (
      <div
        key={blog.id}
        className="group min-w-[350px] bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:-rotate-1 border border-white/20 shadow-2xl"
        style={{ animationDelay: `${index * 200}ms` }}
      >
        <div className="relative overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${blog.gradient} opacity-60 mix-blend-overlay`}
          ></div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <Heart className="w-4 h-4 text-white" />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <Bookmark className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${blog.gradient} text-white`}
            >
              {blog.category}
            </span>
            <span className="text-white/70 text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" /> {blog.readTime}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
            {blog.title}
          </h3>

          <p className="text-white/80 mb-4 text-sm leading-relaxed">
            {blog.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <User className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-pink-400 text-sm">
                <Heart className="w-4 h-4" /> {blog.likes}
              </span>
              <button className="bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-2 rounded-full text-sm font-bold text-white hover:from-pink-600 hover:to-violet-600 transition-all transform hover:scale-105">
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

{/* Recent Blogs Masonry */}
<div className="relative z-10 px-4 py-12">
  <h2 className="text-4xl md:text-5xl font-black text-center mb-12 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
    🔥 Latest Stories
  </h2>

  <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
    {filteredBlogs.map((blog, index) => (
      <div
        key={blog.id}
        className="group break-inside-avoid bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-500 transform hover:scale-105 border border-white/20 shadow-2xl"
        style={{ animationDelay: `${index * 150}ms` }}
      >
        <div className="relative overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${blog.gradient} opacity-60 mix-blend-overlay`}
          ></div>
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${blog.gradient} text-white shadow-lg`}
            >
              {blog.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors leading-tight">
            {blog.title}
          </h3>
          <p className="text-white/80 mb-4 text-sm leading-relaxed">
            {blog.content}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="text-white/60 text-sm">
              <div className="flex items-center gap-1 mb-1">
                <User className="w-3 h-3" /> <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> <span>{blog.readTime}</span>
              </div>
            </div>
            <div className="text-white/70 text-xs">
              {new Date(blog.date).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 text-pink-400 hover:text-pink-300 transition-colors">
                <Heart className="w-4 h-4" />{" "}
                <span className="text-sm">{blog.likes}</span>
              </button>
              <button className="text-white/60 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2 rounded-full text-sm font-bold text-white hover:from-cyan-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg">
              Read More
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

{/* Enhanced Footer */}
<footer className="relative z-10 mt-20 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white py-12">
  <div className="max-w-6xl mx-auto px-4">
    <div className="text-center mb-8">
      <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
        Stay Connected
      </h3>
      <p className="text-white/70 mb-6">
        Join our community of story lovers and never miss an inspiring tale.
      </p>

      <div className="flex justify-center gap-4 mb-6">
        <button className="group p-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full hover:scale-110 transform transition-all duration-300 shadow-lg">
          <span className="block w-6 h-6 bg-white group-hover:bg-gray-100 transition-colors"></span>
        </button>
        <button className="group p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full hover:scale-110 transform transition-all duration-300 shadow-lg">
          <span className="block w-6 h-6 bg-white group-hover:bg-gray-100 transition-colors"></span>
        </button>
        <button className="group p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:scale-110 transform transition-all duration-300 shadow-lg">
          <span className="block w-6 h-6 bg-white group-hover:bg-gray-100 transition-colors"></span>
        </button>
      </div>
    </div>

    <div className="text-center text-white/60 text-sm">
      <p>© 2025 Inspiring Stories. Made with 💖 for storytellers everywhere.</p>
    </div>
  </div>
</footer>

<style jsx>{`
  @keyframes blob {
    0%, 100% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fade-in 1s ease-out;
  }
`}</style>

    </div>
  );
}
