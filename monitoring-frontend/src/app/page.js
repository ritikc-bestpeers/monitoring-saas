import { Globe, Clock, Activity, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-24 text-center px-6">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl max-w-3xl">
          Synthetic Monitoring for{" "}
          <span className="text-blue-600">Modern Applications</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Proactively monitor uptime, performance, and reliability from
          locations worldwide. Stay ahead of issues before your users notice.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/alpha/dashboard"
            className="px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium shadow hover:bg-gray-50 transition"
          >
            Dashboard
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Monitoring?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 text-center rounded-2xl shadow hover:shadow-lg transition">
              <Globe className="w-10 h-10 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold">Global Coverage</h3>
              <p className="text-sm text-gray-600 mt-2">
                Monitor your apps from multiple regions worldwide.
              </p>
            </div>
            <div className="p-6 text-center rounded-2xl shadow hover:shadow-lg transition">
              <Clock className="w-10 h-10 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold">Real-Time Alerts</h3>
              <p className="text-sm text-gray-600 mt-2">
                Get instant alerts when downtime or latency spikes occur.
              </p>
            </div>
            <div className="p-6 text-center rounded-2xl shadow hover:shadow-lg transition">
              <Activity className="w-10 h-10 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold">Detailed Analytics</h3>
              <p className="text-sm text-gray-600 mt-2">
                Gain insights into response times, SLAs, and trends.
              </p>
            </div>
            <div className="p-6 text-center rounded-2xl shadow hover:shadow-lg transition">
              <Shield className="w-10 h-10 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold">Secure & Reliable</h3>
              <p className="text-sm text-gray-600 mt-2">
                Enterprise-grade security and 99.99% uptime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by Engineering Teams
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl shadow-sm bg-white">
              <p className="text-gray-700 italic">
                “This monitoring tool helped us catch downtime before it hit
                customers. Our SLA compliance has improved significantly.”
              </p>
              <p className="mt-4 font-semibold">— CTO, FinTech Startup</p>
            </div>
            <div className="p-6 rounded-2xl shadow-sm bg-white">
              <p className="text-gray-700 italic">
                “Setup took minutes, and the global checks are exactly what we
                needed to monitor user experience worldwide.”
              </p>
              <p className="mt-4 font-semibold">— DevOps Lead, SaaS Company</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold">Ready to Improve Reliability?</h2>
        <p className="mt-4 text-lg text-blue-100">
          Start monitoring today and stay one step ahead of downtime.
        </p>
        <div className="mt-8">
          <a
            href="#"
            className="px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold shadow hover:bg-gray-100 transition"
          >
            Start Free Trial
          </a>
        </div>
      </section>
    </main>
  );
}
