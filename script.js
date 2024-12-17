document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cr");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Récupérer les valeurs du formulaire
    const lieu = document.getElementById("lieu").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const heureDebut = document.getElementById("horaire-debut").value;
    const heureFin = document.getElementById("horaire-fin").value;
    const techniciens = document.getElementById("techniciens").value;

    const duree = calculerDuree(heureDebut, heureFin);

    // Générer le PDF avec tableau et colonnes
    genererPDF(
      lieu,
      description,
      date,
      heureDebut,
      heureFin,
      duree,
      techniciens
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

  function genererPDF(lieu, description, date, debut, fin, duree, techniciens) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Titre
    pdf.setFontSize(16);
    pdf.text("BON D'INTERVENTION", 105, 20, { align: "center" });

    pdf.setFontSize(12);

    // Informations principales
    pdf.text("Lieu d'intervention :", 20, 30);
    pdf.text(lieu, 70, 30);

    pdf.text("Date :", 20, 40);
    pdf.text(date, 70, 40);

    pdf.text("Description des travaux :", 20, 50);
    const descLines = pdf.splitTextToSize(description, 170);
    pdf.text(descLines, 20, 60);

    pdf.text("Noms des techniciens :", 20, 90);
    pdf.text(techniciens, 70, 90);

    pdf.text("Heure de début :", 20, 100);
    pdf.text(debut, 70, 100);

    pdf.text("Heure de fin :", 120, 100);
    pdf.text(fin, 150, 100);

    pdf.text("Durée :", 20, 110);
    pdf.text(duree, 70, 110);

    // Tableau des pièces fournies
    pdf.autoTable({
      startY: 120,
      head: [["Fabricant", "Désignation", "Quantité"]],
      body: [
        ["Exemple Fabricant", "Exemple Désignation 1", "2"],
        ["Exemple Fabricant", "Exemple Désignation 2", "5"],
        ["Exemple Fabricant", "Exemple Désignation 3", "1"],
      ],
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: "center",
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
    });

    // Espace pour les signatures
    pdf.text(
      "Signature du représentant de l'entreprise :",
      20,
      pdf.lastAutoTable.finalY + 20
    );
    pdf.line(
      20,
      pdf.lastAutoTable.finalY + 25,
      100,
      pdf.lastAutoTable.finalY + 25
    );

    pdf.text("Signature agent EDF :", 120, pdf.lastAutoTable.finalY + 20);
    pdf.line(
      120,
      pdf.lastAutoTable.finalY + 25,
      200,
      pdf.lastAutoTable.finalY + 25
    );

    // Sauvegarder le PDF
    pdf.save("bon_intervention.pdf");
  }
});
