let tableauAffichage = document.createElement("table");//ce seras le tableau dans lequel j'afficherai les différents résultat.
let thead = document.createElement('thead');
let tbody = document.createElement('tbody');

let hrow = document.createElement('tr');
        
let heading_1 = document.createElement('th');
heading_1.innerText = "Nom du cours d'eau mesuré";

let heading_2 = document.createElement('th');
heading_2.innerText = "température de l'eau en °C";

let heading_3 = document.createElement('th');
heading_3.innerText = "date de la mesure";

//mettre heading 4 ici pour graph si le temps

hrow.appendChild(heading_1);
hrow.appendChild(heading_2);
hrow.appendChild(heading_3);

thead.appendChild(hrow);

function RechercheAPI(departement){
    
    //console.log("le departement ancien est " + departement);
    var child = tbody.lastElementChild;
    while(child){
        tbody.removeChild(child);
        child = tbody.lastElementChild;
    }
    
    if(departement > 99999 || departement < 0){    //là l'utilisateur a tenté de casser le système ou a fait une fautes de frape
        departement = 33;
    }
    //console.log("le departement actuel est " + departement);
    fetch("https://hubeau.eaufrance.fr/api/v1/temperature/station?code_departement="+departement)
    .then(reponse => reponse.json())
    .then(IDStation => {
        //console.log(IDStation);   //DEBUG //a ce moment les températures ne sont pas dispo mais on a les id des différentes stations qui nous intéréssent stocké dans reponseLisible
        
        const max = IDStation.count;    //je calcul le max si jamais on souhaite réutiliser cette page sur une autre page
        //si le nb de station est stocké dans une const c'est parce que je ne veux pas refaire le calcul a chaque tour de boucle dans mon for
        for (let i = 0; i < max; i++) {
            let row = document.createElement("tr"); //A ce moment je dois ajouter la ligne pour afficher les futur résultats qui reste a récupérer
            fetch("https://hubeau.eaufrance.fr/api/v1/temperature/chronique?code_station="+IDStation.data[i].code_station)
            .then(reponseStation => reponseStation.json())
            .then(reponseStationLisible => {//console.log(reponseStationLisible.data);    //DEBUG
                //a ce moment je dois ajoutes les différentes collones a ma ligne sur le tableau pour afficher les résultats
                let NomActuel = document.createElement("td");
                NomActuel.innerText = IDStation.data[i].libelle_station;
                let TemperatureMesuree = document.createElement("td");
                TemperatureMesuree.innerText = (reponseStationLisible.data[0].resultat).toFixed(2);
                let DateDeMesure = document.createElement("td");
                DateDeMesure.innerText = reponseStationLisible.data[0].date_mesure_temp+" à "+ reponseStationLisible.data[0].heure_mesure_temp;

                row.appendChild(NomActuel);
                row.appendChild(TemperatureMesuree)
                row.appendChild(DateDeMesure)
            });       //a cette ligne on a le fichier JSON dans reponseLisibleStation qui contiens les info que l'on souhaite ainsi que toutes les anciennes mesures.
            tbody.appendChild(row); //a cette ligne je dois mettre toutes les infos de ma colone dans le tableau
        }
        tableauAffichage.appendChild(thead);
        tableauAffichage.appendChild(tbody);
        document.getElementById("output").appendChild(tableauAffichage);
    })
}
const bouton = document.querySelector('button');

bouton.addEventListener('click', event => {
    var inputValue = document.getElementById("recherchePrecise").value;
    //alert(inputValue);    //DEBUG
    //console.log("ce qui est écrit dans mon input est "+inputValue);   //DEBUG
    if(!Number.isInteger(inputValue)){ //SI l'utilisateur tente des truc faut tenter de le ratraper
        inputValue = parseInt(inputValue,10)  //la ya moyen que le rattrapage foire mais sinon ya aucune chance 
        if(inputValue === NaN){    //si l'utilisateur met n'importe quoi il faut le gérer
            inputValue = 33;
        }
    }
    RechercheAPI(inputValue)
  });
RechercheAPI(33);   //C la 
   
