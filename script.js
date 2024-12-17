document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cr");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Récupération des valeurs des champs
    const lieu = document.getElementById("lieu").value;
    const date = document.getElementById("date").value;
    const chantier = document.getElementById("chantier").value;
    const centrale = document.getElementById("centrale").value;
    const entreprise = document.getElementById("entreprise").value;
    const description = document.getElementById("description").value;
    const techniciens = document.getElementById("techniciens").value;
    const heureDebut = document.getElementById("horaire-debut").value;
    const heureFin = document.getElementById("horaire-fin").value;

    const duree = calculerDuree(heureDebut, heureFin);

    // Appel pour générer le PDF
    genererPDF(
      lieu,
      date,
      chantier,
      centrale,
      entreprise,
      description,
      techniciens,
      heureDebut,
      heureFin,
      duree
    );
  });

  function calculerDuree(debut, fin) {
    const [hDebut, mDebut] = debut.split(":").map(Number);
    const [hFin, mFin] = fin.split(":").map(Number);

    const debutMinutes = hDebut * 60 + mDebut;
    const finMinutes = hFin * 60 + mFin;

    const dureeMinutes = finMinutes - debutMinutes;
    const heures = Math.floor(dureeMinutes / 60);
    const minutes = dureeMinutes % 60;

    return `${heures}h ${minutes}min`;
  }

  function genererPDF(
    lieu,
    date,
    chantier,
    centrale,
    entreprise,
    description,
    techniciens,
    debut,
    fin,
    duree
  ) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text("BON D'INTERVENTION", 105, 20, { align: "center" });

    pdf.setFontSize(12);

    const leftX = 20;
    const rightX = 120;
    let y = 30;

    // Première section : Deux à gauche, deux à droite
    pdf.text("Lieu d'intervention :", leftX, y);
    pdf.text(lieu, leftX + 50, y);

    pdf.text("Date :", rightX, y);
    pdf.text(date, rightX + 30, y);

    y += 10;

    pdf.text("Nom du chantier :", leftX, y);
    pdf.text(chantier, leftX + 50, y);

    pdf.text("Nom de la centrale :", rightX, y);
    pdf.text(centrale, rightX + 50, y);

    y += 10;

    pdf.text("Nom de l'entreprise :", leftX, y);
    pdf.text(entreprise, leftX + 50, y);

    y += 10;

    // Description
    pdf.text("Description des travaux effectués :", leftX, y);
    const descLines = pdf.splitTextToSize(description, 170);
    pdf.text(descLines, leftX, y + 5);

    y += descLines.length * 7 + 10;

    // Techniciens, heure début, heure fin, durée
    pdf.text("Noms des techniciens :", leftX, y);
    pdf.text(techniciens, leftX + 50, y);

    pdf.text("Heure de début :", rightX, y);
    pdf.text(debut, rightX + 40, y);

    y += 10;

    pdf.text("Heure de fin :", rightX, y);
    pdf.text(fin, rightX + 40, y);

    pdf.text("Durée :", leftX, y);
    pdf.text(duree, leftX + 50, y);

    y += 20;

    // Tableau des pièces fournies
    pdf.autoTable({
      startY: y,
      head: [["Fabricant", "Désignation", "Quantité"]],
      body: [],
      theme: "grid",
    });

    // Signatures
    const signatureY = pdf.lastAutoTable.finalY + 20;
    pdf.text("Signature du représentant de l'entreprise :", leftX, signatureY);
    pdf.line(leftX, signatureY + 5, leftX + 80, signatureY + 5);

    pdf.text("Signature agent EDF :", rightX, signatureY);
    pdf.line(rightX, signatureY + 5, rightX + 80, signatureY + 5);

    // Sauvegarde
    pdf.save("bon_intervention.pdf");
  }
});
