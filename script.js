// script.js

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

    console.log("Lieu d'intervention :", lieu);
    console.log("Description des travaux :", description);
    console.log("Date :", date);
    console.log("Heure de début :", heureDebut);
    console.log("Heure de fin :", heureFin);
    console.log("Durée :", duree);
    console.log("Nom des techniciens :", techniciens);
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
});
