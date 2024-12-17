// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cr");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Récupérer les valeurs des champs
    const lieu = document.getElementById("lieu").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const heureDebut = document.getElementById("horaire-debut").value;
    const heureFin = document.getElementById("horaire-fin").value;
    const techniciens = document.getElementById("techniciens").value;

    const duree = calculerDuree(heureDebut, heureFin);

    // Générer le PDF avec la mise en page
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

  // Fonction pour calculer la durée
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

  // Fonction pour générer le PDF avec la mise en page
  function genererPDF(lieu, description, date, debut, fin, duree, techniciens) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Définir les marges et l'espacement
    const startX = 20;
    let startY = 20;

    // En-tête
    pdf.setFontSize(16);
    pdf.text("BON D'INTERVENTION", startX, startY);

    startY += 10;

    pdf.setFontSize(12);
    pdf.text(`Lieu d'intervention : ${lieu}`, startX, startY);
    startY += 10;

    pdf.text("Description des travaux effectués :", startX, startY);
    startY += 5;

    // Ajouter des blocs de texte pour la description (multiligne)
    const descriptionLines = pdf.splitTextToSize(description, 170);
    pdf.text(descriptionLines, startX, startY);
    startY += descriptionLines.length * 7;

    pdf.text(`Date d'intervention : ${date}`, startX, startY);
    startY += 10;

    pdf.text(
      `Heure de début : ${debut}   Heure de fin : ${fin}   Durée : ${duree}`,
      startX,
      startY
    );
    startY += 10;

    pdf.text(`Noms des techniciens : ${techniciens}`, startX, startY);
    startY += 20;

    // Ligne pour signatures
    pdf.text("Signature du représentant de l'entreprise :", startX, startY);
    pdf.text("Signature agent EDF :", startX + 120, startY);
    startY += 20;

    pdf.line(startX, startY, startX + 80, startY); // Ligne de gauche
    pdf.line(startX + 120, startY, startX + 200, startY); // Ligne de droite

    // Sauvegarder le PDF
    pdf.save("bon_intervention.pdf");
  }
});
