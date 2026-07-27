import jsPDF from "jspdf";

export function exportResumePDF(markdownContent: string, filename = "resume.pdf"): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;
  let pageNum = 1;

  const lines = markdownContent.split("\n");

  function addPage() {
    doc.addPage();
    y = margin;
    pageNum++;
  }

  function checkSpace(needed: number) {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + needed > pageHeight - margin) {
      addPage();
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      y += 4;
      continue;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      const text = trimmed.replace("### ", "");
      checkSpace(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(text, margin, y, { maxWidth: contentWidth });
      y += 8;
    } else if (trimmed.startsWith("## ")) {
      const text = trimmed.replace("## ", "");
      checkSpace(12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(text, margin, y, { maxWidth: contentWidth });
      y += 10;
    } else if (trimmed.startsWith("# ")) {
      const text = trimmed.replace("# ", "");
      checkSpace(15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(text, margin, y, { maxWidth: contentWidth });
      y += 14;
    }
    // Bullet lists
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const text = trimmed.replace(/^[-*] /, "• ");
      checkSpace(6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(text, margin + 4, y, { maxWidth: contentWidth - 4 });
      y += 5;
    }
    // Bold text
    else if (trimmed.startsWith("**") && trimmed.includes(":**")) {
      checkSpace(6);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(trimmed, margin, y, { maxWidth: contentWidth });
      y += 6;
    }
    // Separators
    else if (trimmed === "---" || trimmed === "***") {
      y += 2;
      doc.setDrawColor(200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 4;
    }
    // Normal text
    else {
      checkSpace(6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(trimmed, margin, y, { maxWidth: contentWidth });
      y += 5.5;
    }
  }

  doc.save(filename);
}
