
    document.addEventListener('DOMContentLoaded', async () => {
        let allMatches = []; // Stocker tous les matchs
        const teamFilterSelect = document.getElementById('team-filter');
        const dateFilterSelect = document.getElementById('date-filter');
        const competFilterSelect = document.getElementById('competition-filter');
         const lieuFilterSelect = document.getElementById('lieu-filter');

        async function fetchMatches() {
            try {
                const response = await fetch('matches.json');
                if (!response.ok) {
                    throw new Error('Impossible de charger les matchs');
                }
                allMatches = await response.json();
                
                 // Débogage : Afficher les matchs chargés
                console.log('Matchs chargés:', allMatches);
                
                // Générer les options de filtre d'équipe
                const uniqueTeams = [...new Set(allMatches.map(match => match.team))];
                uniqueTeams.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));

                uniqueTeams.forEach(team => {
                    const option = document.createElement('option');
                    option.value = team;
                    option.textContent = team;
                    teamFilterSelect.appendChild(option);
                });

                // Générer les options de filtre de lieu
                const uniqueLieu = [...new Set(allMatches.map(match => match.location))];
                uniqueLieu.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));

                uniqueLieu.forEach(lieu => {
                    const optionl = document.createElement('option');
                    optionl.value = lieu;
                    optionl.textContent = lieu;
                    lieuFilterSelect.appendChild(optionl);
                });
                
                // Générer les options de filtre de competitions
                const uniqueCompet = [...new Set(allMatches.map(match => match.competition))];
                uniqueCompet.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));

                uniqueCompet.forEach(competition => {
                    const optionc = document.createElement('option');
                    optionc.value = competition;
                    optionc.textContent = competition;
                    competFilterSelect.appendChild(optionc);
                });
                // Générer les options de filtre de date
                const uniqueDate = [...new Set(allMatches.map(match => match.match_date))];
                uniqueDate.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));

                uniqueDate.forEach(match_date => {
                    const optiond = document.createElement('option');
                    optiond.value = match_date;
                    optiond.textContent = match_date;
                    dateFilterSelect.appendChild(optiond);
                });

                // Afficher tous les matchs initialement
                displayMatches(allMatches);

                // Ajouter l'écouteur d'événement pour le filtrage
                teamFilterSelect.addEventListener('change', filterMatches);
                competFilterSelect.addEventListener('change', filterMatches);
                dateFilterSelect.addEventListener('change', filterMatches);
                lieuFilterSelect.addEventListener('change', filterMatches);
            } catch (error) {
                console.error('Erreur de chargement des matchs:', error);
            }
        }


function filterMatches() {
    const selectedTeam = teamFilterSelect.value;
    const selectedDate = dateFilterSelect.value;
    const selectedCompet = competFilterSelect.value;
    const selectedLieu = lieuFilterSelect.value;
    // Filtrer les matchs
    let filteredMatches = allMatches;

    // Filtre par équipe
    if (selectedTeam) {
        filteredMatches = filteredMatches.filter(match => match.team === selectedTeam);
    }
        // Filtre par lieu
    if (selectedLieu) {
        filteredMatches = filteredMatches.filter(match => match.location === selectedLieu);
    }
    // Filtre par competition
    if (selectedCompet) {
        filteredMatches = filteredMatches.filter(match => match.competition === selectedCompet);
    }

    // Filtre par date
    if (selectedDate) {
        filteredMatches = filteredMatches.filter(match => {
            // Convertir la date du match et la date sélectionnée en objets Date
            const matchDate = new Date(match.match_date);
            const filterDate = new Date(selectedDate);

            // Comparer les dates (année, mois, jour)
            return (
                matchDate.getFullYear() === filterDate.getFullYear() &&
                matchDate.getMonth() === filterDate.getMonth() &&
                matchDate.getDate() === filterDate.getDate()
            );
        });
    }

    // Afficher les matchs filtrés
    displayMatches(filteredMatches);
}

function displayMatches(matches) {
    const tableBody = document.querySelector('#matches-table tbody');
    tableBody.innerHTML = '';
    const today = new Date();

    // Filtrer uniquement les matchs à venir
    const upcomingMatches = matches.filter(match => {
        const matchDate = new Date(match.match_date);
        const dateOnly = new Date(
            matchDate.getFullYear(), 
            matchDate.getMonth(), 
            matchDate.getDate()
        );
        const todayOnly = new Date(
            today.getFullYear(), 
            today.getMonth(), 
            today.getDate()
        );

        return dateOnly >= todayOnly;
    });

    // Trier les matchs
    upcomingMatches.sort((a, b) => {
        if (a.match_date !== b.match_date) {
            return new Date(a.match_date) - new Date(b.match_date);
        } else {
            return a.time.localeCompare(b.time);
        }
    });

    upcomingMatches.forEach(match => {
        const row = document.createElement('tr');
        const matchDate = new Date(match.match_date);

        const dateOnly = new Date(
            matchDate.getFullYear(), 
            matchDate.getMonth(), 
            matchDate.getDate()
        );
        const todayNew = new Date(
            today.getFullYear(), 
            today.getMonth(), 
            today.getDate()
        );
        const todayPlus7Days = new Date(todayNew);
        todayPlus7Days.setDate(todayNew.getDate() + 7);

        row.innerHTML = `
            <td>${match.team}</td>
            <td>${match.opponent}</td>
            <td>${match.match_date}</td>
            <td>${match.time}</td>                      
            <td>${match.location == 'Domicile' ? '<i class="fas fa-house"></i>' : ''} ${match.location} ${match.location == 'Extérieur' ? '<i class="fas fa-car-side"></i>' : ''}</td>
            <td>${match.resultat == 'Gagné' ? '<i class="fa-solid fa-face-smile"></i>' : ''} ${match.resultat} ${match.resultat == 'Perdu' ? '<i class="fa-solid fa-face-sad-cry"></i>' : ''}</td>
            <td>${match.competition}</td>
        `;

        if (dateOnly >= todayNew && dateOnly <= todayPlus7Days) {
            row.classList.add('greened-out');
        }
        
        tableBody.appendChild(row);
    });
}
 // Lancer le chargement des matchs
        await fetchMatches();
    });
