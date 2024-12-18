document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cr");

  // Ajout de l'événement pour la prévisualisation des images
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

  // Initialisation des canvases pour les signatures (fonctionnalité PC et mobile)
  const canvasRepresentant = setupSignatureCanvas(
    "signature-representant-canvas",
    "clear-representant"
  );
  const canvasAgent = setupSignatureCanvas(
    "signature-agent-canvas",
    "clear-agent"
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();

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
    const photoInput = document.getElementById("photos");
    const photos = Array.from(photoInput.files);

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

  function setupSignatureCanvas(canvasId, clearButtonId) {
    const canvas = document.getElementById(canvasId);
    const context = canvas.getContext("2d");
    let isDrawing = false;

    // Récupération de la position relative
    function getPosition(event) {
      const rect = canvas.getBoundingClientRect();
      if (event.touches) {
        // Gestion des touch events
        return {
          x: event.touches[0].clientX - rect.left,
          y: event.touches[0].clientY - rect.top,
        };
      } else {
        // Gestion des mouse events
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      }
    }

    // Début du dessin
    function startDrawing(event) {
      isDrawing = true;
      const pos = getPosition(event);
      context.beginPath();
      context.moveTo(pos.x, pos.y);
    }

    // Dessiner
    function draw(event) {
      if (!isDrawing) return;
      const pos = getPosition(event);
      context.lineTo(pos.x, pos.y);
      context.stroke();
    }

    // Fin du dessin
    function stopDrawing() {
      isDrawing = false;
      context.closePath();
    }

    // Gestion des événements pour la souris
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);

    // Gestion des événements tactiles
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startDrawing(e);
    });
    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      draw(e);
    });
    canvas.addEventListener("touchend", (e) => {
      e.preventDefault();
      stopDrawing(e);
    });

    // Bouton pour effacer le canvas
    document.getElementById(clearButtonId).addEventListener("click", () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    });

    return canvas;
  }

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

    // Informations principales
    pdf.text("Date :", leftX, y);
    pdf.text(date, leftX + 50, y);

    y += 10;
    pdf.text("Nom du Chantier :", leftX, y);
    pdf.text(chantier, leftX + 50, y);

    y += 10;
    pdf.text("Description des Travaux Effectués :", leftX, y);
    const descLines = pdf.splitTextToSize(description, 170);
    pdf.text(descLines, leftX, y + 5);

    y += descLines.length * 7 + 10;

    // Désignations des pièces fournies
    pdf.autoTable({
      startY: y,
      head: [["Fabricant", "Désignation", "Quantité"]],
      body: pieces.map((p) => [p.fabricant, p.designation, p.quantite]),
      theme: "grid",
    });

    y = pdf.lastAutoTable.finalY + 10;

    // Temps d'intervention
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

    // Commentaires
    pdf.text("Commentaires :", leftX, y);
    const commentLines = pdf.splitTextToSize(commentaires, 170);
    pdf.text(commentLines, leftX, y + 5);

    y += commentLines.length * 7 + 10;

    // Ajout des signatures
    const signatureRepresentant = canvasRepresentant.toDataURL("image/png");
    const signatureAgent = canvasAgent.toDataURL("image/png");

    pdf.text("Signatures :", leftX, y);
    y += 10;

    pdf.text("Représentant :", leftX, y);
    pdf.addImage(signatureRepresentant, "PNG", leftX, y + 5, 80, 50);

    pdf.text("Agent EDF :", leftX + 100, y);
    pdf.addImage(signatureAgent, "PNG", leftX + 100, y + 5, 80, 50);

    y += 60;

    // Fonction pour ajouter les photos
    async function ajouterPhotos() {
      for (const photo of photos) {
        if (photo) {
          const imgData = await lireImage(photo);
          pdf.addImage(imgData, "JPEG", leftX, y, 100, 100);
          y += 110;
          if (y > 280) {
            pdf.addPage();
            y = 20;
          }
        }
      }
      pdf.save("bon_intervention.pdf");
    }

    function lireImage(photo) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(photo);
      });
    }

    if (photos.length > 0) {
      ajouterPhotos();
    } else {
      pdf.save("bon_intervention.pdf");
    }
  }
});
