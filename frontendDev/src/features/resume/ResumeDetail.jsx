import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchResumeById, deleteResume, updateResume } from "./resumeSlice";
import { format } from "date-fns";
import { getAISummary, getAIProject } from "../../api/aiApi";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Briefcase, GraduationCap, Award, FileText } from "lucide-react";


function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentResume, loading } = useSelector((state) => state.resumes);

  const [localResume, setLocalResume] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [loadingProjects, setLoadingProjects] = useState([]);
  const [aiProjects, setAiProjects] = useState([]);

  useEffect(() => {
    dispatch(fetchResumeById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentResume) {
      setLocalResume(currentResume);
      if (currentResume.sections?.projects) {
        setAiProjects(Array(currentResume.sections.projects.length).fill(""));
        setLoadingProjects(Array(currentResume.sections.projects.length).fill(false));
      }
    }
  }, [currentResume]);

  const handleDelete = async () => {
    await dispatch(deleteResume(id));
    setShowConfirm(false);
    navigate("/resumes");
  };

  // ===== AI Summary =====
  const fetchAISummary = async () => {
    setLoadingSummary(true);
    try {
      const data = await getAISummary(localResume.sections.summary);
      if (data.success) setAiSummary(data.suggestion);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const acceptAISummary = () => {
    const updated = {
      ...localResume,
      sections: { ...localResume.sections, summary: aiSummary },
    };
    setLocalResume(updated);
    dispatch(updateResume({ resumeId: id, data: updated }));
    setAiSummary("");
  };

  // ===== AI Project =====
  const fetchAIProject = async (idx) => {
    const tempLoading = [...loadingProjects];
    tempLoading[idx] = true;
    setLoadingProjects(tempLoading);
    try {
      const data = await getAIProject(localResume.sections.projects[idx].description);
      if (data.success) {
        const tempProjects = [...aiProjects];
        tempProjects[idx] = data.suggestion;
        setAiProjects(tempProjects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      const tempLoadingFinish = [...loadingProjects];
      tempLoadingFinish[idx] = false;
      setLoadingProjects(tempLoadingFinish);
    }
  };

  const acceptAIProject = (idx) => {
    const updatedProjects = [...localResume.sections.projects];
    updatedProjects[idx] = {
      ...updatedProjects[idx],
      description: aiProjects[idx],
    };
    const updated = {
      ...localResume,
      sections: { ...localResume.sections, projects: updatedProjects },
    };
    setLocalResume(updated);
    dispatch(updateResume({ resumeId: id, data: updated }));
    const temp = [...aiProjects];
    temp[idx] = "";
    setAiProjects(temp);
  };


  if (loading || !localResume) {
    return <p className="text-center mt-10 text-gray-500">Loading resume...</p>;
  }

  const { title, sections } = localResume;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-10 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">{title}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/resumes")}
            className="px-4 py-2 rounded-full bg-gray-200 hover:bg-emerald-600 hover:text-white text-gray-800 font-medium transition cursor-pointer"
          >
            ← Back
          </button>
          <button
            onClick={() => navigate(`/resumes/${id}/edit`)}
            className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-sm transition cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure?</h2>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. Your resume will be permanently deleted.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-emerald-600 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Summary Section */}
      {sections.summary && (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
            <FileText className="w-6 h-6 text-emerald-600" /> Summary
          </h2>
          <p className="text-gray-600 leading-relaxed">{sections.summary}</p>

          <button
            onClick={fetchAISummary}
            disabled={loadingSummary}
            className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md hover:scale-105 transition cursor-pointer"
          >
            {loadingSummary ? "Generating..." : "✨ Get AI Suggestion"}
          </button>

          <AnimatePresence>
            {aiSummary && (
              <motion.div
                key="suggestion"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 1 }}
                className="mt-4 p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-lg shadow-sm"
              >
                <p className="text-black italic">{aiSummary}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={acceptAISummary}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setAiSummary("")}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}

      {/* Projects Section */}
      {sections.projects?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
            <Briefcase className="w-6 h-6 text-emerald-600" /> Projects
            
          </h2>
          <div className="space-y-5">
            {sections.projects.map((proj, idx) => (
              <motion.div
                key={idx}
                className="p-5 rounded-xl bg-gray-50 border hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-2xl font-bold text-gray-800">{proj.name}</h3>
                    <button
                      onClick={() => fetchAIProject(idx)}
                      disabled={loadingProjects[idx]}
                      className="mt-3 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md hover:scale-105 transition cursor-pointer"
                    >
                      {loadingProjects[idx] ? "Generating..." : "✨ Get AI Suggestion"}
                    </button>
                </div>
                <p className="text-gray-600">{proj.description}</p>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-500 hover:underline text-sm"
                  >
                    {proj.link}
                  </a>
                )}
                {aiProjects[idx] && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-lg"
                  >
                    <p className="text-black italic">{aiProjects[idx]}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => acceptAIProject(idx)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          const temp = [...aiProjects];
                          temp[idx] = "";
                          setAiProjects(temp);
                        }}
                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Education */}
      {sections.education?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
            <GraduationCap className="w-6 h-6 text-emerald-600" /> Education
          </h2>
          <div className="space-y-4">
            {sections.education.map((edu, idx) => (
              <div key={idx} className="p-5 rounded-lg bg-gray-50 border">
                <div className="flex justify-between">
                  <div className="font-bold text-xl">{edu.degree}</div>
                  <div className="italic text-gray-700">- {edu.school}</div>
                </div>
                <p className="text-sm text-gray-500">
                  {format(new Date(edu.startDate), "do MMMM, yyyy")} -{" "}
                  {format(new Date(edu.endDate), "do MMMM, yyyy")}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Experience */}
      {sections.experience?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
            <Award className="w-6 h-6 text-emerald-600" /> Experience
          </h2>
          <div className="space-y-4">
            {sections.experience.map((exp, idx) => (
              <div key={idx} className="p-5 rounded-lg bg-gray-50 border">
                <div className="flex justify-between">
                  <div className="font-bold text-xl">{exp.position}</div>
                  <div className="italic text-gray-700">- {exp.company}</div>
                </div>
                <p className="text-sm text-gray-500">
                  {format(new Date(exp.startDate), "do MMMM, yyyy")} -{" "}
                  {format(new Date(exp.endDate), "do MMMM, yyyy")}
                </p>
                <p className="mt-2 text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Skills */}
      {sections.skills?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
            <BookOpen className="w-6 h-6 text-emerald-600" /> Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {sections.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-4 py-1 bg-emerald-600 text-white rounded-full text-sm shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}

export default ResumeDetail;


// import React, { useEffect, useState,useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchResumeById, deleteResume, updateResume } from "./resumeSlice";
// import { format } from "date-fns";
// import { getAISummary, getAIProject } from "../../api/aiApi";
// import { motion, AnimatePresence } from "framer-motion";
// import { BookOpen, Briefcase, GraduationCap, Award, FileText } from "lucide-react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { useReactToPrint } from "react-to-print";

// function ResumeDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { currentResume, loading } = useSelector((state) => state.resumes);

//   const [localResume, setLocalResume] = useState(null);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const [loadingSummary, setLoadingSummary] = useState(false);
//   const [aiSummary, setAiSummary] = useState("");
//   const [loadingProjects, setLoadingProjects] = useState([]);
//   const [aiProjects, setAiProjects] = useState([]);
//   const resumeRef = useRef();

//   const handlePrint = useReactToPrint({
//     content: () => resumeRef.current,
//   });

//   // Loader for export
//   const [exporting, setExporting] = useState(false);

//   useEffect(() => {
//     dispatch(fetchResumeById(id));
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (currentResume) {
//       setLocalResume(currentResume);
//       if (currentResume.sections?.projects) {
//         setAiProjects(Array(currentResume.sections.projects.length).fill(""));
//         setLoadingProjects(Array(currentResume.sections.projects.length).fill(false));
//       }
//     }
//   }, [currentResume]);

//   const handleDelete = async () => {
//     await dispatch(deleteResume(id));
//     setShowConfirm(false);
//     navigate("/resumes");
//   };

//   // ===== AI Summary =====
//   const fetchAISummary = async () => {
//     setLoadingSummary(true);
//     try {
//       const data = await getAISummary(localResume.sections.summary);
//       if (data.success) setAiSummary(data.suggestion);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoadingSummary(false);
//     }
//   };

//   const acceptAISummary = () => {
//     const updated = {
//       ...localResume,
//       sections: { ...localResume.sections, summary: aiSummary },
//     };
//     setLocalResume(updated);
//     dispatch(updateResume({ resumeId: id, data: updated }));
//     setAiSummary("");
//   };

//   // ===== AI Project =====
//   const fetchAIProject = async (idx) => {
//     const tempLoading = [...loadingProjects];
//     tempLoading[idx] = true;
//     setLoadingProjects(tempLoading);
//     try {
//       const data = await getAIProject(localResume.sections.projects[idx].description);
//       if (data.success) {
//         const tempProjects = [...aiProjects];
//         tempProjects[idx] = data.suggestion;
//         setAiProjects(tempProjects);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       const tempLoadingFinish = [...loadingProjects];
//       tempLoadingFinish[idx] = false;
//       setLoadingProjects(tempLoadingFinish);
//     }
//   };

//   const acceptAIProject = (idx) => {
//     const updatedProjects = [...localResume.sections.projects];
//     updatedProjects[idx] = {
//       ...updatedProjects[idx],
//       description: aiProjects[idx],
//     };
//     const updated = {
//       ...localResume,
//       sections: { ...localResume.sections, projects: updatedProjects },
//     };
//     setLocalResume(updated);
//     dispatch(updateResume({ resumeId: id, data: updated }));
//     const temp = [...aiProjects];
//     temp[idx] = "";
//     setAiProjects(temp);
//   };

//   // ===== PDF Export with fade-in loader =====
//  // ===== PDF Export with fade-in loader =====
// const handleDownloadPDF = async () => {
//   const resumeElement = document.getElementById("resume-content");
//   if (!resumeElement) return;

//   setExporting(true);

//   const hiddenElements = resumeElement.querySelectorAll(
//     "button, .ai-suggestion, textarea, .editable-section"
//   );
//   hiddenElements.forEach((el) => (el.style.display = "none"));

//   try {
//     await new Promise((res) => setTimeout(res, 300)); // allow layout to settle

//     const canvas = await html2canvas(resumeElement, {
//       scale: 2,
//       // Add this line to fix the oklch error
//       backgroundColor: '#ffffff', 
//     });

//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//     let heightLeft = pdfHeight;
//     let position = 0;

//     pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
//     heightLeft -= pdf.internal.pageSize.getHeight();

//     while (heightLeft > 0) {
//       position = heightLeft - pdfHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
//       heightLeft -= pdf.internal.pageSize.getHeight();
//     }

//     pdf.save(`${localResume.title || "resume"}.pdf`);

//   } catch (error) {
//     console.error("Error generating PDF:", error);
//   } finally {
//     hiddenElements.forEach((el) => (el.style.display = ""));
//     setExporting(false);
//   }
// };

//   if (loading || !localResume) {
//     return <p className="text-center mt-10 text-gray-500">Loading resume...</p>;
//   }

//   const { title, sections } = localResume;

//   return (
//     <div className="relative max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-10 border border-gray-100">
//       {/* Export Loader */}
//       <AnimatePresence>
//         {exporting && (
//           <motion.div
//             className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white px-8 py-6 rounded-2xl shadow-lg border border-emerald-200 text-center"
//             >
//               <div className="w-10 h-10 border-4 border-emerald-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
//               <p className="text-gray-700 font-medium">Exporting PDF...</p>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-4xl font-extrabold text-gray-800">{title}</h1>
//         <div className="flex gap-3">
//         <button
//           onClick={() => navigate("/resumes")}
//           className="px-4 py-2 rounded-full bg-gray-200 hover:bg-emerald-600 hover:text-white text-gray-800 font-medium transition cursor-pointer"
//         >
//           ← Back
//         </button>

//         <button
//           onClick={() => navigate(`/resumes/${id}/edit`)}
//           className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-sm transition cursor-pointer"
//         >
//           Edit
//         </button>

//         <button
//           onClick={handleDownloadPDF}
//           className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition cursor-pointer"
//         >
//           Download PDF
//         </button>

//         <button
//           onClick={() => setShowConfirm(true)}
//           className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm transition cursor-pointer"
//         >
//           Delete
//         </button>
//       </div>

//       </div>

//       {/* Content */}
//       <div id="resume-content">
//         {/* Summary Section */}
//         {sections.summary && (
//           <motion.section
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-10"
//           >
//             <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
//               <FileText className="w-6 h-6 text-emerald-600" /> Summary
//             </h2>
//             <p className="text-gray-600 leading-relaxed">{sections.summary}</p>

//             <button
//               onClick={fetchAISummary}
//               disabled={loadingSummary}
//               className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md hover:scale-105 transition cursor-pointer"
//             >
//               {loadingSummary ? "Generating..." : "✨ Get AI Suggestion"}
//             </button>

//             <AnimatePresence>
//               {aiSummary && (
//                 <motion.div
//                   key="suggestion"
//                   initial={{ opacity: 0, y: 12 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -12 }}
//                   transition={{ duration: 1 }}
//                   className="mt-4 p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-lg shadow-sm ai-suggestion"
//                 >
//                   <p className="text-black italic">{aiSummary}</p>
//                   <div className="flex gap-2 mt-3">
//                     <button
//                       onClick={acceptAISummary}
//                       className="px-3 py-1 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 cursor-pointer"
//                     >
//                       Accept
//                     </button>
//                     <button
//                       onClick={() => setAiSummary("")}
//                       className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 cursor-pointer"
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.section>
//         )}

//         {/* Projects Section */}
//         {sections.projects?.length > 0 && (
//           <motion.section
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-10"
//           >
//             <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
//               <Briefcase className="w-6 h-6 text-emerald-600" /> Projects
//             </h2>
//             <div className="space-y-5">
//               {sections.projects.map((proj, idx) => (
//                 <motion.div
//                   key={idx}
//                   className="p-5 rounded-xl bg-gray-50 border hover:shadow-md transition"
//                 >
//                   <div className="flex justify-between items-center mb-5">
//                     <h3 className="text-2xl font-bold text-gray-800">{proj.name}</h3>
//                     <button
//                       onClick={() => fetchAIProject(idx)}
//                       disabled={loadingProjects[idx]}
//                       className="mt-3 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md hover:scale-105 transition cursor-pointer"
//                     >
//                       {loadingProjects[idx] ? "Generating..." : "✨ Get AI Suggestion"}
//                     </button>
//                   </div>
//                   <p className="text-gray-600">{proj.description}</p>
//                   {proj.link && (
//                     <a
//                       href={proj.link}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-indigo-500 hover:underline text-sm"
//                     >
//                       {proj.link}
//                     </a>
//                   )}
//                   {aiProjects[idx] && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 8 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="mt-4 p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-lg ai-suggestion"
//                     >
//                       <p className="text-black italic">{aiProjects[idx]}</p>
//                       <div className="flex gap-2 mt-2">
//                         <button
//                           onClick={() => acceptAIProject(idx)}
//                           className="px-3 py-1 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 cursor-pointer"
//                         >
//                           Accept
//                         </button>
//                         <button
//                           onClick={() => {
//                             const temp = [...aiProjects];
//                             temp[idx] = "";
//                             setAiProjects(temp);
//                           }}
//                           className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 cursor-pointer"
//                         >
//                           Reject
//                         </button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </motion.div>
//               ))}
//             </div>
//           </motion.section>
//         )}

//         {/* Education, Experience, Skills same as before */}
//         {/* ... */}
//       </div>
//     </div>
//   );
// }

// export default ResumeDetail;
