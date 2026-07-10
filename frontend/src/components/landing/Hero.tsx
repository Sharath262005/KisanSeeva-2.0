import { motion } from "framer-motion";
import { KSButton } from "../ui";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-100/40 via-transparent to-transparent"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center px-6 py-24 relative z-10">

        {/* Left */}

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

          <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            🌾 India's Smart Agriculture Platform
          </span>

          <h1 className="text-6xl font-extrabold leading-tight tracking-tight">

            Book Agricultural

            <span className="text-green-700">

              {" "}Services

            </span>

            <br />

            Within Minutes

          </h1>

          <p className="mt-8 text-lg text-gray-600 leading-8">

            Find trusted tractor owners, harvesting machines,
            drone spraying, rotavators and transport services
            around your village.

          </p>

          <div className="mt-10 flex gap-5">

            <KSButton 
              onClick={() => navigate("/login")}
              className="bg-green-700 text-white px-8 py-4 rounded-xl hover:bg-green-800 transition shadow-lg"
            >
              🚜 Book Service
            </KSButton>
            <KSButton 
              onClick={() => navigate("/register")}
              variant="outline"
              className="border-green-700 text-green-700 px-8 py-4 rounded-xl hover:bg-green-100 transition"
            >
              Become Provider
            </KSButton>

          </div>

        </motion.div>

        {/* Right */}

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900"
            alt="Agriculture"
            className="rounded-3xl shadow-2xl"
          />

        </motion.div>

      </div>

    </section>
  );
}

export default Hero;