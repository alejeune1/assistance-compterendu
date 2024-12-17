document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cr");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const lieu = document.getElementById("lieu").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const heureDebut = document.getElementById("horaire-debut").value;
    const heureFin = document.getElementById("horaire-fin").value;
    const techniciens = document.getElementById("techniciens").value;

    const duree = calculerDuree(heureDebut, heureFin);

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

    pdf.text("Compte Rendu d'Intervention", 20, 20);
    pdf.text(`Lieu d'intervention : ${lieu}`, 20, 30);
    pdf.text(`Description des travaux :`, 20, 40);
    pdf.text(`${description}`, 20, 50);
    pdf.text(`Date : ${date}`, 20, 70);
    pdf.text(`Heure de début : ${debut}`, 20, 80);
    pdf.text(`Heure de fin : ${fin}`, 20, 90);
    pdf.text(`Durée : ${duree}`, 20, 100);
    pdf.text(`Techniciens : ${techniciens}`, 20, 110);

    pdf.save("compte_rendu.pdf");
  }
});
