"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, Mail, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PublicFooter } from "@/components/navigation/PublicFooter";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-study-bg text-zinc-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-pink-100 py-4 px-6 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-pink-500 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tight text-zinc-900">
              Study<span className="text-pink-600">Track</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 space-y-8">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Support &amp; Inquiries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Contact StudyTrack Team
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Have questions about certificate verification, study features, or institutional access? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Information Sidebar */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-zinc-900">Get in Touch</h3>

            <div className="space-y-4 text-xs text-zinc-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-zinc-900">Support Email</p>
                  <a href="mailto:support@studytrack.platform" className="text-pink-600 underline">
                    support@studytrack.platform
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-zinc-900">Headquarters</p>
                  <p className="text-zinc-500">StudyTrack Educational Technology, India</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-pink-100">
              <p className="text-[11px] text-zinc-500">
                Official Creator Instagram:{" "}
                <a
                  href="https://www.instagram.com/trigger_toofan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 font-bold underline"
                >
                  @trigger_toofan
                </a>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm">
            {submitted ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">Message Received!</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Thank you for reaching out to StudyTrack. Our academic support desk will review your inquiry and reply within 24 hours.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="bg-brand-500 hover:bg-brand-600 text-white text-xs mt-3"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 mb-2">Send an Official Inquiry</h3>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Your Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Message / Question
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist your study tracking or certificate verification?"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-pink-200"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Submit Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
