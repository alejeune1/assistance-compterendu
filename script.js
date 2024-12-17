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

    // Générer le PDF
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

    // TITRE
    pdf.setFontSize(16);
    pdf.text("BON D'INTERVENTION", 105, 20, { align: "center" });

    pdf.setFontSize(12);

    // LIEU D'INTERVENTION
    pdf.text("Lieu d'intervention :", 20, 30);
    pdf.text(lieu, 80, 30);

    // DESCRIPTION DES TRAVAUX
    pdf.text("Description des travaux effectués :", 20, 40);
    const descLines = pdf.splitTextToSize(description, 160);
    pdf.text(descLines, 20, 50);

    // DATE ET HORAIRES
    pdf.text("Date :", 20, 80);
    pdf.text(date, 40, 80);

    pdf.text("Heure de début :", 20, 90);
    pdf.text(debut, 60, 90);

    pdf.text("Heure de fin :", 100, 90);
    pdf.text(fin, 130, 90);

    pdf.text("Durée :", 150, 90);
    pdf.text(duree, 170, 90);

    // NOMS TECHNICIENS
    pdf.text("Noms des techniciens :", 20, 100);
    pdf.text(techniciens, 80, 100);

    // SIGNATURES
    pdf.text("Signature du représentant de l'entreprise :", 20, 140);
    pdf.line(20, 145, 100, 145);

    pdf.text("Signature agent EDF :", 120, 140);
    pdf.line(120, 145, 200, 145);

    // SAUVEGARDE DU PDF
    pdf.save("bon_intervention.pdf");
  }
});
