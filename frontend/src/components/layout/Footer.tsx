import { Tractor } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-green-800 text-white">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          <div>

            <div className="flex items-center gap-3 mb-5">

              <Tractor size={35} />

              <h2 className="text-3xl font-bold">
                KisanSeeva
              </h2>

            </div>

            <p className="text-green-100 leading-8">
              Connecting Farmers with Trusted Agricultural Services.
            </p>

          </div>

          <div>

            <h3 className="font-bold text-xl mb-5">
              Services
            </h3>

            <ul className="space-y-3 text-green-100">

              <li>Tractor</li>

              <li>Harvesting</li>

              <li>Drone Spraying</li>

              <li>Rotavator</li>

              <li>Transport</li>

            </ul>

          </div>

          <div>

            <h3 className="font-bold text-xl mb-5">
              Company
            </h3>

            <ul className="space-y-3 text-green-100">

              <li>About</li>

              <li>Features</li>

              <li>Contact</li>

              <li>Support</li>

            </ul>

          </div>

          <div>

            <h3 className="font-bold text-xl mb-5">
              Contact
            </h3>

            <ul className="space-y-3 text-green-100">

              <li>Hyderabad</li>

              <li>support@kisanseeva.com</li>

              <li>+91 9876543210</li>

            </ul>

          </div>

        </div>

        <hr className="my-10 border-green-700" />

        <div className="text-center text-green-200">

          © 2026 KisanSeeva. All Rights Reserved.

        </div>

      </div>

    </footer>
  );
}

export default Footer;