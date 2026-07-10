import {
  Tractor,
  Wheat,
  Truck,
  Sprout,
  Droplets,
  Combine,
} from "lucide-react";

const services = [
  {
    icon: <Tractor size={45} />,
    title: "Tractor Service",
    desc: "Book tractors instantly near your village.",
  },
  {
    icon: <Combine size={45} />,
    title: "Harvesting",
    desc: "Professional harvesting machines.",
  },
  {
    icon: <Droplets size={45} />,
    title: "Drone Spraying",
    desc: "Smart pesticide spraying services.",
  },
  {
    icon: <Sprout size={45} />,
    title: "Rotavator",
    desc: "Land preparation made easy.",
  },
  {
    icon: <Truck size={45} />,
    title: "Transport",
    desc: "Crop transportation solutions.",
  },
  {
    icon: <Wheat size={45} />,
    title: "Cultivation",
    desc: "Complete cultivation support.",
  },
];

function Services() {
  return (
    <section
      id="services"
      className="py-24 bg-green-50"
    >

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center mb-5">
          Popular Services
        </h2>

        <p className="text-center text-gray-600 mb-16">
          Book trusted agricultural services in minutes.
        </p>

        <div className="grid md:grid-cols-3 gap-10">

          {services.map((service) => (

            <div
              key={service.title}
              className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition"
            >

              <div className="text-green-700 mb-6">
                {service.icon}
              </div>

              <h3 className="text-2xl font-bold mb-3">
                {service.title}
              </h3>

              <p className="text-gray-600">
                {service.desc}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Services;