document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cr");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    document.getElementById("photos").addEventListener("change", (event) => {
      const previewContainer = document.getElementById("photo-preview");
      previewContainer.innerHTML = ""; // Efface les anciennes prévisualisations

      Array.from(event.target.files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            previewContainer.appendChild(img);
          };
          reader.readAsDataURL(file);
        }
      });
    });

    // Récupération des valeurs des champs
    const date = document.getElementById("date").value;
    const chantier = document.getElementById("chantier").value;
    const centrale = document.getElementById("centrale").value;
    const entreprise = document.getElementById("entreprise").value;
    const lieu = document.getElementById("lieu").value;
    const description = document.getElementById("description").value;
    const representant = document.getElementById("representant").value;
    const agent = document.getElementById("agent").value;
    const commentaires = document.getElementById("commentaires").value;

    // Récupération des lignes de pièces
    const pieces = Array.from(document.querySelectorAll("#pieces-table tr"))
      .slice(1)
      .map((row) => {
        const cells = row.querySelectorAll("input");
        return {
          fabricant: cells[0].value,
          designation: cells[1].value,
          quantite: cells[2].value,
        };
      });

    // Récupération des lignes d'intervention
    const interventions = Array.from(
      document.querySelectorAll("#intervention-table tr")
    )
      .slice(1)
      .map((row) => {
        const cells = row.querySelectorAll("input");
        return {
          technicien: cells[0].value,
          date: cells[1].value,
          horaires: cells[2].value,
          heures: cells[3].value,
        };
      });

    // Récupération des photos
    const photos = Array.from(document.querySelectorAll(".photo-upload")).map(
      (input) => input.files[0]
    );

    // Appel pour générer le PDF
    genererPDF(
      date,
      chantier,
      centrale,
      entreprise,
      lieu,
      description,
      pieces,
      interventions,
      representant,
      agent,
      commentaires,
      photos
    );
  });

  function genererPDF(
    date,
    chantier,
    centrale,
    entreprise,
    lieu,
    description,
    pieces,
    interventions,
    representant,
    agent,
    commentaires,
    photos
  ) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text("BON D'INTERVENTION", 105, 20, { align: "center" });

    pdf.setFontSize(12);
    let y = 30;
    const leftX = 20;
    const rightX = 120;

    // Informations principales
    pdf.text("Date :", leftX, y);
    pdf.text(date, leftX + 50, y);

    pdf.text("Nom du Chantier :", rightX, y);
    pdf.text(chantier, rightX + 50, y);

    y += 10;
    pdf.text("Nom de la Centrale :", leftX, y);
    pdf.text(centrale, leftX + 50, y);

    pdf.text("Nom de l'Entreprise :", rightX, y);
    pdf.text(entreprise, rightX + 50, y);

    y += 10;
    pdf.text("Lieu d'Intervention :", leftX, y);
    pdf.text(lieu, leftX + 50, y);

    y += 10;
    pdf.text("Description des Travaux Effectués :", leftX, y);
    const descLines = pdf.splitTextToSize(description, 170);
    pdf.text(descLines, leftX, y + 5);

    y += descLines.length * 7 + 10;

    // Désignations des pièces fournies
    pdf.text("Désignations des Pièces Fournies", leftX, y);
    y += 5;
    pdf.autoTable({
      startY: y,
      head: [["Fabricant", "Désignation", "Quantité"]],
      body: pieces.map((p) => [p.fabricant, p.designation, p.quantite]),
      theme: "grid",
    });

    y = pdf.lastAutoTable.finalY + 10;

    // Temps d'intervention
    pdf.text("Temps d'Intervention", leftX, y);
    y += 5;
    pdf.autoTable({
      startY: y,
      head: [["Technicien", "Date", "Horaires", "Nombre d'Heures"]],
      body: interventions.map((i) => [
        i.technicien,
        i.date,
        i.horaires,
        i.heures,
      ]),
      theme: "grid",
    });

    y = pdf.lastAutoTable.finalY + 10;

    // Signatures
    pdf.text("Signature du Représentant de l'Entreprise :", leftX, y);
    pdf.line(leftX, y + 5, leftX + 80, y + 5);

    pdf.text("Signature Agent EDF :", rightX, y);
    pdf.line(rightX, y + 5, rightX + 80, y + 5);

    y += 15;
    pdf.text("Nom / Prénom :", leftX, y);
    pdf.text(representant, leftX + 50, y);

    pdf.text("Nom / Prénom :", rightX, y);
    pdf.text(agent, rightX + 50, y);

    y += 15;
    pdf.text("Commentaires :", leftX, y);
    const commentLines = pdf.splitTextToSize(commentaires, 170);
    pdf.text(commentLines, leftX, y + 5);

    y += commentLines.length * 7 + 10;

    // Ajout des photos
    photos.forEach((photo, index) => {
      if (photo) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imgData = e.target.result;
          pdf.addImage(imgData, "JPEG", leftX, y, 60, 40);
          y += 50;
          if (index < photos.length - 1) {
            pdf.addPage();
            y = 20;
          }
          if (index === photos.length - 1) {
            pdf.save("bon_intervention.pdf");
          }
        };
        reader.readAsDataURL(photo);
      }
    });
  }
});
