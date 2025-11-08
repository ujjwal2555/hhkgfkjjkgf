"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("/api/attendance");
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, []);

  const handleCheckIn = async () => {
    setCheckedIn(true);
    await axios.post("/api/attendance", { status: "Present" });
  };

  const handleCheckOut = async () => {
    setCheckedIn(false);
    await axios.post("/api/attendance", { status: "Absent" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-500";
      case "Leave":
        return "bg-blue-400";
      case "Absent":
        return "bg-yellow-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f8f8]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#714b67] text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">WorkZen</h2>
        <nav className="flex flex-col gap-3 text-sm">
          {["Employees", "Attendance", "Time Off", "Payroll", "Reports", "Settings"].map(
            (item) => (
              <button
                key={item}
                className="text-left py-2 px-3 rounded hover:bg-white/20 transition"
              >
                {item}
              </button>
            )
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex justify-between items-center bg-white p-4 shadow-md">
          <h1 className="text-xl font-bold text-[#714b67]">Dashboard</h1>

          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src="/user-avatar.png"
                alt="avatar"
                className="w-10 h-10 rounded-full border-2 border-[#714b67]"
              />
              <ChevronDown size={18} className="text-[#714b67]" />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg text-sm">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  My Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                  Log Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Check In/Out Section */}
        <div className="flex justify-end p-4 gap-3">
          {!checkedIn ? (
            <button
              onClick={handleCheckIn}
              className="bg-[#714b67] text-white px-4 py-2 rounded-md shadow-md hover:opacity-90 transition"
            >
              Check In
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:opacity-90 transition"
            >
              Check Out
            </button>
          )}
        </div>

        {/* Employee Grid */}
        <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {employees.length > 0 ? (
            employees.map((emp) => (
              <div
                key={emp.id}
                className="relative bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center transition hover:scale-105"
              >
                {/* Status Dot */}
                <span
                  className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusColor(
                    emp.status
                  )}`}
                ></span>

                <img
                  src={emp.image || "/default-avatar.png"}
                  alt="profile"
                  className="w-16 h-16 rounded-full mb-3"
                />
                <h3 className="font-semibold text-[#714b67]">{emp.name || "satyam rajawat"}</h3>
                <p className="text-gray-500 text-sm">{emp.role || "engineer"}</p>
                <button className="mt-3 text-sm text-white bg-[#714b67] px-3 py-1 rounded-md">
                  View Profile
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No employees found
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
