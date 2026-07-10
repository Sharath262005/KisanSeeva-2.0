import {
  ShieldCheck,
  CloudSun,
  MapPinned,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={50} />,
    title: "Verified Providers",
    desc: "Trusted and verified agricultural service providers.",
  },
  {
    icon: <CloudSun size={50} />,
    title: "Weather Recommendations",
    desc: "Get weather-aware farming suggestions.",
  },
  {
    icon: <MapPinned size={50} />,
    title: "Nearby Services",
    desc: "Locate providers around your village.",
  },
  {
    icon: <Bell size={50} />,
    title: "Real-Time Notifications",
    desc: "Track booking updates instantly.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-white"
    >

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center mb-5">
          Why Choose KisanSeeva?
        </h2>

        <p className="text-center text-gray-600 mb-16">
          Making agriculture smarter, faster and easier.
        </p>

        <div className="grid md:grid-cols-2 gap-10">

          {features.map((feature) => (

            <div
              key={feature.title}
              className="bg-slate-50 rounded-3xl shadow-lg p-10 hover:shadow-xl transition"
            >

              <div className="text-green-700 mb-6">
                {feature.icon}
              </div>

              <h3 className="text-3xl font-bold mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-600 text-lg">
                {feature.desc}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Features;