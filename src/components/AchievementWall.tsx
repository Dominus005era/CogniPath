import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Calendar, Download, Shield, Eye, BookOpen, Clock, Trash2 } from 'lucide-react';
import { Certificate } from '../types';
import { jsPDF } from 'jspdf';

interface AchievementWallProps {
  certificates: Certificate[];
  onRemoveCertificate: (id: string) => void;
}

export default function AchievementWall({
  certificates,
  onRemoveCertificate,
}: AchievementWallProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const certModalRef = useRef<HTMLDivElement>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportPDF = (cert: Certificate) => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      // Outer gold double-line border
      doc.setDrawColor(217, 119, 6); // Amber 600
      doc.setLineWidth(1.5);
      doc.rect(10, 10, width - 20, height - 20);
      
      doc.setDrawColor(245, 158, 11); // Amber 500
      doc.setLineWidth(0.5);
      doc.rect(12, 12, width - 24, height - 24);

      // Corner decorations
      doc.setDrawColor(217, 119, 6);
      doc.setLineWidth(0.5);
      doc.line(16, 16, 36, 16);
      doc.line(16, 16, 16, 36);
      doc.line(width - 16, 16, width - 36, 16);
      doc.line(width - 16, 16, width - 16, 36);
      doc.line(16, height - 16, 36, height - 16);
      doc.line(16, height - 16, 16, height - 36);
      doc.line(width - 16, height - 16, width - 36, height - 16);
      doc.line(width - 16, height - 16, width - 16, height - 36);

      // Header 
      doc.setTextColor(180, 83, 9); // Amber 700
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('COGNIPATH KNOWLEDGE CONCORDIA', width / 2, 28, { align: 'center' });

      // Certificate title
      doc.setTextColor(31, 41, 55); // Slate 800
      doc.setFontSize(22);
      doc.text('CERTIFICATE OF COGNITIVE MASTERY', width / 2, 42, { align: 'center' });
      doc.setDrawColor(209, 213, 219); // Slate 300
      doc.setLineWidth(0.5);
      doc.line(width / 2 - 80, 48, width / 2 + 80, 48);

      // Body text
      doc.setTextColor(107, 114, 128); // Gray 500
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('This formal scroll honors the academic expedition of', width / 2, 62, { align: 'center' });

      // User Name
      doc.setTextColor(67, 56, 202); // Indigo 700
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(26);
      doc.text(cert.userName, width / 2, 78, { align: 'center' });

      // User age
      doc.setTextColor(107, 114, 128); // Gray 500
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Age: ${cert.userAge} years`, width / 2, 88, { align: 'center' });

      // Statement text
      doc.setTextColor(55, 65, 81); // Gray 700
      doc.setFontSize(11);
      doc.text('who has successfully navigated the comprehensive curriculum of', width / 2, 102, { align: 'center' });

      // Roadmap Title
      doc.setTextColor(17, 24, 39); // Gray 900
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(15);
      doc.text(`"${cert.roadmapTitle}"`, width / 2, 114, { align: 'center' });

      // Score details
      doc.setTextColor(55, 65, 81); // Gray 700
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(11);
      doc.text('and demonstrated exceptional critical reasoning, passing the final assessment with a record score of', width / 2, 128, { align: 'center' });

      const scorePct = Math.round((cert.quizScore / cert.totalQuestions) * 100);
      doc.setTextColor(4, 120, 87); // Emerald 700
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`${cert.quizScore} of ${cert.totalQuestions} Milestones Correct (${scorePct}%)`, width / 2, 138, { align: 'center' });

      // Line before signatures
      doc.setDrawColor(229, 231, 235); // Gray 200
      doc.setLineWidth(0.5);
      doc.line(30, 154, width - 30, 154);

      // Authority 1: GEMINI AI ARCHITECT
      doc.setTextColor(75, 85, 99); // Gray 600
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('GEMINI AI ARCHITECT', 60, 165, { align: 'center' });
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Ver. 3.5 Synthesis Engine', 60, 171, { align: 'center' });
      doc.setDrawColor(209, 213, 219);
      doc.setLineWidth(0.2);
      doc.line(40, 174, 80, 174);

      // Central Seal
      doc.setFillColor(245, 158, 11); // Gold color
      doc.ellipse(width / 2, 170, 10, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('SEAL', width / 2, 171, { align: 'center' });
      doc.setTextColor(217, 119, 6);
      doc.setFontSize(7);
      doc.text('GOLD EXCELLENCE', width / 2, 185, { align: 'center' });

      // Authority 2: COGNIPATH DIRECTOR
      doc.setTextColor(75, 85, 99);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('COGNIPATH DIRECTOR', width - 60, 165, { align: 'center' });
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Authorized Learning Scroll', width - 60, 171, { align: 'center' });
      doc.setDrawColor(209, 213, 219);
      doc.setLineWidth(0.2);
      doc.line(width - 80, 174, width - 40, 174);

      // Bottom footer info
      doc.setTextColor(156, 163, 175); // Gray 400
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`ID: ${cert.id}   •   CONFERRED ON ${cert.dateEarned.toUpperCase()}   •   REWARD: +${cert.expEarned} EXP`, width / 2, 196, { align: 'center' });

      const filename = `Certificate_${cert.roadmapTitle.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      doc.save(filename);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
    } catch (err) {
      console.error("PDF export failed:", err);
    }
  };

  const handleOutsideClick = (e: any) => {
    if (certModalRef.current && !certModalRef.current.contains(e.target)) {
      setSelectedCert(null);
    }
  };

  return (
    <div id="achievement_wall" className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest font-mono">
            Laurel Hall
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Achievement Wall
          </h2>
        </div>
        <div className="bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2">
          <Award size={14} /> CERTIFICATES: {certificates.length}
        </div>
      </div>

      {certificates.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm"
        >
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-600 mx-auto">
            <Award size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">
            No Credentials Conferred
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
            Your Achievement Wall is looking bare! Complete all 9 chapters of any learning roadmap and secure a passing grade on the final assessment to receive your credentials.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert, idx) => {
            const scorePct = Math.round((cert.quizScore / cert.totalQuestions) * 100);

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-stone-50 dark:bg-slate-900 border-2 border-dashed border-amber-500/40 hover:border-amber-500 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between h-[240px]"
              >
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveCertificate(cert.id);
                  }}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-red-500 hover:bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
                  title="Remove Certificate"
                >
                  <Trash2 size={14} />
                </button>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="text-amber-500" size={24} />
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase font-mono tracking-wider">
                      Academic Scroll {cert.id}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base md:text-lg text-slate-900 dark:text-white line-clamp-1">
                    {cert.roadmapTitle}
                  </h3>
                  
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <p>Recipient: <strong className="text-indigo-600 dark:text-indigo-400">{cert.userName}</strong> (Age {cert.userAge})</p>
                    <p>Score: <strong>{cert.quizScore} of {cert.totalQuestions} ({scorePct}%)</strong></p>
                    <p>EXP Awarded: <strong className="text-amber-600 dark:text-amber-400">+{cert.expEarned} EXP</strong></p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Calendar size={10} /> Conferred {cert.dateEarned}
                  </span>
                  
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold rounded-xl transition text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye size={12} />
                    <span>View Parchment</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lightbox pop-up to inspect the full classical Parchment Certificate */}
      <AnimatePresence>
        {selectedCert && (
          <div
            onClick={handleOutsideClick}
            className="fixed inset-0 bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6 z-[100] overflow-y-auto"
          >
            <motion.div
              ref={certModalRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stone-50 border-[12px] border-double border-amber-400 text-stone-900 p-8 md:p-12 rounded-2xl max-w-3xl w-full relative shadow-2xl my-auto select-none font-serif relative"
            >
              {/* Close & Export Buttons */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportPDF(selectedCert);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 hover:text-indigo-800 flex items-center gap-1.5 font-sans font-extrabold text-[10px] cursor-pointer transition uppercase"
                  title="Export PDF"
                >
                  <Download size={12} />
                  <span>{exportSuccess ? "Exported!" : "Export in PDF"}</span>
                </button>

                <button
                  onClick={() => setSelectedCert(null)}
                  className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-sans font-bold cursor-pointer transition"
                >
                  ✕
                </button>
              </div>

              <div className="absolute top-4 left-4 text-[10px] font-mono opacity-35 tracking-widest text-stone-700 uppercase">
                ID: {selectedCert.id}
              </div>

              {/* Main Content Layout */}
              <div className="flex flex-col items-center text-center space-y-6 pt-4">
                
                {/* Title Header */}
                <div className="space-y-1">
                  <span className="text-xs font-sans font-black tracking-widest text-amber-600 uppercase font-mono">
                    COGNIPATH KNOWLEDGE CONCORDIA
                  </span>
                  <h1 className="text-2xl md:text-3xl font-black tracking-wide text-stone-800 border-b-2 border-stone-300 pb-2 px-10">
                    CERTIFICATE OF COGNITIVE MASTERY
                  </h1>
                </div>

                {/* Body Statement */}
                <div className="space-y-3 max-w-xl">
                  <p className="text-xs tracking-wider uppercase text-stone-500 font-sans">
                    This formal scroll honors the academic expedition of
                  </p>
                  <p className="text-2xl md:text-3xl font-black italic text-indigo-900 underline decoration-amber-400 decoration-wavy px-6">
                    {selectedCert.userName}
                  </p>
                  <p className="text-xs text-stone-500 font-sans font-medium">
                    Age: {selectedCert.userAge} years
                  </p>
                  <p className="text-sm leading-relaxed text-stone-700 font-sans px-4">
                    who has successfully navigated the comprehensive curriculum of
                  </p>
                  <p className="text-lg font-black text-stone-800 font-sans tracking-tight">
                    "{selectedCert.roadmapTitle}"
                  </p>
                  <p className="text-sm leading-relaxed text-stone-700 font-sans">
                    and demonstrated exceptional critical reasoning, passing the final assessment with a record score of
                  </p>
                  <p className="text-xl font-black text-emerald-700 font-sans">
                    {selectedCert.quizScore} of {selectedCert.totalQuestions} Milestones Correct ({Math.round(selectedCert.quizScore / selectedCert.totalQuestions * 100)}%)
                  </p>
                </div>

                {/* Seals & Signatures Grid */}
                <div className="w-full grid grid-cols-3 items-end pt-8 font-sans">
                  {/* Left authority */}
                  <div className="text-center space-y-2 flex flex-col items-center">
                    <div className="w-24 h-0.5 bg-stone-300"></div>
                    <span className="text-[10px] font-bold text-stone-600 block uppercase font-mono">
                      GEMINI AI ARCHITECT
                    </span>
                    <span className="text-[8px] font-mono text-stone-400 tracking-wider">
                      Ver. 3.5 Synthesis
                    </span>
                  </div>

                  {/* Middle Gold Seal of Excellence */}
                  <div className="flex flex-col items-center justify-center relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 border-4 border-amber-300 shadow flex items-center justify-center relative animate-spin-slow">
                      <Shield className="text-amber-950 w-6 h-6 opacity-85" />
                    </div>
                    <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mt-2 font-mono">
                      GOLD EXCELLENCE
                    </span>
                  </div>

                  {/* Right authority */}
                  <div className="text-center space-y-2 flex flex-col items-center">
                    <div className="w-24 h-0.5 bg-stone-300"></div>
                    <span className="text-[10px] font-bold text-stone-600 block uppercase font-mono">
                      COGNIPATH DIRECTOR
                    </span>
                    <span className="text-[8px] font-mono text-stone-400 tracking-wider">
                      Authorized Blockchain signature
                    </span>
                  </div>
                </div>

                {/* Footer date earned */}
                <div className="pt-4 text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                  Conferred on {selectedCert.dateEarned} • Conferred Reward: +{selectedCert.expEarned} EXP
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
