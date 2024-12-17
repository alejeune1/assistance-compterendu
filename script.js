// script.js

// Attendre que le DOM soit complètement chargé
document.addEventListener("DOMContentLoaded", () => {
  // Sélectionner le formulaire
  const form = document.getElementById("form-cr");

  // Ajouter un écouteur d'événements pour la soumission du formulaire
  form.addEventListener("submit", (event) => {
    // Empêcher le rechargement de la page
    event.preventDefault();

    // Récupérer les valeurs des champs du formulaire
    const lieu = document.getElementById("lieu").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const heureDebut = document.getElementById("horaire-debut").value;
    const heureFin = document.getElementById("horaire-fin").value;
    const techniciens = document.getElementById("techniciens").value;

    // Calculer la durée (optionnel pour le moment)
    const duree = calculerDuree(heureDebut, heureFin);

    // Afficher les valeurs dans la console pour vérifier
    console.log("Lieu d'intervention :", lieu);
    console.log("Description des travaux :", description);
    console.log("Date :", date);
    console.log("Heure de début :", heureDebut);
    console.log("Heure de fin :", heureFin);
    console.log("Durée :", duree);
    console.log("Nom des techniciens :", techniciens);

    // Ajouter ici d'autres actions (comme sauvegarder les données)
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
});
