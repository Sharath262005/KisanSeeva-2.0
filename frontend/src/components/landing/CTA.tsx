import { useNavigate } from "react-router-dom";
import { KSButton } from "../ui";
import { motion } from "framer-motion";

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-br from-green-800 to-emerald-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-green-700/50 via-transparent to-transparent"></div>
      
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Ready to Transform Your Farming Experience?
          </h2>
          <p className="text-green-100 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Join thousands of smart farmers and verified equipment owners today. Register in less than 2 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <KSButton
              onClick={() => navigate("/register?role=farmer")}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-8 py-4 text-lg w-full sm:w-auto"
            >
              🌾 Register as Farmer
            </KSButton>
            
            <KSButton
              onClick={() => navigate("/register?role=provider")}
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg w-full sm:w-auto"
            >
              🚜 Register as Provider
            </KSButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;
