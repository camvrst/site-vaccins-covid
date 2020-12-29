import './styles.scss';
import { vaccins } from './src/data';
import { sumArray } from './src/helpers';

// RENDER

const render = () => {
  const app = document.getElementById('app');
  const h1 = document.createElement('h1');
  const header = document.createElement('header');
  const main = document.createElement('main');
  const footer = document.createElement('footer');

  // HEADER - boutons

  app.appendChild(h1);
  app.appendChild(header);
  h1.id = 'title';
  header.id = 'header';
  h1.innerHTML = 'Liste des vaccins pour le Covid-19';

  const btnPrix = document.createElement('button');
  btnPrix.id = 'classerPrix';
  btnPrix.innerHTML = 'Classer par prix';
  header.appendChild(btnPrix);

  const btnApprouve = document.createElement('button');
  btnApprouve.id = 'approuver';
  btnApprouve.innerHTML = 'Cacher les vaccins non approuvés';
  header.appendChild(btnApprouve);
  // MAIN - vaccins

  app.appendChild(main);
  main.id = 'main';

  // TRI PAR PRIX

  const vaccinsTriés = vaccins.sort((x, y) => parseFloat(x.prixUnitaire) - parseFloat(y.prixUnitaire));
  let vaccinsBis;

  btnPrix.addEventListener('click', () => {
    if (btnPrix.textContent === 'Classer par prix') {
      btnPrix.textContent = 'Annuler le classement par prix';
      vaccinsBis = vaccinsTriés;
    } else if (btnPrix.textContent === 'Annuler le classement par prix') {
      btnPrix.textContent = 'Classer par prix';
      vaccinsBis = vaccins;
    }
  });

  // AFFICHER LES VACCINS

  let allVaccinsCards = '';

  for (const vaccin of (vaccinsBis === undefined) ? vaccins : vaccinsBis) {
    const vaccinCard = `
      <div class="vaccin-card" id="${vaccin.id}">
          <div> 
            <img class="img-vaccin" src="${vaccin.imageUrl}" alt="${vaccin.nom}" /> 
          </div>
          <h3> ${vaccin.nom} </h3>
          <p> Créé par : <b>${Array.isArray(vaccin.inventeurs) ? vaccin.inventeurs.join(', ') : vaccin.inventeurs} </b></p>
          <p> Lieu(x) de production : <b>${Array.isArray(vaccin.lieuProduction) ? vaccin.lieuProduction.join(', ') : vaccin.lieuProduction} </b></p>
          <p> Technologie utilisée : <b> ${vaccin.technologie} </b></p>
          <p> Quantité: <b> ${vaccin.quantite} </b></p>
          <p> Approuvé : <b> ${vaccin.approuve} </b></p>
          <p> Prix unitaire: <b> ${vaccin.prixUnitaire} $ </b></p>
          <form action="#">
              <label for="quantite">Quantité souhaitée :</label>
              <input type="number" name="quantite" id="quantite" min="0" step="1" max="${vaccin.quantite}" />
              <button type="submit" id="ajouter-quant">Ajouter au panier</button>
          </form>      
      </div>
      `;
    allVaccinsCards += vaccinCard;
    main.innerHTML = allVaccinsCards;
  }

  // CACHER LES VACCINS NON APPROUVES

  btnApprouve.addEventListener('click', () => {
    const vaccinHtml = document.querySelectorAll('.vaccin-card');
    if (btnApprouve.textContent === 'Cacher les vaccins non approuvés') {
      for (let i = 0; i < vaccins.length; i++) {
        if (vaccins[i].approuve === 'non') {
          vaccinHtml[i].style.display = 'none';
          btnApprouve.textContent = 'Montrer tous les vaccins';
        }
      }
    } else if (btnApprouve.textContent === 'Montrer tous les vaccins') {
      for (let i = 0; i < vaccins.length; i++) {
        if (vaccins[i].approuve === 'non') {
          vaccinHtml[i].style.display = 'flex';
          btnApprouve.textContent = 'Cacher les vaccins non approuvés';
        }
      }
    }
  });

  // FOOTER

  app.appendChild(footer);
  footer.id = 'footer';

  // INPUT DE RESERVATION PAR QUANTITE DE VACCINS

  const divQuant = document.createElement('div');
  divQuant.id = 'div-commande';
  const divPrix = document.createElement('div');
  const parPrix = document.createElement('b');
  const titreFooter = document.createElement('h2');
  titreFooter.innerHTML = 'Votre panier';

  const iptVaccin = document.querySelectorAll('input#quantite');
  const btnAjouter = document.querySelectorAll('#ajouter-quant');
  let quantiteVaccins;
  const commandeTotale = [];
  let prixVaccins;
  let commande;

  footer.appendChild(divQuant);
  divQuant.appendChild(titreFooter);
  footer.appendChild(divPrix);
  divPrix.appendChild(parPrix);

  const btnCommande = document.createElement('button');
  btnCommande.id = 'btnCommande';
  btnCommande.innerHTML = 'Passer la commande';
  footer.appendChild(btnCommande);
  btnCommande.disabled = true;
  const totalPrix = [];

  // function vaccins commandés

  const vaccinsCommandés = (i) => {
    if (quantiteVaccins > 0) {
      prixVaccins = vaccins[i].prixUnitaire * quantiteVaccins;
      totalPrix.push(prixVaccins);
      commande = `
            <p> ${vaccins[i].nom} x${quantiteVaccins} : ${prixVaccins} $ </p>
          `;
      commandeTotale.push(commande);
      divQuant.innerHTML += commande;
      parPrix.innerHTML = `Prix total : ${sumArray(totalPrix)}$`;
    }
  };

  // écoute de l'input et click

  for (let i = 0; i < vaccins.length; i++) {
    btnAjouter[i].disabled = true;
    iptVaccin[i].addEventListener('input', () => {
      btnAjouter[i].disabled = false;
      if (
        iptVaccin[i].value < vaccins[i].quantite
            && iptVaccin[i].value.trim() !== '' && iptVaccin[i].value > 0
      ) {
        quantiteVaccins = parseFloat(iptVaccin[i].value);
      } else {
        quantiteVaccins = 0;
      }
    });
    btnAjouter[i].addEventListener('click', () => {
      if (quantiteVaccins > 0) {
        iptVaccin[i].style.display = 'none';
        btnAjouter[i].disabled = true;
      }
      vaccinsCommandés(i);
      btnCommande.disabled = false;
    });
  }

  const annulerCmd = document.createElement('button');
  annulerCmd.innerHTML = 'Annuler la commande';
  annulerCmd.id = 'btn-annuler';
  footer.appendChild(annulerCmd);

  annulerCmd.addEventListener('click', () => {
    /* const parCommande = document.querySelector('#div-commande > p');
    console.log(parCommande);
    parCommande.innerHTML = '';
    parPrix.innerHTML = '';
    */
    window.location.reload();
  });

  // commande passée

  const commandePopUp = document.createElement('div');
  commandePopUp.id = 'commande-popup';

  btnCommande.addEventListener('click', () => {
    commandePopUp.innerHTML = `
    <h2>
    Votre commande a bien été enregistrée. Merci ! 
    <br/>
    Résumé : 
    <br/>
    <span>${commandeTotale.join(' et ')}</span>
    <br/>
    Prix total : ${sumArray(totalPrix)} $
    </h2>
    <button id="btn-annuler"> Annuler la commande </button>
    `;
    main.innerHTML = '';
    main.appendChild(commandePopUp);
    const btnAnnuler = document.getElementById('btn-annuler');
    btnAnnuler.addEventListener('click', () => {
      window.location.reload();
    });
  });

  // STOP RELOADING

  const form = document.querySelectorAll('form');
  const button = document.querySelectorAll('button');

  for (let i = 0; i < form.length; i++) {
    form[i].addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  for (let i = 0; i < button.length; i++) {
    button[i].addEventListener('click', (e) => {
      e.preventDefault();
      e.disabled = true;
    });
  }
};

render();
