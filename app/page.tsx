"use client";
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  CalendarDays,
  BarChart3,
  BrainCircuit,
  Search,
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  BriefcaseBusiness,
  GraduationCap,
  ShieldCheck,
  LogOut,
  Menu,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// const employees = [
//   {
//     id: "EMP001",
//     name: "Narin Chaiyo",
//     role: "HR Officer",
//     department: "Human Resources",
//     status: "Active",
//     leaveBalance: 9,
//     performance: 88,
//   },
//   {
//     id: "EMP002",
//     name: "Mali Srisuk",
//     role: "Sales Executive",
//     department: "Sales",
//     status: "Active",
//     leaveBalance: 5,
//     performance: 82,
//   },
//   {
//     id: "EMP003",
//     name: "Krit Wongsa",
//     role: "Software Engineer",
//     department: "IT",
//     status: "Probation",
//     leaveBalance: 3,
//     performance: 91,
//   },
//   {
//     id: "EMP004",
//     name: "Pimchanok Kaew",
//     role: "Accountant",
//     department: "Finance",
//     status: "Active",
//     leaveBalance: 11,
//     performance: 79,
//   },
// ];


const leaveRequests = [
  { name: "Mali Srisuk", type: "Annual Leave", date: "2026-05-16", status: "Pending" },
  { name: "Krit Wongsa", type: "Sick Leave", date: "2026-05-13", status: "Approved" },
  { name: "Pimchanok Kaew", type: "Personal Leave", date: "2026-05-20", status: "Pending" },
];

const aiSuggestions = [
  "3 employees have leave balance below 5 days.",
  "Candidate Anya Phan has the strongest HR Assistant fit score.",
  "IT department shows strong performance but should complete probation review soon.",
  "Two leave requests are waiting for manager approval.",
];

const menu = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "employees", label: "Employees", icon: Users },
  { key: "recruitment", label: "Recruitment", icon: UserPlus },
  { key: "leave", label: "Leave", icon: CalendarDays },
  { key: "performance", label: "Performance", icon: BriefcaseBusiness },
  { key: "learning", label: "Learning", icon: GraduationCap },
  { key: "ai", label: "AI Assistant", icon: BrainCircuit },
  { key: "security", label: "Access Control", icon: ShieldCheck },
];

function StatCard({ icon: Icon, label, value, note }) {
  return (
    <Card className="rounded-2xl shadow-sm border bg-white">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <h3 className="text-3xl font-semibold text-slate-900 mt-1">{value}</h3>
            <p className="text-xs text-slate-500 mt-2">{note}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-100">
            <Icon className="w-5 h-5 text-slate-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}

function Badge({ children, tone = "default" }) {
  const classes = {
    default: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${classes[tone]}`}>{children}</span>;
}

function Dashboard() {
  const [employeesData, setEmployeesData] = useState<any[]>([]);
  const [candidatesData, setCandidatesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: employees, error: employeeError } = await supabase
      .from("employees")
      .select("*");

    const { data: candidates, error: candidateError } = await supabase
      .from("candidates")
      .select("*");

    if (employeeError) console.error(employeeError);
    if (candidateError) console.error(candidateError);

    setEmployeesData(employees || []);
    setCandidatesData(candidates || []);
    setLoading(false);
  };

  const totalEmployees = employeesData.length;
  const totalCandidates = candidatesData.length;

  const avgPerformance =
    totalEmployees > 0
      ? Math.round(
          employeesData.reduce(
            (sum, e) => sum + Number(e.performance ?? 0),
            0
          ) / totalEmployees
        )
      : 0;

  const topCandidate = [...candidatesData].sort(
    (a, b) => Number(b.fit ?? 0) - Number(a.fit ?? 0)
  )[0];

  const shortlistedCandidates = candidatesData.filter(
    (c) => c.stage === "Shortlisted" || c.ai_recommendation === "Shortlist"
  ).length;

  const lowPerformers = employeesData.filter(
    (e) => Number(e.performance ?? 0) < 80
  );

  const aiInsights = [
    `Total workforce in system: ${totalEmployees} employees.`,
    `Average performance score is ${avgPerformance}%.`,
    topCandidate
      ? `Top candidate is ${topCandidate.name} with ${topCandidate.fit ?? 0}% fit.`
      : "No candidate data available yet.",
    `${shortlistedCandidates} candidates are recommended or marked for shortlist.`,
    lowPerformers.length > 0
      ? `${lowPerformers.length} employees may need performance coaching.`
      : "No major performance risk detected.",
  ];

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div>
      <SectionTitle
        title="CONVERA Command Center"
        subtitle="Real-time workforce, recruitment, performance, and AI-powered HR insights."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Employees"
          value={totalEmployees}
          note="Total employees from Supabase"
        />

        <StatCard
          icon={UserPlus}
          label="Candidates"
          value={totalCandidates}
          note="Total candidate profiles"
        />

        <StatCard
          icon={BarChart3}
          label="Avg Performance"
          value={`${avgPerformance}%`}
          note="Calculated from employee records"
        />

        <StatCard
          icon={Sparkles}
          label="Shortlisted"
          value={shortlistedCandidates}
          note="AI-recommended or shortlisted candidates"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <Card className="rounded-2xl shadow-sm xl:col-span-2">
          <CardContent className="p-5">
            <h3 className="font-semibold text-slate-900 mb-4">
              Recruitment Snapshot
            </h3>

            {topCandidate ? (
              <div className="rounded-2xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Top Candidate</p>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {topCandidate.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {topCandidate.position} · {topCandidate.source}
                    </p>
                  </div>

                  <Badge tone="green">{topCandidate.fit ?? 0}% fit</Badge>
                </div>

                <p className="text-sm text-slate-700 mt-4 bg-slate-50 rounded-2xl p-3">
                  {topCandidate.ai_summary ||
                    topCandidate.aiSummary ||
                    "No AI summary available yet."}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border p-6 text-center text-sm text-slate-500">
                No candidate data available.
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Shortlisted</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {shortlistedCandidates}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Avg Fit Score</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {totalCandidates > 0
                    ? Math.round(
                        candidatesData.reduce(
                          (sum, c) => sum + Number(c.fit ?? 0),
                          0
                        ) / totalCandidates
                      )
                    : 0}
                  %
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Performance Risk</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {lowPerformers.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit className="w-5 h-5" />
              <h3 className="font-semibold text-slate-900">AI Insights</h3>
            </div>

            <div className="space-y-3">
              {aiInsights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Employees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    position: "",
    status: "Active",
    leave_balance: 0,
    performance: 0,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data, error } = await supabase.from("employees").select("*");

    if (error) {
      console.error(error);
    } else {
      setEmployees(data || []);
    }

    setLoading(false);
  };
  const addEmployee = async () => {
    const { error } = await supabase.from("employees").insert([
      {
        ...form,
        leave_balance: Number(form.leave_balance),
        performance: Number(form.performance),
      },
    ]);

    if (error) {
      console.error(error);
      alert("เพิ่มพนักงานไม่สำเร็จ");
      return;
    }

    setShowForm(false);
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      department: "",
      position: "",
      status: "Active",
      leave_balance: 0,
      performance: 0,
    });

    fetchEmployees();
  };
  const startEditEmployee = (employee: any) => {
    setEditingId(employee.id);
    setShowForm(true);
    setForm({
      first_name: employee.first_name ?? "",
      last_name: employee.last_name ?? "",
      email: employee.email ?? "",
      department: employee.department ?? "",
      position: employee.position ?? "",
      status: employee.status ?? "Active",
      leave_balance: employee.leave_balance ?? 0,
      performance: employee.performance ?? 0,
    });
  };
  const updateEmployee = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from("employees")
      .update({
        ...form,
        leave_balance: Number(form.leave_balance),
        performance: Number(form.performance),
      })
      .eq("id", editingId);

    if (error) {
      console.error(error);
      alert("แก้ไขข้อมูลพนักงานไม่สำเร็จ");
      return;
    }

    setEditingId(null);
    setShowForm(false);
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      department: "",
      position: "",
      status: "Active",
      leave_balance: 0,
      performance: 0,
    });

    fetchEmployees();
  };
  const filtered = employees.filter((e) =>
    `${e.first_name ?? ""} ${e.last_name ?? ""} ${e.position ?? ""} ${e.department ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  if (loading) {
    return <div className="p-6">Loading employees...</div>;
  }

  return (
    <div>
      <SectionTitle
        title="Employee Management"
        subtitle="Manage employee profiles, roles, departments, documents, and employment status."
      />

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employee..."
            className="w-full rounded-2xl border px-10 py-2.5 outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>
        <Button className="rounded-2xl" onClick={() => setShowForm(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>
      {showForm && (
        <Card className="rounded-2xl shadow-sm mb-4">
          <CardContent className="p-5">
            <h3 className="font-semibold text-slate-900 mb-4">{editingId ? "Edit Employee" : "Add New Employee"}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                ["first_name", "First Name"],
                ["last_name", "Last Name"],
                ["email", "Email"],
                ["department", "Department"],
                ["position", "Position"],
              ].map(([key, label]) => (
                <input
                  key={key}
                  placeholder={label}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="rounded-2xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200"
                />
              ))}

              <input
                type="number"
                placeholder="Leave Balance"
                value={form.leave_balance}
                onChange={(e) =>
                  setForm({ ...form, leave_balance: Number(e.target.value) })
                }
                className="rounded-2xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200"
              />

              <input
                type="number"
                placeholder="Performance"
                value={form.performance}
                onChange={(e) =>
                  setForm({ ...form, performance: Number(e.target.value) })
                }
                className="rounded-2xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <Button 
                onClick={editingId ? updateEmployee : addEmployee} 
                className="rounded-2xl"
                >
                {editingId ? "Update Employee" : "Save Employee"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="rounded-2xl"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((e) => (
          <Card key={e.id} className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500">{e.id}</p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {e.first_name} {e.last_name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {e.position} · {e.department}
                  </p>
                </div>
                <Badge tone={e.status === "Active" ? "green" : "amber"}>
                  {e.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Leave Balance</p>
                  <p className="font-semibold text-slate-900">
                    {e.leave_balance ?? 0} days
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Performance</p>
                  <p className="font-semibold text-slate-900">
                    {e.performance ?? 0}%
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => startEditEmployee(e)}
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Recruitment() {
  const [jobRequirement, setJobRequirement] = useState(
    "HR Assistant with payroll knowledge, Excel, document control, and strong communication"
  );
  const [sourceFilter, setSourceFilter] = useState("All");
  const [minFit, setMinFit] = useState(70);
  const [candidateList, setCandidateList] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    source: "Resume Upload",
    position: "",
    experience: "",
    location: "",
    education: "",
    salary: "",
    skills: "",
    resumeText: "",
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const { data, error } = await supabase.from("candidates").select("*");

    if (error) {
      console.error(error);
      return;
    }

    const normalized = (data || []).map((candidate: any) => ({
      ...candidate,
      fit: Number(candidate.fit ?? 0),
      stage: candidate.stage ?? "New",
      skills: Array.isArray(candidate.skills)
        ? candidate.skills
        : typeof candidate.skills === "string"
          ? candidate.skills
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
      resumeText: candidate.resumeText ?? candidate.resume_text ?? "",
      aiSummary:
        candidate.aiSummary ?? candidate.ai_summary ?? "Waiting for AI screening",
      aiReason: candidate.aiReason ?? candidate.ai_reason ?? "No analysis yet",
      aiStrengths: candidate.aiStrengths ?? candidate.ai_strengths ?? "",
      aiGaps: candidate.aiGaps ?? candidate.ai_gaps ?? "",
      aiRecommendation:
        candidate.aiRecommendation ?? candidate.ai_recommendation ?? "",
    }));

    setCandidateList(normalized);
  };
  
  const runAiScreening = async () => {
    const updatedCandidates = [];

    for (const candidate of candidateList) {
      try {
        const prompt = `
  You are an HR AI recruitment assistant for Convergent Interfreight Co., Ltd., a logistics and freight forwarding company.

  Analyze this candidate based on the job requirement and screening criteria.

  Job Requirement:
  ${jobRequirement}

  Screening Criteria:
  - Skills
  - Work experience
  - Location
  - Education
  - Expected salary
  - Logistics/freight relevance
  - SAP, Excel, import/export documentation, customs clearance, communication, and document control if relevant

  Candidate Information:
  Name: ${candidate.name}
  Source: ${candidate.source || "Not provided"}
  Position: ${candidate.position}
  Experience: ${candidate.experience || "Not provided"}
  Location: ${candidate.location || "Not provided"}
  Education: ${candidate.education || "Not provided"}
  Skills: ${
          Array.isArray(candidate.skills)
            ? candidate.skills.join(", ")
            : candidate.skills || "Not provided"
        }
  Expected Salary: ${candidate.salary || "Not provided"}

  Resume/Profile Text:
  ${candidate.resumeText || "Not provided"}

  Return:
  1. Fit Score (0-100)
  2. Summary
  3. Strengths
  4. Gaps
  5. Recommendation

  Important:
  - Be strict but fair.
  - Do not reject automatically.
  - If information is missing, mention it as a gap.
  - Recommendation should be one of: "Shortlist", "Hold", or "Manual Review".

  Respond ONLY in valid JSON format:
  {
    "fitScore": 85,
    "summary": "...",
    "strengths": "...",
    "gaps": "...",
    "recommendation": "Shortlist"
  }
  `;

        const res = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        const data = await res.json();

        let parsed;

        try {
          const cleanedReply = data.reply
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          parsed = JSON.parse(cleanedReply);
        } catch {
          parsed = {
            fitScore: 70,
            summary: data.reply || "AI analysis completed, but JSON parsing failed.",
            strengths: "Please review manually.",
            gaps: "AI response format was not valid JSON.",
            recommendation: "Manual Review",
          };
        }

        const updatedCandidate = {
          ...candidate,
          fit: Number(parsed.fitScore ?? 70),
          aiSummary: parsed.summary ?? "",
          aiStrengths: parsed.strengths ?? "",
          aiGaps: parsed.gaps ?? "",
          aiRecommendation: parsed.recommendation ?? "Manual Review",
          aiReason: parsed.recommendation ?? "Manual Review",
        };

        updatedCandidates.push(updatedCandidate);

        await supabase
          .from("candidates")
          .update({
            fit: updatedCandidate.fit,
            ai_summary: updatedCandidate.aiSummary,
            ai_strengths: updatedCandidate.aiStrengths,
            ai_gaps: updatedCandidate.aiGaps,
            ai_recommendation: updatedCandidate.aiRecommendation,
          })
          .eq("id", candidate.id);
          
      } catch (error) {
        console.error(error);
        updatedCandidates.push(candidate);
      }
    }

    setCandidateList(updatedCandidates);
  };

  const shortlistCandidate = (candidateName: string) => {
    setCandidateList((prev) =>
      prev.map((c) =>
        c.name === candidateName ? { ...c, stage: "Shortlisted" } : c
      )
    );
  };
  const addCandidate = async () => {
    if (!candidateForm.name || !candidateForm.position) {
      alert("Please enter candidate name and position.");
      return;
    }

    const payload = {
      name: candidateForm.name,
      source: candidateForm.source,
      position: candidateForm.position,
      experience: candidateForm.experience,
      location: candidateForm.location,
      education: candidateForm.education,
      salary: candidateForm.salary,
      skills: candidateForm.skills,
      resume_text: candidateForm.resumeText,
      fit: 0,
      stage: "New",
      ai_summary: "",
      ai_strengths: "",
      ai_gaps: "",
      ai_recommendation: "",
    };

    const { error } = await supabase
      .from("candidates")
      .insert([payload]);

    if (error) {
      console.error(error);
      alert("Failed to save candidate.");
      return;
    }

    setCandidateForm({
      name: "",
      source: "Resume Upload",
      position: "",
      experience: "",
      location: "",
      education: "",
      salary: "",
      skills: "",
      resumeText: "",
    });

    setShowCandidateForm(false);

    fetchCandidates();
  };
  const scanResume = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/resume-scan", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.success) {
      alert("Scan resume failed");
      return;
    }

    setCandidateForm((prev) => ({
      ...prev,
      resumeText: data.text,
    }));

    await extractCandidateInfo(data.text);
  };
  const extractCandidateInfo = async (resumeText: string) => {
    const prompt = `
  You are an HR resume parsing assistant.

  Extract candidate information from this resume text.

  Resume Text:
  ${resumeText}

  Return ONLY valid JSON:
  {
    "name": "",
    "position": "",
    "experience": "",
    "location": "",
    "education": "",
    "salary": "",
    "skills": ""
  }
  `;

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    try {
      const cleanedReply = data.reply
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanedReply);

      setCandidateForm((prev) => ({
        ...prev,
        name: parsed.name || prev.name,
        position: parsed.position || prev.position,
        experience: parsed.experience || prev.experience,
        location: parsed.location || prev.location,
        education: parsed.education || prev.education,
        salary: parsed.salary || prev.salary,
        skills: parsed.skills || prev.skills,
        resumeText,
      }));
    } catch (error) {
      console.error(error);
      alert("AI could not extract resume fields. Resume text was still added.");
    }
  };
  const filteredCandidates = candidateList
    .filter((c) => sourceFilter === "All" || c.source === sourceFilter)
    .filter((c) => c.fit >= minFit)
    .sort((a, b) => b.fit - a.fit);

  return (
    <div>
      <SectionTitle
        title="Recruitment & AI Resume Screening"
        subtitle="Import candidate profiles from job platforms, analyze resumes, and shortlist candidates based on company requirements."
      />
      <div className="flex justify-end mb-4">
        <Button className="rounded-2xl" onClick={() => setShowCandidateForm(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Candidate
        </Button>
        {showCandidateForm && (
          <Card className="rounded-2xl shadow-sm mb-5">
            <CardContent className="p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Add Candidate Profile</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Candidate Name" value={candidateForm.name}
                  onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                  className="rounded-2xl border px-4 py-2.5" />

                <select value={candidateForm.source}
                  onChange={(e) => setCandidateForm({ ...candidateForm, source: e.target.value })}
                  className="rounded-2xl border px-4 py-2.5 bg-white">
                  <option>LinkedIn</option>
                  <option>JobsDB</option>
                  <option>JobThai</option>
                  <option>Indeed</option>
                  <option>Resume Upload</option>
                  <option>Email</option>
                </select>

                <input placeholder="Applied Position" value={candidateForm.position}
                  onChange={(e) => setCandidateForm({ ...candidateForm, position: e.target.value })}
                  className="rounded-2xl border px-4 py-2.5" />

                <input placeholder="Experience e.g. 3 years" value={candidateForm.experience}
                  onChange={(e) => setCandidateForm({ ...candidateForm, experience: e.target.value })}
                  className="rounded-2xl border px-4 py-2.5" />

                <input placeholder="Location" value={candidateForm.location}
                  onChange={(e) => setCandidateForm({ ...candidateForm, location: e.target.value })}
                  className="rounded-2xl border px-4 py-2.5" />

                <input placeholder="Education" value={candidateForm.education}
                  onChange={(e) => setCandidateForm({ ...candidateForm, education: e.target.value })}
                  className="rounded-2xl border px-4 py-2.5" />

                <input placeholder="Expected Salary" value={candidateForm.salary}
                  onChange={(e) => setCandidateForm({ ...candidateForm, salary: e.target.value })}
                  className="rounded-2xl border px-4 py-2.5" />

                <input placeholder="Skills, separated by comma" value={candidateForm.skills}
                  onChange={(e) => setCandidateForm({ ...candidateForm, skills: e.target.value })}
                  className="rounded-2xl border px-4 py-2.5" />

                <div className="md:col-span-2">
                  <label className="text-xs text-slate-500">Upload Resume PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) scanResume(file);
                    }}
                    className="mt-1 w-full rounded-2xl border px-4 py-2.5"
                  />
                </div>
              </div>

              <textarea
                placeholder="Paste resume/profile text here..."
                value={candidateForm.resumeText}
                onChange={(e) => setCandidateForm({ ...candidateForm, resumeText: e.target.value })}
                className="mt-3 w-full min-h-[120px] rounded-2xl border px-4 py-3"
              />

              <div className="flex gap-3 mt-4">
                <Button onClick={addCandidate} className="rounded-2xl">Save Candidate</Button>
                <Button variant="outline" onClick={() => setShowCandidateForm(false)} className="rounded-2xl">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Card className="rounded-2xl shadow-sm mb-5">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-5 h-5" />
            <h3 className="font-semibold text-slate-900">
              AI Candidate Matching Setup
            </h3>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            <div className="xl:col-span-2">
              <label className="text-xs text-slate-500">
                Job requirement / company criteria
              </label>
              <textarea
                value={jobRequirement}
                onChange={(e) => setJobRequirement(e.target.value)}
                className="mt-1 w-full min-h-[96px] rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500">
                Candidate source
              </label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="mt-1 w-full rounded-2xl border px-4 py-3 bg-white"
              >
                <option>All</option>
                <option>LinkedIn</option>
                <option>JobsDB</option>
                <option>JobThai</option>
                <option>Resume Upload</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500">
                Minimum AI fit score: {minFit}%
              </label>
              <input
                type="range"
                min="50"
                max="95"
                value={minFit}
                onChange={(e) => setMinFit(Number(e.target.value))}
                className="w-full mt-4"
              />

              <Button
                onClick={runAiScreening}
                className="rounded-2xl mt-5 w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Run AI Screening
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCandidates.map((c) => (
          <Card key={c.name} className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">
                    Source: {c.source}
                  </p>
                  <h3 className="font-semibold text-slate-900">{c.name}</h3>
                  <p className="text-sm text-slate-500">
                    {c.position} · {c.experience}
                  </p>
                </div>

                <Badge tone={c.fit >= 85 ? "green" : c.fit >= 75 ? "blue" : "amber"}>
                  {c.fit}% fit
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {c.skills.map((skill: string) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Expected Salary</p>
                  <p className="font-semibold text-slate-900">{c.salary}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Stage</p>
                  <p className="font-semibold text-slate-900">{c.stage}</p>
                </div>
              </div>

              <div className="text-sm text-slate-700 mt-4 bg-slate-50 rounded-2xl p-3">
                <p>AI Summary: {c.ai_summary || c.aiSummary}</p>
              </div>

              <div className="mt-3 rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500 mb-1">Strengths</p>
                <p className="text-sm text-slate-700">
                  {c.ai_strengths || c.aiStrengths || "No AI analysis yet"}
                </p>
              </div>

              <div className="mt-3 rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500 mb-1">Potential Gaps</p>
                <p className="text-sm text-slate-700">
                  {c.ai_gaps || c.aiGaps || "No AI analysis yet"}
                </p>
              </div>

              <div className="mt-3 rounded-2xl bg-slate-900 p-3">
                <p className="text-xs text-slate-300 mb-1">AI Recommendation</p>
                <p className="text-sm text-white">
                  {c.ai_recommendation || c.aiRecommendation || "No recommendation yet"}
                </p>
              </div>
              <p className="text-sm text-slate-600 mt-3">
                AI Reason: {c.aiReason}
              </p>

              <div className="mt-4 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl flex-1"
                  onClick={() => setSelectedCandidate(c)}
                >
                  View Resume
                </Button>

                <Button
                  className="rounded-xl flex-1"
                  onClick={() => shortlistCandidate(c.name)}
                >
                  Shortlist
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <Card className="rounded-2xl shadow-lg max-w-2xl w-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {selectedCandidate.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {selectedCandidate.position} · {selectedCandidate.source}
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setSelectedCandidate(null)}
                >
                  Close
                </Button>
              </div>

              <div className="space-y-3 text-sm text-slate-700">
                <p>
                  <strong>Experience:</strong> {selectedCandidate.experience}
                </p>
                <p>
                  <strong>Expected Salary:</strong> {selectedCandidate.salary}
                </p>
                <p>
                  <strong>Skills:</strong>{" "}
                  {selectedCandidate.skills.join(", ")}
                </p>
                <p>
                  <strong>AI Summary:</strong> {selectedCandidate.aiSummary}
                </p>
                <p>
                  <strong>AI Reason:</strong> {selectedCandidate.aiReason}
                </p>

                <div className="rounded-2xl bg-slate-50 p-4 mt-4">
                  <p className="font-semibold mb-2">Resume Preview</p>
                  <p>
                    Candidate has experience related to {selectedCandidate.position}.
                    Skills include {selectedCandidate.skills.join(", ")}.
                    Current screening score is {selectedCandidate.fit}%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
function Leave() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Mali Srisuk",
      type: "Annual Leave",
      date: "2026-05-16",
      reason: "Personal vacation",
      status: "Pending",
    },
    {
      id: 2,
      name: "Krit Wongsa",
      type: "Sick Leave",
      date: "2026-05-13",
      reason: "Medical appointment",
      status: "Approved",
    },
    {
      id: 3,
      name: "Pimchanok Kaew",
      type: "Personal Leave",
      date: "2026-05-20",
      reason: "Family matter",
      status: "Pending",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "Annual Leave",
    date: "",
    reason: "",
  });

  const addLeaveRequest = () => {
    if (!form.name || !form.date) {
      alert("กรุณากรอกชื่อพนักงานและวันที่ลา");
      return;
    }

    setRequests([
      {
        id: Date.now(),
        ...form,
        status: "Pending",
      },
      ...requests,
    ]);

    setForm({
      name: "",
      type: "Annual Leave",
      date: "",
      reason: "",
    });

    setShowForm(false);
  };

  const updateLeaveStatus = (id: number, status: string) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  return (
    <div>
      <SectionTitle
        title="Leave & Attendance"
        subtitle="Submit, approve, reject, and monitor employee leave requests."
      />

      <div className="flex justify-end mb-4">
        <Button className="rounded-2xl" onClick={() => setShowForm(true)}>
          <CalendarDays className="w-4 h-4 mr-2" />
          Add Leave Request
        </Button>
      </div>

      {showForm && (
        <Card className="rounded-2xl shadow-sm mb-4">
          <CardContent className="p-5">
            <h3 className="font-semibold text-slate-900 mb-4">
              Add Leave Request
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                placeholder="Employee Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-2xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200"
              />

              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="rounded-2xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200 bg-white"
              >
                <option>Annual Leave</option>
                <option>Sick Leave</option>
                <option>Personal Leave</option>
                <option>Business Leave</option>
                <option>Emergency Leave</option>
              </select>

              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="rounded-2xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200"
              />

              <input
                placeholder="Reason"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="rounded-2xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <Button onClick={addLeaveRequest} className="rounded-2xl">
                Save Request
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="rounded-2xl"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-5">
          <div className="space-y-3">
            {requests.map((leave) => (
              <div
                key={leave.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-2xl border p-4"
              >
                <div>
                  <p className="font-medium text-slate-900">{leave.name}</p>
                  <p className="text-sm text-slate-500">
                    {leave.type} · {leave.date}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Reason: {leave.reason || "No reason provided"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    tone={
                      leave.status === "Approved"
                        ? "green"
                        : leave.status === "Rejected"
                        ? "amber"
                        : "blue"
                    }
                  >
                    {leave.status}
                  </Badge>

                  {leave.status === "Pending" && (
                    <>
                      <Button
                        className="rounded-xl"
                        onClick={() =>
                          updateLeaveStatus(leave.id, "Approved")
                        }
                      >
                        Approve
                      </Button>

                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() =>
                          updateLeaveStatus(leave.id, "Rejected")
                        }
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Performance() {
  const [performanceEmployees, setPerformanceEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchPerformanceEmployees();
  }, []);

  const fetchCandidates = async () => {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const formatted =
      data?.map((candidate) => ({
        ...candidate,
        skills:
          typeof candidate.skills === "string"
            ? candidate.skills
                .split(",")
                .map((s: string) => s.trim())
            : [],
      })) || [];

    setCandidateList(formatted);
  };
  const fetchPerformanceEmployees = async () => {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setPerformanceEmployees(data || []);
    }

    setLoading(false);
  };

  const startEditPerformance = (employee: any) => {
    setEditingId(employee.id);
    setScore(employee.performance ?? 0);
  };

  const updatePerformance = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from("employees")
      .update({ performance: Number(score) })
      .eq("id", editingId);

    if (error) {
      console.error(error);
      alert("อัปเดตคะแนนไม่สำเร็จ");
      return;
    }

    setEditingId(null);
    setScore(0);
    fetchPerformanceEmployees();
  };

  const generateAIFeedback = (performance: number) => {
    if (performance >= 90) {
      return "Excellent performer. Recommended for leadership development or high-potential talent pool.";
    }

    if (performance >= 80) {
      return "Strong performance. Employee is meeting expectations and should receive continued development support.";
    }

    if (performance >= 70) {
      return "Moderate performance. Recommend setting clear improvement goals and manager coaching.";
    }

    return "Performance risk detected. Recommend immediate performance improvement plan and closer follow-up.";
  };

  if (loading) {
    return <div className="p-6">Loading performance data...</div>;
  }

  return (
    <div>
      <SectionTitle
        title="Performance Management"
        subtitle="Track employee performance scores, AI feedback, and improvement recommendations."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {performanceEmployees.map((e) => (
          <Card key={e.id} className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {e.first_name} {e.last_name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {e.position} · {e.department}
                  </p>
                </div>

                <Badge
                  tone={
                    e.performance >= 85
                      ? "green"
                      : e.performance >= 70
                      ? "blue"
                      : "amber"
                  }
                >
                  {e.performance ?? 0}%
                </Badge>
              </div>

              <div className="mt-4 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 rounded-full"
                  style={{ width: `${e.performance ?? 0}%` }}
                />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500 mb-1">AI Feedback</p>
                <p className="text-sm text-slate-700">
                  {generateAIFeedback(e.performance ?? 0)}
                </p>
              </div>

              {editingId === e.id ? (
                <div className="mt-4 flex gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(event) => setScore(Number(event.target.value))}
                    className="rounded-2xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-200"
                  />

                  <Button onClick={updatePerformance} className="rounded-xl">
                    Save
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setEditingId(null)}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => startEditPerformance(e)}
                  >
                    Edit Score
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Placeholder({ title, subtitle }) {
  return (
    <div>
      <SectionTitle title={title} subtitle={subtitle} />
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-8 text-center">
          <BrainCircuit className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">Module ready for development</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">This section will connect to backend APIs, role permissions, audit logs, and AI services in the next development phase.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi, I’m CONVERA AI Assistant powered by Gemini. Ask me about employees, performance, recruitment, leave, or HR recommendations.",
    },
  ]);

  const [input, setInput] = useState("");
  const [employeesData, setEmployeesData] = useState<any[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    fetchEmployeesForAI();
  }, []);

  const fetchEmployeesForAI = async () => {
    const { data, error } = await supabase.from("employees").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setEmployeesData(data || []);
  };

  const buildHRContext = () => {
    const totalEmployees = employeesData.length;

    const avgPerformance =
      totalEmployees > 0
        ? Math.round(
            employeesData.reduce(
              (sum, e) => sum + Number(e.performance ?? 0),
              0
            ) / totalEmployees
          )
        : 0;

    const employeeSummary = employeesData
      .map(
        (e) =>
          `- ${e.first_name} ${e.last_name}, Position: ${e.position}, Department: ${e.department}, Status: ${e.status}, Leave Balance: ${e.leave_balance}, Performance: ${e.performance}%`
      )
      .join("\n");

    const candidateSummary = candidates
      .map(
        (c) =>
          `- ${c.name}, Position: ${c.position}, Source: ${c.source}, Fit Score: ${c.fit}%, Stage: ${c.stage}, Skills: ${c.skills?.join(", ")}`
      )
      .join("\n");

    return `
You are CONVERA AI Assistant, an HR assistant for Convergent Interfreight Co., Ltd.
You help HR teams analyze workforce data, employee performance, leave, recruitment, training needs, and HR recommendations.

Rules:
- Answer in the same language as the user.
- Be concise but useful.
- Use only the data provided below when discussing employees or candidates.
- If data is missing, say that the data is not available.
- Do not make final HR decisions. Provide recommendations for HR review.

Company context:
Convergent Interfreight Co., Ltd. is a logistics/freight forwarding company. Relevant HR skills may include freight coordination, customs clearance, import/export documentation, SAP, Excel, communication, operations, and document control.

Workforce summary:
- Total employees: ${totalEmployees}
- Average performance: ${avgPerformance}%

Employees:
${employeeSummary || "No employee data available."}

Recruitment candidates:
${candidateSummary || "No candidate data available."}
`;
  };

  const send = async () => {
    if (!input.trim() || isThinking) return;

    const userText = input.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
      { role: "ai", text: "Thinking..." },
    ]);

    setIsThinking(true);

    try {
      const prompt = `
${buildHRContext()}

User question:
${userText}
`;

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      const aiReply =
        data?.reply || "Sorry, I could not generate a response right now.";

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "ai", text: aiReply },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "ai",
          text: "AI request failed. Please check the API route and Gemini API key.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div>
      <SectionTitle
        title="CONVERA AI Assistant"
        subtitle="Ask questions about workforce, recruitment, leave, performance, and HR recommendations."
      />

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            <div className="xl:col-span-3">
              <div className="h-[420px] overflow-y-auto space-y-3 rounded-2xl bg-slate-50 p-4">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
                        m.role === "user"
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-700 border"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask AI, e.g. ใคร performance ต่ำกว่า 80..."
                  className="flex-1 rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
                  disabled={isThinking}
                />

                <Button
                  onClick={send}
                  className="rounded-2xl px-6"
                  disabled={isThinking}
                >
                  {isThinking ? "Thinking..." : "Send"}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <h3 className="font-semibold text-slate-900 mb-3">
                Suggested Prompts
              </h3>

              <div className="space-y-2">
                {[
                  "สรุปพนักงานทั้งหมด",
                  "ใคร performance ต่ำกว่า 80",
                  "ใคร performance สูงสุด",
                  "แนะนำ training ให้ทีม",
                  "candidate คนไหน fit สูงสุด",
                  "มี risk อะไรบ้าง",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="w-full text-left rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PeopleFlowAI() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const page = {
    dashboard: <Dashboard />,
    employees: <Employees />,
    recruitment: <Recruitment />,
    leave: <Leave />,
    performance: <Performance />,
    learning: <Placeholder title="Learning & Development" subtitle="Training catalog, learning paths, certification tracking, and AI course recommendations." />,
    ai: <AIAssistant />,
    security: <Placeholder title="Access Control" subtitle="Role-based permissions, audit logs, approval scopes, and secure HR data governance." />,
  }[active];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex">
        <aside className={`${collapsed ? "w-20" : "w-72"} min-h-screen bg-white border-r transition-all duration-300 hidden md:block`}>
          <div className="p-5 flex items-center justify-between">
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold">CONVERA</h1>
                <p className="text-xs text-slate-500">AI Workforce & Talent Platform</p>
              </div>
            )}
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setCollapsed(!collapsed)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
          <nav className="px-3 space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const selected = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition ${selected ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
          <div className="absolute bottom-4 px-3 w-72">
            <button className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500 hover:text-slate-900">
              <LogOut className="w-5 h-5" /> {!collapsed && "Logout"}
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="h-20 bg-white border-b flex items-center justify-between px-5 md:px-8 sticky top-0 z-10">
            <div>
              <p className="text-xs text-slate-500">MVP Prototype</p>
              <h2 className="text-lg font-semibold">CONVERA Workforce Platform</h2>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-2xl hidden sm:flex"><BrainCircuit className="w-4 h-4 mr-2" />Ask AI</Button>
              <Button variant="ghost" size="icon" className="rounded-2xl"><Bell className="w-5 h-5" /></Button>
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-semibold">HR</div>
            </div>
          </header>

          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-5 md:p-8"
          >
            {page}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
