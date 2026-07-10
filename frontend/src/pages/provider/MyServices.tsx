import { useState } from "react";
import { Plus, Tractor, Edit2, Trash2, Combine, Droplets } from "lucide-react";
import { KSCard, KSButton, KSModal, KSBadge } from "../../components/ui";

const initialServices = [
  { id: 1, name: "John Deere 5050D Tractor", type: "Tractor Service", rate: "₹800/hour", status: "active", icon: <Tractor size={24} /> },
  { id: 2, name: "Kubota Harvester DC-68G", type: "Harvesting", rate: "₹2,500/acre", status: "active", icon: <Combine size={24} /> },
];

const MyServices = () => {
  const [services, setServices] = useState(initialServices);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("Tractor Service");
  const [rate, setRate] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rate) return;

    const newService = {
      id: Date.now(),
      name,
      type,
      rate,
      status: "active",
      icon: type === "Harvesting" ? <Combine size={24} /> : type === "Drone Spraying" ? <Droplets size={24} /> : <Tractor size={24} />,
    };

    setServices([...services, newService]);
    setIsOpen(false);
    setName("");
    setRate("");
  };

  const handleDelete = (id: number) => {
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Equipment & Services</h1>
          <p className="text-slate-500 mt-1">Manage, add or update the machinery/services you offer to farmers.</p>
        </div>
        <KSButton onClick={() => setIsOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 flex items-center gap-2">
          <Plus size={20} />
          Add Equipment
        </KSButton>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {services.map((s) => (
          <KSCard key={s.id} className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-yellow-50 text-yellow-600 rounded-2xl shrink-0">
                {s.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">{s.name}</h3>
                <p className="text-sm font-semibold text-slate-400 mt-1">{s.type}</p>
                <p className="text-green-700 font-bold mt-2">{s.rate}</p>
                <div className="mt-3">
                  <KSBadge variant="success">Active</KSBadge>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition">
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="p-2 border border-slate-100 rounded-xl hover:bg-red-50 text-red-500 hover:text-red-700 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </KSCard>
        ))}
      </div>

      {/* Add Equipment Modal */}
      <KSModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Register New Equipment">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Equipment / Vehicle Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mahindra Arjun Novo 605"
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition bg-white"
            >
              <option value="Tractor Service">Tractor Service</option>
              <option value="Harvesting">Harvesting</option>
              <option value="Drone Spraying">Drone Spraying</option>
              <option value="Rotavator">Rotavator</option>
              <option value="Transport">Transport</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Rate Rate / Pricing</label>
            <input
              type="text"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. ₹900/hour or ₹2,000/acre"
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <KSButton variant="outline" className="w-1/2 justify-center" onClick={() => setIsOpen(false)}>
              Cancel
            </KSButton>
            <KSButton type="submit" className="w-1/2 justify-center bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold border-0">
              Register
            </KSButton>
          </div>
        </form>
      </KSModal>
    </div>
  );
};

export default MyServices;
