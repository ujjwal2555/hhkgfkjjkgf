import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2, Users, Calendar, DollarSign, BarChart3, Clock,
  CheckCircle2, Shield, Zap, ArrowRight, Star, Target,
  TrendingUp, Award, FileText, UserCheck, Timer, Briefcase,
  Sparkles, Lock, LineChart, Layers, Globe2, Settings
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";

import contractsImg from "@assets/generated_images/Contracts_management_dashboard_UI_8a456f51.png";
import signaturesImg from "@assets/generated_images/Digital_signatures_interface_4d9b5e07.png";
import certificationsImg from "@assets/generated_images/Certifications_management_screen_9c68ee8e.png";
import policiesImg from "@assets/generated_images/Policies_management_dashboard_8721d481.png";
import performanceImg from "@assets/generated_images/Performance_appraisal_dashboard_86db236c.png";
import recruitmentImg from "@assets/generated_images/Recruitment_dashboard_interface_f265080e.png";
import onboardingImg from "@assets/generated_images/Onboarding_dashboard_screen_277e1eae.png";
import orgChartImg from "@assets/generated_images/Org_chart_visualization_38041098.png";
import attendanceImg from "@assets/generated_images/Attendance_tracking_dashboard_217de095.png";
import payrollImg from "@assets/generated_images/Payroll_processing_screen_d43b8813.png";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-gray-950 dark:via-purple-950/10 dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-100 dark:border-gray-900 bg-white/80 dark:bg-gray-950/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-105">
                <Building2 className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                WorkZen
              </h1>
            </div>
            <Button
              onClick={() => setLocation("/login")}
              variant="outline"
              className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300"
              data-testid="button-login"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-transparent to-blue-100/40 dark:from-purple-950/20 dark:via-transparent dark:to-blue-950/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 sm:pt-24 pb-20 sm:pb-32 relative">
          <div className={`text-center max-w-5xl mx-auto space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight">
              <span className="text-gray-900 dark:text-gray-100">A new HQ for all of your</span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 dark:from-purple-400 dark:via-purple-500 dark:to-purple-600 bg-clip-text text-transparent">
                employee info
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
              WorkZen is way more than just a staff directory. It's the hub for an entire suite of HR features—streamlined, efficient, and designed for modern organizations.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => setLocation("/login")}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-10 text-base font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
                data-testid="button-get-started"
              >
                Get started
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500 pt-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
              Free, forever, with unlimited users.
            </div>
          </div>
        </div>
      </section>

      {/* Hero Visual */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20 sm:pb-32">
        <div className="relative rounded-3xl bg-gradient-to-br from-purple-100/60 via-purple-50/40 to-blue-100/60 dark:from-purple-950/40 dark:via-purple-900/20 dark:to-blue-950/40 border border-purple-200/50 dark:border-purple-900/50 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-400/10 via-transparent to-blue-400/10 dark:from-purple-600/10 dark:to-blue-600/10" />
          <div className="aspect-video bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-2xl flex items-center justify-center backdrop-blur-sm relative overflow-hidden border border-gray-200/50 dark:border-gray-800/50">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 dark:from-purple-500/10 dark:to-blue-500/10" />
            <div className="text-center space-y-6 relative z-10 p-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-purple-500/20 dark:bg-purple-500/30 blur-3xl rounded-full animate-pulse" />
                <Users className="w-24 h-24 text-purple-600/40 dark:text-purple-500/40 relative" strokeWidth={1.5} />
              </div>
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Employee Management Dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Feature Section 1 */}
      <section className="py-20 sm:py-32 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-block">
                <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                  <Target className="w-3.5 h-3.5 mr-2" />
                  Centralized Management
                </Badge>
              </div>
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
                All of your people.
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
                  All in one place.
                </span>
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Get a bird's eye view of every department before zooming in on the details. Sort employees by working hours, job title, even contract status to get a full picture of your team from every possible angle.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <Badge variant="secondary" className="px-4 py-2.5 text-sm font-medium">
                  <Users className="w-4 h-4 mr-2" />
                  Employee Directory
                </Badge>
                <Badge variant="secondary" className="px-4 py-2.5 text-sm font-medium">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Department View
                </Badge>
                <Badge variant="secondary" className="px-4 py-2.5 text-sm font-medium">
                  <Layers className="w-4 h-4 mr-2" />
                  Org Charts
                </Badge>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 blur-3xl rounded-3xl" />
                <div className="relative rounded-3xl bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-900/50 p-10 shadow-xl">
                  <div className="aspect-[4/3] bg-white/60 dark:bg-gray-900/60 rounded-2xl shadow-2xl flex items-center justify-center backdrop-blur-sm">
                    <BarChart3 className="w-32 h-32 text-purple-600/30 dark:text-purple-500/30" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Feature Section 2 - Reversed */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/30 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/5 dark:to-emerald-500/5 blur-3xl rounded-3xl" />
                <div className="relative rounded-3xl bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/50 dark:border-green-900/50 p-10 shadow-xl">
                  <div className="aspect-[4/3] bg-white/60 dark:bg-gray-900/60 rounded-2xl shadow-2xl flex items-center justify-center backdrop-blur-sm">
                    <Shield className="w-32 h-32 text-green-600/30 dark:text-green-500/30" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <div className="inline-block">
                <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                  <Lock className="w-3.5 h-3.5 mr-2" />
                  Data Protection
                </Badge>
              </div>
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
                Keep the private stuff
                <br />
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  private
                </span>
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Restricted access settings to protect employee's private information—emergency contacts, visa information, and more. Role-based permissions ensure sensitive data stays secure.
              </p>
              <div className="flex items-start gap-4 pt-4 p-5 rounded-2xl bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/50">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950/50 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Enterprise-grade Security</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Advanced encryption and access controls</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Time Off - Side by Side */}
      <section className="py-20 sm:py-32 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Skills */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-500 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100">
                  Show off those
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
                    skills
                  </span>
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  Record every employee's unique skills, so the next time you are looking for a French-speaking JavaScript expert, you know exactly who to call.
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200/50 dark:border-orange-900/50 p-8 shadow-lg">
                <div className="aspect-square bg-white/60 dark:bg-gray-900/60 rounded-xl shadow-xl flex items-center justify-center">
                  <Star className="w-20 h-20 text-orange-600/30 dark:text-orange-500/30" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Time Off */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-500 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100">
                  Take control of
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                    time off
                  </span>
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  Stay on top of PTO requests with integrated time off tracking. Use the presence report to monitor attendance and quickly approve vacation requests.
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-900/50 p-8 shadow-lg">
                <div className="aspect-square bg-white/60 dark:bg-gray-900/60 rounded-xl shadow-xl flex items-center justify-center">
                  <Calendar className="w-20 h-20 text-blue-600/30 dark:text-blue-500/30" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-white via-purple-50/20 to-white dark:from-gray-950 dark:via-purple-950/10 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
              Never lose track of another
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
                document
              </span>
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Upload every contract, request signatures, then store them all in one secure location.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { image: contractsImg, label: "Contracts" },
              { image: signaturesImg, label: "Signatures" },
              { image: certificationsImg, label: "Certifications" },
              { image: policiesImg, label: "Policies" }
            ].map((item, index) => (
              <Card
                key={index}
                className="group p-6 text-center space-y-4 hover-elevate transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-900 border-gray-200/50 dark:border-gray-800/50 overflow-hidden"
                data-testid={`card-document-${index}`}
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={item.image} 
                    alt={item.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{item.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-32 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
              All the features
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
                done right.
              </span>
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { image: performanceImg, title: "Performance Appraisals", desc: "Schedule employee appraisals and measure skills development." },
              { image: recruitmentImg, title: "Recruitment Management", desc: "Create job openings and manage applications." },
              { image: onboardingImg, title: "Onboarding Plans", desc: "Assign activities for newly hired employees." },
              { image: orgChartImg, title: "Org Chart", desc: "Sort teams into an easy to view hierarchy on every employee profile." },
              { image: attendanceImg, title: "Attendance Monitoring", desc: "Track and analyze employee attendance with detailed reports." },
              { image: payrollImg, title: "Payroll Processing", desc: "Automated salary calculations and payslip generation." }
            ].map((feature, index) => (
              <Card
                key={index}
                className="group p-6 space-y-4 hover-elevate transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-900 border-gray-200/50 dark:border-gray-800/50 overflow-hidden"
                data-testid={`card-feature-${index}`}
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 px-8 py-6 text-base font-semibold transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-700 group"
              data-testid="button-see-all-features"
            >
              See all features
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/30 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <p className="text-lg text-purple-600 dark:text-purple-500 font-semibold">
              Join 15 million happy users
            </p>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100">
              who grow their business with WorkZen
            </h3>
          </div>

          <Card className="p-12 space-y-8 shadow-2xl bg-white dark:bg-gray-900 border-gray-200/50 dark:border-gray-800/50">
            <div className="flex justify-center">
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-7 h-7 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            <blockquote className="text-xl text-center text-gray-700 dark:text-gray-300 leading-relaxed italic font-medium">
              "WorkZen employee management simplifies key processes such as onboarding, performance tracking, payroll, leave management, and time attendance. It saves time and resources while improving accuracy. Overall, I am very satisfied with WorkZen."
            </blockquote>

            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-500/30">
                JD
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-gray-900 dark:text-gray-100">John Doe</p>
                <p className="text-gray-600 dark:text-gray-400">HR Director, Tech Solutions Inc.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 dark:from-purple-900 dark:via-purple-950 dark:to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-blue-400/20" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-3">
              <div className="text-6xl font-bold text-white">500+</div>
              <p className="text-purple-100 text-lg">Organizations Trust Us</p>
            </div>
            <div className="space-y-3">
              <div className="text-6xl font-bold text-white">50k+</div>
              <p className="text-purple-100 text-lg">Employees Managed</p>
            </div>
            <div className="space-y-3">
              <div className="text-6xl font-bold text-white">99.9%</div>
              <p className="text-purple-100 text-lg">System Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-white via-purple-50/20 to-white dark:from-gray-950 dark:via-purple-950/10 dark:to-gray-950">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-8">
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100">
            Unleash your
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
              growth potential
            </span>
          </h3>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => setLocation("/login")}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-12 h-14 text-lg font-semibold shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 group"
              data-testid="button-cta-login"
            >
              Start now - It's free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="text-gray-500 dark:text-gray-500">
            No credit card required • Instant access
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-900 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-md">
                <Building2 className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                WorkZen HRMS
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 WorkZen. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
