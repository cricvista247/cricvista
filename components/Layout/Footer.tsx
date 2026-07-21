"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import {
  Trophy,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Github,
  ArrowRight,
  ShieldCheck,
  Lock,
  BarChart3,
} from "lucide-react";

const Footer = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const platformLinks = [
    { label: "Match Analytics", href: "/matches" },
    { label: "Team Comparison", href: "/matches" },
    { label: "Player Intelligence", href: "/matches" },
    { label: "Venue Insights", href: "/matches" },
    { label: "Historical Data", href: "/matches" },
    { label: "Live Matches", href: "/matches" },
  ];

  const companyLinks = [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Partners", href: "/about" },
    { label: "Press", href: "/about" },
  ];

  const supportLinks = [
    { label: "Help Center", href: "/faq" },
    { label: "Documentation", href: "/faq" },
    { label: "FAQ", href: "/faq" },
    { label: "Report Issue", href: "/contact" },
    { label: "Contact Support", href: "/contact" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Responsible Use", href: "/responsible-use" },
    { label: "Cookie Policy", href: "/privacy" },
  ];

  const socialLinks = [
    {
      icon: Twitter,
      href: "#",
      label: "Twitter",
      hoverBg: "hover:bg-sky-500/10",
      hoverIcon: "group-hover:text-sky-400",
    },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
      hoverBg: "hover:bg-blue-600/10",
      hoverIcon: "group-hover:text-blue-500",
    },
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      hoverBg: "hover:bg-blue-500/10",
      hoverIcon: "group-hover:text-blue-400",
    },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      hoverBg: "hover:bg-pink-500/10",
      hoverIcon: "group-hover:text-pink-400",
    },
    {
      icon: Youtube,
      href: "#",
      label: "YouTube",
      hoverBg: "hover:bg-red-500/10",
      hoverIcon: "group-hover:text-red-400",
    },
    {
      icon: Github,
      href: "#",
      label: "GitHub",
      hoverBg: "hover:bg-white/10",
      hoverIcon: "group-hover:text-white",
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 container-cv pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 max-lg:gap-10 max-md:gap-8">
          <div className="space-y-6 max-md:text-center max-md:flex max-md:flex-col max-md:items-center">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                CricVista
              </span>
            </Link>

            <p className="text-[15px] text-slate-400 leading-relaxed max-w-xs max-md:max-w-sm">
              Advanced cricket analytics platform powered by artificial
              intelligence. Providing statistical insights, team analysis, and
              venue intelligence.
            </p>

            <div className="flex items-center gap-2.5 max-md:justify-center">
              {socialLinks.map(
                ({ icon: Icon, href, label, hoverBg, hoverIcon }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`group w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-500 transition-all duration-300 hover:-translate-y-1 ${hoverBg}`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-colors duration-300 ${hoverIcon}`}
                    />
                  </Link>
                ),
              )}
            </div>
          </div>

          <div className="space-y-5 max-md:text-center">
            <h3 className="text-[22px] font-bold text-white">Platform</h3>
            <ul className="space-y-3.5 max-md:flex max-md:flex-col max-md:items-center">
              {platformLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[16px] text-slate-400 hover:text-blue-400 transition-all duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-md:hidden" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5 max-md:text-center">
            <h3 className="text-[22px] font-bold text-white">Company</h3>
            <ul className="space-y-3.5 max-md:flex max-md:flex-col max-md:items-center">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[16px] text-slate-400 hover:text-blue-400 transition-all duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-md:hidden" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5 max-md:text-center">
            <h3 className="text-[22px] font-bold text-white">Support</h3>
            <ul className="space-y-3.5 max-md:flex max-md:flex-col max-md:items-center">
              {supportLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[16px] text-slate-400 hover:text-blue-400 transition-all duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-md:hidden" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5 max-md:text-center">
            <h3 className="text-[22px] font-bold text-white">Legal</h3>
            <ul className="space-y-3.5 max-md:flex max-md:flex-col max-md:items-center">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[16px] text-slate-400 hover:text-blue-400 transition-all duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-md:hidden" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5 max-md:text-center max-md:flex max-md:flex-col max-md:items-center">
            <h3 className="text-[22px] font-bold text-white">Newsletter</h3>
            <p className="text-[15px] text-slate-400 leading-relaxed max-w-xs">
              Stay updated with the latest cricket insights and platform
              updates.
            </p>
            {/* <form onSubmit={handleSubscribe} className="space-y-3 w-full max-w-sm">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full h-[52px] px-5 pr-14 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-[15px] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.08] focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-[44px] w-[44px] rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <ArrowRight className="h-5 w-5 text-white" />
                </button>
              </div>
              {subscribed && (
                <p className="text-sm text-emerald-400 flex items-center gap-2 justify-center md:justify-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Successfully subscribed!
                </p>
              )}
            </form> */}
          </div>
        </div>

        {/* AdSense — responsive banner above footer bottom bar */}
        <AdBanner
          adSlot="2957912516"
          adFormat="horizontal"
          className="mb-8"
        />

        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent my-12" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm max-md:text-center">
            <p className="text-xs text-slate-500 leading-relaxed">
              CricVista is an AI-powered cricket analytics platform for
              informational and educational purposes only. We do not provide
              betting, gambling, wagering or real-money gaming services.
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} CricVista
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Built with AI-powered cricket intelligence.
            </p>
          </div>

          <div className="flex items-center justify-center lg:justify-end gap-5 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Lock className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <BarChart3 className="h-3.5 w-3.5 text-purple-400" />
              </div>
              <span>Trusted Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
